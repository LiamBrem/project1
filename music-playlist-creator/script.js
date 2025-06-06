// Playlist Modal
const modal = document.getElementById("PlaylistModal");
const span = document.getElementsByClassName("close")[0];
const shuffleButton = document.getElementById("shuffle");

function openModal(playlist) {
  document.getElementById("PlaylistTitle").textContent = playlist.name;
  document.getElementById("PlaylistImage").src = playlist.imageUrl;
  document.getElementById(
    "CreatorName"
  ).textContent = `By ${playlist.creatorName}`;

  const displaySongs = (songs) => {
    document.getElementById("Songs").innerHTML =
      "<br><ul>" +
      songs
        .map(
          (song) =>
            `<li>${song.title} - ${song.artist} (${song.album}) - Duration: ${song.duration}</li>`
        )
        .join("") +
      "</ul>";
  };

  displaySongs(playlist.songs);

  shuffleButton.onclick = () => {
    playlist.songs = shuffleList(playlist.songs);
    displaySongs(playlist.songs);
  };

  modal.style.display = "block";
}

span.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

function shuffleList(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// Add new modal

function openAddModal() {
  const addModal = document.getElementById("add-modal");
  const addCloseButton = document.getElementsByClassName("add-close")[0];
  addModal.style.display = "block";

  addCloseButton.onclick = () => (addModal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === addModal) addModal.style.display = "none";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  // Like Button
  document.querySelectorAll(".likes").forEach((likeSection) => {
    likeSection.addEventListener("click", (e) => {
      e.stopPropagation();
      const icon = likeSection.querySelector(".like-icon");
      const countSpan = likeSection.querySelector(".like-count");
      let count = parseInt(countSpan.textContent);

      if (icon.classList.contains("liked")) {
        icon.classList.remove("fa-solid", "liked");
        icon.classList.add("fa-regular");
        countSpan.textContent = count - 1;
      } else {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid", "liked");
        countSpan.textContent = count + 1;
      }
    });
  });

  // Search
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearSearchButton = document.getElementById("clear-button");

  function performSearch() {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll("#card-container .card");

    cards.forEach((card) => {
      const title = card.querySelector("h2").textContent.toLowerCase();
      const author = card.querySelector("p").textContent.toLowerCase();
      const matches = title.includes(query) || author.includes(query);
      card.style.display = matches ? "block" : "none";
    });
  }

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });

  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    document.querySelectorAll("#card-container .card").forEach((card) => {
      card.style.display = "block";
    });
  });

  const addButton = document.getElementById("add-button");
  addButton.onclick = () => {
    openAddModal();
  };

  // add song handler - in add modal
  const songList = document.getElementById("song-list");
  const addSongButton = document.getElementById("add-song");

  function addSongFields() {
    const wrapper = document.createElement("div");
    wrapper.className = "song-entry";
    wrapper.innerHTML = `
    <input type="text" class="song-title" placeholder="Title" required />
    <input type="text" class="song-artist" placeholder="Artist" required />
    <input type="text" class="song-album" placeholder="Album" required />
    <input type="text" class="song-duration" placeholder="Duration (e.g., 3:45)" required />
    <button type="button" class="remove-song">Remove</button>
  `;

    wrapper.querySelector(".remove-song").onclick = () => wrapper.remove();

    songList.appendChild(wrapper);
  }

  // Initially show 1 song field
  addSongFields();
  addSongButton.addEventListener("click", addSongFields);

  // Loading Cards
  const container = document.getElementById("card-container");

  fetch("data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const playlists = data.playlists;
      const container = document.getElementById("card-container");
      const form = document.getElementById("add-playlist-form");

      function createPlaylistCard(playlist, imageUrl = null) {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src =
          imageUrl ||
          `https://picsum.photos/200/200?random=${Math.floor(
            Math.random() * 1000
          )}`;
        img.alt = "Playlist Icon";
        img.className = "card-icon";

        img.onerror = () => {
          img.onerror = null;
          img.src = "default.jpg";
        };

        const titleWrapper = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = playlist.playlist_name;
        titleWrapper.appendChild(title);

        const author = document.createElement("p");
        author.textContent = playlist.playlist_author;

        const likeDiv = document.createElement("div");
        likeDiv.className = "likes";

        const likeIcon = document.createElement("i");
        likeIcon.className = "fa-regular fa-heart like-icon";
        likeDiv.appendChild(likeIcon);

        const likeCount = document.createElement("span");
        likeCount.className = "like-count";
        likeCount.textContent = Math.floor(Math.random() * 500);
        likeDiv.appendChild(likeCount);

        likeDiv.onclick = (e) => {
          e.stopPropagation();
          const liked = likeIcon.classList.toggle("fa-solid");
          likeIcon.classList.toggle("liked");
          likeIcon.classList.toggle("fa-regular");
          let count = parseInt(likeCount.textContent);
          likeCount.textContent = liked ? count + 1 : count - 1;
        };

        const deleteDiv = document.createElement("div");
        deleteDiv.className = "delete";
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-solid fa-trash delete-icon";
        deleteDiv.appendChild(deleteIcon);

        deleteDiv.onclick = (e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this playlist?")) {
            card.remove();
            const index = playlists.findIndex(
              (pl) => pl.playlistID === playlist.playlistID
            );
            if (index !== -1) {
              playlists.splice(index, 1);
            }
            if (playlists.length === 0) {
              container.innerHTML = "<p>No playlists available.</p>";
            }
          }
        };

        const cardActions = document.createElement("div");
        cardActions.className = "card-actions";
        cardActions.appendChild(likeDiv);
        cardActions.appendChild(deleteDiv);

        card.onclick = () => {
          openModal({
            name: playlist.playlist_name,
            imageUrl: img.src,
            creatorName: playlist.playlist_author,
            songs: playlist.songs,
          });
        };

        card.append(img, titleWrapper, author, cardActions);
        container.appendChild(card);
      }

      // form submission for new playlist
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("playlist-title").value.trim();
        const author = document.getElementById("playlist-author").value.trim();
        const image = document.getElementById("image-url").value.trim();

        if (!title || !author) return;

        const songEntries = document.querySelectorAll(".song-entry");
        const songs = Array.from(songEntries).map((entry) => ({
          title: entry.querySelector(".song-title").value.trim(),
          artist: entry.querySelector(".song-artist").value.trim(),
          album: entry.querySelector(".song-album").value.trim(),
          duration: entry.querySelector(".song-duration").value.trim(),
        }));

        const newPlaylist = {
          playlistID: `pl${(playlists.length + 1).toString().padStart(3, "0")}`,
          playlist_name: title,
          playlist_author: author,
          songs: songs,
        };

        playlists.push(newPlaylist);

        const imgSrc = `https://picsum.photos/300/300?random=${Math.floor(
          Math.random() * 1000
        )}`;
        createPlaylistCard(newPlaylist, imgSrc);

        form.reset();
        document.getElementById("add-modal").style.display = "none";
      });

      container.innerHTML = playlists.length
        ? ""
        : "<p>No playlists available.</p>";
      playlists.forEach((playlist) => createPlaylistCard(playlist));
    });
});
