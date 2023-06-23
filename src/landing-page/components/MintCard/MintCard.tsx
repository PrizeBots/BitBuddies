import { useRef } from "react";
import { useSelector } from "react-redux";
// import { selectMintCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import SidePanel, { PageStates } from "../SidePanel/SidePanel";

import MintCardForm from "../MintCardForm/MintCardForm";
import cardRibbon from "../../../assets/images/Mint_Panel__0004_Slime.png";
import bfMark from "../../../assets/images/Mint_Panel__0001_BF_png.png";
import statusReady from "../../../assets/images/status-ready.png";
import non_statusReady from "../../../assets/images/non_status-ready.png";
import statusNotReady from "../../../assets/images/status-not-ready.png";
import non_statusNotReady from "../../../assets/images/non_status-not-ready.png";
import btcIcon from "../../../assets/images/btc-icon.png";
import pleaseConnect from "../../../assets/images/work/pleaseconnect.png";
import welcome from "../../../assets/images/work/welcome.png";
import makeselection from "../../../assets/images/work/makeselection.png";
import cardBlock from "../../../assets/images/card-block.png";
import { ethers } from "ethers";
import "./MintCard.scss";
import "./MintCardForm.scss";
import phaserGame from "../../../PhaserGame";
import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import { useAppSelector } from "../../../hooks";
import { useState } from "react";
import store from "../../../stores";
import {
  SetFailureNotificationBool,
  SetFailureNotificationMessage,
  SetSuccessNotificationBool,
  SetSuccessNotificationMessage,
} from "../../../stores/NotificationStore";
import Bootstrap from "../../../game/scenes/Bootstrap";
import NotificationMessageHelper from "../../../game/Components/NotificationMessageHelper";
import {
  updateDripPresaleMintedCount,
  updatePresaleMintedCount,
} from "../../../utils/web3_utils";
import {
  approveWBTC2,
  checkAllowanceGeneral,
  checkAllowancePresale,
  mintPreSaleDripNFTV2,
  mintPreSaleNFTV2,
} from "../../../contract";
import {
  randomGenarateDripPreSaleV2,
  randomGenaratePreSaleV2,
} from "../../../hooks/ApiCaller";
import { PRESALE_CONTRACT_ADDRESS } from "../../../contract/presale_constants";
import styled from "styled-components";
import { LinearProgress } from "@mui/material";
import { PRESALE_DRIP_CONTRACT_V2 } from "../../../contract/presale_drip_constants";
import { connect } from "http2";
import Background from "../../../game/scenes/Background";
import { orange } from "@mui/material/colors";

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: grey;
  }
`;

const ProgressBar = styled(LinearProgress)`
  width: 260px;
  height: 10px;
  border-radius: 5px;
  color: orange;
`;

function MintCard() {
  const dispatch = useDispatch();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const loggedInUserWalletAddress = useAppSelector(
    (state) => state.web3store.userAddress
  );
  const web3ConnectedUser = useAppSelector(
    (state) => state.web3store.web3Connected
  );

  const totalPresaleCount = 100;
  const preSaleMintedNFT = useAppSelector(
    (state) => state.bitFighters.preSaleNFTMintedCount
  );

  const totalDripPresaleCount = 100;
  const dripPresaleMintedNFT = useAppSelector(
    (state) => state.bitFighters.drip_preSaleNFTMintedCount
  );

  const onekClubMintedNFT = useAppSelector(
    (state) => state.bitFighters.oneKClubMintedCards
  );
  const totalOneKClubNFTs = useAppSelector(
    (state) => state.bitFighters.totalOneKClubCards
  );
  const priceOfOneKCLubNFT = useAppSelector(
    (state) => state.bitFighters.currentPriceOfOneKClubCard
  );

  const [onekClubQuantity, setOnekClubQuantity] = useState(0);

  const [mintCardsQuantity, setmintCardsQuantity] = useState(0);
  const [refAddrMintCard, setRefAddrMintCard] = useState("");
  const [refBoxMintCard, setRefBoxMintCard] = useState(0);

  const [mintingBool, setMintingBool] = useState(false);
  const [mintingState, setMintingState] = useState("");

  const [dripMintCardsQuantity, setdripMintCardsQuantity] = useState(0);
  const [driprefAddrMintCard, setdripRefAddrMintCard] = useState("");
  const [driptagMintCard, setdriptagMintCard] = useState(0);
  const [driptatooMintCard, setdriptatooMintCard] = useState(0);
  const [dripRefBoxMintCard, setDripRefBoxMintCard] = useState(0);

  const cardState = useAppSelector(
    (state) => state.mintCardStateStore.state_selected
  );
  // const cardState = PageStates.NotConnectedState;
  console.log("cardState ", cardState);

  const initializePreMintVars = () => {
    console.log("initializing pre mint vars");
    setRefAddrMintCard("");
    setRefBoxMintCard(0);
    setmintCardsQuantity(0);
  };

  const initializeDripPreMintVars = () => {
    console.log("initializing drip pre mint vars");
    setdripRefAddrMintCard("");
    setDripRefBoxMintCard(0);
    setdripMintCardsQuantity(0);
    setdriptatooMintCard(0);
    setdriptagMintCard(0);
  };

  const preSaleMint = async () => {
    console.log(
      "in_presalemint",
      mintCardsQuantity,
      refAddrMintCard,
      mintCardsQuantity < 1
    );

    if (mintCardsQuantity < 1) {
      // setmintCardsQuantity(1)
      // console.log("in_presalemint2", mintCardsQuantity, refAddrMintCard, mintCardsQuantity <1)

      setMintingBool(false);
      setMintingState("");

      initializePreMintVars();

      store.dispatch(SetFailureNotificationBool(true));
      store.dispatch(
        SetFailureNotificationMessage("Quantity should be greater than 0")
      );
      bootstrap.play_err_sound();

      return;
    }
    let tempRefAddr = "";
    if (refAddrMintCard == "" || refBoxMintCard === 1) {
      setRefAddrMintCard(ethers.constants.AddressZero);
      tempRefAddr = ethers.constants.AddressZero;
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(refAddrMintCard);
      } catch (err) {
        console.log(" error in getting proper address from this .. ", err);
        tempRefAddr = ethers.constants.AddressZero;
        setRefAddrMintCard(ethers.constants.AddressZero);
      }
    }
    setMintingBool(true);
    setMintingState("Generating Mint Card");

    const allowance = await checkAllowancePresale(
      store.getState().web3store.userAddress
    );
    console.log("allowance -- >", allowance.toString());
    if (
      ethers.BigNumber.from("100000000000000").gte(
        ethers.BigNumber.from(allowance.toString())
      )
    ) {
      console.log("less allowance");
      if (
        !(await approveWBTC2(
          PRESALE_CONTRACT_ADDRESS,
          ethers.BigNumber.from("10000000000000000000")
        ))
      ) {
        setMintingBool(false);
        setMintingState("");

        store.dispatch(SetFailureNotificationBool(true));
        store.dispatch(SetFailureNotificationMessage("Approval Failed"));
        bootstrap.play_err_sound();

        initializePreMintVars();

        return;
      }
    }

    const output = await randomGenaratePreSaleV2(
      store.getState().web3store.userAddress,
      mintCardsQuantity
    );
    console.log("---output ", output);

    setMintingState("Minting Your Mint Card");
    const minted = await mintPreSaleNFTV2(output.data, tempRefAddr);
    if (!minted) {
      bootstrap.play_err_sound();
      setMintingBool(false);
      setMintingState("");

      store.dispatch(SetFailureNotificationBool(true));
      store.dispatch(SetFailureNotificationMessage("Minting Failed"));

      initializePreMintVars();
      return;
    } else {
      bootstrap.play_dr_bits_success_sound();
      store.dispatch(SetSuccessNotificationBool(true));
      store.dispatch(SetSuccessNotificationMessage(`Success`));
      setTimeout(() => {
        // handleModalOpen()
      }, 1000);
    }

    setMintingBool(false);
    updatePresaleMintedCount();
  };

  const preSaleMintDrip = async () => {
    console.log("in_presalemintDrip", dripMintCardsQuantity);

    if (dripMintCardsQuantity < 1) {
      // setdripMintCardsQuantity(1)
      setMintingBool(false);
      setMintingState("");

      initializeDripPreMintVars();

      store.dispatch(SetFailureNotificationBool(true));
      store.dispatch(
        SetFailureNotificationMessage("Quantity should be greater than 0")
      );
      bootstrap.play_err_sound();

      return;
    }

    let tempRefAddr = "";
    if (driprefAddrMintCard == "" || dripRefBoxMintCard === 1) {
      setdripRefAddrMintCard(ethers.constants.AddressZero);
      tempRefAddr = ethers.constants.AddressZero;
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(refAddrMintCard);
      } catch (err) {
        console.log(" error in getting proper address from this .. ", err);
        tempRefAddr = ethers.constants.AddressZero;
        setdripRefAddrMintCard(ethers.constants.AddressZero);
      }
    }
    setMintingBool(true);
    setMintingState("Generating Drip Mint Card");

    const allowance = await checkAllowanceGeneral(
      store.getState().web3store.userAddress,
      PRESALE_DRIP_CONTRACT_V2
    );
    console.log("allowance -- >", allowance.toString());
    if (
      ethers.BigNumber.from("100000000000").gte(
        ethers.BigNumber.from(allowance.toString())
      )
    ) {
      console.log("less allowance");
      if (
        !(await approveWBTC2(
          PRESALE_DRIP_CONTRACT_V2,
          ethers.BigNumber.from("10000000000000000000")
        ))
      ) {
        setMintingBool(false);
        setMintingState("");

        store.dispatch(SetFailureNotificationBool(true));
        store.dispatch(SetFailureNotificationMessage("Approval Failed"));
        bootstrap.play_err_sound();

        initializeDripPreMintVars();
        return;
      }
    }

    const output = await randomGenarateDripPreSaleV2(
      store.getState().web3store.userAddress,
      dripMintCardsQuantity,
      driptatooMintCard === 1 ? "Yes" : "No",
      driptagMintCard === 1 ? "Yes" : "No"
    );
    console.log("---output ", output);

    setMintingState("Minting Drip Mint Card");
    const minted = await mintPreSaleDripNFTV2(
      output.data,
      tempRefAddr,
      driptatooMintCard === 1 ? 1 : 0,
      driptagMintCard === 1 ? 1 : 0
    );
    if (!minted) {
      bootstrap.play_err_sound();
      setMintingBool(false);
      setMintingState("");

      store.dispatch(SetFailureNotificationBool(true));
      store.dispatch(SetFailureNotificationMessage("Minting Failed"));

      initializeDripPreMintVars();
      return;
    } else {
      bootstrap.play_dr_bits_success_sound();
      store.dispatch(SetSuccessNotificationBool(true));
      store.dispatch(SetSuccessNotificationMessage(`Success`));
      setTimeout(() => {
        // handleModalOpen()
      }, 1000);
    }

    setMintingBool(false);
    // setSnackBarOpen(true);

    updatePresaleMintedCount();
    updateDripPresaleMintedCount();
  };

  const titleState =
    cardState === PageStates.NotConnectedState
      ? "Offline"
      : cardState === PageStates.Minting
      ? "Minting"
      : "Ready";

  const photoState =
    cardState === PageStates.NotConnectedState ||
    cardState === PageStates.Minting ? (
      <>
        <img
          src={
            totalPresaleCount - preSaleMintedNFT < 0
              ? statusNotReady
              : statusNotReady
          }
          alt="status-photo"
          className="mint-card-base__status__photo"
        />
        <img
          src={
            totalPresaleCount - preSaleMintedNFT < 0
              ? statusNotReady
              : non_statusReady
          }
          alt="status-photo"
          className="mint-card-base__status__photo"
        />
      </>
    ) : (
      <>
        <img
          src={
            totalPresaleCount - preSaleMintedNFT < 0
              ? statusNotReady
              : non_statusNotReady
          }
          alt="status-photo"
          className="mint-card-base__status__photo"
        />
        <img
          src={
            totalPresaleCount - preSaleMintedNFT < 0
              ? statusNotReady
              : statusReady
          }
          alt="status-photo"
          className="mint-card-base__status__photo"
        />
      </>
    );

  const displayInnerPart =
    cardState === PageStates.NotConnectedState ? (
      <img src={pleaseConnect} alt="please-connect-img" />
    ) : cardState === PageStates.Minting ? (
      <>
        <h5>Bit Fighter Mint Card</h5>
        <p>
          {`${dripPresaleMintedNFT} of ${totalDripPresaleCount}`}
          <br></br> Minted
        </p>
      </>
    ) : cardState === PageStates.Presale ? (
      <>
        <h5>Drip Fighter Mint Card</h5>
        <p>
          {`${preSaleMintedNFT} of ${totalPresaleCount}`}
          <br></br> Minted
        </p>
      </>
    ) : cardState === PageStates.DripPreSale ? (
      <>
        <h5>Bit Fighter Mint Card</h5>
        <p>
          {`${dripPresaleMintedNFT} of ${totalDripPresaleCount}`}
          <br></br> Minted
        </p>
      </>
    ) : cardState === PageStates.OneKClub ? (
      <>
        <h5>The 1K Club</h5>
        <p>
          {`${dripPresaleMintedNFT} of ${totalDripPresaleCount}`}
          <br></br> Minted
        </p>
      </>
    ) : (
      <>
        <img src={welcome} alt="welcome-img" />
      </>
    );

  const displayFooterPart =
    cardState === PageStates.NotConnectedState ? (
      <Button
        onClick={preSaleMint}
        className="btn-mint--red btn-mint--big footer-connect"
      ></Button>
    ) : cardState === PageStates.Minting ? (
      <Button className="btn-mint--grey btn-mint--big"></Button>
    ) : cardState === PageStates.Presale ? (
      <Button
        onClick={preSaleMint}
        className="btn-mint--red btn-mint--big footer-go"
      ></Button>
    ) : cardState === PageStates.DripPreSale ? (
      <Button
        onClick={preSaleMint}
        className="btn-mint--red btn-mint--big footer-go"
      ></Button>
    ) : cardState === PageStates.OneKClub ? (
      <Button
        onClick={preSaleMint}
        className="btn-mint--red btn-mint--big footer-go"
      ></Button>
    ) : (
      <Button className="btn-mint--grey btn-mint--big"></Button>
    );

  const displayInfoPart =
    cardState === PageStates.NotConnectedState ? (
      <img
        src={totalPresaleCount - preSaleMintedNFT < 0 ? statusNotReady : bfMark}
        alt="status-photo"
        className="mint-card-base__status__photo"
      />
    ) : cardState === PageStates.Minting ? (
      <>
        <h1>Thank you!</h1>
        <div className="progress-info--bar">
          <p
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            Minting in Progress
          </p>
          <ProgressBarWrapper>
            <h3> {mintingState} </h3>
            <ProgressBar
              style={{
                backgroundColor: "dark",
              }}
            />
          </ProgressBarWrapper>
        </div>
        <div className="mint-card-base__info__btc">
          <img src={btcIcon} alt="btc-info" />
        </div>
      </>
    ) : cardState === PageStates.Presale ? (
      <>
        {totalPresaleCount - preSaleMintedNFT < 0 ? (
          <h2 className="mint-card-base__info__sold">Sold Out</h2>
        ) : (
          <>
            <div className="mint-card__form">
              <div className="mint-card__form__item mint-card__form__item--radio">
                <label htmlFor="code">Ref. Code:</label>
                <input
                  id="code"
                  type="text"
                  value={refAddrMintCard}
                  onChange={(e) => {
                    setRefAddrMintCard(e.target.value);
                  }}
                />
              </div>
              <div className="mint-card__form__item mint-card__form__item--radio">
                <label htmlFor="radio">I don&#39;t have one</label>
                <input
                  id="radio"
                  type="radio"
                  className="radio-circle"
                  value={refBoxMintCard}
                  onChange={(e) => {
                    setRefBoxMintCard(e.target.checked ? 1 : 0);
                  }}
                />
                <input
                  id="radio"
                  type="radio"
                  className="radio-circle"
                  value={refBoxMintCard}
                  onChange={(e) => {
                    setRefBoxMintCard(e.target.checked ? 1 : 0);
                  }}
                />
              </div>
              <div className="mint-card__form__item">
                <p className="red">100% of Addons goes to Drip</p>
              </div>

              <div className="mint-card__form__item mint-card__form__item--radio">
                <label htmlFor="radio">Add Drip Tag: 0.002BTC.b</label>
                <input
                  id="radio"
                  type="radio"
                  className="radio-circle"
                  value={refBoxMintCard}
                  onChange={(e) => {
                    setdriptagMintCard(e.target.checked ? 1 : 0);
                  }}
                />
              </div>

              <div className="mint-card__form__item mint-card__form__item--radio">
                <label htmlFor="radio">Add Drip Tatoo: 0.002BTC.b</label>
                <input
                  id="radio"
                  type="radio"
                  className="radio-circle"
                  value={refBoxMintCard}
                  onChange={(e) => {
                    setdriptatooMintCard(e.target.checked ? 1 : 0);
                  }}
                />
              </div>

              <div className="mint-card__form__item mint-card__form__item--radio">
                <label htmlFor="radio">Add Both: 0.003BTC.b</label>
                <input
                  id="radio"
                  type="radio"
                  className="radio-circle"
                  value={refBoxMintCard}
                  onChange={(e) => {
                    setdriptatooMintCard(e.target.checked ? 1 : 0);
                  }}
                />
              </div>

              <div className="mint-card__form__item mint-card__form__item--radio">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  onChange={(e) => {
                    setmintCardsQuantity(parseInt(e.target.value));
                  }}
                  style={{
                    outline: "None",
                  }}
                />
              </div>
            </div>
            <div className="mint-card-base__info__btc">
              <span>
                {(mintCardsQuantity * 0.0015
                  ? mintCardsQuantity * 0.0015
                  : 0
                ).toFixed(4)}{" "}
                BTC.b
              </span>
              <img src={btcIcon} alt="btc-info" />
            </div>
          </>
        )}
      </>
    ) : cardState === PageStates.DripPreSale ? (
      <>
        <div className="mint-card__form">
          <div className="mint-card__form__item mint-card__form__item--radio">
            <label htmlFor="code">Ref. Code:</label>
            <input
              id="code"
              type="text"
              value={refAddrMintCard}
              onChange={(e) => {
                setRefAddrMintCard(e.target.value);
              }}
            />
          </div>
          <div className="mint-card__form__item mint-card__form__item--radio">
            <label htmlFor="radio">I don&#39;t have one</label>
            <input
              id="radio"
              type="radio"
              className="radio-circle"
              value={refBoxMintCard}
              onChange={(e) => {
                setRefBoxMintCard(e.target.checked ? 1 : 0);
              }}
            />
            <input
              id="radio"
              type="radio"
              className="radio-circle"
              value={refBoxMintCard}
              onChange={(e) => {
                setRefBoxMintCard(e.target.checked ? 1 : 0);
              }}
            />
          </div>
          <div className="mint-card__form__item mint-card__form__item--radio">
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              onChange={(e) => {
                setmintCardsQuantity(parseInt(e.target.value));
              }}
              style={{
                outline: "None",
              }}
            />
          </div>
        </div>
        <div className="mint-card-base__info__btc">
          <span>
            {(mintCardsQuantity * 0.0015
              ? mintCardsQuantity * 0.0015
              : 0
            ).toFixed(4)}{" "}
            BTC.b
          </span>
          <img src={btcIcon} alt="btc-info" />
        </div>
      </>
    ) : cardState === PageStates.OneKClub ? (
      <>
        <h5>Card #: {mintCardsQuantity}</h5>
        <h5>Price: {mintCardsQuantity}</h5>
        <h5>Quantity: {mintCardsQuantity}</h5>
        <div className="mint-card-base__info__btc">
          <h6>200$</h6>
        </div>
      </>
    ) : (
      <>
        <img
          src={makeselection}
          alt="makeselection-img"
          className="makeselection-img"
        />
      </>
    );

  const CustomUI = (
    <div className="mint-card-base__wrapper">
      <article className="mint-card-base">
        <div className="mint-card-base__layer">
          {/* <div className="mint-card-base__slice"> */}
          <div className="mint-card-base__inner">
            <div className="mint-card-base__status">
              <div className="mint-card-base__status__title">
                {totalPresaleCount - preSaleMintedNFT < 0 ? (
                  " "
                ) : (
                  <p>{titleState}</p>
                )}
              </div>
              <>{photoState}</>
            </div>
            <div className="mint-card-base__display">
              <div className="mint-card-base__display__inner">
                {displayInnerPart}
              </div>
            </div>
            <div className="mint-card-base__info">
              <div className="mint-card-base__info__inner">
                {displayInfoPart}
              </div>
            </div>
            <div className="mint-card-base__footer">
              {!mintingBool ? (
                <>{displayFooterPart}</>
              ) : (
                <ProgressBarWrapper
                  style={{
                    margin: "20px",
                    padding: "10px",
                  }}
                >
                  <h3> {mintingState} </h3>
                  <ProgressBar
                    style={{
                      backgroundColor: "orange",
                    }}
                  />
                </ProgressBarWrapper>
              )}
              <img src={cardBlock} alt="card-block" />
              <h3>M-o-M Inc.</h3>
            </div>
          </div>
          {/* </div> */}
        </div>
      </article>
      <SidePanel />
    </div>
  );
  return (
    <div>
      <NotificationMessageHelper />
      {CustomUI}
    </div>
  );
}

export default MintCard;
