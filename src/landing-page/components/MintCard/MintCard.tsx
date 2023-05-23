import { useSelector } from "react-redux";
import { selectMintCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import SidePanel from "../SidePanel/SidePanel";

import MintCardForm from "../MintCardForm/MintCardForm";
import statusReady from "../../../assets/images/status-ready.png";
import statusNotReady from "../../../assets/images/status-not-ready.png";
import btcIcon from "../../../assets/images/btc-icon.png";
import cardBlock from "../../../assets/images/card-block.png";

import "./MintCard.scss";
import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";

function MintCard() {
  const dispatch = useDispatch();
  const type = useSelector(selectMintCardState);

  let isBigInfo = false;
  let isSoldOut = false;
  if (type === "big_info") {
    isBigInfo = true;
  } else if (type === "sold_out") {
    isSoldOut = true;
  }

  const handleGo = () => {
    if (type === "small_info") {
      dispatch(setCardState({ cardType: "sold_out" }));
    }
  };

  return (
    <div className="mint-card__wrapper">
      <article className="mint-card">
        <div className="mint-card__layer">
          <div className="mint-card__inner">
            <div className="mint-card__status">
              <div className="mint-card__status__title">
                {isSoldOut ? " " : <p>Ready</p>}
              </div>
              <img
                src={isSoldOut ? statusNotReady : statusReady}
                alt="status-photo"
                className="mint-card__status__photo"
              />
            </div>
            <div className="mint-card__display">
              <div className="mint-card__display__inner">
                <p>Pre-Sale Mint Card</p>
                <h4>{isSoldOut ? "400 of 400" : "0 of 400"}</h4>
                <h4>Minted</h4>
              </div>
            </div>
            <div className="mint-card__info">
              <div className="mint-card__info__inner">
                {isSoldOut ? (
                  <h2 className="mint-card__info__sold">Sold Out</h2>
                ) : (
                  <>
                    {isBigInfo && <MintCardForm />}
                    <div className="mint-card__info__btc">
                      <span>0.0015 BTC.b</span>
                      <img src={btcIcon} alt="btc-info" />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mint-card__footer">
              <Button
                onClick={handleGo}
                className="btn-mint--red btn-mint--big"
              >
                GO!
              </Button>
              <img src={cardBlock} alt="card-block" />
              <h3>M-o-M Inc.</h3>
            </div>
          </div>
        </div>
      </article>
      <SidePanel />
    </div>
  );
}

export default MintCard;
