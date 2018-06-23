class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
    this.friends = [];
    this.options = {order: "-createdAt", limit: 20};
  }

  init() {
    setInterval(function() {
      app.fetch();
    }, 1000);
  }

  send(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: app.options,
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        data.results.forEach(function(message) {
          if (!app.rooms.includes(message.roomname)) {
            app.addNewRoom(message.roomname);
          }
          app.renderMessage(message);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to recieve messages', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }

  // adds message to html
  renderMessage(message) {
    var textColor = 'auto';
    if (message.username === undefined) {
      message.username = 'undefined';
    }
    if (app.friends.includes(_.escape(message.username.replace(/%20/g, ' ')))) {
      textColor = 'blue';
    }
    var messageElement = `<div class="chat">
                           <span class="username" style="color:${textColor}">${_.escape(message.username).replace(/%20/g, '')}</span>
                           <br>
                           <span class="chat-text">${_.escape(message.text)}</span>
                         </div>`;
    $('#chats').append(messageElement);
    $('.username').unbind('click');
    $('.username').on('click', function(username) {
      app.handleUsernameClick(username);
    });
  }
  
  addNewRoom(roomname) {
    app.rooms.push(roomname);
    $('select').append(`<option value="${roomname}">
                          ${roomname}
                        </option>`);
  }

  renderRoom(roomname) {
    app.options.where = {"roomname": roomname};
    app.fetch();
  }
  
  handleSubmit(message) {
    app.send(message);
  }
  
  handleUsernameClick(username) {
    if (!app.friends.includes(username.target.innerHTML)) {
      app.friends.push(username.target.innerHTML);
    } else {
      for (var i = 0; i < app.friends.length; i++) {
        if (app.friends[i] === username.target.innerHTML) {
          app.friends.splice(i);
        }
      }
    }
    app.fetch();
  }
};


$(document).ready(function() {
  $("#newRoomButton").on('click', function() {
    var newRoom = $('#newRoomInput').val();
    $('#newRoomInput').val('');
    app.addNewRoom(newRoom);
  });

  $("#submitButton").on('click', function() {
    var message = {};
    
    message.username = getUsername(window.location.href);
    message.text = getText();
    message.roomname = getRoomname();

    app.handleSubmit(message);
  });
  
  $("form").on('submit', function() {
    var message = {};
    
    message.username = getUsername(window.location.href);
    message.text = getText();
    message.roomname = getRoomname();

    app.handleSubmit(message);
  });

  $("#newRoomInput").on('keypress', function(key) {
    if (key.which === 13) {
      $(this).attr("disabled", "disabled");

      var newRoom = $('#newRoomInput').val();
      $('#newRoomInput').val('');
      app.addNewRoom(newRoom);

      $(this).removeAttr("disabled");
    }
  });

  $("#messageInput").on('keypress', function(key) {
    if (key.which === 13) {
      $(this).attr("disabled", "disabled");

      var message = {};
      
      message.username = getUsername(window.location.href);
      message.text = getText();
      message.roomname = getRoomname();

      app.handleSubmit(message);

      $(this).removeAttr("disabled");
    }
  });

  $("select").change(function(roomname) {
    app.renderRoom(roomname.target.value);
  });
});


var getUsername = function(url) {
  for (var x = 0; x < url.length; x++) {
    if (url[x] === '?' && url[x + 9] === '=') {
      return url.slice(x + 10, url.length).replace(/%20/g, ' ');
    }
  }
};

var getText = function() {
  var msg = $('#messageInput').val();
  $('#messageInput').val('');
  return msg;
};

var getRoomname = function() {
  var select = $('select')[0];
  for (var i = 0; i < select.length; i++) {
    if (select[i].selected === true) {
      return select[i].value;
    }
  }
};


var app = new App();
app.init();
