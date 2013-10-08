// YOUR CODE HERE:

var urlz = 'https://api.parse.com/1/classes/chatterbox';
var users = {};
var chatrooms = {};
var friends = {};

var render = function(messageData){
  messageData = messageData.reverse();
  $('.messageList').html("");
  _(messageData).each(function(msg){
    var chatroom = escape(msg.roomname);
    var user = escape(msg.username);
    var message = escape(msg.text); //replace
    var time = moment(msg.createdAt).fromNow();

    msgConstruct(user, message, time);
    populateUserList(user);
    populateRoomList(chatroom);
  });

  $('.messageBox').scrollTop(9000); //scrolls to the top
};

var escape = function(string){
  if(!string){return "";}
  return string.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
};
var msgConstruct =function(user, message, time){
  var output = $('<li><em>' + user + ':</em>\t' + message + '\t<span class="time">' + time + '</span></li>');
  if(friends[user]){ output.addClass('friendList');}
  $('.messageList').append(output);
};

var populateUserList = function(user){
  if(users[user]){return;}
  var output = '<li class="name">' + curtail(user) + '</li>';
  $('.users').append(output);
  users[user] = true;
};

var populateRoomList = function(chatroom){
  if(chatrooms[chatroom]){return;}
  var output = '<li>' + curtail(chatroom) + '</li>';
  $('.chatrooms').append(output);
  chatrooms[chatroom] = true;
};

var curtail = function(string){
  if(string.length < 12){return string;}
  return(string.slice(0,12) + '..');
};


var retrieveMessages = function(){
  $.ajax({
    url: urlz,
    type: 'GET',
    data: {order: '-createdAt'},
    success: function(data){
      render(data.results);
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
        console.log("successfully posted!");
        retrieveMessages();
      },
      error: function(data){
        console.log('chatterbox: Failed to send message', data);
      }
   });
};

$('document').ready(function(){
  $('.submitButton').on('click', function(event){
    submitMessage();
  });
  $('.inputField').on('keydown', function(event){
    if(event.which === 13){
      submitMessage();
    }
  });
  $('ul.users li').on('click', function(event){
    console.log("clicked");
  });
  $('.messageList').on('click', function(event){
    console.log("clicked");
  });

  $
  retrieveMessages();
  setInterval(function(){
    retrieveMessages();
  }, 5000);
});

var submitMessage = function(){
  console.log('click');
  postMessage($('.inputField').text());
  $('.inputField').text('');
};