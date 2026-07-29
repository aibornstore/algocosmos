// ALGOKOSMOS Engine — UI Components
// Start screen, game over, HUD, brand

export class UI {
    constructor(game) {
        this.game = game;
        this.brand = 'ALGOKOSMOS.COM';
    }

    showStart(config) {
        const { title = 'ALGOKOSMOS', subtitle = '', description = '', color = '#ffff00', controls = '', onStart } = config;
        const el = document.createElement('div');
        el.id = 'startScreen';
        el.innerHTML = `
            <h1 style="font-size:42px;color:${color};text-shadow:0 0 20px ${color},0 0 40px ${color}88;margin-bottom:10px;">${title}</h1>
            ${subtitle ? `<h2 style="font-size:22px;color:${color}88;margin-bottom:25px;">${subtitle}</h2>` : ''}
            <p style="color:#888;margin-bottom:15px;font-size:14px;">${description}</p>
            <button id="startBtn" style="padding:12px 35px;font-size:18px;background:linear-gradient(135deg,${color},${color}88);border:none;border-radius:8px;color:#0a0a1a;font-weight:bold;cursor:pointer;">НАЧАТЬ ИГРУ</button>
            ${controls ? `<div style="color:#666;font-size:12px;margin-top:20px;line-height:1.6;">${controls}</div>` : ''}
        `;
        Object.assign(el.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
            color: 'white', zIndex: '10'
        });
        document.body.appendChild(el);
        document.getElementById('startBtn').addEventListener('click', () => {
            el.remove();
            if (onStart) onStart();
        });
    }

    showGameOver(score, onRetry) {
        this._showOverlay('ПОРАЖЕНИЕ', `Счёт: ${score}`, '#ff3333', onRetry);
    }

    showWin(score, onRetry) {
        this._showOverlay('ПОБЕДА!', `Счёт: ${score}`, '#00ff88', onRetry);
    }

    _showOverlay(title, text, color, onRetry) {
        const el = document.createElement('div');
        el.id = 'gameOverlay';
        el.innerHTML = `
            <h1 style="font-size:36px;color:${color};margin-bottom:15px;">${title}</h1>
            <p style="color:#ccc;margin-bottom:15px;">${text}</p>
            <button id="retryBtn" style="padding:10px 30px;font-size:16px;background:linear-gradient(135deg,#ffff00,#ffaa00);border:none;border-radius:8px;color:#0a0a1a;font-weight:bold;cursor:pointer;">ЗАНОВО</button>
        `;
        Object.assign(el.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
            color: 'white', zIndex: '10'
        });
        document.body.appendChild(el);
        document.getElementById('retryBtn').addEventListener('click', () => {
            el.remove();
            if (onRetry) onRetry();
        });
    }

    drawHUD(ctx, items) {
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 8;
        ctx.font = '16px Segoe UI';
        let y = 25;
        items.forEach(item => {
            ctx.fillStyle = item.color || '#ffff00';
            ctx.shadowColor = item.color || '#ffff00';
            ctx.fillText(`${item.label}: ${item.value}`, 15, y);
            y += 22;
        });
        ctx.shadowBlur = 0;
    }

    drawBrand(ctx, w, h) {
        ctx.fillStyle = '#8844ff';
        ctx.font = '12px Segoe UI';
        ctx.globalAlpha = 0.6;
        ctx.textAlign = 'right';
        ctx.fillText(this.brand, w - 15, h - 12);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
    }
}
