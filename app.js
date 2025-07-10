const apiKey = "AIzaSyCCkAZZ1yKG7wXgOUUdzKMpU8zOAdPaWYA"; 

const sendBtn = document.querySelector('#sendBtn')

const voiceBtn = document.querySelector('#getVoiceResponse')

let voice = false;

const utterance = new SpeechSynthesisUtterance()

let dataCopy

const userInput = document.getElementById("user-input");
window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition

const recognition = new SpeechRecognition()

voiceBtn.addEventListener('click', function()
{
    recognition.start()
})

console.log(recognition)

recognition.interimResults = false;

recognition.onresult = function(e)
{

    voice = true;

    
    dataCopy = e.results[0][0].transcript

    utterance.text = dataCopy
    
    console.log(data)
    
    
}

recognition.onend = function()
{
        sendMessage()
    
}

async function sendMessage() {

    console.log('Works fine')

    if(voice)
    {
         addMessage("user", dataCopy);
        try {

    const url =    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: dataCopy,
                    }],
                }],
            })
    });

    const data = await response.json();
    const botReply =  data.candidates[0].content.parts[0].text;
    utterance.text = botReply
    addMessage("bot", botReply);
  } catch (error) {
    console.error("Error:", error);
    addMessage("bot", "Sorry, there was a problem contacting the AI.");
  }

  voice = false;


  speechSynthesis.speak(utterance)

  return

    }

  const message = userInput.value.trim();
  if (message === "") return;

  addMessage("user", message);
  userInput.value = "";


  try {

    const url =    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message,
                    }],
                }],
            })
    });

    const data = await response.json();
    const botReply =  data.candidates[0].content.parts[0].text;
    addMessage("bot", botReply);
  } catch (error) {
    console.error("Error:", error);
    addMessage("bot", "Sorry, there was a problem contacting the AI.");
  }
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(`${sender}-message`);

  if(sender === 'bot')
  {
    let len = text.length
    let n = 1;
    let timer = setInterval((element) => 
    {
        messageDiv.innerHTML = text.slice(0,n)
        n+= 1

        if(len == n)
        {
            clearInterval(timer)
        }
    })
  }
  else 
  {
      messageDiv.textContent = text;
    }
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage)
