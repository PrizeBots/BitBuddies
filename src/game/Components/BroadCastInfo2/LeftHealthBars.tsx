
import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'
import ProgressBar from 'react-bootstrap/ProgressBar';



const Backdrop = styled.div`
  position: fixed;
  width: 25%;
  left: 20%;
  margin: auto;
  margin-top: 20px;
`

const Wrapper = styled.div`
`

const TextDiv = styled.div`
  border-style: solid;
  border-width: 5px;
`

const NameTextDiv = styled.div`
  float: left;
  padding-left: 10px;
`
const BlackDiv = styled.div`
  color: black;
`

export function LeftHealthBars() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  let healthBarColorString = ""
  if (fightersInfo.player1.health > 70) {
    healthBarColorString = "success"
  }
  else if (fightersInfo.player1.health <= 70 && fightersInfo.player1.health >= 30) {
    healthBarColorString = "warning"
  }
  else{
    healthBarColorString = "SOME_NAME"
  }
  // console.log("inAppSelector left --", fightersInfo.player1.health, healthBarColorString, fightersInfo.player1.stamina)
  return (
    <Backdrop>
      <Wrapper>
        <TextDiv>
          <ProgressBar 
            variant={`${healthBarColorString}`} 
            now={fightersInfo.player1.health} 
            min={0} 
            max={fightersInfo.player1.max_health} 
            style={{
              padding: '1px',
              height: '20px'
            }}
            label={<BlackDiv> {Math.round(fightersInfo.player1.health)} </BlackDiv> }
          />
          <ProgressBar 
            variant="#778AFD" 
            now={fightersInfo.player1.stamina} 
            min={0} 
            max={fightersInfo.player1.max_stamina}
            style={{
              padding: '1px',
              height: '20px',
            }}
          />
        </TextDiv>
        <NameTextDiv>
          <div className="name_text_below_health_bar">
            {fightersInfo.player1.nick_name}
            {/* {"Hero"} */}
          </div>
        </NameTextDiv>
        {/* <PrizeTzextDiv>
          <div className="prize_text_below_health_bar">
            {"55 usd"}
          </div>
        </PrizeTzextDiv> */}
      </Wrapper>
    </Backdrop>
  )
}