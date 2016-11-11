/**
 * @author Prem Ankur
 */
 function startAsr() {
 
	 //Using Webkit SpeechRecognition API
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
      var recognition = new webkitSpeechRecognition();
 
      recognition.continuous = true;
      recognition.interimResults = false;
 
      recognition.lang = "en-US";
      recognition.start();
      
 //Displaying the result
      recognition.onresult = function(e) {
        document.getElementById('transcript').innerHTML
                                 = e.results[0][0].transcript;
        recognition.stop();
        send();
//        document.getElementById('labnol').submit();
      };
      
      recognition.onerror = function(e) {
        recognition.stop();
      }
    }
    send();
  }
 
 var baseUrl = "https://api.api.ai/v1/";
 var accessToken = "35b35640bfc745819840070409a7059b";
 function send() {
		var text =  document.getElementById('transcript').innerHTML;
		$.ajax({
			type: "POST",
			url: baseUrl + "query?v=20150910",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + accessToken
			},
			data: JSON.stringify({ q: text, lang: "en" }),
			success: function(data) {
				setResponse(JSON.stringify(data, undefined, 2));
			},
			error: function() {
				setResponse("Internal Server Error");
			}
		});
		setResponse("Loading...");
	}
 function switchRecognition() {
		if (recognition) {
			stopRecognition();
		} else {
			startAsr();
		}
	}
	function setInput(text) {
		$("#transcript").val(text);
		send();
	}
	function updateRec() {
		$("#rec").text(recognition ? "Stop" : "Speak");
	}
	function setResponse(val) {
		document.getElementById('reply').innerHTML = val;
	}
	function stopRecognition() {
		if (recognition) {
			recognition.stop();
			recognition = null;
		}
		updateRec();
	}