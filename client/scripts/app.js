// YOUR CODE HERE:

var urlz = 'https://api.parse.com/1/classes/chatterbox';
var users = {};
var chatrooms = {};
var friends = {};

// render loops though recieved message data
// then delegates tasks for populating parts of the chat room
// such as messages, users, chatrooms
var render = function(messageData){
  messageData = messageData.reverse();
  $('.messageList').html("");
  _(messageData).each(function(msg){
    var chatroom = escape(msg.roomname);
    var user = escape(msg.username);
    var message = escape(msg.text); //replace
    var time = moment(msg.createdAt).fromNow();

    populateMessages(user, message, time);
    // populateFriendsList(); fix
    populateRoomList(chatroom);
  });

  $('.messageBox').scrollTop(9000); //scrolls to the top
};


var populateMessages =function(user, message, time){
  var output = $('<li><em>' + user + '</em>:\t' + message + '\t<span class="time">' + time + '</span></li>');
  if(friends[user]){ output.addClass('friendList');}
  $('.messageList').append(output);
};

var populateFriendsList = function(){
  $('.users').text('');
  for (var name in friends){
    var output = $('<li>' + curtail(name) + '</li>');
    $('.users').append(output);
  }
};

var populateRoomList = function(chatroom){
  if(chatrooms[chatroom]){return;}
  var output = $('<li class="room">' + curtail(chatroom) + '</li>');
  $('.chatrooms').append(output);
  chatrooms[chatroom] = true;
};

// var submitMessage = function(){
//   var toTransmit = JSON.stringify({
//     'username': location.search.split("=")[1],
//     'text': $('.inputField').text(),
//     'roomname': 'lobby' //change this!
//   });

//   Messages.post(toTransmit);
//   $('.inputField').text('');
// };

//-------- here be helpers
var curtail = function(string){
  if(string.length < 12){return string;}
  return(string.slice(0,12) + '..');
};

var escape = function(string){
  if(!string){return "";}
  return string.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
};
//-------- end of helpers

var Messages = function(){};

Messages.prototype.retrieve = function(options){
  $.ajax({
    url: urlz,
    type: 'GET',
    data: options.data,
    success: options.success,
    error: options.error
  });
};

Messages.prototype.post = function(options){
   $.ajax({
      url: urlz,
      type: 'POST',
      data: options.data,
      contentType: 'application/json',
      success: options.success,
      error: options.error
   });
};

Messages.prototype.postOptions = function(){
  return {
    data: JSON.stringify({
      'username': location.search.split("=")[1],
      'text': $('.inputField').text(),
      'roomname': 'lobby' //change this!
    }),
    error: function(data){
      console.error("You're fucked ", data);
    }
  };
};

Messages.prototype.retrieveOptions= function(){
    return {
      data: {order: '-createdAt'},
      success: function(data){ 
        render(data.results);
      },
      error: function(data){
        console.error("You're fucked ", data);
      }
    };
};




// here be document ready
$('document').ready(function(){

  var messages = new Messages();

  $('.submitButton').on('click', function(event){
    var options = messages.postOptions();
    options.success = function(data){messages.retrieve(messages.retrieveOptions());};
    messages.post(messages.postOptions());
    $('.inputField').text('');
  });
  $('.loginButton').on('click', function(event){
    var name = prompt("You must be logged in to view this page. Please enter a username.");
    location.search = "?username=" + name;
  });
  $('.inputField').on('keydown', function(event){
    if(event.which === 13){
      var options = messages.postOptions();
      options.success = function(data){messages.retrieve(messages.retrieveOptions());};
      messages.post(messages.postOptions());
      $('.inputField').text('');
    }
  });
  $(document).on('click', 'em', function(event){
    var name = $(this).text();
      //toggles friends
      if (!friends[name]){
        friends[name] = true;
        populateFriendsList();
        messages.retrieve(messages.retrieveOptions());
      } else{
        delete friends[name];
        populateFriendsList();
        messages.retrieve(messages.retrieveOptions());
      }
    });

  $(document).on('click', '.room', function(event){
 //do something that switches the room. sounds awesome, right?
    });


  messages.retrieve(messages.retrieveOptions());
  setInterval(function(){
    messages.retrieve(messages.retrieveOptions());
    //console.log(document.hasFocus());
  }, 5000);
});
