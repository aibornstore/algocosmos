// ALGOKOSMOS Engine — Core
// Canvas bootstrap, resize, game loop

export class Game {
    constructor(canvasId = 'gameCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.paused = false;
        this.lastTime = 0;
        this._resizeHandlers = [];
        this._tick = this._tick.bind(this);

        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this._resizeHandlers.forEach(fn => fn(this.w, this.h));
    }

    onResize(fn) {
        this._resizeHandlers.push(fn);
    }

    start() {
        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();
        requestAnimationFrame(this._tick);
    }

    stop() {
        this.running = false;
    }

    pause() {
        this.paused = !this.paused;
    }

    _tick(timestamp) {
        if (!this.running) return;
        const dt = this.paused ? 0 : Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        if (this.paused) {
            this._drawPause();
        } else {
            if (this.update) this.update(dt);
            if (this.draw) this.draw();
        }

        requestAnimationFrame(this._tick);
    }

    _drawPause() {
        if (this.draw) this.draw();
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = '48px Segoe UI';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ПАУЗА', this.w / 2, this.h / 2);
        this.ctx.textAlign = 'left';
    }

    clear(color = '#0a0a1a') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }
}
