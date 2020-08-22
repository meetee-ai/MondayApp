import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import {MdHelpOutline} from 'react-icons/md'

const HeaderCon = styled.div`
    display:flex;
    padding:2rem 3rem;
    justify-content:space-between;
    display:flex;
    align-items:center;
`

const Container = styled.div`
    display:flex;
    flex-direction:column;
    width:60%;
    div{
        display:flex;
        align-items:flex-end;
        svg{
            margin-bottom:10px;
            color:#828282;
        }
    }
    input{
        border:none;
        outline:none !important;
        font-size:35px;
        font-family:'Roboto';
        font-weight:bold;
        width:250px;
        max-width:985px;
        min-width:250px;
        padding:5px 0;
        color:#655CD1;
        &::placeholder{
            color:#9597A1;
        }
    }
    h2{
        margin:0;
        font-family:'Roboto';
        font-size:18px;
        font-weight:300;
        color:#4f4f4f;
    }
`

const DoneButton = styled.div`
    background:#655CD1 !important;
    padding:.6rem 4rem;
    border-radius:40px;
    border:none;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:16px;
    cursor:pointer;
    color:white;
    font-family:'Rubik';
    font-weight:500;
    &:hover{
        background:#4C44B1;
    }
`
const UpgradeButton = styled.a`
    color:#655CD1;
    padding:.6rem 4rem;
    border-radius:40px;
    border:none;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:16px;
    cursor:pointer;
    background:white;
    font-family:'Rubik';
    font-weight:500;
    text-decoration:none;
    &:hover{
        text-decoration:underline;
    }
`

function resizable (el, factor) {
    var int = Number(factor) || 7.7;
    function resize() {el.style.width = ((el.value.length+1) * int) + 'px'}
    var e = 'keyup,keypress,focus,blur,change'.split(',');
    for (var i in e) el.addEventListener(e[i],resize,false);
    resize();
  }

const Header = ({title,setTitle,FinishMeeting}) => {
    return (
        <HeaderCon>
            <Container spanStyle={title==''}>
                <div>
                    <input type="text" id="txt" value={title} placeholder="Meeting Title" onChange={(e)=>{
                        setTitle(e.target.value)
                        resizable(document.getElementById('txt'),17);
                    }}/>
                    <MdHelpOutline data-for="info" data-tip=""/>
                    <ReactTooltip id="info">A new group will be created with all <br/> the new  items from this summary</ReactTooltip>
                </div>
                <h2>{moment().format("ddd ,MMM DD")} at {moment().format("HH:mm")}</h2>
            </Container>
            <div style={{display:"flex",alignItems:"center"}}>
                {/* <UpgradeButton href="https://meetee.ai" target="_blank" data-for="upgrade" data-tip="">
                    Upgrade Now
                </UpgradeButton>
                <ReactTooltip id="upgrade">Sign up to use the superpower of automations.</ReactTooltip> */}
                <DoneButton onClick={()=>FinishMeeting()} data-for="finish" data-tip="">
                    Done
                </DoneButton>
                <ReactTooltip id="finish">Finish the meeting</ReactTooltip>
            </div>
        </HeaderCon>
    )
}

export default Header;