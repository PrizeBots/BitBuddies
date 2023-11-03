import Phaser from "phaser";
import { MainScene } from "../scene/main.scene";

export default {
  width: 16 * 80, // 16 * 40 = 640
  height: 9 * 80,  // 9 * 40 = 360
    type: Phaser.AUTO,
    parent: 'BitBuddies',
    parent: "game",
    scene: [
      MainScene
    ],
    pixelArt: true,
    backgroundColor: 0x333333,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
};;
