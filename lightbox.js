// Opens a screenshot from a [data-lightbox] gallery full size in a dialog.
// Each screenshot is a link to its image, so without JavaScript it still
// opens on its own.
(function () {
  "use strict";

  var gallery = document.querySelector("[data-lightbox]");
  if (!gallery || typeof HTMLDialogElement !== "function") return;

  var links = Array.prototype.slice.call(gallery.querySelectorAll("a[href]"));
  if (links.length === 0) return;

  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Screenshot");
  dialog.tabIndex = -1;
  dialog.innerHTML =
    '<figure>' +
      '<img alt="">' +
      '<figcaption><span class="lightbox-caption"></span> <span class="lightbox-count"></span></figcaption>' +
    '</figure>' +
    '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox-prev" aria-label="Previous screenshot">&lsaquo;</button>' +
    '<button type="button" class="lightbox-next" aria-label="Next screenshot">&rsaquo;</button>';
  document.body.appendChild(dialog);

  var image = dialog.querySelector("img");
  var caption = dialog.querySelector(".lightbox-caption");
  var count = dialog.querySelector(".lightbox-count");
  var prev = dialog.querySelector(".lightbox-prev");
  var next = dialog.querySelector(".lightbox-next");
  var current = 0;

  function show(index) {
    current = (index + links.length) % links.length;
    var link = links[current];
    var thumb = link.querySelector("img");
    var figcaption = link.closest("figure") && link.closest("figure").querySelector("figcaption");
    image.src = link.href;
    image.alt = thumb ? thumb.alt : "";
    if (thumb) {
      image.width = thumb.width;
      image.height = thumb.height;
    }
    caption.textContent = figcaption ? figcaption.textContent : "";
    count.textContent = (current + 1) + " of " + links.length;
  }

  links.forEach(function (link, index) {
    link.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      show(index);
      dialog.showModal();
      dialog.focus();
      document.documentElement.classList.add("lightbox-open");
    });
  });

  function close() {
    if (dialog.open) dialog.close();
    if (!document.documentElement.classList.contains("lightbox-open")) return;
    document.documentElement.classList.remove("lightbox-open");
    links[current].focus();
  }

  // Escape closes the dialog natively.
  dialog.addEventListener("close", close);

  dialog.querySelector(".lightbox-close").addEventListener("click", close);
  prev.addEventListener("click", function () { show(current - 1); });
  next.addEventListener("click", function () { show(current + 1); });

  // A click on the dimmed area around the screenshot closes it.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) close();
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { show(current - 1); event.preventDefault(); }
    if (event.key === "ArrowRight") { show(current + 1); event.preventDefault(); }
  });

  var touchStartX = null;
  dialog.addEventListener("touchstart", function (event) {
    touchStartX = event.touches.length === 1 ? event.touches[0].clientX : null;
  }, { passive: true });
  dialog.addEventListener("touchend", function (event) {
    if (touchStartX === null) return;
    var dx = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
  });
})();
