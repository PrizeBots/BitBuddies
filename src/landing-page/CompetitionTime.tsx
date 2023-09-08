import React from 'react';
import { useState, useEffect } from 'react';

function changeTimezone(date: any, ianatz: any) {

  // suppose the date is 12:00 UTC
  var invdate = new Date(date.toLocaleString('en-US', {
    timeZone: ianatz
  }));

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() - diff); // needs to substract

}

function CompetitionTime() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // const deadline = "September, 3, 2023";
  // const deadline = new Date(2023,8,9,2,30,0);
  
  const [remainingTime, setRemainingTime] = useState();

  const getTime = () => {
    // const deadline = new Date(2023,8,8,17,0,0);
    const deadline = new Date(2023,8,9,2,30,0);
    // const newDeadline = changeTimezone(deadline, "America/Toronto");
    deadline.toLocaleString('Asia/Kolkata', { timeZone: 'America/New_York' })
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
        // color: 'white',
      }}> 
      <div className="cooper-black-tab">
        Countdown until Next Prize Game: {` ${hours} : ${minutes} : ${seconds} `}
      </div> 
      </div>
      
      
      
    </div>
  );
}

export default CompetitionTime;