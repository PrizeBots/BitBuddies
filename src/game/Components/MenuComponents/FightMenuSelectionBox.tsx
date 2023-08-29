// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SelectFightInFightMachineMenu, TurnMouseClickOff } from '../../../stores/UserActions';
import store from '../../../stores';
import { ChangeShowMenuBox, ChangeShowQueueBox } from '../../../stores/UserWebsiteStore';



const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 40px;
  // width: 400px;
  // background-color: red;
  // max-width: 20vw;
`

const FriendRequestBox = styled(Box)`
  
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 5px solid #000000;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 50px;

  // background: #222639;
  box-shadow: 0px 0px 5px #0000006f;
  border-radius: 16px;

  span {
    // font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }
`

const FriendRequestBox2 = styled(Box)`
  width: 200px;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 40px;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h2, h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 75%;
  }

  input {
    color: black;
  }
`

const ButtonView = styled(Button)`
  span {
    color: black;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
  }

  background-color: #9c341a;
  border-radius: 16px;

  &:hover {
    background-color: #852d17;
  }

  width: 200px;
  height: 60px;
`;


export default function FightMenuSelectionBox(data: any) {
  const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
  const dispatch = useAppDispatch()

  return(
    <div ref={ref}>
      <Wrapper 
        onMouseOver={() => {
          dispatch(TurnMouseClickOff(true))
        }}
        onMouseOut={() =>{ 
          dispatch(TurnMouseClickOff(false))
        }}
      >
        <FriendRequestBox2>

          <Button
            variant="contained" 
            color="primary"
            onClick={() => {
              store.dispatch(SelectFightInFightMachineMenu(true))
              dispatch(TurnMouseClickOff(false))
            }}
          >
            <span style={{
              color: 'aliceblue'
            }}>Fight</span>
          </Button>


          <Button
            variant="contained" 
            color="primary"
            onClick={() => {
              // data.enterQueue()
              dispatch(TurnMouseClickOff(false))
              store.dispatch(ChangeShowQueueBox(true))
              store.dispatch(ChangeShowMenuBox(true))
            }}
          >
            <span style={{
              color: 'aliceblue'
            }}>Bet</span>
          </Button>
        </FriendRequestBox2>
      </Wrapper>
    </div>
  )
}