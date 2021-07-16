const peerConnections = {};
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const socket = io.connect(window.location.origin);
const video = document.querySelector("video");
const room = document.getElementById("RoomId").value;
document.querySelector("video").controls = false;
// Media contrains
const constraints = {
  video: { facingMode: "user" },
  // Uncomment to enable audio
  //audio: true
};
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    socket.emit("broadcaster",room);
  })
  .catch(error => console.error(error));

  socket.on("connect", ()=>{
    ///make api call to store id 
  })



  socket.on("watcher", id => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;
  
    let stream = video.srcObject;
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream)
    });
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };
  
    peerConnection
      .createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit("offer", id, peerConnection.localDescription,room);
      });
  });

  
  socket.on("answer", (id, description) => {
    peerConnections[id].setRemoteDescription(description);
  });

  
  socket.on("candidate", (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
  });
  

  socket.on("disconnectPeer", id => {
    console.log("user left")
    socket.emit("leave",room);
    peerConnections[id].close();

    delete peerConnections[id];
  });


  window.onunload = window.onbeforeunload = () => {
    socket.close();
  };
  