# js13k Study — Анализ и пересборка

**Источник:** 5 репозиториев js13k игр
**Цель:** Извлечь паттерны, пересобрать в ALGOKOSMOS engine

---

## Скачанные репозитории

| Репозиторий | Размер JS | Описание |
|-------------|-----------|----------|
| LittleJS | 8,586 KB | Game engine (4.2k stars) |
| OS13k | 763 KB | Tiny OS + mini games |
| ninja-vs-evilcorp | 138 KB | Платформер (1st place 2020) |
| minipunk | 200 KB | 3D cyberpunk shooter |
| q1k3 | 77 KB | Quake-style FPS в 13KB! |

---

## Ключевые паттерны из Q1K3 (Quake в 13KB)

### 1. Entity System
```javascript
class entity_t {
    constructor(pos) {
        this.p = pos;           // position (vec3)
        this.v = vec3();        // velocity
        this.a = vec3();        // acceleration
        this.s = vec3(2,2,2);   // size
        this.f = 0;             // friction
        this._health = 50;
        this._gravity = 1;
        this._on_ground = 0;
    }
    _update_physics() {
        this.a.y = -1200 * this._gravity;
        // Integrate acceleration & friction
        this.v = vec3_add(this.v, vec3_sub(
            vec3_mulf(this.a, game_tick),
            vec3_mul(this.v, vec3(ff, 0, ff))
        ));
    }
}
```

### 2. Player with Mouse Look
```javascript
class entity_player_t extends entity_t {
    _init() {
        this._speed = 3000;
        this._step_height = 17;
        this._weapons = [new weapon_shotgun_t];
    }
    _update() {
        // Mouse look
        this._pitch = clamp(this._pitch + mouse_y * 0.00015, -1.5, 1.5);
        this._yaw = (this._yaw + mouse_x * 0.00015) % (Math.PI*2);
        // Movement relative to look direction
        this.a = vec3_rotate_y(
            vec3(keys[right]-keys[left], 0, keys[up]-keys[down]),
            this._yaw
        );
    }
}
```

### 3. WebGL Renderer
```javascript
let gl = c.getContext('webgl', {antialias: false});
// Vertex shader with rotation matrices
R_SOURCE_VS = 'precision highp float;' +
    'mat4 ry(float r){return mat4(cos(r),0,-sin(r),0,0,1,0,0,sin(r),0,cos(r),0,0,0,0,1);}' +
    // ...
```

### 4. Map System
```javascript
// Level data packed as string
// Collision via grid lookup
```

---

## Паттерны из minipunk (3D Voxel Game)

### 5. Voxel Engine
```javascript
let voxels = {
    buildBuffers() { /* ... */ },
    render() { /* ... */ }
};
```

### 6. Entity Types
```javascript
const ENTITY_TYPE_PLAYER = 0;
const ENTITY_TYPE_PUNK = 1;
const ENTITY_TYPE_SOLDIER = 2;
const ENTITY_TYPE_TURRET = 3;
```

### 7. Physics Constants
```javascript
let GRAVITY = 120;
let JUMP_SPEED = 30;
let DASH_SPEED = 180;
let HURT_DURATION = 0.5;
```

---

## Паттерны из ninja-vs-evilcorp (Platformer)

### 8. Camera with Smooth Follow
```javascript
camera.x += (player.x - camera.x) * 0.1;
camera.y += (player.y - camera.y) * 0.1;
```

### 9. Collision Response
```javascript
// Separate X and Y collision resolution
player.x += player.vx;
if (collides(player)) player.x -= player.vx;
player.y += player.vy;
if (collides(player)) player.y -= player.vy;
```

---

## Пересборка в ALGOKOSMOS Engine

### Новые модули для Cycle 6

**engine/entity.js** — Entity Component System
```javascript
export class Entity {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = 0; this.vy = 0;
        this.ax = 0; this.ay = 0;
        this.w = 1; this.h = 1;
        this.hp = 1; this.alive = true;
        this.gravity = 1;
        this.onGround = false;
    }
    update(dt) {
        this.ay += 600 * this.gravity; // gravity
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
}
```

**engine/camera.js** — Smooth Camera
```javascript
export class Camera {
    constructor() { this.x = 0; this.y = 0; }
    follow(target, dt) {
        this.x += (target.x - this.x) * 5 * dt;
        this.y += (target.y - this.y) * 5 * dt;
    }
}
```

**engine/weapon.js** — Weapon System
```javascript
export class Weapon {
    constructor(name, damage, cooldown, bulletSpeed) {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletSpeed = bulletSpeed;
        this.cd = 0;
    }
    shoot(x, y, angle) {
        if (this.cd > 0) return null;
        this.cd = this.cooldown;
        return { x, y, vx: Math.cos(angle)*this.bulletSpeed, vy: Math.sin(angle)*this.bulletSpeed };
    }
}
```

---

## Версия — Сравнение с предыдущими циклами

| Метрика | v1 | v2 | v3 | v4 | v5 | v6 |
|---------|----|----|----|----|----|-----|
| Игр | 12 | 16 | 18 | 20 | 23 | 23 |
| Engine модулей | 0 | 6 | 6 | 6 | 6 | 10 |
| Скилов | 15 | 20 | 22 | 26 | 30 | 40 |
| Макс. размер игры | 892 | 892 | 892 | 892 | 892 | 892 |
| js13k паттернов | 0 | 0 | 0 | 0 | 0 | 9 |

### Новые скилы из js13k (Cycle 6)

| # | Скил | Источник | Описание |
|---|------|----------|----------|
| 31 | Entity System | Q1K3 | ECS с position/velocity/acceleration |
| 32 | Mouse Look | Q1K3 | FPS camera control |
| 33 | Voxel Engine | minipunk | Объёмные миры |
| 34 | Camera Follow | ninja | Smooth camera tracking |
| 35 | Weapon System | Q1K3 | Оружие с кулдауном |
| 36 | Collision Separate X/Y | ninja | Раздельная коллизия по осям |
| 37 | Entity Types | minipunk | Система типов сущностей |
| 38 | Physics Constants | minipunk | Гравитация, скорость, сила |
| 39 | WebGL Shaders | Q1K3 | Custom vertex/fragment shaders |
| 40 | Code Golfing | js13k | Минимизация кода |
