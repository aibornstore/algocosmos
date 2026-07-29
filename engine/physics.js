// ALGOKOSMOS Engine — Physics & Collision

export function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function circleRect(cx, cy, cr, rx, ry, rw, rh) {
    const nearX = Math.max(rx, Math.min(cx, rx + rw));
    const nearY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nearX;
    const dy = cy - nearY;
    return dx * dx + dy * dy < cr * cr;
}

export function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

export function distance(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
}

export class GridMovement {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    setDirection(dir) {
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (dir !== opposites[this.direction]) {
            this.nextDirection = dir;
        }
    }

    apply() {
        this.direction = this.nextDirection;
    }

    moveHead(head) {
        const h = { ...head };
        switch (this.direction) {
            case 'up': h.y--; break;
            case 'down': h.y++; break;
            case 'left': h.x--; break;
            case 'right': h.x++; break;
        }
        return h;
    }

    inBounds(x, y, cols, rows) {
        return x >= 0 && x < cols && y >= 0 && y < rows;
    }
}

export class BallPhysics {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.r = 8;
    }

    update(dt) {
        this.x += this.dx * dt * 60;
        this.y += this.dy * dt * 60;
    }

    bounceWalls(w, h) {
        if (this.x - this.r < 0) { this.x = this.r; this.dx = Math.abs(this.dx); }
        if (this.x + this.r > w) { this.x = w - this.r; this.dx = -Math.abs(this.dx); }
        if (this.y - this.r < 0) { this.y = this.r; this.dy = Math.abs(this.dy); }
    }

    bouncePaddle(paddle, paddleW, paddleH) {
        if (this.y + this.r > paddle.y &&
            this.y - this.r < paddle.y + paddleH &&
            this.x > paddle.x &&
            this.x < paddle.x + paddleW) {
            this.dy = -Math.abs(this.dy);
            const hit = (this.x - paddle.x) / paddleW - 0.5;
            this.dx = hit * 8;
        }
    }

    isBelow(h) {
        return this.y - this.r > h;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.dy = -4;
    }
}

// SKILL: Screen wrap (Cycle 5 — Asteroids)
export function screenWrap(obj, w, h, margin = 20) {
    if (obj.x < -margin) obj.x = w + margin;
    if (obj.x > w + margin) obj.x = -margin;
    if (obj.y < -margin) obj.y = h + margin;
    if (obj.y > h + margin) obj.y = -margin;
}

// SKILL: Stomp kill (Cycle 4 — Mario)
export function checkStomp(player, enemy) {
    return player.vy > 0 &&
        player.y + player.h < enemy.y + enemy.h * 0.5 &&
        player.x + player.w > enemy.x &&
        player.x < enemy.x + enemy.w;
}

// SKILL: Grid-based obstacle check (Cycle 5 — Frogger)
export function gridOverlap(ax, aw, bx, bw) {
    return ax < bx + bw && ax + aw > bx;
}

// SKILL: Circle-circle collision (Cycle 5 — Asteroids)
export function circleCircle(ax, ay, ar, bx, by, br) {
    const dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy < (ar + br) * (ar + br);
}
