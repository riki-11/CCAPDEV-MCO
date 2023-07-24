document.addEventListener('DOMContentLoaded', () => {

  function changeFloorNums() {
    const selectedBldg = bldgDropdown.value;
  
    // Fetch requesst to /get-building-data route to grab data of SPECIFIC building
    fetch(`/get-building-data?building=${selectedBldg}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.numOfFloors);
        // Clear all the options in the dropdown
        floorDropdown.innerHTML = '';
        
        // Create the list of options based on num of floors
        for (let i = 1; i <= data.numOfFloors; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          floorDropdown.appendChild(option);
        }
       });
  };

  const bldgDropdown = document.getElementById('building');
  const floorDropdown = document.getElementById('floor');

  console.log(bldgDropdown);

  // Call changFloorNums upon loading the page as well
  changeFloorNums();
  console.log('IM HERE!');

  // Dynamically changes the no. of floor options per building
  bldgDropdown.addEventListener('change', changeFloorNums);

});