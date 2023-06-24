import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import "./SidePanel.scss";
import { useAppSelector } from "../../../hooks";
import offlineBtns from "../../../assets/images/work/Mint_Panel__0002_offlineBTns.png";

export enum PageStates {
  Presale = "presale",
  OneKClub = "oneKClub",
  DripPreSale = "drip_presale",
  Minting = "Minting",
  NotConnectedState = "NotConnected",
  Bitfighter = "Bitfighter",
  ProgressState = "progress",
}

const SidePanel = () => {
  const dispatch = useDispatch();
  const state = useAppSelector(
    (state) => state.mintCardStateStore.state_selected
  );
  const refrinkHandle = () => {
    navigator.clipboard.writeText(" www.bitfighters.club/mint/ref?=0x000000000000000").then(() => {
      confirm("Your ref link has been copied! Go paste and share it with everyone!")
    })
  }
  return (
    <aside className="side-panel">
      <div className="side-panel__layer">
        <div className="side-panel__inner">
          <div className="bottom-button-cover"></div>
            {<>
              {state === PageStates.Presale ? (
                <>
                  <div className="btn-mint--small presale-state-active"></div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => dispatch(setCardState(PageStates.Presale))}
                    className="btn-mint--small sidePanel-drip"
                  ></div>
                </>
              )}
              {state === PageStates.DripPreSale ? (
                <>
                  <div className="btn-mint--small drippresale-state-active"></div>
                </>
              ) : (
                <>
                  <div
                    onClick={() =>
                      dispatch(setCardState(PageStates.DripPreSale))
                    }
                    className="btn-mint--small sidePanel-bit"
                  ></div>
                </>
              )}
              {state === PageStates.OneKClub ? (
                <>
                  <div className="btn-mint--small oneclub-state-active"></div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => dispatch(setCardState(PageStates.OneKClub))}
                    className="btn-mint--small sidePanel-oneclub"
                  ></div>
                </>
              )}
              <div
                className="btn-mint--small sidePanel-disabled"
              ></div>
              <div
                className="btn-mint--small sidePanel-refrink"
                onClick={refrinkHandle}
              ></div>
            </>
          }
        </div>
      </div>
    </aside>
  );
};

export default SidePanel;
