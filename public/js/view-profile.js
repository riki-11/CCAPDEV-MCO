import { getReplies, displayReplies } from './reply-handler.js';

document.addEventListener('DOMContentLoaded', () => {
  // Dynamically load ALL replies per review
  getReplies().then(allReviewsAndReplies => {
    allReviewsAndReplies.forEach(reviewAndReplies => {

      // Owner should not be able to reply when viewing a profile
      const isOwner = false;
      displayReplies(reviewAndReplies, isOwner)
      
    });
  });
});