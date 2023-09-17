import { Box, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import store from '../stores';
import { LeaderBoardData, SetLeaderBoardOpen } from '../stores/WebsiteStateStore';
import { getEllipsisTxt } from '../utils';
import { parseWBTCBalanceV2, parseWBTCBalanceV3 } from '../utils/web3_utils';

const ModalWrapper = styled.div`
`


const ModalBoxWrapper = styled(Box)`
  background: #111B28;
  // border: 10px solid #000000;
  // border-radius: 10px;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  margin-left: 20%;
  margin-top: 10%;
  transform: 'translate(-50%, -50%)',
  // left: 50%;

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

const Mytable = styled.table`
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

  // overflow-y:scroll;
  // height:100px;
  // display:block;

  thead tr {
    // background-color: #009879;
    color: #ffffff;
    text-align: left;
  }

  th, td {
    padding: 12px 15px;
  }

  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  // tbody tr:nth-of-type(even) {
  //   background-color: #f3f3f3;
  // }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`

function Leaderboard() {

  const leaderboardOpen = useAppSelector((state) => state.websiteStateStore.leaderboardOpen);
  const leaderboardData = useAppSelector((state) => state.websiteStateStore.leaderboardData);

  const handleModalClose = () => {
    console.log("handle modal close in leaderboard..")
    store.dispatch(SetLeaderBoardOpen(false))
  };


  return (
    <div className="timer" style={{
      display: 'flex',
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    }}>
    <ModalWrapper>
      <Modal
        open={leaderboardOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <ModalBoxWrapper>
        <h3>
          Leaderboard:
        </h3>

           <Mytable style={{
              width: `100%`,
              backgroundColor: 'black'
            }}>
  
              
              <thead>
              <tr>
                <td>#Rank</td>
                <td>Player</td>
                <td>Balance</td>
                <td>#Fights</td>
              </tr>
              </thead>

              <tbody>

              {
                leaderboardData.map((data: LeaderBoardData, index) => {
                  return(
                    <tr>
                      <td>{index+1}</td>
                      <td>{getEllipsisTxt(data.user_wallet_address)}</td>
                      <td>{parseWBTCBalanceV3(data.web2_balance)}</td>
                      <td>{data.num_fights}</td>
                    </tr>
                  )
                })
              }

              </tbody>
              
            </Mytable>


      </ModalBoxWrapper>
      </Modal>
    </ModalWrapper>
    </div>
  );
}

export default Leaderboard;