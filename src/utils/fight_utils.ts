
import { FetchAllBetsOfPlayer, FetchFightEntryInfo, FetchParticularBetOfPlayer } from "../hooks/ApiCaller";
import store from "../stores";
import { SetFightEntryInfo } from "../stores/QueueDetailedInfo";
// import { SetFightEntryInfo } from "../stores/QueueDetailedInfo";
import { AddPlayersBetInfo } from "../stores/UserWebsiteStore";
// import { QueueSingleEntry } from "./interface";


export interface BetData {
  fight_id: string;
  bet_amount: number;
  player_bet_on: string;
}

export async function updateBetInfOfPlayer() {
  const data = await FetchAllBetsOfPlayer()
  console.log("queue bets all - ", data.data)
  const result = data.data as Array<BetData>;
  // const info : Map<string, string> = new Map();
  const info: any = {}
  for (let  i = 0;  i < result.length; i++) {
    info[result[i].fight_id] = `${result[i].bet_amount}::${result[i].player_bet_on}`;
  }
  console.log("queue all data -- ", info)
  store.dispatch(AddPlayersBetInfo(result))
  // store.dispatch(ChangeCombinedQueueData(store.getState().userPathStore.CombinedQueueData))
}

export async function updateSingleBetInfOfPlayer(fight_id: string) {
  const data = await FetchParticularBetOfPlayer(fight_id)
  console.log("queue single bet - ", data.data)
  const result = data.data as BetData;
  // const info: any = {}
  // for (let  i = 0;  i < result.length; i++) {
  //   info[result[i].fight_id] = `${result[i].bet_amount}::${result[i].player_bet_on}`;
  // }
  const currBetsArray = store.getState().userPathStore.playersBetInfo;
  currBetsArray.push(result)
  // console.log("queue all data -- ", info)
  store.dispatch(AddPlayersBetInfo(currBetsArray))
  // store.dispatch(ChangeCombinedQueueData(store.getState().userPathStore.CombinedQueueData))
}

export async function LoopAllFightsAndUpdate() {
  // 
  console.log("in_LoopAllFightsAndUpdate")
  const tempCombinedQueueData = store.getState().userPathStore.CombinedQueueData;
  tempCombinedQueueData.forEach(async (_temp) => {
    const result = await FetchFightEntryInfo(_temp.fight_id);
    if (result === "") {
      console.log("failed in LoopAllFightsAndUpdate--", _temp.fight_id)
    }
    const tempMap: any = store.getState().queueDetailedInfo.queue_to_fight_info_map;
    // console.log("LoopAllFightsAndUpdate**", result);
    const copyData = JSON.parse(JSON.stringify(tempMap));
    copyData[_temp.fight_id] = result;
    console.log("LoopAllFightsAndUpdate**", copyData);
    store.dispatch(SetFightEntryInfo(copyData))
  })
}