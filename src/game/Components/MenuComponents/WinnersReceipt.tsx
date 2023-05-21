// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box } from "@mui/material"
// import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { IQueueCombined, ShowWinnerCardAtFightEnd } from '../../../stores/UserWebsiteStore';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import store from '../../../stores';
import { isNullOrUndefined } from 'util';



const Wrapper = styled.div`
  padding: 50px;
`

const CustomBox = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 10px solid #000000;
  border-radius: 10px;
  // padding: 20px;


  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h1 {
    font-family: Monospace;
    font-style: bold;
    font-size: 40px;
    color: white;
    line-height: 75%;
    padding: 40px;
  }

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: white;
    line-height: 75%;
  }

  h4 {
    font-family: Monospace;
    font-style: bold;
    font-size: 16px;
    color: white;
    line-height: 75%;
  }

  h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 30px;
    color: white;
    line-height: 75%;
    padding-top: 20px;
  }

  input {
    color: black;
  }
`

const Backdrop = styled.div`
  margin: auto;
  max-height: 25%;
  max-width: 40%;
`

const MyDivider = styled.hr`
  border-top: 6px solid #bbb;
  border-radius: 2px;
`

const DottedDivider = styled.hr`
  border-top: 3px dotted #bbb;
`

const Header = styled.div`

`

const TextInfo = styled.div`
  // diplay: flex;
  // flex-direction: column;
  // align-items: flex-start;
  // justify-content: flex-start;
  padding: 10px;
  text-align: left;
`




export default function WinnersReceipt() {
  const showWinnersCardBool = useAppSelector((state) => state.userPathStore.showWinnerCardAtFightEnd);
  // const p1_total_bet = useAppSelector((state) => state.fightInfoStore.total_bet_p1)
  // const p2_total_bet = useAppSelector((state) => state.fightInfoStore.total_bet_p2)

  // const p1_self_bet = useAppSelector((state) => state.fightInfoStore.self_bet_p1)
  // const p2_self_bet = useAppSelector((state) => state.fightInfoStore.self_bet_p2)

  // const p1_win_pot = useAppSelector((state) => state.fightInfoStore.win_pot_p1)
  // const p2_win_pot = useAppSelector((state) => state.fightInfoStore.win_pot_p2)

  // const p1 = useAppSelector((state) => state.fightInfoStore.player1)
  // const p2 = useAppSelector((state) => state.fightInfoStore.player2)

  const fight_winner = useAppSelector((state) => state.fightInfoStore.fight_winner)

//   export interface QueueSingleEntry {
//   fight_id: string,

//   total_bet_p1: number,
//   total_bet_p2: number,

//   player1_end_health: number;
//   player2_end_health: number;

//   win_pot_p1: number,
//   win_pot_p2: number,

//   player1: string,
//   player2: string,

//   self_bet_p1: number,
//   self_bet_p2: number,

//   fight_winner: string,
// }

  const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
  const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
  let p1_win_pot = 0;
  let p2_win_pot = 0;
  let p1_self_bet = 0;
  let p2_self_bet = 0;

  let p1 = "";
  // let p2 = "";
  if (combinedQueueData.length > 0) {
    combinedQueueData.map((data: IQueueCombined, index) => {
      if (index > 0) {
        return
      }
      const tempQueueDetailInfo = queueDetailsInfo[data.fight_id];
      if (!isNullOrUndefined(tempQueueDetailInfo)) {
        p1_win_pot = tempQueueDetailInfo.win_pot_p1? tempQueueDetailInfo.win_pot_p1: 0;
        p2_win_pot = tempQueueDetailInfo.win_pot_p2? tempQueueDetailInfo.win_pot_p2: 0;

        p1_self_bet = tempQueueDetailInfo.self_bet_p1? tempQueueDetailInfo.self_bet_p1: 0;
        p2_self_bet = tempQueueDetailInfo.self_bet_p2? tempQueueDetailInfo.self_bet_p2: 0;

        p1 = tempQueueDetailInfo.player1? tempQueueDetailInfo.player1: "";
      }
    })
  }

  // showWinnersCardBool = true
  const closeDialogMenu = () => {
    console.log("quit happened .. ")
    dispatch(ShowWinnerCardAtFightEnd(false))
    fetchPlayerWalletInfo()
    // dispatch(HitFightMachine(false))
  }
  // const ref = useDetectClickOutside({ onTriggered: closeDialogMenu });
  const dispatch = useAppDispatch()
  return(
    <div>
      {showWinnersCardBool && <Backdrop 
        onClick={() => {
          closeDialogMenu()
        }}
        // ref={ref}
      >
        <Wrapper 
          onMouseOver={() => {
            dispatch(TurnMouseClickOff(true))
          }}
          onMouseOut={() =>{ 
            dispatch(TurnMouseClickOff(false))
          }}
        >
          <CustomBox>
              <Header>
                <h3>You win</h3>
              <MyDivider />
            </Header>
            <Header>
              <h2>
                Genesis HQ - Level 5 - Fight!
              </h2>
            </Header>
            <MyDivider />

            <TextInfo>
                <h4> Your Ante: 1000 bits</h4>
                <h4> Their Ante: 1000 bits</h4>
                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Your Max Bet: { parseWBTCBalanceV3(p1_self_bet) } bits</h4>:
                    <h4>Their Max Bet: { parseWBTCBalanceV3(p2_self_bet) } bits </h4>
                  }
                </div>
                

                <div>
                  {
                    (store.getState().web3store.userAddress !== store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Your Max Bet: { parseWBTCBalanceV3(p2_self_bet) } bits</h4>:
                    <h4>Their Max Bet: { parseWBTCBalanceV3(p1_self_bet) } bits </h4>
                  }
                </div>
            </TextInfo>
            <DottedDivider />

            <TextInfo>
                <h4> 3% BLDG</h4>
                <h4> 3% GANG</h4>
                <h4> 1% Treasury</h4>
                <h4> 5% System</h4>
                <h4> 1% Prize Pool</h4>
                <h4> 1% JackPot</h4>

            </TextInfo>
            <DottedDivider />

             <div>
              {
                fight_winner === p1 ?
                <h1> Get { parseWBTCBalanceV3(p1_win_pot) } bits </h1>:
                <h1> Get { parseWBTCBalanceV3(p2_win_pot) } bits </h1>
              }
            </div>
            
          </CustomBox>
        </Wrapper>
      </Backdrop>}
    </div>
  )
}