class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }

  init() {
    console.log(this + ' initialized');
    this.fetch();
  }

  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        this.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        data.results.forEach(function(message) {
          this.renderMessage(message);
        });
        console.log('chatterbox: Messages updated');
      },
      error: function (data) {
        console.error('chatterbox: Failed to recieve messages', data);
      }
    });
  }

  clearMessages() {
    console.log($('.chat'));
    $('.chat').each(function(message) {
      console.log(message);
    });
  }

  renderMessage(message) {
    $('#chats').prepend(`<div class="chat">
                           <span class="username">${message.username}</span>
                           <br>
                           <span class="chat-text">${message.text}</span>
                         </div>`);
  }

  renderRoom() {

  }
};

var app = new App();
app.init();
