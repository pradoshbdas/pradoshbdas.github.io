function loadGallery() {
  const gallery = document.getElementById("gallery-grid");

  if (!gallery) {
    console.log("gallery-grid not found yet");
    return false;
  }

  if (gallery.dataset.loaded === "true") {
    return true;
  }

  const images = [
    "gallery1.jpg",
    "gallery2.jpeg",
    "gallery3.jpg",
    "gallery4.jpg",
    "gallery5.jpg",
    "gallery6.jpg"
  ];

  images.forEach((img, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";

    const image = document.createElement("img");
    image.src = `/files/images/gallery/${img}`;
    image.alt = `Photo ${index + 1}`;

    tile.appendChild(image);
    gallery.appendChild(tile);
  });

  gallery.dataset.loaded = "true";
  console.log("Gallery loaded");
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (loadGallery()) return;

  let tries = 0;
  const interval = setInterval(() => {
    tries++;
    if (loadGallery() || tries > 30) {
      clearInterval(interval);
    }
  }, 200);
});
