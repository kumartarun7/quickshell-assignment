import './App.css';
import React, { useEffect, useState } from 'react';
import Column from './components/column/Column';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'priority'); // Load from localStorage
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'priority'); // Load from localStorage
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

  // Save groupBy and sortOption to localStorage whenever they change
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
      userGroups[user.id] = { name: user.name, tickets: [] }; // Initialize user group
    });

    tickets.forEach(ticket => {
      if (userGroups[ticket.userId]) {
        userGroups[ticket.userId].tickets.push(ticket); // Push ticket to corresponding user
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
    // Group tickets by priority
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

        {showPopup && (
          <div className="popup">
            {/* Grouping and Sorting menus in a single column */}
            <div className="options-container">
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <label htmlFor="group">Grouping:</label>
                <select
                  id="group"
                  value={groupBy}
                  onChange={(e) => {
                    setGroupBy(e.target.value);
                    setSortOption('priority'); // Reset sort option when changing grouping
                  }}
                >
                  <option value="priority">Priority</option>
                  <option value="user">User</option>
                  <option value="status">Status</option>
                </select>
              </div>

              {/* Sorting menu */}
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <label htmlFor="sort">Ordering:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='head'>
        {groupBy === 'user' ? (
          // Render columns for each user
          Object.keys(groupedTickets).map(userId => (
            <Column
              key={userId}
              groupBy={groupBy}
              name={groupedTickets[userId].name} // User name
              tickets={groupedTickets[userId].tickets} // User's tickets
              sortFunction={sortTickets} // Sorting function
              sortOption={sortOption} // Sorting option (priority or title)
            />
          ))
        ) : groupBy === 'status' ? (
          Object.keys(groupedTickets).map(status => (
            <Column
              key={status}
              groupBy={groupBy}
              name={status} // Status name
              tickets={groupedTickets[status]} // Tickets for this status
              sortFunction={sortTickets} // Sorting function
              sortOption={sortOption} // Sorting option (priority or title)
            />
          ))
        ) : (
          // Render columns for each priority
          Object.keys(groupedTickets).map((priority) => (
            <Column
              key={priority}
              groupBy={groupBy}
              name={priority} // Priority name
              tickets={groupedTickets[priority]} // Tickets for this priority
              sortFunction={sortTickets} // Sorting function
              sortOption={sortOption} // Sorting option (priority or title)
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
