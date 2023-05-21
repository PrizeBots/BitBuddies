import { DEFAULT_RATS_DISPLAY_HEIGHT, DEFAULT_RATS_DISPLAY_WIDTH } from "../configs";

import { isNullOrUndefined } from "util";

export interface IPosition {
  x: number;
  y: number;
}

export enum RatState {
  ALIVE = 10,
  DEAD = 20,
  TURN_TO_COINS = 30,
  COIN_PICKED = 40,
  COINS_FELL = 60,
  COIN_END = 50,
}

export interface IRatsStateManager {
  rats_launch_start: boolean;
  rats_lauched: boolean;
  rats_count: number,
  rats_positiions: Array<IPosition>;
  rats_orientations: Array<string>;
  rats_launch_time: number;
  rats_state: Array<RatState>;
  rats_health: Array<number>;
  rats_last_health: Array<number>;
}

export interface IMouse {
  key: string;
  gameObject: Mouse;
  moving: boolean,
}

export class Mouse  {
  scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public silver_coin_sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public playerContainer!: Phaser.GameObjects.Container
  public dead = false;
  public show_coins = false;
  public hideMouse = false;
  public destroy_coin = false;
  healthBar!: Phaser.GameObjects.Graphics;
  actualLastHealth!: number;
  healthReduced!: number;
  healthBarBackground!: Phaser.GameObjects.Graphics;
  staminaBarBackGround!: Phaser.GameObjects.Graphics;
  staminaBar!: Phaser.GameObjects.Graphics

  // health related
  totalHealthValue: number

  // 
  totalActualHealthValue!: number;
  totalActualStaminaValue!: number;

  public last_position_stored!: {
    x: number;
    y: number
  }

  public target_position_stored!: {
    x: number;
    y: number
  }

  public target_position_stored_after_hit!: {
    x: number;
    y: number
  }

  public tween_animation_running = false;
  public gotHit_tween_animation_running = false;
  public moving!: boolean;
  public gotHitMoving = false;
  startingHealth: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    nameOfAnimationKey: string,
    _health: number,
  ) {
    this.totalHealthValue = 15;
    this.startingHealth = _health;
    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(x, y, texture)

    this.silver_coin_sprite = this.scene.physics.add.sprite(0,0, "silver_coin");
    this.silver_coin_sprite.displayHeight = 10;
    this.silver_coin_sprite.displayWidth  = 10;
    this.sprite.play(nameOfAnimationKey)
    this.silver_coin_sprite.play("rotate")
    // setTimeout(() => {
    //   this.sprite.play(nameOfAnimationKey)
    //   this.silver_coin_sprite.play("rotate")
    // }, 100)
    
    this.sprite.displayHeight = DEFAULT_RATS_DISPLAY_HEIGHT;
    this.sprite.displayWidth = DEFAULT_RATS_DISPLAY_WIDTH;
    this.playerContainer = this.scene.add.container(x,y - 10).setDepth(900000)
    this.healthBar = this.scene.add.graphics();
    this.healthBarBackground = this.scene.add.graphics()
    this.staminaBarBackGround = this.scene.add.graphics()
    this.staminaBar = this.scene.add.graphics();
    this.scene.physics.world.enable(this.playerContainer)
  }

  BaseUpdate() {
    this.playerContainer.x = this.sprite.x;
    this.playerContainer.y = this.sprite.y - 15;
    this.silver_coin_sprite.x = this.sprite.x;
    this.silver_coin_sprite.y = this.sprite.y;
    this.silver_coin_sprite.setDepth(-1000)
    if (this.show_coins) {
      this.DisableHealthBars()
      this.sprite.setDepth(-1000)
      this.silver_coin_sprite.setDepth(this.sprite.y)
    }
    if (this.hideMouse) {
      this.DisableHealthBars()
      this.sprite.setDepth(-1000)
      this.silver_coin_sprite.setDepth(-1000)
    }
    if (this.destroy_coin) {
      this.sprite.setDepth(-1000)
      this.silver_coin_sprite.setDepth(-1000)
    }
    if (!isNullOrUndefined(this.target_position_stored)){
      this.SmoothMovement()
    }
  }

  UpdateHealthBar(healthVal: number, reduceHealth= false) {
    this.healthBar.clear()
    console.log("mouse--", healthVal, ((2 * healthVal)) - 5 )
    this.playerContainer.remove([this.healthBar, this.healthBarBackground]);
    this.healthBar.fillStyle(0x32CD32, 1);
    this.healthBar.fillRect(-5, 0 , ((2 * healthVal)) - 5 , 3);
    this.healthBarBackground.fillStyle(0xffffff, 1);
    this.healthBarBackground.fillRect(-5, 0 , this.totalHealthValue, 3); 
    this.playerContainer.add([this.healthBarBackground, this.healthBar]);
  }

  EnableHealthBars() {

    this.healthBar.fillStyle(0x32CD32, 1);
    this.healthBar.fillRect(-5, 0 , this.startingHealth, 3); 
    this.healthBarBackground.fillStyle(0xffffff, 1);
    this.healthBarBackground.fillRect(-5, 0 , this.totalHealthValue, 3); 
    
    this.playerContainer.add([this.healthBarBackground]);
    this.playerContainer.add(this.healthBar);
    this.playerContainer.setInteractive();
  }

  DestroyGameObject() {
    this.sprite.destroy()
    this.silver_coin_sprite.destroy()
    this.playerContainer.destroy()
    this.DisableHealthBars()
  }

  DisableHealthBars() {
    this.playerContainer.remove([this.healthBarBackground, this.staminaBarBackGround]);
    this.playerContainer.remove(this.healthBar);
    this.playerContainer.remove(this.staminaBar);
  }

  PopHealthReduced(amount: number, color = "") {
    const randomSign = Math.random();
    const randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
    const randomY =  5 + Math.random() * 2;
    let healthsprite: Phaser.GameObjects.Text;
    try {
      healthsprite = this.scene.add
          .text(this.sprite.x, this.sprite.y - 15 , amount.toString())
          .setFontFamily('monospace')
          .setFontSize(54 + amount * 4)
          .setScale(0.2)
          .setColor('#fefefe')
          .setOrigin(0.5)
          .setStroke('#6a6565', 10)

      const randomSign = Math.random();
      const randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
      const randomY =  5 + Math.random() * 25;

      // let temp = healthsprite;

      this.scene.tweens.add({
        targets: healthsprite,
        y: this.sprite.y - 30,
        x: this.sprite.x + Math.sign(randomSign - 0.5) * Math.random() * 30,
        duration: 500,
      }).on("complete", () => {
        healthsprite.destroy()
      })
    } catch (err) {
      console.log("error in PopHealthReduced -->", err)
    }
  }

  SmoothMovement(animationTime = 800) {
    if (this.gotHitMoving) return;
    if (
      (Math.abs(this.target_position_stored.x - this.sprite.x) < 1)
      && (Math.abs(this.target_position_stored.y - this.sprite.y) < 1)
    ) {
      this.tween_animation_running = false;
      this.moving = false;
      return
    }
    this.moving = true;
    if (this.tween_animation_running) return;
    try {
      if (isNullOrUndefined(this.target_position_stored.x)) return;
      this.scene.tweens.add({
        targets: this.sprite,
        y: this.target_position_stored.y,
        x: this.target_position_stored.x,
        duration: animationTime,
      }).on("start", () => {
        this.tween_animation_running = true;
        this.moving = true;
      }).on("complete", () => {
        this.tween_animation_running = false;
      })
    } catch (err) {
      console.log("error_in_line 790 in baseplayer ", err, this.sprite, this.target_position_stored)
    }
    
  }

  GotHitMovement(targetPos: {x: number; y: number;}, animationTime = 400) {
    this.gotHitMoving = true;
    if (this.gotHit_tween_animation_running) return;
    this.target_position_stored = targetPos;
    try {
      if (isNullOrUndefined(targetPos.x)) return;
      this.scene.tweens.add({
        targets: this.sprite,
        // y: targetPos.y,
        x: targetPos.x,
        duration: animationTime,
      }).on("start", () => {
        this.gotHit_tween_animation_running = true;
        this.gotHitMoving = true;
      }).on("complete", () => {
        
        console.log("got hit moving mouse ")
        this.sprite.x = targetPos.x;
        this.sprite.y = targetPos.y;
        this.gotHit_tween_animation_running = false;
        this.gotHitMoving = false;
      })
    } catch (err) {
      console.log("error_in_line 234 in mouse ", err, this.sprite, targetPos)
    }
    
  }
}