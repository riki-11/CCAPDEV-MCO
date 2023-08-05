    // Add an event listener to the form submit event instead of the "Search" button click event
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', handleSearch);
    console.log("Form")

    function handleSearch(event) {
        event.preventDefault();
       
        // Get the search input value from the form
        const searchInput = document.querySelector('.form-control.searchbar').value;
        console.log(searchInput);
        // Redirect the user to the search results page with the search query as a query parameter
        window.location.href = `/search-results?q=${encodeURIComponent(searchInput)}`;
    }