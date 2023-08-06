import { getReplies, displayReplies } from './reply-handler.js';

/*
// Function that grabs all the replies per review and appends it to their containers
async function getReplies() {

  // const repliesContainer = document.getElementsByClassName('replies-container');
  const reviewIDInputs = document.getElementsByClassName('review-id');
  // Grab each review id that is displayed
  const reviewIDs = [...reviewIDInputs].map(reviewIDInput => {
    return reviewIDInput.value;
  })


  // Once we have all the review IDs 
  // Grab all the replies per review and store them in an array
  const allReviewsAndReplies = reviewIDs.map(async reviewID => {
    const response = await fetch(`/get-replies?reviewID=${reviewID}`);
    const replies = await response.json();
    return {
      reviewID: reviewID,
      replies: replies
    };
  });

  // Wait for the promise to be fulfilled then return the list of all replies of all reviews
  return Promise.all(allReviewsAndReplies);
};
*/
/*
// Displays all the the replies for a specific review
function displayReplies(reviewAndReplies) {
  const reviewID = reviewAndReplies.reviewID;
  const replies = reviewAndReplies.replies;

  // Grab the reply-container pertaining to that review
  const replyContainer = document.getElementById(`replies-container-${reviewID}`);

  // For each reply, render it dynamically`
  replies.forEach(reply => {
  
    const data = {
      username: reply.ownerID.username,
      date: reply.replyDate,
      content: reply.reply
    };
    
    // For each reply, create a reply template from 'reply-block-template.js'
    const renderedTemplate = replyTemplate
                              .replace('{{ username }}', data.username)
                              .replace('{{ date }}', data.date)
                              .replace('{{ content }}', data.content);


    // Create a temporary div to convert the HTML string to a DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedTemplate;

    // Append the rendered template (DOM element) to the reply container
      // Append the child nodes of tempDiv to the reply container
      while (tempDiv.childNodes.length > 0) {
        replyContainer.appendChild(tempDiv.childNodes[0]);
      }
  })
};
*/
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
      
      // Get the reply container and the text within
      const replyContainer = document.getElementById(`reply-container-${reviewID}`);
      const replyTextContainer = document.getElementById(`reply-text-${reviewID}`);
      const replyText = replyTextContainer.value;

      // Get the current date when the reply was made.
      const date = new Date().toISOString().split('T')[0];

      const replyData = {
        reviewID: reviewID,
        reply: replyText,
        replyDate: date
      }
      
      // Submit the reply contents to the database via fetch request
      fetch('/postreply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyData)
      })

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
      displayReplies(reviewAndReplies)
      
    });
  });

  /**
   * TODO: 
   * close all other reply boxes kapag nagpress ka ng bago? 
   * submit post request through fetch api to update the db
   * add a "clear" button? and a "cancel" button?
   * hide the reply button mismo when we pull up the text box
   * ONLY SHOW ONE REPLY BOX AT A TIME SINCE IT USES AN ID
   */

});