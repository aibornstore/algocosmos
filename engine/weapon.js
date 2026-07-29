// ALGOKOSMOS Engine — Weapon System
// Pattern from: Q1K3 (js13k) — weapon with cooldown and bullet types

export class Weapon {
    constructor(config) {
        this.name = config.name || 'Pistol';
        this.damage = config.damage || 10;
        this.cooldown = config.cooldown || 0.2;
        this.bulletSpeed = config.bulletSpeed || 8;
        this.bulletLife = config.bulletLife || 1.5;
        this.spread = config.spread || 0;
        this.bullets = config.bullets || 1;
        this.cd = 0;
        this.ammo = config.ammo || Infinity;
        this.maxAmmo = config.ammo || Infinity;
    }

    update(dt) {
        this.cd = Math.max(0, this.cd - dt);
    }

    shoot(x, y, angle) {
        if (this.cd > 0 || this.ammo <= 0) return [];
        this.cd = this.cooldown;
        if (this.ammo !== Infinity) this.ammo--;

        const result = [];
        for (let i = 0; i < this.bullets; i++) {
            const a = angle + (Math.random() - 0.5) * this.spread;
            result.push({
                x, y,
                vx: Math.cos(a) * this.bulletSpeed,
                vy: Math.sin(a) * this.bulletSpeed,
                damage: this.damage,
                life: this.bulletLife,
                owner: 'player'
            });
        }
        return result;
    }

    reload() {
        this.ammo = this.maxAmmo;
    }
}

// Preset weapons
export const WEAPONS = {
    pistol: new Weapon({ name: 'Pistol', damage: 10, cooldown: 0.2, bulletSpeed: 8, ammo: 12 }),
    rifle: new Weapon({ name: 'Rifle', damage: 15, cooldown: 0.1, bulletSpeed: 10, ammo: 30 }),
    shotgun: new Weapon({ name: 'Shotgun', damage: 8, cooldown: 0.5, bulletSpeed: 7, bullets: 5, spread: 0.3, ammo: 8 }),
    smg: new Weapon({ name: 'SMG', damage: 8, cooldown: 0.05, bulletSpeed: 9, ammo: 50 }),
    sniper: new Weapon({ name: 'Sniper', damage: 50, cooldown: 1.0, bulletSpeed: 15, ammo: 5 }),
};
