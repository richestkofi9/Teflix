const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTgwNmM5NzY5MmM1MzFhNDQwMTRkYzkxYjQzZThmYiIsIm5iZiI6MTc4ODAzNzY4OS41NzYsInN1YiI6IjZhOTM0YTM5OTczODBmOGE4ZjdjNzUwNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wDTfaedUjIhorAxp-0kelJhwduRPsdoRK4orry4MXx4"
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

            const img = document.createElement("img");
            img.src = TMDB_IMAGE + match.poster_path;
            img.alt = title;
            img.loading = "lazy";

            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";

            thumb.innerHTML = "";
            thumb.appendChild(img);

            // Save the poster URL on the card
            card.dataset.tmdbPoster = img.src;

        } catch (error) {
            console.log("TMDB poster failed:", title);
        }
    }

    setupTMDBDetails();
}

function setupTMDBDetails() {

    const originalShowItem = window.showItem;

    if (typeof originalShowItem !== "function") {
        console.log("showItem function not found.");
        return;
    }

    window.showItem = function(key, icon) {

        // Run the original details function first
        originalShowItem(key, icon);

        // Find the card belonging to this anime
        const cards = document.querySelectorAll(".card");

        let poster = null;

        cards.forEach(card => {
            const onclick = card.getAttribute("onclick") || "";

            if (onclick.includes(`'${key}'`)) {
                poster = card.dataset.tmdbPoster;
            }
        });

        // Replace the emoji with the TMDB poster
        if (poster) {

            const bigIcon = document.getElementById("bigIcon");

            if (bigIcon) {
                bigIcon.innerHTML = "";

                const img = document.createElement("img");

                img.src = poster;
                img.alt = library[key]?.title || "";
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.style.borderRadius = "18px";
                img.style.display = "block";

                bigIcon.appendChild(img);
            }
        }
    };
}

loadTMDBPosters();