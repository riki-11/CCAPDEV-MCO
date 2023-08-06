document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".like-button");
    likeButtons.forEach(button => {
      button.addEventListener("click", event => {
        const reviewId = event.target.dataset.reviewId;
        sendLike(reviewId);
      });
    });
  
    const dislikeButtons = document.querySelectorAll(".dislike-button");
    dislikeButtons.forEach(button => {
      button.addEventListener("click", event => {
        const reviewId = event.target.dataset.reviewId;
        sendLikeDislike(reviewId);
      });
    });
});

function sendLike(reviewId) {
// Make an AJAX POST request to the server
fetch('/addLikes', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reviewId }),
}).then(response => response.json()).then(data => {
    // Handle the response data if needed
    console.log(data);
})
.catch(error => {
    console.error('Error sending like action:', error);
});
}
function sendDislike(reviewId) {
    // Make an AJAX POST request to the server
    fetch('/addDislikes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
    }).then(response => response.json()).then(data => {
        // Handle the response data if needed
        console.log(data);
    })
    .catch(error => {
        console.error('Error sending like action:', error);
    });
}
  