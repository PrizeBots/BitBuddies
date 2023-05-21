import MintCard from "../components/MintCard/MintCard";
import "./MintCardsPage.scss";

function MintCardsPage() {
  return (
    <main className="main">
      <div className="cards">
        <MintCard type="big_info" />
        <MintCard type="small_info" />
        <MintCard type="sold_out" />
      </div>
    </main>
  );
}

export default MintCardsPage;
