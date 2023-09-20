

import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SetMouseClickControlInventory } from '../../../stores/UserActions';
import { useState } from 'react';
import { Inventory } from './Inventory';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import store from '../../../stores';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore';
import { useAssetsApi } from '../../../hooks/ApiCaller';
import { SetEquippedBrewCount } from '../../../stores/AssetStore';
import phaserGame from '../../../PhaserGame';
import Game from '../../scenes/Game';



const Backdrop = styled.div`
  position: fixed;
  z-index: 100;
  // display: flex;
  // flex-direction: column;
`

const WrapperSecondDiv = styled.div`
  position: fixed;
  left: 6%;
  top: 7%;
`

const WrapperThirdDiv = styled.div`
  position: fixed;
  left: 8%;
  top: 7%;
`

const Wrapper = styled.div`
  background-color: #3B3B3B;
  padding: 10px;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  gap: 20px;

  // background: #222639;
  // box-shadow: 0px 0px 5px #0000006f;
  // border-radius: 16px;
  // padding: 15px 35px 15px 15px;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
`



const BitsView = styled.div`

  span {
    font-family:'Cooper Black', sans-serif;
    // font-style: bold;
    font-size: 20px;
    color: white;
  }

  h2, h3 {
    font-family:'Cooper Black', sans-serif;
    // font-style: bold;
    font-size: 25px;
    color: white;
    line-height: 75%;
  }
`

const PosNumberHighlight = styled.div`
  font-family: Monospace;
  font-style: bold;
  font-size: 20px;
  color: #3fe038;
  font-family: Monospace;
  font-style: bold;
  font-size: 35px;
`;

const NegNumberHighlight = styled.div`
  font-family: Monospace;
  font-style: bold;
  font-size: 20px;
  color: red;
  font-family: Monospace;
  font-style: bold;
  font-size: 22px;
`;

export function InventoryView() {
  // const bitsBalance = useAppSelector((state) => state.userPathStore.bitsBalance)
  const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance)
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  const changeInBalanceBool = useAppSelector((state) => state.web3BalanceStore.changeBalanceShowBool)
  const changeInBalance = useAppSelector((state) => state.web3BalanceStore.changeInBalance)
  const [lastEquipTime, setLastequipTime] = useState(0);
  const dispatch = useAppDispatch()
  const [inventoryState, setInventoryState] = useState("basic")
  const assetsInfo = useAppSelector((state) => state.assetStore.assets)
  const game = phaserGame.scene.keys.game as Game;
  const [showButtonGroupBool, setShowButtonGroupBool] = useState(false);
  

  function closeView() {
    console.log("debug_inventory... clicked outside")
    setInventoryState("basic")
    // setShowButtonGroupBool(false)
  }

  const ref = useDetectClickOutside({ onTriggered: closeView });

  async function useBrew() {
    // console.log("debug_equip_brew...", data)
    if (new Date().getTime() - lastEquipTime <= 5 * 1000) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Wait 5 seconds before drinking again"))
      setShowButtonGroupBool(true)
      setInventoryState(inventoryState)
      return
    }
    setLastequipTime(new Date().getTime())
    store.dispatch(SetMouseClickControlInventory(false))

    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
    // return
    const res = await useAssetsApi("brew")
    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
    if (res) {
      setTimeout(() => {
        game.lobbySocketConnection.send(JSON.stringify({
          event: "brew_used",
          walletAddress: store.getState().web3store.userAddress,
          force: true
        }));
      }, 1000);
    }  else {
      setTimeout(() => {
        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Failed to use Brew"))
      }, 300);
    }
    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
  }

  async function equipBrew() {
    console.log("debug_equip_brew...")
    if (new Date().getTime() - lastEquipTime <= 5 * 1000) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Wait 5 seconds before equip again"))

      setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
      return
    }
    setLastequipTime(new Date().getTime())
    store.dispatch(SetMouseClickControlInventory(false))

    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
    
    if (store.getState().assetStore.equippedBrewCount > 0) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Not Allowed"))
    } else {
      // store.dispatch(SetEquippedBrewCount(1))
      const res = await useAssetsApi("brew")
      if (res) {
        store.dispatch(SetEquippedBrewCount(1))
        // send an message to 
        const temp = game.otherPlayers.get(store.getState().web3store.player_id)
        if (temp?.gameObject) {
          game.lobbySocketConnection.send(JSON.stringify({
            event: "semi_equip_brew",
            walletAddress: store.getState().web3store.userAddress,
            minted_id: temp.minted_id,
          }))
        }
      } else {
        setTimeout(() => {
          store.dispatch(SetFailureNotificationBool(true))
          store.dispatch(SetFailureNotificationMessage("Failed to Equip Brew"))
        }, 300);
      }
    }

    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
  }
    

  return (
    <div ref={ref}>
      <Backdrop
        onMouseOver={() => {
          dispatch(SetMouseClickControlInventory(true))
        }}
        onMouseOut={() =>{ 
          dispatch(SetMouseClickControlInventory(false))
        }}
      >
        <Wrapper>
          <BitsView>
            <span> { parseWBTCBalanceV3(web2_credit_balance) }  bits </span>
          </BitsView>

          <img 
            src="assets/money-bag.png" 
            alt="Cinque Terre" 
            height="35" 
            width="25"
            onClick={() => {
              if (
                fightersInfo.fightStarted 
                &&( 
                  fightersInfo.player1.walletAddress === store.getState().web3store.userAddress ||
                  fightersInfo.player2.walletAddress === store.getState().web3store.userAddress
                )
              ) {
                store.dispatch(SetFailureNotificationBool(true))
                store.dispatch(SetFailureNotificationMessage("Not Allowed during fight"))
                return
              }
              setInventoryState("inventory_view")
            }}
          ></img>
        </Wrapper>

        <WrapperSecondDiv>
          {
            (inventoryState === "inventory_view") ?
              <Inventory
                lastEquipTime = {lastEquipTime}
                setLastequipTime={setLastequipTime}
                assetsInfo = {assetsInfo}
                useBrew = {useBrew}
                equipBrew = {equipBrew}
                showButtonGroupBool = {showButtonGroupBool}
                setShowButtonGroupBool = {setShowButtonGroupBool}
              />:
              <></>
          }
        </WrapperSecondDiv>

        <WrapperThirdDiv>
          {
            changeInBalanceBool?
            <>
              {
                parseInt(changeInBalance) > 0?
                <PosNumberHighlight>
                  +{parseWBTCBalanceV3(parseInt(changeInBalance))}
                </PosNumberHighlight>
                :
                <NegNumberHighlight>
                  {parseWBTCBalanceV3(parseInt(changeInBalance))}
                </NegNumberHighlight>
              }
            </>:<></>
          }
        </WrapperThirdDiv>

      </Backdrop>
    </div>
  )
}