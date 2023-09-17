import styled from "styled-components";
import { useAppSelector } from "../../../hooks";
import { v4 as uuidv4 } from 'uuid';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { useState } from "react";

const BackWrapper = styled.div`
  position: fixed;
  width: 10%;
  left: 17%;
  margin: auto;
  opacity: 0.7;
  // background-color: yellow;
`

const BackDrop = styled.div`
  float: right;
`

const Imagewrapper = styled.div`
`

export function LeftPlayerInfo() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  console.log("debug____fightersInfo... ", fightersInfo)
  const [openAttributesInfo, setAttributesOpen] = useState(true);
  return (
    <BackWrapper>
    <BackDrop>

      <Imagewrapper>
        <img
          src={fightersInfo.player1.profile_image}
          style={{
            height: '150px',
            width: '200px',
          }}
        />
      </Imagewrapper>
      <div style={{
        // width: '80%',
        backgroundColor: 'black',
        opacity: '0.8',
        float: 'left',
        color: 'aliceblue'
      }}>
        <div style={{
          float: 'right',
        }}
        onClick={() => setAttributesOpen(!openAttributesInfo)}
        >
          <ArrowDropDownSharpIcon fontSize="large" />
        </div>
      </div>

      {
        openAttributesInfo && 
        <div>

          <div key={uuidv4()} style={{
            color: '#C1D5EE',
          }}>
            <table style={{
              width: `100%`,
              backgroundColor: 'black'
            }}>
              <tbody>
                <tr key={uuidv4()}>
                  <td>Defense</td>
                  <td>{fightersInfo.player1.defense}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Punch</td>
                  <td>{fightersInfo.player1.punchpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Kick</td>
                  <td>{fightersInfo.player1.kickpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Speed</td>
                  <td>{fightersInfo.player1.speed}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Health</td>
                  <td>{fightersInfo.player1.max_health}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Stamina</td>
                  <td>{fightersInfo.player1.max_stamina}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      }
      
      

    </BackDrop>
    </BackWrapper>
  )
}