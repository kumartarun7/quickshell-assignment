// App.js
import './App.css';
import React, { useEffect, useState } from 'react';
import Column from './components/column/Column';
import Popup from './components/popup/Popup'; 

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'priority');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'priority');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortOption', sortOption);
  }, [groupBy, sortOption]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sortOption === 'priority') {
        return b.priority - a.priority;
      } else if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const groupByUser = (tickets) => {
    const userGroups = {};
    data.users.forEach(user => {
      userGroups[user.id] = { name: user.name, tickets: [] };
    });

    tickets.forEach(ticket => {
      if (userGroups[ticket.userId]) {
        userGroups[ticket.userId].tickets.push(ticket);
      }
    });

    return userGroups;
  };

  const groupByStatus = (tickets) => {
    const statusGroups = {
      'Backlog': [],
      'Todo': [],
      'In progress': [],
      'Done': [],
      'Canceled': []
    };

    tickets.forEach(ticket => {
      if (statusGroups[ticket.status]) {
        statusGroups[ticket.status].push(ticket);
      }
    });

    return statusGroups;
  };

  let groupedTickets;

  if (groupBy === 'user') {
    groupedTickets = groupByUser(data.tickets);
  } else if (groupBy === 'status') {
    groupedTickets = groupByStatus(data.tickets);
  } else {
    groupedTickets = {
      0: sortTickets(data.tickets.filter(ticket => ticket.priority === 0)),
      1: sortTickets(data.tickets.filter(ticket => ticket.priority === 1)),
      2: sortTickets(data.tickets.filter(ticket => ticket.priority === 2)),
      3: sortTickets(data.tickets.filter(ticket => ticket.priority === 3)),
      4: sortTickets(data.tickets.filter(ticket => ticket.priority === 4)),
    };
  }

  return (
    <div className="App">
      <div>
        <div className="navbar">
          <button id='button' onClick={() => setShowPopup(!showPopup)}>
            <img src="assets/Display.svg" alt="" />
            <div>Display</div>
            <img src="assets/down.svg" alt="" />
          </button>
        </div>

        {/* Use the Popup component */}
        <Popup
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </div>

      <div className='head'>
        {groupBy === 'user' ? (
          Object.keys(groupedTickets).map(userId => (
            <Column
              key={userId}
              groupBy={groupBy}
              name={groupedTickets[userId].name}
              tickets={groupedTickets[userId].tickets}
              sortFunction={sortTickets}
              sortOption={sortOption}
            />
          ))
        ) : groupBy === 'status' ? (
          Object.keys(groupedTickets).map(status => (
            <Column
              key={status}
              groupBy={groupBy}
              name={status}
              tickets={groupedTickets[status]}
              sortFunction={sortTickets}
              sortOption={sortOption}
            />
          ))
        ) : (
          Object.keys(groupedTickets).map((priority) => (
            <Column
              key={priority}
              groupBy={groupBy}
              name={priority}
              tickets={groupedTickets[priority]}
              sortFunction={sortTickets}
              sortOption={sortOption}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
