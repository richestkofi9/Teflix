const TMDB_TOKEN =eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTgwNmM5NzY5MmM1MzFhNDQwMTRkYzkxYjQzZThmYiIsIm5iZiI6MTc4ODAzNzY4OS41NzYsInN1YiI6IjZhOTM0YTM5OTczODBmOGE4ZjdjNzUwNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wDTfaedUjIhorAxp-0kelJhwduRPsdoRK4orry4MXx4";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

async function loadTMDBPosters() {
    const cards = document.querySelectorAll(".card");

    for (const card of cards) {
        const titleElement = card.querySelector(".card-name");
        const thumb = card.querySelector(".card-thumb");

        if (!titleElement || !thumb) continue;

        const title = titleElement.textContent.trim();

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(title)}&include_adult=false&language=en-US&page=1`,
                {
                    headers: {
                        Authorization: `Bearer ${TMDB_TOKEN}`,
                        accept: "application/json"
                    }
                }
            );

            if (!response.ok) continue;

            const data = await response.json();

            const match = data.results?.find(item =>
                (item.media_type === "movie" || item.media_type === "tv") &&
                item.poster_path
            );

            if (!match) continue;

            const posterUrl = TMDB_IMAGE + match.poster_path;

            const img = document.createElement("img");
            img.src = posterUrl;
            img.alt = title;
            img.loading = "lazy";

            thumb.replaceChildren(img);
            card.dataset.tmdbPoster = posterUrl;

        } catch (error) {
            console.log("TMDB poster failed:", title);
        }
    }

    setupDetailPosters();
}

function setupDetailPosters() {

    document.querySelectorAll(".card").forEach(card => {

        card.addEventListener("click", () => {

            setTimeout(() => {

                const poster = card.dataset.tmdbPoster;
                const detailThumb = document.querySelector(".detail-thumb");

                if (!detailThumb) return;

                /* Make sure the Back button exists */
                let backButton = document.querySelector(".back-btn");

                if (!backButton) {
                    backButton = document.createElement("button");
                    backButton.className = "back-btn";
                    backButton.textContent = "← Back";
                    backButton.onclick = function () {
                        if (typeof closeItem === "function") {
                            closeItem();
                        }
                    };

                    const container = document.querySelector(".detail-container");

                    if (container) {
                        container.insertBefore(backButton, container.firstChild);
                    }
                }

                /* Put poster inside the detail image area */
                if (poster) {

                    detailThumb.replaceChildren();

                    const img = document.createElement("img");

                    img.src = poster;
                    img.alt = "";
                    img.style.width = "auto";
                    img.style.maxWidth = "100%";
                    img.style.height = "230px";
                    img.style.objectFit = "contain";
                    img.style.display = "block";
                    img.style.borderRadius = "8px";

                    detailThumb.appendChild(img);
                }

            }, 100);

        });

    });
}

loadTMDBPosters();