// Like counts
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".likes").forEach((likeSection) => {
    likeSection.addEventListener("click", () => {
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
});

// Modal
const modal = document.getElementById("PlaylistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
  document.getElementById("PlaylistTitle").innerText = playlist.name;
  document.getElementById("PlaylistImage").src = playlist.imageUrl;
  document.getElementById("CreatorName").innerText = playlist.creatorName;
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Playlist data
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");

  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      const playlists = data.playlists;

      container.innerHTML = "";

      if (playlists.length === 0) {
        container.innerHTML = "<p>No playlists available.</p>";
        return;
      }

      playlists.forEach((playlist) => {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src =
          "https://picsum.photos/200/200?random=" +
          Math.floor(Math.random() * 1000);
        img.alt = "Playlist Icon";
        img.className = "card-icon";

        const titleWrapper = document.createElement("div");
        titleWrapper.onclick = () => openModal({
          name: playlist.playlist_name,
          imageUrl: img.src,
          creatorName: playlist.playlist_author,
          songs: playlist.songs
        });

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
        likeCount.textContent = Math.floor(Math.random() * 500); // random like count
        likeDiv.appendChild(likeCount);

        likeDiv.onclick = () => {
          const liked = likeIcon.classList.toggle("fa-solid");
          likeIcon.classList.toggle("liked");
          likeIcon.classList.toggle("fa-regular");
          let count = parseInt(likeCount.textContent);
          likeCount.textContent = liked ? count + 1 : count - 1;
        };

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(likeDiv);

        container.appendChild(card);

      });
    });
});
