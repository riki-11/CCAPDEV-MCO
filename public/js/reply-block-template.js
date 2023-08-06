
// Generates a different replyTemplate depending on who's viewing the file
function generateReplyTemplate(isOwner) {
  
  // If the owner of the establishment is the one viewing the replies
  if (isOwner) {
    const replyTemplate = `
                          <div class="reply-container flex flex-col p-3 gap-y-3">
                            <input id="replyID" type="hidden" value="{{ replyID }}">
                            <p><span class="text-secondary">(Establishment Owner) {{ username }}</span> replied | {{ date }}</p>
                            <p id="reply-text-{{ replyID }}">{{ content }}</p>
                            <div class="flex gap-x-3">
                              <button class="hover:opacity-80">
                                <i class="fa-solid fa-pencil"></i> Edit Reply
                              </button>
                              <button class="hover:opacity-80">
                                  <i class="fa-solid fa-trash-can"></i> Delete Reply
                              </button> 
                            </div>
                          </div>
                          `;
    return replyTemplate;
  }

  // Else, it is not the owner of the establishment
  else {
    const replyTemplate = `
                          <div class="reply-container flex flex-col p-3 gap-y-3">
                            <input id="replyID" type="hidden" value="{{ replyID }}">
                            <p><span class="text-secondary">(Establishment Owner) {{ username }}</span> replied | {{ date }}</p>
                            <p id="reply-text-{{ replyID }}">{{ content }}</p>
                          </div>
                          `;
    return replyTemplate;
  }

};

// nvm handlebars.compile is a headache

export default generateReplyTemplate;