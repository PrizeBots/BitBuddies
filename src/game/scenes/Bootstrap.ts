import Phaser from 'phaser'

enum BackgroundMode {
  DAY,
  NIGHT,
}

export default class Bootstrap extends Phaser.Scene {
  select_music!: Phaser.Sound.BaseSound
  err_music!: Phaser.Sound.BaseSound
  snap_sound!: Phaser.Sound.BaseSound
  button_press_sound!: Phaser.Sound.BaseSound
  dr_bits_success_sound!: Phaser.Sound.BaseSound
  button_hover_sound!: Phaser.Sound.BaseSound
  button_down_sound!: Phaser.Sound.BaseSound
  can_open_sound!: Phaser.Sound.BaseSound

  constructor() {
    super('bootstrap')
    console.log("running constructor bootstrap.. ")
  }

  preload() {
    console.log("running preload of bootstrap.. ")
    // this.load.atlas(
    //   'cloud_day',
    //   'assets/background/cloud_day.png',
    //   'assets/background/cloud_day.json'
    // )
    // this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    // this.load.atlas(
    //   'cloud_night',
    //   'assets/background/cloud_night.png',
    //   'assets/background/cloud_night.json'
    // )
    // this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    // this.load.image('sun_moon', 'assets/background/sun_moon.png')

    // load town map
    // this.load.tilemapTiledJSON("map", 'bitfgihter_assets/new2.json')
    // this.load.image("tiles", 'bitfgihter_assets/LobbyTown.png')
    // this.load.image("club1", 'bitfgihter_assets/LobbyTown/Buildings/CLUB.png')
    // this.load.image("wall", 'bitfgihter_assets/LobbyTown/wall.png')
    this.load.image("chat_bubble", 'bitfgihter_assets/chat_bubble.png')
    this.load.image("cloud_chat_bubble", 'bitfgihter_assets/cloud_chat_bubble.png')
    this.load.image("info_icon", 'bitfgihter_assets/info_icon.png')

    // load hq assets
    // this.load.tilemapTiledJSON("hq_map", 'bitfgihter_assets/hq_assets/tiled_design_hq.json')
    // this.load.image("hq_base", 'bitfgihter_assets/hq_assets/HQ_base3.png')
    // this.load.image("stage", 'bitfgihter_assets/hq_assets/stage.png')
    // this.load.image("atm-machine", 'bitfgihter_assets/hq_assets/atm.png')
    // this.load.image("stage3d", 'bitfgihter_assets/hq_assets/stage3d.png')
    // this.load.image("fight-machine", 'bitfgihter_assets/hq_assets/basic-fight-machine.png')
    // this.load.image("punch-box", 'bitfgihter_assets/hq_assets/fight-machine-ext.png')
    // this.load.image("radiator", 'bitfgihter_assets/hq_assets/radiator.png')

    // this.load.image("atm-base", 'bitfgihter_assets/atm/atm-base.png')
    // this.load.image("atm-ext", 'bitfgihter_assets/atm/atm-ext.png')

    // this.load.image("brew-machine-base", 'bitfgihter_assets/brew/brew-base.png')
    // this.load.image("brew-machine-ext", 'bitfgihter_assets/brew/brew-ext.png')

    this.load.image("brew-can", "bitfgihter_assets/brew/BREW.png" )

    // load music
    this.load.audio("select_music", "bitfgihter_assets/sounds/select_sound.mp3")
    this.load.audio("err_music", "bitfgihter_assets/sounds/err_sound.mp3")
    this.load.audio("punch1-music", "bitfgihter_assets/sounds/punch01.mp3")
    this.load.audio("punch2-music", "bitfgihter_assets/sounds/punch02.mp3")

    // this.load.audio("fight-music", "bitfgihter_assets/sounds/fight-track.mp3")
    
    this.load.audio("fight-music-1", "bitfgihter_assets/sounds/new_fight_tracks/Ayumi.mp3")
    this.load.audio("fight-music-2", "bitfgihter_assets/sounds/new_fight_tracks/BullDancer.mp3")
    this.load.audio("fight-music-3", "bitfgihter_assets/sounds/new_fight_tracks/Deeper.mp3")
    this.load.audio("fight-music-4", "bitfgihter_assets/sounds/new_fight_tracks/Destined.mp3")
    this.load.audio("fight-music-5", "bitfgihter_assets/sounds/new_fight_tracks/Detroit.mp3")
    this.load.audio("fight-music-6", "bitfgihter_assets/sounds/new_fight_tracks/Haiba.mp3")
    this.load.audio("fight-music-7", "bitfgihter_assets/sounds/new_fight_tracks/Maji_Break.mp3")
    this.load.audio("fight-music-8", "bitfgihter_assets/sounds/new_fight_tracks/penguins_on_ice.mp3")
    this.load.audio("fight-music-9", "bitfgihter_assets/sounds/new_fight_tracks/run_with_me.mp3")
    this.load.audio("fight-music-10", "bitfgihter_assets/sounds/new_fight_tracks/Wolfpack.mp3")


    this.load.audio("boop-music", "bitfgihter_assets/sounds/boop01.mp3")
    this.load.audio('fight-start-music', "bitfgihter_assets/sounds/fight_start_sound.mp3")
    this.load.audio('snap-sound', "bitfgihter_assets/sounds/snap01.mp3")
    this.load.audio('button-press-sound', "bitfgihter_assets/sounds/button01.mp3")

    this.load.audio('can-open-sound', "bitfgihter_assets/sounds/brewCanOpen.mp3")

    this.load.audio('dr_bits_success_sound', "bitfgihter_assets/sounds/Success.mp3")

    this.load.audio('swing-sound-1', "bitfgihter_assets/sounds/swing01.mp3")
    this.load.audio('swing-sound-2', "bitfgihter_assets/sounds/swing02.mp3")
    this.load.audio('swing-sound-3', "bitfgihter_assets/sounds/swing03.mp3")
    this.load.audio('swing-sound-4', "bitfgihter_assets/sounds/swing04.mp3")

    this.load.audio('coins_drop', "bitfgihter_assets/sounds/coins_drop.mp3")
    this.load.audio('coins_collect', "bitfgihter_assets/sounds/coins_collect.mp3")

    this.load.audio('button_hover', "bitfgihter_assets/sounds/buttonHover.wav")
    this.load.audio('button_down', "bitfgihter_assets/sounds/buttonDown.mp3")

    // load css
    // this.load.css('80s', 'bitfgihter_assets/80stypography.css');

    this.load.tilemapTiledJSON("new_hq", 'new_assets/map/HQ_3.json')
    this.load.image("hq_sheet_01", 'new_assets/map/HQ_Sheet_04.png')

    // coins 
    this.load.atlas(
      'silver_coin',
      'bitfgihter_assets/silver_coin.png',
      'bitfgihter_assets/silver_coin.json'
    )
  }

  async readFileAsync(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file)
    })
  }

  init() {
    // const dispatch = useAppDispatch();
    // this.network = new Network()
  }

  play_select_sound() {
    this.select_music.play({loop: false})
  }

  play_err_sound() {
    this.err_music.play({loop: false})
  }

  play_snap_sound() {
    this.snap_sound.play({loop: false})
  }

  play_button_press_sound() {
    console.log("pressed play_button_press_sound")
    if (this.button_press_sound.isPlaying) return;
    this.button_press_sound.play({loop: false})
  }

  play_can_open_sound() {
    this.can_open_sound.play({loop: false})
  }


  create() {
    this.launchBackground(BackgroundMode.NIGHT)
    this.select_music = this.sound.add('select_music');
    this.err_music = this.sound.add('button_hover');
    this.snap_sound = this.sound.add('snap-sound');
    this.button_press_sound = this.sound.add('button-press-sound')

    this.can_open_sound = this.sound.add('can-open-sound', {volume: 0.05})

    this.dr_bits_success_sound = this.sound.add('dr_bits_success_sound')
    // this.button_hover_sound = this.sound.add('button_hover', {volume: 0.4})
    this.button_hover_sound = this.sound.add('select_music', {volume: 0.2})
    this.button_down_sound = this.sound.add('button_down', {volume: 0.5})
  }

  play_dr_bits_success_sound() {
    if (this.dr_bits_success_sound.isPlaying) return;
    this.dr_bits_success_sound.play({loop: false})
  }

  play_button_hover_sound() {
    if (this.button_hover_sound.isPlaying) return;
    this.button_hover_sound.play({loop: false})
  }

  play_button_down_sound() {
    console.log("in play button down sound ")
    if (this.button_down_sound.isPlaying) return;
    this.button_down_sound.play({loop: false})
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode: BackgroundMode.NIGHT })
  }

  async launchGame(data:any) {
    console.log("in here...")
    setTimeout(() => {
      this.scene.launch('game', {
        data, "key": "hq_map"
      })
    }, 100)
  }

  async launchMintingGame(data:any) {
    console.log("minting launchMintingGame --- ", data)
    setTimeout(() => {
      this.pauseBackground()
      this.pauseGame()
      this.scene.launch('minting')
    , data}, 100)
  }

  async pauseMintingGame() {
    this.scene.stop('minting')
  }

  pauseBackground() {
    console.log("in pause...")
    this.scene.stop('background')
  }

  pauseGame() {
    console.log("in pause...")
    this.scene.stop('game')
  }

  launchBackGroundNight() {
    this.launchBackground(BackgroundMode.NIGHT)
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
}
