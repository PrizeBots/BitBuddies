import styled from "styled-components";
import { useAppSelector } from "../../../hooks";
import { v4 as uuidv4 } from 'uuid';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { useState } from "react";

const BackDrop = styled.div`
  float: left;
`

const BackWrapper = styled.div`
  position: fixed;
  width: 15%;
  left: 80%;
  margin: auto;
  // background-color: yellow;
`

const Imagewrapper = styled.div`
`

export function RightPlayerInfo() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  const [openAttributesInfo, setAttributesOpen] = useState(true);
  return (
    <BackWrapper>
      <BackDrop>

        <Imagewrapper>
          <img
            src={fightersInfo.player2.profile_image}
            style={{
              height: '150px',
              width: '200px',
              transform: `scaleX(-1)`
            }}
          />
        </Imagewrapper>
        <div style={{
          // width: '80%',
          backgroundColor: 'black',
          opacity: '0.8',
          float: 'right',
          color: 'aliceblue'
        }}>
          <div style={{
            float: 'left',
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
                backgroundColor: 'black',
                float: 'right',
              }}>
                <tbody>
                  <tr key={uuidv4()}>
                    <td>Defense</td>
                    <td>{fightersInfo.player2.defense}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <td>Punch</td>
                    <td>{fightersInfo.player2.punchpower}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <td>Kick</td>
                    <td>{fightersInfo.player2.kickpower}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <td>Speed</td>
                    <td>{fightersInfo.player2.speed}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <td>Health</td>
                    <td>{fightersInfo.player2.max_health}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <td>Stamina</td>
                    <td>{fightersInfo.player2.max_stamina}</td>
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