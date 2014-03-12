require(['./lib/meld.js'], function(meld) {
  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true
  });

  var socket = io.connect(window.location.href);
  y = socket;

socket.on('_onMouseDownInDrawingMode', function(data) {
  _onMouseDownInDrawingMode(canvas, data);
})
socket.on('_onMouseMoveInDrawingMode', function(data) {
    _onMouseMoveInDrawingMode(canvas, data)
})
socket.on('_onMouseUpInDrawingMode', function() {
    _onMouseUpInDrawingMode(canvas)
})

  x = canvas;

meld.around(canvas, "_onMouseDown", function(joinPoint) {
  // joinPoint.proceed();
})

meld.around(canvas, "_onMouseMove", function(joinPoint) {
  // joinPoint.proceed();
})

meld.around(canvas, "_onMouseUp", function(joinPoint) {
  // debugger;
  // joinPoint.proceed();
  // this.__onMouseUp(e), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp), r(fabric.document, "mousemove", this._onMouseMove), r(fabric.document, "touchmove", this._onMouseMove), n(this.upperCanvasEl, "mousemove", this._onMouseMove), n(this.upperCanvasEl, "touchmove", this._onMouseMove)
})

function _onMouseDownInDrawingMode(canvas, t) {
  var self = canvas;
  // var e = joinPoint.args[0];
  self._isCurrentlyDrawing = !0,
  // self.discardActiveObject(e).renderAll(),
  self.clipTo && fabric.util.clipContext(self, self.contextTop),
  self.freeDrawingBrush.onMouseDown(t);
  return t;
  // self.fire("mouse:down", {e: e}) // No idea what this does
}

meld.around(canvas, "_onMouseDownInDrawingMode", function(joinPoint) {
  t = canvas.getPointer(joinPoint.args[0]);
  _onMouseDownInDrawingMode(canvas, t);
  socket.emit("_onMouseDownInDrawingMode", t);
})

function _onMouseMoveInDrawingMode(canvas, t) {
  if (canvas._isCurrentlyDrawing) {
    canvas.freeDrawingBrush.onMouseMove(t);
  }
}

meld.around(canvas, "_onMouseMoveInDrawingMode", function(joinPoint) {
  var t = canvas.getPointer(joinPoint.args[0]);
  _onMouseMoveInDrawingMode(canvas, t);
  socket.emit("_onMouseMoveInDrawingMode", t);
})

function _onMouseUpInDrawingMode(canvas) {
  var self = canvas;

  self._isCurrentlyDrawing = !1,
  self.clipTo && self.contextTop.restore(),
  self.freeDrawingBrush.onMouseUp();
  // this.fire("mouse:up", {e: e})
}

meld.around(canvas, "_onMouseUpInDrawingMode", function(joinPoint) {
  _onMouseUpInDrawingMode(canvas);
  socket.emit("_onMouseUpInDrawingMode");
})



  fabric.Object.prototype.transparentCorners = false;
})
