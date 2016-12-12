var speak = 0;
var record = 0;
var inp = "";
var baseUrl = "https://api.api.ai/v1/";
var accessToken = "5b096d6112a14048be2761bc7176dcae";
var reply = "";
var link = "";
var sesId = 0;
var log = log4javascript.getDefaultLogger();


var $messages = $('.messages-content'),
    d, h, m,
    i = 0;


function StartRecording() 
{
  if (record == 0) 
  {
    document.getElementById("micr").innerHTML = "Listening";
    record = 1;
    startAsr();
  }
  else
    if(record == 1)
    {
      record = 0;
      document.getElementById("micr").innerHTML = "Speak!";
    }
}


function StartSpeaking() 
{
  if(speak == 0)
  {
    speak = 1;
    tts();
    document.getElementById("spkr").src = "Resources/loud.png";
  }
  else
    if(speak == 1)
    {
      speak = 0;
      document.getElementById("spkr").src = "Resources/mute.png";
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
        inp = e.results[0][0].transcript;
        document.getElementById('userinput').value = inp;
        log.info("User: "+ inp );
        stopRecognition(recognition);
    };
      
      recognition.onerror = function(e) 
      {
          recognition.stop();
          log.error("An error occured in recognition");
    }
  }
}


function stopRecognition(recognition) 
{
  if (recognition) 
  {
    recognition.stop();
    recognition = null;
    msg = inp;
    record = 0;
    document.getElementById("micr").innerHTML = "Speak!";
    insertMessage();
    send();
  }
}

function send() 
{
  var text = inp;
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
    data: JSON.stringify({ q: text, lang: "en", sessionId: sesId }),
    success: function(data) 
    {
      //reply is being parsed
      reply = JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2);
      
      link = JSON.stringify(data['result']['action'],undefined,2);
      var linkArr = link.split('"');
      
      systemMessage(reply);
      log.info("System: "+reply);
      
      if(linkArr[1]=="webpage.\\"){
    	  log.info("Link opened1 : "+linkArr[2]);
    	  linkArr[2] = linkArr[2].substring(0,linkArr[2].lastIndexOf("/"))
      var win = window.open(linkArr[2],'','height=700,width=500');
//      win.focus();
      log.info("Link opened : "+linkArr[2]);
      }
      
      if (speak == 1) 
      {
        tts();
      }

    },
    error: function() 
    {
      setResponse("Internal Server Error");
      log.error("Internal server Error");
    }
  });

  setResponse("Loading...");
    
}


$(window).load(function() 
{
  $messages.mCustomScrollbar();
  setTimeout(function() 
  {
  }, 100);
});


function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}


function insertMessage() 
{
  msg = $('.message-input').val();
  
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
}


$('.message-submit').click(function() {
  insertMessage();
});


$(window).on('keydown', function(e) 
{
  if (e.which == 13) 
  {
    event.preventDefault();
    inp = document.getElementById('userinput').value;
    insertMessage();
    send();
    return false;
  }
})


function systemMessage(text) 
{
  if ($('.message-input').val() != '') 
  {
    return false;
  }
  $('<div class="message new"><figure class="avatar"><img src="Resources/icon.png" /></figure>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
  updateScrollbar();
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
//  $("#userinput").val(text);
  send();
}
  
function updateRec() 
{
  $("#rec").text(recognition ? "Stop" : "Speak");
}
  
  

function tts()
{
   	var u = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    u.voice = voices[2]; // Note: some voices don't support altering params
//    u.voiceURI = 'native';
//    u.volume = 1; // 0 to 1
//    u.rate = 1; // 0.1 to 10
//    u.pitch = 1; //0 to 2	
    u.text = reply;
//    u.lang = 'en-US';
    u.rate = 1;
    speechSynthesis.speak(u);
}
