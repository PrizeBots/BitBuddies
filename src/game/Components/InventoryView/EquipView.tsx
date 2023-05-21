

import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { useDetectClickOutside } from 'react-detect-click-outside';
// import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';

import { v4 as uuidv4 } from 'uuid';

const Backdrop = styled.div`
  position: fixed;
  bottom: 0%;
  left: 44%;
  width: 12%;
  background-color: aliceblue;
  text-align: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-style: solid;
  border-width: 2px;
  gap: 20px;
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


export function EquipView() {
  const equippedBrewCount = useAppSelector((state) => state.assetStore.equippedBrewCount)
  const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance)
  const dispatch = useAppDispatch()
  // equippedBrewCount = 1;

  function closeView() {
    // setInventoryState("basic")
  }

  const ref = useDetectClickOutside({ onTriggered: closeView });

  return (
    <div>
      {equippedBrewCount > 0 && <Backdrop
        ref={ref}
        onMouseOver={() => {
          dispatch(TurnMouseClickOff(true))
        }}
        onMouseOut={() =>{ 
          dispatch(TurnMouseClickOff(false))
        }}
      >
        <Wrapper>
          <BitsView>
            <span>
              Press Q to Equip
            </span>
          </BitsView>
          <div style={{
            paddingRight: '10px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src="bitfgihter_assets/brew/brew-can.png" 
              alt="." 
              height="35" 
              width="15"
              key={uuidv4()}
            ></img>
          </div>
          

          
        </Wrapper>
      </Backdrop>}
    </div>
  )
}