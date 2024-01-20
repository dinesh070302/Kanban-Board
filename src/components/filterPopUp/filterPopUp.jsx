import React, { useRef, useEffect } from 'react';
import './filterPopUp.css'

export default function FilterPopUp({ setGroupBy, groupBy, sortBy, setSortBy, displayPopUp, closePopUp,popupRef1}) {
    const popupRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)  && !popupRef1.current.contains(event.target)) {
          closePopUp();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [displayPopUp, closePopUp]);
  
    return (
      <div ref={popupRef} className={`${displayPopUp ? 'displayPopupVisible' : 'displayPopupHide'}`}>
        {displayPopUp && (
          <div>
            <div className='grouping'>
              Grouping
              <select
                id="groupByDropdown"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className='groupByDropdown'
              >
                <option className='groupOptions' value ="status">Status</option>
                <option className='groupOptions' value ="user">User</option>
                <option className='groupOptions' value ="priority">Priority</option>
              </select>
            </div>
            <div className='grouping'>
              Sorting
              <select
                id="sortDropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='groupByDropdown'
              >
                <option className='groupOptions' value ="priority">Priority</option>
                <option className='groupOptions' value ="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }