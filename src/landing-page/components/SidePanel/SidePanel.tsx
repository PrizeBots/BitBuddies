import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import "./SidePanel.scss";

export enum PageStates {
  Presale= "presale",
  OneKClub = "oneKClub",
  DripPreSale = "drip_presale",
  Minting = "Minting",
  NotConnectedState = "NotConnected",
  Bitfighter = "Bitfighter",
  ProgressState = "progress"
}

function SidePanel() {
  const dispatch = useDispatch();
  return (
    <aside className="side-panel">
      <div className="side-panel__layer">
        <div className="side-panel__inner">
          <Button
            onClick={() => dispatch(setCardState(PageStates.Presale))}
            className="btn-mint--red btn-mint--small"
          >
            Pre-Sale
          </Button>
          <Button
            onClick={() => dispatch(setCardState(PageStates.DripPreSale))}
            className="btn-mint--red btn-mint--small"
          >
            Drip Pre-Sale
          </Button>
{/* 
          <Button
            onClick={() => dispatch(setCardState(PageStates.Bitfighter))}
            className="btn-mint--red btn-mint--small"
          >
            Bit Fighter
          </Button> */}

          <Button 
            className="btn-mint--dark btn-mint--small"
            // onClick={() => dispatch(setCardState(PageStates.OneKClub))}
          >
            1k Club
          </Button>

          <Button className="btn-mint--dark btn-mint--small" disabled={true} >
            Coming Soon
          </Button>
          {/* <Button className="btn-mint--red btn-mint--small">
            Drip Fighter
          </Button> */}
          {/* {type === "big_info" ? (
            <Button className="btn-mint--red btn-mint--small">Building</Button>
          ) : (
            <Button className="btn-mint--dark btn-mint--small">
              Coming Soon!
            </Button>
          )} */}
        </div>
      </div>
    </aside>
  );
}

export default SidePanel;
