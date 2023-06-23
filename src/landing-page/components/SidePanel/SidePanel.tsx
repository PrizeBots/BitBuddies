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
  return (
    <aside className="side-panel">
      <div className="side-panel__layer">
        <div className="side-panel__inner">
          {state === PageStates.NotConnectedState ? (
            <>
              <img src={offlineBtns} alt="offlineBtns-img" />
            </>
          ) : (
            <>
              <Button
                onClick={() => dispatch(setCardState(PageStates.Presale))}
                className="btn-mint--red btn-mint--small sidePanel-drip"
              ></Button>
              <Button
                onClick={() => dispatch(setCardState(PageStates.DripPreSale))}
                className="btn-mint--red btn-mint--small sidePanel-bit"
              ></Button>
              <Button
                onClick={() => dispatch(setCardState(PageStates.OneKClub))}
                className="btn-mint--red btn-mint--small sidePanel-oneclub"
              ></Button>
              <Button
                className="btn-mint--red btn-mint--small sidePanel-refrink"
                disabled={true}
              ></Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidePanel;
