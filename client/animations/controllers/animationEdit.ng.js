angular.module("eightbyeightHelper").controller("AnimationEditCtrl",
  function($scope, $meteor, $log, $timeout, $stateParams){
    $scope.dragThreshold = 7; // amount of pixels to consider dragging motion
    $scope.mousedown = false;
    $scope.draging = false;
    $scope.drawvalue = 1;
    $scope.timeout = null;
    $scope.animationPlaying = false;
    $scope.activeFrame = 0;
    $scope.saveTimeout = null;

    $scope.animation = $meteor.object(Animations, $stateParams.animationId, false);

    $scope.baseFrame = function () {
      this.pixels = [];
      this.duration = 500; // 0.5fps
    };

    $scope.pixelClass = function(value) {
      return value == 0 ? "false" : "true";
    }

    $scope.getActiveFrame = function () {

      if($scope.animation.frames) {
        var num = $scope.activeFrame;
        return $scope.animation.frames[num];
      }
      return false;
    };

    $scope.export = function () {

      var animationExport = [];

      $scope.animation.frames.forEach(function (frame, index) {
        var frameExport = {index: index, pixels: ""};
        frame.pixels.forEach(function (pixel) {
          frameExport.pixels += pixel.value;
        });
        animationExport.push(frameExport);
      });
      $log.log(JSON.stringify($scope.animation));
    };

    $scope.cloneFrame = function () {

      var clonedFrame = new $scope.baseFrame();

      for (var i = 0; i < 64; i++) {
        clonedFrame.pixels.push({value: $scope.getActiveFrame().pixels[i].value});
      }

      $scope.animation.frames.splice($scope.activeFrame, 0, clonedFrame);
      $scope.activeFrame++;
      $scope.animation.save();
    };

    $scope.togglePlay = function () {
      if ($scope.animationPlaying = !$scope.animationPlaying) {
        $scope.animate();
      } else {
        $timeout.cancel($scope.timeout);
      }
    };

    $scope.animate = function () {
      $scope.timeout =
          $timeout(function () {
            if ($scope.activeFrame < $scope.animation.frames.length - 1) {
              $scope.activeFrame++;
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
      $scope.animation.frames.splice($scope.activeFrame + 1, 0, newFrame);

      $scope.activeFrame++;
      $scope.animation.save();
    };

    $scope.gotoFrame = function (index) {
      $scope.activeFrame = index;
    };

    $scope.prevFrame = function () {
      $scope.gotoFrame($scope.activeFrame > 0 ? $scope.activeFrame - 1 : 0);
    };

    $scope.nextFrame = function () {
      if ($scope.activeFrame < $scope.animation.frames.length - 1) {
        $scope.gotoFrame($scope.activeFrame + 1);
      }
    };

    $scope.firstFrame = function () {
      $scope.gotoFrame(0);
    };

    $scope.lastFrame = function () {
      $scope.gotoFrame($scope.animation.frames.length - 1)
    }

    $scope.fillFrame = function () {
      for (var i = 0; i < 64; i++) {
        $scope.animation.frames[$scope.activeFrame].pixels[i].value = 1;
      }
      $scope.drawvalue = 1;
      $scope.animation.save();
    };

    $scope.clearFrame = function () {
      for (var i = 0; i < 64; i++) {
        $scope.animation.frames[$scope.activeFrame].pixels[i].value = 0;
      }
      $scope.drawvalue = 0;
      $scope.animation.save();
    };

    $scope.removeFrame = function () {

      if ($scope.activeFrame == 0 && $scope.animation.frames.length == 1) {
        return;
      }

      $scope.animation.frames.splice($scope.activeFrame, 1);

      if ($scope.activeFrame > 0) {
        $scope.activeFrame--;
      }
      $scope.animation.save();
    };

    $scope.keypressHandler = function (event) {
      $log.log(event.keyCode);
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
//                    $scope.animation.toggle();
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
          $scope.draging = true;
          pixel.value = $scope.drawvalue;
        }
      }
    };

    $scope.clickPixel = function (pixel) {
      pixel.value = pixel.value == 1 ? 0 : 1;
      if($scope.saveTimeout)
        $timeout.cancel($scope.saveTimeout); // requeue save
      $scope.saveTimeout =
        $timeout(function () {
          $scope.animation.save();
        }, 750);
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
      if($scope.draging)  {
        if($scope.saveTimeout)
          $timeout.cancel($scope.saveTimeout);
        $scope.animation.save();
      }
      $scope.draging = false;
    };

    $scope.nextdoubleClick = function () {
      if ($scope.activeFrame == $scope.animation.frames.length - 1) {
        $scope.addFrame();
      }
    };

  });
