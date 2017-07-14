
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Access users webcam
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    // returns a Promise...
    .then(localMediaStream => {
      // convert media stream obj into url and set as video src attribute
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!`, err);
    });
}

// Pipeline frame from video feed through canvas element
function paintToCanvas() {
  const width = 640;
  const height = 480;
  canvas.width = width;
  canvas.height = height;
  // Every some milliseconds, take an image from the webcam and put into canvas
  setInterval(() => {
    // pass drawImage an image or video element, and it will paint it to the canvas
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height); 
    // mess with them
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1 // creates ghosting effect
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 20);
}

function takePhoto() {
  // play sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas. This will base64 representation of the image
  // append image link of downloadable snapshot
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Handsome Man">`;
  strip.insertBefore(link, strip.firstchild);
}

function redEffect(pixels) {
  // for loop since we don't have access to normal array methods on special large array
  // [0: red, 1: green, 2: blue, 3: alpha, ..repeats throughout array]
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50;  // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {

  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1];  // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  // obj that holds our min and max green
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels);
}

getVideo();

// once video is played, it will emit a 'canplay' event, then paintToCanvas
video.addEventListener('canplay', paintToCanvas);
  