document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("featured-container-right");

    fetch("data/data.json")
        .then((response) => response.json())
        .then((data) => {

            

            const playlists = data.playlists;
            const playlist = playlists[Math.floor(Math.random() * playlists.length)];
            const title = document.getElementById("featured-title");
            title.textContent = playlist.playlist_name;
            if (playlist.length === 0) {
                container.innerHTML = "<p>No songs available.</p>";
                return;
            }

            // display cards for each song
            container.innerHTML = "";
            playlist.songs.forEach((song) => {
                const card = document.createElement("div");
                card.className = "card";

                const img = document.createElement("img");
                img.src = "?random=" + Math.floor(Math.random() * 1000);
                img.alt = "Song Icon";
                img.className = "card-icon";

                const titleWrapper = document.createElement("div");
                titleWrapper.onclick = () =>
                    openModal({
                        name: song.song_name,
                        imageUrl: img.src,
                        creatorName: song.song_author,
                        songs: playlist.songs,
                    });

                const title = document.createElement("h2");
                title.textContent = song.song_name;
                titleWrapper.appendChild(title);

                const author = document.createElement("p");
                author.textContent = song.song_author;

                card.appendChild(img);
                card.appendChild(titleWrapper);
                card.appendChild(author);
                
                container.appendChild(card);
            });


        })

});