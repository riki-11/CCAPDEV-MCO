const replyTemplate = `
  <div class="reply-container flex flex-col p-3 gap-y-3">
    <p><span class="text-secondary">(Establishment Owner) {{ username }}</span> replied | {{ date }}</p>
    <p>{{ content }}</p>
  </div>
  `;

export default replyTemplate;