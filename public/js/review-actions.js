document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const reviewId = event.target.dataset.reviewId;
      // Disable the like button to prevent multiple clicks
      button.disabled = true;
      console.log(reviewId);
      sendLike(reviewId).then(() => {
        // Re-enable the like button after the server responds
        button.disabled = false;
      });
    });
  }); 
  const dislikeButtons = document.querySelectorAll(".dislike-button");
  dislikeButtons.forEach(button => {
    button.addEventListener("click", event => {
      const reviewId = event.target.dataset.reviewId;
      // Disable the dislike button to prevent multiple clicks
      button.disabled = true;

      sendDislike(reviewId).then(() => {
        // Re-enable the dislike button after the server responds
        button.disabled = false;
      });
    });
  });
});


function sendLike(reviewId) {
  // Make an AJAX POST request to the server and return the promise
  return fetch('/addLikes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reviewId: reviewId }),
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response data if needed
    console.log(data);
  })
  .catch(error => {
    console.error('Error sending like action:', error);
  });
}


function sendDislike(reviewId) {
    // Make an AJAX POST request to the server
    return fetch('/addDislikes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId: reviewId }),
    }).then(response => response.json()).then(data => {
        // Handle the response data if needed
        console.log(data);
    })
    .catch(error => {
        console.error('Error sending like action:', error);
    });
}
  