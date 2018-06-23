class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
    this.options = {order: "-createdAt", limit: 100};
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
        app.fetch();
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
      data: app.options,
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
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
    message.text = fixMessage(message.text);
    var messageElement = `<div class="chat">
                           <span class="username">${message.username}</span>
                           <br>
                           <span class="chat-text">${message.text}</span>
                         </div>`;
    $('#chats').append(messageElement);
    $('.username').unbind('click');
    $('.username').on('click', function(username) {
      app.handleUsernameClick(username);
    });
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
  
  handleUsernameClick(username) {
    // adds user to friends list
  }
};

var app = new App();
app.init();

$(document).ready(function() {
  $("button").on('click', function() {
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
});

var getUsername = function(url) {
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

var fixMessage = function(messageText) {
  if (messageText === undefined || messageText === null) {
    return '';
  }
  messageText = messageText.replace('<script', '');
  messageText = messageText.replace('<SCRIPT', '');
  messageText = messageText.replace('<style', '');
  messageText = messageText.replace('<STYLE', '');
  return messageText;
}
