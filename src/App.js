import React,{useState,useEffect} from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Header from './Components/Header'
import Main from './Components/Main'
import styled from 'styled-components'
import moment from 'moment'
import axios from 'axios'

const Container = styled.div`
  display:flex;
  flex-direction:column;
`

const monday = mondaySdk();



const FinalReq = (details,actions,body) => {

}
// initiate
// get all the body
// create meeting 
// save all actions
// save all body

const App = () => {
  const [title,setTitle] = useState('')
  const [users,setUsers] = useState([])
  const [user,setUser] = useState({})
  const [account,setAccount] = useState('')
  const [body,setBody] = useState('')
  const [arr,setArr] = useState([])
  const [arrToRender,setRender]= useState([])
  const [boardID,setBoardID] = useState('')
  const [dateTime,setDateTime] = useState(moment().format())
  const [meetingID,setMeetingID] = useState('')

  const [columns,setColumns] = useState({
    personId:'',
    dateId:'',
    linkId:''
  })
  const finishMeetingThe = () => {
    monday.execute("notice", { 
      message:"export in process .. ",
      type: "info", // or "error" (red), or "info" (blue)
      timeout: 10000,
    });



    let group_id = ''
    monday.api(`mutation {
        create_group (board_id: ${boardID}, group_name: "${title} | ${moment(dateTime).format('DD MMM,ddd')} at ${moment(dateTime).format('HH:mm')}") {
          id
        }
      }`).then((res)=>{

    // console.log(res)
    group_id = res.data.create_group.id
    let state = {
      details :{agenda:title,timeDate:dateTime},
      actions:arrToRender,
      body:body,
      account:user
    }
    axios.put('https://api.meetee.ai/api/v1/appsversion',state).then((res)=>{
      let meetingID = res.data;
      let columnsToImport = {}
      columnsToImport[columns.linkId] = {
        "url": "http://pdf.meetee.ai/api/render?url=http://app.meetee.ai/pdf/"+meetingID,
        "text": "Download PDF"
      }
      let insert_column = JSON.stringify(columnsToImport)
      const searchRegExp = /\"/g;
      const replaceWith = '\\'+'"';
      insert_column = insert_column.replace(searchRegExp,replaceWith)
      monday.api(`mutation {
              create_item (board_id: ${boardID}, group_id: "${group_id}", item_name: "Meeting Summary PDF" , column_values:"${insert_column}") {
                id  
            }
        }`).then((resq)=>{
          console.log(resq)
        })
  
      const arrayToRun = arrToRender.reverse()
      arrayToRun.map((item,index)=>{
          let columnsToImport = {}
          if(item.user){
            columnsToImport[columns.personId] = {
              personsAndTeams:[{
                id:item.user.id 
              }]
            }
          }
          if(item.dueDate!=''){
            let dateToInsert = moment(item.dueDate).format("MM/DD/YYYY")
            columnsToImport[columns.dateId] = {
              date:dateToInsert
            }
          }
  
          let insert_column = JSON.stringify(columnsToImport)
          const searchRegExp = /\"/g;
          const replaceWith = '\\'+'"';
          insert_column = insert_column.replace(searchRegExp,replaceWith)
          monday.api(`mutation {
              create_item (board_id: ${boardID}, group_id: "${group_id}", item_name: "${item.content}",column_values:"${insert_column}") {
                id  
            }
          }`).then((resq)=>{
  
          })
      })
      var link=document.createElement("a");
      link.id = 'someLink'; //give it an ID!
      link.href=document.location.ancestorOrigins[0] + '/boards/'+boardID;
      link.target="_parent"
      link.click()
    })


    

  
    // document.getElementById('someLink').click();
      // window.location.href = window.location.href
    }).catch(err=>{
      // "Some error is accured , check connection and try again"
      console.log(err)
      monday.execute("notice", { 
        message:err,
        type: "error", // or "error" (red), or "info" (blue)
        timeout: 10000,
      });
    })

  }

  
  useEffect(()=>{
    // console.log("started")
    monday.listen("settings", (res) => {
     console.log(res)
    });
    monday.listen("context",(res)=>{
      console.log("context",res)
      setBoardID(res.data.boardId)
      //columns
      monday.api(`
        query {
          boards (ids:[${res.data.boardId}] ) {
              columns{
                  id
                  type
              }
          }
      }`).then((resp)=>{
        console.log(resp)
        if(resp){
          let newObj = {...columns}
          resp.data.boards[0].columns.map((column)=>{
            switch(column.type){
              case "date":
                  newObj.dateId = column.id
                break;
              case "multiple-person":
                  newObj.personId = column.id
                break;
              case "link":
                  newObj.linkId = column.id
                break;
              default: 
                break;
            }
          })
          if(newObj.personId == ''){
            monday.api(`
              mutation {
                create_column (board_id: ${res.data.boardId}, title: "Assigned to", column_type:people ) {
                  id
                }
              }
              `
            ).then((response)=>{
              newObj.personId = response.data.create_column.id
            })
          }
          if(newObj.linkId == ''){
            monday.api(`
            mutation {
              create_column (board_id: ${res.data.boardId}, title: "Link", column_type:link ) {
                id
              }
            }
            `
          ).then((response)=>{
            newObj.linkId = response.data.create_column.id
          })

          }
          if(newObj.dateId == ''){
            monday.api(`
            mutation {
              create_column (board_id: ${res.data.boardId}, title: "Due Date", column_type:date ) {
                id
              }
            }
            `
          ).then((response)=>{
            newObj.dateId = response.data.create_column.id
          }) 
        }
        // console.log(newObj)
        setColumns(newObj)
        }
      })
    })

    // personal details
    monday.api(`query { me { 
      name 
      email
    } }`).then((res) => {
      if(res){
        setAccount(res.data.me)
        setUser(res.data.me)
      }
    });

    //users
    monday.api(`query {users (kind: all) { 
      id 
      email
      name
      photo_original
      } 
    }`).then((res)=>{
      // console.log(res)
      if(res){
        setUsers(res.data.users)
      }
    })

},[])


  

  const FinishMeeting = () => {
      monday.execute("confirm", {
            message: "Create all the new items in the board. This can't be undone. A PDF copy of the summary will be created and attached to the meeting group.", 
            confirmButton: "Create Items", 
            cancelButton: "Cancel", 
            excludeCancelButton: false
        }).then((res) => {
            // console.log(res.data);
            // console.log(account)
  
            if(res.data.confirm){
              finishMeetingThe()
              
            }else{
              monday.execute("notice", { 
                message: "I'm a success message",
                type: "info", // or "error" (red), or "info" (blue)
                timeout: 10000,
             });
            }
            // {"confirm": true}
        });
    }

  return (
    <Container>
        <Header title={title} setTitle={setTitle} FinishMeeting={FinishMeeting}/>
        <Main body={body} setBody={setBody} user={user} setMeetingID={setMeetingID} arr={arr} setArr={setArr} arrToRender={arrToRender} setRender={setRender} users={users}/>
    </Container>
  )
}


export default App;
