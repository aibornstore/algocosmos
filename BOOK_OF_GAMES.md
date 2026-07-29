# КНИГА ИГР ALGOKOSMOS
## Oculus Orbit Cycle 6

**Дата:** 2026-07-28
**Всего игр:** 24
**js13k изучено:** 5 репозиториев
**Движок:** Shared Engine (Canvas 2D + vanilla JS)
**Бренд:** ALGOKOSMOS.COM

---

## Оглавление

| # | Глава | Жанр | Тип | Строк кода |
|---|-------|------|-----|------------|
| 1 | Snake | Аркада | Singleplayer | 274 |
| 2 | Arkanoid | Аркада | Singleplayer | 320 |
| 3 | Breakout | Аркада | Singleplayer | 87 |
| 4 | Tetris | Пазл | Singleplayer | 410 |
| 5 | Pong | Спорт | Local 2P | 96 |
| 6 | Space Invaders | Шутер | Singleplayer | 414 |
| 7 | Flappy Bird | Аркада | Singleplayer | 116 |
| 8 | Doodle Jump | Платформер | Singleplayer | 393 |
| 9 | Snake Arena | Аркада | Multiplayer 20+ | 221 |
| 10 | Pong Online | Спорт | Multiplayer 1v1 | 169 |
| 11 | Tetris Battle | Пазл | Multiplayer 1v1 | 313 |
| 12 | Prince of Persia | Платформер-экшн | Singleplayer | 892 |
| 13 | Pac-Man | Лабиринт | Singleplayer | ~350 |
| 14 | Tanks | Battle City | Multiplayer 2-8 | ~400 |

**Общий объём:** ~4,455 строк кода

---

## Глава 1: Snake

**Жанр:** Аркада
**Управление:** Стрелки / WASD / Свайп
**Механика:** Змейка растёт при поедании, ускорение, столкновение со стеной = конец.

**Паттерны:**
- Grid-based движение (gridSize = 20)
- Direction queue (nextDirection предотвращает разворот на 180°)
- Touch control через dx/dy свайпа
- Ускорение: `gameSpeed -= 2` при каждом фрукте

**Инварианты:**
- Змейка не может развернуться на 180°
- Голова не может выйти за пределы canvas
- Сегменты не могут пересекаться

---

## Глава 2: Arkanoid

**Жанр:** Аркада
**Управление:** Мышь / Тач / Стрелки
**Механика:** Мяч отскакивает от платформы, разбивает кирпичи, уровни.

**Паттерны:**
- Ball-paddle collision с учётом точки удара (`hitPoint * 5`)
- Brick grid с цветовыми рядами
- Level-up при уничтожении всех кирпичей
- Gradient background

**Инварианты:**
- Мяч не может пройти через paddle
- Кирпичи уничтожаются только при столкновении
- Жизнь теряется при падении мяча вниз

---

## Глава 3: Breakout

**Жанр:** Аркада
**Управление:** Мышь / Тач
**Механика:** Упрощённый Arkanoid, адаптивная ширина кирпичей.

**Паттерны:**
- Адаптивный размер кирпичей: `(canvas.width - 40) / BRICK_COLS - PAD`
- Управление только мышью/тачем
- Кирпичи пересоздаются при победе

---

## Глава 4: Tetris

**Жанр:** Пазл
**Управление:** Стрелки / WASD / Пробел (hard drop)
**Механика:** 7 тетромино, вращение, линии, уровни.

**Паттерны:**
- Tetromino shapes как 2D массивы
- Wall-kick: `collision()` проверяет поворот
- Hard drop: `while (!collision) y++; score += 2`
- Next piece preview на отдельном canvas
- Level speed: `Math.max(100, 1000 - (level-1) * 100)`

**Инварианты:**
- Фигура не может выйти за границы поля
- Фигура не может наложиться на заполненные клетки
- Линия очищается только при полном заполнении

---

## Глава 5: Pong

**Жанр:** Спорт (дуэль)
**Управление:** W/S (игрок 1), ↑↓ (игрок 2)
**Механика:** Мяч ускоряется при отскоке, AI для 2-го игрока.

**Паттерны:**
- AI: `target = ball.y - paddleH/2; dy = (target - p.y) * 0.06`
- Ball speed increase: `dx *= -1.05` при каждом отскоке
- Win score: 7 очков
- Center line dash pattern

---

## Глава 6: Space Invaders

**Жанр:** Шутер
**Управление:** Стрелки / WASD + Пробел (выстрел)
**Механика:** Волны врагов, стрельба, жизни.

**Паттерны:**
- Enemy grid с типами (3 ряда, 3 типа)
- Random enemy shooting: `Math.random() < 0.02`
- Wave system: `enemySpeed = 1 + wave * 0.3`
- Star parallax background
- Ship shape через `beginPath/moveTo/lineTo`

---

## Глава 7: Flappy Bird

**Жанр:** Аркада
**Управление:** Пробел / ↑ / Тач / Клик
**Механика:** Птица летит через трубы, гравитация.

**Паттерны:**
- Gravity + jump: `vy += gravity; y += vy`
- Pipe generation с случайным зазором
- Bird rotation на основе velocity
- Ground scrolling animation
- Collision: прямоугольник-круг проверка

---

## Глава 8: Doodle Jump

**Жанр:** Платформер (бесконечный)
**Управление:** Стрелки / WASD / Тильт
**Механика:** Прыжки по платформам, бесконечный скролл.

**Паттерны:**
- Platform types: normal, moving, fragile
- Scroll system: когда игрок выше 1/3 экрана, платформы сдвигаются
- Infinite generation: `while (platforms.length < 10)`
- Horizontal wrap: `if (x < -20) x = canvas.width + 20`
- Device orientation: `player.velocityX = e.gamma / 5`
- Star twinkle animation

---

## Глава 9: Snake Arena

**Жанр:** Аркада (Multiplayer)
**Управление:** Стрелки / WASD / Свайп
**Механика:** Змейка в арене с другими игроками, поедание еды.

**Паттерны:**
- WebSocket multiplayer (ws://hostname:3000)
- Room system с кодами
- Enemy snake rendering с разными цветами
- Wall wrap (не collision)
- Leaderboard
- Color palette: `['#00ff88','#ff0066','#00ccff','#ffcc00','#aa00ff','#ff6600']`

---

## Глава 10: Pong Online

**Жанр:** Спорт (Online)
**Управление:** ↑↓ / W/S / Тач
**Механика:** Онлайн Pong 1v1 через WebSocket.

**Паттерны:**
- Host-authoritative: left player = host, считает мяч
- State sync: host отправляет ball position + score
- Room lobby с input для кода
- Side assignment: `mySide = msg.players.length === 1 ? 'left' : 'right'`

---

## Глава 11: Tetris Battle

**Жанр:** Пазл (Online)
**Управление:** Стрелки / WASD / Пробел
**Механика:** 1v1 Tetris с отправкой мусора.

**Паттерны:**
- Garbage system: `cleared >= 2 → send garbage lines`
- Dual board rendering (my + enemy)
- Score sync через WebSocket
- Garbage row: `Array(COLS).fill('#888')` с случайной дырой

---

## Глава 12: Prince of Persia

**Жанр:** Платформер-экшн
**Управление:** Стрелки / WASD + M (меч)
**Механика:** Tile-based уровни, охранники, ловушки, меч, таймер.

**Паттерны:**
- Tile map: 0=air, 1=floor, 2=wall, 3=spikes, 6=exit, 8=pillar
- Camera system: `camera.x += (target - camera.x) * 0.1`
- Guard AI: patrol → chase → attack (dist < 8)
- Invincibility frames после удара
- Sword pickup system
- Particle system
- Level progression
- 60-minute timer

---

## Общие паттерны (все игры)

### 1. Canvas Setup
```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();
```

### 2. Game Loop
```javascript
function gameLoop() {
    if (!gameRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
```

### 3. Start Screen
```html
<div id="startScreen">
    <h1>ALGOKOSMOS</h1>
    <p>Описание</p>
    <button id="startBtn">НАЧАТЬ ИГРУ</button>
</div>
```

### 4. UI Pattern
```html
<div id="ui">
    <div>Счёт: <span id="score">0</span></div>
    <div>Жизни: <span id="lives">3</span></div>
</div>
<div id="brand">ALGOKOSMOS.COM</div>
```

### 5. Controls Pattern
- Keyboard: `keydown/keyup` + `e.key` mapping
- Touch: `touchstart/touchend` + dx/dy calculation
- Mouse: `mousemove` for paddle position
- Tilt: `deviceorientation` for mobile

### 6. Collision Detection
- AABB: `rect1.x < rect2.x + rect2.w && ...`
- Circle-rect: distance check
- Grid-based: `Math.floor(x / gridSize)`

### 7. Color Scheme
- Background: `#0a0a1a`
- Neon glow: `shadowColor + shadowBlur`
- Brand: `#8844ff`
- Accent per game: unique neon color

---

## Арбитр: Вердикт Cycle 1

**Статус:** ACCEPT
**Evidence Score:** 12/12 игр каталогизированы
**Навыки извлечены:** см. SKILLS_EXTRACTED.md
**Следующий чекпоинт:** Cycle 2 — атомарная пересборка с новыми скилами
