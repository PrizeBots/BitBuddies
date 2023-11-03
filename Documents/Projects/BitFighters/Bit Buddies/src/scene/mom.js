import { StatusBar } from "./StatusBar";
export class Mom extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene);
        this.momSprite = this.scene.physics.add.sprite(this.scene.gameWidth / 2, this.scene.gameHeight / 2, 'MoM');
        this.spriteScale = 2;
        this.momSprite.setScale(this.spriteScale);
        this.momWidth = this.momSprite.width * this.spriteScale;
        this.momHeight = this.momSprite.height * this.spriteScale;
        this.momSprite.setBounce(1)
        this.momSprite.setCollideWorldBounds(true);
        this.momSprite.setPushable(true)
        this.isAlive = true;
   
     //   scene.events.on('update', this.update, this);
    }
    // update(time, delta) {
    //     const deltaSeconds = delta / 1000;  // Convert delta to seconds
      
    // }
}