function startAsr() 
{
 
	 //Using Webkit SpeechRecognition API
	if (window.hasOwnProperty('webkitSpeechRecognition')) 
	{
    	var recognition = new webkitSpeechRecognition();
 
		recognition.continuous = true;
		recognition.interimResults = false;
 
		recognition.lang = "en-US";
		recognition.start();
      
 //Displaying the result
		recognition.onresult = function(e) 
		{
        //$("#transcript").val(e.results[0][0].transcript);
        	document.getElementById('userinput').value = e.results[0][0].transcript;
        	stopRecognition(recognition);
//        document.getElementById('labnol').submit();
		};
      
	    recognition.onerror = function(e) 
	    {
        	recognition.stop();
		}
    }
}
 
var baseUrl = "https://api.api.ai/v1/";
var accessToken = "35b35640bfc745819840070409a7059b";

function send() 
{
	var text = $("#userinput").val();
	var trans = $("#transcript").val();//document.getElementById('transcript').value;
	$.ajax(
	{
		type: "POST",
		url: baseUrl + "query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: 
		{
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ q: text, lang: "en" }),
		success: function(data) 
		{
			//reply is being parsed
			var reply = JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2);
			var val = trans + text + "\n" + JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2) + "\n\n";
			setResponse(val);
			tts(reply);
		},
		error: function() 
		{
			setResponse("Internal Server Error");
		}
	});

	setResponse("Loading...");
		
}

function switchRecognition() 
{
	if (recognition) 
	{
		stopRecognition();
	} 
	else 
	{
		startAsr();
	}
}

function setInput(text) 
{
	document.getElementById('userinput').value = text;
//	$("#userinput").val(text);
	send();
}
	
function updateRec() 
{
	$("#rec").text(recognition ? "Stop" : "Speak");
}
	
function setResponse(val) 
{
	$("#transcript").text(val);
//	document.getElementById('transcript').innerHTML = val;
	//$("#transcript").val(val);//document.getElementById('reply').innerHTML = val;
}
	
function stopRecognition(recognition) 
{
	if (recognition) 
	{
		recognition.stop();
		recognition = null;
		send();
	}
/*		updateRec();*/
}

function tts(valu)
{
    var u = new SpeechSynthesisUtterance();
   	var voices = window.speechSynthesis.getVoices();
    u.voice = voices[4]; // Note: some voices don't support altering params
    u.voiceURI = 'native';
   	u.volume = 1; // 0 to 1
    u.rate = 1; // 0.1 to 10
   	u.pitch = 2; //0 to 2
    u.text = valu;
   	u.lang = 'en-US';
    u.rate = 1;
/*    u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.'); }*/
   	speechSynthesis.speak(u);
}