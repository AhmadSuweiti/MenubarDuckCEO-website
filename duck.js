// ============================================================
// Duck CEO — Pixel Duck Renderer
// Renders the same pixel-art duck from the macOS app in canvas.
// ============================================================

const DUCK_PALETTE = {
    0: null,                          // transparent
    1: [255, 221, 0],                 // body — golden yellow
    2: [255, 115, 0],                 // beak/feet — orange
    3: [20, 20, 20],                  // pupil
    4: [255, 255, 255],               // eye white
    5: [209, 161, 0],                 // shadow
};

const DUCK_WALK_A = [
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,4,3,4,1,1,1,2,2,0],
    [0,1,1,1,1,1,1,1,0,2,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,5,1,1,1,5,1,1,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0],
    [0,2,2,0,0,0,0,0,0,0,0,0],
];

const DUCK_WALK_B = [
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,4,3,4,1,1,1,2,2,0],
    [0,1,1,1,1,1,1,1,0,2,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,5,1,1,1,5,1,1,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,2,2,0,0,0,0,0],
];

const DUCK_SIT = [
    [0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,4,3,4,1,1,2,2,0],
    [0,0,1,1,1,1,1,1,0,2,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,5,1,1,1,5,1,1,0,0,0],
    [0,2,2,0,0,0,0,2,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
];

const DUCK_WAVE = [
    [1,1,0,0,1,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,0,0,0,0],
    [0,1,1,4,3,4,1,1,1,2,2,0],
    [0,1,1,1,1,1,1,1,0,2,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,5,1,1,1,5,1,1,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0],
    [0,2,2,0,0,0,0,0,0,0,0,0],
];

// Draw a duck grid onto a canvas
function drawDuck(canvas, grid, scale, flip) {
    const ctx = canvas.getContext("2d");
    const rows = grid.length;
    const cols = grid[0].length;
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (flip) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const code = grid[r][c];
            const color = DUCK_PALETTE[code];
            if (!color) continue;
            ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
            ctx.fillRect(c * scale, r * scale, scale, scale);
        }
    }

    if (flip) ctx.restore();
}

// ---- Hero Duck (large, animated walk) ----

function initHeroDuck() {
    const canvas = document.getElementById("hero-duck");
    if (!canvas) return;
    let frame = 0;
    const scale = 8;

    function animate() {
        const grid = frame % 2 === 0 ? DUCK_WALK_A : DUCK_WALK_B;
        drawDuck(canvas, grid, scale, false);
        frame++;
    }

    animate();
    setInterval(animate, 400);
}

// ---- Walking Duck at bottom of page ----

function initWalkingDuck() {
    const canvas = document.getElementById("walking-duck");
    if (!canvas) return;

    const scale = 5;
    const cols = DUCK_WALK_A[0].length;
    const duckW = cols * scale;
    let x = -duckW;
    let frame = 0;
    let facingRight = true;
    const speed = 1.5;

    const container = canvas.parentElement;

    function animate() {
        const containerW = container.offsetWidth;
        canvas.style.position = "absolute";
        canvas.style.bottom = "8px";
        canvas.style.left = x + "px";
        canvas.style.imageRendering = "pixelated";

        const grid = frame % 2 === 0 ? DUCK_WALK_A : DUCK_WALK_B;
        drawDuck(canvas, grid, scale, !facingRight);

        x += facingRight ? speed : -speed;

        if (x > containerW) {
            facingRight = false;
        } else if (x < -duckW) {
            facingRight = true;
        }

        frame++;
        requestAnimationFrame(animate);
    }

    // Slow down frame changes (walk animation)
    let walkFrame = 0;
    function animateWalk() {
        const containerW = container.offsetWidth;
        canvas.style.position = "absolute";
        canvas.style.bottom = "8px";
        canvas.style.left = x + "px";
        canvas.style.imageRendering = "pixelated";

        if (walkFrame % 12 === 0) frame++;
        const grid = frame % 2 === 0 ? DUCK_WALK_A : DUCK_WALK_B;
        drawDuck(canvas, grid, scale, !facingRight);

        x += facingRight ? speed : -speed;

        if (x > containerW) facingRight = false;
        else if (x < -duckW) facingRight = true;

        walkFrame++;
        requestAnimationFrame(animateWalk);
    }

    animateWalk();
}

// ---- Static Duck for mockup ----

function initMockupDuck() {
    const canvas = document.getElementById("mockup-duck");
    if (!canvas) return;
    drawDuck(canvas, DUCK_SIT, 6, false);
}

// ---- Notch Duck (waving, next to the notch) ----

function initNotchDuck() {
    const canvas = document.getElementById("notch-duck-left");
    if (!canvas) return;
    let frame = 0;
    const scale = 5;

    function animate() {
        const grid = frame % 2 === 0 ? DUCK_WAVE : DUCK_SIT;
        drawDuck(canvas, grid, scale, false);
        frame++;
    }

    animate();
    setInterval(animate, 800);
}

// ---- Init all ----

document.addEventListener("DOMContentLoaded", () => {
    initHeroDuck();
    initMockupDuck();
    initWalkingDuck();
    initNotchDuck();
});
