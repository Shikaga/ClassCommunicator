define([], function() {
  function CanvasShield(canvas) {
    this.canvas = canvas;
  }

  CanvasShield.prototype._onMouseUp = function() {
    var self = this;
    x = function() {
      r = function (e,t,n){e.removeEventListener(t,n,!1)};
      n = function (e,t,n){e.addEventListener(t,n,!1)};
      self._onMouseUpInDrawingMode(self.canvas),
      r(fabric.document, "mouseup", this._onMouseUp),
      r(fabric.document, "touchend", this._onMouseUp),
      r(fabric.document, "mousemove", this._onMouseMove),
      r(fabric.document, "touchmove", this._onMouseMove),
      n(this.upperCanvasEl, "mousemove", this._onMouseMove),
      n(this.upperCanvasEl, "touchmove", this._onMouseMove)
    }.bind(self.canvas);
    x();
  }

  CanvasShield.prototype._onMouseDownInDrawingMode = function(canvas, t) {
    // var e = joinPoint.args[0];
    canvas._isCurrentlyDrawing = !0,
    // self.discardActiveObject(e).renderAll(),
    canvas.clipTo && fabric.util.clipContext(canvas, canvas.contextTop),
    canvas.freeDrawingBrush.onMouseDown(t);
    return t;
    // self.fire("mouse:down", {e: e}) // No idea what this does
  }

  CanvasShield.prototype._onMouseMoveInDrawingMode = function(canvas, t) {
    if (canvas._isCurrentlyDrawing) {
      canvas.freeDrawingBrush.onMouseMove(t);
    }
  }

  CanvasShield.prototype._onMouseUpInDrawingMode = function(canvas) {
    canvas._isCurrentlyDrawing = !1,
    canvas.clipTo && self.contextTop.restore(),
    canvas.freeDrawingBrush.onMouseUp();
    // this.fire("mouse:up", {e: e})
  }


  return CanvasShield;
});
