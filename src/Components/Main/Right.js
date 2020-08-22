import React from 'react'
import styled from 'styled-components'
import ActionItem from './ActionItem'

const Container = styled.div`
    display:flex;
    justify-content:center;
    width:40%;
    padding:0 3rem 0 0;
`
const Right = ({arr,setContent,users,setAssignee,setDate}) => {
    return (
        <Container>
            <div style={{width:"100%"}}>
                {
                    arr.map((x,i)=>{
                        return <ActionItem setDate={setDate} setAssignee={setAssignee} users={users} setContent={setContent} index={i} state={x}/>
                    })
                }
            </div>
        </Container>
    )
}

export default Right;