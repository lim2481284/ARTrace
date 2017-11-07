window.onload = function() {
		var smoother = new Smoother([0.9999999, 0.9999999, 0.999, 0.999], [0, 0, 0, 0]),
			video = document.getElementById('video'),
			infoDisplayBox = document.getElementById('infoDisplay'),
			fist_pos_old,
			detector,
			detectorhand;
				
		try {
			compatibility.getUserMedia({video: true}, function(stream) {
				try {
					video.src = compatibility.URL.createObjectURL(stream);
				} catch (error) {
					video.src = stream;
				}
				compatibility.requestAnimationFrame(play);
			}, function (error) {
				alert('WebRTC not available');
			});
		} catch (error) {
			alert(error);
		}
		
		function play() {
			compatibility.requestAnimationFrame(play);
			if (video.paused) video.play();
          	
			if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
	          	
	          	// Prepare the detector once the video dimensions are known:
	          	if (!detector) {
		      		var width = ~~(60 * video.videoWidth / video.videoHeight);
					var height  =60;
		      		detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);
					
		      	}
          		
          		// Perform the actual detection:
				var coords = detector.detect(video, 1);
				if (coords[0]) {
					var coord = coords[0];
					coord = smoother.smooth(coord);
					
					// Rescale coordinates from detector to video coordinate space:
					coord[0] *= video.videoWidth / detector.canvas.width;
					coord[1] *= video.videoHeight / detector.canvas.height;
					coord[2] *= video.videoWidth / detector.canvas.width;
					coord[3] *= video.videoHeight / detector.canvas.height;
					
					// Display infoDisplayBox overlay: 
					infoDisplayBox.style.left    ='0%';
					infoDisplayBox.style.bottom     = '0%';
					$('#infoDisplay').animate({
						opacity: 1
					  }, 2000, function() {
					 });
					
					var coord = coords[0];
					for (var i = coords.length - 1; i >= 0; --i)
						if (coords[i][4] > coord[4]) coord = coords[i];
					
					/* Scroll window: */
					var fist_pos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
					if (fist_pos_old) {
						var dx = (fist_pos[0] - fist_pos_old[0]) / video.videoWidth,
								dy = (fist_pos[1] - fist_pos_old[1]) / video.videoHeight;
							document.getElementById("infoDisplay").scrollTop = dy*1000;
							document.getElementById("infoDisplay").scrollLeft = dx*1000;
					} else fist_pos_old = fist_pos;
					
				} else {
					var opacity = infoDisplayBox.style.opacity - 0.1;
					infoDisplayBox.style.opacity = opacity > 0 ? opacity : 0;
				}	

	          	// Prepare the detector once the video dimensions are known:
	          	if (!detectorhand) {
		      		var width = ~~(60 * video.videoWidth / video.videoHeight);
					var height  =60;
		      		detectorhand = new objectdetect.detector(width, height, 1.1, objectdetect.handfist);
					
		      	}				
				
          		// Perform the actual detection:
				var coords = detectorhand.detect(video, 1);
				if (coords[0]) {
					var coord = coords[0];
					
					/* Rescale coordinates from detector to video coordinate space: */
					coord[0] *= video.videoWidth / detectorhand.canvas.width;
					coord[1] *= video.videoHeight / detectorhand.canvas.height;
					coord[2] *= video.videoWidth / detectorhand.canvas.width;
					coord[3] *= video.videoHeight / detectorhand.canvas.height;
				
					/* Find coordinates with maximum confidence: */
					var coord = coords[0];
					for (var i = coords.length - 1; i >= 0; --i)
						if (coords[i][4] > coord[4]) coord = coords[i];
					
					/* Scroll window: */
					var fist_pos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
					if (fist_pos_old) {
						var dx = (fist_pos[0] - fist_pos_old[0]) / video.videoWidth,
								dy = (fist_pos[1] - fist_pos_old[1]) / video.videoHeight;
							document.getElementById("infoDisplay").scrollTop = dy*1000;
							document.getElementById("infoDisplay").scrollLeft = dx*1000;
					} else fist_pos_old = fist_pos;
		
				} 
			}
		}
	};
				
				/*
				
				//Image capture 
				var canvas = document.createElement("canvas");
				var scale = 0.25;
				video = $("#video").get(0);
				canvas.width = video.videoWidth * scale;
				canvas.height = video.videoHeight * scale;
				canvas.getContext('2d')
					.drawImage(video, 0, 0, canvas.width, canvas.height);
 
				var img = document.createElement("img");
				img.src = canvas.toDataURL("image/png");
				//download( canvas.toDataURL("image/png"), "test.png", "image/png");
				//console.log(img.src);
      			
				*/