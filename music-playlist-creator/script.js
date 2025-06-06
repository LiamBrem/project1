// Playlist Modal
const modal = document.getElementById("PlaylistModal");
const span = document.getElementsByClassName("close")[0];
const shuffleButton = document.getElementById("shuffle");

function displaySongs(songs) {
  document.getElementById("Songs").innerHTML =
    "<br><ul>" +
    songs
      .map(
        (song) =>
          `<li>${song.title} - ${song.artist} (${song.album}) - Duration: ${song.duration}</li>`
      )
      .join("") +
    "</ul>";
}

function openModal(playlist) {
  document.getElementById("PlaylistTitle").textContent = playlist.name;
  document.getElementById("PlaylistImage").src = playlist.imageUrl;
  document.getElementById(
    "CreatorName"
  ).textContent = `By ${playlist.creatorName}`;

  displaySongs(playlist.songs);
  shuffleButton.onclick = () => {
    playlist.songs = shuffleList(playlist.songs);
    displaySongs(playlist.songs);
  };

  modal.style.display = "block";
}

span.onclick = () => (modal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

function shuffleList(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// add new modal
function openAddModal() {
  const addModal = document.getElementById("add-modal");
  const addCloseButton = document.getElementsByClassName("add-close")[0];
  addModal.style.display = "block";

  addCloseButton.onclick = () => (addModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === addModal) addModal.style.display = "none";
  });
}

function setupLikes(container = document) {
  container.querySelectorAll(".likes").forEach((likeSection) => {
    likeSection.addEventListener("click", (e) => {
      e.stopPropagation();
      const icon = likeSection.querySelector(".like-icon");
      const countSpan = likeSection.querySelector(".like-count");
      let count = parseInt(countSpan.textContent, 10);

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
}

function setupSearch() {
  // search
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearSearchButton = document.getElementById("clear-button");

  function performSearch() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#card-container .card").forEach((card) => {
      const title = card.querySelector("h2").textContent.toLowerCase();
      const author = card.querySelector("p").textContent.toLowerCase();
      if (title.includes(query) || author.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });
  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    document
      .querySelectorAll("#card-container .card")
      .forEach((card) => (card.style.display = "block"));
  });
}

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
  document.getElementById("song-list").appendChild(wrapper);
}

function setupAddSongHandler() {
  // add song handler - in add modal
  const addSongButton = document.getElementById("add-song");
  addSongButton.addEventListener("click", addSongFields);
  addSongFields(); // show 1 song to start
}

document.addEventListener("DOMContentLoaded", () => {
  setupLikes();
  setupSearch();
  const addButton = document.getElementById("add-button");
  addButton.addEventListener("click", openAddModal);
  setupAddSongHandler();

  const container = document.getElementById("card-container");
  fetch("data/data.json")
    .then((result) => result.json())
    .then((data) => {
      const playlists = data.playlists;
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

        const title = document.createElement("h2");
        title.textContent = playlist.playlist_name;

        const author = document.createElement("p");
        author.textContent = playlist.playlist_author;

        // like button
        const likeDiv = document.createElement("div");
        likeDiv.className = "likes";
        const likeIcon = document.createElement("i");
        likeIcon.className = "fa-regular fa-heart like-icon";
        const likeCount = document.createElement("span");
        likeCount.className = "like-count";
        likeCount.textContent = playlist.likes || "0";
        likeDiv.append(likeIcon, likeCount);
        likeDiv.onclick = (e) => {
          e.stopPropagation();
          const liked = likeIcon.classList.toggle("fa-solid");
          likeIcon.classList.toggle("liked");
          likeIcon.classList.toggle("fa-regular");
          let count = parseInt(likeCount.textContent, 10);
          if (liked){
            likeCount.textContent = count + 1;
          } else {
            likeCount.textContent = count - 1;
          }
          
        };

        // delete button
        const deleteDiv = document.createElement("div");
        deleteDiv.className = "delete";
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-solid fa-trash delete-icon";
        deleteDiv.appendChild(deleteIcon);
        deleteDiv.onclick = (e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this playlist?")) {
            card.remove();
            const idx = playlists.findIndex(
              (pl) => pl.playlistID === playlist.playlistID
            );
            if (idx !== -1) playlists.splice(idx, 1);
            if (playlists.length === 0)
              container.innerHTML = "<p>No playlists available.</p>";
          }
        };

        const cardActions = document.createElement("div");
        cardActions.className = "card-actions";
        cardActions.append(likeDiv, deleteDiv);

        card.onclick = () =>
          openModal({
            name: playlist.playlist_name,
            imageUrl: img.src,
            creatorName: playlist.playlist_author,
            songs: playlist.songs,
          });

        card.append(img, title, author, cardActions);
        container.appendChild(card);
      }

      function renderCards(list) {
        if (list.length === 0) {
          container.innerHTML = "<p>No playlists available.</p>";
        } else {
          container.innerHTML = "";
          list.forEach((pl) => createPlaylistCard(pl));
        }
      }

      renderCards(playlists);

      // sorting playlists
      document.getElementById("sort-select").addEventListener("change", (e) => {
        const sorted = [...playlists];
        if (e.target.value === "name")
          sorted.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
        else if (e.target.value === "likes")
          sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        else if (e.target.value === "date")
          sorted.sort(
            (a, b) =>
              new Date(b.dateAdded || b.dataAdded) -
              new Date(a.dateAdded || a.dataAdded)
          );
        renderCards(sorted);
      });

      // add playlist form
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("playlist-title").value;
        const author = document.getElementById("playlist-author").value;
        const date = new Date().toISOString();
        const songs = Array.from(document.querySelectorAll(".song-entry")).map(
          (entry) => ({
            title: entry.querySelector(".song-title").value,
            artist: entry.querySelector(".song-artist").value,
            album: entry.querySelector(".song-album").value,
            duration: entry.querySelector(".song-duration").value,
          })
        );
        const newPlaylist = {
          playlistID: `pl${playlists.length + 1}`,
          playlist_name: title,
          playlist_author: author,
          songs,
          dataAdded: date,
        };
        playlists.push(newPlaylist);
        createPlaylistCard(
          newPlaylist,
          `https://picsum.photos/200/200?random=${Math.floor(
            Math.random() * 1000
          )}`
        );
        form.reset();
        document.getElementById("add-modal").style.display = "none";
      });
    });
});
