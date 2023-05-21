import React, { useState } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import { Button, ButtonGroup, Tab, Tabs } from '@mui/material'
import PendingRequests from './MenuComponents/PendingRequests';
import FriendsList from './MenuComponents/FriendsList';
import SentFriendRequests from './MenuComponents/SentFriendRequest';
import QueueList from './MenuComponents/QueueList'
import { useAppDispatch, useAppSelector } from '../../hooks'
import store from '../../stores'
import { ChangeShowGangView, ChangeShowQueueBox } from '../../stores/UserWebsiteStore'
import { TurnMouseClickOff } from '../../stores/UserActions'
import { getEllipsisTxt } from '../../utils';
import { setNFTLoadedBool } from '../../stores/BitFighters';
import { LogOut } from '../../stores/Web3Store';
// import BetWindowView from './MenuComponents/BetWindowView';
import RefreshIcon from '@mui/icons-material/Refresh';
import { updateBetInfOfPlayer } from '../../utils/fight_utils';



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
  position: fixed;
  right: 0%;
  height: 100%;
  width: 32%;
  z-index: 100;
`

const Wrapper = styled.div`
  position: relative;
  height: 90%;
  display: flex;
  flex-direction: column;
  opacity: 0.95;
  justify-content: 'center';
  background: #2c2c2c;
`

const MenuBox = styled(Box)`
  height: 80%;
  width: 100%;
  overflow: auto;
  // opacity: 0.9;
  // background: #000000a7;
  // border: 1px solid #00000029;
  // padding: 20px;
  // margin-right: 15px;
  // margin-bottom: 100px;
`

const MenuBoxHeader = styled.div`
  position: relative;
  
  background: #000000a7;
  // border-radius: 10px 10px 0px 0px;
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

const TextWrapper = styled.div`
  color: aliceblue;
  font-family: Monospace;
  font-size: 25px;
`

export default function NewMenuSideBar() {
  // const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const showQueueBoxRedux = useAppSelector((state) => state.userPathStore.ShowQueueBox)
  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  // const ShowMenuBoxRedux =true
  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(0);
  const dispatch = useAppDispatch();
  // const game = phaserGame.scene.keys.game as Game
  console.log("-- showmenubox ", ShowMenuBoxRedux )

  const web3LogOut = async () => {
    console.log("button pressed");
    if (window.confirm("You sure you want to Logout? ")) {
      store.dispatch(setNFTLoadedBool(false))
      // await Moralis.User.logOut();
      dispatch(LogOut())
      localStorage.removeItem("connected_matic_network")
      localStorage.removeItem("web2_wallet_address")
      localStorage.removeItem("web2_email_address")
      localStorage.removeItem("saw_controls")
      console.log("logged out ");
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
    
    // store.dispatch(setNFTLoadedBool(false))
    // // await Moralis.User.logOut();
    // dispatch(LogOut())
    // localStorage.removeItem("connected_matic_network")
    // localStorage.removeItem("web2_wallet_address")
    // localStorage.removeItem("web2_email_address")
    // localStorage.removeItem("saw_controls")
    // console.log("logged out ");
    // setTimeout(() => {
    //   window.location.reload()
    // }, 500)
  }

  const [showMenuBar, setShowMenuBar] = useState(false);
  const [showFriendsInfo, setShowFriendsInfo] = useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    setValue(newValue);
  };

  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue);
  };

  const LogoutButtonView =  () => {
    return (  
                            <button 
                              type="button" 
                              className="btn btn-danger"
                              style={{
                                margin: '10px',

                              }}
                              onClick={() => web3LogOut()}
                            >
                              LogOut
                            </button>
    )
  }                         

  // console.log("queue -> menu box and friends box ", ShowMenuBoxRedux, showQueueBoxRedux)

  return (
    <div>

      <div>

        {/* <BetWindowView /> */}
        

        <Backdrop
        >
            {ShowMenuBoxRedux && ((
                <Wrapper onMouseOver={() => {
                    // console.log(" mouse over in menu side bar")
                    dispatch(TurnMouseClickOff(true))
                  }}
                  onMouseOut={() => {
                    // console.log(" mouse out in menu side bar")
                    dispatch(TurnMouseClickOff(false))
                  }}>
                  <TextWrapper>Connected Wallet 
                    <span 
                      style={{
                        color: 'grey',
                        paddingLeft: '20px'
                      }}
                    onClick={
                      () => {
                        updateBetInfOfPlayer()
                      }
                    }> 
                      <RefreshIcon /> 
                    </span>
                  </TextWrapper>
                  <TextWrapper style={{color: "#BF8B8B", fontSize: '20px'}}>{getEllipsisTxt(userAddress)}</TextWrapper>
                  <MenuBoxHeader>
                    <ButtonGroup>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          store.dispatch(ChangeShowQueueBox(false))
                        }}
                      >
                        Friends
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          store.dispatch(ChangeShowQueueBox(true))
                        }}
                      >
                        Game
                      </Button>

                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          store.dispatch(ChangeShowGangView(true))
                        }}
                      >
                        Gang
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

                      <LogoutButtonView />
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

                    <LogoutButtonView />

                    </TabsSection>
                  }
                  
                  
                </Wrapper>
              )
            )}
        </Backdrop>

      </div>

    </div>
  )
}
