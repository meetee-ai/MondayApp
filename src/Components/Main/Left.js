import React from 'react'
import styled from 'styled-components'
import {WritingSmart} from 'meetee-utils'
import 'meetee-utils/dist/index.css'

const Container = styled.div`
    display:flex;
    justify-content:center;
    padding:0 3rem;
    width:60%;
`

const Left = ({user,arr,body,setBody,setArr,users,setMeetingID}) => {
    return (
        <Container>
            <WritingSmart body={body} setBody={setBody} account={user} arr={arr} setArr={setArr} setMeetingID={setMeetingID} token={'5f3e9e6a19526396db080896'}/>
        </Container>
    )
}

export default Left;