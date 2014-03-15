  function MessageHandler(io) {
    this.storedMessages = [];

    this.sendMessage = function(socket, name, data) {
      this.storedMessages.push({name: name, data: data});
      socket.broadcast.emit(name, data);
    }.bind(this);

    this.sendStoredMessages = function(socket) {
      this.storedMessages.forEach(function(message) {
        socket.emit(message.name, message.data);
      })
    }

    io.sockets.on('connection', function (socket) {
      this.sendStoredMessages(socket);
      socket.on('_onMouseDownInDrawingMode', function (data) {
        this.sendMessage(socket, "_onMouseDownInDrawingMode", {data: data, socketid: socket.id});
      }.bind(this));
      socket.on('_onMouseMoveInDrawingMode', function (data) {
        this.sendMessage(socket, "_onMouseMoveInDrawingMode", {data: data, socketid: socket.id});
      }.bind(this));
      socket.on('_onMouseUpInDrawingMode', function (data) {
        this.sendMessage(socket, "_onMouseUpInDrawingMode", {data: data, socketid: socket.id});
      }.bind(this));
      socket.on('_onMouseUp', function (data) {
        this.sendMessage(socket, "_onMouseUp", {data: data, socketid: socket.id});
      }.bind(this));
    }.bind(this));
  }

  module.exports = MessageHandler;
