import React,{Fragment,useState} from 'react'
import styled from 'styled-components'
import moment from 'moment'
import DropDown from '../utils/DropDown'
import {MdPersonAdd,MdDateRange, MdDelete} from 'react-icons/md'
import {DayPickerSingleDateController as SingleDatePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';
import ReactTooltip from 'react-tooltip'


const Container = styled.div`
    border:1px solid #E0E0E0;
    background:#F5F6F8;
    display:flex;
    width:100%;
    margin:10px 0;

    input{
        border: none;
        background: transparent;
        outline: none;
        overflow-x: hidden;
        padding:5px 0px 5px 5px;
        width:100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    span{
        background:#655CD1;
        width:9px;
        display:block;
    }
    .leftBorder{
        border-left:1px solid white;
        padding:.7rem .5rem;
        min-width:50px;
        font-size: 13px;
        cursor:pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        svg{
            color:#828282;
            width:20px;
            height:20px;
            cursor:pointer;
        }
        img{
            width:25px;
            height:25px;
            border-radius:25px;
        }
        .dropDownCon{
            position: absolute;
            margin-top: 30px;
            width: 250px;
            margin-left: -180px;
        }
        .dateContainerDropDown{
            position: absolute;
            margin-top: 30px;
            width: 250px;
            margin-left: -320px; 
        }
    }
    .main{
        width:100%;
    }
`

const DeleteCon = styled.div`
    position: absolute;
    right: 0px;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    flex-direction: column;
    margin-top: 0px;
    /* background: #eee; */
    padding: 10px 10px 13px 13px;
    ${'' /* margin-left: 50px; */}
    color: #828282;
    box-shadow: );
    /* border: 1px solid #ddd; */
    width: 25px;
    height: 25px;
    cursor:pointer;
`

const Attend = styled.div`
    display:flex;
    cursor:pointer;
    align-items:center;
    padding:10px 0;
    &:hover{
        background:#e0e0e0;
    }
    img{
        margin:0 10px;
        width:25px;
        height:25px;
        border-radius:25px;
        cursor:pointer;
    }
    label{
        cursor:pointer;
    }
`
ThemedStyleSheet.registerInterface(aphroditeInterface);
ThemedStyleSheet.registerTheme({
  reactDates: {
    ...DefaultTheme.reactDates,
    color: {
      ...DefaultTheme.reactDates.color,
      selectedSpan: {
        borderColor_active:"#b6b6b6",
        borderColor_hover:"#b6b6b6",
      },
      selected: {
        backgroundColor:"#b6b6b6",
        backgroundColor_active:"#b6b6b6",
        backgroundColor_hover:"#b6b6b6",
        borderColor:"#b6b6b6",
        borderColor_active:"#b6b6b6",
        borderColor_hover:"#b6b6b6",
      },
    },
  },
});
function isBeforeDay(a, b) {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  
    const aYear = a.year();
    const aMonth = a.month();
  
    const bYear = b.year();
    const bMonth = b.month();
  
    const isSameYear = aYear === bYear;
    const isSameMonth = aMonth === bMonth;
  
    if (isSameYear && isSameMonth) return a.date() < b.date();
    if (isSameYear) return aMonth < bMonth;
    return aYear < bYear;
  }
  
  
export  function isInclusivelyAfterDay(a, b) {
if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
return !isBeforeDay(a, b);
}

const AssigneeChoose = ({user,users,setAssignee,index}) => {
    const [open,setOpen] = useState(false)

    return (
        <div className="leftBorder" onClick={()=>{
                setOpen(!open)
            }}>
            {
                user.email != '' ?
                (
                    user.photo_original != '' ? 
                    <img src={user.photo_original} alt="" />
                    :
                    user.email[0]
                )
                :
                <MdPersonAdd/>
            }
            {
            open &&
            <div className="dropDownCon">
                <DropDown radius={5} padding={0.5} callback={()=>setOpen(false)}>
                        {
                            users.map((us)=>{
                                return (
                                    <Attend onClick={()=>{
                                        setAssignee(us,index)
                                    }}>
                                        <img src={us.photo_original} alt=""/>
                                        <label>{us.email}</label>
                                    </Attend>
                                )
                            })
                        }
                </DropDown> 
            </div>
            }
        </div>
    )
}

const DateChoose = ({date,setDate,index}) => {
    const [open,setOpen] = useState(false)
    const handleFocus = (focused) => {}
    return (
        <div className="leftBorder" onClick={()=>{
            setOpen(!open)
        }}>
            {
                date ? 
                moment(date).format("MMM DD")
                :
                <MdDateRange/>
            }
            {
            open &&
            <div className="dateContainerDropDown">
                <DropDown radius={5} padding={0} callback={()=>setOpen(false)}>
                    <SingleDatePicker
                        focused={true}
                        date={date == "" ? moment() : moment(date)}
                        onDateChange={newDate => {
                            setDate(newDate,index)
                            setOpen(false)
                            }}
                        onFocusChange={({ focused }) => handleFocus(focused)}
                        id="your_unique_id"
                        numberOfMonths={1}
                        showDefaultInputIcon={false}
                        required={false}
                        keepOpenOnDateSelect={false}
                        autoFocus={false}
                        isOutsideRange={day => !isInclusivelyAfterDay(day, moment())}
                        hideKeyboardShortcutsPanel={true}
                    />
                </DropDown> 
            </div>
            }
        </div>
    )
}

const DeleteButton = ({action}) => {
    return (
        <DeleteCon onClick={()=>action()}>
            <MdDelete />
        </DeleteCon>
    )
}

const ActionItem = ({state,setContent,setDate,index,users,setAssignee,deleteAction}) => {
    const [showDelete,setShowDelete] = useState(false)
    return (
        <Container onMouseEnter={()=>{setShowDelete(true)}} onMouseLeave={()=>{setShowDelete(false)}}>
            <span/>
            <input type="text" data-for={`action${index}`} data-tip="" value={state.content} onChange={(e)=>setContent(e.target.value,index)}/>
            <ReactTooltip id={`action${index}`}>{state.content}</ReactTooltip>
            <AssigneeChoose users={users} index={index} setAssignee={setAssignee} user={state.user} />           
            <DateChoose setDate={setDate} index={index} date={state.dueDate} />
            {
                showDelete &&
                <DeleteButton action={()=>deleteAction(index)}/>
            }
        </Container>
    )
}

export default ActionItem;