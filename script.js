let constraintObj = { 
            audio: true, 
            video: { 
                facingMode: "user", 
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 } 
						}
        }; 
        // width: 1280, height: 720  -- preference only
        // facingMode: {exact: "user"}
        // facingMode: "environment"
        
        //handle older browsers that might implement getUserMedia in some way
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
            navigator.mediaDevices.getUserMedia = function(constraintObj) {
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraintObj, resolve, reject);
                });
            }
        }else{
            navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device=>{
                    console.log(device.kind.toUpperCase(), device.label);
                    //, device.deviceId
                })
            })
            .catch(err=>{
                console.log(err.name, err.message);
            })
        }

        navigator.mediaDevices.getUserMedia(constraintObj)
        .then(function(mediaStreamObj) {
            //connect the media stream to the first video element
            let video = document.querySelector('video');
            if ("srcObject" in video) {
                video.srcObject = mediaStreamObj;
            } else {
                //old version
                video.src = window.URL.createObjectURL(mediaStreamObj);
            }
            
            video.onloadedmetadata = function(ev) {
                //show in the video element what is being captured by the webcam
                video.play();
            };
            
            //add listeners for saving video/audio
            let start = document.getElementById('btnStart');
            let stop = document.getElementById('btnStop');
            let vidSave = document.getElementById('vid2');
            let mediaRecorder = new MediaRecorder(mediaStreamObj);
            let chunks = [];
            

            mediaRecorder.start();
            console.log(mediaRecorder.state);
          
            setTimeout(function(){
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
              
            },5500)
            
            mediaRecorder.ondataavailable = function(ev) {
                chunks.push(ev.data);
            }
            mediaRecorder.onstop = (ev)=>{
                let blob = new Blob(chunks, { 'type' : 'video/webm;' });
                chunks = [];
                let videoURL = window.URL.createObjectURL(blob);
                vidSave.src = videoURL;
                console.log(videoURL)
                uploadToStorage = (imageURL) = >{

                  getFileBlob(imageURL, blob =>{
                    firebase.storage().ref().put(blob).then(function(snapshot) {
                    console.log('Uploaded a blob or file!');
                  })
                })
            }
            }  
          
        })
        .catch(function(err) { 
            console.log(err.name, err.message); 
        });
        
        /*********************************
        getUserMedia returns a Promise
        resolve - returns a MediaStream Object
        reject returns one of the following errors
        AbortError - generic unknown cause
        NotAllowedError (SecurityError) - user rejected permissions
        NotFoundError - missing media track
        NotReadableError - user permissions given but hardware/OS error
        OverconstrainedError - constraint video settings preventing
        TypeError - audio: false, video: false
        *********************************/

				/* Trigger file download on button click */
				var timesDownloaded = 0;
				function download(file, text) { 
              
                //creating an invisible element 
                var element = document.createElement('a'); 
                element.setAttribute('href',  
                'data:text/plain;charset=utf-8, ' 
                + encodeURIComponent(text)); 
                element.setAttribute('download', file); 
              
                // Above code is equivalent to 
                // <a href="path of file" download="file name"> 
              
                document.body.appendChild(element); 
              
                //onClick property 
                element.click(); 
              
                document.body.removeChild(element); timesDownloaded++;
            } 
              
            // Start file download. 
            document.getElementById("btn") 
            .addEventListener("click", function() { 
                alert("HOW TO DOWNLOAD:\n\nPress start recording, and when you're ready, press stop recording.")
								setTimeout(function(){
									alert("Then, on the bottom video press fullscreen, and then the three dots (menu) then press download.")
								}, 1000)
            }, false); 
