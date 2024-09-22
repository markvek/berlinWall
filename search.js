let fileData = []; // This will hold the JSON data

// Function to load the JSON file (you need to convert your CSV to JSON first)
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        fileData = data;
    });

// Function to search the file by Title, Country, or Continent
function searchFile() {
    const query = document.getElementById('searchInput').value.toLowerCase();

    // Check if the search input is empty
    if (query.trim() === "") {
        // Display 0 results if the search box is empty
        displayResults([]);
        return;
    }

    const results = fileData.filter(item => {
        return (
            item.Title.toLowerCase().includes(query) ||
            item.Country.toLowerCase().includes(query) ||
            item.Continent.toLowerCase().includes(query)
        );
    });

    displayResults(results);
}

// Function to display search results as cards with expandable content
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Display the number of results
    const resultsCountDiv = document.getElementById('resultsCount');
    resultsCountDiv.innerHTML = `Number of results found: ${results.length}`;

    // Reset isSearched for all points
    dataPoints.forEach(point => point.isSearched = false);

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(item => {
        // Find corresponding data point in dataPoints array and mark as searched
        let point = dataPoints.find(p => p.title === item.Title && p.lat == item.Latitude && p.long == item.Longitude);
        if (point) {
            point.isSearched = true;
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <p><strong>Title:</strong> ${item.Title}</p>
            
            <button class="expand-btn" onclick="toggleDetails(this)">Expand</button>
            <div class="details" style="display: none;">
            <p><strong>Segments:</strong> ${item.Segment || 'N/A'}</p>
            <p><strong>Country:</strong> ${item.Country}</p>
                <p><strong>Latitude:</strong> ${item.Latitude}</p>
                <p><strong>Longitude:</strong> ${item.Longitude}</p>
                <p><strong>Continent:</strong> ${item.Continent}</p>
            </div>
        `;
        resultsDiv.appendChild(card);
    });
}

function toggleDetails(button) {
    const detailsDiv = button.nextElementSibling;

    // Close any open details
    const openDetails = document.querySelector('.details[style*="block"]');
    if (openDetails && openDetails !== detailsDiv) {
        openDetails.style.display = "none";
        openDetails.previousElementSibling.textContent = "Expand";
    }

    // Toggle the current card's details
    if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block";
        button.textContent = "Collapse";

        // Trigger the corresponding point selection in the globe
        const title = button.parentNode.querySelector('p strong').textContent.split(': ')[1];
        selectPointOnGlobe(title);  // Directly call the function from sketch_ray4.js
        // Temporarily disable the click event to prevent recursive loops
        setTimeout(() => {
            selectPointOnGlobe(title);
        }, 0);
    } else {
        detailsDiv.style.display = "none";
        button.textContent = "Expand";
    }
}

// // Function to trigger point selection on the globe
// function selectPointOnGlobe(title) {
//     // Ensure sketch_ray4.js has access to this function
//     if (typeof window.selectPointOnGlobe === 'function') {
//         window.selectPointOnGlobe(title);
//     } else {
//         console.error("selectPointOnGlobe function not found in sketch_ray4.js");
//     }
// }

// Function to scroll the carousel
function scrollCarousel(direction) {
    const container = document.getElementById('results');
    const scrollAmount = container.offsetWidth / 1.5; // Adjust scrolling distance

    if (direction === 1) {
        container.scrollLeft += scrollAmount;
    } else {
        container.scrollLeft -= scrollAmount;
    }
}
