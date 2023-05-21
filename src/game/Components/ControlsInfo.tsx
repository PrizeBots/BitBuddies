import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { TurnMouseClickOff } from "../../stores/UserActions";
import { ChangeShowControls } from "../../stores/UserWebsiteStore";
import { getSystemInfo } from '../../utils/systemInfo';

const Backdrop = styled.div`
  position: fixed;
  top: 10%;
  left: 25%;
  max-height: 70%;
  height: 75%;
  width: 50%;
  // z-index: 1;
`

const Backdrop2 = styled.div`
  position: fixed;
  top: 10%;
  left: 5%;
  max-height: 80%;
  height: 80%;
  width: 90%;
  // z-index: 1;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  z-index: 2;
`

const FightConfirmationBoxDiv = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 1;
  background: #000000a7;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 30px;
  z-index: 2;

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 25px;
    color: white;
    margin-top: 10px;
    padding-bottom: 20px;
  }

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 21px;
  }

  .controlsText {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: white;
    background: rgb(84, 86, 86);
  }
`

export function ControlsInfo() {
  const showControls = useAppSelector((state) => state.userPathStore.showControls)
  const dispatch = useAppDispatch();
  const ismobile = getSystemInfo()

  const storeSawControlsDataInLocal = () => {
    localStorage.setItem("saw_controls", "YES")
    dispatch(ChangeShowControls(false))
  }

  const View =             <Wrapper>
              <FightConfirmationBoxDiv>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around'
                }}>
                  <div>
                    <h2>
                      Controls
                    </h2>

                    <div className="controlsText">
                      P/ Left Mouse Click - Punch
                    </div>

                    <div className="controlsText">
                      K/ Right Mouse Click - Kick
                    </div>


                    <div className="controlsText">
                      W, A, S, D - movement
                    </div>

                  </div>

                  <div>
                    <h2>
                      Features
                    </h2>

                    <div className="controlsText">
                      To Chat - Press Enter to Open the chat Window
                    </div>

                    <div className="controlsText">
                      Join the fight by going near the Fight Box in right corner of HQ
                    </div>
                  </div>

                  <div style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingTop: '10px',
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() =>  storeSawControlsDataInLocal() }
                    >
                      <span style={{
                          color: 'aliceblue'
                        }}>Got it !</span>
                    </Button>
                  </div>
                </div>

              </FightConfirmationBoxDiv>
            </Wrapper>

  return(
    <div
      onMouseOver={() => {
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() => {
        dispatch(TurnMouseClickOff(false))
      }}
      style={{
        zIndex: 5
      }}
    >
      { showControls &&
        <div> 
          {
            !getSystemInfo() ? 
            <Backdrop>
              {View}
            </Backdrop>:
            <Backdrop2>
              {View}
            </Backdrop2>
          }
        </div>
      }
    </div>
  )
}