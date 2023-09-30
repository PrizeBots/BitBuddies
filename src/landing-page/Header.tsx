import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moralis } from "moralis";
import { useAppDispatch, useAppSelector } from "../hooks";
import { LogOut } from "../stores/Web3Store";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import Fab from "@mui/material/Fab";
import TwitterIcon from "@mui/icons-material/Twitter";
import { MenuBook, Telegram, YouTube } from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import store from "../stores";
import { setNFTLoadedBool } from "../stores/BitFighters";
import { Web3Login } from "./Web3Login";
import { SetMouseClickControlHeader } from "../stores/UserActions";
import { v4 as uuidv4 } from "uuid";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
// import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
// import Badge from '@mui/material/Badge';
import { getEllipsisTxt } from "../utils";
import { ChangeShowMenuBox, ChangeShowQueueBox } from "../stores/UserWebsiteStore";
import CompetitionTime from "./CompetitionTime";
import { SetLeaderBoardOpen } from "../stores/WebsiteStateStore";

const appId = process.env.REACT_APP_MORALIS_APP_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

Moralis.start({
  serverUrl,
  appId,
});

declare global {
  interface Window {
    ethereum?: any;
  }
}

const StyledFab = styled(Fab)`
  &:hover {
    color: #1ea2df;
  }
`;

declare global {
  interface Window {
    ethereum?: any;
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

function Header() {
  const userAddress = useAppSelector((state) => state.web3store.userAddress);
  // const maticBalance = useAppSelector(
  //   (state) => state.userPathStore.maticBalance
  // );
  const HistoryPath = useAppSelector((state) => state.userPathStore.path);
  // const wbtcBalance = useAppSelector(
  //   (state) => state.userPathStore.wbtcBalance
  // );
  // const metaMaskInstalled = useAppSelector(
  //   (state) => state.userPathStore.metaMaskInstalled
  // );
  const dispatch = useAppDispatch();
  // const [countOfNotification, setCountOfNotification] = useState(0);
  const bitFightersTotalData = useAppSelector(
    (state) => state.bitFighters.totalNFTData
  );
  const ShowMenuBoxRedux = useAppSelector(
    (state) => state.userPathStore.ShowMenuBox
  );

  const currentServerLatency = useAppSelector(
    (state) => state.metaInfoStore.net_speed
  );

  const totalConnections = useAppSelector(
    (state) => state.metaInfoStore.total_connections
  );

  const selectedPlayer = useAppSelector(
    (state) => state.playerDataStore.current_game_player_info
  );
  // const gameStarted = useAppSelector(
  //   (state) => state.playerDataStore.gameStarted
  // );

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // const deadline = "September, 3, 2023";
  const deadline = new Date(2023,8,3,23,59,0);

  const getTime = () => {
    const time = deadline.getTime() - Date.now();

    // setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60))));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  // useEffect(() => {
  //   const interval = setInterval(() => getTime(), 1000);

  //   return () => clearInterval(interval);
  // }, []);

  // console.log(
  //   "selected_player_info",
  //   Object.keys(selectedPlayer).length,
  //   gameStarted
  // );
  console.log("current history path -- ", HistoryPath);
  // let moralisButtonUI: JSX.Element = <></>;

  // const ethersLogin = async () => {
  //   console.log("button pressed ethersLogin");
  // };

  const web3LogOut = async () => {
    console.log("button pressed");
    if (window.confirm("You sure you want to Logout? ")) {
      store.dispatch(setNFTLoadedBool(false));
      // await Moralis.User.logOut();
      dispatch(LogOut());
      localStorage.removeItem("connected_matic_network");
      localStorage.removeItem("web2_wallet_address");
      localStorage.removeItem("web2_email_address");
      localStorage.removeItem("saw_controls");
      console.log("logged out ");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const loopFunction = async () => {
    // let user_all_data: USER_DETAILS = await fetchUserDetails();
    // console.log("in loop function .... ", countOfNotification, user_all_data)
    // if (isNullOrUndefined(user_all_data))  {
    //   setTimeout(() => {
    //     loopFunction()
    //   }, 10 * 1000)
    //   return
    // }
    // dispatch(ChangeUserData(user_all_data))
    // setCountOfNotification(user_all_data.pending.length)
    // setTimeout(() => {
    //   loopFunction()
    // }, 30 * 1000)
  };

  
  useEffect(() => {
    (async function () {
      console.log("executing this..");
      // const namedata = await getContractName()
      // console.log("name-- ", namedata)
      // const ddddata = ReaderFunctions.getContractName()
      if (!isMetaMaskInstalled()) return;
      await window.ethereum.enable();
      console.log("executing this..2");
      window.ethereum.on("accountsChanged", beforeUnloadFun);
      window.ethereum.on("chainChanged", afterNetworkChanged);
      function beforeUnloadFun(account: string) {
        console.log("accounts changed...2 beforeUnloadFun ", account);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      function afterNetworkChanged() {
        console.log("network changed...2 ");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      return () => {
        window.ethereum?.off("accountsChanged", beforeUnloadFun);
        window.ethereum?.off("chainChanged", afterNetworkChanged);
      };
    })();
    loopFunction();
  }, []);

  // if (userAddress !== "") {
  //   // console.log("here again.... ");

  //   moralisButtonUI = (
  //     <div
  //       style={{
  //         flex: 1,
  //         flexDirection: "row",
  //         alignItems: "flex-end",
  //         justifyContent: "center",
  //       }}
  //     >
  //       {HistoryPath === "gamePlay" ? (
  //         <li className="nav-item navbar-left dropdown" key={uuidv4()}>
  //           <div>
  //             <a
  //               href="#"
  //               onClick={() => {
  //                 console.log("clicking on profile pic ", ShowMenuBoxRedux);
  //                 store.dispatch(ChangeShowMenuBox(!ShowMenuBoxRedux));
  //                 store.dispatch(ChangeShowQueueBox(false));
  //               }}
  //             >
  //               <img
  //                 src={selectedPlayer.data.profile_image}
  //                 className="rounded-circle"
  //                 alt="."
  //                 height="30"
  //                 width="40"
  //                 style={{
  //                   marginTop: "-10px",
  //                 }}
  //               ></img>
  //               <ArrowDropDownIcon color="action"></ArrowDropDownIcon>
  //             </a>
  //           </div>

  //           {/* <a 
  //             href="#" 
  //             onClick={() => {
  //               console.log("clicking on profile pic ", ShowMenuBoxRedux)
  //               store.dispatch(ChangeShowMenuBox(!ShowMenuBoxRedux))
  //             }}
  //           >
  //           {
  //             bitFightersTotalData.length > 0 && bitFightersTotalData[0].data && bitFightersTotalData[0].data.profile_image?
  //             <img 
  //               src={bitFightersTotalData[0].data.profile_image}
  //               className="rounded-circle" 
  //               alt="Cinque Terre" 
  //               height="30" 
  //               width="40"
  //               style={{
  //             marginTop:'-10px'
  //           }}
  //             ></img>:
  //             <img 
  //               src="bitfgihter_assets/paris.jpeg" 
  //               className="rounded-circle" 
  //               alt="Cinque Terre" 
  //               height="30" 
  //               width="30"
  //             ></img>
  //           }
  //           <ArrowDropDownIcon color='action' ></ArrowDropDownIcon>
  //           </a> */}
  //         </li>
  //       ) : (
  //         <li className="nav-item navbar-left dropdown" key={uuidv4()}>
  //           <a
  //             className="nav-link dropdown-toggle"
  //             href="#"
  //             id="navbarDropdown"
  //             role="button"
  //             data-bs-toggle="dropdown"
  //           >
  //             {bitFightersTotalData.length > 0 &&
  //             bitFightersTotalData[0].data &&
  //             bitFightersTotalData[0].data.profile_image ? (
  //               <img
  //                 src={bitFightersTotalData[0].data.profile_image}
  //                 className="rounded-circle"
  //                 alt="Cinque Terre"
  //                 height="30"
  //                 width="40"
  //                 style={{
  //                   marginTop: "-10px",
  //                 }}
  //               ></img>
  //             ) : (
  //               <img
  //                 src="bitfgihter_assets/paris.jpeg"
  //                 className="rounded-circle"
  //                 alt="Cinque Terre"
  //                 height="30"
  //                 width="30"
  //               ></img>
  //             )}
  //           </a>
  //           <ul
  //             className="dropdown-menu dropdown-menu-end"
  //             aria-labelledby="navbarDropdown"
  //           >
  //             <li>
  //               <a className="dropdown-item" href="#">
  //                 {" "}
  //                 Connected Wallet{" "}
  //               </a>
  //             </li>
  //             <li>
  //               <a className="dropdown-item" href="#" key={2}>
  //                 <span style={{ color: "red" }}>
  //                   {getEllipsisTxt(userAddress)}
  //                 </span>{" "}
  //               </a>
  //             </li>

  //             {/* <li key={uuidv4()}>
  //                 <div
  //                   style={{
  //                     width: 20,
  //                   }}
  //                 ></div>
  //               </li>

  //               <li style={{ textAlign: "center" }} key={uuidv4()}>
  //                 <button
  //                   type="button"
  //                   className="btn btn-outline-danger"
  //                   onClick={() => web3LogOut()}
  //                 >
  //                   LogOut
  //                 </button>
  //               </li> */}

              

  //             {/* <li key={3}>
  //               <hr></hr>
  //             </li> */}
  //             {/* <li key={uuidv4()}><NewMenuSideBar /></li> */}
  //             {/* <li><a className="dropdown-item" href="#"> {getRoundedString(wbtcBalance)} <span style={{ color: "red", fontSize: '16px'}}> wBTC </span>    </a></li>
  //           <li><a className="dropdown-item" href="#"> {getRoundedString(maticBalance)} <span style={{ color: "red", fontSize: '16px'}}> Matic </span> </a></li> */}
  //             {/* <li key={7}><hr></hr></li> */}
  //             {/* <li style={{ textAlign: "center" }}>
  //               <button
  //                 type="button"
  //                 className="btn btn-outline-danger"
  //                 onClick={() => web3LogOut()}
  //               >
  //                 LogOut
  //               </button>
  //             </li> */}
  //           </ul>
  //         </li>
  //       )}
  //     </div>
  //   );
  // } else {
  //   moralisButtonUI = (
  //     <>
  //       <button
  //         type="button"
  //         className="btn btn-outline-info"
  //         onClick={() => Web3Login()}
  //       >
  //         Connect
  //       </button>
  //     </>
  //   );
  // }

  return (
    <div
      onMouseOver={() => {
        dispatch(SetMouseClickControlHeader(true));
      }}
      onMouseOut={() => {
        dispatch(SetMouseClickControlHeader(false));
      }}
    >
      <nav
        className="navbar navbar-expand-sm navbar-dark"
        style={{
          // backgroundColor: "#262626",
          backgroundColor: "#111B28"
        }}
      >
        <div className="container-fluid">
          <ul
            className="navbar-nav me-1"
            style={{
              gap: "10px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <li className="nav-item" key={uuidv4()}>
              <Link className="nav-link" to="/home">
                <div className="cooper-black-tab">Home</div>
              </Link>
            </li>

            <li className="nav-item" key={uuidv4()}>
              <Link className="nav-link" to="/game">
                <div className="cooper-black-tab">Game</div>
              </Link>
            </li>


            <li className="nav-item" key={uuidv4()}>
              <Link className="nav-link" to="/mint">
                <div className="cooper-black-tab">Mint</div>
              </Link>
            </li>

            {/* <li className="nav-item" key={uuidv4()} >
              <Link 
                className="nav-link" 
                to="/leaderboard" 
                onClick={
                  event => {
                    event.preventDefault()
                    store.dispatch(SetLeaderBoardOpen(true))
                  }}
              >
                <div className="cooper-black-tab">Leaderboard</div>
              </Link>
            </li> */}

            <li className="nav-item" key={999999999}>
              {/* <Link className="nav-link" to="/about" onClick={event => event.preventDefault()}>
                <div className="cooper-black-tab">Prize Game Ends In: {` ${hours} : ${minutes} : ${seconds} `}</div>
              </Link> */}

              {/* <Link className="nav-link" to="/about" onClick={event => event.preventDefault()}>
                <div className="cooper-black-tab"><CompetitionTime /></div>
              </Link> */}
            </li>

            {HistoryPath === "gamePlay" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                  width: "150px",
                }}
              >
                <li
                  className="nav-item"
                  key={uuidv4()}
                  style={{ justifyContent: "center" }}
                >
                  <Tooltip title="Server Latency" style={{ color: "grey" }}>
                    <NetworkCheckIcon />
                  </Tooltip>
                </li>

                <li
                  className="nav-item"
                  key={uuidv4()}
                  style={{
                    color: "grey",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {currentServerLatency.toString() + " ms"}
                </li>

                <li key={uuidv4()}>
                  <div
                    style={{
                      width: 20,
                    }}
                  ></div>
                </li>

                <li
                  className="nav-item"
                  key={uuidv4()}
                  style={{
                    color: "grey",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {totalConnections.toString()}
                </li>
              </div>
            ) : (
              <></>
            )}
          </ul>

          <div className="navbar-collapse collapse w-100 order-1 dual-collapse2">
            <ul className="navbar-nav ms-auto" id="moralis-connector-ul">
              <ul
                className="navbar-nav"
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <li className="nav-item" key={50}>
                  <Tooltip title="Read our WhitePaper">
                    <div style={{ color: "#eee" }}>
                      <a
                        href="https://bit-fighters.gitbook.io/readme/"
                        target="_blank"
                      >
                        <MenuBook color="secondary" />
                      </a>
                    </div>
                  </Tooltip>
                </li>

                <li key={8}>
                  <div
                    style={{
                      width: 35,
                    }}
                  ></div>
                </li>

                <li className="nav-item" key={5}>
                  <Tooltip title="Follow Us on Twitter">
                    <div style={{ color: "#eee" }}>
                      <a
                        href="https://twitter.com/Bit_Fighters"
                        target="_blank"
                      >
                        <TwitterIcon color="primary" />
                      </a>
                    </div>
                  </Tooltip>
                </li>

                <li key={6}>
                  <div
                    style={{
                      width: 10,
                    }}
                  ></div>
                </li>

                <li className="nav-item" key={uuidv4()}>
                  <Tooltip title="Follow Us on Telegram">
                      <a
                        href="https://t.me/+ThxhkzeHFNA3Mjdh"
                        target="_blank"
                      >
                        <Telegram color="primary" />
                      </a>
                  </Tooltip>
                </li>

                <li key={uuidv4()}>
                  <div
                    style={{
                      width: 10,
                    }}
                  ></div>
                </li>

                <li className="nav-item" key={7}>
                  <Tooltip title="Follow Us on Discord">
                    <div>
                      <a href="https://discord.gg/jhrZ2dDuFz" target="_blank">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                          width="22px"
                          height="22px"
                        >
                          <path
                            fill="#7884CB"
                            d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                          />
                        </svg>
                      </a>
                    </div>
                  </Tooltip>
                </li>

                <li key={60}>
                  <div
                    style={{
                      width: 10,
                    }}
                  ></div>
                </li>

                <li className="nav-item" key={900}>
                  <Tooltip title="Subscribe to our channel">
                    <div style={{ color: "#E82A60" }}>
                      <a
                        href="https://www.youtube.com/channel/UCdvCCG7rNJqGcTGnFZaXt_Q"
                        target="_blank"
                      >
                        <YouTube
                          color="secondary"
                          style={{
                            color: "#CC0000",
                          }}
                        />
                      </a>
                    </div>
                  </Tooltip>
                </li>

                <li key={800}>
                  <div
                    style={{
                      width: 10,
                    }}
                  ></div>
                </li>

                <li className="nav-item" key={9}>
                  <Tooltip title="Check out Instagram">
                    <div style={{ color: "#E82A60" }}>
                      <a
                        href="https://www.instagram.com/p/CgukMgEJniM/"
                        target="_blank"
                      >
                        <InstagramIcon
                          color="secondary"
                          style={{
                            color: "#EE698F",
                          }}
                        />
                      </a>
                    </div>
                  </Tooltip>
                </li>

                <li key={10}>
                  <div
                    style={{
                      width: 10,
                    }}
                  ></div>
                </li>
              

                {/* {moralisButtonUI ? moralisButtonUI : <>Cool</>} */}

                  <>
                {
                  userAddress !== ""?
                  <div
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    {HistoryPath === "gamePlay" ? (
                      <li className="nav-item navbar-left dropdown" key={uuidv4()}>
                        <div>
                          <a
                            href="#"
                            onClick={() => {
                              console.log("clicking on profile pic ", ShowMenuBoxRedux);
                              store.dispatch(ChangeShowMenuBox(!ShowMenuBoxRedux));
                              store.dispatch(ChangeShowQueueBox(false));
                            }}
                          >
                            <img
                              src={selectedPlayer.data.profile_image}
                              className="rounded-circle"
                              alt="."
                              height="30"
                              width="40"
                              style={{
                                marginTop: "-10px",
                              }}
                            ></img>
                            <ArrowDropDownIcon color="action"></ArrowDropDownIcon>
                          </a>
                        </div>
                      </li>
                    ) : (
                      <li className="nav-item navbar-left dropdown" key={uuidv4()}>
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          id="navbarDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                        >
                          {bitFightersTotalData.length > 0 &&
                          bitFightersTotalData[0].data &&
                          bitFightersTotalData[0].data.profile_image ? (
                            <img
                              src={bitFightersTotalData[0].data.profile_image}
                              className="rounded-circle"
                              alt="Cinque Terre"
                              height="30"
                              width="40"
                              style={{
                                marginTop: "-10px",
                              }}
                            ></img>
                          ) : (
                            <img
                              src="bitfgihter_assets/paris.jpeg"
                              className="rounded-circle"
                              alt="Cinque Terre"
                              height="30"
                              width="30"
                            ></img>
                          )}
                        </a>
                        <ul
                          className="dropdown-menu dropdown-menu-end"
                          aria-labelledby="navbarDropdown"
                          onClick={event => event.preventDefault()}
                        >
                          <li onClick={event => event.preventDefault()}>
                            <a className="dropdown-item" href="#">
                              {" "}
                              Connected Wallet{" "}
                            </a>
                          </li>
                          <li onClick={event => event.preventDefault()}>
                            <a className="dropdown-item" href="#" key={2}>
                              <span style={{ color: "red" }}>
                                {getEllipsisTxt(userAddress)}
                              </span>{" "}
                            </a>
                          </li>

                        </ul>
                      </li>
                    )}
                  </div>:
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-info"
                      onClick={() => Web3Login()}
                    >
                      Connect
                    </button>
                  </>
                }
                </>

                {
                  userAddress !== "" ? 
                  <div>

                    <li style={{ textAlign: "center", marginLeft: '50px' }}>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => web3LogOut()}
                      >
                        LogOut
                      </button>
                    </li>

                  </div>
                  : <div></div>
                }

                
              </ul>

            </ul>
          </div>

          <div className="me-1 order-0">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target=".dual-collapse2"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
