import { Scene } from "./scene";
import { Player } from "./player";
import { Mom } from "./mom";
import { Utils } from "./utils";
import VirtualJoyStickPlugin from "../plugin/rex-virtual-joystick-plugin";

export class MainScene extends Scene {
    constructor(options = { key: "MainScene" }) {
        super(options)
    }

    init() {
        //   this.physics.world.update(time, delta * 2); // for example, update twice as frequently
        this.physics.world.createDebugGraphic();

        super.init();
        this.staticXJsPos = this.gameWidthMiddle;
        this.staticYJsPos = this.gameHeightMiddle + (this.gameHeightMiddle / 2) + (this.gameHeightMiddle / 4);

        this.lastCursorDirection = "center";
        this.joystickConfig = {
            x: this.staticXJsPos,
            y: this.staticYJsPos,
            enabled: true
        };

        // this.buddySprites = this.physics.add.group();
        // this.baddySprites = this.physics.add.group();
        // this.bumpers = this.physics.add.group({
        //     collideWorldBounds: true,
        //     bounceX: 1,
        //     bounceY: 1,
        //     allowGravity: false,

        // });
        this.bumpers = [];
        this.hitBoxes = [];

        this.objects = [];
        //  this.hitBoxes = this.physics.add.group();
        // this.objects = this.physics.add.group();


        this.testers = this.physics.add.group();


        this.baddySprites = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
            allowGravity: false,

        });
        this.buddySprites = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
            allowGravity: false,

        });
        // this.baddyBumpBoxes = [];
        // this.buddyBumpBoxes = [];
        this.baddyBumpBoxes = this.physics.add.group();
        this.buddyBumpBoxes = this.physics.add.group();
        this.baddyHurtBoxes = [];
        this.buddyHurtBoxes = [];

        this.baddyHitBoxes = [];
        this.buddyHitBoxes = [];

        this.baddies = [];
        this.buddies = [];

        this.baddyPool = [];
        this.POOL_SIZE = 50;

        this.coins = [];
        this.playerCoins = 0;

        this.coinText = this.add.text(10, 10, 'Coins: 0', {
            fontSize: '12px',
            fill: '#ffffff', // white color
            stroke: '#000000', // black outline
            strokeThickness: 4 // thickness of the outline
        });
        //Sprites
        this.spritesToRender = this.add.group();
        //Graphics
        this.graphics1 = this.add.graphics({ lineStyle: { width: 4, color: 0x0000ff } });
        this.graphics2 = this.add.graphics({ lineStyle: { width: 4, color: 0xff0000 } });
        this.graphics3 = this.add.graphics({ lineStyle: { width: 1, color: 0x00FF00 } });
        this.graphics4 = this.add.graphics({ lineStyle: { width: 1, color: 0xaa00aa } });
    }

    preload() {
        this.load.audio('coinGet', './assets/sound/CoinGet.mp3');
        this.load.image('background', './assets/image/bg.png');
        this.load.image('base', './assets/image/base.png');
        this.load.image('thumb', './assets/image/thumb.png');
        this.load.plugin('rex-virtual-joystick-plugin"', VirtualJoyStickPlugin, true);
        // Load the GIF as a spritesheet
        this.load.spritesheet('coin', './assets/items/coin.png', {
            frameWidth: 25, // adjust as necessary
            frameHeight: 25, // adjust as necessary
        });
        this.load.spritesheet('MoM', './assets/items/MoM.png', {
            frameWidth: 96, // adjust as necessary
            frameHeight: 146, // adjust as necessary
        });
        for (let i = 1; i <= 110; i++) {
            this.load.spritesheet(`buddy_${i}`, `./assets/bf/file_${i}.png`, {
                frameWidth: 64,
                frameHeight: 64,
                startFrame: 0,
                endFrame: 60
            });
        }
    }

    dropCoin(x, y) {

        // Ensure the `this.coins` group exists
        if (!this.coins) {
            this.coins = this.physics.add.group();
        }

        // Create a new coin sprite and add it to the group
        this.coin = this.physics.add.sprite(x, y, 'coin');
        this.coin.anims.play('coin');
        this.coins.push(this.coin);
        this.coin.setScale(2);
        this.physics.add.collider(this.player, this.coin, this.pickUpCoin, null, this);
    }

    pickUpCoin(player, coin) {
        if (coin.active) {  // Check if coin is still active
            this.playerCoins += 1;
            this.coinText.setText('Coins: ' + this.playerCoins);
            coin.disableBody(true, true);
            this.sound.play('coinGet');
            coin.destroy();
        }
    }

    create() {
        //this.physics.world.createDebugGraphic();
        //  this.cursorDebugText = this.add.text(10, 10);
        this.anims.create({
            key: 'coin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1 // loop indefinitely
        });
        //Set Inputs
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //Set Game
        this.physics.world.bounds.width = this.gameWidth;
        this.physics.world.bounds.height = this.gameHeight;
        console.log("world.bounds" + this.physics.world.bounds.width, ", " + this.physics.world.bounds.height)
        this.background = this.add.sprite(0, 0, "background").setOrigin(0, 0);
        this.background.setDisplaySize(this.gameWidth, this.gameHeight);
        this.background.setDepth(-1);
        //Set Player
        this.makeDude('player');
        this.createVirtualJoystick();
        this.setCursorDebugInfo();

        //create buddies
        for (let i = 0; i < 1; i++) {
            this.makeDude('buddy');
        }
        for (let i = 0; i < 2; i++) {
            this.makeDude('baddy');
        }

        //Start Game
        this.MoM = new Mom(this, Phaser.Math.Between(0, this.gameWidth), Phaser.Math.Between(0, this.gameHeight));
        this.MoM.momSprite.setCollideWorldBounds(true);
        this.objects.push(this.MoM.momSprite);

        this.coin1 = this.physics.add.image(100, 100, 'coin');
        this.coin2 = this.physics.add.image(400, 100, 'coin');
        this.coin1.setBounce(1);
        this.coin2.setBounce(1);

        //  this.objects.add(this.coin1);
        //  this.objects.add(this.coin2);
        this.coin1.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
        this.coin2.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);

        this.physics.add.overlap(this.buddyHurtBoxes, this.baddyHitBoxes, this.hitCheck, null, this);
        this.physics.add.overlap(this.baddyHurtBoxes, this.buddyHitBoxes, this.hitCheck, null, this);
        this.physics.add.collider(this.buddySprites, this.baddySprites, this.bumpCheck, null, this);
    }

    bumpCheck(bumper1, bumper2) {
        let angle = Phaser.Math.Angle.Between(bumper1.x, bumper1.y, bumper2.x, bumper2.y);
        bumper1 = bumper1.parentContainer;
        bumper2 = bumper2.parentContainer;
        if (bumper1.type === 'buddy' && bumper2.type === 'baddy'
            || bumper1.type === 'baddy' && bumper2.type === 'buddy'
            || bumper1.type === 'baddy' && bumper2.type === 'player'
            || bumper1.type === 'player' && bumper2.type === 'baddy') {
            bumper1.punch();
            bumper2.punch();
        }
        let force = -500; // Adjust the force as needed
        // bumper1.playerSprite.setVelocity(Math.cos(angle + Math.PI) * force, Math.sin(angle + Math.PI) * force);
        //  bumper2.playerSprite.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
    }

    makeDude(type) { 
        this.dude = new Player(this, Phaser.Math.Between(0, this.gameWidth), Phaser.Math.Between(0, this.gameHeight), type);
        this.add.existing(this.dude);
        this.objects.push(this.dude.playerSprite);
        //  console.log(this.dude.hitBox)
        if (type === 'baddy') {
            //   this.baddyBumpBoxes.add(this.dude.bumper);
            this.baddyHitBoxes.push(this.dude.hitBox);
            this.baddyHurtBoxes.push(this.dude.hurtBox);
            this.baddySprites.add(this.dude.playerSprite)
            this.baddies.push(this.dude);
        } else {//team buddy
            //  this.buddyBumpBoxes.add(this.dude.bumper);
            this.buddyHitBoxes.push(this.dude.hitBox);
            this.buddyHurtBoxes.push(this.dude.hurtBox);
            this.buddySprites.add(this.dude.playerSprite)
            this.buddies.push(this.dude);
            if (type === 'player') {
                this.playerInstance = this.dude;
                this.player = this.playerInstance.playerSprite;
            }
        }
    }

    hitCheck(hitter, hitThing) {
        // 
        hitter = hitter.parentContainer;
        hitThing = hitThing.parentContainer;
        if (hitter && hitThing && hitter != hitThing) {
            if (hitThing.isHit) return;
            if (hitter.type === 'buddy' && hitThing.type === 'baddy'
                || hitter.type === 'baddy' && hitThing.type === 'buddy'
                || hitter.type === 'baddy' && hitThing.type === 'player'
                || hitter.type === 'player' && hitThing.type === 'baddy') {
                // hitter.punch();
                // hitThing.punch();
                if (hitter.isAttacking) {
                 //   console.log("AVisAttacking")
                    hitThing.takeDamage(hitter.attack, 'right');
                }
            }
        }
    }

    checkCollisions() {
        // this.graphics = this.add.graphics();
        //  this.graphics.clear();
        this.buddies.forEach(buddy => {
            if (!buddy.isAlive) return;
            let worldPos = this.getWorldPosition(buddy.playerSprite);
            if (worldPos.x < 0) buddy.x -= worldPos.x;
            if (worldPos.y < 0) buddy.y -= worldPos.y;
            if (worldPos.x + buddy.width > this.physics.world.bounds.width) {
                buddy.x -= (worldPos.x + buddy.width - this.physics.world.bounds.width);
            }
            if (worldPos.y + buddy.height > this.physics.world.bounds.height) {
                buddy.y -= (worldPos.y + buddy.height - this.physics.world.bounds.height);
            }
            // this.objects.forEach(object => {

            // });
            this.baddies.forEach(baddy => {
                if (!baddy.isAlive) return;
                let buddyHurtBox = buddy.hurtbox.getBounds();
                let baddyHurtBox = baddy.hurtbox.getBounds();
                let buddyHitBox = buddy.hitbox.getBounds();
                let baddyHitBox = baddy.hitbox.getBounds();
                // this.graphics.lineStyle(1, 0xff0000);
                // this.graphics.strokeRectShape(buddyBox);
                // this.graphics.lineStyle(1, 0x00ff00);
                // this.graphics.strokeRectShape(baddyBox);
                // this.graphics.lineStyle(1, 0x00ffff);
                // this.graphics.strokeRectShape(buddyHurtBox);;

                if (baddy.isAlive && buddy.isAlive && Phaser.Geom.Rectangle.Overlaps(buddyBox, baddyBox)) {
                    buddy.isColliding = true;
                    // if (buddy.type === 'player') console.log("AYAD") 
                    buddy.punch();
                    baddy.punch();
                    let buddyBoxCenterX = buddyBox.centerX;
                    let buddyBoxCenterY = buddyBox.centerY;
                    // Determine the collision side
                    // if (buddyBoxCenterX < baddy.bumpBox.x) {  // left side of baddy
                    //     this.handleCollision(buddy.sprite, baddy.sprite, 'left');
                    // } else if (buddyBoxCenterX > baddy.bumpBox.x + baddy.bumpBox.width) {  // right side of baddy
                    //     this.handleCollision(buddy.sprite, baddy.sprite, 'right');
                    // } else if (buddyBoxCenterY < baddy.bumpBox.y) {  // top side of baddy
                    //     this.handleCollision(buddy.sprite, baddy.sprite, 'top');
                    // } else if (buddyBoxCenterY > baddy.bumpBox.y + baddy.bumpBox.height) {  // bottom side of baddy
                    //     this.handleCollision(buddy.sprite, baddy.sprite, 'bottom');
                    // }
                } else {
                    buddy.isColliding = false;
                }
                // if (buddy.isHit) return;
                // if (baddy.isHit) return;
                //Attack Check

                if (Phaser.Geom.Rectangle.Overlaps(buddyHitBox, baddyHurtBox)) {

                    if (buddy.isAttacking && baddy.isAlive && !baddy.isHit) {

                        if (buddy.isFacing === 'left' && baddy.isFacing === 'right') {
                            // 
                        } else {
                            // baddy.takeDamage('left');
                        }
                        if (baddy.currentHealth <= 0) {
                            baddy.die();
                        }
                    } else {

                    }

                } else {
                    buddy.isHit = false;
                }

                if (Phaser.Geom.Rectangle.Overlaps(baddyHitBox, buddyHurtBox)) {

                    if (baddy.isAttacking && buddy.isAlive && !buddy.isHit) {


                        if (buddy.isFacing === 'left' && baddy.isFacing === 'right') {
                            //buddy.takeDamage('right');
                        } else {
                            //buddy.takeDamage('left');

                        }
                        //buddy.statusBar.updateBars(buddy.currentHealth -= baddy.attackValue, buddy.currentStamina)
                        if (buddy.currentHealth <= 0) {
                            buddy.die();
                            //    this.spritesToRender.remove(buddy);
                            ///// console.log("buddy DOWN!")
                        }
                    } else {

                    }
                } else {
                    baddy.isHit = false;
                }
            });
        });
        // Remove the dead baddies from the baddies array.
        this.baddies = this.baddies.filter(baddy => !baddy.isDead);
        this.buddies = this.buddies.filter(buddy => !buddy.isDead);

    }

    handleCollision(buddy, baddy, side) {
        const reject = 20;
        // switch (side) {
        //     case 'left':

        //         if (buddy.type === 'player') console.log("LEFT HIT!")
        //         buddy.x -= reject;

        //         baddy.x += reject;
        //         // buddy.x = baddy.x - buddy.width - reject;
        //         // baddy.x = buddy.x + baddy.width + reject;
        //         break;
        //     case 'right':
        //         buddy.x += reject;

        //         baddy.x -= reject;
        //         //    buddy.x = baddy.x + buddy.width + reject;
        //         //    baddy.x = buddy.x - baddy.width - reject;
        //         break;
        //     case 'top':
        //         buddy.x -= reject;
        //         baddy.x += reject;

        //     case 'bottom':
        //         buddy.x += reject;
        //         baddy.x -= reject;
        //         break;
        // }
    }

    findClosestOpponent(entity, opponents) {
        let closestOpponent = null;
        let closestDistance = Infinity;

        //entity.updateStatusText("TARGETING");

        opponents.forEach(opponent => {
            let distance = Phaser.Math.Distance.Between(
                entity.sprite.getBounds().x, entity.sprite.getBounds().y,
                opponent.sprite.getBounds().x, opponent.sprite.getBounds().y
            );
            if (distance < closestDistance) {
                closestDistance = distance;
                if (closestDistance <= 1800) {
                    closestOpponent = opponent;
                    //console.log("Distance to target:", closestDistance);
                }
                else {
                    console.log(closestDistance)
                }
            }
        });

        return closestOpponent; // Explicitly return closestOpponent
    }

    update(time, delta) {
        ///   this.physics.world.collide(this.baddyBumpBoxes, this.buddyBumpBoxes);
        //  console.log("hitBoxes:", this.hitBoxes.countActive());
        //  console.log("objects:", this.objects.countActive());
        //Sort Depth
        // this.spritesToRender.children.each(sprite => {
        //     sprite.setDepth(sprite.y);
        // });
        //         console.log("Buddy Bumpers:", this.buddyBumpers.countActive());
        // console.log("Baddy Bumpers:", this.baddyBumpers.countActive());
        this.graphics1.clear();
        this.graphics2.clear();
        this.graphics3.clear();
        this.buddies.forEach(buddy => {
            if (buddy.isAlive && buddy !== this.playerInstance) {
                let target = this.findClosestOpponent(buddy, this.baddies);

                target = null;

                if (target && target.isAlive) {
                    this.graphics1.lineBetween(buddy.sprite.getBounds().x, buddy.sprite.getBounds().y,
                        target.sprite.getBounds().x, target.sprite.getBounds().y);
                    this.graphics1.strokePath();
                    buddy.updateStatusText("DRAW LINE!");
                    buddy.isStalking = true;
                    buddy.isIdle = false;
                    this.stalk(buddy, target);
                } else {
                    buddy.isStalking = false;
                    buddy.isIdle = true;
                }
            }
        });

        this.baddies.forEach(baddy => {
            if (baddy.isAlive) {
                //      baddy.playerSprite.setTint(Utils.getRandomColor());
                // if (baddy.isAttacking || baddy.isColliding) return;
                let target = this.findClosestOpponent(baddy, this.buddies);

                target = null;

                if (target && target.isAlive) {
                    this.graphics2.lineBetween(baddy.sprite.getBounds().x, baddy.sprite.getBounds().y,
                        target.sprite.getBounds().x, target.sprite.getBounds().y);
                    this.graphics2.strokePath();

                    baddy.updateStatusText("DRAW LINE!");
                    baddy.isStalking = true;
                    baddy.isIdle = false;
                    this.stalk(baddy, target);

                } else {
                    baddy.isStalking = false;
                    baddy.isIdle = true;
                }
            }
        });
        ///    this.checkCollisions();
        this.updateController();
    }

    stalk(entity, target) {
        entity.updateStatusText("stalk");
        let directionX = 0;
        let directionY = 0;
        let targetX = target.sprite.getBounds().x;
        let targetY = target.sprite.getBounds().y;
        let entityX = entity.sprite.getBounds().x;
        let entityY = entity.sprite.getBounds().y;

        if (entityX < targetX) {
            directionX = 1;
        } else {
            directionX = -1;
        }
        if (entityY < targetY) {
            directionY = 1;
        } else {
            directionY = -1;
        }

        this.graphics3.lineBetween(entityX, entityY,
            targetX, targetY);
        this.graphics3.strokePath();

        // Normalize the direction
        const distance = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / distance;
        const normalizedDirectionY = directionY / distance;

        const vel = 150;
        // Call moveTo to tween towards the desired position
        entity.moveTo(normalizedDirectionX * vel, normalizedDirectionY * vel);
    }

    updateController(time, delta) {
        if (this.spaceBar.isDown) {
            this.playerInstance.punch();
        }
        if (this.eKey.isDown) {
            this.makeDude('baddy');
        }
        if (this.qKey.isDown) {
            this.makeDude('buddy');
        }

        ////////////////////////////
        if (this.playerInstance.isMoving || this.player.anims.currentAnim && this.player.anims.currentAnim.key.startsWith('punch') && this.player.anims.isPlaying) {
            return; // If punch animation is playing, skip movement code
        }
        //Update Player Controller

        let keyUsed = false;
        const cursorKeys = this.input.keyboard.createCursorKeys();
        const wasdKeys = this.input.keyboard.addKeys('W,S,A,D');

        let x = 0;
        let y = 0;

        // Determine direction based on keys pressed
        if (cursorKeys.left.isDown || wasdKeys.A.isDown) x -= 1;
        if (cursorKeys.right.isDown || wasdKeys.D.isDown) x += 1;
        if (cursorKeys.up.isDown || wasdKeys.W.isDown) y -= 1;
        if (cursorKeys.down.isDown || wasdKeys.S.isDown) y += 1;

        // Check joystick state if no keyboard input is detected
        if (x === 0 && y === 0) {
            let direction = '';
            for (let key in this.cursorKeys) {
                if (this.cursorKeys[key].isDown) {
                    direction += key;
                }
            }
            this.lastCursorDirection = direction;

            switch (direction) {
                case "left":
                    x = -1;
                    break;
                case "right":
                    x = 1;
                    break;
                case "up":
                    y = -1;
                    break;
                case "down":
                    y = 1;
                    break;
                case "upleft":
                    x = -1;
                    y = -1;
                    break;
                case "upright":
                    x = 1;
                    y = -1;
                    break;
                case "downleft":
                    x = -1;
                    y = 1;
                    break;
                case "downright":
                    x = 1;
                    y = 1;
                    break;
            }
        }
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            let length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        if (x !== 0 || y !== 0) {
            x *= 50;
            y *= 50;
            this.playerInstance.moveTo(x, y);
        } else {
            this.playerInstance.velocity.x = 0;
            this.playerInstance.velocity.y = 0;
            this.playerInstance.stopPlayerAnimations();
        }

        //Camera stuff
        const controlConfig = {
            camera: this.cameras.main,
            left: cursorKeys.left,
            right: cursorKeys.right,
            up: cursorKeys.up,
            down: cursorKeys.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.controls.update(delta);
    }

    createVirtualJoystick() {
        this.joyStick = this.plugins.get('rex-virtual-joystick-plugin"').add(
            this,
            Object.assign({}, this.joystickConfig, {
                radius: 32,
                base: this.add.image(0, 0, 'base').setDisplaySize(110, 110),
                thumb: this.add.image(0, 0, 'thumb').setDisplaySize(48, 48)
            })
        )
        this.cursorKeys = this.joyStick.createCursorKeys();

        // Listener event to reposition virtual joystick
        // whatever place you click in game area
        this.input.on('pointerdown', pointer => {
            this.joyStick.x = pointer.x;
            this.joyStick.y = pointer.y;
            this.joyStick.base.x = pointer.x;
            this.joyStick.base.y = pointer.y;
            this.joyStick.thumb.x = pointer.x;
            this.joyStick.thumb.y = pointer.y;
        });

        // Listener event to return virtual 
        // joystick to its original position
        this.input.on('pointerup', pointer => {
            this.joyStick.x = this.staticXJsPos;
            this.joyStick.y = this.staticYJsPos;
            this.joyStick.base.x = this.staticXJsPos;
            this.joyStick.base.y = this.staticYJsPos;
            this.joyStick.thumb.x = this.staticXJsPos;
            this.joyStick.thumb.y = this.staticYJsPos;
            this.lastCursorDirection = "center";
            //   this.setCursorDebugInfo();
        });
    }

    setCursorDebugInfo() {
        const force = Math.floor(this.joyStick.force * 100) / 100;
        const angle = Math.floor(this.joyStick.angle * 100) / 100;
        let text = `Direction: ${this.lastCursorDirection}\n`;
        text += `Force: ${force}\n`;
        text += `Angle: ${angle}\n`;
        text += `FPS: ${this.sys.game.loop.actualFps}\n`;
        // this.cursorDebugText.setText(text);
    }
}
