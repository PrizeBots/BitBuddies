import { useSelector } from "react-redux";
import { selectMintCardState } from "../../stores/MintCardStateStore";
import MintCard from "../components/MintCard/MintCard";
import "./MintCardsPage.scss";

function MintCardsPage() {
  const type = useSelector(selectMintCardState);
  return (
    <main className="main">
      <div className="cards">
        <MintCard type={type} />
      </div>
    </main>
  );
}

export default MintCardsPage;
