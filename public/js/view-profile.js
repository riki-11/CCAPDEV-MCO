import { getReplies, displayReplies } from './reply-handler.js';

document.addEventListener('DOMContentLoaded', () => {
  // Dynamically load ALL replies per review
  getReplies().then(allReviewsAndReplies => {
    allReviewsAndReplies.forEach(reviewAndReplies => {
      displayReplies(reviewAndReplies)
      
    });
  });
});