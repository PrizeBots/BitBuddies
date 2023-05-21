import React, { useState } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
// import 'emoji-mart/css/emoji-mart.css'

import { Button, ButtonGroup, Tab, Tabs } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ArrowForwardIos } from '@mui/icons-material'
import PendingRequests from './MenuComponents/PendingRequests';
import FriendsList from './MenuComponents/FriendsList';
import SentFriendRequests from './MenuComponents/SentFriendRequest';
import QueueList from './MenuComponents/QueueList'
import { useAppDispatch, useAppSelector } from '../../hooks'
import store from '../../stores'
import { ChangeShowMenuBox, ChangeShowQueueBox } from '../../stores/UserWebsiteStore'
import { TurnMouseClickOff } from '../../stores/UserActions'


// const CustomTabs =  styled(Tab)`
//   background-color: 'red';
// `

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ListViewerData {
  main: string,
  sequence: number,
  subdata: string,
}

export interface ListViewerDataWrapper {
  data : ListViewerData;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div> {children} </div>
      )}
    </div>
  );
}

function TabPanel2(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div> {children} </div>
      )}
    </div>
  );
}

const Wrapper2 = styled.div`
  position: relative;
  height: 10%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  float: right;
`

const FabWrapper = styled.div`
  margin-top: auto;
`

// const TabData = styled.div`
//   font-size: 20px
// `

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function a11yProps2(index: number) {
  return {
    id: `simple-tab2-${index}`,
    'aria-controls': `simple-tabpanel2-${index}`,
  };
}

const Backdrop = styled.div`
  // position: fixed;
  // top: 20%;
  // right: 0%;
  height: 800px;
  width: 350px;
  max-height: 80%;
  max-width: 50%;
  float: right;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0.9;
  justify-content: 'center';
`

const MenuBox = styled(Box)`
  height: 80%;
  width: 100%;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 1px solid #00000029;
  // padding: 20px;
  // margin-right: 15px;
  // margin-bottom: 100px;
`

const MenuBoxHeader = styled.div`
  position: relative;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;
  padding: 20px;
`

const TabsBoxHeader = styled.div`
  position: relative;
  background: #000000a7;
`

const TabsSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 800px;
`

export default function MenuSideBar() {
  // const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const showQueueBoxRedux = useAppSelector((state) => state.userPathStore.ShowQueueBox)
  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(0);
  const dispatch = useAppDispatch();
  // const game = phaserGame.scene.keys.game as Game

  const [showMenuBar, setShowMenuBar] = useState(false);
  const [showFriendsInfo, setShowFriendsInfo] = useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    setValue(newValue);
  };

  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue);
  };

  // console.log("queue -> menu box and friends box ", ShowMenuBoxRedux, showQueueBoxRedux)

  return (
    <Backdrop
      onMouseOver={() => {
        // console.log(" mouse over in menu side bar")
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() => {
        // console.log(" mouse out in menu side bar")
        dispatch(TurnMouseClickOff(false))
      }}
    >
        {(ShowMenuBoxRedux) ? (
            <Wrapper>
              <Fab
                aria-label="showMenuIcon"
                style={{color:"#CC5500", position: "absolute"}}
                onClick={() => {
                  // setShowMenuBar(false)
                  store.dispatch(ChangeShowMenuBox(false))
                }}>
                <ArrowForwardIos style={{ color:"#CC5500" }} />
              </Fab>
              <MenuBoxHeader>
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      store.dispatch(ChangeShowQueueBox(false))
                      // setShowFriendsInfo(true)
                    }}
                  >
                    Friends
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      store.dispatch(ChangeShowQueueBox(true))
                      // setShowFriendsInfo(false)
                    }}
                  >
                    Fight
                  </Button>
                </ButtonGroup>
              </MenuBoxHeader>

              { !showQueueBoxRedux?
              <TabsSection>
              
                <TabsBoxHeader>
                  <Tabs aria-label="basic tabs example" centered style={{ fontSize: '15px' }} onChange={handleChange} value={value} textColor="secondary" indicatorColor="secondary" >
                    <Tab label="Friends" {...a11yProps(0)} />
                    <Tab label="Pending" {...a11yProps(1)} />
                    <Tab label="Sent" {...a11yProps(2)} />
                  </Tabs>
                </TabsBoxHeader>

                
                <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabPanel value={value} index={0}>
                    <div> 
                      <FriendsList />
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <div> 
                      <PendingRequests />
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <div> 
                      <SentFriendRequests />
                    </div>
                  </TabPanel>
                </MenuBox>
              </TabsSection>
              :   
              <TabsSection>
              
                <TabsBoxHeader>
                  <Tabs aria-label="basic tabs example 2" centered style={{ fontSize: '15px' }} onChange={handleChange2} value={value2} textColor="secondary" indicatorColor="secondary" >
                    <Tab label="Queue" {...a11yProps2(0)} />
                  </Tabs>
                </TabsBoxHeader>

                
                <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabPanel2 value={value2} index={0}>
                    <div> 
                      <QueueList />
                    </div>
                  </TabPanel2>
                </MenuBox>
              </TabsSection>
              
              }
              
            </Wrapper>
          ): (
          <Wrapper2>
            <FabWrapper>
              <Fab
                aria-label="showMenuIcon"
                style={{color:"#CC5500"}}
                onClick={() => {
                  // setShowMenuBar(true)
                  store.dispatch(ChangeShowMenuBox(true))
                }}
              >
                <ArrowBackIosNewIcon style={{
                  color:"#CC5500"
                }}
                />
              </Fab>
            </FabWrapper>
          </Wrapper2>
        )}
    </Backdrop>
  )
}
