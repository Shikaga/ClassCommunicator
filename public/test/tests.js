require(
    ['../js/FreeDrawingHandler'],
    function(FreeDrawingHandler) {

      var MockSocketIo = function() {
          this.on = sinon.spy();
          this.callbackOn = function(message, data) {
            for (var i=0; i < this.on.callCount; i++) {
              var call = this.on.getCall(i);
              if (call.args[0] === message) {
                call.args[1](data);
              }
            }
          };
      }

      test( "add test", function() {
          var mockSocketIo = new MockSocketIo();
          var mockCanvas = {};
          var fdh = new FreeDrawingHandler(mockSocketIo, mockCanvas);
          fdh._onMouseDownInDrawingMode = sinon.spy();
          mockSocketIo.callbackOn('_onMouseDownInDrawingMode', {});
          equal(true, fdh._onMouseDownInDrawingMode.calledOnce);
      });

    }
);
