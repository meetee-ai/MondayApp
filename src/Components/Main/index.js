import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import Left from './Left'
import Right from './Right'

const Container = styled.div`
    display:flex;
    justify-content:space-between;
    margin-top:1rem;
`
const Main = ({resources,user,body,setBody,setMeetingID,users,arr,setArr,arrToRender,setRender}) => {
    const deleteAction = (index)=>{
        let d = [...arrToRender]
        // console.log(arr)
        let s = [...arr]
        s.splice(index,1)
        d.splice(index,1)
        setArr(s)
        // setRender(d)
    }
    const setContent = (val,index) => {
        let d = [...arrToRender]
        d[index].content = val
        setRender(d)
    }
    const setAssignee = (val,index) => {
        let d = [...arrToRender]
        d[index].user = val
        setRender(d)
    }
    const setDate = (val,index) => {
        let d = [...arrToRender]
        d[index].dueDate = val
        setRender(d)
    }
    useEffect(()=>{
        let newRender = []
        console.log(arr)
        arr.map((action)=>{
            action.user = {
                email:'',
                photo_original:'',
                name:'',
                id:''
            }
            if(action.assignee != ''){
                users.map((user)=>{
                    // console.log(action)
                    if(user.name!='' && action.assignee!='' ){
                        if(user.name.toUpperCase().includes(action.assignee.toUpperCase())){
                            action.user = user
                        }
                    }
                })
            }else{
                let words = action.content.split(" ")
                resources.map((name)=>{
                    words.map((word)=>{
                        if(word == name.heb){
                            users.map((user)=>{
                                // console.log(action)
                                if(user.name!=''  ){
                                    if(user.name.toUpperCase().includes(name.eng.toUpperCase())){
                                        action.user = user
                                        // action.content = action.content.replace(name.heb,"")
                                    }
                                }
                            })
                        }
                    })
                })
            }
            newRender.push(action)
        })
        setRender(newRender)
    },[arr])
    
    return (
        <Container>
            <Left body={body} setBody={setBody}  user={user} setMeetingID={setMeetingID}  arr={arr} setArr={setArr}/>
            <Right deleteAction={deleteAction} setDate={setDate} setAssignee={setAssignee} arr={arrToRender} users={users} setContent={setContent}/>
        </Container>
    )
}

export default Main;