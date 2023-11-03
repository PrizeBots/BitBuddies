
export class PlayerActions {
    init() {
       // console.log("LOAD ACTIONS");
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

        // this.graphics3.lineBetween(entityX, entityY,
        //     targetX, targetY);
        // this.graphics3.strokePath();

        // Normalize the direction
        const distance = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / distance;
        const normalizedDirectionY = directionY / distance;

        // Call moveTo to tween towards the desired position
        let stalkVelocity = 100;
        entity.moveTo(normalizedDirectionX * stalkVelocity * entity.speed, normalizedDirectionY * stalkVelocity * entity.speed);
    }

    findClosestOpponent(entity, opponents) {
        let closestOpponent = null;
        let closestDistance = Infinity;

        entity.updateStatusText("TARGETING");

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



}