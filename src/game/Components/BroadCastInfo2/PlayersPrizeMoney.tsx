import { Grid } from "@mui/material";
import styled from "styled-components"
import { isNullOrUndefined } from "util";
import { useAppSelector } from "../../../hooks";
import { IQueueCombined } from "../../../stores/UserWebsiteStore";
import { parseWBTCBalanceV2 } from "../../../utils/web3_utils";


const BackDrop = styled.div`
  // text-align: center;
  // display: flex;
  // flex-direction: row;
`;

const PrizeTextDiv = styled.div`
  margin-top: 90px;
  background-color: #000000a7;

  display: flex;
  flex-direction: column;

  background-color: #000000a7;
  border-bottom: 5px solid #000000;
  border-top: 5px solid #000000;
`

const PrizeTextDiv1 = styled.div`
  margin-top: 90px;
  background-color: #000000a7;
  // background-color: #4242c7;
  width: 200px;

  // display: flex;
  // flex-direction: row;

  border-left: 5px solid #000000;
  border-top: 5px solid #000000;
  border-bottom: 5px solid #000000;
  float: right;
`

const PrizeTextDiv2 = styled.div`
  margin-top: 90px;
  // background-color: #4242c7;
  width: 200px;

  // display: flex;
  // flex-direction: row;

  background-color: #000000a7;
  border-right: 5px solid #000000;
  border-top: 5px solid #000000;
  border-bottom: 5px solid #000000;
`

const GridItem = styled.div`

`

export function PlayersPrizeMoney() {
  // const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  // const p1_total_bet = useAppSelector((state) => state.fightInfoStore.win_pot_p1)
  // const p2_total_bet = useAppSelector((state) => state.fightInfoStore.win_pot_p2)

  const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
  const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
  let p1_self_bet = 0;
  let p2_self_bet = 0;
  if (combinedQueueData.length > 0) {
    combinedQueueData.map((data: IQueueCombined, index) => {
      if (index > 0) {
        return
      }
      const tempQueueDetailInfo = queueDetailsInfo[data.fight_id];
      if (!isNullOrUndefined(tempQueueDetailInfo)) {
        p1_self_bet = tempQueueDetailInfo.self_bet_p1? tempQueueDetailInfo.win_pot_p1: 0;
        p2_self_bet = tempQueueDetailInfo.self_bet_p2? tempQueueDetailInfo.win_pot_p2: 0;
      }
    })
  }
  return (
    <BackDrop>
      <Grid container spacing={0}>
        <Grid item xs={5.5}>
          <PrizeTextDiv1 className="prize_text_below_health_bar"
            style={{
              justifyContent: 'flex-start',
            }}
          >
              {parseWBTCBalanceV2(p1_self_bet.toString())}
          </PrizeTextDiv1>
        </Grid>
        <Grid item xs={1}>
          <PrizeTextDiv className="prize_text_below_health_bar_1"
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
        </Grid>
        <Grid item xs={5.5}>
          <PrizeTextDiv2 className="prize_text_below_health_bar"
            style={{
              justifyContent: 'flex-start',
              paddingLeft: '20px'
            }}
          >
              {parseWBTCBalanceV2(p2_self_bet.toString())}
          </PrizeTextDiv2>
        </Grid>
      </Grid>
      
    </BackDrop>
  )
}