angular.module('eightbyeightHelper',['angular-meteor','eightbyeightHelper.directives']);

angular.module("eightbyeightHelper").controller("8x8Ctrl",
  function($scope, $meteor, $log, $timeout){
    $scope.animations = $meteor.collection(Animations);

    $log.log($scope.animations);
    window.scope = $scope;
    $scope.dragThreshold = 1; // amount of pixels to consider dragging motion
    $scope.mousedown = false;
    $scope.drawvalue = 0;
    $scope.timeout = null;

    $scope.currentAnimation = $meteor.object(Animations, "tBaBMsgLmi5KHYPod");
    //$log.log($scope.currentAnimation);

    $scope.baseFrame = function () {
      this.pixels = [];
      this.duration = 500; // 0.5fps
    };

    $scope.pixelClass = function(value) {
      return value == 0 ? "false" : "true";
    }

    $scope.getActiveFrame = function () {
      var num  = $scope.currentAnimation.activeFrame;
      return $scope.currentAnimation.frames[num];
    };

    $scope.export = function () {

      var animationExport = [];

      $scope.currentAnimation.frames.forEach(function (frame, index) {
        var frameExport = {index: index, pixels: ""};
        frame.pixels.forEach(function (pixel) {
          frameExport.pixels += pixel.value;
        });
        animationExport.push(frameExport);
      });
      $log.log(JSON.stringify($scope.currentAnimation));
    };

    $scope.cloneFrame = function () {

      var clonedFrame = new $scope.baseFrame();

      for (var i = 0; i < 64; i++) {
        clonedFrame.pixels.push({value: $scope.getActiveFrame().pixels[i].value});
      }

      $scope.currentAnimation.frames.splice($scope.currentAnimation.activeFrame, 0, clonedFrame);
      $scope.currentAnimation.activeFrame++;
    };

    $scope.toggle = function () {
      if ($scope.currentAnimation.playing = !$scope.currentAnimation.playing) {
        $scope.animate();
      } else {
        $timeout.cancel($scope.timeout);
      }
    };

    $scope.animate = function () {
      $scope.timeout =
          $timeout(function () {
            if ($scope.currentAnimation.activeFrame < $scope.currentAnimation.frames.length - 1) {
              $scope.currentAnimation.activeFrame++;
              $scope.animate();
            } else {
              $scope.toggle();
            }
          }, $scope.getActiveFrame().duration);
    };

    $scope.addFrame = function () {
      var newFrame = new $scope.baseFrame();

      for (var i = 0; i < 64; i++) {
        newFrame.pixels.push({value: 0});
      }

      if ($scope.currentAnimation.activeFrame == -1) {
        $scope.currentAnimation.frames.push(newFrame);
      } else {
        $scope.currentAnimation.frames.splice($scope.currentAnimation.activeFrame + 1, 0, newFrame);
      }
      $scope.currentAnimation.activeFrame++;
    };

    $scope.gotoFrame = function (index) {
      $scope.currentAnimation.activeFrame = index;
    };

    $scope.prevFrame = function () {
      $scope.gotoFrame($scope.currentAnimation.activeFrame > 0 ? $scope.currentAnimation.activeFrame - 1 : 0);
    };

    $scope.nextFrame = function () {
      if ($scope.currentAnimation.activeFrame < $scope.currentAnimation.frames.length - 1) {
        $scope.gotoFrame($scope.currentAnimation.activeFrame + 1);
      }
    };

    $scope.firstFrame = function () {
      $scope.gotoFrame(0);
    };

    $scope.lastFrame = function () {
      $scope.gotoFrame($scope.currentAnimation.frames.length - 1)
    }

    $scope.fillFrame = function () {
      for (var i = 0; i < 64; i++) {
        $scope.currentAnimation.frames[$scope.currentAnimation.activeFrame].pixels[i].value = 1;
      }
      $scope.drawvalue = 1;
    };

    $scope.clearFrame = function () {
      for (var i = 0; i < 64; i++) {
        $scope.currentAnimation.frames[$scope.currentAnimation.activeFrame].pixels[i].value = 0;
      }
      $scope.drawvalue = 0;
    };

    $scope.removeFrame = function () {

      if ($scope.currentAnimation.activeFrame == 0 && $scope.currentAnimation.frames.length == 1) {
        return;
      }

      $scope.currentAnimation.frames.splice($scope.currentAnimation.activeFrame, 1);

      if ($scope.currentAnimation.activeFrame > 0) {
        $scope.currentAnimation.activeFrame--;
      }

    };

    $scope.keypressHandler = function (event) {
      //$log.log(event.keyCode);
      switch (event.keyCode) {
        case 13:    /* KP_ENTER */
          $scope.cloneFrame();
          break;
        case 32:    /* SPACE */
        case 44:    /* KP_, */
          $scope.drawvalue = $scope.drawvalue == 1 ? 0 : 1;
          break;
        case 43:    /* KP_PLUS */
          $scope.addFrame();
          break;
        case 45:    /* KP_MINUS */
          $scope.removeFrame();
          break;
//                case 48:    /* KP_0 */
//                    $scope.currentAnimation.toggle();
//                    break;
//                case 49:   /* KP_1 */
//                    $scope.firstFrame();
//                    break;
//                case 51:    /* KP_§ */
//                    $scope.lastFrame();
//                    break;
//                case 52:    /* KP_4 */
//                    $scope.prevFrame();
//                    break;
//                case 54:    /* KP_6 */
//                    $scope.nextFrame();
//                    break;
      }
    };

    $scope.mousemovePixel = function (event, pixel) {
      if ($scope.mousedown) {

        if (Math.pow(Math.pow($scope.startPosition.x - event.pageX, 2) + Math.pow($scope.startPosition.y - event.pageY, 2), 0.5) > $scope.dragThreshold) {
          console.log("wowow");
          pixel.value = $scope.drawvalue;
        }
      }
    };

    $scope.clickPixel = function (pixel) {

      pixel.value = pixel.value == 1 ? 0 : 1;

    };

    $scope.toggleDrawvalue = function () {

      $scope.drawvalue = $scope.drawvalue == 1 ? 0 : 1;

    };

    $scope.mousedownHandler = function (event) {
      $scope.mousedown = true;
      $scope.startPosition = {x: event.pageX, y: event.pageY};
    };

    $scope.mouseupHandler = function (event) {
      $scope.mousedown = false;
    };

    $scope.nextdoubleClick = function () {
      if ($scope.currentAnimation.activeFrame == $scope.currentAnimation.frames.length - 1) {
        $scope.addFrame();
      }
    };

  });
