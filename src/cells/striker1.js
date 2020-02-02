const Cell = require("./Cell");

class Virus extends Cell {
    /**
     * @param {World} world
     * @param {number} x
     * @param {number} y
     */
    constructor(world, x, y) {
        const size = 54.77;
        super(world, x, y, size, 0xeeff00);

        this.fedTimes = 0;
        this.splitAngle = NaN;
    }

    get type() { return 2; }
    get isSpiked() { return true; }
    get isAgitated() { return false; }
    get avoidWhenSpawning() { return true; }

    /**
     * @param {Cell} other
     * @returns {CellEatResult}
     */
    getEatResult(other) {
        if (other.type === 3) return this.getEjectedEatResult(true);
        if (other.type === 4) return 3;
        return 0;
    }
    /**
     * @param {boolean} isSelf
     * @returns {CellEatResult}
     */
    getEjectedEatResult(isSelf) {
        return this.world.strikerCount >= 40 ? 0 : isSelf ? 2 : 3;
    }

    onSpawned() {
        this.world.strikerCount++;
    }

    /**
     * @param {Cell} cell
     */
     whenAte(cell) {
        const settings = this.world.settings;
        if (true) {
            const newD = this.boost.d + settings.virusPushBoost;
            this.boost.dx = (this.boost.dx * this.boost.d + cell.boost.dx * settings.virusPushBoost) / newD;
            this.boost.dy = (this.boost.dy * this.boost.d + cell.boost.dy * settings.virusPushBoost) / newD;
            this.boost.d = newD;
            this.world.setCellAsBoosting(this);
        } else {
            this.splitAngle = Math.atan2(cell.boost.dx, cell.boost.dy);
            if (++this.fedTimes >= settings.virusFeedTimes) {
                this.fedTimes = 0;
                this.size = settings.virusSize;
                this.world.splitVirus(this);
            } else super.whenAte(cell);
        }
    }

    /**
     * @param {Cell} cell
     */
    whenEatenBy(cell) {
        super.whenEatenBy(cell);
        if (cell.type === 0) this.world.removeCell(cell);
    }

    onRemoved() {
        this.world.strikerCount--;
    }
}

module.exports = Virus;

const World = require("../worlds/World");
