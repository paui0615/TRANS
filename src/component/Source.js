import React, { Component, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';



const SourceChild = ({ onDataUpdate, onRoseUpdate, onHVUpdate, onDataVisi }) => {

const [showSource, setShowSource] = useState(false);
const [showInchild, setShowInchild] = useState(false);
const [childhide, setChildhide] = useState(false)
const [time, setTime] = useState(new Date());
const [fronttime, setFrontTime] = useState(new Date(Date.now() - 3600*1000));
const locale = 'en';

useEffect(() => {
  // Update the date and time every minute
  const interval = setInterval(() => {
      setTime(new Date())
      setFrontTime(new Date(Date.now() - 3600*1000))
  }, 360000); // 60000 milliseconds = 1 minute
  // Clear the interval when the component unmounts
  return () => clearInterval(interval);
}, []);


const day = fronttime.toLocaleDateString(locale, { weekday: 'long' });
const date = fronttime.toLocaleDateString();
const front = fronttime.getHours()+":00"
const currentDateTime = date+" "+front+" - "+time.getHours()+":00, "+day

async function Search(number){

    try{
        const response = await fetch("./Onehour_density_Set"+number+".json")
        const data = await response.json();
        setShowInchild(true)

        const response2 = await fetch("./Rose_line_Set"+number+".json")
        const data2 = await response2.json();

        const response3 = await fetch("./Station_HV_Set"+number+".json")
        const data3 = await response3.json();

        onDataUpdate(data)
        onRoseUpdate(data2)
        onHVUpdate(data3)
    } catch(error){
        console.log(error);
    }

}

function ShowHide(bool){

  onDataVisi(bool)
}



return (
    <>
    <div className="search">
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Energy Source (Choose a frequency range)
      </Dropdown.Toggle>
      
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1" onClick={() => Search(1)}>0.033 - 0.1 Hz</Dropdown.Item>
        <Dropdown.Item href="#/action-2" onClick={() => Search(2)}>0.1 - 0.5 Hz</Dropdown.Item>
        <Dropdown.Item href="#/action-3" onClick={() => Search(3)}>0.5 - 1 Hz</Dropdown.Item>
        <Dropdown.Item href="#/action-4" onClick={() => Search(4)}>1 - 5 Hz</Dropdown.Item>
        <Dropdown.Item href="#/action-5" onClick={() => Search(5)}>5 - 10 Hz</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>

  {showInchild &&
    <div className="showandhide">
    <ButtonGroup className="mb-2">
        <Button variant="secondary" onClick={() => ShowHide(false)}>Show</Button>
        <Button variant="secondary" onClick={() => ShowHide(true)}>Hide</Button>
    </ButtonGroup>
    </div>
  }
  {showInchild &&
    <div className="Clock">
      <p>Time for Source Map:<br/>
      {currentDateTime}</p>
    </div>
  }
    </>
    );

};
 
export default SourceChild