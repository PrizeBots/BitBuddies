// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { parseWBTCBalanceV2, parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { getEllipsisTxt } from '../../../utils';
import store from '../../../stores';

const Wrapper = styled.div`
  position: relative;
  // height: 100%;
  // padding: 16px;
`

const TableWrapper = styled.div`
  th, td {
    border: 2px solid #000;
  }

  th {
    font-size: 20px;
  }

  td {
    font-size: 30px;
    color: blue;
  }

  input::placeholder {
    font-size: 20px;
  }

  margin-left: auto;
  margin-right: auto;

  padding-bottom: 20px;
`

const ATMBOX = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 0.8;
  background: #def0ee;
  border: 15px solid #fa6931;
  border-radius: 10px;
  padding: 20px;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 34px;
    color: black;
  }

  input:focus {
    outline: none;
  }
`


interface IQueueOptions {
  amount: number;
  closeFunction: any,
  setAmount: any,
  AddMoneyToWallet: any,
  RemoveFromWallet: any
  // enterQueue: any
}


export default function AtmViewBox(data: IQueueOptions) {
  const wbtcBalance = useAppSelector((state) => state.web3BalanceStore.wbtcBalance);
  const walletBalance = useAppSelector((state) => state.web3BalanceStore.walletBalance);
  const betBalance = useAppSelector((state) => state.web3BalanceStore.betBalance);
  const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance);


  // const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
  // const dispatch = useAppDispatch();
  return(
    <div>
      <Wrapper 
        // onMouseOver={() => {
        //   dispatch(TurnMouseClickOff(true))
        // }}
        // onMouseOut={() =>{ 
        //   dispatch(TurnMouseClickOff(false))
        // }}
      >
        <ATMBOX>
          <h2>
            ATM <span>(1 BTC == 1,000,000 Bits)</span> 
          </h2>
          <TableWrapper>
            <table style={{
              width: '100%'
            }}>
              <thead>
              <tr>
                <th>Bits</th>
                <th>Wallet: {getEllipsisTxt(store.getState().web3store.userAddress)}</th>
                <th>Bag</th>
                <th>Amount</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>BTC.b</td>
                <td>{parseWBTCBalanceV2(wbtcBalance)}</td>
                <td>{parseWBTCBalanceV3(web2_credit_balance)}</td>
                <td>
                  {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                  <input 
                  type="number" 
                  placeholder='Enter Bits' 
                  value={data.amount}
                  style={{
                    width: "200px"
                  }}
                  onChange={(e) => {
                    data.setAmount(e.target.value)
                  }}></input>
                </td>
              </tr>
              </tbody>
            </table>

          </TableWrapper>

          <button 
            style={{
              backgroundColor: '#75c850',
              borderRadius: "10px",
              padding: '10px',
              margin: '20px'
            }}
            onClick={() => data.AddMoneyToWallet()}
          >
            <span style={{
              color: 'aliceblue'
            }}>Deposit</span>
          </button>


          <button 
            style={{
              backgroundColor: '#af3708',
              borderRadius: "10px",
              padding: '10px'
            }}
            onClick={() => data.RemoveFromWallet()}
            >
            <span style={{
              color: 'aliceblue'
            }}>Withdraw</span>
          </button>

          <div>
            <span>
              40 bit fee on all withdraws.
            </span>
          </div>
          
        </ATMBOX>
      </Wrapper>
    </div>
  )
}