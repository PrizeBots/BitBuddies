import styled from 'styled-components'
import { Box, Modal } from "@mui/material"
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { IQueueCombined, ShowWinnerCardAtFightEnd } from '../../../stores/UserWebsiteStore';
import { parseWBTCBalanceV3, parseWBTCBalanceV4 } from '../../../utils/web3_utils';
import store from '../../../stores';
import { isNullOrUndefined } from 'util';
import { useDetectClickOutside } from "react-detect-click-outside";

const ModalWrapper = styled.div`
`


const ModalBoxWrapper = styled(Box)`
  background: #111B28;
  border: 10px solid #000000;
  border-radius: 10px;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-left: 35%;
  margin-top: 5%;
  // transform: 'translate(-50%, -50%)',

  button {
    margin: 20px;
    border: 4px solid #000000;
    border-radius: 5px;
  }

  h2 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 40px;
    color: aliceblue;
    line-height: 75%;
  }

  h3 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: grey;
    line-height: 75%;
    padding-bottom: 10px;
  }
`

const Wrapper = styled.div`
  padding: 50px;
`

const CustomBox = styled(Box)`
  // width: 100%;
  // overflow: auto;
  // opacity: 0.9;
  // background: #2c2c2c;
  // border: 10px solid #000000;
  // border-radius: 10px;
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
  max-width: 25%;
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


let lastP1 = ""
let lastP2 = ""

let p1 = "";
let p2 = "";

let p1_win_pot = 0;
let p2_win_pot = 0;
let p1_self_bet = 0;
let p2_self_bet = 0;
let p1_total_tips = 0;
let p2_total_tips = 0;


export default function NewWinnersReceipt() {

  const showWinnersCardBool = useAppSelector((state) => state.userPathStore.showWinnerCardAtFightEnd);
  const fight_winner = useAppSelector((state) => state.fightInfoStore.fight_winner)
  const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
  const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)


  let updateOrNot = true;
  // let lastUpdated = 0;

  if (
    lastP1 === store.getState().web3store.userAddress 
    || lastP2 === store.getState().web3store.userAddress
  ) {
    // if (queueDetailsInfo.win_pot_p1 !== 0 && queueDetailsInfo.win_pot_p2 !== 0) {
    //   updateOrNot = true;
    // } else {
    //   updateOrNot = false;
    // }
    if (p1_win_pot  === 0 || p2_win_pot ===0) {
      updateOrNot = true;
    }
  } else {
    updateOrNot = true;
    // lastUpdated = new Date().getTime()
  }

  // console.log("debug--11 ", updateOrNot, p1, p2, store.getState().web3store.userAddress, combinedQueueData.length )
  if (combinedQueueData.length > 0 && updateOrNot ) {
    combinedQueueData.map((data: IQueueCombined, index) => {
      if (index > 0) {
        return
      }
      const tempQueueDetailInfo = queueDetailsInfo[data.fight_id];
      if (!isNullOrUndefined(tempQueueDetailInfo)) {
        p1_win_pot = tempQueueDetailInfo.win_pot_p1? tempQueueDetailInfo.win_pot_p1: 0;
        p2_win_pot = tempQueueDetailInfo.win_pot_p2? tempQueueDetailInfo.win_pot_p2: 0;
        
        p1_total_tips = tempQueueDetailInfo.total_tip_p1? tempQueueDetailInfo.total_tip_p1: 0;
        p2_total_tips = tempQueueDetailInfo.total_tip_p2? tempQueueDetailInfo.total_tip_p2: 0;

        p1_self_bet = tempQueueDetailInfo.self_bet_p1? tempQueueDetailInfo.self_bet_p1: 0;
        p2_self_bet = tempQueueDetailInfo.self_bet_p2? tempQueueDetailInfo.self_bet_p2: 0;

        p1 = tempQueueDetailInfo.player1? tempQueueDetailInfo.player1: "";
        p2 = tempQueueDetailInfo.player2? tempQueueDetailInfo.player2: "";

          // setP1Info({
          //   address: tempQueueDetailInfo.player1? tempQueueDetailInfo.player1: "",
          //   win_pot: tempQueueDetailInfo.win_pot_p1? tempQueueDetailInfo.win_pot_p1: 0,
          //   self_bet: tempQueueDetailInfo.self_bet_p1? tempQueueDetailInfo.self_bet_p1: 0,
          // })

          // setP2Info({
          //   address: tempQueueDetailInfo.player2? tempQueueDetailInfo.player2: "",
          //   win_pot: tempQueueDetailInfo.win_pot_p2? tempQueueDetailInfo.win_pot_p2: 0,
          //   self_bet: tempQueueDetailInfo.self_bet_p2? tempQueueDetailInfo.self_bet_p2: 0,
          // })
        lastP1 = p1;
        lastP2 = p2;
      }
    })
  }
  // console.log("debug--22 ", updateOrNot, p1, p2, store.getState().web3store.userAddress, combinedQueueData.length )

  // console.log("debug___receipt__", p1, p2_win_pot, p1_win_pot, p1_self_bet, p2_self_bet)

  // showWinnersCardBool = true
  const closeDialogMenu = () => {
    // console.log("quit happened .. ")
    dispatch(ShowWinnerCardAtFightEnd(false))
    // fetchPlayerWalletInfo(false, "winner receipt ")
  }

  const handleModalClose = () => {
    console.log("handle modal close in winrecipt..")
    dispatch(ShowWinnerCardAtFightEnd(false))
    fetchPlayerWalletInfo(false, "winner receipt ")
    // store.dispatch(SetLeaderBoardOpen(false))
  };

  const ref = useDetectClickOutside({ onTriggered: closeDialogMenu });
  const dispatch = useAppDispatch();
  return(
    <ModalWrapper>
      <Modal
        open={showWinnersCardBool}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <ModalBoxWrapper>
        <Wrapper>
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
                <h4> Your Ante: 100 bits</h4>
                <h4> Their Ante: 100 bits</h4>
                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Your Max Bet: { parseWBTCBalanceV3(p1_win_pot - p1_self_bet - p1_total_tips - 10000) } bits</h4>:
                    <h4>Their Max Bet: { parseWBTCBalanceV3(p2_win_pot - p2_self_bet -p2_total_tips - 10000) } bits </h4>
                  }
                </div>
                
                <div>
                  {
                    (store.getState().web3store.userAddress !== store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Your Max Bet: { parseWBTCBalanceV3(p1_win_pot - p1_self_bet - p1_total_tips - 10000) } bits</h4>:
                    <h4>Their Max Bet: { parseWBTCBalanceV3(p2_win_pot - p2_self_bet - p2_total_tips- 10000) } bits </h4>
                  }
                </div>

                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Your Total Tip: { parseWBTCBalanceV3(p1_total_tips) } bits</h4>:
                    <h4>Your Total Tip: { parseWBTCBalanceV3(p2_total_tips) } bits </h4>
                  }
                </div>

                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Total Prize: { parseWBTCBalanceV3(p1_win_pot) } bits</h4>:
                    <h4>Total Prize: { parseWBTCBalanceV3(p2_win_pot) } bits </h4>
                  }
                </div>
                
            </TextInfo>
            <DottedDivider />

            <TextInfo>
              {
                fight_winner === p1 ?
                <>
                  <h4> 10% PPS - {(parseWBTCBalanceV4(p1_win_pot) * 0.1).toFixed(2)} </h4>
                  <DottedDivider />
                  <h4> 2% BLDG - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 2% GANG - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 2% Treasury - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 2% System - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 1% Prize Pool - {(parseWBTCBalanceV4(p1_win_pot) * 0.01).toFixed(2)} </h4>
                  <h4> 1% JackPot - {(parseWBTCBalanceV4(p1_win_pot) * 0.01).toFixed(2)} </h4>
                  <DottedDivider />
                </>:
                <>
                  <h4> 10% PPS - {(parseWBTCBalanceV4(p2_win_pot) * 0.1).toFixed(2)} </h4>
                  <DottedDivider />
                  <h4> 2% BLDG - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 2% GANG - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 2% Treasury - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 2% System - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(2)} </h4>
                  <h4> 1% Prize Pool - {(parseWBTCBalanceV4(p2_win_pot) * 0.01).toFixed(2)} </h4>
                  <h4> 1% JackPot - {(parseWBTCBalanceV4(p2_win_pot) * 0.01).toFixed(2)} </h4>
                  <DottedDivider />
                </>
              }
            </TextInfo>
            <DottedDivider />

             <div>
              {
                fight_winner === p1 ?
                <h1> Get { parseWBTCBalanceV3(0.9 * p1_win_pot) } bits </h1>:
                <h1> Get { parseWBTCBalanceV3(0.9 * p2_win_pot) } bits </h1>
              }
            </div>
            
          </CustomBox>
        </Wrapper>
      </ModalBoxWrapper>
      </Modal>
    </ModalWrapper>
  )
}