import phaserGame from "../../../PhaserGame";
import store from "../../../stores";
import { BrewMachinePunched, OpenAtmView, ShowBrewEjectAnimation, TurnMouseClickOff } from "../../../stores/UserActions";
import { HitFightMachine } from "../../../stores/UserActions";
import { ChangeShowMenuBox, ChangeShowQueueBox } from "../../../stores/UserWebsiteStore";
import Boundary, { Rect, calculateRect, calculateRectReverse } from "../../Components/Boundary";
import { IKeysInfo } from "../../characters/IPlayer";
import Bootstrap from "../Bootstrap";
import Game from "../Game";


export class HQ {
  game: Game
  scene: Phaser.Scene;

  atmBase!: Phaser.Tilemaps.TilemapLayer;
  atmArea!: Phaser.Tilemaps.TilemapLayer;
  atmExt!: Phaser.Tilemaps.TilemapLayer;
  atmRect!: Rect;

  brewBase!: Phaser.Tilemaps.TilemapLayer;
  brewArea!: Phaser.Tilemaps.TilemapLayer;
  brewExt!: Phaser.Tilemaps.TilemapLayer;
  brewRect!: Rect;

  bootstrap: Bootstrap;

  brewCanSprite!: Phaser.GameObjects.Image;
  constructor(scene: Phaser.Scene) {
    this.game = phaserGame.scene.keys.game as Game;
    this.scene = scene;
    this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  }

  init () {
    this.game.map = this.scene.make.tilemap({
      key: "hq_map",
      tileHeight: 16,
      tileWidth: 16
    })

    const tileset1: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('hq_design', "hq_base", 16, 16, 0, 0);
    const wall: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('wall', "wall", 16, 16, 0, 0);
    const fightMachine: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('fight-machine', "fight-machine", 16, 16, 0, 0);
    const punchBox: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('fight-machine-ext', "punch-box", 16, 16, 0, 0);
    const stage: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('stage1', "stage", 16, 16, 0, 0);
    const radiator: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('radiator', "radiator", 16, 16, 0, 0);
    const stage3d: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('stage3d', "stage3d", 16, 16, 0, 0);

    const brew_machine_base: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('brew-base', "brew-machine-base", 16, 16, 0, 0);
    const brew_machine_ext: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('brew-ext', "brew-machine-ext", 16, 16, 0, 0);

    // const atm_machine: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('atm-machine', "atm-machine", 16, 16, 0, 0);
    const atm_base: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('atm-base', "atm-base", 16, 16, 0, 0);
    const atm_ext: Phaser.Tilemaps.Tileset = this.game.map.addTilesetImage('atm-ext', "atm-ext", 16, 16, 0, 0);

    const allTileSets = [tileset1, wall, fightMachine, punchBox, stage, stage3d, atm_base, atm_ext, brew_machine_base, brew_machine_ext]
    const mapLayer = this.game.map.createLayer(0, allTileSets , 0, 0);
    const collisionLayer: Phaser.Tilemaps.TilemapLayer = this.game.map.createLayer(1, allTileSets, 0, 0);
    const fightMachineLayer: Phaser.Tilemaps.TilemapLayer = this.game.map.createLayer(2, allTileSets, 0, 0);
    this.game.fightMachineOverLapArea = this.game.map.createLayer(3, allTileSets , 0, 0);
    this.game.punchArea = this.game.map.createLayer(4, allTileSets, 0, 0);
    this.game.stageArea = this.game.map.createLayer(5, allTileSets, 0, 0);
    this.game.radiatorLayer = this.game.map.createLayer(6, allTileSets, 0, 0).setInteractive({cursor: 'pointer'});
    const outerboundaryLayer: Phaser.Tilemaps.TilemapLayer = this.game.map.createLayer(7, allTileSets, 0, 0);

    this.atmBase = this.game.map.createLayer(8, allTileSets, 0, 0);
    this.atmArea = this.game.map.createLayer(9, allTileSets, 0, 0);
    this.atmExt = this.game.map.createLayer(10, allTileSets, 0, 0);
    this.atmArea.setDepth(-1)

    this.atmRect = calculateRectReverse(this.game.map, this.atmArea);

    this.brewBase =  this.game.map.createLayer(11, allTileSets, 0, 0);
    this.brewArea =  this.game.map.createLayer(12, allTileSets, 0, 0);
    this.brewExt =  this.game.map.createLayer(13, allTileSets, 0, 0);
    this.brewArea.setDepth(-1)

    this.brewRect = calculateRectReverse(this.game.map, this.brewArea);

    

    this.game.fightMachineOverLapArea.setDepth(-1000)
    this.game.punchArea.setDepth(1)
    // console.log("--***------punchArea ", this.punchArea )
    // console.log("--***------fightMachineOverLapArea ", this.fightMachineOverLapArea)
    const fightMachineOverlapRect = calculateRect(this.game.map, this.game.fightMachineOverLapArea);
    // this.game.radiatorRect = calculateRectReverse(this.game.map, this.game.radiatorLayer);
    this.game.fightMachineOverlapRectReverse = calculateRectReverse(this.game.map, this.game.fightMachineOverLapArea);
    // var tempRadiatorRect = this.add.rectangle(radiatorRect.leftX, radiatorRect.leftY, radiatorRect.width, radiatorRect.height, 0x32CD32);
    console.log("--***------fightMachineOverLapArea ", fightMachineOverlapRect) // 1053.0813520135102 416.28495201354303

    // console.log("--***------radiator rect ", this.game.radiatorRect);

    
    // console.log("atm rect", this.atmRect);
    this.game.fightMachineOverlapText = this.scene.add
      .text(0, 0, '', {font: '128px Courier'})
      .setOrigin(0.5)
      .setStyle({ backgroundColor: '#f5eddc', borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setScale(0.1)
    const pointX = Math.round(fightMachineOverlapRect.leftY + fightMachineOverlapRect.width / 2)
    const pointY = Math.round(fightMachineOverlapRect.leftX + fightMachineOverlapRect.height / 2)
    this.game.fightMachineOverlapText.setX(pointX)
    this.game.fightMachineOverlapText.setY(pointY- 60)
    this.game.fightMachineOverlapText.setText([
      'Punch/Kick to enter the fight.'
    ]);
    this.game.fightMachineOverlapText.setVisible(true)
    this.game.fightMachineOverlapText.setDepth(-1)
    console.log("--***------fightMachineOverLapArea ", this.game.fightMachineOverlapText)

    const stageX: number[] = []
    const stageY: number[] = []
    this.game.stageArea.forEachTile(_tile => {
      if (_tile.index !== -1) {
        // console.log(_tile)
        stageX.push(_tile.x*16)
        stageY.push(_tile.x*16)
      }
    })

    const minXStage = Math.min(...stageX)
    const minYStage = Math.min(...stageY)

    const maxXStage = Math.max(...stageX)
    const maxYStage = Math.max(...stageY)

    this.game.centerCoordinatesStage = {
      x: Math.round((minXStage + maxXStage)/2),
      y: minYStage - 200
    }

    console.log(" center_of_stage ", this.game.centerCoordinatesStage)

    const temp1 : Array<Boundary> = [];

    collisionLayer.forEachTile(_tile => {
      if (_tile.index !== -1) {
        // for (var i =0; i< 16; i++) {
        //   for (var j = 0 ; j < 16; j++) {
        //     this.basicCollisionCoordinatesX.push(_tile.x*16 + i);
        //     this.basicCollisionCoordinatesY.push(_tile.y*16 + j);
        //   }
        // }

        this.game.boundaries.push(
          new Boundary({x: _tile.x* 16, y: _tile.y* 16}, 16, 16)
        )

        temp1.push(
          new Boundary({x: _tile.x* 16, y: _tile.y* 16}, 16, 16)
        )
      }
    })


    console.log("inner boundary -- ", temp1);
    const temp2 : Array<Boundary> = [];

    outerboundaryLayer.forEachTile(_tile => {
      if (_tile.index !== -1) {
        // for (var i =0; i< 16; i++) {
        //   for (var j = 0 ; j < 16; j++) {
        //     this.basicCollisionCoordinatesX.push(_tile.x*16 + i);
        //     this.basicCollisionCoordinatesY.push(_tile.y*16 + j);
        //   }
        // }

        this.game.boundaries.push(
          new Boundary({x: _tile.x* 16, y: _tile.y* 16}, 16, 16)
        )

        temp2.push(
          new Boundary({x: _tile.x* 16, y: _tile.y* 16}, 16, 16)
        )
      }
    })

    console.log("outer boundary -- ", temp2);

    outerboundaryLayer.setDepth(-1000);
    collisionLayer.setDepth(-100000);

  }

  update(keysInfo: IKeysInfo) {
    const tempMyPlayer = this.game.otherPlayers.get(store.getState().web3store.player_id)
    // console.log("overlap atm and kick", store.getState().userActionsDataStore.openAtmView);
    if (tempMyPlayer?.gameObject) {
      // console.log("payer atm pos-- ", tempMyPlayer.gameObject.sprite.x, tempMyPlayer.gameObject.sprite.y)
      if (
        (tempMyPlayer.gameObject.sprite.x > this.atmRect.leftX 
        &&tempMyPlayer.gameObject.sprite.x < this.atmRect.leftX + this.atmRect.width ) 
        && ((tempMyPlayer.gameObject.sprite.y > this.atmRect.leftY 
          && tempMyPlayer.gameObject.sprite.y < this.atmRect.leftY + this.atmRect.height ) )
        // && (keysInfo.keyK.pressed || keysInfo.keyP.pressed)
      ) {
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed)) {
          // overlap with atm
          console.log("overlap atm and kick");
          this.atmExt.setDepth(-1)
          setTimeout(() => {
            store.dispatch(OpenAtmView(!store.getState().userActionsDataStore.openAtmView));
            this.atmExt.setDepth(1)
            this.bootstrap.play_button_press_sound()
          }, 500)
        }
        
      } else {
        store.dispatch(OpenAtmView(false));
        // store.dispatch(TurnMouseClickOff(false))
      }

      if (
        (tempMyPlayer.gameObject.sprite.x > this.brewRect.leftX 
        &&tempMyPlayer.gameObject.sprite.x < this.brewRect.leftX + this.brewRect.width ) 
        && ((tempMyPlayer.gameObject.sprite.y > this.brewRect.leftY 
          && tempMyPlayer.gameObject.sprite.y < this.brewRect.leftY + this.brewRect.height ) )
        // && (keysInfo.keyK.pressed || keysInfo.keyP.pressed)
      ) {
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed) && (tempMyPlayer.orientation === "right")) {
          // overlap with atm
          console.log("overlap brew and kick", store.getState().userActionsDataStore.brewMachinePunched);
          this.brewExt.setDepth(-1)
          setTimeout(() => {
            // store.dispatch(OpenAtmView(true));
            
            this.bootstrap.play_button_press_sound()
            this.brewExt.setDepth(1)
            // console.log("------overlap brew and kick");
            store.dispatch(BrewMachinePunched(!store.getState().userActionsDataStore.brewMachinePunched))
          }, 500)
        }
        
      } else {
        store.dispatch(BrewMachinePunched(false))
        // store.dispatch(TurnMouseClickOff(false))
      }

      // console.log("-collision_with--",((tempMyPlayer.gameObject.sprite.x > this.game.fightMachineOverlapRectReverse.leftX &&tempMyPlayer.gameObject.sprite.x < this.game.fightMachineOverlapRectReverse.leftX + this.game.fightMachineOverlapRectReverse.width )
      //   && (tempMyPlayer.gameObject.sprite.y > this.game.fightMachineOverlapRectReverse.leftY && tempMyPlayer.gameObject.sprite.y < this.game.fightMachineOverlapRectReverse.leftY + this.game.fightMachineOverlapRectReverse.height ) 
      // ), tempMyPlayer.orientation, keysInfo.keyK.pressed || keysInfo.keyP.pressed)
      if ((tempMyPlayer.gameObject.sprite.x > this.game.fightMachineOverlapRectReverse.leftX &&tempMyPlayer.gameObject.sprite.x < this.game.fightMachineOverlapRectReverse.leftX + this.game.fightMachineOverlapRectReverse.width )
        && (tempMyPlayer.gameObject.sprite.y > this.game.fightMachineOverlapRectReverse.leftY && tempMyPlayer.gameObject.sprite.y < this.game.fightMachineOverlapRectReverse.leftY + this.game.fightMachineOverlapRectReverse.height ) 
      ) {
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed) && (tempMyPlayer.orientation === "right")) {
        let check = false;
          
          store.getState().userPathStore.CombinedQueueData.map(_data => {
            if (_data.p1_wallet === store.getState().web3store.userAddress || _data.p2_wallet === store.getState().web3store.userAddress) {
              check = true
            }
          })
          // console.log("collision_with checking if in queue ", check)
          if (!check) {
            if (!store.getState().userActionsDataStore.hitFightMachine) {
              this.game.lobbySocketConnection.send(JSON.stringify({
                event: "fight_machine_button_press",
                walletAddress: store.getState().web3store.userAddress,
              }))
              this.game.punchArea.setDepth(-1)
              setTimeout(() => {
                this.game.punchArea.setDepth(1)
                store.dispatch(HitFightMachine(!store.getState().userActionsDataStore.hitFightMachine))
                this.bootstrap.play_button_press_sound()
              }, 500)
            } else {
              store.dispatch(HitFightMachine(!store.getState().userActionsDataStore.hitFightMachine))
            }
            
            
          } else {
            store.dispatch(ChangeShowQueueBox(!store.getState().userPathStore.ShowQueueBox))
            store.dispatch(ChangeShowMenuBox(!store.getState().userPathStore.ShowMenuBox))
          }
        }
        // this.game.fightMachineOverlapText.setDepth(1000000);
      } else {
        this.game.fightMachineOverlapText.setDepth(-1);
          store.dispatch(HitFightMachine(false));
        }
        // store.dispatch(TurnMouseClickOff(false))
    }

    if (store.getState().userActionsDataStore.showBrewEjectAnimation) {
      this.game.lobbySocketConnection.send(JSON.stringify({
        event: "eject_brew",
        walletAddress: store.getState().web3store.userAddress,
        x: (this.brewRect.leftX + this.brewRect.width/2), 
        y: (this.brewRect.leftY + this.brewRect.height/2),
      }))
      store.dispatch(ShowBrewEjectAnimation(false))
      // this.brewCanSprite = this.scene.add.image(
      //   (this.brewRect.leftX + this.brewRect.width/2), 
      //   (this.brewRect.leftY + this.brewRect.height/2), 
      //   "brew-can"
      // )
      // this.brewCanSprite.setDisplaySize(7, 14)
      // console.log("brew-- ", this.brewCanSprite.x, this.brewCanSprite.y)
      // this.brewCanSprite.setDepth(this.brewCanSprite.y)
      // this.scene.tweens.add({
      //   targets: this.brewCanSprite,
      //   x: { from: this.brewCanSprite.x, to: this.brewCanSprite.x - 25 - 25 * Math.random(), duration: 500, ease: 'Power1' },
      //   y: { from: this.brewCanSprite.y, to: this.brewCanSprite.y + 10 + 10 * Math.random(), duration: 500, ease: 'Sine.easeInOut' }
      // }).once("complete", () => {
      //   console.log("--- complete animation ")
        
      //   setTimeout(() => {
          
      //     this.scene.tweens.add({
      //       targets: this.brewCanSprite,
      //       y: 0,
      //       x: 400,
      //       duration: 2000,
      //     }).once("complete", () => {
      //       this.brewCanSprite.destroy()
      //     })
      //   }, 5000)
      // })

    }
  }
}