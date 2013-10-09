// YOUR CODE HERE:
var events = _.clone(Backbone.Events);
var urlz = 'https://api.parse.com/1/classes/chatterbox';

//
//    All the render stuff
//
var MessagesView = Backbone.View.extend({
  initialize : function(options){
    this.el = options.el;
    events.on('message:retrieve', this.render, this);
  },

  render : function(data){
    data = data.reverse();
    this.clearMessageList();
    _(data).each(function(msg){
      var chatroom = this.escapez(msg.roomname);
      var user = this.escapez(msg.username);
      var message = this.escapez(msg.text); //replace
      var time = moment(msg.createdAt).fromNow();
      if(chatroom === this.currentRoom){
        this.populateMessages(user, message, time);
      }
    });
    that.scrollToBottom();
  },

  populateMessages : function(user, message, time){
    var output = $('<li></li>');
    output.append('<em class="user">' + user + ':</em>\t');
    output.append('<span class="message">' + message + '</span>\t');
    output.append('<span class="time">' + time + '</span>');
    if(this.friends[user]){ output.addClass('highlight');}
    this.el.append(output);
  },

  clearMessageList : function(){
    this.el.html("");
  },

  scrollToBottom : function(){
    this.el.scrollTop(9000);
  }

});
/////////////////////////////////////////////////////////////////



var ChatroomView = Backbone.View.extend({
  initialize: function(options){
    this.el = options.el;
    events.on('message:retrieve', this.render, this);
  },

  render : function(data){
    this.clearRoomList();
    _(data).each(function(subData){
      var chatroom = subData.roomname;
      if(! this.chatrooms[chatroom]){
        var output = $('<li class="room" data-chatroom="'+ chatroom +'">' + this.curtail(chatroom) + '</li>');
        if(this.currentRoom === chatroom){output.addClass('highlight');}
        this.el.append(output);
        this.chatrooms[chatroom] = true;
      }
    });
  },

  clearRoomList : function(){
    this.el.html("");
    this.chatrooms = {};
  }

});

//////////////////////////////////////////////////////////////
var FriendsView = Backbone.View.extend({
  initialize : function(options){
    this.el = options.el;
  },

  populateFriendsList : function(){
    this.clearFriendsList();
    for (var name in this.friends){
      var output = $('<li>' + this.curtail(name) + '</li>');
      this.el.append(output);
    }
  },

  clearFriendsList : function(){
    this.el.html('');
  }
});

///////////////////////////////////////////////////////////



var NewMessageView = Backbone.View.extend({
  initialize: function(options){
    this.el = options.el;

    events.on('message:post', this.clearInputField, this);
    events.on('message:post', this.retrieve, this);
    events.on('username:click', this.toggleFriend, this);
    events.on('chatroom:click', this.changeRoom, this);
    events.on('login:click', this.changeUser, this);
  },

  postMessage : function(event){
    this.messages.post(JSON.stringify({
        'username': location.search.split("=")[1],
        'text': this.el.find('.inputField').text(),
        'roomname': "lobby" //$('.chatrooms').hasClass('.highlight').text();
      }));
  },

  changeRoom : function(event){
    this.currentRoom = event.currentTarget.dataset.chatroom;
    this.messages.retrieve(this.messages.retrieveOptions());
  },

  changeUser : function(event){
    var name = prompt("You must be logged in to view this page. Please enter a username.");
    location.search = "?username=" + name;
  },

  toggleFriend : function(event){
    var that = this;
    var name = event.currentTarget.innerText.slice(0,-1);
    console.log('name', name);
    if (!that.friends[name]){
      that.friends[name] = true;
      that.populateFriendsList();
      that.messages.retrieve(that.messages.retrieveOptions());
    } else{
      delete that.friends[name];
      that.populateFriendsList();
      that.messages.retrieve(that.messages.retrieveOptions());
    }
  },


  clearInputField : function(){
    this.el.find('.inputField').text('');
  }
});



/*

//-------- here be helpers
NewMessageView.prototype.curtail = function(string){
  if(string.length < 12){return string;}
  return(string.slice(0,12) + '..');
};

NewMessageView.prototype.escapez = function(string){
  if(!string){return "";}
  return string.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
};
//-------- end of helpers
*/


var Messages = function(){};

Messages.prototype.retrieve = function(options){
  $.ajax({
    url: urlz,
    type: 'GET',
    data: {order: '-createdAt'},
    success: function(data){
      events.trigger('message:retrieve', data);
    },
    error: function(data){
      console.error("You're fucked ", data);
  }
  });
};

Messages.prototype.post = function(options){
   $.ajax({
      url: urlz,
      type: 'POST',
      data: options.data,
      contentType: 'application/json',
      success: function(data){
        events.trigger('message:post', data);
      },
      error: function(data){
        console.error("You're fucked ", data);
    }
   });
};


$('document').ready(function(){
  var messages = new Messages();
  new NewMessageView({messages: messages});

});
