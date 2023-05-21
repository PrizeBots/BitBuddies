

import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { useState } from 'react';
import { Inventory } from './Inventory';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';



const Backdrop = styled.div`
  position: fixed;
  // left: 0%;
  // margin: auto;
  // margin-top: 10px;
`

const WrapperSecondDiv = styled.div`
  position: fixed;
  left: 5%;
  top: 7%;
`

const WrapperThirdDiv = styled.div`
  position: fixed;
  left: 8%;
  top: 7%;
`

const Wrapper = styled.div`
  // display: flex;
  // flex-direction: column;
  
  // opacity: 0.8;
  // align-items: center;
  // justify-content: center;

  background-color: aliceblue;
  padding: 10px;
  border-style: solid;
  border-width: 2px;
  gap: 20px;
`

const TextDiv = styled.div`
  font-family: Monospace;
  font-size: 1.5em;
  font-weight: 550;
  padding-left: 5px;
`

const BitsView = styled.div`
  // width: 10%%;
  // overflow: auto;
  // opacity: 0.9;
  // background: #2c2c2c;
  // border: 5px solid #000000;
  // border-radius: 10px;
  // padding: 20px;
  // background-color: red;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: black;
  }

  h2, h3 {
    font-family: Monospace;
    font-style: bold;
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
  const bitsBalance = useAppSelector((state) => state.userPathStore.bitsBalance)
  const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance)
  const changeInBalanceBool = useAppSelector((state) => state.web3BalanceStore.changeBalanceShowBool)
  const changeInBalance = useAppSelector((state) => state.web3BalanceStore.changeInBalance)
  const dispatch = useAppDispatch()
  const [inventoryState, setInventoryState] = useState("basic")

  function closeView() {
    setInventoryState("basic")
  }

  const ref = useDetectClickOutside({ onTriggered: closeView });

  let viewToRender = <></>
  if (inventoryState === "inventory_view" ){
    viewToRender = <Inventory />
  }
    

  return (
    <Backdrop
      ref={ref}
      onMouseOver={() => {
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() =>{ 
        dispatch(TurnMouseClickOff(false))
      }}
    >
      <Wrapper>
        {/* <img 
          src="assets/wallet.png" 
          alt="Cinque Terre" 
          height="35" 
          width="35"
          onClick={() =>  setInventoryState("wallet_view")}
        ></img> */}

        <BitsView>
          <span> { parseWBTCBalanceV3(web2_credit_balance) }  bits </span>
        </BitsView>

        <img 
          src="assets/money-bag.png" 
          alt="Cinque Terre" 
          height="35" 
          width="25"
          onClick={() =>  setInventoryState("inventory_view")}
        ></img>
      </Wrapper>

      <WrapperSecondDiv>
        {viewToRender}
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
          </>
          :
          <></>
        }
      </WrapperThirdDiv>

      {/* <WrapperThirdDiv>
        {
          <>
            {
              parseInt("1000") > 0?
              <PosNumberHighlight>
                +{parseWBTCBalanceV3(parseInt("1000"))}
              </PosNumberHighlight>
              :
              <NegNumberHighlight>
                {parseWBTCBalanceV3(parseInt("1000"))}
              </NegNumberHighlight>
            }
          </>
        }
      </WrapperThirdDiv> */}
    
      
    </Backdrop>
  )
}