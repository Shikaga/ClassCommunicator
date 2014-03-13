define(['../lib/meld.js'], function (meld) {

  function FreeDrawingHandler(canvas) {
    var socket = io.connect(window.location.href);

    socket.on('_onMouseDownInDrawingMode', function(data) {
    _onMouseDownInDrawingMode(canvas, data);
    })
    socket.on('_onMouseMoveInDrawingMode', function(data) {
      _onMouseMoveInDrawingMode(canvas, data)
    })
    socket.on('_onMouseUpInDrawingMode', function() {
      _onMouseUpInDrawingMode(canvas)
    })
    socket.on('_onMouseUp', function() {
      _onMouseUp(canvas)
    })

    meld.around(canvas, "_onMouseDown", function(joinPoint) {
    // joinPoint.proceed();
    })

    meld.around(canvas, "_onMouseMove", function(joinPoint) {
    // joinPoint.proceed();
    })

    function _onMouseUp() {
    x = function() {
      r = function (e,t,n){e.removeEventListener(t,n,!1)};
      n = function (e,t,n){e.addEventListener(t,n,!1)};
      _onMouseUpInDrawingMode(canvas), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp), r(fabric.document, "mousemove", this._onMouseMove), r(fabric.document, "touchmove", this._onMouseMove), n(this.upperCanvasEl, "mousemove", this._onMouseMove), n(this.upperCanvasEl, "touchmove", this._onMouseMove)
    }.bind(canvas);
    x();
    }

    meld.around(canvas, "_onMouseUp", function(joinPoint) {
    _onMouseUp();
    socket.emit("_onMouseUp", t);
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
  }


  return FreeDrawingHandler;
});
