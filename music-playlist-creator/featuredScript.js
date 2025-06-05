document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("featured-container-right");

  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      const playlists = data.playlists;
      const playlist = playlists[Math.floor(Math.random() * playlists.length)];
      const title = document.getElementById("featured-title");
      const author = document.getElementById("featured-author");
      title.textContent = playlist.playlist_name;
      author.textContent = playlist.playlist_author;
      if (playlist.length === 0) {
        container.innerHTML = "<p>No songs available.</p>";
        return;
      }

      container.innerHTML = "";
      playlist.songs.forEach((song) => {
        const card = document.createElement("div");
        card.className = "song-card";

        const img = document.createElement("img");
        img.src =
          "https://picsum.photos/300/300?random=" +
          Math.floor(Math.random() * 1000);
        img.alt = "Song Icon";
        img.className = "card-icon";

        const textContainer = document.createElement("div");
        textContainer.className = "song-info";

        const title = document.createElement("div");
        title.className = "song-title";
        title.textContent = song.title;

        const artist = document.createElement("div");
        artist.className = "song-artist";
        artist.textContent = song.artist;

        const album = document.createElement("div");
        album.className = "song-album";
        album.textContent = song.album || "Unknown Album";

        const duration = document.createElement("div");
        duration.className = "song-duration";
        duration.textContent = song.duration || "0:00";

        textContainer.appendChild(title);
        textContainer.appendChild(artist);
        textContainer.appendChild(album);
        textContainer.appendChild(duration);

        card.appendChild(img);
        card.appendChild(textContainer);
        container.appendChild(card);
      });
    });
});
