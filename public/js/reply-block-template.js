
// Generates a different replyTemplate depending on who's viewing the file
function generateReplyTemplate(isOwner) {
  
  // If the owner of the establishment is the one viewing the replies
  if (isOwner) {
    const replyTemplate = `
                          <div class="reply-container flex flex-col p-3 gap-y-3 data-reply-id="{{ replyID }}">
                            <input id="replyID" type="hidden" value="{{ replyID }}">
                            <p><span class="text-secondary">(Establishment Owner) {{ username }}</span> replied | {{ date }}</p>
                            <p id="reply-text-{{ replyID }}">{{ content }}</p>
                            <div class="flex gap-x-3">

                            <!-- add a pop up here -->
                              <div id="edit-reply-container-{{ replyID }}" class="edit-reply-container hidden mt-2 min-w-1/2 max-w-80">
                                <textarea name="edit-reply" id="edit-reply-area-{{ replyID }}" class="edit-reply-text rounded-md p-2" cols="35" rows="5"></textarea>
                                <div class="flex mt-2 gap-x-5 ">
                                  <div class="flex gap-x-2 justify-center items-center ">
                                    <button type="submit" class="post-edit-reply-btn hover:opacity-80" value="{{ replyID }}">
                                        <i class="fa-regular fa-paper-plane"></i>
                                        Post Edit
                                    </button>
                                    <div class="flex gap-x-2 justify-center items-center">
                                        <button class="cancel-edit-reply-btn hover:opacity-80" value="{{ replyID }}">
                                            <i class="fa-solid fa-x"></i>
                                            Cancel
                                        </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div id="edit-delete-btns-{{ replyID }}" class="">
                                <button id="edit-{{ replyID }}" class="edit-reply-btn hover:opacity-80" value="{{ replyID }}">
                                  <i class="fa-solid fa-pencil"></i> Edit Reply
                                </button>
                                <button class="delete-reply-btn hover:opacity-80">
                                  <i class="fa-solid fa-trash-can"></i> Delete Reply
                                </button> 
                              </div>




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