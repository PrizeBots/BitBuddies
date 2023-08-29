import phaserGame from "../../PhaserGame";
import store from "../../stores";
// import { SetFocussedOnChat, ShowChatWindow } from "../../stores/UserActions";
import Game from "../scenes/Game";
import { IKeysInfo, INFTDataOfConnections, IPlayerData } from "../characters/IPlayer";
import { fetchPlayerWalletInfo } from "../../hooks/ApiCaller";
import { SetEquippedBrewCount, SetInHandBrew } from "../../stores/AssetStore";
import { addToChatArray, MessageType, AddInitialToChatArray } from "../../stores/ChatStore";
import { SetCurrentFightId, SetFightWinner } from "../../stores/FightsStore";
import { SetServerLatency, SetTotalConnections } from "../../stores/MetaInfoStore";
import { IfightersInfo, SetFightersInfo, ShowFightConfirmationStartTime, ShowFightConfirmationBox, FightPreStart, SetCurrentPlayerFighting, ClearFighterInfo, FightContinue, FightEnd, FightStart, SetCurrentOtherPlayerFighting } from "../../stores/UserActions";
import { ChangeCombinedQueueData, IQueueCombined, ChangeShowQueueBox, ChangeShowMenuBox, ChangeFightAnnouncementMessageFromServer, ChangeFightAnnouncementStateFromServer, ShowWinnerCardAtFightEnd } from "../../stores/UserWebsiteStore";
import { getBalances } from "../../utils/web3_utils";
import { createOtherCharacterAnimsV2 } from "../anims/CharacterAnims";
import { BrewManager } from "../characters/BrewMananger";
import { OtherPlayer } from "../characters/OtherPlayer";
import { SetQueuePoolState } from "../../stores/QueueDetailedInfo";

export default class Network {
  game: Game
  movementUpdateCounter = 0

  constructor() {
    this.game = phaserGame.scene.keys.game as Game;

    this.setSocketConnections()
  }
  setSocketConnections() {
    this.game.lobbySocketConnection.addEventListener("message", async (event) => {
      const objs = JSON.parse(event.data.replace(/'/g, '"'))
      // if (objs.length > 0) console.log("message_here --> ", objs)

      for (let gameQueueMessageIndex = 0; gameQueueMessageIndex < objs.length; gameQueueMessageIndex++) {
        const obj = objs[gameQueueMessageIndex];
        // if (obj.event !== "fight_update") {
        //   console.log("debug_messages-- ", obj)
        // }
        

        // if (obj.event === "ping") {
        //   // console.log(obj)
        //   this.game.lobbySocketConnection.send(JSON.stringify({
        //     event: "pong",
        //     walletAddress: store.getState().web3store.userAddress,
        //     orientation: "",
        //     room_id:"lobby",
        //     message: this.game.nftData.sprite_image
        //   }))
        //   const date = new Date();
        //   const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        //             date.getUTCDate(), date.getUTCHours(),
        //             date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        //   const timezoneOffset = (new Date()).getTimezoneOffset();
        //   const tempDiff =  Math.abs((new Date(now_utc).getTime() ) - (obj.server_time)) ;
        //   console.log("received ping ", new Date().getTime(), new Date(now_utc).getTime(), obj.server_time, (2 * tempDiff).toString(), timezoneOffset, obj.server_offset)
        //   store.dispatch(SetServerLatency((2 * tempDiff).toString()))
        // }

        // if (obj.event === "latency_check") {
        //   console.log(obj)
        //   this.game.otherPlayers.forEach(_player => {
        //     if (_player.wallet_address === obj.walletAddress && _player.gameObject && _player.wallet_address !== store.getState().web3store.userAddress) {
        //       const tempDiff =  obj.server_time - obj.client_time
        //       console.log("latency_check--", (2 * tempDiff).toString())
        //       store.dispatch(SetServerLatency((2 * tempDiff).toString()))
        //     }
        //   })
        // }

        if ( obj.event === "live_players" ) {
          // console.log("live_players..", obj)
          const tempList = []
          // delete disconnected players
          this.game.otherPlayers.forEach((_otherplayer) => {
            tempList.push(_otherplayer.wallet_address)
            if (!obj.live_players.includes(_otherplayer.wallet_address)) {
              console.log("live_players removing player,", _otherplayer.wallet_address)
              _otherplayer.gameObject?.DestroyGameObject()
              if (_otherplayer.gameObject) {
                // console.log("live_players removing sprite,", _otherplayer.wallet_address)
                this.game.otherPlayersGroup.remove(_otherplayer.gameObject?.sprite)
              }
              _otherplayer.gameObject = undefined
              this.game.otherPlayers.delete(_otherplayer.wallet_address + "_" + _otherplayer.minted_id)
              // this.game.textures.remove(_otherplayer.wallet_address)
            }
          })
        }

        if ( obj.event === "live_players_init" ) {
          console.log("live_players_init --- 1", obj)
          // console.log("live_players_init --- 1", this.game.otherPlayers)
          obj.live_players.forEach(( _details : INFTDataOfConnections) => {
            // if (
            //   // _details.walletAddress !== store.getState().web3store.userAddress
            //   true
            // ) {
              if (!this.game.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id)) {
                console.log("live_players_init player does not exists ", this.game.otherPlayers.size, _details)
                if (this.game.textures.exists(_details.walletAddress+ "_"+_details.minted_id)) {
                  console.log("live_players_init texture exists ", this.game.otherPlayers.size)
                  // if (!isNullOrUndefined(this.game.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id))) {
                    
                    const _otherplayer = this.game.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id)
                    if (_otherplayer) {
                      console.log("live_players_init deleting the other player ... ")
                      _otherplayer.gameObject?.DestroyGameObject()
                      if (_otherplayer.gameObject) this.game.otherPlayersGroup.remove(_otherplayer.gameObject.sprite)
                      _otherplayer.gameObject = undefined
                      this.game.otherPlayers.delete(_otherplayer.wallet_address + "_" + _otherplayer.minted_id)
                    }
                    this.game.otherPlayers.set(_details.walletAddress + "_" + _details.minted_id, {
                      wallet_address: _details.walletAddress,
                      nick_name: _details.nick_name,
                      setupDone: false,
                      sprite_url: _details.sprite_url,
                      profile_image: _details.profile_image,
                      x: _details.last_position_x,
                      y: _details.last_position_y,
                      minted_id: _details.minted_id.toString(),
                      lastKickTime: 0,
                      lastPunchTime: 0,
                      max_health: _details.max_health,
                      max_stamina: _details.max_stamina,
                      defense: _details.defense,
                      kickpower: _details.kickpower,
                      punchpower: _details.punchpower,
                      speed: _details.speed,
                      stamina: _details.stamina,
                      health: _details.health,
                    })
                    const otherPlayer = this.game.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id)

                    if (otherPlayer) {
                      otherPlayer.setupDone = true;
                      const otherP = otherPlayer.wallet_address !== store.getState().web3store.userAddress
                      otherPlayer.gameObject = new OtherPlayer(
                        this.game, 
                        otherPlayer.x, 
                        otherPlayer.y, 
                        `${otherPlayer.wallet_address}_${otherPlayer.minted_id.toString()}`,
                        `idle-${otherPlayer.wallet_address}_${otherPlayer.minted_id.toString()}`,
                        otherPlayer.nick_name, 
                        this.game.lobbySocketConnection,
                        otherP,
                        otherPlayer.wallet_address,
                        parseInt(otherPlayer.minted_id.toString()),
                        otherPlayer.max_health,
                        otherPlayer.max_stamina,
                        {
                          defense: otherPlayer.defense,
                          kickpower: otherPlayer.kickpower,
                          punchpower: otherPlayer.punchpower,
                          speed: otherPlayer.speed,
                          stamina: otherPlayer.stamina,
                          health: otherPlayer.stamina,
                        }
                      );
                      otherPlayer.gameObject.currHealth = _details.health;
                      otherPlayer.sprite = otherPlayer.gameObject.sprite;
                      this.game.otherPlayers.set(_details.walletAddress, otherPlayer)
                      this.game.otherPlayersGroup.add(otherPlayer.sprite)
                    }
                    console.log("live_players_init check ", _details, this.game.otherPlayers.size)
                  // }
                } 
                else {
                  console.log("live_players_init texture not found ", this.game.otherPlayers.size, _details.walletAddress+ "_" + _details.minted_id.toString())
                  // createOtherCharacterAnims(this.game.anims, _details.walletAddress + "_" + _details.minted_id.toString())
                  this.game.load.atlas(
                    _details.walletAddress+ "_" + _details.minted_id.toString(),
                    _details.sprite_url,
                    'bitfgihter_assets/player/texture-v2.json'
                  )
                  this.game.otherPlayers.set(_details.walletAddress + "_" + _details.minted_id.toString(), {
                    wallet_address: _details.walletAddress,
                    nick_name: _details.nick_name,
                    setupDone: false,
                    // all_data: _details.all_nft_data,
                    sprite_url: _details.sprite_url,
                    profile_image: _details.profile_image,
                    x: _details.last_position_x,
                    y: _details.last_position_y,
                    minted_id: _details.minted_id.toString(),
                    lastKickTime: 0,
                    lastPunchTime: 0,
                    max_health: _details.max_health,
                    max_stamina: _details.max_stamina,
                    defense: _details.defense,
                    kickpower: _details.kickpower,
                    punchpower: _details.punchpower,
                    speed: _details.speed,
                    stamina: _details.stamina,
                    health: _details.health,
                  })
                  this.game.load.start();
                  console.log("adding other player live_players_init", this.game.otherPlayers)
                }
              }
            // }
          })
        }


        if (obj.event === "show_stunned") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.stunned = false;
                _player.stunnedStarted = true;
                _player.gameObject.currStamina = obj.stamina;
              }
            }
          })
        }

        if (obj.event === "equip_brew") {
          // console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.hasBrewInHand = true
                _player.showEquipAnimationStarted = true
                if (_player.wallet_address === store.getState().web3store.userAddress) {
                  store.dispatch(SetEquippedBrewCount(0))
                  store.dispatch(SetInHandBrew(true))
                }
              }
            }
          })
        }

        if (obj.event === "unequip_brew") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.hasBrewInHand = false
                if (_player.wallet_address === store.getState().web3store.userAddress) {
                  store.dispatch(SetEquippedBrewCount(0))
                  store.dispatch(SetInHandBrew(false))
                }
              }
            }
          })
        }

        if (obj.event === "showWinAnimation") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.winningStarted = true;
              }
            }
          })
        }

        if (obj.event === "showLosingAnimation") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.losingStarted = true;
              }
            }
          })
        }

        if (obj.event === "showDeadAnim") {
          // console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.gameObject.dead = true;
                _player.gameObject.dead_last_time = new Date().getTime();
              }
            }
          })
        }

        if (obj.event === "stop_show_stunned") {
          // console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.stunned = false;
                _player.stunnedStarted = false;
                _player.gameObject.currStamina = obj.stamina;
              }
            }
          })
        }

        if (obj.event === "fight_update") {
          // console.log("debug.. fight_update", obj);
          // store.dispatch(SetFightersInfo(obj))
          const newObj: IfightersInfo = {...obj}
          
          // if (newObj.player1.walletAddress === store.getState().web3store.userAddress) {
          //   this.game.myPlayer.EnableHealthBars()
          // }
          // if (newObj.player2.walletAddress === store.getState().web3store.userAddress) {
          //   this.game.myPlayer.EnableHealthBars()
          // }
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === newObj.player1.walletAddress && _player.gameObject) {
              newObj.player1.max_health = _player.gameObject.max_health;
              newObj.player1.max_stamina = _player.gameObject.max_stamina;
              // newObj.player1.defense = _player.gameObject.defense;
              // newObj.player1.kickpower = _player.gameObject.kickPower;
              // newObj.player1.punchpower = _player.gameObject.punchPower;
              // newObj.player1.speed = _player.gameObject.speed;
              newObj.player1.profile_image = _player.profile_image;
              // newObj.player1.last_position_x = _player
              _player.gameObject?.EnableHealthBars()
              if (_player.gameObject) {
                _player.moving = true;
                // _player.gameObject.target_position_stored = {x: newObj.player1.last_position_x, y: newObj.player1.last_position_y};
              }
            }
            if (_player.wallet_address === newObj.player2.walletAddress && _player.gameObject) {
              newObj.player2.max_health = _player.gameObject.max_health;
              newObj.player2.max_stamina = _player.gameObject.max_stamina;
              // newObj.player2.defense = _player.gameObject.defense;
              // newObj.player2.kickpower = _player.gameObject.kickPower;
              // newObj.player2.punchpower = _player.gameObject.punchPower;
              // newObj.player2.speed = _player.gameObject.speed;
              newObj.player2.profile_image = _player.profile_image;
              _player.gameObject?.EnableHealthBars()
              if (_player.gameObject) {
                _player.moving = true;
                // _player.gameObject.target_position_stored = {x: newObj.player2.last_position_x, y: newObj.player2.last_position_y};
              }
            }
          })
          store.dispatch(SetFightersInfo(newObj))
        }

        if (obj.event === "teleport") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject
              //  && _player.wallet_address !== store.getState().web3store.userAddress && _player.gameObject
               ) {
              // console.log("only move ", obj)
              _player.gameObject.moving = false;
              _player.moving = false;
              _player.kicking = false;
              _player.punching = false;
              // _player.gameObject.sprite.x = obj.x
              // _player.gameObject.sprite.y = obj.y
              _player.gameObject.teleport = true
              console.log("teleport_debug------", _player.gameObject.gassed_lift_off_fallen)
              _player.gameObject.teleport_coordinates = {x: obj.x, y: obj.y};
              _player.gameObject.target_position_stored = {x: obj.x, y: obj.y};
              if (obj.orientation === 'right') _player.gameObject.sprite.flipX = false
              else _player.gameObject.sprite.flipX = true
            } 
            // else if (_player.wallet_address === obj.walletAddress && _player.wallet_address === store.getState().web3store.userAddress && _player.gameObject) {
            //   // _player.gameObject.sprite.x = obj.x;
            //   // _player.gameObject.sprite.y = obj.y;
            //   // ActionManager.AddTomoveActionQueue({ action_id, task_state: true, x: this.game.sprite.x, y: this.game.sprite.y } );
            //   _player.gameObject.teleport = true
            //   _player.gameObject.teleport_coordinates = {x: obj.x, y: obj.y};
            //   _player.gameObject.server_position_stored = {x: obj.x, y: obj.y};
            //   // _player.gameObject.last_server_move_action_id = obj.action_id;
            //   _player.gameObject.last_server_move_updated_at = new Date().getTime()
            // }
          })
        }

        if (obj.event === "got_hit_lift_off_fall" ) {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              _player.gameObject.gassed_lift_off_fall = true
              _player.gameObject.gassed_lift_off_fallen = true
              if (obj.orientation === 'right') _player.gameObject.sprite.flipX = false
              else _player.gameObject.sprite.flipX = true
            }
          })
        }

        if (obj.event === "swing_sound") {
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              this.game.playSwingSOund()
            }
          })
        }

        if (obj.event === "showGotBackHitAnimation") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              _player.gotBackHit = true;
            }
          })
        }

        if (obj.event === "showGotHitAnimation") {
          console.log(obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              _player.gotHit = true;
            }
          })
        }

        if (obj.event === "queue_info") {
          // console.log("debug queue_info--> ", obj.data)
          // store.dispatch(ChangeQueueData(obj.data))
          store.dispatch(ChangeCombinedQueueData(obj.data))
          const queueData: Array<IQueueCombined> = obj.data;
          // console.log("queue info 2--> ", queueData)
          queueData.map((data) => {
            // console.log("queue ",  data.user_wallet_address,
            //   (data.user_wallet_address === store.getState().web3store.userAddress 
            //   && !store.getState().userActionsDataStore.fightersInfo.fightStarted))
            if (
              (data.p1_wallet === store.getState().web3store.userAddress 
              || data.p2_wallet === store.getState().web3store.userAddress )
              && !store.getState().userActionsDataStore.fightersInfo.fightStarted
              && !store.getState().userActionsDataStore.fightPreStart
            ) {
              store.dispatch(ChangeShowQueueBox(true))
              store.dispatch(ChangeShowMenuBox(true))
            }
          })
        }

        if (obj.event === "notification") {
          console.log("debug_notification--> ", obj.data)
          if (obj.walletAddress === store.getState().web3store.userAddress) {
            if (obj.state === "join") {
              store.dispatch(SetQueuePoolState(true))
            } else {
              store.dispatch(SetQueuePoolState(false))
            }
          }
        }

        if (obj.event === "fight_confirmation" ) {
          console.log(" in fight_confirmation msg,,, ", obj)
          if (obj.walletAddress === store.getState().web3store.userAddress) {
            store.dispatch(ShowFightConfirmationStartTime(new Date().getTime()))
            store.dispatch(ShowFightConfirmationBox(true))
            setTimeout(() => {
              store.dispatch(ShowFightConfirmationBox(false))
              store.dispatch(ShowFightConfirmationStartTime(0))
            }, 20* 1000)
          }
        }

        if (obj.event === "fight_start_pre_announcement") {
          // console.log("debug_fight_start_pre_announcement  ",obj)
          store.dispatch(SetCurrentFightId(obj.fight_id))
          if (obj.message === "Fight!") {
            // this.game.myPlayer.movementAbility = true;
            this.game.playFightStartMusic()
          } else if (obj.message !== "") {
            this.game.playBoopMusic()
          }
          store.dispatch(ChangeFightAnnouncementMessageFromServer(obj.message))
          store.dispatch(ChangeFightAnnouncementStateFromServer(true))

          setTimeout(() => {
            store.dispatch(ChangeFightAnnouncementStateFromServer(false))
          }, 5000)

          let you_are_player_state = ""
          if (obj.player1 === store.getState().web3store.userAddress ) {
            store.dispatch(FightPreStart(true));
            // store.dispatch(FightPlayerSide("left"));
            you_are_player_state = "p1";
            store.dispatch(SetCurrentPlayerFighting(true));
            // store.dispatch(SetCurrentOtherPlayerFighting(obj.player2))
          } else if (obj.player2 === store.getState().web3store.userAddress) {
            store.dispatch(FightPreStart(true));
            // store.dispatch(FightPlayerSide("right"));
            you_are_player_state = "p2";
            store.dispatch(SetCurrentPlayerFighting(true));
            // store.dispatch(SetCurrentOtherPlayerFighting(obj.player1))
          }
          if (you_are_player_state != "") {
            this.game.cameras.main.stopFollow();
            this.game.cameras.main.centerOn(obj.centerX, obj.centerY);
            // this.game.cameras.main.centerOn(this.game.centerCoordinatesStage.x, this.game.centerCoordinatesStage.y);
          }
          // console.log("fight_start_announcement", "you are ", you_are_player_state, obj)
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.player1 || _player.wallet_address === obj.player2) {
              if (_player.gameObject) {
                _player.gameObject.playerContainer.remove(_player.gameObject.playerInfoIcon)
              }
            }
          })
          // console.log("fight_start_announcement", "other player ", this.game.fighterOtherPlayer)
        }

        if (obj.event === "fight_end_announcement") {
          // console.log(obj)
          // store.dispatch(ChangeFightAnnouncementMessageFromServer(obj.message))
          // store.dispatch(ChangeFightAnnouncementStateFromServer(true))
          const newObj: IfightersInfo = {...obj}
          store.dispatch(ClearFighterInfo())
          store.dispatch(SetFightWinner(obj.winner))

          store.dispatch(FightContinue(false))
          store.dispatch(FightEnd(false))
          store.dispatch(FightPreStart(false))
          store.dispatch(FightStart(false))
          
          store.dispatch(SetCurrentOtherPlayerFighting(""))

          setTimeout(() => {
            console.log("fight_end_announcement 4 seconds done.")
            store.dispatch(ChangeFightAnnouncementStateFromServer(false))
            store.dispatch(SetCurrentPlayerFighting(false));
          }, 6000)

          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === newObj.player1.walletAddress || _player.wallet_address === newObj.player2.walletAddress) {
              if (_player.gameObject && _player.wallet_address !== store.getState().web3store.userAddress) {
                _player.gameObject.playerContainer.add(_player.gameObject.playerInfoIcon)
              } else {
                if (_player.gameObject && _player.wallet_address === store.getState().web3store.userAddress) {
                  // this.game.cameras.main.startFollow(_player.gameObject.sprite, false, 0.2);
                  this.game.cameras.main.setBounds(0, 0, this.game.map.widthInPixels, this.game.map.heightInPixels);
                  this.game.cameras.main.startFollow(_player.gameObject.sprite);
                  if (store.getState().web3store.userAddress === obj.winner) {
                    // show that card.. 
                    console.log("in here fight_end_announcement ",obj.winner )
                    setTimeout(() => {
                      store.dispatch(ShowWinnerCardAtFightEnd(true))
                    }, 8000)
                    store.dispatch(ChangeFightAnnouncementMessageFromServer("You Win"))
                    store.dispatch(ChangeFightAnnouncementStateFromServer(true))
                  } else {
                    store.dispatch(ChangeFightAnnouncementMessageFromServer("You Lose"))
                    store.dispatch(ChangeFightAnnouncementStateFromServer(true))
                  }
                }
              }
            }
          })

          this.game.fighterOtherPlayer = "";
        }

        if (obj.event === "gotKickHit" || obj.event === "gotPunchHit") {
          const newObj: IfightersInfo = {...obj}
          const tempHealthP1 = newObj.player1.health;
          const tempHealthP2 = newObj.player2.health;
          const last_health_p1 = obj.last_health_p1;
          const last_health_p2 = obj.last_health_p2;

          this.game.otherPlayers.forEach((_player) => {
            if (_player.wallet_address === newObj.player1.walletAddress) {
              _player.gameObject?.EnableHealthBars()
              if (_player.wallet_address === store.getState().web3store.userAddress) {
                _player.gameObject?.DecreaseHealthValue(tempHealthP1, last_health_p1, "red")
              } else {
                _player.gameObject?.DecreaseHealthValue(tempHealthP1, last_health_p1)
              }
            }
            if (_player.wallet_address === newObj.player2.walletAddress) {
              _player.gameObject?.EnableHealthBars()
              if (_player.wallet_address === store.getState().web3store.userAddress) {
                _player.gameObject?.DecreaseHealthValue(tempHealthP2, last_health_p2, "red")
              } else {
                _player.gameObject?.DecreaseHealthValue(tempHealthP2, last_health_p2)
              }
            }
          })
          

          const newObj2: IfightersInfo = JSON.parse(JSON.stringify(store.getState().userActionsDataStore.fightersInfo));
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === newObj.player1.walletAddress && _player.gameObject) {
              if (newObj.player1.health < 0) {
                newObj2.player1.health = 0;
              } else {
                newObj2.player1.health = newObj.player1.health;
              }
              newObj2.player1.stamina = newObj.player1.stamina;
            }
            if (_player.wallet_address === newObj.player2.walletAddress && _player.gameObject) {
              if (newObj.player2.health < 0) {
                newObj2.player2.health = 0;
              } else {
                newObj2.player2.health = newObj.player2.health;
              }
              
              newObj2.player2.stamina = newObj.player2.stamina;
            }
          })
          store.dispatch(SetFightersInfo(newObj2))
        }

        if (obj.event === "kick" ) {
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject 
              // && _player.wallet_address !== store.getState().web3store.userAddress
              ) {
              _player.runStart = false;
              _player.running = false;
              _player.kicking = true;
              _player.kickStart = true;
              _player.kickStartTime = new Date().getTime()
            }
          })
        }

        if (obj.event === "punch") {
          this.game.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject 
              // && _player.wallet_address !== store.getState().web3store.userAddress
              ) {
              _player.runStart = false;
              _player.running = false;
              _player.punching = true;
              _player.punchStart = true;
              _player.punchStartTime = new Date().getTime()
            }
          })
        }

        if (obj.event === "fight_machine_button_press") {
          // if (this.game.fightMachineOverlapText.depth > 0) {
            if (obj.walletAddress !== store.getState().web3store.userAddress) {
              this.game.punchArea.setDepth(-1)
              setTimeout(() => {
                this.game.punchArea.setDepth(1)
                this.game.bootstrap.play_button_press_sound()
              }, 500)
            }
            
          // }
        }

        if ( obj.event === "chat" ) {
          // console.log("here --> ", obj)
          if (
            obj.walletAddress === store.getState().web3store.userAddress
          ) {
            store.dispatch(addToChatArray({
              nick_name: obj.nick_name,
              walletAddress: obj.walletAddress,
              message: obj.message,
              direction: "right",
              type: MessageType.Chat
            }));
          } else {
            store.dispatch(addToChatArray({
              nick_name: obj.nick_name,
              walletAddress: obj.walletAddress,
              message: obj.message,
              direction: "left",
              type: MessageType.Chat
            }));
          }
          this.game.otherPlayers.forEach((_player) => {
            console.log(_player.wallet_address, obj.walletAddress)
            if (_player.wallet_address === obj.walletAddress) _player.gameObject?.createNewDialogBox(obj.message)
          })
        }

        if (obj.event === "player_left") {
        // console.log(obj);
          store.dispatch(addToChatArray({
            nick_name: obj.nick_name,
            walletAddress: obj.walletAddress,
            message: " Left",
            direction: "left",
            type: MessageType.Announcement
          }));
        }

        if (obj.event === "joined") {
          console.log(obj);
          if (obj.walletAddress !== store.getState().web3store.userAddress) {
            store.dispatch(addToChatArray({
              nick_name: obj.nick_name,
              walletAddress: obj.walletAddress,
              message: " Joined",
              direction: "left",
              type: MessageType.Announcement
            }));
          } else {
            this.game.otherPlayers.forEach((_player) => {
              if (_player.wallet_address === obj.walletAddress && obj.walletAddress === store.getState().web3store.userAddress) {
                if (_player.gameObject) {
                  _player.gameObject.actualLastHealth = obj.health;
                  _player.gameObject.currStamina = objs.stamina;
                  _player.gameObject.currHealth = objs.health;
                }
              }
            })
          }
        }

        if (obj.event === "typing") {
          this.game.otherPlayers.forEach((_player) => {
            if (_player.wallet_address === obj.walletAddress) _player.gameObject?.createNewDialogBox(obj.message)
          })
        }

        if (obj.event === "update_balance") {
          // console.log(obj)
          if (obj.walletAddress === store.getState().web3store.userAddress) {
            getBalances(store.getState().web3store.userAddress)
          }
        }

        if (obj.event === "fetch_balance") {
          console.log("in fetchPlayerWalletInfo",obj, store.getState().web3store.userAddress)
          if (obj.user_wallet_address === store.getState().web3store.userAddress) {
            fetchPlayerWalletInfo()
            // getBalances(store.getState().web3store.userAddress)
          }
        }

        if (obj.event === "assets_update") {
          console.log(obj)
          // if (obj.walletAddress === store.getState().web3store.userAddress) {
          //   store.dispatch(SetAssetsInfo(obj.data))
          // }
        }

        if (obj.event === "update_health") {
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject && obj.walletAddress === _player.wallet_address) {
              if (obj.health < 0) {
                _player.gameObject.currHealth = 0;
              } else {
                _player.gameObject.currHealth = obj.health;
              }
            }
          })
          // const newObj: IfightersInfo = JSON.parse(JSON.stringify(store.getState().userActionsDataStore.fightersInfo));
          // this.game.otherPlayers.forEach(_player => {
          //   if (_player.wallet_address === newObj.player1.walletAddress && _player.gameObject) {
          //     newObj.player1.health = obj.health;
          //   }
          //   if (_player.wallet_address === newObj.player2.walletAddress && _player.gameObject) {
          //     newObj.player2.health = obj.health;
          //   }
          // })
          // store.dispatch(SetFightersInfo(newObj))
        }

        if (obj.event === "brew_used") {
          this.game.otherPlayers.forEach(_player => {
            if (_player.gameObject && obj.walletAddress === _player.wallet_address) {
              _player.drinkStarted = true;
              _player.drinking = false;
              _player.hasBrewInHand = false
            }
          })
        }

        if (obj.event === "eject_brew_server") {
          console.log(obj)
          this.game.brews.push({
              brew_id: obj.brew_id,
              gameObject: new BrewManager(this.game, obj.fromX, obj.fromY, obj.toX, obj.toY)
            }
          )
        }

        if (obj.event === "magnet_move_brew") {
          console.log(obj)
          for(let i =0; i < this.game.brews.length;i++) {
            if (this.game.brews[i].brew_id === obj.brew_id) {
              this.game.brews[i].gameObject.MagnetMoveBrew(obj.toX, obj.toY)
              break
            }
          }
        }
      }

      if (objs.event === "all_chats") {
        // console.log(obj)
        const chats = [];
        for (let i = 0; i < objs.chats.length; i++) {
          if (objs.chats[i].type === MessageType.Chat && objs.chats[i].walletAddress === store.getState().web3store.userAddress ) {
            objs.chats[i].direction = 'right'
          } else {
            objs.chats[i].direction = 'left'
          }
          chats.push(objs.chats[i])
        }
        store.dispatch(AddInitialToChatArray(objs.chats))
      }

      if (objs.event === "ping") {
        // console.log(objs)
        this.game.lobbySocketConnection.send(JSON.stringify({
          event: "pong",
          walletAddress: store.getState().web3store.userAddress,
          orientation: "",
          room_id:"lobby",
          message: this.game.nftData.sprite_image
        }))
        const date = new Date();
        const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                  date.getUTCDate(), date.getUTCHours(),
                  date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        const timezoneOffset = (new Date()).getTimezoneOffset();
        const tempDiff =  Math.abs((new Date(now_utc).getTime() ) - (objs.server_time)) ;
        // console.log("received ping ", new Date().getTime(), new Date(now_utc).getTime(), objs.server_time, (2 * tempDiff).toString(), timezoneOffset, objs.server_offset)
        // store.dispatch(SetServerLatency((2 * tempDiff).toString()))
        store.dispatch(SetServerLatency((objs.latency_time).toString()))
        store.dispatch(SetTotalConnections((objs.total_connections)))
      }

      if (objs.event === "move" || objs.event === "running") {
        // console.log("--- ", objs)
        this.game.otherPlayers.forEach(_player => {
          if (_player.wallet_address === objs.walletAddress && _player.gameObject 
            // && _player.wallet_address !== store.getState().web3store.userAddress
            ) {
            // console.log("only move ", objs)
            if (objs.event === "running") {
              _player.runStart = true;
            } else {
              _player.moving = true;
            }
            _player.gameObject.moving = true;
            _player.kicking = false;
            _player.punching = false;
            _player.gameObject.currStamina = objs.stamina;
            // console.log("move_current_stamina ", _player.gameObject.currStamina )
            _player.gameObject.currHealth = objs.health;
            
            _player.gameObject.target_position_stored = {x: objs.x, y: objs.y};
            _player.orientation = objs.orientation;
            if (objs.orientation === 'right') _player.gameObject.sprite.flipX = false
            else _player.gameObject.sprite.flipX = true
          } 
          // else if (_player.wallet_address === objs.walletAddress && _player.wallet_address === store.getState().web3store.userAddress && _player.gameObject) {
          //   // console.log("---- ", obj)

          //   _player.gameObject.currStamina = objs.stamina;
          //   _player.gameObject.currHealth = objs.health;
          //   // if (objs.stamina > 3) {}
          //   _player.gameObject.server_position_stored = {x: objs.x, y: objs.y};
          //   _player.gameObject.last_server_move_action_id = objs.action_id;
          //   _player.gameObject.last_server_move_updated_at = new Date().getTime()
          //   // console.log("pos_from_server", obj.walletAddress,  obj.x, obj.y, "pos_from_client", _player.gameObject?.sprite.x, _player.gameObject?.sprite.y, _player.stunned)
          // }
        })
      }

      this.game.load.on('filecomplete', (key: string, val:any) => {
        // console.log("filecomplete- live_players_init", key, val)
        if (this.game.otherPlayers.get(key) && key.split("_").length === 2) { 
          const otherPlayer = this.game.otherPlayers.get(key)
          if (otherPlayer) {
            if (!otherPlayer.setupDone) {
              console.log("filecomplete- live_players_init ---", key)
              createOtherCharacterAnimsV2(this.game.anims, key)
              otherPlayer.setupDone = true;
              const otherP = otherPlayer.wallet_address !== store.getState().web3store.userAddress
              otherPlayer.gameObject = new OtherPlayer(
                this.game, 
                otherPlayer.x, 
                otherPlayer.y, 
                key,
                `idle-${key}`,
                otherPlayer.nick_name, 
                this.game.lobbySocketConnection,
                otherP,
                otherPlayer.wallet_address,
                parseInt(otherPlayer.minted_id.toString()),
                otherPlayer.max_health,
                otherPlayer.max_stamina,
                {
                  defense: otherPlayer.defense,
                  kickpower: otherPlayer.kickpower,
                  punchpower: otherPlayer.punchpower,
                  speed: otherPlayer.speed,
                  stamina: otherPlayer.stamina,
                  health: otherPlayer.stamina,
                }
              );
              otherPlayer.sprite = otherPlayer.gameObject.sprite;
              this.game.otherPlayers.set(key, otherPlayer)
              this.game.otherPlayersGroup.add(otherPlayer.sprite)
              console.log("--- live_players_init all players ---",this.game.otherPlayers.size, this.game.otherPlayers)
              if (otherPlayer.wallet_address === store.getState().web3store.userAddress) {
                console.log("following live_players_init --", this.game.otherPlayers.size)
                // this.game.cameras.main.startFollow(otherPlayer.gameObject.sprite, false, 0.2);
                this.game.cameras.main.setBounds(0, 0, this.game.map.widthInPixels, this.game.map.heightInPixels);
                this.game.cameras.main.startFollow(otherPlayer.gameObject.sprite);
                // otherPlayer.gameObject.sprite.setScrollFactor(1)
              }
            }
          }
        }
      }, this);

    })
  }
}