import { FetchGameServerConnectionURL, ListGameServersApiCall } from "../hooks/ApiCaller";
import store from "../stores";
import { SetGameServersData, SetSelectedGameServerURL } from "../stores/WebsiteStateStore";

export async function ListGameServers(region: string) {
  console.log("ListGameServersApiCall")
  const serverList = await ListGameServersApiCall(store.getState().web3store.userAddress, region)
  console.log("server list -- ", serverList.data)
  store.dispatch(SetGameServersData(serverList.data));
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function FetchGameServerConnection(room_id: string) {
  console.log("FetchGameServerConnection")
  let serverConnection = await FetchGameServerConnectionURL(store.getState().web3store.userAddress, room_id)
  if (serverConnection === "false") {
    while (serverConnection === "false") {
      serverConnection = await FetchGameServerConnectionURL(store.getState().web3store.userAddress, room_id)
      await delay(5000)
    }
  }
  console.log("server info FetchGameServerConnection -- ", serverConnection.data)
  store.dispatch(SetSelectedGameServerURL(serverConnection.data));
}