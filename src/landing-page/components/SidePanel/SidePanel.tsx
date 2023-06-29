import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import Button from "../Button/Button";
import "./SidePanel.scss";
import { useAppSelector } from "../../../hooks";
import offlineBtns from "../../../assets/images/work/Mint_Panel__0002_offlineBTns.png";
import store from "../../../stores";
import { SetSuccessNotificationBool, SetSuccessNotificationMessage } from "../../../stores/NotificationStore";
import NotificationMessageHelper from "../../../game/Components/NotificationMessageHelper";
import { SetMetaTagDescription } from "../../../stores/MetaInfoStore";


export enum PageStates {
  Presale = "presale",
  OneKClub = "oneKClub",
  DripPreSale = "drip_presale",
  Minting = "Minting",
  NotConnectedState = "NotConnected",
  Bitfighter = "Bitfighter",
  ProgressState = "progress",
  MakeSelection = "make_selection",
  FailedState = "failed_state"
}

const SidePanel = () => {
  const loggedInUserWalletAddress = useAppSelector(
    (state) => state.web3store.userAddress
  );
  const dispatch = useDispatch();
  const state = useAppSelector(
    (state) => state.mintCardStateStore.state_selected
  );
  const refrinkHandle = () => {
    const temp = document.URL;
    console.log(temp, document);

    const allMetaElements = document.getElementsByTagName('meta')
    console.log("meta -- ", allMetaElements)
    for (let i=0; i<allMetaElements.length; i++) { 
      console.log("---meta", allMetaElements[i].getAttribute("name"))
      if (allMetaElements[i].getAttribute("name") === "description") { 
        //make necessary changes
        console.log("meta 1 -- ", allMetaElements[i])
        // Use my ref code to join my gang and dominate the cities with me!
        // store.dispatch(SetMetaTagDescription())
        allMetaElements[i].setAttribute('description', "Use my ref code to join my gang and dominate the cities with me!"); 
        allMetaElements[i].setAttribute('title', "Bit Fighters"); 
        allMetaElements[i].setAttribute('og:description', "Use my ref code to join my gang and dominate the cities with me!"); 
        allMetaElements[i].setAttribute('og:title', "Bit Fighters"); 
        break;
      } 
    } 

    navigator.clipboard
      .writeText(temp + "?ref_code=" + loggedInUserWalletAddress)
      .then(() => {
        store.dispatch(SetSuccessNotificationBool(true));
        store.dispatch(SetSuccessNotificationMessage("Your ref link has been copied! Go paste and share it with everyone!"));
        // confirm(
        //   "Your ref link has been copied! Go paste and share it with everyone!"
        // );
      });
  };
  return (
    <div>
      <NotificationMessageHelper />
      <aside className="side-panel">
        <div className="side-panel__layer">
          <div className="side-panel__inner">
            <div className="bottom-button-cover"></div>
            {
              <>
                {state === PageStates.Presale ? (
                  <>
                    <div className="btn-mint--small presale-state-active"></div>
                  </>
                ) : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "Drip Fighter Mint Card");
                          dispatch(setCardState(PageStates.Presale));
                        }}
                        className="btn-mint--small sidePanel-drip"
                      ></div>
                    )}
                  </>
                )}
                {state === PageStates.DripPreSale ? (
                  <>
                    <div className="btn-mint--small drippresale-state-active"></div>
                  </>
                ) : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "Bit Fighter Mint Card");
                          dispatch(setCardState(PageStates.DripPreSale));
                        }}
                        className="btn-mint--small sidePanel-bit"
                      ></div>
                    )}
                  </>
                )}
                {state === PageStates.OneKClub ? (
                  <>
                    <div className="btn-mint--small oneclub-state-active"></div>
                  </>
                ) : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "The 1K Club");
                          dispatch(setCardState(PageStates.OneKClub));
                        }}
                        className="btn-mint--small sidePanel-oneclub"
                      ></div>
                    )}
                  </>
                )}
                <div className="btn-mint--small sidePanel-disabled"></div>

                {state === PageStates.NotConnectedState ? (
                  <div className="btn-mint--small sidePanel-refrink-disabled sidePanel-disabled"></div>
                ) : (
                  <div
                    onClick={refrinkHandle}
                    className="btn-mint--small sidePanel-refrink"
                  ></div>
                )}
              </>
            }
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidePanel;
