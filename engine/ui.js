// ALGOKOSMOS Engine — UI Components
// Start screen, game over, HUD, brand, back button

export class UI {
    constructor(game) {
        this.game = game;
        this.brand = 'ALGOKOSMOS.COM';
    }

    startScreen(title, description, onStart) {
        const el = document.createElement('div');
        el.id = 'startScreen';
        el.innerHTML = `
            <div style="position:relative;">
                <h1 style="font-size:42px;color:#ffff00;text-shadow:0 0 20px #ffff00,0 0 40px #ffff0088;margin-bottom:10px;">ALGOKOSMOS</h1>
                <h2 style="font-size:28px;color:#8844ff;margin-bottom:25px;">${title}</h2>
                <p style="color:#888;margin-bottom:20px;font-size:14px;max-width:400px;margin-left:auto;margin-right:auto;">${description}</p>
                <button id="startBtn" style="padding:12px 35px;font-size:18px;background:linear-gradient(135deg,#8844ff,#00ccff);border:none;border-radius:8px;color:#0a0a1a;font-weight:bold;cursor:pointer;transition:transform 0.2s;">НАЧАТЬ ИГРУ</button>
                <div style="color:#555;font-size:11px;margin-top:20px;">ALGOKOSMOS.COM © 2026 | MIT License</div>
            </div>
        `;
        Object.assign(el.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
            color: 'white', zIndex: '10',
            background: 'rgba(10,10,26,0.95)', padding: '40px',
            borderRadius: '16px', border: '1px solid #2a2a3a',
            boxShadow: '0 0 60px rgba(136,68,255,0.15)'
        });
        document.body.appendChild(el);

        const btn = document.getElementById('startBtn');
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
        btn.addEventListener('click', () => {
            el.remove();
            this._addBackButton();
            if (onStart) onStart();
        });
    }

    overlay(title, text, buttonText, onAction, game) {
        const el = document.createElement('div');
        el.id = 'gameOverlay';
        el.innerHTML = `
            <h1 style="font-size:36px;color:#ffff00;margin-bottom:15px;text-shadow:0 0 20px #ffff0088;">${title}</h1>
            <p style="color:#ccc;margin-bottom:20px;font-size:16px;">${text}</p>
            <button id="actionBtn" style="padding:10px 30px;font-size:16px;background:linear-gradient(135deg,#8844ff,#00ccff);border:none;border-radius:8px;color:#0a0a1a;font-weight:bold;cursor:pointer;margin-right:10px;">${buttonText.toUpperCase()}</button>
            <button id="hubBtn" style="padding:10px 20px;font-size:14px;background:transparent;border:1px solid #555;border-radius:8px;color:#888;cursor:pointer;">HUB</button>
        `;
        Object.assign(el.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
            color: 'white', zIndex: '10',
            background: 'rgba(10,10,26,0.95)', padding: '30px 40px',
            borderRadius: '16px', border: '1px solid #2a2a3a'
        });
        document.body.appendChild(el);

        document.getElementById('actionBtn').addEventListener('click', () => {
            el.remove();
            if (onAction) onAction();
        });
        document.getElementById('hubBtn').addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
    }

    _addBackButton() {
        const btn = document.createElement('button');
        btn.id = 'backToHub';
        btn.textContent = '← HUB';
        btn.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
        Object.assign(btn.style, {
            position: 'fixed', top: '10px', left: '10px',
            padding: '6px 14px', fontSize: '13px',
            background: 'rgba(22,22,30,0.8)', border: '1px solid #333',
            borderRadius: '6px', color: '#888', cursor: 'pointer',
            zIndex: '100', transition: 'all 0.2s',
            backdropFilter: 'blur(4px)'
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.color = '#fff';
            btn.style.borderColor = '#8844ff';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.color = '#888';
            btn.style.borderColor = '#333';
        });
        document.body.appendChild(btn);
    }

    showStart(config) {
        const { title = 'ALGOKOSMOS', subtitle = '', description = '', color = '#ffff00', controls = '', onStart } = config;
        this.startScreen(subtitle || title, `${description} ${controls}`, onStart);
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
