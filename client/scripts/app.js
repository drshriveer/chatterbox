// YOUR CODE HERE:
//
//    All the render stuff
//
var MessagesView = Backbone.View.extend({
  initialize : function(){
    this.collection.on('retrieve', this.render, this);
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
  initialize: function(){
    this.collection.on('retrieve', this.render, this);
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
  initialize : function(){
    //this.collection.on('something', do soemthing, this);
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
  events: {
    'newMesageBox': 'postMessage'
  },

  initialize: function(){
    this.collection.on('post', this.clearInputField, this);
    this.collection.on('post', this.retrieve, this);


    // -------------- these go to other views
    // events.on('username:click', this.toggleFriend, this);
    // events.on('chatroom:click', this.changeRoom, this);
    // events.on('login:click', this.changeUser, this);
  },

  postMessage : function(event){
            ///  still need to stringify.????????
    this.collection.create({
        'username': location.search.split("=")[1],
        'text': this.el.$('.inputField').text(),
        'roomname': "lobby" //$('.chatrooms').hasClass('.highlight').text();
      });
  },

  changeRoom : function(event){
    this.currentRoom = event.currentTarget.dataset.chatroom;
    //messeges.fetch();
    messages.get();
    //this.trigger();
    //this.messages.retrieve(this.messages.retrieveOptions());
  },

  changeUser : function(event){
    var name = prompt("You must be logged in to view this page. Please enter a username.");
    location.search = "?username=" + name;
  },

  toggleFriend : function(event){
    var name = event.currentTarget.innerText.slice(0,-1);
    if (!this.friends[name]){
      this.friends[name] = true;
      this.populateFriendsList();
      messages.get();
      //this.trigger();     //this.trigger();
      //this.messages.retrieve(this.messages.retrieveOptions());
    } else{
      delete this.friends[name];
      this.populateFriendsList();
      messages.get();
      //this.trigger();    //this.trigger();
      //this.messages.retrieve(this.messages.retrieveOptions());
    }
  },


  clearInputField : function(){
    this.el.$('.inputField').text('');
  }
});




var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox'
});

var Messages = Backbone.Collection.extend({
  model: Message
});

// Messages.prototype.retrieve = function(){
//   $.ajax({
//     url: urlz,
//     type: 'GET',
//     data: {order: '-createdAt'},
//     success: function(data){
//       events.trigger('message:retrieve', data);
//     },
//     error: function(data){
//       console.error("You're fucked ", data);
//   }
//   });
// };

// Messages.prototype.post = function(options){


//    $.ajax({
//       url: urlz,
//       type: 'POST',
//       data: options.data,
//       contentType: 'application/json',
//       success: function(data){
//         events.trigger('message:post', data);
//       },
//       error: function(data){
//         console.error("You're fucked ", data);
//     }
//    });
// };


$('document').ready(function(){
  var messages = new Messages();
  new NewMessageView({el: $('.submitContainer'), collection: messages});
  new MessagesView({el: $('.messageList'), collection: messages});
  new ChatroomView({el: $('.chatrooms'), collection: messages});
  new FriendsView({el: $('.friends'), collection: messages});

});
