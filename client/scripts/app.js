// YOUR CODE HERE:

var urlz = 'https://api.parse.com/1/classes/chatterbox';

// displayMessage(messages)
var displayMessages = function(messageData){
  //turn data into something readable

  //add that data into the messageBox $(".messageBox")

  //add a method for avaliable chat rooms 
  // display those rooms on side and allow poerson to enter and post from them
};



var retrieveMessages = function(){
  $.ajax({
    url: urlz,
    type: 'GET',
    success: function(data){
      displayMessages(data.results);
    },
    error: function(data){
      console.error("You're fucked ", data);
    }
  });
};


var postMessage = function(messageString){
  //construct the data
  var toTransmit = JSON.strigify({
    'userName': this.userName,
    'text': messageString,
    'roomName': 'lobby' //change this!
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
