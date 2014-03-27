define([], function () {

  function CanvasHandler(socket) {
    var $ = function(id){return document.getElementById(id)};

    var canvas = this.__canvas = new fabric.Canvas('c', {
      isDrawingMode: true
    });
    fabric.Object.prototype.transparentCorners = false;
      socket.on('clear', function() {
          this.clear();
      }.bind(this));
  }

  CanvasHandler.prototype.getCanvas = function() {
    return this.__canvas;
  }

    CanvasHandler.prototype.clear = function() {
        this.__canvas.clear().renderAll();
    }

  return CanvasHandler;
});
