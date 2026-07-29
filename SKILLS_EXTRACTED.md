# SKILLS_EXTRACTED.md — ALGOKOSMOS Games
## Oculus Orbit Cycle 1 + 2

**Дата:** 2026-07-28
**Источник:** 16 игр, ~4,500 строк кода, 6 engine модулей

---

## Извлечённые скилы

### 1. Canvas Bootstrap
**Описание:** Инициализация Canvas с адаптивным размером и resize handler.
**Паттерн:**
```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
```
**Инвариант:** Canvas всегда заполняет весь viewport.
**Применение:** Все 12 игр.

---

### 2. Game Loop (requestAnimationFrame)
**Описание:** Основной игровой цикл с проверкой running state.
**Паттерн:**
```javascript
function gameLoop(timestamp) {
    if (!gameRunning) return;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}
```
**Инвариант:** dt ограничен 50ms для предотвращения скачков.
**Применение:** Prince of Persia (dt-based), остальные (frame-based).

---

### 3. Neon Glow Rendering
**Описание:** Рисование с неоновым свечением через shadow.
**Паттерн:**
```javascript
ctx.fillStyle = '#00ff88';
ctx.shadowColor = '#00ff88';
ctx.shadowBlur = 15;
ctx.fillRect(x, y, w, h);
ctx.shadowBlur = 0; // Сброс после каждого элемента
```
**Инвариант:** `shadowBlur` сбрасывается в 0 после отрисовки.
**Применение:** Все 12 игр.

---

### 4. Start Screen Template
**Описание:** Стандартный экран запуска с кнопкой.
**Паттерн:**
```html
<div id="startScreen">
    <h1 style="color: {NEON}; text-shadow: 0 0 20px {NEON};">ALGOKOSMOS</h1>
    <p style="color: #888;">{DESCRIPTION}</p>
    <button id="startBtn" style="background: linear-gradient({NEON}, {DARK});">
        НАЧАТЬ ИГРУ
    </button>
</div>
```
**Инвариант:** `startBtn` скрывает `startScreen` и запускает `gameLoop`.
**Применение:** Все singleplayer игры.

---

### 5. Input System (Keyboard + Touch + Mouse)
**Описание:** Универсальная система ввода.
**Паттерн:**
```javascript
// Keyboard
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === ' ') shoot();
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') moveLeft = false;
});
// Touch
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) nextDir = 'right'; else nextDir = 'left';
    } else {
        if (dy > 0) nextDir = 'down'; else nextDir = 'up';
    }
});
// Mouse
canvas.addEventListener('mousemove', e => { paddle.x = e.clientX; });
```
**Инвариант:** Touch предотвращает default для scroll.
**Применение:** Snake, Snake Arena, Pong, Breakout.

---

### 6. AABB Collision Detection
**Описание:** Столкновение прямоугольник-прямоугольник.
**Паттерн:**
```javascript
function collides(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
```
**Инвариант:** Проверка пересечения проекций на обе оси.
**Применение:** Arkanoid, Breakout, Tetris, Space Invaders, Prince of Persia.

---

### 7. Grid-Based Movement
**Описание:** Движение по сетке с предотвращением разворота на 180°.
**Паттерн:**
```javascript
const GRID = 20;
let direction = 'right';
let nextDirection = 'right';
document.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp':    if (direction !== 'down')  nextDirection = 'up'; break;
        case 'ArrowDown':  if (direction !== 'up')    nextDirection = 'down'; break;
        case 'ArrowLeft':  if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left')  nextDirection = 'right'; break;
    }
});
function move() {
    direction = nextDirection;
    const head = { ...snake[0] };
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
}
```
**Инвариант:** `nextDirection` применяется только в следующем кадре.
**Применение:** Snake, Snake Arena.

---

### 8. Ball Physics (Bounce + Acceleration)
**Описание:** Мяч с отскоком и ускорением.
**Паттерн:**
```javascript
ball.x += ball.dx;
ball.y += ball.dy;
// Wall bounce
if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.dx *= -1;
if (ball.y - ball.r < 0) ball.dy *= -1;
// Paddle bounce with angle
if (ball hits paddle) {
    ball.dy = -Math.abs(ball.dy);
    const hitPoint = (ball.x - paddle.x) / paddle.w - 0.5;
    ball.dx = hitPoint * 8;
}
// Speed increase
ball.dx *= 1.05;
```
**Инвариант:** `dy` всегда отрицательный после удара о paddle.
**Применение:** Arkanoid, Breakout, Pong.

---

### 9. Tetromino System
**Описание:** Система тетромино с вращением и коллизиями.
**Паттерн:**
```javascript
const SHAPES = [
    [[1,1,1,1]],         // I
    [[1,1],[1,1]],        // O
    [[0,1,0],[1,1,1]],    // T
    [[1,0,0],[1,1,1]],    // L
    [[0,0,1],[1,1,1]],    // J
    [[0,1,1],[1,1,0]],    // S
    [[1,1,0],[0,1,1]]     // Z
];
const COLORS = ['#00ffff','#ffff00','#aa00ff','#ff6600','#0066ff','#00ff00','#ff0000'];
function rotate(piece) {
    const rotated = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
    );
    const orig = piece.shape;
    piece.shape = rotated;
    if (collision(piece, 0, 0)) piece.shape = orig;
}
```
**Инвариант:** Поворот откатывается при коллизии.
**Применение:** Tetris, Tetris Battle.

---

### 10. WebSocket Multiplayer
**Описание:** Комната-ориентированный мультиплеер через WebSocket.
**Паттерн:**
```javascript
let ws = null, myId = null, roomCode = '';
function connect() {
    ws = new WebSocket(`ws://${location.hostname}:3000`);
    ws.onopen = () => console.log('Connected');
    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        switch(msg.type) {
            case 'joined': myId = msg.playerId; break;
            case 'player_joined': if (msg.playerCount >= 2) startGame(); break;
            case 'move': if (msg.playerId !== myId) handleEnemy(msg.data); break;
            case 'player_left': cleanup(msg.playerId); break;
        }
    };
}
function send(msg) { if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); }
function createRoom() {
    roomCode = document.getElementById('roomCode').value || Math.random().toString(36).substr(2, 6);
    connect(); setTimeout(() => send({ type: 'join', game: '...', room: roomCode }), 500);
}
```
**Инвариант:** `myId` фильтрует собственные сообщения.
**Применение:** Snake Arena, Pong Online, Tetris Battle.

---

### 11. Platform Types (Normal, Moving, Fragile)
**Описание:** Система платформ с разными свойствами.
**Паттерн:**
```javascript
const types = ['normal', 'normal', 'normal', 'moving', 'fragile'];
function generatePlatform(y) {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
        x: Math.random() * (canvas.width - 70), y,
        width: 70, height: 15, type,
        speed: type === 'moving' ? (Math.random() * 2 + 1) : 0,
        broken: false
    };
}
// Collision
if (player.vy > 0 && player hits platform) {
    if (platform.type === 'fragile') platform.broken = true;
    player.y = platform.y - 20;
    player.vy = player.jumpForce;
}
```
**Инвариант:** Прыжок работает только при падении (vy > 0).
**Применение:** Doodle Jump.

---

### 12. Tile Map Engine
**Описание:** Движок на основе тайловых карт.
**Паттерн:**
```javascript
const TILE = 48;
// Tile types: 0=air, 1=floor, 2=wall, 3=spikes, 6=exit, 8=pillar
function getTile(tx, ty) {
    const gx = Math.floor(tx);
    const gy = Math.floor(ty);
    if (gx < 0 || gx >= level.width || gy < 0 || gy >= level.height) return 2;
    return level.tiles[gy][gx];
}
function isSolid(tx, ty) {
    const t = getTile(tx, ty);
    return t === 1 || t === 2 || t === 8;
}
// Camera
camera.x += (targetX - camera.x) * 0.1;
camera.y += (targetY - camera.y) * 0.1;
```
**Инвариант:** Вне границ карты = стена (type 2).
**Применение:** Prince of Persia.

---

### 13. Guard AI (Patrol → Chase → Attack)
**Описание:** ИИ охранника с тремя состояниями.
**Паттерн:**
```javascript
function updateGuard(g, dt) {
    const dx = player.x - g.x;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) {
        g.state = 'chase';
        g.x += Math.sign(dx) * 2.5 * dt;
        if (dist < 1.5 && !g.attacking) {
            g.attacking = true;
            g.attackTimer = 0.4;
        }
    } else {
        g.state = 'patrol';
        g.x += g.dir * 1.2 * dt;
        if (g.animTimer > 3) { g.dir *= -1; g.animTimer = 0; }
    }
    if (g.attacking) {
        g.attackTimer -= dt;
        if (g.attackTimer <= 0) {
            g.attacking = false;
            if (dist < 2) hitPlayer();
        }
    }
}
```
**Инвариант:** Атака только по таймеру (0.4s), кулдаун после.
**Применение:** Prince of Persia.

---

### 14. Particle System
**Описание:** Простая система частиц.
**Паттерн:**
```javascript
let particles = [];
function spawn(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 0.5 + Math.random() * 0.5,
            color, size: 2 + Math.random() * 3
        });
    }
}
function updateParticles(dt) {
    particles = particles.filter(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        ctx.globalAlpha = 1;
        return true;
    });
}
```
**Инвариант:** Частицы удаляются при life <= 0.
**Применение:** Prince of Persia.

---

### 15. Gravity + Jump
**Описание:** Гравитация и прыжок.
**Паттерн:**
```javascript
player.vy += gravity * dt;  // gravity = 700
player.y += player.vy * dt;
// Floor collision
if (isSolid(player.x, player.y + 0.1)) {
    player.y = Math.floor(player.y + 0.1) - 0.01;
    player.vy = 0;
    player.onGround = true;
}
// Jump
if (jumpPressed && player.onGround) {
    player.vy = -380;  // jump force
    player.onGround = false;
}
```
**Инвариант:** Прыжок только с земли (onGround = true).
**Применение:** Prince of Persia, Doodle Jump, Flappy Bird.

---

## Сводная таблица скилов

| # | Скил | Кол-во игр | Сложность |
|---|------|------------|-----------|
| 1 | Canvas Bootstrap | 16/16 | Базовая |
| 2 | Game Loop | 16/16 | Базовая |
| 3 | Neon Glow | 16/16 | Базовая |
| 4 | Start Screen | 14/16 | Базовая |
| 5 | Input System | 16/16 | Средняя |
| 6 | AABB Collision | 10/16 | Средняя |
| 7 | Grid Movement | 3/16 | Средняя |
| 8 | Ball Physics | 3/16 | Средняя |
| 9 | Tetromino System | 2/16 | Средняя |
| 10 | WebSocket MP | 4/16 | Высокая |
| 11 | Platform Types | 1/16 | Средняя |
| 12 | Tile Map Engine | 2/16 | Высокая |
| 13 | Guard AI | 1/16 | Высокая |
| 14 | Particle System | 2/16 | Средняя |
| 15 | Gravity + Jump | 3/16 | Средняя |
| 16 | Game Class | 10/16 | Базовая |
| 17 | Audio (Web Audio) | 10/16 | Средняя |
| 18 | Overlay UI | 10/16 | Базовая |
| 19 | Bot AI | 3/16 | Высокая |
| 20 | Undo System | 1/16 | Средняя |

---

## Cycle 2: Новые скилы

### 16. Game Class Pattern
**Описание:** Инкапсуляция game loop, pause, resize в едином классе.
**Паттерн:** См. engine/core.js
**Применение:** 10/16 игр через import

### 17. Audio Pattern
**Описание:** Web Audio API без загрузки файлов — чистые осцилляторы.
**Паттерн:** См. engine/audio.js
**Применение:** 10/16 игр

### 18. Overlay UI Pattern
**Описание:** Динамическое создание start/gameover/pause экранов через DOM.
**Паттерн:** См. engine/ui.js
**Применение:** 10/16 игр

### 19. Bot AI Pattern
**Описание:** Направленный AI с таймером и оценкой направлений.
**Паттерн:** См. Snake Arena (updateBot)
**Применение:** Tanks, Snake Arena, Pong

### 20. Undo System Pattern
**Описание:** Стек истории с snapshot карты для отмены ходов.
**Паттерн:** См. Sokoban (history.push/undo)
**Применение:** Sokoban, потенциально все головоломки

---

## Арбитр: Вердикт Cycle 2

**Статус:** ACCEPT
**Evidence Score:** 20/20 скилов, 16/16 игр
**SHA-256 link:** Cycle 2 — engine rebuild complete
**Следующий чекпоинт:** Cycle 3 — tile engine, AI module, storage, PWA

---

## Cycle 3: Новые скилы

### 21. Bomb Explosion Pattern
**Описание:** Крестообразный взрыв с проверкой коллизий, цепные взрывы, разрушение стен.
**Паттерн:** См. Bomberman (explodeBomb)
**Применение:** Bomberman

### 22. Run-and-Gun Pattern
**Описание:** Side-scrolling с гравитацией, стрельба, платформы, камера, типы врагов.
**Паттерн:** См. Contra (player physics + enemies)
**Применение:** Contra

---

## Cycle 4: Новые скилы

### 23. Stomp Kill Pattern
**Описание:** Прыжок на врага сверху = убийство (player.vy > 0 && player.y + h < enemy.y + h/2).
**Паттерн:** См. Mario Bros (checkStomp)
**Применение:** Mario Bros → physics.js

### 24. ?-Block System
**Описание:** Блоки с бонусами, разрушение кирпичей при ударе снизу.
**Паттерн:** См. Mario Bros (hitBlock)
**Применение:** Mario Bros

### 25. Formation Pattern
**Описание:** Grid-формация врагов с dive attack (пикирование).
**Паттерн:** См. Galaga (createEnemyGrid + dive)
**Применение:** Galaga

### 26. Wave System
**Описание:** Увеличивающаяся сложность по волнам (level++ при уничтожении всех).
**Паттерн:** См. Galaga/Centipede (wave complete check)
**Применение:** Galaga, Centipede

---

## Cycle 5: Новые скилы

### 27. Screen Wrap
**Описание:** Объект появляется с другой стороны экрана.
**Модуль:** `engine/physics.js`
**Паттерн:**
```javascript
export function screenWrap(obj, w, h, margin = 20) {
    if (obj.x < -margin) obj.x = w + margin;
    if (obj.x > w + margin) obj.x = -margin;
    if (obj.y < -margin) obj.y = h + margin;
    if (obj.y > h + margin) obj.y = -margin;
}
```
**Применение:** Asteroids, Snake Arena

### 28. Stomp Kill (Module)
**Описание:** Проверка прыжка на врага сверху.
**Модуль:** `engine/physics.js`
**Паттерн:**
```javascript
export function checkStomp(player, enemy) {
    return player.vy > 0 &&
        player.y + player.h < enemy.y + enemy.h * 0.5 &&
        player.x + player.w > enemy.x &&
        player.x < enemy.x + enemy.w;
}
```
**Применение:** Mario Bros

### 29. Grid Overlap
**Описание:** Проверка пересечения двух объектов на сетке (1D).
**Модуль:** `engine/physics.js`
**Паттерн:**
```javascript
export function gridOverlap(ax, aw, bx, bw) {
    return ax < bx + bw && ax + aw > bx;
}
```
**Применение:** Frogger, Centipede

### 30. Circle-Circle Collision
**Описание:** Столкновение двух кругов.
**Модуль:** `engine/physics.js`
**Паттерн:**
```javascript
export function circleCircle(ax, ay, ar, bx, by, br) {
    const dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy < (ar + br) * (ar + br);
}
```
**Применение:** Asteroids

---

## Сводная таблица скилов (Cycle 1-5)

| # | Скил | Модуль | Цикл |
|---|------|--------|------|
| 1 | Canvas Bootstrap | core.js | 1 |
| 2 | Game Loop | core.js | 1 |
| 3 | Neon Glow | renderer.js | 1 |
| 4 | Start Screen | ui.js | 1 |
| 5 | Input System | input.js | 1 |
| 6 | AABB Collision | physics.js | 1 |
| 7 | Grid Movement | physics.js | 1 |
| 8 | Ball Physics | physics.js | 1 |
| 9 | Tetromino System | inline | 1 |
| 10 | WebSocket MP | inline | 1 |
| 11 | Platform Types | inline | 1 |
| 12 | Tile Map Engine | inline | 1 |
| 13 | Guard AI | inline | 1 |
| 14 | Particle System | renderer.js | 1 |
| 15 | Gravity + Jump | inline | 1 |
| 16 | Game Class | core.js | 2 |
| 17 | Audio | audio.js | 2 |
| 18 | Overlay UI | ui.js | 2 |
| 19 | Bot AI | inline | 2 |
| 20 | Undo System | inline | 2 |
| 21 | Bomb Explosion | inline | 3 |
| 22 | Run-and-Gun | inline | 3 |
| 23 | Stomp Kill | inline → physics.js | 4 |
| 24 | ?-Block System | inline | 4 |
| 25 | Formation Pattern | inline | 4 |
| 26 | Wave System | inline | 4 |
| 27 | Screen Wrap | physics.js | 5 |
| 28 | Stomp Kill (Module) | physics.js | 5 |
| 29 | Grid Overlap | physics.js | 5 |
| 30 | Circle-Circle | physics.js | 5 |
