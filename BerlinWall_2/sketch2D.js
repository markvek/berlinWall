let table;
let worldMap;
let points = [];
let images = {};

function preload() {
    // Load the CSV file
    table = loadTable('berlin_wall_detail_image.csv', 'csv', 'header');
    // Load a world map image (you can use any world map image or find one online)
    worldMap = loadImage('Blue_Marble_2002.png');
    testImage = loadImage('Berlin-Wall-Piece-NYC.jpg');
    font = loadFont('lemon_milk/LEMONMILK-Medium.otf');
}

function setup() {
    createCanvas(1920, 960); // Size of the world map image
    background(255);
    image(worldMap, 0, 0);

    // Loop through the rows of the table and log the lat/long values
    for (let r = 0; r < table.getRowCount(); r++) {
        let row = table.getRow(r);
        let title = row.getString('Title');
        let location = row.getString('Location');
        let segment = row.getString('Segment');
        let imageName = row.getString('Image');
        let lat = row.getString('Latitude');
        let long = row.getString('Longitude');


        // Check if latitude and longitude are not empty
        if (lat == 0 && long == 0) {
            console.log(`Row ${r + 1}: Skipped due to invalid ZERO lat/long`);
        } else if (!isNaN(lat) && !isNaN(long)) {
            console.log(`Row ${r + 1}: Latitude = ${lat}, Longitude = ${long}`);

            // Convert lat/long to x/y using a Mercator projection
            let x = equirectX(long);
            let y = equirectY(lat);

            // Save the points
            points.push({ x: x, y: y, r: 5, title: title, location: location, segment: segment, image: images[imageName] }); // radius is 10 (half of 20)
        } else {
            console.log(`Row ${r + 1}: Skipped due to invalid lat/long`);
        }
    }

}


function draw() {
    // Redraw the map and points
    background(255);
    image(worldMap, 0, 0);

    // Draw the points
    for (let pt of points) {
        fill(255, 120);
        noStroke();
        ellipse(pt.x, pt.y, pt.r * 4, pt.r * 4);
    }

    // Check for hover
    checkHover();

    if (hoveredPoint) {
        let boxHeight = 160;
        let boxWidth = 260;
        //60;
        // if (hoveredPoint.image) {
        //     boxHeight += 75; // Adjust box height if image is present
        // }
        fill(255);
        textFont(font);
        stroke(0);
        rect(mouseX + 10, mouseY + 10, 200, boxHeight);
        fill(0);
        noStroke();
        textSize(8);
        textWrap(WORD);
        text(`Title: ${hoveredPoint.title}`, mouseX + 15, mouseY + 25, boxWidth);
        text(`Location: ${hoveredPoint.location}`, mouseX + 15, mouseY + 50, boxWidth - 40);
        text(`Segment: ${hoveredPoint.segment}`, mouseX + 15, mouseY + 75, boxWidth - 40);
        image(testImage, mouseX + 15, mouseY + 85, 100, 75);

        // if (hoveredPoint.image) {
        // image(hoveredPoint.image, mouseX + 15, mouseY + 65, 100, 75);
        // }
    }
}

// Mercator projection functions
function equirectX(lon) {
    return map(lon, -180, 180, 0, width);
}

function equirectY(lat) {
    return map(lat, 90, -90, 0, height);
}

function checkHover() {
    hoveredPoint = null; // Reset the hovered point
    for (let pt of points) {
        let d = dist(mouseX, mouseY, pt.x, pt.y);
        if (d < pt.r) {
            hoveredPoint = pt; // Set the hovered point
            break; // Exit the loop once the first hover is detected
        }
    }
}

function mousePressed() {
    // displayInfoBox();
    square(mouseX, mouseY, 150, 20);
}
