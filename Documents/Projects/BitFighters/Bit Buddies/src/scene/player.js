import { StatusBar } from "./StatusBar";
import { PlayerActions } from "./PlayerActions";
export class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y, type) {
        super(scene);
        this.spriteKey = this.pickRandomSprite();
        this.playerSprite = this.scene.physics.add.sprite(x, y, this.spriteKey, 1);
        this.x = x;
        this.y = y;
        this.scene.physics.add.existing(this.playerSprite);
        this.playerSprite.setCollideWorldBounds(true);
        this.playerSprite.setBounce(1);
        this.spriteScale = 2;
        this.playerSprite.setScale(this.spriteScale);


        this.add(this.playerSprite);
        this.playerWidth = this.playerSprite.width * this.playerSprite.scaleX;
        this.playerHeight = this.playerSprite.height * this.playerSprite.scaleY;
        this.playerSprite.body.setSize(this.playerSprite.width / 2, this.playerSprite.height / 5);
        this.playerSprite.body.setOffset(
            this.playerSprite.body.offset.x,
            this.playerSprite.height - this.playerSprite.body.height
        );
        this.playerSprite.setFrame(1);
        this.walkFrames = [1, 2, 1, 3]

        this.createAnimations();
        // this.playerSprite.body.mass = 4;        // Double the mass
        // sprite.body.restitution = 1; // Full bounce

        //Attributes
        this.speed = 1;
        this.attack = 5;
        this.maxHealth = 100;
        this.maxStamina = 100;
        this.currentHealth = this.maxHealth;
        this.currentStamina = this.maxStamina;

        this.velocity = { x: 0, y: 0 };  // Velocity of 100 units/second to the right
        this.range = this.playerWidth / 2;
        //  const range = this.spriteScale * 15;
        //Properties
        this.type = type;
        this.isAlive = false;
        this.isAttacking = false;
        this.isColliding = false;
        this.isStalking = false;
        this.isIdle = false;
        this.isFacing = 'left';
        this.isMoving = false;
        this.canAttack = true;
        this.canMove = true;
        this.isHit = false;

        this.statusText = this.scene.add.text(0, 0, 'Player', {
            fontSize: '12px',
            fill: '#ffffff', // white 
            stroke: '#000000',
            strokeThickness: 4
        });

        this.add(this.statusText);

        // Create StatusBar
        this.statusBar = new StatusBar(scene, this.playerSprite);
        this.add(this.statusBar);

        this.hitBox = this.scene.physics.add.image(
            this.x,
            this.y,
        );
        // this.scene.physics.add.existing(this.hitBox);
        this.add(this.hitBox);
        this.hitBox.body.setSize(20, 20);
        // this.hitBox.setActive(true).setVisible(true);
        //  this.hitBox.setCollideWorldBounds(true);
        this.hitBox.setBounce(1);



        //     //Make Bumper
        //     this.bumper = this.scene.physics.add.sprite(
        //         this.x,
        //         this.y,
        //     );
        //     this.scene.physics.add.existing(this.bumper);
        //   // 
        //     this.bumper.body.setSize(this.playerSprite.width, 20);
        //     // this.bumper.setActive(true).setVisible(true);
        //     //this.bumper.setCollideWorldBounds(true);
        //     this.bumper.setBounce(1);
        //  //  this.bumper.setPushable(true);
        //     // this.bumper.setDrag(100);
        //   //  this.scene.bumpers.push(this.bumper);
        //     this.add(this.bumper);
        //Make Bumper
        this.hurtBox = this.scene.physics.add.sprite(
            this.x,
            this.y,
        );
        this.scene.physics.add.existing(this.hurtBox);
        this.hurtBox.body.setSize(this.playerSprite.width, this.playerSprite.height);
        // this.hurtBox.setBounce(1);

        this.add(this.hurtBox);

        this.init();
        scene.events.on('update', this.update, this);

    }

    update(time, delta) {
        if (!this.isAlive) return;
        const deltaSeconds = delta / 1000;  // Convert delta to seconds


        if (this.isAttacking && !this.playerSprite.anims.isPlaying) {
            this.isAttacking = false;
            this.updateStatusText("idle");
        }
        
        this.playerSprite.setVelocityX(this.velocity.x);
        this.playerSprite.setVelocityY(this.velocity.y);
        this.x = this.playerSprite.x
        this.y = this.playerSprite.y

        //  this.playerSprite.body.y = 50;

        // this.bumper.setVelocityX(this.velocity.x);
        // this.bumper.setVelocityY(this.velocity.y);
        // this.bumper.x = this.playerSprite.x;
        // this.bumper.y = this.playerSprite.y + this.playerHeight / 2;



        // this.bumper.setVelocityX(this.velocity.x);
        // this.bumper.setVelocityY(this.velocity.y);
        this.hurtBox.x = this.playerSprite.x;
        this.hurtBox.y = this.playerSprite.y;//+ this.playerHeight / 2;

        this.statusText.x = this.playerSprite.x - this.playerWidth / 2;
        this.statusText.y = this.playerSprite.y;

        this.hitBox.setVelocityX(this.velocity.x);
        this.hitBox.setVelocityY(this.velocity.y);

        //Hit Box
        let range = 20;
        this.hitBox.y = this.playerSprite.y - 7;
        if (this.playerSprite.flipX) {
            this.hitBox.x = this.x - this.playerSprite.width / 2 - range;
            this.isFacing = 'left';
        } else {
            this.hitBox.x = this.x + this.playerSprite.width / 2 + range;
            this.isFacing = 'right';
        }

        //Status Check
        // if(this.isHit || this.isAttacking){
        //     this.playerSprite.setVelocityX(0);
        //     this.playerSprite.setVelocityY(0);
        //     this.bumper.setVelocityX(0);
        //     this.bumper.setVelocityY(0);
        //     this.hitBox.setVelocityX(0);
        //     this.hitBox.setVelocityY(0);
        // }
        if (this.currentHealth <= 0) {
            this.playerSprite.setVelocityX(0);
            this.playerSprite.setVelocityY(0);
            this.hurtBox.setVelocityX(0);
            this.hurtBox.setVelocityY(0);
            this.hitBox.setVelocityX(0);
            this.hitBox.setVelocityY(0);
            this.die();

        }
        ///console.log(this.velocity.x)
    }

    init() {
        this.currentHealth = this.maxHealth;
        this.isAlive = true;
        this.visible = true;

        if (this.type === "buddy") {
            this.idle();
            // this.playerSprite.setTint(0x0000ff);
        } else if (this.type === "baddy") {
            this.idle();
            // this.playerSprite.setTint(0xff0000);
        } else if (this.type === "player") {
            this.x = this.scene.gameWidthMiddle;
            this.attack = 10;
            this.speed = 1;
            this.currentHealth = 100;
        }
        this.playerSprite.setInteractive();
        this.playerSprite.on('pointerdown', function (pointer) {
            //  click logic 
        });
    }

    pickRandomSprite() {
        let randomNum = Phaser.Math.Between(1, 109);
        return `buddy_${randomNum}`;
    }

    die() {
        if (!this.isAlive) return;
        this.isAlive = false;
        this.visible = false;
        this.scene.dropCoin(this.playerSprite.body.x, this.playerSprite.body.y);

        this.playerSprite.disableBody(true, true);
        this.playerSprite.body.x = 0;
        this.playerSprite.body.y = 0;

        this.hitBox.disableBody(true, true);
        this.hitBox.body.x = 0;
        this.hitBox.body.y = 0;

        this.hurtBox.disableBody(true, true);
        this.hurtBox.body.x = 0;
        this.hurtBox.body.y = 0;

        this.playerSprite.body.enable = false;
        this.playerSprite.setInteractive(false);
    }

    idle() {
        //if (this.isIdle) return;
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(500, 3000),
            callback: () => {
                //  if (this.isMoving) return;
                if (!this.isIdle) return;
                this.updateStatusText("wandering");
                const directions = ['left', 'right', 'up', 'down'];
                const randomDirection = Phaser.Utils.Array.GetRandom(directions);
                const varDistance = Phaser.Math.Between(30, 30);
                // Based on direction, adjust the buddy's position and play the animation
                switch (randomDirection) {
                    case 'left':
                        this.moveTo(-varDistance, 0);
                        break;
                    case 'right':
                        this.moveTo(varDistance, 0);
                        break;
                    case 'up':
                        this.moveTo(0, -varDistance);
                        break;
                    case 'down':
                        this.moveTo(0, varDistance);
                        break;
                }
            },
            loop: true
        });
    }

    moveTo(x, y) {
        if (!this.isAlive || !this.canMove) return;
        this.scene.tweens.killTweensOf(this.playerSprite);
        this.updateStatusText("move!");
        let animDirection = '';
        if (x < 0) { // Moving left
            animDirection = 'left';
            this.playerSprite.setFlipX(true);
        } else if (x > 0) { // Moving right
            animDirection = 'right';
            this.playerSprite.setFlipX(false);
        } else if (y < 0) { // Moving up
            animDirection = 'up';
        } else if (y > 0) { // Moving down
            animDirection = 'down';
        }


        this.velocity.x = x * this.speed;
        this.velocity.y = y * this.speed;

        const animKey = `walking-${animDirection}_${this.playerSprite.texture.key}`;

        // if (this.isMoving || this.isHit) return;
        this.isMoving = true;

        if (this.playerSprite && animDirection && this.scene.anims.exists(animKey)) {
            this.playerSprite.anims.play(animKey, true);
        }

        this.moveTween = this.playerSprite.on('animationcomplete', (anim, frame) => {
            if (anim.key === animKey) {
                this.isAttacking = false;
                this.updateStatusText("idle")
            }
        }, this);

        // If you still need to handle "stop" after a certain duration,
        // you can set a timer here that stops the sprite's movement and resets its animation
        const distanceToCover = Math.sqrt(x * x + y * y);
        const moveTime = distanceToCover / this.speed;
        this.scene.time.delayedCall(moveTime, () => {
            this.playerSprite.body.stop();
            //  this.updateStatusText("idle");
            this.isMoving = false;
            // this.playerSprite.setVelocityX(0);
            //this.playerSprite.setVelocityY(0);
            // Reset to idle frame or any other required actions
            // this.playerSprite.setFrame(1);
        }, [], this);
    }

    punch() {
        if (this.isAttacking) {

            return;
        }
        if (this.currentStamina > this.attack) {
            // if (this.moveTween) {Valu
            //     this.moveTween.stop();
            // }
            const punchAnimKey = `punch_${this.playerSprite.texture.key}`;
            if (this.scene.anims.exists(punchAnimKey)) {
                this.scene.tweens.killTweensOf(this.playerSprite);
                this.updateStatusText("PUNCHing")
                this.playerSprite.anims.play(punchAnimKey, true);
                this.isAttacking = true;
                this.playerSprite.setVelocityX(0);
                this.playerSprite.setVelocityY(0);

                this.punchTween = this.playerSprite.on('animationcomplete', (anim, frame) => {
                    if (anim.key === punchAnimKey) {
                        this.isAttacking = false;
                        this.updateStatusText("idle")
                    }
                }, this);
            }
        } else {
            return;
        }
    }

    updateStatusText(newText) {
        this.statusText.setText(newText);
    }

    takeDamage(attack, side) {
        // if (this.isHit) {
        //     this.isHit = false;
        //     return;
        // }
        //  console.log(attack, side)
        this.isHit = true;
        // if (this.moveTween) {
        //     this.moveTween.stop();
        // }

        this.statusBar.updateBars(this.currentHealth -= attack, this.currentStamina)
       // console.log(this.currentHealth)
        const animKey = `fDamage_${this.playerSprite.texture.key}`;
        if (this.scene.anims.exists(animKey)) {
            this.scene.tweens.killTweensOf(this.playerSprite);
            this.updateStatusText("OUCH");
            // this.playerSprite.setVelocityX(0);
            // this.playerSprite.setVelocityY(0);
            //this.canMove = false;
            this.playerSprite.anims.play(animKey, true);

            // if (this.moveTween) {
            //     this.moveTween.stop();
            // }
            this.hitTween = this.playerSprite.on('animationcomplete', (anim, frame) => {
                if (anim.key === animKey) {
                    this.isHit = false;
                    this.canMove = true;
                    this.updateStatusText("idle")
                }
            }, this);
        }
    }
    //     if (side === 'left') {
    //         animKey = `fDamage_${this.playerSprite.texture.key}`;
    //     } else {
    //         animKey = `bDamage_${this.playerSprite.texture.key}`;
    //     }

    //     this.playerSprite.anims.play(animKey, true);
    //     this.playerSprite.once('animationcomplete', (anim, frame) => {
    //         if (anim.key === animKey) {
    //             this.isHit = false;
    //             if (this.type === 'player') {
    //                 console.log("tried to punch animationcomplete")

    //             }
    //         }
    //     
    // takeDamage(side) {
    //     if (this.isHit) {
    //         return;
    //     } else {
    //         this.isHit = true;
    //     }
    //     // if (this.moveTween) {
    //     //     this.moveTween.stop();
    //     // }

    //     console.log(this.currentHealth, this.attackValue, this.currentHealth -= this.attackValue)
    //     this.statusBar.updateBars(this.currentHealth -= this.attackValue, this.currentStamina)

    //     this.scene.tweens.killTweensOf(this.playerSprite);
    //     this.updateStatusText("takeDamage!")
    //     let animKey = `fDamage_${this.playerSprite.texture.key}`;

    //     // Safety timer to ensure isHit gets reset even if animation doesn't complete

    //     if (side === 'left') {
    //         animKey = `fDamage_${this.playerSprite.texture.key}`;
    //     } else {
    //         animKey = `bDamage_${this.playerSprite.texture.key}`;
    //     }

    //     this.playerSprite.anims.play(animKey, true);
    //     this.playerSprite.once('animationcomplete', (anim, frame) => {
    //         if (anim.key === animKey) {
    //             this.isHit = false;
    //             if (this.type === 'player') {
    //                 console.log("tried to punch animationcomplete")

    //             }
    //         }
    //     }, this);
    // }

    createAnimations() {
        const directions = ['left', 'right', 'up', 'down'];

        for (let direction of directions) {
            const animKey = `walking-${direction}_${this.playerSprite.texture.key}`;
            if (!this.scene.anims.get(animKey)) {
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNames(this.playerSprite.texture.key, {
                        frames: this.walkFrames
                    }),
                    yoyo: true,
                    frameRate: 12,
                    repeat: -1
                });
            }
        }
        const punchAnimKey = `punch_${this.playerSprite.texture.key}`;
        if (!this.scene.anims.get(punchAnimKey)) {
            this.scene.anims.create({
                key: punchAnimKey, // A unique key based on buddy texture
                frames: this.scene.anims.generateFrameNames(this.playerSprite.texture.key, {
                    frames: [5, 5, 4, 4, 6, 6, 3, 3]
                }),
                frameRate: 24,
                repeat: 0

            });
        }
        const frontDamageAnim = `fDamage_${this.playerSprite.texture.key}`;
        if (!this.scene.anims.get(frontDamageAnim)) {
            this.scene.anims.create({
                key: frontDamageAnim, // A unique key based on buddy texture
                frames: this.scene.anims.generateFrameNames(this.playerSprite.texture.key, {
                    frames: [33, 34, 35]
                }),
                frameRate: 24,
                repeat: 0

            });
        }
        const backDamageAnim = `bDamage_${this.playerSprite.texture.key}`;
        if (!this.scene.anims.get(backDamageAnim)) {
            this.scene.anims.create({
                key: backDamageAnim, // A unique key based on buddy texture
                frames: this.scene.anims.generateFrameNames(this.playerSprite.texture.key, {
                    frames: [30, 30, 31, 31, 32, 32]
                }),
                frameRate: 24,
                repeat: 0

            });
        }

    }

    stopPlayerAnimations() {
        if (!this.playerSprite) return;
        this.playerSprite.anims.stop();

    }

    get sprite() {
        return this.playerSprite;
    }
}
