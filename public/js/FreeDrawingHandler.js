define(['../lib/meld.js'], function (meld) {

  function FreeDrawingHandler(socket, canvas) {
    socket.on('_onMouseDownInDrawingMode', function(data) {
      this._onMouseDownInDrawingMode(canvas, data.data);
    }.bind(this))
    socket.on('_onMouseMoveInDrawingMode', function(data) {
      this._onMouseMoveInDrawingMode(canvas, data.data)
    }.bind(this))
    socket.on('_onMouseUpInDrawingMode', function() {
      this._onMouseUpInDrawingMode(canvas)
    }.bind(this))
    socket.on('_onMouseUp', function() {
      this._onMouseUp(canvas)
    }.bind(this))

    FreeDrawingHandler.prototype._onMouseUp = function() {
      var self = this;
      x = function() {
        r = function (e,t,n){e.removeEventListener(t,n,!1)};
        n = function (e,t,n){e.addEventListener(t,n,!1)};
        self._onMouseUpInDrawingMode(canvas), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp), r(fabric.document, "mousemove", this._onMouseMove), r(fabric.document, "touchmove", this._onMouseMove), n(this.upperCanvasEl, "mousemove", this._onMouseMove), n(this.upperCanvasEl, "touchmove", this._onMouseMove)
      }.bind(canvas);
      x();
    }

    meld.around(canvas, "_onMouseUp", function(joinPoint) {
    this._onMouseUp();
    socket.emit("_onMouseUp", t);
  }.bind(this))

    FreeDrawingHandler.prototype._onMouseDownInDrawingMode = function(canvas, t) {
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
    this._onMouseDownInDrawingMode(canvas, t);
    socket.emit("_onMouseDownInDrawingMode", t);
  }.bind(this))

    FreeDrawingHandler.prototype._onMouseMoveInDrawingMode = function(canvas, t) {
      if (canvas._isCurrentlyDrawing) {
        canvas.freeDrawingBrush.onMouseMove(t);
      }
    }

    meld.around(canvas, "_onMouseMoveInDrawingMode", function(joinPoint) {
      var t = canvas.getPointer(joinPoint.args[0]);
      this._onMouseMoveInDrawingMode(canvas, t);
      socket.emit("_onMouseMoveInDrawingMode", t);
    }.bind(this))

    FreeDrawingHandler.prototype._onMouseUpInDrawingMode = function(canvas) {
    var self = canvas;

    self._isCurrentlyDrawing = !1,
    self.clipTo && self.contextTop.restore(),
    self.freeDrawingBrush.onMouseUp();
    // this.fire("mouse:up", {e: e})
    }

    meld.around(canvas, "_onMouseUpInDrawingMode", function(joinPoint) {
    this._onMouseUpInDrawingMode(canvas);
    socket.emit("_onMouseUpInDrawingMode");
    })
  }


  return FreeDrawingHandler;
});
