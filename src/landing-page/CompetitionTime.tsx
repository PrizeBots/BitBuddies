import React from 'react';
import { useState, useEffect } from 'react';

function CompetitionTime() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // const deadline = "September, 3, 2023";
  const deadline = new Date(2023,8,3,23,59,0);
  const [remainingTime, setRemainingTime] = useState();

  const getTime = () => {
    const time = deadline.getTime() - Date.now();

    // setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60))));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1 *1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer" style={{
      display: 'flex',
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    }}>
      <div style={{
        color: 'white',
      }}> 
      <div className="cooper-black-tab">
        Prize Game Ends In: {` ${hours} : ${minutes} : ${seconds} `}
      </div> 
      </div>
      
      
      
    </div>
  );
}

export default CompetitionTime;