// ALGOKOSMOS Engine — Input
// Keyboard, touch, mouse

export class Input {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this._listeners = {};

        document.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (this._listeners['keydown']) this._listeners['keydown'](e);
        });
        document.addEventListener('keyup', e => {
            this.keys[e.key] = false;
            if (this._listeners['keyup']) this._listeners['keyup'](e);
        });

        canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            if (this._listeners['touchstart']) this._listeners['touchstart'](e);
        }, { passive: false });

        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            if (this._listeners['touchmove']) this._listeners['touchmove'](e);
        }, { passive: false });

        canvas.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            const dy = e.changedTouches[0].clientY - this.touchStartY;
            if (this._listeners['touchend']) this._listeners['touchend'](e, dx, dy);
        });

        canvas.addEventListener('mousemove', e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (this._listeners['mousemove']) this._listeners['mousemove'](e);
        });

        canvas.addEventListener('mousedown', e => {
            if (this._listeners['mousedown']) this._listeners['mousedown'](e);
        });
    }

    on(event, fn) {
        this._listeners[event] = fn;
    }

    isDown(key) {
        return !!this.keys[key];
    }

    getDirection4() {
        if (this.keys['ArrowLeft'] || this.keys['a']) return 'left';
        if (this.keys['ArrowRight'] || this.keys['d']) return 'right';
        if (this.keys['ArrowUp'] || this.keys['w']) return 'up';
        if (this.keys['ArrowDown'] || this.keys['s']) return 'down';
        return null;
    }

    swipeDirection(dx, dy) {
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        }
        return dy > 0 ? 'down' : 'up';
    }

    preventArrowScroll() {
        document.addEventListener('keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
}
