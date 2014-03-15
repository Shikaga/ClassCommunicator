require(
    ['../js/FreeDrawingHandler'],
    function(FreeDrawingHandler) {

      var MockSocketIo = function() {
          this.on = sinon.spy();
          this.emit = sinon.spy();
          this.callbackOn = function(message, data) {
            for (var i=0; i < this.on.callCount; i++) {
              var call = this.on.getCall(i);
              if (call.args[0] === message) {
                call.args[1](data);
              }
            }
          };
      }

      var MockCanvasShield = function() {
        this._onMouseDownInDrawingMode = sinon.spy();
        this._onMouseMoveInDrawingMode = sinon.spy();
        this._onMouseUpInDrawingMode = sinon.spy();
        this._onMouseUp = sinon.spy();
      }

      test( "FreeDrawingHandler invoked when socket calls receive", function() {
          var mockSocketIo = new MockSocketIo();
          var mockCanvas = {};
          var mockCanvasShield = new MockCanvasShield();

          var fdh = new FreeDrawingHandler(mockSocketIo, mockCanvas);
          fdh.canvasShield = mockCanvasShield;


          mockSocketIo.callbackOn('_onMouseDownInDrawingMode', {});
          equal(true, mockCanvasShield._onMouseDownInDrawingMode.calledOnce);
          mockSocketIo.callbackOn('_onMouseMoveInDrawingMode', {});
          equal(true, mockCanvasShield._onMouseMoveInDrawingMode.calledOnce);
          mockSocketIo.callbackOn('_onMouseUpInDrawingMode', {});
          equal(true, mockCanvasShield._onMouseUpInDrawingMode.calledOnce);
          mockSocketIo.callbackOn('_onMouseUp', {});
          equal(true, mockCanvasShield._onMouseUp.calledOnce);
      });

      test( "FreeDrawingHandler not called when another pen is in motion", function() {
        var mockSocketIo = new MockSocketIo();
        var mockCanvas = {
          _onMouseDownInDrawingMode: function(){},
          _onMouseUpInDrawingMode: function(){},
          _onMouseUp: function(){},
          getPointer: function(){}
        };
        var mockCanvasShield = new MockCanvasShield();

        var fdh = new FreeDrawingHandler(mockSocketIo, mockCanvas);
        fdh.canvasShield = mockCanvasShield;

        mockCanvas._onMouseDownInDrawingMode();
        equal(true, mockCanvasShield._onMouseDownInDrawingMode.calledOnce);

        //Pen not moved when down
        mockSocketIo.callbackOn('_onMouseDownInDrawingMode', {});
        equal(true, mockCanvasShield._onMouseDownInDrawingMode.calledOnce);
        mockSocketIo.callbackOn('_onMouseMoveInDrawingMode', {});
        equal(true, mockCanvasShield._onMouseMoveInDrawingMode.notCalled);
        mockSocketIo.callbackOn('_onMouseUpInDrawingMode', {});
        equal(true, mockCanvasShield._onMouseUpInDrawingMode.notCalled);
        mockSocketIo.callbackOn('_onMouseUp', {});
        equal(true, mockCanvasShield._onMouseUp.notCalled);

        //Stored pen moves occur when pen comes up
        mockCanvas._onMouseUpInDrawingMode();
        mockCanvas._onMouseUp();
        equal(true, mockCanvasShield._onMouseDownInDrawingMode.calledTwice);
        equal(true, mockCanvasShield._onMouseMoveInDrawingMode.calledOnce);
        equal(true, mockCanvasShield._onMouseUpInDrawingMode.calledTwice);
        equal(true, mockCanvasShield._onMouseUp.calledTwice);

        //Pen moves occur from then on
        mockSocketIo.callbackOn('_onMouseDownInDrawingMode', {});
        equal(true, mockCanvasShield._onMouseDownInDrawingMode.calledThrice);

        //Cache is cleared...
        mockSocketIo.callbackOn('_onMouseUpInDrawingMode', {});
        mockSocketIo.callbackOn('_onMouseUp', {});
        equal(true, mockCanvasShield._onMouseDownInDrawingMode.calledThrice);
      });

    }
);
