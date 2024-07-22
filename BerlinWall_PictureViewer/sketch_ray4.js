let globe;
let table;
let dataPoints = [];
let rotating = true;
let selectedPoint = null;
let screenPoints = [];
let selectedPoints = [];
let currentIndex = -1;

let textureRotationX = 0;
let textureRotationY = 1.575;
let cam;
let targetLat = 0;
let targetLon = 0;

function preload() {
    // Load the CSV file
    table = loadTable('5p/berlin_wall_detail_with_latlong.csv', 'csv', 'header');
    testImage = loadImage('Berlin-Wall-Piece-NYC.jpg');
    font = loadFont('5p/lemon_milk/LEMONMILK-Medium.otf');
    imageMap = loadImage('5p/Blue_Marble_2002.png');
}

function setup() {
    let myCanvas3D = createCanvas(800, 600, WEBGL); // Size of the world map image
    myCanvas3D.parent('myContainer3D');
    globe = new Globe();
    cam = createCamera();

    // Process the CSV file
    for (let r = 0; r < table.getRowCount(); r++) {
        let row = table.getRow(r);
        let lat = row.getString('Latitude');
        let long = row.getString('Longitude');
        let location = row.getString('Location');
        let title = row.getString('Title');
        let segment = row.getString('Segment');

        if (lat != 0 && long != 0 && lat != "" && long != "") {
            dataPoints.push({ lat, long, title, location, segment, viewed: false });
        } else {
            console.log(`Row ${r + 1}: Skipped due to invalid lat/long`);
        }
    }
}

function draw() {
    background(25);

    // Auto Rotate the globe
    if (rotating) {
        rotateY(frameCount * 0.001);
    }

    // Enable orbit control for mouse interactions
    orbitControl();

    noStroke();
    push();
    // Apply texture rotation
    rotateX(textureRotationX);
    rotateY(textureRotationY);
    texture(imageMap);
    sphere(globe.radius); // Use the globe's radius for the sphere
    pop();

    // Draw the data points on the globe
    for (let point of dataPoints) {
        globe.plotPoint(point.lat, point.long, point === selectedPoint, point.viewed);
    }

    // Draw the projected screen points
    for (let screenPos of screenPoints) {
        push();
        stroke(255); // White color
        strokeWeight(2); // Adjusted for visibility
        point(screenPos.x, screenPos.y);
        pop();
    }

    // Display the hover experience box in 2D
    // if (selectedPoint) {
    //     displayHoverExperince();
    // }
}

class Globe {
    constructor() {
        this.radius = 200; // Define a radius for the globe
    }

    plotPoint(lat, long, isSelected, isViewed) {
        let { x, y, z } = this.getPointCoordinates(lat, long);

        push();
        translate(x, y, z);
        if (isSelected) {
            fill(255, 0, 0); // Red color for selected point
            sphere(10);
        } else if (isViewed) {
            fill(255, 255, 0); // Orange color for viewed points
            sphere(5);
        } else {
            fill(150, 150, 150); // Yellow color for non-selected points
            sphere(3);
        }
        pop();
    }

    getPointCoordinates(lat, long) {
        let theta = radians(-lat); // Invert latitude to correct orientation
        let phi = radians(-long) + PI;

        let x = this.radius * cos(theta) * cos(phi);
        let y = this.radius * sin(theta);
        let z = this.radius * cos(theta) * sin(phi);

        return { x, y, z };
    }
}

function mousePressed() {
    let closestPoint = null;
    let minDistance = Infinity;
    screenPoints = []; // Clear previous screen points

    for (let point of dataPoints) {
        let { x, y, z } = globe.getPointCoordinates(point.lat, point.long);
        let screenPos = createVector(x, y, z);

        // Store the screen position for drawing
        screenPoints.push(screenPos);

        let distance = dist(mouseX, mouseY, screenPos.x, screenPos.y);

        if (distance < minDistance && distance < 1000) { // Adjust threshold as needed
            minDistance = distance;
            closestPoint = point;
        }
    }

    selectedPoint = closestPoint;
}

function displayHoverExperince() {
    console.log('click');
    rotating = false;
    let boxYadj = -300;
    let boxXadj = -400;
    rotating = false;
    push();
    resetMatrix();
    ortho();
    resetMatrix();
    let boxHeight = 155;
    fill(255);
    textFont(font);
    stroke(0);
    rect(mouseX + boxXadj, mouseY + boxYadj, 200, boxHeight);
    fill(0);
    noStroke();
    textSize(12);
    text(`Title: ${selectedPoint.title}`, mouseX + boxXadj + 15, mouseY + boxYadj + 25);
    text(`Location: ${selectedPoint.location}`, mouseX + boxXadj + 15, mouseY + boxYadj + 40);
    text(`Segment: ${selectedPoint.segment}`, mouseX + boxXadj + 15, mouseY + boxYadj + 55);
    // image(testImage, mouseX + boxXadj + 15, mouseY + boxYadj + 65, 100, 75);
    // image(testImage, mouseX + boxXadj + 15, mouseY + boxYadj + 65, 100, 75);
    console.log(`Title: ${selectedPoint.title}`);
    console.log(`Location: ${selectedPoint.location}`);
    console.log(`Segment: ${selectedPoint.segment}`);

    // Update the text in the HTML element with ID 'infoText'
    document.getElementById('infoText').innerHTML = `
        Title: ${selectedPoint.title} <br>
        Location: ${selectedPoint.location} <br>
        Segment: ${selectedPoint.segment}
    `;

    pop();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        goBackToPreviousPoint();
    } else if (keyCode === RIGHT_ARROW) {
        selectNextOrRandomPoint();
    }
    console.log(textureRotationY);
}

function selectNextOrRandomPoint() {
    if (currentIndex < selectedPoints.length - 1) {
        currentIndex++;
        selectedPoint = selectedPoints[currentIndex];
    } else {
        let remainingPoints = dataPoints.filter(point => !selectedPoints.includes(point));
        if (remainingPoints.length > 0) {
            let randomIndex = floor(random(remainingPoints.length));
            selectedPoint = remainingPoints[randomIndex];
            selectedPoints.push(selectedPoint);
            currentIndex++;
        } else {
            console.log('All points have been selected');
        }
    }
    selectedPoint.viewed = true;
    centerCameraOnPoint(selectedPoint);
    displayHoverExperince();
}

function goBackToPreviousPoint() {
    if (currentIndex > 0) {
        currentIndex--;
        selectedPoint = selectedPoints[currentIndex];
        centerCameraOnPoint(selectedPoint);
        displayHoverExperince();
    }
}

function centerCameraOnPoint(point) {
    let lat = point.lat;
    let lon = point.long;

    let theta = radians(-lat);
    let phi = radians(-lon) + PI;

    let camX = 1000 * cos(theta) * cos(phi);
    let camY = 1000 * sin(theta);
    let camZ = 1000 * cos(theta) * sin(phi);

    cam.setPosition(camX, camY, camZ);
    cam.lookAt(0, 0, 0);
}
