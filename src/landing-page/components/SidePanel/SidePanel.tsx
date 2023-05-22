import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import { MintCardProps } from "../MintCard/MintCard";
import "./SidePanel.scss";

function SidePanel({ type }: MintCardProps) {
  const dispatch = useDispatch();
  return (
    <aside className="side-panel">
      <div className="side-panel__layer">
        <div className="side-panel__inner">
          <Button
            onClick={() => dispatch(setCardState({ cardType: "small_info" }))}
            className="btn-mint--red btn-mint--big"
          >
            Pre-Sale
          </Button>
          <Button
            onClick={() => dispatch(setCardState({ cardType: "big_info" }))}
            className="btn-mint--red btn-mint--small"
          >
            Bit Fighter
          </Button>
          <Button className="btn-mint--red btn-mint--small">
            Drip Fighter
          </Button>
          {type === "big_info" ? (
            <Button className="btn-mint--red btn-mint--small">Building</Button>
          ) : (
            <Button className="btn-mint--dark btn-mint--small">
              Coming Soon!
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default SidePanel;
