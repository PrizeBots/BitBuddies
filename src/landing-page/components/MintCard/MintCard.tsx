import { useSelector } from "react-redux";
// import { selectMintCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import SidePanel, { PageStates } from "../SidePanel/SidePanel";

import MintCardForm from "../MintCardForm/MintCardForm";
import statusReady from "../../../assets/images/status-ready.png";
import statusNotReady from "../../../assets/images/status-not-ready.png";
import btcIcon from "../../../assets/images/btc-icon.png";
import cardBlock from "../../../assets/images/card-block.png";
import { ethers } from 'ethers';
import "./MintCard.scss";
import "./MintCardForm.scss";
import phaserGame from '../../../PhaserGame';
import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import { useAppSelector } from "../../../hooks";
import { useState } from "react";
import store from "../../../stores";
import { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } from "../../../stores/NotificationStore";
import Bootstrap from "../../../game/scenes/Bootstrap";
import NotificationMessageHelper from "../../../game/Components/NotificationMessageHelper";
import { updateDripPresaleMintedCount, updatePresaleMintedCount } from "../../../utils/web3_utils";
import { approveWBTC2, checkAllowanceGeneral, checkAllowancePresale, mintPreSaleDripNFTV2, mintPreSaleNFTV2 } from "../../../contract";
import { randomGenarateDripPreSaleV2, randomGenaratePreSaleV2 } from "../../../hooks/ApiCaller";
import { PRESALE_CONTRACT_ADDRESS } from "../../../contract/presale_constants";
import styled from "styled-components";
import { LinearProgress } from "@mui/material";
import { PRESALE_DRIP_CONTRACT_V2 } from "../../../contract/presale_drip_constants";

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: grey;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

function MintCard() {
  const dispatch = useDispatch();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected)

  const totalPresaleCount = 100;
  const preSaleMintedNFT = useAppSelector((state) => state.bitFighters.preSaleNFTMintedCount);

  const totalDripPresaleCount = 100;
  const dripPresaleMintedNFT = useAppSelector((state) => state.bitFighters.drip_preSaleNFTMintedCount);

  const onekClubMintedNFT = useAppSelector((state) => state.bitFighters.oneKClubMintedCards);
  const totalOneKClubNFTs = useAppSelector((state) => state.bitFighters.totalOneKClubCards);
  const priceOfOneKCLubNFT = useAppSelector((state) => state.bitFighters.currentPriceOfOneKClubCard);


  const [onekClubQuantity, setOnekClubQuantity] = useState(0);

  const [mintCardsQuantity, setmintCardsQuantity] = useState(0);
  const [refAddrMintCard, setRefAddrMintCard] = useState("");
  const [refBoxMintCard, setRefBoxMintCard] = useState(0);

  const [mintingBool, setMintingBool] = useState(false)
  const [mintingState, setMintingState] = useState("")

  const [dripMintCardsQuantity, setdripMintCardsQuantity] = useState(0);
  const [driprefAddrMintCard, setdripRefAddrMintCard] = useState("");
  const [driptagMintCard, setdriptagMintCard] = useState(0);
  const [driptatooMintCard, setdriptatooMintCard] = useState(0);
  const [dripRefBoxMintCard, setDripRefBoxMintCard] = useState(0);

  const cardState = useAppSelector((state) => state.mintCardStateStore.state_selected);
  console.log("cardState ", cardState)

  const initializePreMintVars = () => {

    console.log("initializing pre mint vars")
    setRefAddrMintCard("")
    setRefBoxMintCard(0)
    setmintCardsQuantity(0)
  }

  const initializeDripPreMintVars = () => {

    console.log("initializing drip pre mint vars")
    setdripRefAddrMintCard("")
    setDripRefBoxMintCard(0)
    setdripMintCardsQuantity(0)
    setdriptatooMintCard(0)
    setdriptagMintCard(0)
  }

  const preSaleMint = async () => {
    console.log("in_presalemint", mintCardsQuantity, refAddrMintCard, mintCardsQuantity <1)

    if (mintCardsQuantity <1) {
      // setmintCardsQuantity(1)
      // console.log("in_presalemint2", mintCardsQuantity, refAddrMintCard, mintCardsQuantity <1)

      setMintingBool(false);
      setMintingState("");

      initializePreMintVars()

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Quantity should be greater than 0"))
      bootstrap.play_err_sound()

      return
    }

    let tempRefAddr = ""
    if (refAddrMintCard == "" || refBoxMintCard === 1) {
      setRefAddrMintCard(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(refAddrMintCard)
      } catch (err) {
        console.log(" error in getting proper address from this .. ", err)
        tempRefAddr = ethers.constants.AddressZero;
        setRefAddrMintCard(ethers.constants.AddressZero)
      }
    }
    setMintingBool(true);
    setMintingState("Generating Mint Card");

    const allowance = await checkAllowancePresale(store.getState().web3store.userAddress)
    console.log("allowance -- >", allowance.toString());
    if (ethers.BigNumber.from("100000000000000").gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log("less allowance")
      if (!await approveWBTC2(PRESALE_CONTRACT_ADDRESS, ethers.BigNumber.from("10000000000000000000"))) {
        setMintingBool(false);
        setMintingState("");

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Approval Failed"))
        bootstrap.play_err_sound()

        initializePreMintVars()

        return;
      }
    }

    const output = await randomGenaratePreSaleV2(store.getState().web3store.userAddress, mintCardsQuantity);
    console.log("---output ", output)

    setMintingState("Minting Your Mint Card");
    const minted = await mintPreSaleNFTV2(output.data, tempRefAddr);
    if (!minted) {
      bootstrap.play_err_sound()
      setMintingBool(false);
      setMintingState("");

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Minting Failed"))

      initializePreMintVars()
      return;
    } else {
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      setTimeout(() => {
        // handleModalOpen()
      }, 1000)
    }

    setMintingBool(false);
    updatePresaleMintedCount()
  }

  const preSaleMintDrip = async () => {
    console.log("in_presalemintDrip", dripMintCardsQuantity)

    if (dripMintCardsQuantity <1) {
      // setdripMintCardsQuantity(1)
      setMintingBool(false);
      setMintingState("");

      initializeDripPreMintVars()

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Quantity should be greater than 0"))
      bootstrap.play_err_sound()

      return
    }

    let tempRefAddr = ""
    if (driprefAddrMintCard == "" || dripRefBoxMintCard === 1) {
      setdripRefAddrMintCard(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(refAddrMintCard)
      } catch (err) {
        console.log(" error in getting proper address from this .. ", err)
        tempRefAddr = ethers.constants.AddressZero;
        setdripRefAddrMintCard(ethers.constants.AddressZero)
      }
    }
    setMintingBool(true);
    setMintingState("Generating Drip Mint Card");

    const allowance = await checkAllowanceGeneral(store.getState().web3store.userAddress, PRESALE_DRIP_CONTRACT_V2)
    console.log("allowance -- >", allowance.toString());
    if (ethers.BigNumber.from("100000000000").gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log("less allowance")
      if (!await approveWBTC2(PRESALE_DRIP_CONTRACT_V2, ethers.BigNumber.from("10000000000000000000"))) {
        setMintingBool(false);
        setMintingState("");

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Approval Failed"))
        bootstrap.play_err_sound()

        initializeDripPreMintVars()
        return;
      }
    }

    const output = await randomGenarateDripPreSaleV2(store.getState().web3store.userAddress, dripMintCardsQuantity, driptatooMintCard === 1? "Yes": "No", driptagMintCard === 1? "Yes": "No");
    console.log("---output ", output)

    setMintingState("Minting Drip Mint Card");
    const minted = await mintPreSaleDripNFTV2(output.data, tempRefAddr, driptatooMintCard === 1? 1: 0, driptagMintCard === 1? 1: 0);
    if (!minted) {
      bootstrap.play_err_sound()
      setMintingBool(false);
      setMintingState("");

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Minting Failed"))

      initializeDripPreMintVars()
      return;
    } else {
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      setTimeout(() => {
        // handleModalOpen()
      }, 1000)
    }

    setMintingBool(false);
    // setSnackBarOpen(true);

    updatePresaleMintedCount()
    updateDripPresaleMintedCount()
  }

  

  let CustomUI;
  if (cardState === PageStates.Presale) {
    CustomUI =  <div className="mint-card-base__wrapper">
        <article className="mint-card-base">
          <div className="mint-card-base__layer">
            {/* <div className="mint-card-base__slice"> */}
              <div className="mint-card-base__inner">
                <div className="mint-card-base__status">
                  <div className="mint-card-base__status__title">
                    {(totalPresaleCount - preSaleMintedNFT) < 0? " " : <p>Ready</p>}
                  </div>
                  <img
                    src={(totalPresaleCount - preSaleMintedNFT) < 0 ? statusNotReady : statusReady}
                    alt="status-photo"
                    className="mint-card-base__status__photo"
                  />
                </div>
                <div className="mint-card-base__display">
                  <div className="mint-card-base__display__inner">
                    <h5>Pre-Sale Mint Card</h5>
                    <p>{`${preSaleMintedNFT} of ${totalPresaleCount}`} Minted</p>
                  </div>
                </div>
                <div className="mint-card-base__info">
                  <div className="mint-card-base__info__inner">
                    {(totalPresaleCount - preSaleMintedNFT) < 0  ? (
                      <h2 className="mint-card-base__info__sold">Sold Out</h2>
                    ) : (
                      <>
                        <div className="mint-card__form">
                          <div className="mint-card__form__title">
                            <span>Please Enter</span>
                          </div>
                          <div className="mint-card__form__item mint-card__form__item--radio">
                            <label htmlFor="code">Ref. Code:</label>
                            <input id="code" 
                              type="text" 
                              value={refAddrMintCard}
                              onChange={(e) => {
                                setRefAddrMintCard(e.target.value)
                              }}
                            />
                          </div>
                          <div className="mint-card__form__item mint-card__form__item--radio">
                            <input 
                              id="checkbox" 
                              type="checkbox"
                              className="checkbox-circle"
                              value={refBoxMintCard}
                              onChange={(e) => {
                                setRefBoxMintCard(e.target.checked? 1: 0)
                              }}
                            />
                            <label htmlFor="checkbox">I don&#39;t have one</label>
                          </div>
                          <div className="mint-card__form__item mint-card__form__item--radio">
                            <label htmlFor="quantity">Quantity:</label>
                            <input 
                              id="quantity" 
                              type="number"
                              onChange={(e) => {
                                setmintCardsQuantity(parseInt(e.target.value))
                              }}
                              style={{
                                outline: "None"
                              }}
                            />
                          </div>
                        </div>
                        <div className="mint-card-base__info__btc">
                          <span>{(mintCardsQuantity * 0.0015 ? mintCardsQuantity * 0.0015: 0).toFixed(4)} BTC.b</span>
                          <img src={btcIcon} alt="btc-info" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mint-card-base__footer">
                  
                  {
                    !mintingBool ?
                    <Button
                      onClick={preSaleMint}
                      className="btn-mint--red btn-mint--big"
                    >
                      GO!
                    </Button>:
                    <ProgressBarWrapper
                      style={{
                        margin: '20px',
                        padding: '10px'
                      }}
                    >
                      <h3> {mintingState} </h3>
                      <ProgressBar style={{
                        backgroundColor: 'grey'
                      }} />
                    </ProgressBarWrapper>
                  }
                  <img src={cardBlock} alt="card-block" />
                  <h3>M-o-M Inc.</h3>
                </div>
              </div>
            {/* </div> */}
          </div>
        </article>
        <SidePanel />
      </div>
  } else if (cardState === PageStates.DripPreSale) {
        CustomUI =  <div className="mint-card-base__wrapper">
        <article className="mint-card-base">
          <div className="mint-card-base__layer">
            <div className="mint-card-base__inner">
              <div className="mint-card-base__status">
                <div className="mint-card-base__status__title">
                  {(totalDripPresaleCount - dripPresaleMintedNFT) < 0? " " : <p>Ready</p>}
                </div>
                <img
                  src={(totalDripPresaleCount - dripPresaleMintedNFT) < 0 ? statusNotReady : statusReady}
                  alt="status-photo"
                  className="mint-card-base__status__photo"
                />
              </div>
              <div className="mint-card-base__display">
                <div className="mint-card-base__display__inner">
                  <h5>Drip Pre-Sale Mint Card</h5>
                  <p>{`${dripPresaleMintedNFT} of ${totalDripPresaleCount}`} Minted</p>
                </div>
              </div>
              <div className="mint-card-base__info">
                <div className="mint-card-base__info__inner">
                  {(totalDripPresaleCount - dripPresaleMintedNFT) < 0  ? (
                    <h2 className="mint-card-base__info__sold">Sold Out</h2>
                  ) : (
                    <>
                      <div className="mint-card__form">

                        <div className="mint-card__form__title">
                          <span>Please Enter</span>
                        </div>

                        <div className="mint-card__form__item mint-card__form__item--radio">
                          <label htmlFor="code">Ref. Code:</label>
                          <input id="code" 
                            type="text" 
                            value={driprefAddrMintCard}
                            onChange={(e) => {
                              setdripRefAddrMintCard(e.target.value)
                            }}
                          />
                        </div>

                        <div className="mint-card__form__item mint-card__form__item--radio">
                          <input 
                            id="checkbox" 
                            type="checkbox"
                            className="checkbox-circle"
                            value={dripRefBoxMintCard}
                            onChange={(e) => {
                              setDripRefBoxMintCard(e.target.checked? 1: 0)
                            }}
                          />
                          <label htmlFor="checkbox">I don&#39;t have one</label>
                        </div>

                        <div className="mint-card__form__item">
                          <p className="red">100% of Addons goes to Drip</p>
                        </div>

                        <div className="mint-card__form__item mint-card__form__item--radio">
                          <label htmlFor="checkbox">Add Drip Tag: </label>
                          <input 
                            id="checkbox" 
                            type="checkbox"
                            className="checkbox-circle"
                            value={refBoxMintCard}
                            onChange={(e) => {
                              setdriptagMintCard(e.target.checked? 1: 0)
                            }}
                          />
                        </div>

                        <div className="mint-card__form__item mint-card__form__item--radio">
                          <label htmlFor="checkbox">Add Drip Tatoo: </label>
                          <input 
                            id="checkbox" 
                            type="checkbox"
                            className="checkbox-circle"
                            value={refBoxMintCard}
                            onChange={(e) => {
                              setdriptatooMintCard(e.target.checked? 1: 0)
                            }}
                          />
                          
                        </div>

                        <div className="mint-card__form__item mint-card__form__item--radio">
                          <label htmlFor="quantity">Quantity:</label>
                          <input 
                            id="quantity" 
                            type="number"
                            onChange={(e) => {
                              setdripMintCardsQuantity(parseInt(e.target.value))
                            }}
                            style={{
                              outline: "None"
                            }}
                          />
                        </div>
                      </div>
                      <div className="mint-card-base__info__btc" style={{
                        marginTop:'-20px'
                      }}>
                        <span>{(
                          dripMintCardsQuantity *  (0.0015 + 0.002 * driptagMintCard + 0.003* driptatooMintCard)? 
                          dripMintCardsQuantity *  (0.0015 + 0.002 * driptagMintCard + 0.003* driptatooMintCard): 
                          0).toFixed(4)}
                        </span>
                        {/* <span>{(dripMintCardsQuantity * 0.0015 ? dripMintCardsQuantity * 0.0015: 0).toFixed(4)} BTC.b</span> */}
                        <img src={btcIcon} alt="btc-info" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mint-card-base__footer">
                
                {
                  !mintingBool ?
                  <Button
                    onClick={preSaleMintDrip}
                    className="btn-mint--red btn-mint--big"
                  >
                    GO!
                  </Button>:
                  <ProgressBarWrapper>
                    <h3> {mintingState} </h3>
                    <ProgressBar style={{
                      backgroundColor: 'grey'
                    }} />
                  </ProgressBarWrapper>
                }
                <img src={cardBlock} alt="card-block" />
                <h3>M-o-M Inc.</h3>
              </div>
            </div>
          </div>
        </article>
        <SidePanel />
      </div>
  }

  return (
    <div>
      <NotificationMessageHelper />
      {CustomUI}
    </div>

  );
}

export default MintCard;
