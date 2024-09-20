document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('logo');
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
    let source;
  
    function updateLogoState() {
        if (isRecording) {
            recordButton.classList.add('recording');
        } else {
            recordButton.classList.remove('recording');
        }
      }

    // Function to draw the sound bar visualization
    function drawSoundBar() {
      animationId = requestAnimationFrame(drawSoundBar);
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
  
      // Get audio data
      analyser.getByteTimeDomainData(dataArray);
  
      // Clear the canvas
      canvasCtx.fillStyle = '#f0f0f0';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
      // Set line style
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#ff0000';
  
      // Begin drawing
      canvasCtx.beginPath();
  
      let sliceWidth = WIDTH * 1.0 / dataArray.length;
      let x = 0;
  
      // Draw the waveform
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
  
    // Function to start visualization
    function startVisualization(audioStream) {
      // Create a new audio context
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
      // Create an analyser node
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.fftSize);
  
      // Create a source node from the audio stream
      source = audioContext.createMediaStreamSource(audioStream);
  
      // Connect the source to the analyser
      source.connect(analyser);
  
      // Start drawing the visualization
      drawSoundBar();
    }
  
    // Function to stop visualization
    function stopVisualization() {
      // Stop the animation frame
      cancelAnimationFrame(animationId);
  
      // Clear the canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Close the audio context
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    }
  
    // Function to play and visualize audio
    function playAndVisualizeAudio(audio) {
      // Create a new audio context
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
      // Create an analyser node
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.fftSize);
  
      // Create a source node from the audio element
      const sourceNode = audioContext.createMediaElementSource(audio);
  
      // Connect the source to the analyser and destination
      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
  
      // Start drawing the visualization
      drawSoundBar();
  
      // Play the audio
      audio.play();
  
      // Stop visualization when playback ends
      audio.onended = function() {
        stopVisualization();
      };
    }
  
    // Adjust canvas size to match its displayed size
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call
  
    // Handle record button click
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
            updateLogoState();
  
            // Collect recorded data
            mediaRecorder.ondataavailable = function(e) {
              if (e.data.size > 0) {
                recordedChunks.push(e.data);
              }
            };
  
            // When recording stops
            mediaRecorder.onstop = function() {
              let blob = new Blob(recordedChunks, { type: 'audio/webm' });
              let audioURL = URL.createObjectURL(blob);
              let audio = new Audio();
              audio.src = audioURL;
  
              // Stop recording visualization
              stopVisualization();
  
              // Stop the audio stream
              stream.getTracks().forEach(track => track.stop());
  
              // Play the audio with visualization
              playAndVisualizeAudio(audio);
              updateLogoState();
            };
  
            // Start visualization during recording
            startVisualization(stream);
          })
          .catch(function(err) {
            console.log('Error accessing microphone: ' + err);
          });
      } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;
        updateLogoState();
  
        // Stop the audio stream
        stream.getTracks().forEach(track => track.stop());
      }
    });
  });
  