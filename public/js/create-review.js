document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restroomId = urlParams.get('restroomId');
    document.getElementById('restroomId').value = restroomId;
  });
