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
//        document.getElementById('labnol').submit();
      };
      
      recognition.onerror = function(e) {
        recognition.stop();
      }
    }
  }