function selectElementByClass(className) {
    return document.querySelector(`.${className}`);
}

const sections = [
    selectElementByClass('intro'),
    selectElementByClass('data'),
    selectElementByClass('aboutMe'),
];

const navItems = {
    home: selectElementByClass('homeNavItem'),
    data: selectElementByClass('dataNavItem'),
    aboutMe: selectElementByClass('aboutMeNavItem'),
};

// intersection observer setup
const observerOptions = {
    root: null,
    rootMargin: '0px',
    // threshold: 0.7,
};

//JS Function to track middle and right item of Other Work Link
function adjustOtherWorkLink() {
    const otherWorkLink = document.querySelector('.otherWorkNavItem');
    const rightSection = document.querySelector('.right');
    const middleSection = document.querySelector('.middle');

    // Check the window width
    if (window.innerWidth > 750) {
        // If screen is larger than 750px, move Other Work to the right section
        if (!rightSection.contains(otherWorkLink)) {
            rightSection.appendChild(otherWorkLink);
            console.log("Right");
        }
    } else {
        // If screen is 750px or smaller, move Other Work to the middle section
        if (!middleSection.contains(otherWorkLink)) {
            middleSection.appendChild(otherWorkLink);
            console.log("Middle");
        }
    }
}

// Enhance the scroll function to support more responsive interactions
function scrollCarousel(direction) {
    const container = document.getElementById('results');
    let scrollAmount = container.offsetWidth * 0.8; // Scroll 80% of the container width

    if (direction === 1) {
        container.scrollLeft += scrollAmount;
    } else {
        container.scrollLeft -= scrollAmount;
    }
}

function searchFile() {
    const query = document.getElementById('searchInput').value.toLowerCase();

    // Show loading indicator
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Loading...</p>';

    if (query.trim() === "") {
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

    // Simulate a delay to show the loading indicator
    setTimeout(() => {
        displayResults(results);
    }, 500);
}

// Event listener to adjust the link on window resize
window.addEventListener('resize', adjustOtherWorkLink);

// Run on initial load
window.addEventListener('load', adjustOtherWorkLink);


//Nav Bar items
function toggleNavbar() {
    var navbar = document.querySelector(".navbar");
    navbar.classList.toggle("responsive");
}

function observerCallback(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // get the nav item corresponding to the id of the section
            // that is currently in view
            const navItem = navItems[entry.target.id];
            // add 'active' class on the navItem
            navItem.classList.add('active');
            // remove 'active' class from any navItem that is not
            // same as 'navItem' defined above
            Object.values(navItems).forEach((item) => {
                if (item != navItem) {
                    item.classList.remove('active');
                }
            });
        }
    });
}

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach((sec) => observer.observe(sec));

// Remove previous scroll button logic and add dragging functionality to the carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-container');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');

    prevButton.className = 'scroll-btn';
    prevButton.textContent = 'Prev';
    prevButton.onclick = () => scrollCarousel(-1);

    // Function to check and update buttons based on screen size
    function updateButtons() {
        if (window.innerWidth > 750) {
            // If screen width is greater than 750px, show the buttons
            if (!carousel.parentElement.contains(prevButton)) {
                carousel.parentElement.insertBefore(prevButton, carousel);
            }
            if (!carousel.parentElement.contains(nextButton)) {
                carousel.parentElement.appendChild(nextButton);
            }
        } else {
            // If screen width is 750px or smaller, remove the buttons
            if (carousel.parentElement.contains(prevButton)) {
                carousel.parentElement.removeChild(prevButton);
            }
            if (carousel.parentElement.contains(nextButton)) {
                carousel.parentElement.removeChild(nextButton);
            }
        }
    }

    // Initial check
    updateButtons();

    // Re-check when the window is resized
    window.addEventListener('resize', updateButtons);

    // Mouse and touch events for dragging
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchend', () => {
        isDown = false;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        carousel.scrollLeft = scrollLeft - walk;
    });
});

// Function to scroll the carousel
function scrollCarousel(direction) {
    const container = document.getElementById('results');
    let scrollAmount = container.offsetWidth * 0.8; // Scroll by 80% of the container width

    if (direction === 1) {
        container.scrollLeft += scrollAmount;
    } else {
        container.scrollLeft -= scrollAmount;
    }
}

// Toggle expand/collapse functionality
function toggleDetails(button) {
    const detailsDiv = button.nextElementSibling;

    // Close any open details
    const openDetails = document.querySelector('.details[style*="block"]');
    if (openDetails && openDetails !== detailsDiv) {
        openDetails.style.display = "none";
        openDetails.previousElementSibling.textContent = "Expand";
    }

    // Toggle the current card's details
    if (detailsDiv.style.display === "none" || detailsDiv.style.display === "") {
        detailsDiv.style.display = "block";
        button.textContent = "Collapse";
    } else {
        detailsDiv.style.display = "none";
        button.textContent = "Expand";
    }
}


