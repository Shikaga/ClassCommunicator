define(['../lib/meld.js', './CanvasShield'], function (meld, CanvasShield) {

  function FreeDrawingHandler(socket, canvas) {
    this.mouseIsDown = false;
    this.queuedCommands = [];

    this.performActionIfMouseUp = function(action) {
      if (!this.mouseIsDown) {
        action();
      } else {
        this.queuedCommands.push(action);
      }
    }

    socket.on('_onMouseDownInDrawingMode', function(data) {
      this.performActionIfMouseUp(function() {
        this.canvasShield._onMouseDownInDrawingMode(canvas, data.data);
      }.bind(this));
    }.bind(this))
    socket.on('_onMouseMoveInDrawingMode', function(data) {
      this.performActionIfMouseUp(function() {
        this.canvasShield._onMouseMoveInDrawingMode(canvas, data.data);
      }.bind(this));
    }.bind(this))
    socket.on('_onMouseUpInDrawingMode', function() {
      this.performActionIfMouseUp(function() {
        this.canvasShield._onMouseUpInDrawingMode(canvas);
      }.bind(this));
    }.bind(this))
    socket.on('_onMouseUp', function() {
      this.performActionIfMouseUp(function() {
        this.canvasShield._onMouseUp(canvas);
      }.bind(this));
    }.bind(this))

    this.canvasShield = new CanvasShield(canvas);

    meld.around(canvas, "_onMouseUp", function(joinPoint) {
      this.mouseIsDown = false;
      this.queuedCommands.forEach(function(command) {
        command();
      });
      this.queuedCommands = [];
      this.canvasShield._onMouseUp();
      socket.emit("_onMouseUp");
    }.bind(this))

    meld.around(canvas, "_onMouseDownInDrawingMode", function(joinPoint) {
      this.mouseIsDown = true;
      t = canvas.getPointer(joinPoint.args[0]);
      this.canvasShield._onMouseDownInDrawingMode(canvas, t);
      socket.emit("_onMouseDownInDrawingMode", t);
    }.bind(this))

    meld.around(canvas, "_onMouseMoveInDrawingMode", function(joinPoint) {
      var t = canvas.getPointer(joinPoint.args[0]);
      this.canvasShield._onMouseMoveInDrawingMode(canvas, t);
      socket.emit("_onMouseMoveInDrawingMode", t);
    }.bind(this))

    meld.around(canvas, "_onMouseUpInDrawingMode", function(joinPoint) {
      this.canvasShield._onMouseUpInDrawingMode(canvas);
      socket.emit("_onMouseUpInDrawingMode");
    }.bind(this))
  }


  return FreeDrawingHandler;
});
