const canvas = document.getElementById("solar-loader");
const flash = document.getElementById("white-flash");
const pageLoader = document.getElementById("page-loader");

if (canvas && flash && pageLoader) {
  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cx = width / 2;
  let cy = height / 2;

  let zooming = false;
  let finished = false;
  let sunRadius = 16;

  const planets = [
    { r: 42, size: 3, speed: 0.03, angle: 0.2, color: "#b7bcc5" },
    { r: 65, size: 4, speed: 0.022, angle: 1.8, color: "#f3c07d" },
    { r: 90, size: 5, speed: 0.016, angle: 3.7, color: "#71d4ff" },
    { r: 118, size: 4, speed: 0.012, angle: 2.6, color: "#e17962" },
    { r: 148, size: 8, speed: 0.008, angle: 5.1, color: "#d6b287" }
  ];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    cx = width / 2;
    cy = height / 2;
  }

  function drawStars() {
    const starCount = Math.min(120, Math.floor((width * height) / 12000));

    for (let i = 0; i < starCount; i++) {
      const x = (i * 137.5) % width;
      const y = (i * 91.7) % height;
      const alpha = 0.08 + (i % 5) * 0.03;
      const size = (i % 3) + 1;

      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
  }

  function drawSolarSystem() {
    if (finished) return;

    ctx.clearRect(0, 0, width, height);
    drawStars();

    planets.forEach((p) => {
      if (!zooming) p.angle += p.speed;

      ctx.beginPath();
      ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    const sunGlow = zooming ? Math.min(sunRadius * 0.22, 220) : 28;

    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,200,120,1)";
    ctx.shadowColor = "rgba(255,180,70,0.95)";
    ctx.shadowBlur = sunGlow;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (zooming) {
      const overlay = document.querySelector(".loader-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
      }

      sunRadius *= 1.12;

      const screenCoverRadius = Math.hypot(width, height);

      if (sunRadius > Math.min(width, height) * 0.35) {
        flash.classList.add("active");
      }

      if (sunRadius > screenCoverRadius * 1.15) {
        finished = true;

        if (window.stopAstroFacts) {
          window.stopAstroFacts();
        }

        pageLoader.classList.add("hide");
        document.body.classList.remove("loading");
        document.body.classList.add("page-ready");

        setTimeout(() => {
          flash.classList.remove("active");
        }, 250);

        setTimeout(async () => {
          if (window.startHeroAnimation) {
            await window.startHeroAnimation();
          }

          if (window.initHeroReplayOnView) {
            window.initHeroReplayOnView();
          }
        }, 300);

        return;
      }
    }

    requestAnimationFrame(drawSolarSystem);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  drawSolarSystem();

  window.startSunZoom = function startSunZoom() {
    if (zooming || finished) return;

    // stop rotating facts
    if (window.stopAstroFacts) {
      window.stopAstroFacts();
    }

    // immediately remove fact overlay
    const overlay = document.querySelector(".loader-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }

    // start zoom almost immediately
    setTimeout(() => {
      zooming = true;
    }, 50);
  };
}