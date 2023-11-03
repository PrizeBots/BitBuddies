export class Utils  {
    
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '0x';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getClosestSide(entity, target) {
        const distances = {
            left: Math.abs(entity.sprite.getBounds().x - target.bumpBox.getBounds().left),
            right: Math.abs(entity.sprite.getBounds().x - target.bumpBox.getBounds().right),
            top: Math.abs(entity.sprite.getBounds().y - target.bumpBox.getBounds().top),
            bottom: Math.abs(entity.sprite.getBounds().y - target.bumpBox.getBounds().bottom)
        };
        let minDistance = Infinity;
        let closestSide = '';
        for (const side in distances) {
            if (distances[side] < minDistance) {
                minDistance = distances[side];
                closestSide = side;
            }
        }
        return closestSide;
    }
};