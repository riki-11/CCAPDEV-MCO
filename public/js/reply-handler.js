import generateReplyTemplate from './reply-block-template.js';

// Function that grabs all the replies per review and appends it to their containers
export async function getReplies() {

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

// Displays all the the replies for a specific review
export function displayReplies(reviewAndReplies, isOwner) {
  const reviewID = reviewAndReplies.reviewID;
  const replies = reviewAndReplies.replies;

  // Grab the reply-container pertaining to that review
  const replyContainer = document.getElementById(`replies-container-${reviewID}`);

  // For each reply, render it dynamically`
  replies.forEach(reply => {
  
    const data = {
      username: reply.ownerID.username,
      date: reply.replyDate,
      content: reply.reply,
      replyID: reply._id
    };
    
    const replyTemplate = generateReplyTemplate(isOwner);

    // For each reply, create a reply template from 'reply-block-template.js'
    const renderedTemplate = replyTemplate
                              .replace('{{ username }}', data.username)
                              .replace('{{ date }}', data.date)
                              .replace('{{ content }}', data.content)
                              .replace(/{{ replyID }}/g, data.replyID);


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