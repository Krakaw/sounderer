document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('recordButton');
    const canvas = document.getElementById('soundBar');
    const canvasCtx = canvas.getContext('2d');
    
    let isRecording = false;
    let mediaRecorder;
    let recordedChunks = [];
    let stream;
    let audioContext;
    let analyser;
    let dataArray;
    let animationId;
  
    function drawSoundBar() {
      animationId = requestAnimationFrame(drawSoundBar);
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
  
      analyser.getByteTimeDomainData(dataArray);
  
      canvasCtx.fillStyle = '#f0f0f0';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#ff0000';
  
      canvasCtx.beginPath();
  
      let sliceWidth = WIDTH * 1.0 / dataArray.length;
      let x = 0;
  
      for(let i = 0; i < dataArray.length; i++) {
  
        let v = dataArray[i] / 128.0;
        let y = v * HEIGHT / 2;
  
        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
  
        x += sliceWidth;
      }
  
      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    }
  
    recordButton.addEventListener('click', function() {
      if (!isRecording) {
        // Start recording
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(function(s) {
            stream = s;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            isRecording = true;
            recordButton.textContent = 'Stop Recording';
            recordedChunks = [];
  
            mediaRecorder.ondataavailable = function(e) {
              if (e.data.size > 0) {
                recordedChunks.push(e.data);
              }
            };
  
            mediaRecorder.onstop = function() {
              let blob = new Blob(recordedChunks, { type: 'audio/webm' });
              let audioURL = URL.createObjectURL(blob);
              let audio = new Audio(audioURL);
              audio.play();
  
              // Stop all tracks of the stream
              stream.getTracks().forEach(track => track.stop());
  
              // Stop visualizer
              cancelAnimationFrame(animationId);
              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
              // Close audio context
              if (audioContext) {
                audioContext.close();
              }
            };
  
            // Setup audio context for visualization
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            dataArray = new Uint8Array(analyser.fftSize);
            source.connect(analyser);
  
            // Start visualizer
            drawSoundBar();
          })
          .catch(function(err) {
            console.log('Error accessing microphone: ' + err);
          });
      } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;
        recordButton.textContent = 'Start Recording';
      }
    });
  });

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial call
  