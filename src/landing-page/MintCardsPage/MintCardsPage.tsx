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
        <MintCard />
      </div>
    </main>
  );
}

export default MintCardsPage;
