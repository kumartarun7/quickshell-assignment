import React from 'react';
import './style.css';

const Card = ({ title, priority, status }) => {

  console.log(priority);
 
  const priorityImages = {
    4: 'assets/UG.svg',  // Urgent
    3: 'assets/H.svg',    // High
    2: 'assets/M.svg',  // Medium
    1: 'assets/L.svg',     // Low
    0: 'assets/No-priority.svg' // No priority
  };

  return (
    <div className='card'>
      <div className='heading'>
        CAM-4
        <img src="assets/profile.jpg" alt="" className='image' />
      </div>
      <div  className='title'>
        {title}
      </div>
      <div>
        <div className='lower'>
          {/* Dynamically set the image based on the priority */}
          <img src={priorityImages[priority]} alt="Priority icon" className='image2' />
          <div className='box'>
            <svg height="15" width="15" xmlns="http://www.w3.org/2000/svg">
              <circle r="6" cx="6" cy="7" fill="#c2c4c6" />
            </svg>
            <div>Feature Request</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
