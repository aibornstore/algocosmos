// ALGOKOSMOS Engine — Audio
// Web Audio API sound effects

export class Audio {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            this.enabled = false;
        }
    }

    play(type, freq = 440, duration = 0.1) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    eat() { this.play('square', 600, 0.05); }
    hit() { this.play('sawtooth', 200, 0.15); }
    die() { this.play('sawtooth', 100, 0.3); }
    win() { this.play('square', 800, 0.1); setTimeout(() => this.play('square', 1000, 0.1), 100); }
    power() { this.play('sine', 300, 0.2); }
    shoot() { this.play('square', 500, 0.05); }
    jump() { this.play('sine', 400, 0.1); }
}
