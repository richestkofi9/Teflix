// Teflix already loads TMDB posters from index.html.
// This file only fixes the detail-page poster display.

(function () {
    const originalShowItem = window.showItem;

    if (typeof originalShowItem !== "function") return;

    window.showItem = function (key, icon) {

        originalShowItem(key, icon);

        const overlay = document.getElementById("detailOverlay");
        const detailThumb = document.querySelector(".detail-thumb");
        const backButton = document.querySelector(".back-btn");

        // Always start the detail page at the top
        if (overlay) {
            overlay.scrollTop = 0;
        }

        // Keep the original Back button visible
        if (backButton) {
            backButton.style.display = "inline-block";
            backButton.style.position = "relative";
            backButton.style.zIndex = "10";
        }

        if (!detailThumb) return;

        let posterUrl = null;

        if (typeof posterMap !== "undefined" && posterMap[key]) {
            posterUrl = posterMap[key];
        }

        if (!posterUrl) return;

        detailThumb.replaceChildren();

        const img = document.createElement("img");

        img.src = posterUrl;
        img.alt = "Poster";

        img.style.width = "auto";
        img.style.maxWidth = "100%";
        img.style.height = "220px";
        img.style.maxHeight = "220px";
        img.style.objectFit = "contain";
        img.style.display = "block";
        img.style.borderRadius = "8px";

        detailThumb.appendChild(img);
    };
})();