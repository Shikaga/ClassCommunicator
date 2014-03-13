define([], function () {

  function CanvasHandler() {
    var $ = function(id){return document.getElementById(id)};

    var canvas = this.__canvas = new fabric.Canvas('c', {
      isDrawingMode: true
    });
    fabric.Object.prototype.transparentCorners = false;
  }

  CanvasHandler.prototype.getCanvas = function() {
    return this.__canvas;
  }

  return CanvasHandler;
});
