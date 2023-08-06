document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach(likeButton => {
    likeButton.addEventListener("click", event => {
      event.preventDefault();
      const reviewId = event.target.getAttribute("data-review-id");
      sendLike(reviewId);
      
    });
  });

  const dislikeButtons = document.querySelectorAll(".dislike-button");
  
  dislikeButtons.forEach(dislikeButton => {
    dislikeButton.addEventListener("click", event => {
      event.preventDefault();
      const reviewId = event.target.getAttribute("data-review-id");
      sendDislike(reviewId)
      
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
  