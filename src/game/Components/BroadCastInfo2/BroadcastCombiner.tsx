import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Timer } from "./Timer";
import { LeftHealthBars } from "./LeftHealthBars";
import { RightHealthBars } from "./RightHealthBars";
import { LeftPlayerInfo } from "./LeftPlayerInfo";
import { RightPlayerInfo } from "./RightPlayerInfo";
import { TurnMouseClickOff } from "../../../stores/UserActions";
import { PlayersPrizeMoney } from "./PlayersPrizeMoney";



export function BroadCastCombiner2() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  const dispatch = useAppDispatch()
  return (
    <div 
      // onMouseOver={() => {
      //   // console.log(" mouse over in broadcast combiner")
      //   dispatch(TurnMouseClickOff(true))
      // }}
      // onMouseOut={() =>{ 
      //   // console.log(" mouse out in broadcast combiner")
      //   dispatch(TurnMouseClickOff(false))
      // }}
    >
    { (fightersInfo.preFightStarted) && 
      <div>
          {/* <BroadcastingAnnouncement /> */}
          <LeftPlayerInfo />
          <LeftHealthBars />
          <Timer />
          <RightHealthBars />
          <RightPlayerInfo />
          <PlayersPrizeMoney />
      </div>
      
    }
    </div>
  )
}