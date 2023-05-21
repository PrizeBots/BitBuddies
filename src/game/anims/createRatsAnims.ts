import Phaser from 'phaser'
import { isNullOrUndefined } from 'util'

export const createRatsAnims = (anims: Phaser.Animations.AnimationManager, key: string) => {
  if (isNullOrUndefined(key) || key === "") return;
  console.log("in ccreate mouse animation -- ", key, 'idle-'+ key)

  anims.create({
    key: 'idle-'+ key,
    frames:[
      {
        key,
        frame: 'idle000.png'
      },
      {
        key,
        frame: 'idle001.png'
      },
    ],
    frameRate: 3,
    repeat: -1
  })

  anims.create({
    key: 'run-start-'+ key,
    frames: [{
        key,
        frame: 'idle001.png'
      },
      {
        key,
        frame: 'run000.png'
      },
    ],
    frameRate: 6,
    repeat: -1
  })

  anims.create({
    key: 'run-'+ key,
    frames: [{
        key,
        frame: 'run001.png'
      },
      {
        key,
        frame: 'run002.png'
      },
    ],
    frameRate: 6,
    repeat: -1
  })

  anims.create({
    key: 'die-'+ key,
    frames: [{
        key,
        frame: 'die000.png'
      },
    ],
    frameRate: 12,
    repeat: -1
  })

   anims.create({
    key: 'hurt-'+ key,
    frames: [{
        key,
        frame: 'hurt001.png'
      },
    ],
    frameRate: 12,
    repeat: -1
  })
}
