import { Box, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import store from '../stores';
import { SetLeaderBoardOpen } from '../stores/WebsiteStateStore';

const ModalWrapper = styled.div`
`


const ModalBoxWrapper = styled(Box)`
  background: #111B28;
  border: 10px solid #000000;
  border-radius: 10px;
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

function Leaderboard() {

  // const [openModal, setOpenModal] = useState(false);
  const leaderboardOpen = useAppSelector((state) => state.websiteStateStore.leaderboardOpen);

  const handleModalClose = () => {
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
        <h2>
          LeaderBoard:
        </h2>
        <Typography id="modal-modal-title" variant="h2" component="h2"></Typography>

        

      </ModalBoxWrapper>
      </Modal>
    </ModalWrapper>
    </div>
  );
}

export default Leaderboard;