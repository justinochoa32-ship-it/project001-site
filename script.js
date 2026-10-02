(function () {
  var triggers = document.querySelectorAll("[data-video-src]");

  if (!triggers.length) {
    return;
  }

  var modal = null;
  var previousFocus = null;

  function closeVideo() {
    var video;

    if (!modal) {
      return;
    }

    video = modal.querySelector("video");

    if (video) {
      video.pause();
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }
      video.load();
    }

    modal.remove();
    modal = null;
    document.documentElement.classList.remove("video-modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function openVideo(trigger) {
    var panel;
    var closeButton;
    var video;
    var source;

    closeVideo();
    previousFocus = document.activeElement;

    modal = document.createElement("div");
    modal.className = "video-modal";
    modal.innerHTML = [
      '<div class="video-modal__panel" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">',
      '  <div class="video-modal__header">',
      '    <p class="video-modal__title" id="video-modal-title"></p>',
      '    <button class="video-modal__close" type="button">Close</button>',
      "  </div>",
      '  <video class="video-modal__video" controls preload="metadata"></video>',
      "</div>"
    ].join("");

    panel = modal.querySelector(".video-modal__panel");
    closeButton = modal.querySelector(".video-modal__close");
    video = modal.querySelector(".video-modal__video");
    source = document.createElement("source");

    modal.querySelector(".video-modal__title").textContent =
      trigger.getAttribute("data-video-title") || "Video Recap";
    source.src = trigger.getAttribute("data-video-src") || trigger.href;
    source.type = "video/mp4";
    video.appendChild(source);

    if (trigger.getAttribute("data-video-poster")) {
      video.setAttribute("poster", trigger.getAttribute("data-video-poster"));
    }

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeVideo();
      }
    });

    closeButton.addEventListener("click", closeVideo);

    document.body.appendChild(modal);
    document.documentElement.classList.add("video-modal-open");
    video.load();
    closeButton.focus();

    modal.focusableElements = panel.querySelectorAll("button, video");
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      openVideo(trigger);
    });
  });

  document.addEventListener("keydown", function (event) {
    var first;
    var last;
    var focusable;

    if (!modal) {
      return;
    }

    if (event.key === "Escape") {
      closeVideo();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    focusable = modal.focusableElements;
    first = focusable[0];
    last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
