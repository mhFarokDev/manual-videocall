const camerabutton = document.getElementById('camerabutton')
const microPhoneButton = document.getElementById('microPhoneButton')
const screenSheare = document.getElementById('screenSheare')
const s1 = document.getElementById('s1')
const s2 = document.getElementById('s2')

let localStream;
let remoteStream;
let peerConnection;
// ice server (google strn server)
let servers = {
    iceServers : [
        {
            urls : ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}


// create RTC offer (get answer, add answer)
const createOffer = async () =>{
    peerConnection = new RTCPeerConnection(servers)

    // get empty remote stream
    remoteStream = new MediaStream()
    s1.srcObject = remoteStream
    // localstream
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)
    })



    peerConnection.ontrack = async(event) =>{
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
        })
    }



    //  check ice candidate (who is host)
    peerConnection.onicecandidate = async (event) =>{
        if (event.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }

    }

    // create a offer
    let offer = await peerConnection.createOffer()
    document.getElementById('offer-sdp').value = JSON.stringify(offer)
    // offer set in local description
    await peerConnection.setLocalDescription(offer)
    
}

// create answer
const createAnswer = async () =>{
    peerConnection = new RTCPeerConnection(servers)

    // get empty remote stream
    remoteStream = new MediaStream()
    s1.srcObject = remoteStream
    // localstream
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)
    })



    peerConnection.ontrack = async(event) =>{
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
        })
    }



    //  check ice candidate (who is host)
    peerConnection.onicecandidate = async (event) =>{
        if (event.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }

    }

    // recived offer
    let get_offer = document.getElementById('offer-sdp').value
    get_offer = JSON.parse(get_offer)
    await peerConnection.setRemoteDescription(get_offer)

    // create a offer
    let answer = await peerConnection.createAnswer()
    document.getElementById('answer-sdp').value = JSON.stringify(answer)

    // offer set in local description
    await peerConnection.setLocalDescription(answer)
    
}



// add answer
const addAnswer = async() =>{

    let answer = document.getElementById('add-ans-sdp').value;
    answer = JSON.parse(answer)
    await peerConnection.setRemoteDescription(answer)
}

document.getElementById('createOffer').onclick = () =>{
    createOffer()
}
document.getElementById('createAns').onclick = () =>{
    createAnswer()
}
document.getElementById('addAns').onclick = () =>{
    addAnswer()
}












const webCamCOntrol = async () =>{
    await navigator.mediaDevices.getUserMedia({video : true, audio : true})
    .then(stream => {
        localStream = stream
        localStream.getVideoTracks()[0].enabled = false;
        localStream.getAudioTracks()[0].enabled = false;
    })
    .catch(err =>{
        console.log(err);
    })

    }
webCamCOntrol()





// camera button action
let cameraStatus = false;
camerabutton.onclick = (e) =>{
    cameraStatus = !cameraStatus;
    s2.style.display = 'block'
    localStream.getVideoTracks()[0].enabled = cameraStatus;
    s2.srcObject = localStream;
    e.target.classList.toggle('active')
    if (!cameraStatus) {
        s2.style.display = 'none'
    }
}


// mic button action
let micStatus = false;
microPhoneButton.onclick = (e) =>{
    micStatus = !micStatus;
    localStream.getAudioTracks()[0].enabled = micStatus;
    e.target.classList.toggle('active')
}



