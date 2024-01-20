import React, { useEffect, useState , useRef} from 'react';
import './App.css';
import TicketCard from './components/ticket-card/ticket-card';
import { FaPlus } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar, MdOutlineSignalCellularAlt1Bar } from "react-icons/md";
import { PiCellSignalNoneThin } from "react-icons/pi";
import { GrInProgress } from "react-icons/gr";
import { GoDot } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { IoAlert } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import FilterPopUp from './components/filterPopUp/filterPopUp';

function App() {
  const popupRef1 = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'status');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'priority');

  const priorityIcons = {'No Priority':<PiCellSignalNoneThin/>, 'Low':<MdOutlineSignalCellularAlt1Bar/>, 
                          'Medium':<MdOutlineSignalCellularAlt2Bar/>, 'High':<MdOutlineSignalCellularAlt/>,  
                          'Urgent':<IoAlert/>}

  const priority = ['No Priority', 'Low', 'Medium', 'High', 'Urgent'];
  const statusIcons  = {
    'Todo' : <GoDot size={20}/>,
    'Backlog': <IoAlert size={15}/>,
    'In progress': <GrInProgress size={15}/>,
    'Done': <CiCircleCheck color='blue' size={20}/>,
    'Canceled': <MdCancel size={15}/>  
  };
  const [displayPopUp, setDisplayPopUp] = useState(false);

  const handleClickPopUp = () => {
    displayPopUp ? setDisplayPopUp(false): setDisplayPopUp(true)
  }
  
  const closePopUp = () => {
    if(displayPopUp)
{    setDisplayPopUp(false);}
    console.log(2,displayPopUp)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  const tickets = data?.tickets;
  const users = data?.users;

  const randomImageLink = 'https://picsum.photos/20/20?random=';

  const sortTickets = (criteria) => {
    switch (criteria) {
      case 'priority':
        return tickets?.sort((a, b) => b.priority - a.priority);
      case 'title':
        return tickets?.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tickets;
    }
  };

  const groupTickets = (sortedTickets, criteria) => {
    const allStatusValues = criteria === 'status' ? ['Todo', 'In progress', 'Backlog', 'Done', 'Canceled'] : [];

    return sortedTickets?.reduce((groups, ticket) => {
      const key = criteria === 'user' && ticket.userId ? getUserName(ticket.userId) : criteria === 'priority' ? priority[ticket[criteria]] : ticket[criteria];
      groups[key] = [...(groups[key] || []), ticket];
      return groups;
    }, allStatusValues.reduce((obj, status) => ({ ...obj, [status]: [] }), {}));
  };

  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const sortedTickets = sortTickets(sortBy);
  const groupedTickets = groupTickets(sortedTickets, groupBy);

  return (
    <div className="App">
      {error && <div>Error: {error.message}</div>}
      <div className='displayFilter'>
        <div className='newDisplay' onClick={handleClickPopUp} ref={popupRef1}>
          <LuSettings2 className='filterSettings'/>
          Filter
          <MdKeyboardArrowDown/>
        </div>
        <FilterPopUp
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        displayPopUp={displayPopUp}
        closePopUp={closePopUp}
        popupRef1={popupRef1}
      />
      </div>
      {data && (
        <div className="columnsContainer">
          {Object.entries(groupedTickets || {}).map(([key, tickets]) => (
            <div key={key} className="column">
              <div className='columnHeadingSection'>
                <div className='columnHeadingIcons'>
                  {groupBy == 'status' && <span className='statusIcon'> {statusIcons[key]}</span>}
                  {groupBy == 'user' && <span className='statusIcon'> <img src={randomImageLink+Math.random()} alt="User pic" className='userPhoto'/></span>}
                  {groupBy == 'priority' && <span className='statusIcon'>{priorityIcons[key]}</span>}
                  <p className='columnHeading'>{key}    {tickets.length} </p>
                </div>
                <div className='columnHeadingIcons'>
                  <span><FaPlus color='grey' /></span>
                  <span><SlOptions color='grey' /></span>
                </div>
              </div>
              {tickets.map(ticket => (
                <TicketCard key={ticket.id} 
                ticketID={ticket.id} 
                ticketName={ticket.title} 
                ticketTag={ticket.tag[0]} 
                ticketPriority={ticket.priority}
                criteria={groupBy}
                number={ticket.userId.split('-')[1]}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
