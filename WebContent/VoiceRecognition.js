var speak = 0;
var record = 0;
var log = log4javascript.getDefaultLogger();

function StartRecording() 
{
	if (record == 0) 
	{
		document.getElementById("micr").src = "../Resources/micw.png";
		record = 1;
		startAsr();
	}
	else
		if(record == 1)
		{
			record = 0;
			document.getElementById("micr").src = "../Resources/mic.png";
		}
}

function StartSpeaking() 
{
	if(speak == 0)
	{
		speak = 1;
		tts();
		document.getElementById("spkr").src = "../Resources/loud.png";
	}
	else
		if(speak == 1)
		{
			speak = 0;
			document.getElementById("spkr").src = "../Resources/mute.png";
		}
}




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
        	stopRecognition(recognition);
        	document.getElementById('userinput').innerHTML = e.results[0][0].transcript;
        	log.info("User: "+e.results[0][0].transcript);
		};
      
	    recognition.onerror = function(e) 
	    {
	    	log.error("An error occured in recognition");
        	recognition.stop();
		}
    }
}
 
var baseUrl = "https://api.api.ai/v1/";
var accessToken = "35b35640bfc745819840070409a7059b";
var reply = "";
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
			reply = JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2);
			var val = trans + text + "\n" + JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2) + "\n\n";
			log.info("System: "+val);
			setResponse(val);
			if (speak == 1) 
			{
				tts();
			}
		},
		error: function() 
		{
			setResponse("Internal Server Error");
			log.error("Internal Server Error");
		}
	});

	setResponse("Loading...");
	log.info("Loading");	
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

function tts()
{
    var u = new SpeechSynthesisUtterance();
   	var voices = window.speechSynthesis.getVoices();
    u.voice = voices[10]; // Note: some voices don't support altering params
    u.voiceURI = 'native';
   	u.volume = 1; // 0 to 1
    u.rate = 1; // 0.1 to 10
   	u.pitch = 0.1; //0 to 2
    u.text = reply;
   	u.lang = 'en-US';
    u.rate = 1;
/*    u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.'); }*/
   	speechSynthesis.speak(u);
}