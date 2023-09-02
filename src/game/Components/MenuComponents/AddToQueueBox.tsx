// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SetMouseClickControlFightMachine, TurnMouseClickOff } from '../../../stores/UserActions';



const Wrapper = styled.div`
  position: relative;
  // height: 100%;
  // padding: 16px;
`

const FriendRequestBox = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 20px;

  span {
    // font-family:'Cooper Black', sans-serif;
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h2, h3 {
    font-family: Monospace;
    // font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 75%;
  }

  input {
    color: black;
  }
`

interface IQueueOptions {
  closeFunction: any,
  enterQueue: any,
  amount: number,
  setAmount: any,
  ANTE: number,
  amountInString: string,
}

export default function AddToQueueBox(data: IQueueOptions) {
  const queueData = useAppSelector((state) => state.userPathStore.QueueData)
  const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
  const dispatch = useAppDispatch()
  return(
    <div ref={ref}>
      <Wrapper 
        onMouseOver={() => {
              dispatch(SetMouseClickControlFightMachine(true))
            }}
            onMouseOut={() =>{ 
              dispatch(SetMouseClickControlFightMachine(false))
            }}
      >
        <FriendRequestBox>
          <h2>Genesis HQ - Tier 5</h2>
          <br />
          <h3> Rules : 1v1 Death Match</h3>
          <h3>Time: 60 seconds</h3>
          <h3>Draw: Sudden Death</h3>
          <h3>Queue: {Math.floor(queueData.length/2)}/{50}</h3>
          <h3>Est. Wait: {Math.floor(queueData.length/2) * 1} minutes</h3>
          <h3>Ante: {(data.ANTE).toLocaleString()} BITS</h3>
          <h3>Min Bet: None</h3>
          <h3>Max Bet: None</h3>

          <h3>Your Max Bet: 
            <input type="number" 
              placeholder='amount in BITS' 
              style={{marginTop: '10px'}}
              // value={data.amountInString}
              onChange={(e) => {
                let tempString = e.target.value
                if (e.target.value === "") {
                  data.setAmount(0)
                } else {
                  if (tempString.startsWith("0") && tempString.length > 1) {
                    tempString = tempString.slice(1);
                  } 
                  data.setAmount(parseInt(tempString))
                }
                console.log(e.target.value, ":", tempString, ":", data.amount)
              }}
            >
            </input></h3>
          <h3>Total Wager: {(data.ANTE + data.amount).toLocaleString()}</h3>
          <br />

          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              data.enterQueue()
              dispatch(TurnMouseClickOff(false))
            }}
          >
            <span style={{
              color: 'aliceblue'
            }}>Enter Fight</span>
          </Button>
        </FriendRequestBox>
      </Wrapper>
    </div>
  )
}