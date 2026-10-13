async function startSunZoom() {
  const canvas = document.getElementById("solar-loader");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const loader = document.getElementById("page-loader");

  let radius = 20;

  function zoom() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,200,120,1)";
    ctx.shadowColor = "rgba(255,200,120,0.95)";
    ctx.shadowBlur = 30;
    ctx.fill();

    radius *= 1.12;

    if (radius < 2000) {
      requestAnimationFrame(zoom);
    } else {
      if (loader) {
        loader.classList.add("hide");
      }

      document.body.classList.remove("loading");

      setTimeout(async () => {
        if (window.startHeroAnimation) {
          await window.startHeroAnimation();
        }

        if (window.initHeroReplayOnView) {
          window.initHeroReplayOnView();
        }
      }, 80);
    }
  }

  zoom();
}

window.startSunZoom = startSunZoom;