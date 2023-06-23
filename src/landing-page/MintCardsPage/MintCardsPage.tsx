import MintCard from "../components/MintCard/MintCard";
import "./MintCardsPage.scss";

import Button from "../components/Button/Button";
import { useDispatch } from "react-redux";
import { setCardState } from "../../stores/MintCardStateStore";

import { PageStates } from "../components/SidePanel/SidePanel";

function MintCardsPage() {
  const dispatch = useDispatch();
  return (
    <main className="main">
      <div className="cards">
        <div style={{display: "flex"}}>
        <Button
          onClick={() => dispatch(setCardState(PageStates.NotConnectedState))}
          className="btn-mint--red btn-mint--small sidePanel-drip"
        >
          Not Connect
        </Button>
        <Button
          onClick={() => dispatch(setCardState(PageStates.Minting))}
          className="btn-mint--red btn-mint--small sidePanel-drip"
        >
          Minting
        </Button>
        <Button
          onClick={() => dispatch(setCardState(PageStates.ProgressState))}
          className="btn-mint--red btn-mint--small sidePanel-drip"
        >
          Progress
        </Button>
      </div>
        <MintCard />
      </div>
      
    </main>
  );
}

export default MintCardsPage;
