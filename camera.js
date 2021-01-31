var startButton=''
var stopButton=''
var downloadButton=''
var Stream=''

//function for choosing the sources you want.
async function getStreamSources() {
    const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true, //do you want microphone audio?
        video: false //do you want camera video? (Set to false because you can't see two videos simultanously.)
    });
    const displayStream= await navigator.mediaDevices.getDisplayMedia({
        audio: true, //do you want audio from the computer/browser/tab?
        video: true  //do you want display video from the device?
    });
    //Combine user media and device media into a single stream
    Stream=new MediaStream([userStream.getTracks()[0], displayStream.getTracks()[0] ]);  
    return Stream
}

//function when the study loads
function initialize(){
    //Get the buttons so we can do stuff with them
    let startButton = document.getElementById("startButton");
    let stopButton = document.getElementById("stopButton");
    let downloadButton = document.getElementById("downloadButton");

    //When you click the start button, do this...
    startButton.addEventListener("click", function() {
    getStreamSources().then(stream => startRecording(stream)) //run the getStreamSources function, and send the stream to the startRecording function
    .then (recordedChunks => {  //then take the output from that and...
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" }); //turn it into a Blob object
        downloadButton.href =URL.createObjectURL(recordedBlob);  //give the Blob a URL and set it to the download button
        downloadButton.download = USER_UID+"RecordedVideo.webm"; //give the Blob a file name using the user-id for the experiment.
      })
      .catch(log);
    }, false);
    
    //When you click the stop button, do this...
    stopButton.addEventListener("click", function() {
      stop(Stream); //call the stop function
    }, false);
}

//function for when the start button is pushed
function startRecording(stream) {
  let recorder = new MediaRecorder(stream); //Create a recorder object with the stream
  let data = []; //create an array to store the stream
 
  recorder.ondataavailable = event => data.push(event.data); //once the recorder starts getting data, add it to data
  recorder.start(); //start the recording process
  
  //when it stops, stop.
  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });
 
  //return the stopped Promise and the recorded data.
  return Promise.all([
    stopped,
  ])
  .then(() => data);
}

//function for when the stop button is pushed
function stop(stream) {
  stream.getTracks().forEach(track => track.stop()); //for all tracks in the stream, stop each one.
}


