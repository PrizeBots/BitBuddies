import Phaser from 'phaser'
import Background from './game/scenes/Background';
import Bootstrap from './game/scenes/Bootstrap';
import Game from './game/scenes/Game';
import MintingGame from './game/scenes/MintingGame';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#111b28',
  pixelArt: true,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
      // fps: 30,
    },
  },
  fps: {
    target: 30,
    forceSetTimeOut: true,
  },
  autoFocus: true,
  scene: [Bootstrap, Background, MintingGame, Game ],
}

const phaserGame = new Phaser.Game(config)

;(window as any).game = phaserGame

export default phaserGame
