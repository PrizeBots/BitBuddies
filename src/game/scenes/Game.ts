import { createOtherCharacterAnimsV2 } from "../anims/CharacterAnims";
import Boundary, { Rect } from "../Components/Boundary";
import REACT_APP_LOBBY_WEBSOCKET_SERVER  from "../configs";
import { AddInitialToChatArray, addToChatArray, MessageType } from '../../stores/ChatStore';
import store from '../../stores'
import { IOtherPlayer } from "../characters/OtherPlayer";
import { ChangeCombinedQueueData, ChangeFightAnnouncementMessageFromServer, ChangeFightAnnouncementStateFromServer, ChangeNotificationMessageFromServer, ChangeNotificationStateFromServer, ChangePath, ChangeShowControls, ChangeShowMenuBox, ChangeShowQueueBox, IQueueCombined, ShowWinnerCardAtFightEnd } from "../../stores/UserWebsiteStore";
// import { MyPlayer } from "../characters/MyPlayer";
import { OtherPlayer } from "../characters/OtherPlayer";
import { ClearFighterInfo, FightContinue, FightEnd, FightPreStart, FightStart, IfightersInfo, SetCurrentOtherPlayerFighting, SetCurrentPlayerFighting, SetFightersInfo, SetFocussedOnChat, ShowChatWindow, ShowFightConfirmationBox, ShowFightConfirmationStartTime, ShowFightConfirmationTime } from "../../stores/UserActions";
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

  otherPlayersGroup!: Phaser.Physics.Arcade.Group
  pressedKeys: Array<any>;
  CurrentKeysPressed: any;
  keys: IKeysInfo;
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

  fight_music!: Phaser.Sound.BaseSound
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

  constructor() {
    super('game')
    // this.lastKey = ""
    this.player = {
      sprite: null,
      movedLastFrame: null,
      gameObject: null,
    };
    this.keys = {
      keyA: {
        pressed: false,
        double_pressed: false,
      },
      keyD: {
        pressed: false,
        double_pressed: false,
      },
      keyS: {
        pressed: false,
      },
      keyW: {
        pressed: false,
      },
      keyP: {
        pressed: false,
      },
      keyK: {
        pressed: false,
      },
      leftShift: {
        pressed: false,
      },
      keyBlock: {
        pressed: false,
      },
      lastKey:"",
    };
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
    this.load.atlas(
      'player-'+this.nftData.minted_id.toString(),
      this.nftData.data.sprite_image,
      'bitfgihter_assets/player/texture-v2.json'
    )

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
    if (!this.fight_music.isPlaying) this.fight_music.play({loop: true})
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
    this.fight_music.stop()
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
    this.fight_music = this.sound.add('fight-music', {volume: 0.4});
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
    console.log("websocket server--", process.env.REACT_APP_DEV_ENV, REACT_APP_LOBBY_WEBSOCKET_SERVER, store.getState().playerDataStore.nick_name)

    this.lobbySocketConnection = new WebSocket(REACT_APP_LOBBY_WEBSOCKET_SERVER, 'echo-protocol')
    // this.lobbySocketConnection = new WebSocket(REACT_APP_LOBBY_WEBSOCKET_SERVER)
    this.lobbySocketConnection.addEventListener("open", (event) => {
      this.lobbySocketConnected = true;
      // console.log("connected ... ", event)
      this.lobbySocketConnection.send(JSON.stringify({
        event: "joined",
        walletAddress: store.getState().web3store.userAddress,
        room_id:"lobby",
        sprite_url: this.nftData.data.sprite_image,
        minted_id: this.nftData.minted_id,
        all_nft_data: this.nftData,
        last_position_x: random_spawn_points[this.random_pos_selected].x,
        last_position_y: random_spawn_points[this.random_pos_selected].y,
        orientation: "right",
      }))
      this.lobbySocketConnection.send(JSON.stringify({
        event: "geoInfo",
        data: store.getState().geoStore.geoInfo,
        walletAddress: store.getState().web3store.userAddress,
      }))
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

    this.cameras.main.setZoom(2.2,2.2);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.otherPlayersGroup = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite })

    this.input.mouse.disableContextMenu();

    this.input.keyboard.on('keydown', (event: {code: string}) => {
      // console.log("keydown--",event.code)
      switch(event.code) {
        case 'KeyB':
          this.keys.keyBlock.pressed = true
          break
        case 'ShiftLeft':
          this.keys.leftShift.pressed = true
          break
        case 'KeyD':
          this.keys.keyD.pressed = true
          if (
            this.keys.keyD.time_last_pressed 
            && this.keys.keyD.time_last_lifted 
            && !this.keys.keyD.double_pressed 
          ) {
            if (
              (new Date().getTime() - this.keys.keyD.time_last_pressed) < 300
            && (new Date().getTime() - this.keys.keyD.time_last_lifted) < 300) {
              console.log("double pressed..d")
              this.keys.keyD.double_pressed = true
            }
          }
          if (this.keys.leftShift.pressed) {
            this.keys.keyD.double_pressed = true
          }
          this.keys.keyD.time_last_pressed = new Date().getTime()
          this.keys.lastKey = 'KeyD'
          this.keys.keyA.double_pressed = false
          break
        case 'KeyA':
          this.keys.keyA.pressed = true
          if (
            this.keys.keyA.time_last_pressed 
            && this.keys.keyA.time_last_lifted 
            && !this.keys.keyA.double_pressed 
          ) {
            if (
              (new Date().getTime() - this.keys.keyA.time_last_pressed) < 300
            && (new Date().getTime() - this.keys.keyA.time_last_lifted) < 300) {
              console.log("double pressed..a")
              this.keys.keyA.double_pressed = true
            }
          }
          if (this.keys.leftShift.pressed) {
            this.keys.keyA.double_pressed = true
          }
          this.keys.lastKey = 'KeyA'
          this.keys.keyA.time_last_pressed = new Date().getTime()
          this.keys.keyD.double_pressed = false
          break
        case 'KeyW':
          this.keys.keyW.pressed = true
          this.keys.lastKey = 'KeyA'
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false
          break
        case 'KeyS':
          this.keys.keyS.pressed = true
          this.keys.lastKey = 'KeyS'
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false
          break
        case 'KeyP':
          if (this.keys.lastKey === 'KeyP') {
            return
          }
          this.keys.keyP.pressed = true
          this.keys.lastKey = 'KeyP'
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false;
          // if (this.fightMachineOverlapText.depth > 0) {
          //   this.lobbySocketConnection.send(JSON.stringify({
          //     event: "fight_machine_button_press",
          //     walletAddress: store.getState().web3store.userAddress,
          //   }))
          //   this.punchArea.setDepth(-1)
          //   setTimeout(() => {
          //     this.punchArea.setDepth(1)
          //     store.dispatch(HitFightMachine(true))
          //     this.bootstrap.play_button_press_sound()
          //   }, 500)
          // }
          break
        case 'KeyK':
          if (this.keys.lastKey === 'KeyK') {
            return
          }
          // console.log("pressed_key_kicking... down", this.keys.lastKey)
          this.keys.keyK.pressed = true
          this.keys.lastKey = 'KeyK'
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false;
          // if (this.fightMachineOverlapText.depth > 0) {
          //   this.lobbySocketConnection.send(JSON.stringify({
          //     event: "fight_machine_button_press",
          //     walletAddress: store.getState().web3store.userAddress,
          //   }))
          //   this.punchArea.setDepth(-1)
          //   setTimeout(() => {
          //     this.punchArea.setDepth(1)
          //     store.dispatch(HitFightMachine(true))
          //     this.bootstrap.play_button_press_sound()
          //   }, 500)
          // }
          break
        case 'KeyT':
          console.log("T_pressed.. testing")
          this.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === store.getState().web3store.userAddress) {
                _player.gameObject.dead = true;
                _player.gameObject.dead_last_time = new Date().getTime();
              }
            }
          })
            // this.lobbySocketConnection.send(JSON.stringify({
            //   event: "equip_brew",
            //   walletAddress: store.getState().web3store.userAddress,
            // }))
          // this.otherPlayers.forEach((_otherplayer) => {
          //   if (_otherplayer.wallet_address === store.getState().web3store.userAddress) {
          //     _otherplayer.gassed_lift_off_fall = true
          //   }
          // })
          // store.dispatch(ShowDeadSprite(true))
          break
        case 'KeyQ': {
          console.log("Q pressed..");
          if (store.getState().assetStore.equippedBrewCount > 0) {
            const temp = this.otherPlayers.get(store.getState().web3store.player_id)
            if (temp?.gameObject) {
              this.lobbySocketConnection.send(JSON.stringify({
                event: "equip_brew",
                walletAddress: store.getState().web3store.userAddress,
              }))

              // temp.hasBrewInHand = true
              // store.dispatch(SetEquippedBrewCount(0))
            }
          }
          
          break;
        }
        case 'Enter':
          if (this.enter_pressed) {
            store.dispatch(SetFocussedOnChat(false))
            store.dispatch(ShowChatWindow(false))
            this.enter_pressed = false;
          } else {
            store.dispatch(SetFocussedOnChat(true))
            store.dispatch(ShowChatWindow(true))
            this.enter_pressed = true;
          }
          console.log("pressed enter focussed ");
          break
      }
    })

    this.input.keyboard.on('keyup', (event: {code: string}) => {
      switch (event.code) {
        case 'KeyB':
          this.keys.keyBlock.pressed = false
          break
        case 'ShiftLeft':
          this.keys.leftShift.pressed = false
          break
        case 'KeyD':
          this.keys.keyD.pressed = false
          this.keys.keyD.time_last_lifted = new Date().getTime()  
          this.keys.keyD.double_pressed = false 
          this.keys.keyA.double_pressed = false  
          this.keys.lastKey = ""   
          break
        case 'KeyA':
          this.keys.keyA.pressed = false
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false
          this.keys.keyA.time_last_lifted = new Date().getTime()  
          this.keys.lastKey = ""   
          break
        case 'KeyW':
          this.keys.keyW.pressed = false;
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false     
          this.keys.lastKey = ""   
          break
        case 'KeyS':
          this.keys.keyS.pressed = false;
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false  
          this.keys.lastKey = ""      
          break
        case 'KeyP':
          this.keys.keyP.pressed = false;
          this.keys.lastKey = ""   
          break
        case 'KeyK':
          // console.log("pressed_key_kicking... down", this.keys.lastKey)
          this.keys.keyK.pressed = false;
          this.keys.lastKey = ""   
          break
      }
    });

    this.lobbySocketConnection.addEventListener("message", async (event) => {
      const objs = JSON.parse(event.data.replace(/'/g, '"'))
      // if (objs.length > 0) console.log("message_here --> ", objs)

      for (let gameQueueMessageIndex = 0; gameQueueMessageIndex < objs.length; gameQueueMessageIndex++) {
        const obj = objs[gameQueueMessageIndex];

        // if (obj.event === "ping") {
        //   // console.log(obj)
        //   this.lobbySocketConnection.send(JSON.stringify({
        //     event: "pong",
        //     walletAddress: store.getState().web3store.userAddress,
        //     orientation: "",
        //     room_id:"lobby",
        //     message: this.nftData.sprite_image
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
        //   this.otherPlayers.forEach(_player => {
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
          this.otherPlayers.forEach((_otherplayer) => {
            tempList.push(_otherplayer.wallet_address)
            if (!obj.live_players.includes(_otherplayer.wallet_address)) {
              console.log("live_players removing player,", _otherplayer.wallet_address)
              _otherplayer.gameObject?.DestroyGameObject()
              if (_otherplayer.gameObject) {
                // console.log("live_players removing sprite,", _otherplayer.wallet_address)
                this.otherPlayersGroup.remove(_otherplayer.gameObject?.sprite)
              }
              _otherplayer.gameObject = undefined
              this.otherPlayers.delete(_otherplayer.wallet_address + "_" + _otherplayer.minted_id)
              // this.textures.remove(_otherplayer.wallet_address)
            }
          })
        }

        if ( obj.event === "live_players_init" ) {
          // console.log("live_players_init --- 1", obj.live_players)
          // console.log("live_players_init --- 1", this.otherPlayers)
          obj.live_players.forEach(( _details : INFTDataOfConnections) => {
            // if (
            //   // _details.walletAddress !== store.getState().web3store.userAddress
            //   true
            // ) {
              if (!this.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id)) {
                console.log("live_players_init player exists ", this.otherPlayers.size, _details)
                if (this.textures.exists(_details.walletAddress+ "_"+_details.minted_id)) {
                  console.log("live_players_init texture exists ", this.otherPlayers.size, _details)
                  // if (!isNullOrUndefined(this.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id))) {
                    
                    const _otherplayer = this.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id)
                    if (_otherplayer) {
                      console.log("live_players_init deleting the other player ... ")
                      _otherplayer.gameObject?.DestroyGameObject()
                      if (_otherplayer.gameObject) this.otherPlayersGroup.remove(_otherplayer.gameObject.sprite)
                      _otherplayer.gameObject = undefined
                      this.otherPlayers.delete(_otherplayer.wallet_address + "_" + _otherplayer.minted_id)
                    }
                    this.otherPlayers.set(_details.walletAddress + "_" + _details.minted_id, {
                      wallet_address: _details.walletAddress,
                      nick_name: _details.nick_name,
                      setupDone: false,
                      all_data: _details.all_nft_data,
                      sprite_url: _details.sprite_url,
                      profile_image: _details.profile_image,
                      x: _details.last_position_x,
                      y: _details.last_position_y,
                      minted_id: _details.minted_id.toString(),
                      lastKickTime: 0,
                      lastPunchTime: 0,
                    })
                    const otherPlayer = this.otherPlayers.get(_details.walletAddress + "_" + _details.minted_id)

                    if (otherPlayer) {
                      otherPlayer.setupDone = true;
                      // otherPlayer.gameObject = new OtherPlayer(
                      //   this, otherPlayer.x, otherPlayer.y, _details.walletAddress, 'idle-'+ otherPlayer.wallet_address + "_" + otherPlayer.minted_id, otherPlayer.nick_name, otherPlayer.all_data,
                      // );
                      const otherP = otherPlayer.wallet_address !== store.getState().web3store.userAddress
                      otherPlayer.gameObject = new OtherPlayer(
                        this, 
                        otherPlayer.x, 
                        otherPlayer.y, 
                        `${otherPlayer.wallet_address}_${otherPlayer.minted_id.toString()}`,
                        `idle-${otherPlayer.wallet_address}_${otherPlayer.minted_id.toString()}`,
                        otherPlayer.nick_name, 
                        otherPlayer.all_data,
                        this.lobbySocketConnection,
                        otherP,
                        otherPlayer.wallet_address,
                        parseInt(otherPlayer.minted_id.toString())
                      );
                      otherPlayer.gameObject.currHealth = _details.health;
                      otherPlayer.sprite = otherPlayer.gameObject.sprite;
                      this.otherPlayers.set(_details.walletAddress, otherPlayer)
                      this.otherPlayersGroup.add(otherPlayer.sprite)
                    }
                    console.log("live_players_init check ", _details, this.otherPlayers.size)
                  // }
                } 
                else {
                  console.log("live_players_init texture not found ", this.otherPlayers.size, _details.walletAddress+ "_" + _details.minted_id.toString())
                  // createOtherCharacterAnims(this.anims, _details.walletAddress + "_" + _details.minted_id.toString())
                  this.load.atlas(
                    _details.walletAddress+ "_" + _details.minted_id.toString(),
                    _details.sprite_url,
                    'bitfgihter_assets/player/texture-v2.json'
                  )
                  this.otherPlayers.set(_details.walletAddress + "_" + _details.minted_id.toString(), {
                    wallet_address: _details.walletAddress,
                    nick_name: _details.nick_name,
                    setupDone: false,
                    all_data: _details.all_nft_data,
                    sprite_url: _details.sprite_url,
                    profile_image: _details.profile_image,
                    x: _details.last_position_x,
                    y: _details.last_position_y,
                    minted_id: _details.minted_id.toString(),
                    lastKickTime: 0,
                    lastPunchTime: 0,
                  })
                  this.load.start();
                  console.log("adding other player live_players_init", this.otherPlayers)
                }
              }
            // }
          })
        }


        if (obj.event === "show_stunned") {
          console.log(obj)
          this.otherPlayers.forEach(_player => {
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
          this.otherPlayers.forEach(_player => {
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
          this.otherPlayers.forEach(_player => {
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
          this.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.winningStarted = true;
              }
            }
          })
        }

        if (obj.event === "showLosingAnimation") {
          console.log(obj)
          this.otherPlayers.forEach(_player => {
            if (_player.gameObject) {
              if (_player.wallet_address === obj.walletAddress) {
                _player.losingStarted = true;
              }
            }
          })
        }

        if (obj.event === "showDeadAnim") {
          // console.log(obj)
          this.otherPlayers.forEach(_player => {
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
          this.otherPlayers.forEach(_player => {
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
          // console.log(obj);
          // store.dispatch(SetFightersInfo(obj))
          const newObj: IfightersInfo = {...obj}
          
          // if (newObj.player1.walletAddress === store.getState().web3store.userAddress) {
          //   this.myPlayer.EnableHealthBars()
          // }
          // if (newObj.player2.walletAddress === store.getState().web3store.userAddress) {
          //   this.myPlayer.EnableHealthBars()
          // }
          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === newObj.player1.walletAddress && _player.gameObject) {
              newObj.player1.max_health = _player.gameObject.max_health;
              newObj.player1.max_stamina = _player.gameObject.max_stamina;
              newObj.player1.defense = _player.gameObject.defense;
              newObj.player1.kickpower = _player.gameObject.kickPower;
              newObj.player1.punchpower = _player.gameObject.punchPower;
              newObj.player1.speed = _player.gameObject.speed;
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
              newObj.player2.defense = _player.gameObject.defense;
              newObj.player2.kickpower = _player.gameObject.kickPower;
              newObj.player2.punchpower = _player.gameObject.punchPower;
              newObj.player2.speed = _player.gameObject.speed;
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
          this.otherPlayers.forEach(_player => {
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
              _player.gameObject.teleport_coordinates = {x: obj.x, y: obj.y};
              _player.gameObject.target_position_stored = {x: obj.x, y: obj.y};
              if (obj.orientation === 'right') _player.gameObject.sprite.flipX = false
              else _player.gameObject.sprite.flipX = true
            } 
            // else if (_player.wallet_address === obj.walletAddress && _player.wallet_address === store.getState().web3store.userAddress && _player.gameObject) {
            //   // _player.gameObject.sprite.x = obj.x;
            //   // _player.gameObject.sprite.y = obj.y;
            //   // ActionManager.AddTomoveActionQueue({ action_id, task_state: true, x: this.sprite.x, y: this.sprite.y } );
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
          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              _player.gameObject.gassed_lift_off_fall = true
              if (obj.orientation === 'right') _player.gameObject.sprite.flipX = false
              else _player.gameObject.sprite.flipX = true
            }
          })
        }

        if (obj.event === "swing_sound") {
          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              this.playSwingSOund()
            }
          })
        }

        if (obj.event === "showGotBackHitAnimation") {
          console.log(obj)
          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              _player.gotBackHit = true;
            }
          })
        }

        if (obj.event === "showGotHitAnimation") {
          console.log(obj)
          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.walletAddress && _player.gameObject) {
              _player.gotHit = true;
            }
          })
        }

        if (obj.event === "queue_info") {
          console.log("queue_info--> ", obj.data)
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
          console.log(obj)
          store.dispatch(SetCurrentFightId(obj.fight_id))
          if (obj.message === "Fight!") {
            // this.myPlayer.movementAbility = true;
            this.playFightStartMusic()
          } else if (obj.message !== "") {
            this.playBoopMusic()
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
            this.cameras.main.stopFollow();
            this.cameras.main.centerOn(this.centerCoordinatesStage.x, this.centerCoordinatesStage.y);
          }
          // console.log("fight_start_announcement", "you are ", you_are_player_state, obj)
          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === obj.player1 || _player.wallet_address === obj.player2) {
              if (_player.gameObject) {
                _player.gameObject.playerContainer.remove(_player.gameObject.playerInfoIcon)
              }
            }
          })
          // console.log("fight_start_announcement", "other player ", this.fighterOtherPlayer)
        }

        if (obj.event === "fight_end_announcement") {
          console.log(obj)
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

          this.otherPlayers.forEach(_player => {
            if (_player.wallet_address === newObj.player1.walletAddress || _player.wallet_address === newObj.player2.walletAddress) {
              if (_player.gameObject && _player.wallet_address !== store.getState().web3store.userAddress) {
                _player.gameObject.playerContainer.add(_player.gameObject.playerInfoIcon)
              } else {
                if (_player.gameObject && _player.wallet_address === store.getState().web3store.userAddress) {
                  // this.cameras.main.startFollow(_player.gameObject.sprite, false, 0.2);
                  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
                  this.cameras.main.startFollow(_player.gameObject.sprite);
                  if (store.getState().web3store.userAddress === obj.winner) {
                    // show that card.. 
                    console.log("in here fight_end_announcement ",obj.winner )
                    setTimeout(() => {
                      store.dispatch(ShowWinnerCardAtFightEnd(true))
                    }, 8000)
                  } else {
                    store.dispatch(ChangeFightAnnouncementMessageFromServer("You Lose"))
                    store.dispatch(ChangeFightAnnouncementStateFromServer(true))
                  }
                }
              }
            }
          })

          this.fighterOtherPlayer = "";
        }

        if (obj.event === "gotKickHit" || obj.event === "gotPunchHit") {
          // console.log("attacked --", obj)
          const newObj: IfightersInfo = {...obj}
          // store.dispatch(SetFightersInfo(newObj))
          const tempHealthP1 = newObj.player1.health;
          const tempHealthP2 = newObj.player2.health;
          const last_health_p1 = obj.last_health_p1;
          const last_health_p2 = obj.last_health_p2;

          this.otherPlayers.forEach((_player) => {
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
        }

        if (obj.event === "kick" ) {
          this.otherPlayers.forEach(_player => {
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
          this.otherPlayers.forEach(_player => {
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
          // if (this.fightMachineOverlapText.depth > 0) {
            if (obj.walletAddress !== store.getState().web3store.userAddress) {
              this.punchArea.setDepth(-1)
              setTimeout(() => {
                this.punchArea.setDepth(1)
                this.bootstrap.play_button_press_sound()
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
          this.otherPlayers.forEach((_player) => {
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
            this.otherPlayers.forEach((_player) => {
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
          this.otherPlayers.forEach((_player) => {
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
          this.otherPlayers.forEach(_player => {
            // console.log("health joined .. in ", _player.wallet_address === obj.walletAddress && _player.wallet_address === store.getState().web3store.userAddress && _player.gameObject)
            if (_player.gameObject && obj.walletAddress === _player.wallet_address) {
              _player.gameObject.currHealth = obj.health;
            }
          })
        }

        if (obj.event === "brew_used") {
          this.otherPlayers.forEach(_player => {
            if (_player.gameObject && obj.walletAddress === _player.wallet_address) {
              _player.drinkStarted = true;
              _player.drinking = false;
              _player.hasBrewInHand = false
            }
          })
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
        this.lobbySocketConnection.send(JSON.stringify({
          event: "pong",
          walletAddress: store.getState().web3store.userAddress,
          orientation: "",
          room_id:"lobby",
          message: this.nftData.sprite_image
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
      }

      if (objs.event === "move" || objs.event === "running") {
        // console.log("--- ", objs)
        this.otherPlayers.forEach(_player => {
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
      
      this.load.on('filecomplete', (key: string, val:any) => {
        // console.log("filecomplete- live_players_init", key, val)
        if (this.otherPlayers.get(key) && key.split("_").length === 2) { 
          const otherPlayer = this.otherPlayers.get(key)
          if (otherPlayer) {
            if (!otherPlayer.setupDone) {
              console.log("filecomplete- live_players_init ---", key)
              createOtherCharacterAnimsV2(this.anims, key)
              otherPlayer.setupDone = true;
              const otherP = otherPlayer.wallet_address !== store.getState().web3store.userAddress
              otherPlayer.gameObject = new OtherPlayer(
                this, 
                otherPlayer.x, 
                otherPlayer.y, 
                key,
                `idle-${key}`,
                otherPlayer.nick_name, 
                otherPlayer.all_data,
                this.lobbySocketConnection,
                otherP,
                otherPlayer.wallet_address,
                parseInt(otherPlayer.minted_id.toString())
                // otherPlayer.extra_data
              );
              otherPlayer.sprite = otherPlayer.gameObject.sprite;
              this.otherPlayers.set(key, otherPlayer)
              this.otherPlayersGroup.add(otherPlayer.sprite)
              console.log("--- live_players_init all players ---",this.otherPlayers.size, this.otherPlayers)
              if (otherPlayer.wallet_address === store.getState().web3store.userAddress) {
                console.log("following live_players_init --", this.otherPlayers.size)
                // this.cameras.main.startFollow(otherPlayer.gameObject.sprite, false, 0.2);
                this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
                this.cameras.main.startFollow(otherPlayer.gameObject.sprite);
                // otherPlayer.gameObject.sprite.setScrollFactor(1)
              }
            }
          }
        }
      }, this);

    })
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

    // this.controls.update(delta);
    // console.log("update -- ", delta, this.game.loop.actualFps)
    this.frameTime += delta

    if (this.frameTime > 30) {  
      // console.log("updating ", this.frameTime)
      this.frameTime = 0;
        // g.gameTick++;
        // Code that relies on a consistent 60hz update
    } else {
      console.log("not updating ", this.frameTime)
      // this.frameTime = 0;
      return;
    }
    // console.log('update -- ', this.frameTime)
    // console.log("state -- > ", store.getState().userActionsDataStore.fightersInfo.fightStarted)
    const pointer: Phaser.Input.Pointer = this.input.activePointer;
    const worldPoint: Phaser.Math.Vector2 = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    
    // console.log(worldPoint, this.radiatorRect)
    // console.log("mouse-------",store.getState().userActionsDataStore.turnMouseClickOff, this.mousePressed, pointer.leftButtonDown())
    
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
        this.keys.keyK.pressed = true
          this.keys.lastKey = 'KeyK'
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false;
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
        this.keys.keyP.pressed = true
          this.keys.lastKey = 'KeyP'
          this.keys.keyD.double_pressed = false
          this.keys.keyA.double_pressed = false;
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
        this.keys.keyP.pressed = false;
        this.mousePressed = false;
      } 
      else if (pointer.rightButtonReleased() && this.mousePressed) {
        // console.log("right button up")
        this.keys.keyK.pressed = false;
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
        this.keys.keyA.pressed 
      || this.keys.keyD.pressed 
      || this.keys.keyS.pressed 
      || this.keys.keyW.pressed
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
                ) {
                  // console.log("sending move signal")
                  this.lobbySocketConnection.send(JSON.stringify({
                    event: "move",
                    delta: delta,
                    walletAddress: store.getState().web3store.userAddress,
                    keys: this.keys,
                    action_id,
                    orientation_switch: true,
                  }));
                }
              }
            }
            // ActionManager.AddTomoveActionQueue({ event: "move", action_id,  } );    
          }
        })
        
        
      } if ( this.keys.keyK.pressed  ) {
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
      } if ( this.keys.keyP.pressed ) {
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
      this.hq.update(this.keys)
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
        if (_player.gameObject.moving || _player.gameObject.tween_animation_running) {
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

          if (_player.gotHit) {
            _player.gameObject.sprite.play("gotHit-"+_player.wallet_address + "_" + _player.minted_id )
            .once('animationcomplete', () => {
              _player.gotHit = false
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
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          }
          else if (_player.gotBackHit) {
            _player.gameObject.sprite.play("gotBackHit-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
              // console.log("animation complete got back hit .. ")
              _player.gotBackHit = false
              if (_player.gameObject) {
                _player.gameObject.sprite.stop()
                _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
              }
            })
          }
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
              // _player.moving = false;
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
              // _player.moving = false;
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
                && _player.gameObject.sprite.anims.currentAnim.key !== 'gotHit-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'gotBackHit-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'dying_total_sequqnce-'+_player.wallet_address + "_" + _player.minted_id
                && _player.gameObject.sprite.anims.currentAnim.key !== 'fly_as_angel-'+_player.wallet_address + "_" + _player.minted_id
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
    this.keys.keyP.pressed = false;
    this.keys.keyK.pressed = false;
  }
}
