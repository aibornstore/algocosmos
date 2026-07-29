// ALGOKOSMOS Engine — Camera System
// Pattern from: ninja-vs-evilcorp (js13k) — smooth follow

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 5;
        this.bounds = null; // { minX, minY, maxX, maxY }
    }

    follow(target, dt) {
        this.targetX = target.x;
        this.targetY = target.y;
        this.x += (this.targetX - this.x) * this.smoothing * dt;
        this.y += (this.targetY - this.y) * this.smoothing * dt;

        if (this.bounds) {
            this.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.x));
            this.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.y));
        }
    }

    setBounds(minX, minY, maxX, maxY) {
        this.bounds = { minX, minY, maxX, maxY };
    }

    apply(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }

    restore(ctx) {
        ctx.restore();
    }

    worldToScreen(wx, wy) {
        return { x: wx - this.x, y: wy - this.y };
    }

    screenToWorld(sx, sy) {
        return { x: sx + this.x, y: sy + this.y };
    }
}
