(function() {

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

  getVideo();


  
})();