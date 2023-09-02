import { createOtherCharacterAnimsV2 } from "../anims/CharacterAnims";
import Boundary, { Rect } from "../Components/Boundary";
import REACT_APP_LOBBY_WEBSOCKET_SERVER  from "../configs";
import { AddInitialToChatArray, addToChatArray, MessageType } from '../../stores/ChatStore';
import store from '../../stores'
import { IOtherPlayer } from "../characters/OtherPlayer";
import { ChangeCombinedQueueData, ChangeFightAnnouncementMessageFromServer, ChangeFightAnnouncementStateFromServer, ChangeNotificationMessageFromServer, ChangeNotificationStateFromServer, ChangePath, ChangeShowControls, ChangeShowMenuBox, ChangeShowQueueBox, IQueueCombined, ShowWinnerCardAtFightEnd } from "../../stores/UserWebsiteStore";
// import { MyPlayer } from "../characters/MyPlayer";
// import { OtherPlayer } from "../characters/OtherPlayer";
import { ClearFighterInfo, FightContinue, FightEnd, FightPreStart, FightStart, IfightersInfo, SetCurrentOtherPlayerFighting, SetCurrentPlayerFighting, SetFightersInfo, SetFocussedOnChat, ShowBrewEjectAnimationFromServer, ShowChatWindow, ShowFightConfirmationBox, ShowFightConfirmationStartTime, ShowFightConfirmationTime, ShowMagnetMoveBrew } from "../../stores/UserActions";
import { IKeysInfo, INFTDataOfConnections, IPlayerData } from "../characters/IPlayer";
import { SetCurrentGamePlayer } from "../../stores/PlayerData";
import { FightInfoText } from "../Components/FightInfoText";
import { isNullOrUndefined } from "util";
import phaserGame from "../../PhaserGame";
import Bootstrap from "./Bootstrap";
import { getRandomInt } from "../../utils";
import { random_spawn_points } from "../controls/randomSpawnPoints";
import { IMouse, IRatsStateManager, Mouse } from "../characters/Mouse";
import { createRatsAnims } from "../anims/createRatsAnims";
import { createSilverCoinAnim } from "../anims/createSilverCoinsAnim";
import { SetPlayerIdForGame } from "../../stores/Web3Store";
import { HQ } from "./views/Hq";
import { getBalances } from "../../utils/web3_utils";
// import { SetAssetsInfo } from "../../stores/Web3StoreBalances";
import { fetchPlayerAssets, fetchPlayerWalletInfo } from "../../hooks/ApiCaller";
import { updateBetInfOfPlayer } from "../../utils/fight_utils";
import  { SetServerLatency } from "../../stores/MetaInfoStore";
import { SetEquippedBrewCount, SetInHandBrew } from "../../stores/AssetStore";
import { SetCurrentFightId, SetFightWinner } from "../../stores/FightsStore";
// import { ActionManager } from "../ActionManager";
import { v4 as uuidv4 } from 'uuid';
import { SetGameLoadingState, SetShowGameServersList } from "../../stores/WebsiteStateStore";
import { BrewManager, IBrew } from "../characters/BrewMananger";
import KeyControls from "../services/KeyControls";
import Network from "../services/Networks";

const textAreaVisible = false;


export default class Game extends Phaser.Scene {
  background: any;
  public map!: Phaser.Tilemaps.Tilemap
  player: {
    movedLastFrame: any;
    sprite: any,
    gameObject: any;
  };
  public fighterOtherPlayer!: string;
  collidingWithOtherPlayers!: Set<string>;
  public otherPlayers = new Map<string, IOtherPlayer>()

  public mouses: Array<IMouse> = [];
  public brews: Array<IBrew> = [];

  otherPlayersGroup!: Phaser.Physics.Arcade.Group
  pressedKeys: Array<any>;
  CurrentKeysPressed: any;
  // keys: IKeysInfo;
  hq!: HQ;

  mousePressed = false;
  radiatorClicked = true;
  // lastKey: string;
  // myPlayer!: MyPlayer;
  fightMachineOverLapArea!: Phaser.Tilemaps.TilemapLayer
  fightMachineOverlapText!: Phaser.GameObjects.Text
  radiatorRect!: Rect;

  fightInfoTextClass!: FightInfoText
  nftData: any;
  basicCollisionCoordinatesX: Array<number> = [];
  basicCollisionCoordinatesY: Array<number> = [];
  boundaries: Array<Boundary> = []
  public lobbySocketConnection!: WebSocket;
  public lobbySocketConnected!: boolean;
  clubFrontLayer!: Phaser.Tilemaps.TilemapLayer;

  rootContainer!: Phaser.GameObjects.Container;
  stageArea!: Phaser.Tilemaps.TilemapLayer;
  radiatorLayer!: Phaser.Tilemaps.TilemapLayer;
  centerCoordinatesStage!: {x: number, y: number};

  mapKey!: string;
  err_music!: Phaser.Sound.BaseSound;
  bootstrap: Bootstrap;

  fight_music: Array<Phaser.Sound.BaseSound> = []
  punch_music_1!: Phaser.Sound.BaseSound
  punch_music_2!: Phaser.Sound.BaseSound
  boop_music!: Phaser.Sound.BaseSound
  fight_start_music!: Phaser.Sound.BaseSound

  swing_sound_1!:Phaser.Sound.BaseSound
  swing_sound_2!:Phaser.Sound.BaseSound
  swing_sound_3!:Phaser.Sound.BaseSound
  swing_sound_4!:Phaser.Sound.BaseSound

  coins_drop_sound!: Phaser.Sound.BaseSound
  coins_collect_sound!: Phaser.Sound.BaseSound

  punchArea!: Phaser.Tilemaps.TilemapLayer
  random_pos_selected!: number;

  enter_pressed = false;
  fightMachineOverlapRectReverse!: Rect;
  controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
  
  frameTime = 0;

  keyControls!: KeyControls;
  network!: Network;

  constructor() {
    super('game')
    // this.lastKey = ""
    this.player = {
      sprite: null,
      movedLastFrame: null,
      gameObject: null,
    };
    // this.keys = {
    //   keyA: {
    //     pressed: false,
    //     double_pressed: false,
    //   },
    //   keyD: {
    //     pressed: false,
    //     double_pressed: false,
    //   },
    //   keyS: {
    //     pressed: false,
    //   },
    //   keyW: {
    //     pressed: false,
    //   },
    //   keyP: {
    //     pressed: false,
    //   },
    //   keyK: {
    //     pressed: false,
    //   },
    //   leftShift: {
    //     pressed: false,
    //   },
    //   keyBlock: {
    //     pressed: false,
    //   },
    //   lastKey:"",
    // };
    this.lobbySocketConnected = false;
    this.collidingWithOtherPlayers = new Set();
    this.pressedKeys = [];
    this.CurrentKeysPressed = {};
    this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    console.log("running constructor game.. ")
  }

  init(data: {data: any, key: string}) {
    console.log("running init in game .. ", data)
    this.nftData = data.data;
    store.dispatch(SetCurrentGamePlayer(this.nftData))
    fetchPlayerWalletInfo(true)
    fetchPlayerAssets()
  }

  preload(data: {data: IPlayerData, key: string}) {
    console.log("running preload in game .. ", this.nftData)
    // this.load.atlas(
    //   'player-'+this.nftData.minted_id.toString(),
    //   this.nftData.data.sprite_image,
    //   'bitfgihter_assets/player/texture-v2.json'
    // )

    // for (let i = 0 ; i < 10 ; i++) {
    //   // load rats
    //   this.load.atlas(
    //     'rats-'+ i.toString(),
    //     'bitfgihter_assets/rat-sprite.png',
    //     'bitfgihter_assets/rat-sprite-json.json'
    //   )
    // }

    this.load.atlas(
      'rats',
      'bitfgihter_assets/rat-sprite.png',
      'bitfgihter_assets/rat-sprite-json.json'
    )
    
  }

  enableKeyBoard() {
    this.input.keyboard.enabled = true;
    this.input.mouse.enabled= true;
  }

  playFightMusic() {
    let isplaying = false;
    let isplayingIndex = -1;
    for(let i=0; i< this.fight_music.length; i++) {
      // this.fight_music[i].stop()
      if (this.fight_music[i].isPlaying) {
        isplaying = true
        isplayingIndex = i
        break
      }
      
    }
    if (!isplaying) {
      const random = Math.floor(Math.random() * this.fight_music.length)
      this.fight_music[random].play({loop: true})
    } 
    // else {
    //   // this.fight_music[isplayingIndex].play({loop: true})
    // }
    
    // if (!this.fight_music.isPlaying) this.fight_music.play({loop: true})
  }

  playPunchMusic() {
    const random = getRandomInt(2)

    if (random === 1) this.punch_music_1.play({loop: false})
    else this.punch_music_2.play({loop: false})
  }

  playSwingSOund() {
    const random = getRandomInt(4)

    if (random === 3) this.swing_sound_4.play({loop: false})
    if (random === 2) this.swing_sound_3.play({loop: false})
    if (random === 1) this.swing_sound_2.play({loop: false})
    else this.swing_sound_1.play({loop: false})
  }

  stopFightMusic() {
    for(let i=0; i< this.fight_music.length; i++) {
      this.fight_music[i].stop()
    }
    // this.fight_music.stop()
  }

  playBoopMusic() {
    this.boop_music.play({loop: false})
  }

  playFightStartMusic() {
    this.fight_start_music.play({loop: false})
  }

  disableKeyBOard() {
    this.input.keyboard.enabled = false;
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled= false;
    this.input.keyboard.enableGlobalCapture();  
  }

  async create(data: {data: any, key: string}) {
    // this.input.setPollAlways();
    this.err_music = this.sound.add('err_music');
    for(let i=0; i< 10; i++) {
      this.fight_music[i] = this.sound.add(`fight-music-${i+1}`, {volume: 0.4});
    }
    // this.fight_music = this.sound.add('fight-music', {volume: 0.4});
    this.punch_music_1 = this.sound.add('punch1-music', {volume: 0.4});
    this.punch_music_2 = this.sound.add('punch2-music', {volume: 0.4});
    this.fight_start_music = this.sound.add('fight-start-music');
    this.boop_music = this.sound.add('boop-music');

    this.swing_sound_1 = this.sound.add('swing-sound-1', {volume: 0.4});
    this.swing_sound_2 = this.sound.add('swing-sound-2', {volume: 0.4});
    this.swing_sound_3 = this.sound.add('swing-sound-3', {volume: 0.4});
    this.swing_sound_4 = this.sound.add('swing-sound-4', {volume: 0.4});

    this.coins_collect_sound = this.sound.add('coins_collect', {volume: 0.5});
    this.coins_drop_sound = this.sound.add('coins_drop', {volume: 0.5});

    this.random_pos_selected = Math.floor(Math.random() * random_spawn_points.length)
    console.log("this.random pos ", this.random_pos_selected);
    

    store.dispatch(ChangePath("gamePlay"));
    updateBetInfOfPlayer()

    // console.log(" game created .. ", data, data.key, this.nftData);
    // createCharacterAnims(this.anims)
    createOtherCharacterAnimsV2(this.anims, "player-"+ this.nftData.minted_id.toString())
    createSilverCoinAnim(this.anims, "silver_coin");

    this.mapKey = data.key;

    // const mapCreator = new MapCreator(this);
    // this.map = mapCreator.createMap(this.mapKey)
    console.log("websocket server--", process.env.REACT_APP_DEV_ENV, REACT_APP_LOBBY_WEBSOCKET_SERVER, store.getState().playerDataStore.nick_name, store.getState().websiteStateStore.selected_server_url)

    store.dispatch(SetShowGameServersList(false));
    // this.lobbySocketConnection = new WebSocket(REACT_APP_LOBBY_WEBSOCKET_SERVER+ "/roomid")

    this.lobbySocketConnection = new WebSocket("ws://localhost:9001/")

    // console.log("-game_server_url--", store.getState().websiteStateStore.selected_server_url)
    // this.lobbySocketConnection = new WebSocket(`${store.getState().websiteStateStore.selected_server_url}/${store.getState().websiteStateStore.selected_roomId}`)
    this.lobbySocketConnection.addEventListener("open", (event) => {
      this.lobbySocketConnected = true;
      // console.log("connected ... ", event)
      console.log("debug__nft__data ", this.nftData)
      // let joining_data = {

      // }
      this.lobbySocketConnection.send(JSON.stringify({
        event: "joined",
        walletAddress: store.getState().web3store.userAddress,
        // room_id:"lobby",
        sprite_url: this.nftData.data.sprite_image,
        minted_id: this.nftData.minted_id,
        nick_name: this.nftData.nick_name,
        attributes: this.nftData.data.attributes,
        profile_image: this.nftData.data.profile_image, 
        // all_nft_data: this.nftData,
        last_position_x: random_spawn_points[this.random_pos_selected].x,
        last_position_y: random_spawn_points[this.random_pos_selected].y,
        orientation: "right",
      }))
      // console.log("important_message--", {
      //   event: "joined",
      //   walletAddress: store.getState().web3store.userAddress,
      //   room_id:"lobby",
      //   sprite_url: this.nftData.data.sprite_image,
      //   minted_id: this.nftData.minted_id,
      //   all_nft_data: this.nftData,
      //   last_position_x: random_spawn_points[this.random_pos_selected].x,
      //   last_position_y: random_spawn_points[this.random_pos_selected].y,
      //   orientation: "right",
      // })
      store.dispatch(SetGameLoadingState(false))
      // this.lobbySocketConnection.send(JSON.stringify({
      //   event: "geoInfo",
      //   data: store.getState().geoStore.geoInfo,
      //   walletAddress: store.getState().web3store.userAddress,
      // }))
      console.log("sending koined  ", this.nftData)
    })

    this.lobbySocketConnection.addEventListener('close', (event) => {
      this.lobbySocketConnected = false;
      console.log("disconnected ... ", event)
    });
    // console.log()
    store.dispatch(SetPlayerIdForGame(store.getState().web3store.userAddress + "_" + this.nftData.minted_id))

    // this.myPlayer = new MyPlayer(this,random_spawn_points[this.random_pos_selected].x, random_spawn_points[this.random_pos_selected].y, "player-"+this.nftData.minted_id.toString(), "idle-player-"+this.nftData.minted_id.toString(), this.nftData.nick_name, this.nftData, this.lobbySocketConnection );
    // this.player.sprite = this.myPlayer.sprite;
    // this.player.gameObject = this.myPlayer;
    // console.log("@$#%$ player %$--", this.player.sprite);

    // this.fightInfoTextClass = new FightInfoText(this);


    if (this.mapKey === "lobby") {
      this.map = this.make.tilemap({
        key: "map",
        tileHeight: 16,
        tileWidth: 16
      })
      const tileset: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('LobbyTown', "tiles", 16, 16, 0, 0);
      const club: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('CLUB', "club1", 16, 16, 0, 0);
      const wall: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('wall', "wall", 16, 16, 0, 0);

      const mapLayer = this.map.createLayer(0, [tileset, club, wall] , 0, 0);
      const clubLayer = this.map.createLayer(1, [tileset, club, wall], 0, 0);
      const collisionLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(2, [tileset, club, wall], 0, 0);
      const clubFrontLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(3, [tileset, club, wall], 0, 0);
      this.clubFrontLayer = clubFrontLayer;
    
      collisionLayer.forEachTile(_tile => {
        // console.log(_tile);
        if (_tile.index !== -1) {
          for (let i =0; i< 16; i++) {
            for (let j = 0 ; j < 16; j++) {
              this.basicCollisionCoordinatesX.push(_tile.x*16 + i);
              this.basicCollisionCoordinatesY.push(_tile.y*16 + j);
            }
          }

          this.boundaries.push(
            new Boundary({x: _tile.x* 16, y: _tile.y* 16}, 16, 16)
          )
        }
      })
      collisionLayer.setDepth(-100000);

      this.cameras.main.setZoom(2.2,2.2)
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      // this.cameras.main.startFollow(this.player.sprite);
    } else if (this.mapKey === "hq_map") {
      
      this.hq = new HQ(this);
      this.hq.init();

    }

    this.keyControls = new KeyControls()
    this.network = new Network()

    this.cameras.main.setZoom(2.2,2.2);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.otherPlayersGroup = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite })
    this.input.mouse.disableContextMenu();
  }

  resetRats(newRats: IRatsStateManager) {
    this.mouses.map((data: IMouse, i ) => {
      data.gameObject.DestroyGameObject()
    })
    this.mouses = [];

    for (let i = 0; i < newRats.rats_count; i++) {
      createRatsAnims(this.anims, "rats")
      const mouseObject = new Mouse(
          this, 
          newRats.rats_positiions[i].x,
          newRats.rats_positiions[i].y,
          "rats",
          "idle-rats",
          newRats.rats_health[i]
        );
      mouseObject.EnableHealthBars()
      if (newRats.rats_orientations[i] === 'right') mouseObject.sprite.flipX = true;
      this.mouses.push(
        {
          key: "rats",
          moving: false,
          gameObject: mouseObject
        }
      )
    }
  }

  closeLobbySocketConnection() {
    this.lobbySocketConnection.close()
  }

  update(time: any, delta: any) {

    this.frameTime += delta
    if (this.frameTime > 30) {  
      this.frameTime = 0;
    } else {
      // console.log("not updating ", this.frameTime)
      return;
    }

    const pointer: Phaser.Input.Pointer = this.input.activePointer;
    const worldPoint: Phaser.Math.Vector2 = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    
    // console.log(worldPoint, this.radiatorRect)
    // console.log("debug_mouse-------",store.getState().userActionsDataStore.turnMouseClickOff, this.mousePressed, pointer.leftButtonDown())
    // console.log("debug_mouse-------",store.getState().userActionsDataStore.turnMouseClickOff, store.getState().userActionsDataStore.gameTurnOffMouse)
    
    if (
      // this.input.keyboard.enabled 
      // // && this.input.keyboard.isActive() 
      // && this.input.mouse.enabled 
      // && 
      !store.getState().userActionsDataStore.turnMouseClickOff
    ) {
      if (pointer.rightButtonDown() && !this.mousePressed){
        this.mousePressed = true
        // console.log("right button down")
        this.keyControls.keys.keyK.pressed = true
          this.keyControls.keys.lastKey = 'KeyK'
          this.keyControls.keys.keyD.double_pressed = false
          this.keyControls.keys.keyA.double_pressed = false;
          if (this.fightMachineOverlapText.depth > 0) {
            // this.lobbySocketConnection.send(JSON.stringify({
            //   event: "fight_machine_button_press",
            //   walletAddress: store.getState().web3store.userAddress,
            // }))
            // this.punchArea.setDepth(-1)
            // setTimeout(() => {
            //   this.punchArea.setDepth(1)
            //   store.dispatch(HitFightMachine(true))
            //   this.bootstrap.play_button_press_sound()
            // }, 500)
          }
      }
      else if (pointer.leftButtonDown() && !this.mousePressed){
        console.log("left button down ", this.mousePressed, this.fightMachineOverlapText.depth)
        this.mousePressed = true
        this.keyControls.keys.keyP.pressed = true
          this.keyControls.keys.lastKey = 'KeyP'
          this.keyControls.keys.keyD.double_pressed = false
          this.keyControls.keys.keyA.double_pressed = false;
          if (this.fightMachineOverlapText.depth > 0) {
            // this.lobbySocketConnection.send(JSON.stringify({
            //   event: "fight_machine_button_press",
            //   walletAddress: store.getState().web3store.userAddress,
            // }))
            // this.punchArea.setDepth(-1)
            // setTimeout(() => {
            //   this.punchArea.setDepth(1)
            //   store.dispatch(HitFightMachine(true))
            //   this.bootstrap.play_button_press_sound()
            // }, 500)
          }
      } 
      else if (pointer.leftButtonReleased() && this.mousePressed) {
        // console.log("left button up")
        this.keyControls.keys.keyP.pressed = false;
        this.mousePressed = false;
      } 
      else if (pointer.rightButtonReleased() && this.mousePressed) {
        // console.log("right button up")
        this.keyControls.keys.keyK.pressed = false;
        this.mousePressed = false;
      }
    }

    if (this.lobbySocketConnected &&  store.getState().web3store.userAddress !== "") {
      // console.log("timeframe latency_check-- ", this.frameTime)
      // if (this.frameTime % 100 === 0) {
      //   console.log("timeframe latency_check-- ", this.frameTime)
      //   this.lobbySocketConnection.send(JSON.stringify({
      //     event: "latency_check",
      //     walletAddress: store.getState().web3store.userAddress,
      //     client_time: new Date().getTime()
      //   }))
      // }

      if (
        // this.keyControls.onKeysChange
        this.keyControls.keys.keyA.pressed 
      || this.keyControls.keys.keyD.pressed 
      || this.keyControls.keys.keyS.pressed 
      || this.keyControls.keys.keyW.pressed
      ) {

        const action_id = uuidv4();
        // this.otherPlayers.forEach((_otherplayer) => {
        //   if (!_otherplayer.kickStart && _otherplayer.wallet_address === store.getState().web3store.userAddress) {
        //     // let action_id = uuidv4();
        //     // ActionManager.AddToActionQueue({ event: "kick", walletAddress: store.getState().web3store.userAddress }, action_id );
        //     // console.log("checking unequip_brew ", )
        //     const tempPlayer = _otherplayer.gameObject;
        //     if (tempPlayer?.sprite) {
        //       ActionManager.AddTomoveActionQueue({ action_id, task_state: true, x: tempPlayer?.sprite.x, y: tempPlayer.sprite.y} );
        //     }
        //   }
        // })
        this.otherPlayers.forEach((_otherplayer) => {
          if (_otherplayer.wallet_address === store.getState().web3store.userAddress) {
            if (_otherplayer.gameObject) {
              if (_otherplayer.gameObject?.sprite.anims && _otherplayer.gameObject.sprite.anims.currentAnim) {
                if (
                  _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'win-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'lose-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'drink-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'burp-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'dying_total_sequqnce-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'fly_as_angel-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                ) {
                  // console.log("sending move signal")
                  const direction = []
                  let running = false;
                  if (this.keyControls.keys.keyA.pressed) {
                    direction.push("left")
                  } if (this.keyControls.keys.keyW.pressed) {
                    direction.push("up")
                  } if (this.keyControls.keys.keyS.pressed) {
                    direction.push("down")
                  } if (this.keyControls.keys.keyD.pressed) {
                    direction.push("right")
                  }
                  if (this.keyControls.keys.keyA.double_pressed || this.keyControls.keys.keyD.double_pressed) {
                    running = true
                  }
                  if (this.network.movementUpdateCounter%2 === 0) {
                    // console.log("debug_movement ----- ", this.network.movementUpdateCounter)
                    this.network.movementUpdateCounter = 1;
                    this.lobbySocketConnection.send(JSON.stringify({
                      event: "move",
                      delta: delta,
                      walletAddress: store.getState().web3store.userAddress,
                      direction: direction,
                      running,
                      // keys: this.keyControls.keys,
                      action_id,
                      orientation_switch: true,
                    }));
                  } else {
                    this.network.movementUpdateCounter += 1;
                    // this.network.movementUpdateCounter = 0;
                  }
                  
                  // console.log("important--- move--", {
                  //   event: "move",
                  //   delta: delta,
                  //   walletAddress: store.getState().web3store.userAddress,
                  //   keys: this.keys,
                  //   action_id,
                  //   orientation_switch: true,
                  // })
                }
              }
            }
            // ActionManager.AddTomoveActionQueue({ event: "move", action_id,  } );    
          }
        })
        
        
      } if ( this.keyControls.keys.keyK.pressed  ) {
        this.otherPlayers.forEach((_otherplayer) => {
          if (
            _otherplayer.wallet_address === store.getState().web3store.userAddress
            && _otherplayer.gameObject
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'win-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'lose-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'drink-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'burp-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'dying_total_sequqnce-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'fly_as_angel-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
          ) {
            // let action_id = uuidv4();
            // ActionManager.AddToActionQueue({ event: "kick", walletAddress: store.getState().web3store.userAddress }, action_id );
            // console.log("checking unequip_brew ", )
            if (_otherplayer.hasBrewInHand && store.getState().assetStore.in_hand_brew){
              if (!_otherplayer.kickStartTime) {
                this.lobbySocketConnection.send(JSON.stringify({
                  event: "unequip_brew",
                  walletAddress: store.getState().web3store.userAddress,
                }))
                this.lobbySocketConnection.send(JSON.stringify({
                  event: "brew_used",
                  walletAddress: store.getState().web3store.userAddress,
                }));
              }
              if (_otherplayer.kickStartTime) {
                if (!_otherplayer.kickStart || _otherplayer.kickStartTime + 400 < new Date().getTime() ) {
                  this.lobbySocketConnection.send(JSON.stringify({
                    event: "unequip_brew",
                    walletAddress: store.getState().web3store.userAddress,
                  }))
                  this.lobbySocketConnection.send(JSON.stringify({
                    event: "brew_used",
                    walletAddress: store.getState().web3store.userAddress,
                  }));
                }
              }
              
              
            } else {
              if (!_otherplayer.kickStartTime) {
                this.lobbySocketConnection.send(JSON.stringify({
                  event: "kick",
                  walletAddress: store.getState().web3store.userAddress,
                }))
              }
              if (_otherplayer.kickStartTime) {
                if (!_otherplayer.kickStart || _otherplayer.kickStartTime + 400 < new Date().getTime() ) {
                  this.lobbySocketConnection.send(JSON.stringify({
                    event: "kick",
                    walletAddress: store.getState().web3store.userAddress,
                  }))
                }
              }
            }
            // _otherplayer.kickStart = true
          }
        }) 
      } if ( this.keyControls.keys.keyP.pressed ) {
        this.otherPlayers.forEach((_otherplayer) => {
          if (
            _otherplayer.wallet_address === store.getState().web3store.userAddress
            && _otherplayer.gameObject
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'win-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'lose-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'drink-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'burp-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'dying_total_sequqnce-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'fly_as_angel-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
            && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
          ) {
            if (!_otherplayer.punchStartTime) {
              this.lobbySocketConnection.send(JSON.stringify({
                event: "punch",
                walletAddress: store.getState().web3store.userAddress,
              }))
            }
            if (_otherplayer.punchStartTime) {
              if (!_otherplayer.punchStart || _otherplayer.punchStartTime + 200 < new Date().getTime() ) {
                this.lobbySocketConnection.send(JSON.stringify({
                  event: "punch",
                  walletAddress: store.getState().web3store.userAddress,
                }))
              }
            }
            
            
            // _otherplayer.punchStart = true
          }
        }) 
        
      }
    }
    

    if (isNullOrUndefined(localStorage.getItem("saw_controls")) ) {
      store.dispatch(ChangeShowControls(true))
    }

    // setting depths in map
    if (this.mapKey === 'lobby') {
      this.clubFrontLayer.setDepth(this.player.sprite.y+ 1000);
    } else if (this.mapKey === "hq_map") {
      this.hq.update(this.keyControls.keys)
      // this code check if player is near fight box.
      // this.otherPlayers.forEach((_player) => {
      //   if (_player.wallet_address === store.getState().web3store.userAddress && _player.gameObject) {
      //     if ((_player.gameObject.sprite.x > this.fightMachineOverlapRectReverse.leftX &&_player.gameObject.sprite.x < this.fightMachineOverlapRectReverse.leftX + this.fightMachineOverlapRectReverse.width )
      //       && (_player.gameObject.sprite.y > this.fightMachineOverlapRectReverse.leftY && _player.gameObject.sprite.y < this.fightMachineOverlapRectReverse.leftY + this.fightMachineOverlapRectReverse.height ) 
      //     ) {
      //       this.fightMachineOverlapText.setDepth(1000000);
      //     } else {
      //       this.fightMachineOverlapText.setDepth(-1);
      //       store.dispatch(HitFightMachine(false));
      //     }
      //   }
      // })

      // related to radiator .. check later..
      // if (
      //   (worldPoint.x > this.radiatorRect.leftX && worldPoint.x < this.radiatorRect.leftX + this.radiatorRect.width)
      //   && (worldPoint.y > this.radiatorRect.leftY && worldPoint.y < this.radiatorRect.leftY + this.radiatorRect.height)
      //   && !store.getState().userActionsDataStore.currentPlayerFighting
      // ) {
      //   console.log(" in collision with radiator ")
      //   if (pointer.leftButtonDown() 
      //   && store.getState().userActionsDataStore.turnMouseClickOff && !this.radiatorClicked
      //   && !store.getState().userActionsDataStore.currentPlayerFighting
      //   ) {
      //     console.log("here ... in radiator clicked..")
      //     if (window.confirm("Are you sure? \n You want to see the RoadMap? ")) {
      //       window.open("https://docs.bitfighters.club/team-and-mission/roadmap", '_blank');
      //     } else {
      //       console.log("cancel in confirm clicked....")
      //     }
      //     this.radiatorClicked = true;
      //   }
      //   store.dispatch(TurnMouseClickOff(true));
      // } else {
      //   if (this.radiatorClicked && store.getState().userActionsDataStore.turnMouseClickOff) {
      //     this.radiatorClicked = false;
      //     store.dispatch(TurnMouseClickOff(false));
      //   }
      //   this.radiatorClicked = false;
      //   // store.dispatch(TurnMouseClickOff(false));
      // }

      

      // if (store.getState().userActionsDataStore.fightersInfo.fightStarted) {
      //   this.myPlayer.movementAbility = true;
      //   store.dispatch(FightPreStart(false))
      //   // store.dispatch(ChangeShowMenuBox(false))
      //   store.dispatch(FightStart(false))
      //   store.dispatch(FightContinue(true))
      //   store.dispatch(FightEnd(false))
      // } else if (store.getState().userActionsDataStore.fightPreStart) {
      //   this.myPlayer.movementAbility = false;
      //   store.dispatch(FightPreStart(false));
      //   // store.dispatch(ChangeShowMenuBox(false));
        // this.cameras.main.stopFollow();
        // this.cameras.main.centerOn(this.centerCoordinatesStage.x, this.centerCoordinatesStage.y);
      //   if (store.getState().userActionsDataStore.fightPlayerSide === "left") {
      //     this.myPlayer.Teleport(this.centerCoordinatesStage.x - 60, this.centerCoordinatesStage.y + 130, "right")
      //   }
      //   if (store.getState().userActionsDataStore.fightPlayerSide === "right") {
      //     this.myPlayer.Teleport(this.centerCoordinatesStage.x + 60, this.centerCoordinatesStage.y + 130, "left")
      //   }
      // } 

      
    }

    if (store.getState().userActionsDataStore.fightContinue) {
      // this.myPlayer.movementAbility = true;
      store.dispatch(ChangeNotificationStateFromServer(true))
      if ((60 - Math.floor((new Date().getTime()-store.getState().userActionsDataStore.fightersInfo.fightStartedAt)/1000 * 1.0)) >= 0) {
        store.dispatch(ChangeNotificationMessageFromServer((60 - Math.floor((new Date().getTime()-store.getState().userActionsDataStore.fightersInfo.fightStartedAt)/1000 * 1.0)).toString() ))
      }
    }

    if (store.getState().userActionsDataStore.showFightConfirmationBox) {
      store.dispatch(ShowFightConfirmationTime(20 - Math.floor((1.0* new Date().getTime() - 1.0 * store.getState().userActionsDataStore.showFightConfirmationStartTime)/1000)))
    }

    // fight music .
    if (
      store.getState().userActionsDataStore.fightersInfo.fightStarted
      && store.getState().userActionsDataStore.fightersInfo.player1.walletAddress !== ""
      && store.getState().userActionsDataStore.fightersInfo.player2.walletAddress !== ""
    ) {
      // console.log(" starting music ..")
      this.playFightMusic()
      store.dispatch(FightContinue(true))
    } else {
      this.stopFightMusic()
      store.dispatch(FightContinue(false));
    }
    // console.log(" current palyer fighting .. " , store.getState().userActionsDataStore.currentPlayerFighting)
    if (store.getState().userActionsDataStore.currentPlayerFighting) {
      store.dispatch(ChangeShowMenuBox(false))
      store.dispatch(ShowChatWindow(false))
    }

    this.otherPlayers.forEach((_player) => {
      // console.log("move ing or not --", _player.moving, _player.gameObject?.tween_animation_running )
      if (_player.setupDone && _player.gameObject) {
        if (!_player.gameObject.tween_anim_running_down 
          && (_player.gameObject.moving || _player.gameObject.tween_animation_running)) {
          _player.gameObject.moving = true;
        } else {
          _player.gameObject.moving = false;
        }
        _player.gameObject.sprite.setDepth(_player.gameObject.sprite.y + 5);
        // _player.gameObject.update2(this.boundaries, delta, this.keys)
        _player.gameObject.update()
        // _player.gameObject?.BaseUpdate();
      }
    })

    // move other players
    this.otherPlayers.forEach((_player) => {
      try {
        if (_player.setupDone 
          && _player.gameObject 
          && _player.gameObject?.sprite.anims 
          // && store.getState().web3store.userAddress !== _player.wallet_address 
        ) {
          // console.log("other_players_loop")

          if (_player.gotHit) {
            _player.gameObject.sprite.play("gotHit-"+_player.wallet_address + "_" + _player.minted_id )
            .once('animationcomplete', () => {
              _player.gotHit = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          } else if (_player.gotBackHit) {
            _player.gameObject.sprite.play("gotBackHit-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
              // console.log("animation complete got back hit .. ")
              _player.gotBackHit = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          } else if (_player.showBrewDropFrame) {
            _player.gameObject.sprite.play("brew-dropped-"+_player.wallet_address + "_" + _player.minted_id )
            .once('animationcomplete', () => {
              _player.showBrewDropFrame = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          }
          else if (_player.gameObject.dead ) {
            _player.gameObject.dead = false
            _player.gameObject.sprite.play("dying_total_sequqnce-"+_player.wallet_address + "_" + _player.minted_id )
            .once('animationcomplete', (a:any, b: any, c: any ,d: any ) => {
              console.log("fly_as_angel dying finish ", a.key )
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("fly_as_angel-"+_player.wallet_address + "_" + _player.minted_id )
              }
            })
          }
          else if (_player.gameObject.gassed_lift_off_fall) {
            _player.gameObject.gassed_lift_off_fall = false
            _player.gameObject.sprite.play("front_gassed_lift_off_fall-"+_player.wallet_address + "_" + _player.minted_id )
            .once('animationcomplete', () => {
              if (_player.gameObject) {
                _player.gameObject.gassed_lift_off_fallen = false;
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          } 
          // else if (_player.gameObject.gassed_lift_off_fallen) {
          //   //
          //   console.log("debug_fallen")
          // }
          
          else if (_player.showEquipAnimationStarted) {
            _player.showEquipAnimationStarted = false
            _player.gameObject.sprite.play("equipBrew-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
              if (_player?.gameObject) {
                _player?.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idleBrew-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          }
          else if (_player.winningStarted) {
            _player.winningStarted = false
            _player.gameObject.sprite.play("win-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
              _player.winningStarted = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          }
          else if (_player.losingStarted) {
            _player.losingStarted = false
            _player.gameObject.sprite.play("lose-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
              _player.losingStarted = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          }
          else if (_player.drinkStarted) {
            if (!_player.drinking) {
              _player.drinking = true;
              _player.gameObject.sprite
                .play("drink-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
                  if (_player.gameObject) {
                    _player.gameObject.sprite.play("burp-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
                      _player.drinkStarted = false
                      _player.drinking = false
                      if (_player.gameObject){
                        _player.gameObject.sprite.stop()
                        _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
                      }
                    })
                  }
                })
            }
            
          }
          else if (_player.stunnedStarted) {
            // console.log("entering in _player. stunnedstarted", _player.stunned, _player.stunnedStarted)
            if (!_player.stunned) {
              // console.log("entering in _player. stunned")
              _player.running = false;
              _player.kickStart = false;
              _player.kicking = false;
              _player.gotBackHit = false;
              _player.gotHit = false;
              _player.stunned = true;
              _player.gameObject.sprite.stop();
              _player.gameObject.sprite.play("stunned-"+_player.wallet_address + "_" + _player.minted_id )
              .once('animationcomplete', () => {
                // console.log("other player stunned animatino done.")
                if (_player.gameObject) {
                  _player.stunned = false;
                  // _player.gameObject.sprite.stop()
                  // _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
                }
              })
            }
          }
          else if (_player.deadStarted) {
            // console.log("entering in _player. stunnedstarted", _player.stunned, _player.stunnedStarted)
            if (!_player.dead) {
              // console.log("entering in _player. stunned")
              _player.running = false;
              _player.kickStart = false;
              _player.kicking = false;
              _player.gotBackHit = false;
              _player.gotHit = false;
              _player.stunned = false;
              _player.dead = true;
              _player.gameObject.sprite.stop();
              _player.gameObject.sprite.play("dead-"+_player.wallet_address + "_" + _player.minted_id )
              .once('animationcomplete', () => {
                //
              })
            }
          }
          else if ( _player.kicking && !_player.stunnedStarted && !_player.deadStarted) {
            _player.running = false
            _player.gameObject.sprite.play("kick-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
              // console.log("done kicking . ")
              _player.kicking = false
              _player.kickStart = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          } 
          else if (_player.punching && !_player.stunnedStarted && !_player.deadStarted) {
            _player.running = false
            if (_player.hasBrewInHand) {
              _player.gameObject.sprite.play("punchBrew-"+_player.wallet_address + "_" + _player.minted_id).once('animationcomplete', () => {
                _player.punching = false
                _player.punchStart = false
                if (_player.gameObject) {
                  _player.gameObject.sprite.stop()
                  _player.gameObject.sprite.play("idleBrew-"+_player.wallet_address + "_" + _player.minted_id)
                }
              })
            } else {
              _player.gameObject.sprite.play("punch-"+_player.wallet_address + "_" + _player.minted_id).once('animationcomplete', () => {
                _player.punching = false
                _player.punchStart = false
                if (_player.gameObject) {
                  _player.gameObject.sprite.stop()
                  _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
                }
              })
            }
          }
          else if (_player.runStart && !_player.stunnedStarted && !_player.deadStarted) {
            // console.log(" in here player running --- ", _player.running, _player.runStart, _player.stunnedStarted, _player.deadStarted)
            if (!_player.running) {
              if (_player.hasBrewInHand) {
                _player.gameObject.sprite.play("runBrew-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
                  _player.running = false
                  _player.runStart = false
                  if (_player.gameObject) {
                    _player.gameObject.sprite.stop()
                    _player.gameObject.sprite.play("idleBrew-"+_player.wallet_address + "_" + _player.minted_id)
                  }
                })
              } else {
                _player.gameObject.sprite.play("run-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
                  _player.running = false
                  _player.runStart = false
                  if (_player.gameObject) {
                    _player.gameObject.sprite.stop()
                    _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
                  }
                })
              }
              
              _player.running = true;
            }
          }
          else if ( _player.gameObject.moving && !_player.stunnedStarted && !_player.deadStarted && !_player.running ) {
            // console.log("other_player_moving ", _player.wallet_address, _player.gameObject.sprite.anims)
            // if (_player.gameObject?.sprite.anims && _player.gameObject.sprite.anims.currentAnim) {
              // if (isNullOrUndefined(_player.gameObject.sprite.anims.currentAnim)) {
              //   _player.gameObject.sprite.play("walk-"+_player.wallet_address + "_" + _player.minted_id)
              // } 
              if ( 
                _player.gameObject.sprite.anims.currentAnim.key !== "kick-"+_player.wallet_address + "_" + _player.minted_id 
                && _player.gameObject.sprite.anims.currentAnim.key !== "punch-"+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== "run-"+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'walk-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'walkBrew-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'gotHit-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'gotBackHit-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'dying_total_sequqnce-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'fly_as_angel-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_player.wallet_address + "_" + _player.minted_id
              ) {
                _player.running = false
                _player.gameObject.sprite.stop()
                if (_player.hasBrewInHand) {
                  _player.gameObject.sprite.play("walkBrew-"+_player.wallet_address + "_" + _player.minted_id)
                } else {
                  _player.gameObject.sprite.play("walk-"+_player.wallet_address + "_" + _player.minted_id)
                }
              }
            // }
          } 
          else {
            if (_player.gameObject?.sprite.anims && _player.gameObject.sprite.anims.currentAnim) {
              if (_player.gameObject?.sprite.anims.currentAnim.key !== "kick-"+_player.wallet_address + "_" + _player.minted_id  
                && _player.gameObject?.sprite.anims.currentAnim.key !== "punch-"+_player.wallet_address + "_" + _player.minted_id 
                && _player.gameObject?.sprite.anims.currentAnim.key !== "punchBrew-"+_player.wallet_address + "_" + _player.minted_id 
                && _player.gameObject?.sprite.anims.currentAnim.key !== "run-"+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject?.sprite.anims.currentAnim.key !== "runBrew-"+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject?.sprite.anims.currentAnim.key !== "gotHit-"+_player.wallet_address + "_" + _player.minted_id 
                && _player.gameObject.sprite.anims.currentAnim.key !== 'gotBackHit-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'idle-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject?.sprite.anims.currentAnim.key !== "idleBrew-"+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'win-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'lose-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'drink-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'burp-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'front_gassed_lift_off_fall-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'dying_total_sequqnce-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'fly_as_angel-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_player.wallet_address + "_" + _player.minted_id
                && !_player.stunnedStarted
                && !_player.deadStarted
                // && _player.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_player.wallet_address + "_" + _player.minted_id
              ) {
                _player.running = false
                if (_player.hasBrewInHand) {
                  _player.gameObject?.sprite.play("idleBrew-"+_player.wallet_address + "_" + _player.minted_id )
                } else {
                  _player.gameObject?.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id )
                }
              }
            }
          }
          _player.kicking = false;
          _player.punching = false;
          // _player.punchStart = false
          // _player.kickStart = false
          // _player.running = false;
          _player.gotHit = false;
          _player.gotBackHit = false;
        }
      } catch (err) {
        console.log("error ", err, _player)
      }
    })

    // reset
    this.keyControls.keys.keyP.pressed = false;
    this.keyControls.keys.keyK.pressed = false;
    this.keyControls.onKeysChange = false
  }
}
