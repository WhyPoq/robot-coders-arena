"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BotStats {
    constructor() {
        this.health = 0;
        this.strength = 0;
        this.dizzy = 0;
        this.reset();
    }
    reset() {
        this.health = 30;
        this.strength = 1;
        this.dizzy = 0;
    }
}
exports.default = BotStats;
//# sourceMappingURL=BotStats.js.map