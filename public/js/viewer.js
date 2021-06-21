let peerConnection;
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const socket = io.connect(window.location.origin);
const video = document.querySelector("video");
//document.getElementById("PlayButton").addEventListener("click",)
document.querySelector("#PlayButton").addEventListener("click",function(e){
  document.querySelector("video").play();
})


socket.on("offer", (id, description,room) => {
    peerConnection = new RTCPeerConnection(config);
    peerConnection
      .setRemoteDescription(description)
      .then(() => peerConnection.createAnswer())
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit("answer", id, peerConnection.localDescription,room);
      });
    peerConnection.ontrack = event => {
      
        document.querySelector("video").srcObject =  event.streams[0];
        document.querySelector("video").controls = false;
    };
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };

    peerConnection.oniceconnectionstatechange = event =>{
      if(peerConnection.iceConnectionState == 'disconnected') {
        document.querySelector("video").srcObject = null;
        document.querySelector("#PlayButton").innerHTML = "The Meeting has ended"
    }
    }
  });


  socket.on("candidate", (id, candidate) => {
    peerConnection
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
  });
  
  socket.on("connect", () => {
    socket.emit("watcher");
  });
  
  socket.on("broadcaster", () => {
    socket.emit("watcher");
  });

  socket.on("watcherleft", () => {
   console.log("user left")
  });
  
  window.onunload = window.onbeforeunload = () => {
    socket.close();
    peerConnection.close();
  };