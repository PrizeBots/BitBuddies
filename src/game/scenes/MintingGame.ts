
import phaserGame from "../../PhaserGame";
import store from "../../stores";
import { SetMintGameQuantity } from "../../stores/PlayerData";
import { ChangePath } from "../../stores/UserWebsiteStore";
import { createMomAnimations } from "../anims/createMomAnimations";
import KeyControls from "../services/KeyControls";
import Bootstrap from "./Bootstrap";


export default class MitingGame extends Phaser.Scene {
  
  keyControls!: KeyControls;
  bootstrap: Bootstrap;
  sprite!: Phaser.GameObjects.Sprite;
  juice_sprite!: Phaser.GameObjects.Sprite;
  quantity!: number;
  quantityLeft = 0
  nftImages: Array<string> = [];
  nftSprites: Map<string, Phaser.GameObjects.Image> = new Map();

  canEject = false;

  clickCount = 0;
  Opensprite!: Phaser.GameObjects.Sprite;
  notifText!: Phaser.GameObjects.Text;
  second_stage_doing= false;
  third_stage_idle = false;


  constructor() {
    super('minting')
    this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    console.log("running constructor minting.. ")
  }

  init(data: {quantity: number}) {
    console.log("running init in minting .. ", data)
  }

  preload(data: {data: any}) {
    console.log("minting preload ", data)

    this.load.spritesheet("mint_machine", "new_assets/mom/MINT_MACHINE.png", { frameWidth: 96, frameHeight: 147 });
    this.load.spritesheet("mint_machine_goo", "new_assets/mom/MINT_MACHINE_GOO.png", { frameWidth: 96, frameHeight: 147 });
    this.load.spritesheet("mint_machine_base", "new_assets/mom/MINT_MACHINE_BASE.png", { frameWidth: 96, frameHeight: 147 });
    this.load.spritesheet("mint_machine_open", "new_assets/mom/MINT_MACHINE_OPEN.png", { frameWidth: 96, frameHeight: 147 });

  }


  async create(data: any) {
    console.log("minting create ", data)

    this.quantity = store.getState().playerDataStore.mintingGameNftQuantity;
    this.quantityLeft = store.getState().playerDataStore.mintingGameNftQuantity;

    const bitFightersTotalData = store.getState().bitFighters.totalNFTData;
    for (let i = bitFightersTotalData.length-this.quantity; i < bitFightersTotalData.length; i++ ) {
      this.nftImages.push(bitFightersTotalData[i].data.first_frame_image)
      // console.log("debug ...", bitFightersTotalData[i].data.first_frame_image)
      this.load.image({
        key:`${i-this.quantity}-bf`, 
        url :bitFightersTotalData[i].data.first_frame_image
      })
    }
    this.load.start()

    // this.load.once("complete", (key: any, val: any) => {
    //     console.log("debug ,, ", key, val)
    // });

    this.load.on('loaderror', (data: any) => {
      console.log("debug loaderror,, ", data)
    })

    this.load.on('filecomplete', (key: string, val:any) => {
      const temp = this.add.image(spriteX, spriteY+ 80, key).setDepth(-100).setVisible(false)
      temp.displayHeight = 160;
      temp.displayWidth = 160;
      this.nftSprites.set(key, temp)
      // console.log("debug loaded ----- ", key, val )
    }, this);

    this.input.setPollAlways();
    store.dispatch(ChangePath("minting-game"));

    //
    this.anims.create({
      key:"first_frame_idle",
      frames: this.anims.generateFrameNumbers("mint_machine_open", { frames: [0]}),
      duration: 10000,
      repeat: -1
    })

    this.anims.create({
      key:"mom_door_open",
      frames: this.anims.generateFrameNumbers("mint_machine_open", { frames: [1,2,3,4,5,6,7]}),
      duration: 1000,
      repeat: 0
    })

    this.anims.create({
      key:"second_stage_idle",
      frames: this.anims.generateFrameNumbers("mint_machine_open", { frames: [8]}),
      duration: 100,
      repeat: -1
    })

    this.anims.create({
      key:"third_stage_idle",
      frames: this.anims.generateFrameNumbers("mint_machine", { frames: [9]}),
      duration: 200,
      repeat: 0
    })

    this.anims.create({
      key:"repeat_mint_machine",
      frames: this.anims.generateFrameNumbers("mint_machine", { frames: [10,11,12]}),
      duration: 500,
      repeat: -1
    })

    this.anims.create({
      key:"repeat_goo",
      frames: this.anims.generateFrameNumbers("mint_machine_goo", { frames: [10,11,12]}),
      duration: 500,
      repeat: -1
    })

    // base anima
    this.anims.create({
      key:"constant_base_anim",
      frames: this.anims.generateFrameNumbers("mint_machine_base", { frames: [14]}),
      duration: 300,
      repeat: -1
    })


    this.anims.create({
      key:"release_bf_anim",
      frames: this.anims.generateFrameNumbers("mint_machine", { frames: [13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,29,30, 31, 32, 33,34]}),
      duration: 1000,
      repeat: 0
    })

    this.anims.create({
      key:"release_bf_anim_goo",
      frames: this.anims.generateFrameNumbers("mint_machine_goo", { frames: [13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,29,30, 31, 32, 33,34]}),
      duration: 1000,
      repeat: 0
    })



    // this.anims.create({
    //   key: "juice1",
    //   frames: this.anims.generateFrameNumbers("mint_machine_goo", {
    //     start: 11,
    //     end: 15,
    //     first: 11
    //   }),
    //   duration:2000,
    //   repeat: -1
    // });

    // this.anims.create({
    //   key: "juice2",
    //   frames: this.anims.generateFrameNumbers("mint_machine_goo", { frames: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34]}),
    //   duration:4000,
    //   repeat: 0
    // });

    // this.anims.create({
    //   key: "mom-idle",
    //   frames: this.anims.generateFrameNumbers("mint_machine", {frames: [0]}),
    //   duration:600,
    //   repeat: -1
    // });

    // this.anims.create({
    //   key: "mom-door-open",
    //   frames: this.anims.generateFrameNumbers("mint_machine", {frames: [1,2,3,4,5,6,7,8,9,10]}),
    //   duration:2000,
    //   repeat: 0
    // });

    // this.anims.create({
    //   key: "mom-spray-anim",
    //   frames: this.anims.generateFrameNumbers("mint_machine", {frames: [10, 11,12,13,14,15]}),
    //   duration:2000,
    //   repeat: -1
    // });

    // this.anims.create({
    //   key: "mom-spray-anim2",
    //   frames: this.anims.generateFrameNumbers("mint_machine", { frames: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34]}),
    //   duration:4000,
    //   repeat: 0
    // });
    
    
    const spriteX = window.innerWidth/2;
    const spriteY = window.innerHeight/2 - 50;
    const width = 300;
    const height = 450;

    // base -> bf -> goo -> machine
    // 5 -> 7 -> 10 -> 15
    const temp = this.add.sprite(spriteX,spriteY,"mint_machine_base").setInteractive().setDepth(5)
    temp.displayHeight = height ;
    temp.displayWidth = width ;
    

    this.sprite = this.add.sprite(spriteX,spriteY,"mint_machine").setInteractive().setDepth(15)
    this.sprite.displayHeight = height ;
    this.sprite.displayWidth = width ;

    this.juice_sprite = this.add.sprite(spriteX, spriteY,"mint_machine_goo").setInteractive().setDepth(10)
    this.juice_sprite.displayHeight = height;
    this.juice_sprite.displayWidth = width;

    this.Opensprite = this.add.sprite(spriteX,spriteY,"mint_machine").setInteractive().setDepth(20)
    this.Opensprite.displayHeight = height ;
    this.Opensprite.displayWidth = width ;

    const leftText = this.add.text( spriteX- 50, spriteY - height/2 - 120 , `Left: ${store.getState().playerDataStore.mintingGameNftQuantity}`, { fontFamily: '"Cooper Black", sans-serif', fontSize: '40px' });
    // this.add.text( spriteX - 200, spriteY - height/2 - 60 , `Please Click the Machine to fetch Players`, { fontFamily: '"Cooper Black", sans-serif', fontSize: '20px' });
    this.notifText = this.add.text( spriteX - 50, spriteY - height/2 - 60 , `Click to Begin`, { fontFamily: '"Cooper Black", sans-serif', fontSize: '20px' });
    

    this.Opensprite.play("first_frame_idle");
    temp.play("constant_base_anim");

    // setTimeout(() => {
    //   console.log("running animation .. ")
    //   this.sprite.play("mom-door-open");
    // }, 1000 )

    // this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation, fr: any) => {

    //   console.log("debug animation done ....", animation.key)
    //   // if (animation.key === "mom-door-open") {
    //   //   this.sprite.play("mom-spray-anim")
    //   //   this.juice_sprite.play("juice1")
    //   //   this.canEject = true;
    //   // }

    //   // if (animation.key === "mom-spray-anim2") {
    //   //   this.canEject = true;
    //   //   if (this.quantityLeft >0) {
    //   //     this.sprite.play("mom-spray-anim")
    //   //     this.juice_sprite.play("juice1")

          
    //   //   }

      //   if (this.quantity >= 0) {
      //     const temp = Array.from( this.nftSprites.keys() );
      //     // console.log("debug temp 111 -- ", temp, this.quantity)
      //     const tempSprite = this.nftSprites.get(temp[this.quantity])
      //     tempSprite?.setDepth(10)

      //     const {randomX, randomY} = generateRandomXAndY()

      //     // const randomX = (Math.random() - 0.5)* 600
      //     // const randomY = Math.random()* 100 + 200
      //     console.log("debug----pos--", randomX, randomY)
      //     tempSprite?.setDepth(randomY)

      //     if (tempSprite)
      //       this.tweens.add({
      //         targets: tempSprite,
      //         x: { from: tempSprite.x, to: tempSprite.x - randomX, duration: 500, ease: 'Linear' },
      //         y: { from: tempSprite.y, to: tempSprite.y + randomY, duration: 500, ease: 'Linear' }
      //       }).once("complete", () => {
      //         // healthsprite.destroy()
      //       })
      //   }
      // }
    // })

    this.Opensprite.on('animationcomplete', (animation: Phaser.Animations.Animation, fr: any) => {
      //
      console.log("debug animation Opensprite done ....", animation.key)
      if (animation.key === "mom_door_open") {
        console.log("debug animation Opensprite done 2 ....")
        this.Opensprite.stop()
        this.sprite.stop()
        this.Opensprite.play("second_stage_idle")
        this.notifText.text = "Click to Start"
        this.second_stage_doing = true
      }
      // if (animation.key === "second_stage_idle") {
      //   console.log("debug animation Opensprite done second_stage_idle ....")
      //   this.sprite.play("third_stage_idle")
      //   this.notifText.text = "Click to Release"
      // }
    })

    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation, fr: any) => {
      // console.log("debug animation sprite done ....", animation.key)
      if (animation.key === "third_stage_idle") {
        // console.log("debug animation sprite done third_stage_idle ....")
        this.Opensprite.setVisible(false)
        this.sprite.stop()
        this.sprite.play("repeat_mint_machine")
        this.juice_sprite.play("repeat_goo")
        this.notifText.text = "Click to Release"
        this.third_stage_idle = true
      }
      if (animation.key == "release_bf_anim") {
        
        // console.log("debug animation sprite done release_bf_anim ....", this.quantity, this.quantityLeft)
        if (this.quantity >= 0) {
          const temp = Array.from( this.nftSprites.keys() );
          const tempSprite = this.nftSprites.get(temp[this.quantity])
          // this.quantity -= 1
          // tempSprite?.setDepth(7)

          const {randomX, randomY} = generateRandomXAndY()

          // console.log("debug----pos--", randomX, randomY)
          tempSprite?.setDepth(randomY)

          // 
          this.sprite.stop()
          this.sprite.play("repeat_mint_machine")
          this.juice_sprite.play("repeat_goo")
          this.notifText.text = "Click to Release"
          this.third_stage_idle = true

          if (tempSprite)
            this.tweens.add({
              targets: tempSprite,
              x: { from: tempSprite.x, to: tempSprite.x - randomX, duration: 500, ease: 'Linear' },
              y: { from: tempSprite.y, to: tempSprite.y + randomY, duration: 500, ease: 'Linear' }
            }).once("complete", () => {
              // healthsprite.destroy()
            })

          if (this.quantity === 0) {
            this.notifText.text = "Go To Game"
            leftText.text  = ""
            this.notifText.setInteractive().setOrigin(0.5)
              .setPadding(20)
              .setStyle({ backgroundColor: '#b02b21' })

            this.notifText.on("pointerdown", () => {
              //
              // console.log(" debug click on notif button")
              // navigator.clipboard.writeText("/game")
              window.location.href = "/game"
              // window.location.reload()
            })
            // this.notifText.text = ""
            this.sprite.stop()
            this.juice_sprite.stop()
            this.juice_sprite.setVisible(false)
          }
        } else {
          // this.notifText.text = "Click to go to Game View"
          this.notifText.text = ""
          this.notifText.text = ""
          this.sprite.stop()
          this.juice_sprite.stop()
          this.juice_sprite.setVisible(false)
        }
      

      }
    })

    this.sprite.on("pointerdown", (pointer: any) => {
      // console.log("debug clicked on sprite ", this.clickCount, this.third_stage_idle, this.quantityLeft)
      if (this.clickCount === 2 && this.third_stage_idle && this.quantityLeft >= 0) {

        //
        
        this.quantityLeft -= 1
        if (this.quantityLeft >= 0) {
          this.sprite.stop()
          this.sprite.play("release_bf_anim")
          this.juice_sprite.play("release_bf_anim_goo")

          const temp = Array.from( this.nftSprites.keys() );
          this.quantity -= 1;
          const tempSprite = this.nftSprites.get(temp[this.quantity])
          tempSprite?.setDepth(7)
          tempSprite?.setVisible(true)
      
          leftText.text = `Left: ${this.quantity}`
          leftText.update()
          this.canEject = true
          this.third_stage_idle = false
        }
        // else {
        //   this.notifText.text = ""
        //   this.sprite.stop()
        //   this.juice_sprite.stop()
        //   this.juice_sprite.setVisible(false)
        // }
      } 

    })

    this.Opensprite.on("pointerdown", (pointer: any) => {
      // console.log("debug clicked Opensprite... ", this.clickCount)
      if (this.clickCount === 0) {
        this.Opensprite.stop()
        this.Opensprite.play("mom_door_open")
        this.clickCount += 1
        return
      }
      if (this.clickCount === 1 && this.second_stage_doing) {
        this.sprite.stop()
        this.sprite.play("third_stage_idle")
        this.clickCount += 1
      }
      // if (this.clickCount === 2 && this.third_stage_idle) {
      //   //
      //   this.sprite.stop()
      //   this.sprite.play("release_bf_anim")
      //   this.juice_sprite.play("release_bf_anim_goo")
      //   this.clickCount += 1
      // }
      
      // console.log("mouse over me 3 -- clicked", this.canEject)
      // if (!this.canEject) {
      //   return
      // }
      // this.juice_sprite.stop()
      // this.quantityLeft -= 1
      // if (this.quantityLeft >= 0) {
      //   const temp = Array.from( this.nftSprites.keys() );
      //   this.quantity -= 1;
      //   const tempSprite = this.nftSprites.get(temp[this.quantity])
      //   tempSprite?.setDepth(10)
    
      //   leftText.text = `Left: ${this.quantityLeft}`
      //   leftText.update()
      //   this.juice_sprite.play("juice2")
      //   this.sprite.play("mom-spray-anim2")
      // }
      // this.canEject = false
    }, this)
 
  }

  update(time: any, delta: any) {
    // this.cameras.getWorldPoint(pointer.x, pointer.y)
    // this.input.activePointer.updateWorldPoint(this.cameras.main);
    // const pointer = this.input.activePointer
    // console.log("----", pointer.x, pointer.y, window.innerWidth/2, window.innerHeight/2 - 100)
    // console.log("--update-", this.input.mousePointer.x, this.input.x)
    // if (this.sprite)
    //   console.log("--", this.sprite.x, this.sprite.y, this.sprite.depth)
  }
}

const lastRandomX = [-10000];
const lastRandomY = [-10000];
function generateRandomXAndY(): {randomX: number, randomY: number} {
  const randomX = Math.sign(Math.random() - 0.5) *  Math.random() * 600
  const randomY = Math.random()* 100 + 200;
  for (let i =0; i < lastRandomX.length; i++) {
    console.log("debug----- ", randomX ,lastRandomX[i], Math.abs(randomX - lastRandomX[i]) < 60)
    if (Math.abs(randomX - lastRandomX[i]) < 60 ) {
      console.log("debug.. ", Math.abs(randomX - lastRandomX[i]))
      return generateRandomXAndY()
    }
  }
  lastRandomX.push(randomX);
  lastRandomY.push(randomY);
  return {
    randomX: randomX,
    randomY: randomY
  }
}

