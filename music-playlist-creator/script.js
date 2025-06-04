
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".likes").forEach(likeSection => {
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


// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("PlaylistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
   document.getElementById('PlaylistTitle').innerText = playlist.name;
   document.getElementById('PlaylistImage').src = playlist.imageUrl;
   document.getElementById('CreatorName').innerText = playlist.creatorName;
   modal.style.display = "block";
}

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}