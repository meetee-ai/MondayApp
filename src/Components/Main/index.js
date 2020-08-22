import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import Left from './Left'
import Right from './Right'

const Container = styled.div`
    display:flex;
    justify-content:space-between;
    margin-top:1rem;
`
const Main = ({user,body,setBody,setMeetingID,users,arr,setArr,arrToRender,setRender}) => {

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
        arr.map((action)=>{
            action.user = {
                email:'',
                photo_original:'',
                name:'',
                id:''
            }
            if(action.assignee != ''){
                users.map((user)=>{
                    console.log(action)
                    if(user.name!='' && action.assignee!='' ){
                        if(user.name.toUpperCase().includes(action.assignee.toUpperCase())){
                            action.user = user
                        }
                    }
                })
            }
            newRender.push(action)
        })
        setRender(newRender)
    },[arr])
    
    return (
        <Container>
            <Left body={body} setBody={setBody}  user={user} setMeetingID={setMeetingID}  arr={arr} setArr={setArr}/>
            <Right setDate={setDate} setAssignee={setAssignee} arr={arrToRender} users={users} setContent={setContent}/>
        </Container>
    )
}

export default Main;