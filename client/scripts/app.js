// YOUR CODE HERE:

var urlz = 'https://api.parse.com/1/classes/chatterbox';

// displayMessage(messages)
var displayMessages = function(messageList){

};

var retrieveMessages = function(){
  $.ajax({
    url: urlz,
    type: 'GET',
    sucess: function(messages){
      console.log(messages);
    },
    error: function(data){
      console.log('chatterbox: Failed to get messages', data);
    }
  });
};


var postMessage = function(messageString){
  //construct the motha fucka 
  var toTransmit = JSON.strigify({
    'userName': this.userName,
    'text': messageString,
    'roomName': 'lobby' //change this!
  });

   $.ajax({
      url: urlz,
      type: 'POST',
      data: toTransmit,
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
