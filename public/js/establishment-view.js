import { getReplies, displayReplies } from './reply-handler.js';


document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById("establishment-banner");
  // GET request parameter to find out which building the user selected
  const buildingName = new URLSearchParams(window.location.search).get('building');
  
  // Fetch request to get that building's data
  fetch(`/get-building-code?building=${buildingName}`)
  .then(response => response.json())
  .then(code => {
    banner.classList.add(`${code}-bg`);
  })
  
  
  // Adds reply functionality to every reply button
  document.querySelectorAll('.reply-btn').forEach(replyBtn => {
    replyBtn.addEventListener('click', () => {
      
      // Get the id of the review that is being replied to
      const reviewID = replyBtn.getAttribute('data-review-id');

      // Get the reply container
      const replyContainer = document.getElementById(`reply-container-${reviewID}`);

      // Show the reply container upon clicking the reply button
      replyContainer.classList.remove('hidden');
    });
  })

  // Adds functionality to every post-reply button
  document.querySelectorAll('.post-reply-btn').forEach(postBtn => {
    postBtn.addEventListener('click', () => {

      // Get the id of the review that is being replied to
      const reviewID = postBtn.getAttribute('data-review-id');
      const buildingName = new URLSearchParams(window.location.search).get('building');

      // Get the reply container and the text within
      const replyContainer = document.getElementById(`reply-container-${reviewID}`);
      const replyTextContainer = document.getElementById(`reply-text-${reviewID}`);
      const replyText = replyTextContainer.value;

      // Get the current date when the reply was made.
      const date = new Date().toISOString().split('T')[0];

      const replyData = {
        reviewID: reviewID,
        reply: replyText,
        replyDate: date,
        buildingName: buildingName
      }
      
      // Submit the reply contents to the database via fetch request
      fetch('/postreply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyData)
      });

      // After submitting the post reply, clear the text area and hide the reply container
      replyTextContainer.value = '';
      replyContainer.classList.add('hidden');
    });
  })

  // Adds functionality to every cancel-reply button
  document.querySelectorAll('.cancel-reply-btn').forEach(cancelBtn => {
    cancelBtn.addEventListener('click', () => {

      // Get the id Dof the review that is being replied to
      const reviewID = cancelBtn.getAttribute('data-review-id');
      const replyContainer = document.getElementById(`reply-container-${reviewID}`);
      replyContainer.classList.add('hidden');
    });
  });

  // Dynamically load ALL replies per review
  getReplies().then(allReviewsAndReplies => {
    allReviewsAndReplies.forEach(reviewAndReplies => {
      const isOwnerInput = document.getElementById('isOwner').value;
      var isOwner;

      if (isOwnerInput === 'false') {
        isOwner = false;
      } else {
        isOwner = true;
      }

      displayReplies(reviewAndReplies, isOwner);
      
    });
  });
  
  
  // Add an event listener to handle delete button clicks
  document.addEventListener('click', async function (event) {
    console.log("Hello");
    const deleteBtn = event.target.closest('.delete-reply-btn');
    if (deleteBtn) {
      const replyContainer = deleteBtn.closest('.reply-container');
      console.log("Reply Container: ", replyContainer);
      const replyID = replyContainer.querySelector('#replyID').value;

      console.log("Reply ID: ", replyID);
      
      // Assuming you have a function to handle reply deletion, call it here
      // For example: deleteReplyFromServer(replyID);
      const response = await fetch(`/deleteReply?replyID=${replyID}`, {
        method: "DELETE",
      });
      
      // Remove the reply container from the DOM after deletion
      replyContainer.remove();
    }
  });
});