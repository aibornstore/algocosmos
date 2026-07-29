// ALGOKOSMOS Engine — Entity Component System
// Pattern from: Q1K3 (js13k) — Quake in 13KB

export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.w = 1;
        this.h = 1;
        this.hp = 1;
        this.maxHp = 1;
        this.alive = true;
        this.gravity = 1;
        this.onGround = false;
        this.facing = 1;
        this.type = 'entity';
        this.invTime = 0;
    }

    update(dt) {
        if (!this.alive) return;
        this.invTime = Math.max(0, this.invTime - dt);
        // Gravity
        this.ay += 600 * this.gravity;
        // Integrate velocity
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        // Integrate position
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
    }

    hit(damage) {
        if (this.invTime > 0) return;
        this.hp -= damage;
        if (this.hp <= 0) {
            this.alive = false;
            this.onDeath();
        }
    }

    onDeath() {}

    overlaps(other) {
        return this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y;
    }
}

export class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'player';
        this.hp = 100;
        this.maxHp = 100;
        this.speed = 200;
        this.jumpForce = -380;
        this.weapons = [];
        this.weaponIndex = 0;
        this.score = 0;
        this.kills = 0;
        this.lives = 3;
    }

    jump() {
        if (this.onGround) {
            this.vy = this.jumpForce;
            this.onGround = false;
        }
    }

    moveLeft(dt) { this.vx = -this.speed; this.facing = -1; }
    moveRight(dt) { this.vx = this.speed; this.facing = 1; }
    stop() { this.vx = 0; }

    shoot(angle) {
        const w = this.weapons[this.weaponIndex];
        if (!w) return null;
        return w.shoot(this.x + this.w / 2, this.y + this.h / 2, angle);
    }
}

export class Enemy extends Entity {
    constructor(x, y, type = 'grunt') {
        super(x, y);
        this.type = type;
        this.hp = type === 'grunt' ? 30 : type === 'heavy' ? 80 : 50;
        this.maxHp = this.hp;
        this.speed = type === 'grunt' ? 80 : type === 'heavy' ? 40 : 120;
        this.damage = type === 'grunt' ? 10 : type === 'heavy' ? 25 : 15;
        this.ai = 'patrol';
        this.aiTimer = 0;
        this.dir = Math.random() > 0.5 ? 1 : -1;
    }

    updateAI(dt, target) {
        if (!this.alive || !target || !target.alive) return;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.aiTimer -= dt;
        if (this.aiTimer <= 0) {
            if (dist < 300) this.ai = 'chase';
            else this.ai = 'patrol';
            this.aiTimer = 0.5 + Math.random();
        }

        if (this.ai === 'chase') {
            this.vx = Math.sign(dx) * this.speed;
            this.facing = Math.sign(dx);
        } else {
            this.vx = this.dir * this.speed * 0.5;
        }
    }
}
