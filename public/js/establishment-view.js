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



});