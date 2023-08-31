import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { LinearProgress } from "@mui/material"
// import { OpenAtmView } from "../../stores/UserActions";
import { useState } from "react";
import { depositMoneyToWalletV2 } from "../../contract";
import store from "../../stores";
import AtmViewBox from "./MenuComponents/AtmViewBox";
import { convertWBTCToBigIntWithDecimlas, getBalances } from "../../utils/web3_utils";
import SuccessSnackBarHelper from "../../landing-page/SuccessSnackBarHelper";
import ErrSnackBarHelper from "../../landing-page/ErrSnackBarHelper";
import { fetchPlayerWalletInfo, redeemPlayerBalance, updateWalletBalanceWithWeb3 } from "../../hooks/ApiCaller";
import { isNullOrUndefined } from "util";
import { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } from "../../stores/NotificationStore";


const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #00000;
    font-family: Monospace;
    font-style: bold;
    font-size: 25px;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const Backdrop = styled.div`
  position: fixed;
  top: 20%;
  left: 30%;
  width: 40%;
  // max-height: 40%;
  // max-width: 60%;
`

const vertical= 'bottom';
const horizontal = 'center';

export function ATMView() {
  
  const openAtmView = useAppSelector((state) => state.userActionsDataStore.openAtmView)
  const [amount, setAmount] = useState(0);
  const [addMoneyBool, setaddToQueueBool] = useState(false)
  const [adMoneyState, setAddMoneyState] = useState("")
  const dispatch = useAppDispatch();

  const [snackBarOpen , setSnackBarOpen] = useState(false);
  const [errsnackBarOpen , setErrSnackBarOpen] = useState(false);
  const [successSnackBarMessage, setSuccessSnackBarMessage] = useState("");
  const [errSnackBarMessage, setErrSnackBarMessage] = useState("");

  const handleClose = () => {
    setSnackBarOpen(false);
  };

  const errSnackBarHandleClose = () => {
    setErrSnackBarOpen(false);
  };


  // const { height } = Utils();
  // const game = phaserGame.scene.keys.game as Game
  // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  
  const closeDialogMenu = () => {
    console.log("click happened .. ")
    if (store.getState().userActionsDataStore.openAtmView) {
      // dispatch(OpenAtmView(false))
    }
  }

  const AddMoneyToWallet = async () => {
    console.log("amount ", amount)
    if (amount <= 0) {
      return
    }
    setaddToQueueBool(true)
    setAddMoneyState("Adding to wallet")
    const done = await depositMoneyToWalletV2(convertWBTCToBigIntWithDecimlas(amount))
    if (done) {
      // crypto success.
      // validate in api service and update db
      setSnackBarOpen(true)
      setSuccessSnackBarMessage("Updating Balance")
      const updatedBBool = await updateWalletBalanceWithWeb3()
      if (updatedBBool) {
        const check = await fetchPlayerWalletInfo();
        if (check) {
          setSuccessSnackBarMessage("Updated Balance")
        } else {
          setSnackBarOpen(false)
          setErrSnackBarOpen(true)
        }
      }

      
    } else {
      setErrSnackBarOpen(true)
    }

    await getBalances(store.getState().web3store.userAddress)
    setAmount(0)
    setaddToQueueBool(false)
    setAddMoneyState("")
  }

  const RemoveFromWallet = async () => {
    console.log("amount ", amount)
    if (amount === 0) {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Enter amount")
      return
    }
    // await add
    setaddToQueueBool(true)
    setAddMoneyState("Removing from wallet")

    const done = await redeemPlayerBalance(convertWBTCToBigIntWithDecimlas(amount).toString())
    console.log("debug_redeem ", done)
    if (!isNullOrUndefined(done) && done.done) {
      // setSnackBarOpen(true)
      // setSuccessSnackBarMessage("Updating Balance")

      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage("Updating Balance"))

      const check = await fetchPlayerWalletInfo();
      if (check) {
        setSuccessSnackBarMessage("Updated Balance")
        store.dispatch(SetSuccessNotificationMessage("Updated Balance"))
      } else {
        // setSnackBarOpen(false)
        // setErrSnackBarOpen(true)

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Error"))
      }
    } else {
      console.log("debug_redeem ", "here")
      console.log("debug_redeem ", done?.error.reason)
      // setErrSnackBarOpen(true)
      // setErrSnackBarMessage(done?.error)

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage(done?.error.reason))
    }
    setAmount(0)
    await getBalances(store.getState().web3store.userAddress)
    setaddToQueueBool(false)
    setAddMoneyState("")
  }

  return(
    <div className="atm-box" >
      {
        openAtmView && 
        <div>
          {/* <SuccessSnackBarHelper 
            open= {snackBarOpen}
            message={successSnackBarMessage}
            handleClose={handleClose}
          />
          <ErrSnackBarHelper 
            open= {errsnackBarOpen}
            message={errSnackBarMessage}
            handleClose={errSnackBarHandleClose}
          /> */}
          
          <Backdrop>
            <AtmViewBox 
              closeFunction={closeDialogMenu} 
              setAmount={setAmount} 
              amount={amount} 
              AddMoneyToWallet={AddMoneyToWallet} 
              RemoveFromWallet={RemoveFromWallet} 
            />
            {
              (addMoneyBool) && 
              <ProgressBarWrapper>
                <h3> {adMoneyState} </h3>
                <ProgressBar color="primary" />
              </ProgressBarWrapper>
            }
          </Backdrop>
        </div>
      }
    </div>
  )
}