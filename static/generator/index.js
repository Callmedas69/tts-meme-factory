const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const fistImageTemplate = new Image();
fistImageTemplate.src = "/fist.png";
fistImageTemplate.crossOrigin = "anonymous";
const laserImageTemplate = new Image();
laserImageTemplate.src = "/laser.png";
laserImageTemplate.crossOrigin = "anonymous";

let canvasImage = new Image();
let fists = [];
let lasers = [];
let isDragging = false;
let currentElement = null;
let offsetX, offsetY;

canvas.width = 500;
canvas.height = 500;

document.getElementById("image-upload").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const buttonContainer = document.getElementById("button-container");
        buttonContainer.style.display = "flex";

        canvasImage.onload = function () {
            const scale = Math.min(canvas.width / canvasImage.width, canvas.height / canvasImage.height);
            const scaledWidth = canvasImage.width * scale;
            const scaledHeight = canvasImage.height * scale;
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;
            canvasImage.width = scaledWidth;
            canvasImage.height = scaledHeight;
            drawCanvas();
        };
        canvasImage.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("add-fist-button").addEventListener("click", function () {
    const fist = {
        image: fistImageTemplate,
        width: (canvas.width / 5) * 3,
        height: (canvas.height / 5) * 3,
        x: canvas.width / 2 - (canvas.width / 5) * 3 / 2,
        y: canvas.height / 2 - (canvas.height / 5) * 3 / 2,
        rotation: 0,
    };
    fists.push(fist);
    drawCanvas();
});

document.getElementById("add-laser-button").addEventListener("click", function () {
    const laser = {
        image: laserImageTemplate,
        width: (canvas.width / 5) * 3,
        height: (canvas.height / 5) * 3,
        x: canvas.width / 2 - (canvas.width / 5) * 3 / 2,
        y: canvas.height / 2 - (canvas.height / 5) * 3 / 2,
        rotation: 0,
    };
    lasers.push(laser);
    drawCanvas();
});

document.getElementById("resize-fist-slider").addEventListener("input", function (e) {
    const scale = e.target.value;
    fists.forEach((fist) => {
        const centerX = fist.x + fist.width / 2;
        const centerY = fist.y + fist.height / 2;
        fist.width = (canvas.width / 5) * scale * 2;
        fist.height = (canvas.height / 5) * scale * 2;
        fist.x = centerX - fist.width / 2;
        fist.y = centerY - fist.height / 2;
    });
    drawCanvas();
});

document.getElementById("rotate-fist-slider").addEventListener("input", function (e) {
    const rotation = (e.target.value * Math.PI) / 180;
    fists.forEach((fist) => {
        fist.rotation = rotation;
    });
    drawCanvas();
});

document.getElementById("resize-laser-slider").addEventListener("input", function (e) {
    const scale = e.target.value;
    lasers.forEach((laser) => {
        const centerX = laser.x + laser.width / 2;
        const centerY = laser.y + laser.height / 2;
        laser.width = (canvas.width / 5) * scale * 2;
        laser.height = (canvas.height / 5) * scale * 2;
        laser.x = centerX - laser.width / 2;
        laser.y = centerY - laser.height / 2;
    });
    drawCanvas();
});

document.getElementById("rotate-laser-slider").addEventListener("input", function (e) {
    const rotation = (e.target.value * Math.PI) / 180;
    lasers.forEach((laser) => {
        laser.rotation = rotation;
    });
    drawCanvas();
});

canvas.addEventListener("mousedown", function (e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    currentElement = null;

    fists.concat(lasers).forEach((element) => {
        if (
            mouseX > element.x &&
            mouseX < element.x + element.width &&
            mouseY > element.y &&
            mouseY < element.y + element.height
        ) {
            element.isDragging = true;
            offsetX = mouseX - element.x;
            offsetY = mouseY - element.y;
            currentElement = element;
        }
    });

    if (currentElement) {
        isDragging = true;
    }
});

canvas.addEventListener("mousemove", function (e) {
    if (isDragging && currentElement) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        currentElement.x = mouseX - offsetX;
        currentElement.y = mouseY - offsetY;
        drawCanvas();
    }
});

canvas.addEventListener("mouseup", function () {
    if (currentElement) {
        currentElement.isDragging = false;
        isDragging = false;
        currentElement = null;
    }
});

// Touch events for mobile devices
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (touch.clientX - rect.left) * scaleX;
    const mouseY = (touch.clientY - rect.top) * scaleY;
    currentElement = null;

    fists.concat(lasers).forEach((element) => {
        if (
            mouseX > element.x &&
            mouseX < element.x + element.width &&
            mouseY > element.y &&
            mouseY < element.y + element.height
        ) {
            element.isDragging = true;
            offsetX = mouseX - element.x;
            offsetY = mouseY - element.y;
            currentElement = element;
        }
    });

    if (currentElement) {
        isDragging = true;
    }
});

canvas.addEventListener("touchmove", function (e) {
    if (isDragging && currentElement) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (touch.clientX - rect.left) * scaleX;
        const mouseY = (touch.clientY - rect.top) * scaleY;
        currentElement.x = mouseX - offsetX;
        currentElement.y = mouseY - offsetY;
        drawCanvas();
    }
});

canvas.addEventListener("touchend", function () {
    if (currentElement) {
        currentElement.isDragging = false;
        isDragging = false;
        currentElement = null;
    }
});

document.getElementById("download-button").addEventListener("click", function () {
    const imageDataUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = "fight-fist.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    drawCanvas();
});

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvasImage, 0, 0, canvasImage.width, canvasImage.height);
    applyGradientMapFilter();

    fists.forEach((fist) => {
        ctx.save();
        ctx.translate(fist.x + fist.width / 2, fist.y + fist.height / 2);
        ctx.rotate(fist.rotation);
        ctx.drawImage(fist.image, -fist.width / 2, -fist.height / 2, fist.width, fist.height);
        ctx.restore();
    });

    lasers.forEach((laser) => {
        ctx.save();
        ctx.translate(laser.x + laser.width / 2, laser.y + laser.height / 2);
        ctx.rotate(laser.rotation);
        ctx.drawImage(laser.image, -laser.width / 2, -laser.height / 2, laser.width, laser.height);
        ctx.restore();
    });
}

function applyGradientMapFilter() {
    ctx.drawImage(canvasImage, 0, 0, canvasImage.width, canvasImage.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const redColor = [243, 4, 13];
    const blueColor = [7, 11, 40];

    ctx.putImageData(imageData, 0, 0);
}
