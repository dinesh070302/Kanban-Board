import React from 'react';
import circle from '../../assets/circle.svg';
import userIcon from '../../assets/userIcon.svg';
import '../ticket-card/ticket-card.css';
import { GoDotFill } from "react-icons/go";
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar, MdOutlineSignalCellularAlt1Bar } from "react-icons/md";
import { PiCellSignalNoneThin } from "react-icons/pi";
import { IoAlert } from "react-icons/io5";

function TicketCard({ticketID,ticketName,ticketTag,ticketPriority,criteria}) {
  const priorityIcons = [<PiCellSignalNoneThin/>, <MdOutlineSignalCellularAlt1Bar/>, <MdOutlineSignalCellularAlt2Bar/>, <MdOutlineSignalCellularAlt/>,  <IoAlert/>]
  return (
    <div className='cardContainer'>
        <div className='cardTicketHeader'>
        <p className='ticketID'>{ticketID}</p>
        {!(criteria == 'user')  && <img src={userIcon} alt="User pic" className='userPhoto'/>}
        </div>
        <div className='ticketNameSection'>
          <img src={circle} alt="Circle pic" className='circlePic'/>
          <p className='ticketName'>{ticketName}</p>
        </div>
        <div className='ticketTypeSection'>
            {!(criteria == 'priority') && <div className='priorityIcons'>{priorityIcons[ticketPriority]}</div>}
            <div className='ticketType'>
                <GoDotFill color='grey'/>
                <p className='feature'>{ticketTag}</p>
            </div>        
        </div>
    </div>
  )
}

export default TicketCard