import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  text-align: center;
  width: 10%;
  left: 45%;
  margin: auto;
  // background-color: yellow;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: #000000a7;
  border-radius: 10px;
  // border: 5px solid #000000;
  border-left: 5px solid #000000;
  border-top: 5px solid #000000;
  border-right: 5px solid #000000;
  border-bottom: 5px solid #000000;
  // border-radius: 10px;
  height: 90px;
`

const TextDiv = styled.div`
  font-size: 4em;
  font-family: Montserrat, sans-serif;
  font-weight: 800;
  text-transform: none;
  color: aliceblue;
`


const PrizeTextDiv = styled.div`
  padding: 20px 20px 0px 20px;
  background-color: #000000a7;
  border-bottom: 5px solid #000000;
  border-top: 5px solid #000000;
`

export function Timer() {
  const notificationFromServerBool = useAppSelector((state) => state.userPathStore.GotNotificationFromServer)
  const notificationFromServerMsg = useAppSelector((state) => state.userPathStore.NotificationMessageFromServer)
  // const notificationFromServerBool = true;
  // const notificationFromServerMsg = 50
  return (
    <Backdrop>
      <Wrapper>
      {
        notificationFromServerBool ?
        (
          <div>
            <TextDiv>
              {notificationFromServerMsg}
            </TextDiv>

            {/* <PrizeTextDiv className="prize_text_below_health_bar_1"
              style={{
                justifyContent: 'center',
              }}
            >
              <div style={{
                marginTop: '-10px'
              }}>
                Fight
              </div>
              <div style={{
                marginTop: '-20px'
              }}>
                Prize
              </div>
            </PrizeTextDiv>
             */}
          </div>
        ):
        <TextDiv>
          {60}
        </TextDiv>
      }
        {/* <TextDiv>
          Start the fight
        </TextDiv> */}
      </Wrapper>
    </Backdrop>
  )
}