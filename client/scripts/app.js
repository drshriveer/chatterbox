// YOUR CODE HERE:

var urlz = 'https://api.parse.com/1/classes/chatterbox';

// displayMessage(messages)
var displayMessages = function(messageData){
  $('.messageList').html("");
  _(messageData).each(function(msg){
    $('.messageList').append(msgConstruct(msg));
  });
};

var msgConstruct =function(msg){
  var user = msg.username;
  var message = (msg.text || "").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  var time = moment(msg.createdAt).fromNow();
  return '<li><em>' + user + ':</em>\t' + message + '\t<span class="time">' + time + '</span></li>';
};


var retrieveMessages = function(){
  $.ajax({
    url: urlz,
    type: 'GET',
    success: function(data){
      displayMessages(data.results);
      console.log(data);
    },
    error: function(data){
      console.error("You're fucked ", data);
    }
  });
};


var postMessage = function(messageString){
  //construct the data
  var toTransmit = JSON.stringify({
    'username': location.search.split("=")[1],
    'text': messageString,
    'roomname': 'lobby' //change this!
  });

   $.ajax({
      url: urlz,
      type: 'POST',
      data: toTransmit,
      contentType: 'application/json',
      success: function(data){
        retrieveMessages();
      },
      error: function(data){
        console.log('chatterbox: Failed to send message', data);
      }
   });
};
// retrievemessages() returns messages

// refresh messages
    // uses setTimeout(function(retrieveMessages()) {}, 1000);

//postMessage(text)
    // strigify json object with userName, roomName, text
    // called when user pushes 'send' button.

//onButtonClick() for getting new messages
retrieveMessages();
setInterval(function(){
  retrieveMessages();
}, 5000);
