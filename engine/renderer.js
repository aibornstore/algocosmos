// ALGOKOSMOS Engine — Renderer
// Neon glow, common drawing helpers

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    glow(color, blur = 15) {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = blur;
    }

    noGlow() {
        this.ctx.shadowBlur = 0;
    }

    rect(x, y, w, h, color, glow = 15) {
        this.ctx.fillStyle = color;
        this.glow(color, glow);
        this.ctx.fillRect(x, y, w, h);
        this.noGlow();
    }

    circle(x, y, r, color, glow = 15) {
        this.ctx.fillStyle = color;
        this.glow(color, glow);
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.noGlow();
    }

    text(str, x, y, color, size = 18, align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px Segoe UI`;
        this.ctx.textAlign = align;
        this.ctx.fillText(str, x, y);
        this.ctx.textAlign = 'left';
    }

    gradientBg(c1 = '#0a0a2a', c2 = '#1a0a3a') {
        const g = this.ctx.createLinearGradient(0, 0, 0, this.ctx.canvas.height);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        this.ctx.fillStyle = g;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawGrid(w, h, gridSize, color = '#1a1a2a') {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        for (let x = 0; x < w; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, h);
            this.ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(w, y);
            this.ctx.stroke();
        }
    }

    drawStars(stars, frame) {
        stars.forEach(star => {
            star.twinkle += 0.05;
            const alpha = 0.3 + Math.sin(star.twinkle) * 0.3;
            this.ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    makeStars(count, w, h) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        return stars;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    spawn(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 0.5 + Math.random() * 0.5,
                color,
                size: 2 + Math.random() * 3
            });
        }
    }

    update(dt, ctx) {
        this.particles = this.particles.filter(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) return false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            ctx.globalAlpha = 1;
            return true;
        });
    }

    clear() {
        this.particles = [];
    }
}

// SKILL: Sky gradient with clouds (Cycle 4 — Mario)
export function drawSky(ctx, w, h, cameraX) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#5c94fc');
    grad.addColorStop(1, '#88b4ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // Parallax clouds
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 8; i++) {
        const cx = (i * 350 + 100) - (cameraX * 0.2) % (350 * 8);
        const cy = 50 + (i % 3) * 40;
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy - 10, 25, 0, Math.PI * 2);
        ctx.arc(cx + 50, cy, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// SKILL: Asteroid polygon (Cycle 5 — Asteroids)
export function drawAsteroid(ctx, asteroid) {
    ctx.strokeStyle = '#aaaacc';
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(asteroid.x, asteroid.y);
    ctx.rotate(asteroid.angle);
    ctx.beginPath();
    ctx.moveTo(asteroid.points[0].x, asteroid.points[0].y);
    for (let i = 1; i < asteroid.points.length; i++) {
        ctx.lineTo(asteroid.points[i].x, asteroid.points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

// SKILL: Ship with thrust (Cycle 5 — Asteroids)
export function drawShip(ctx, ship, thrusting) {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(ship.radius, 0);
    ctx.lineTo(-ship.radius * 0.7, -ship.radius * 0.6);
    ctx.lineTo(-ship.radius * 0.4, 0);
    ctx.lineTo(-ship.radius * 0.7, ship.radius * 0.6);
    ctx.closePath();
    ctx.stroke();
    if (thrusting) {
        ctx.strokeStyle = '#ff8800';
        ctx.beginPath();
        ctx.moveTo(-ship.radius * 0.4, -4);
        ctx.lineTo(-ship.radius * (0.8 + Math.random() * 0.4), 0);
        ctx.lineTo(-ship.radius * 0.4, 4);
        ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
}

// SKILL: Centipede segment (Cycle 5 — Centipede)
export function drawCentipedeSegment(ctx, x, y, tile, isHead) {
    const sx = x, sy = y;
    const hue = isHead ? '#00ff00' : '#00cc44';
    ctx.fillStyle = hue;
    ctx.shadowColor = hue;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(sx + tile/2, sy + tile/2, tile/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#008822';
    ctx.beginPath();
    ctx.arc(sx + tile/2, sy + tile/2, tile/2 - 5, 0, Math.PI * 2);
    ctx.fill();
    if (isHead) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(sx + tile/2 - 4, sy + tile/2 - 3, 3, 0, Math.PI * 2);
        ctx.arc(sx + tile/2 + 4, sy + tile/2 - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}
