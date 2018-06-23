class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
  }

  init() {
    app.fetch();
  }

  // adds a new message to messages
  send(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.renderMessage(message);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  // add messages to site
  fetch() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: "where=" + escape(JSON.stringify({"username": "zach"})),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        data.results.forEach(function(message) {
          if (!app.rooms.includes(message.roomname)) {
            app.renderRoom(message);
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
    $('#chats').prepend(`<div class="chat">
                           <span class="username">${message.username}</span>
                           <br>
                           <span class="chat-text">${message.text}</span>
                         </div>`);
    // add event click handler to .username elements
  }

  renderRoom(message) {
    app.rooms.push(message.roomname);
    $('select').append(`<option value="${message.roomname}">
                          ${message.roomname}
                        </option>`);
  }
  
  handleSubmit(message) {
    app.send(message);
  }
};

var app = new App();
app.init();

$(document).ready(function() {
  $("button").on("click", function() {
    var message = {};
    
    message.username = getUsername(window.location.href);
    message.text = getText();
    message.roomname = getRoomname();

    app.handleSubmit(message);
  });
});

var getUsername = function(url) {
  console.log(url);
  for (var x = 0; x < url.length; x++) {
    if (url[x] === '?' && url[x + 9] === '=') {
      return url.slice(x + 10, url.length);
    }
  }
};

var getText = function() {
  return $('input').val();
};

var getRoomname = function() {
  var select = $('select')[0];
  for (var i = 0; i < select.length; i++) {
    if (select[i].selected === true) {
      return select[i].value;
    }
  }
};
