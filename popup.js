document.addEventListener('DOMContentLoaded', function() {
    let recordButton = document.getElementById('recordButton');
    let isRecording = false;
    let mediaRecorder;
    let recordedChunks = [];
    let stream;
  
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
            };
          })
          .catch(function(err) {
            console.log('The following error occurred: ' + err);
          });
      } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;
        recordButton.textContent = 'Start Recording';
      }
    });
  });
  