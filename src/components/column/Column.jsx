import React from 'react';
import Card from '../card/Card';
import './column-style.css';

const Column = ({ groupBy, name, tickets, sortFunction }) => {
  // Sort tickets before rendering
  const sortedTickets = sortFunction(tickets);

  // Function to convert priority value to a descriptive label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 4:
        return 'Urgent';
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
        return 'Low';
      case 0:
      default:
        return 'No priority';
    }
  };

  // Mapping of priority levels to image sources
  const priorityImages = {
    4: 'assets/UC.svg',  // Urgent
    3: 'assets/H.svg',   // High
    2: 'assets/M.svg',   // Medium
    1: 'assets/L.svg',   // Low
    0: 'assets/No-priority.svg' // No priority
  };


  const statusImages = {
    'Backlog': 'assets/backlog.svg',
    'Todo': 'assets/To-do.svg',
    'In progress': 'assets/in-progress.svg',
    'Done': 'assets/done.svg',
    'Canceled': 'assets/Cancelled.svg',
  };

  return (
    <div className='top'>
      <div className='main'>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
          {groupBy === 'priority' ? (
            <img src={priorityImages[parseInt(name)]} alt="" /> // Use parseInt(name) to get the correct image
          ) : groupBy === 'user' ? (
            <img src="assets\profile.jpg" alt=""  style={{height:'20px', width:'20px', borderRadius:'50%'}}/>
          ) : (
            <img src={statusImages[name]} alt="" />
          )}
          {/* Display the correct name based on grouping */}
          {groupBy === 'priority' ? (
            <div>{getPriorityLabel(parseInt(name))}</div> // Parse name as integer for priority
          ) : (
            <div>{name}</div>
          )}
          <div>{tickets.length}</div> {/* Display ticket count */}
        </div>
        <div>
          <img src="assets/add.svg" alt="" />
          <img src="assets/3 dot menu.svg" alt="" />
        </div>
      </div>

      {/* Render each sorted ticket as a Card component */}
      <div className="ticket-list">
        {sortedTickets.map((ticket) => (
          <Card
            key={ticket.id}
            title={ticket.title} // Pass ticket title to Card
            priority={ticket.priority} // Pass ticket priority to Card
            status={ticket.status} // Pass ticket status to Card
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
