import styled from 'styled-components'
import { Box, Button, CircularProgress } from "@mui/material"
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { ShowBrewEjectAnimation, TurnMouseClickOff } from '../../../stores/UserActions';
import { useState } from 'react';
import phaserGame from '../../../PhaserGame';
import Bootstrap from '../../scenes/Bootstrap';
import Game from '../../scenes/Game';
import store from '../../../stores';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } from '../../../stores/NotificationStore';
import { fetchPlayerWalletInfo, purchaseAssets } from '../../../hooks/ApiCaller';

const Wrapper = styled.div`
  position: absolute;
  top: 25%;
  left: 40%;
  // padding: 16px;
`

const FriendRequestBox = styled(Box)`
  // width: 20%;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 20px;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h2, h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 21px;
    color: white;
    line-height: 75%;
  }

  input {
    color: black;
  }
`

const MyDivider = styled.div`
  border: 2px solid #000000;
  margin-bottom: 10px;
`;

export default function InGameAssetPurchase() {
  // const queueData = useAppSelector((state) => state.userPathStore.QueueData)
  // const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
  const dispatch = useAppDispatch()
  const brewMachinePunched = useAppSelector((state) => state.userActionsDataStore.brewMachinePunched)
  const inGameAssets = useAppSelector((state) => state.assetStore.assets)
  // console.log('brew InGameAssetPurchase', brewMachinePunched, inGameAssets)
  const [transactionStarted, setTransactionStarted] = useState(false);
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const game = phaserGame.scene.keys.game as Game;
  const [quantity, setQuantity] = useState(1);
  // const game = phaserGame.scene.keys.game as Game

  // const closeFunction = () => {
  //   // store.dispatch(BrewMachinePunched(false))
  //   dispatch(TurnMouseClickOff(false))
  // }

  // const ref = useDetectClickOutside({ onTriggered: closeFunction });
  
  const AssetBuyer = async () => {
    setTransactionStarted(true)
    console.log('brew ----- 333', quantity, store.getState())

    if (quantity > 9) {
      setTimeout(() => {
        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Quantity should be less than 9"))
        bootstrap.play_err_sound()
        setTransactionStarted(false)
      }, 200);
      return;
    }
    if (quantity <=0) {
      setTimeout(() => {
        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Quantity should be gt 0"))
        bootstrap.play_err_sound()
        setTransactionStarted(false)
      }, 200);
      return;
    }
    const result = await purchaseAssets(quantity, "brew")
    if (result?.success) {
      console.log(" brew asset bought ..")
      setTimeout(() => {
        dispatch(ShowBrewEjectAnimation(true))
        store.dispatch(SetSuccessNotificationBool(true))
        store.dispatch(SetSuccessNotificationMessage(`${quantity} BREWs have been purchased`))
        bootstrap.play_err_sound()
        fetchPlayerWalletInfo(false, "ingameassetprchase");
      }, 500)
    } else {
      setTimeout(() => {
        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage(result?.error))
        bootstrap.play_err_sound()
      }, 200);
    }

    setTimeout(() => {
      setTransactionStarted(false)
    }, 1000)
    
  }

  const closeFunction = () => {
    // store.dispatch(BrewMachinePunched(false))
    dispatch(TurnMouseClickOff(false))
  }

  const ref = useDetectClickOutside({ onTriggered: closeFunction });

  return(
    <div 
      ref={ref}
      onMouseOver={() => {
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() =>{ 
        dispatch(TurnMouseClickOff(false))
      }}
      // onMouseLeave={() =>{ 
      //   dispatch(TurnMouseClickOff(false))
      // }}
      // onMouseDown={() =>{ 
      //   dispatch(TurnMouseClickOff(true))
      // }}
    >
      {brewMachinePunched && 
      <Wrapper>
        <FriendRequestBox>
          <h2> BREW </h2>
          <MyDivider></MyDivider>
          {/* <h3> How Many? </h3>

          <h3>
            <input type="number" 
              placeholder='quantity' 
              value={quantity}
              onChange={(e) => {
                if (e.target.value === "") {
                  setQuantity(0)
                } else {
                  if (e.target.value.length > 0 && parseInt(e.target.value) < 10) {
                    setQuantity(parseInt(e.target.value))
                    console.log("quantity ,,, ", quantity, parseInt(e.target.value))
                  }
                }
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px'
              }}
            >
            </input></h3> */}
          <h3 style={{marginBottom: '20px'}}>Price: 5 Bits</h3>
          <h3 style={{marginBottom: '20px'}}>Total BITS: {parseWBTCBalanceV3(500 * quantity)}</h3>
          {transactionStarted?
            <Button 
            variant="contained" 
            color="primary"
            onClick={() => AssetBuyer()}
          >
            <span style={{
              color: 'aliceblue',
            }}><CircularProgress /></span>
          </Button>
            
          :<Button 
            variant="contained" 
            color="primary"
            onClick={() => AssetBuyer()}
          >
            <span style={{
              color: 'aliceblue',
            }}>OK!</span>
          </Button>}
          
        </FriendRequestBox>
      </Wrapper>}

    </div>
  )
}