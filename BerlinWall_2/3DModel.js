let objModel;
let image;
let rotating = true;

function preload() {
    // Load the OBJ file
    objModel = loadModel('Earth.obj', true);
    image = loadImage('Mercator-projection.jpg');
}

function setup() {
    createCanvas(800, 600, WEBGL);
}

function draw() {
    background(200);

    // Set up the camera
    orbitControl();

    if (rotating) {
        rotateY(frameCount * 0.01);
    }
    // pop();

    // Center the model and display it
    // translate(0, 0, 0);
    // scale(1); // Adjust the scale if necessary

    // Display the model
    push();
    scale(1, 1, 1);
    texture(image);
    noStroke();

    // Display the model
    // model(objModel);
    sphere();
    pop();


}
