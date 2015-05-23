/**
 - TODO: import
 - TODO: anonymous usage
 - TODO: fork animations
 - TODO: mobile optimization
 - TODO: touch support

 - TODO: pagination
 */

angular.module("eightbyeightHelper").controller("AnimationEditCtrl",
  function($scope, $meteor, $log, $timeout, $stateParams, $modal){
    $scope.dragThreshold = 7; // amount of pixels to consider dragging motion
    $scope.mousedown = false;
    $scope.draging = false;
    $scope.drawvalue = 1;
    $scope.timeout = null;
    $scope.animationPlaying = false;
    $scope.animationLoop = false;
    $scope.activeFrame = 0;
    $scope.saveTimeout = null;

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    $scope.animations = $meteor.subscribe("animations").then(function () {
      $scope.animation = $meteor.object(Animations, $stateParams.animationId);
      $scope.animation.name ="blblblb";
      $scope.$watch(function(scope) { return scope.getActiveFrame() },
        function() { $scope.drawFrame();}
      );
    });

    $scope.drawFrame = function () {
      $scope.animation.frames[$scope.activeFrame].pixels.forEach(function(pixel, index){
        var pX = 10 +  index % 8 * (40 + 10);
        var pY = 10 + Math.floor(index / 8) * (40 + 10);
        if(pixel.value) {
          ctx.fillStyle = "#d43f3a";
        } else {
          ctx.fillStyle = "#b9def0";
        }
        ctx.fillRect(pX,pY,40,40);
      });
    };

    $scope.baseFrame = function () {
      this.pixels = [];
      this.duration = 500; // 0.5fps
    };

    $scope.delayedSave = function() {
      console.log("delaying save");
      $timeout(function(){
        console.log($scope.animation);
        $scope.animation.save()}, 600); // need timeout to wait for directive propagation
    };

    $scope.pixelClass = function(value) {
      return value == 0 ? "false" : "true";
    };

    $scope.getActiveFrame = function () {
      if($scope.animation) {
        var num = $scope.activeFrame;
        return $scope.animation.frames[num];
      }
      return false;
    };

    $scope.importString = "";

    $scope.import = function () {
      var importModalInstance = $modal.open({
      importString: $scope.importString,
      templateUrl: 'client/animations/views/modal-content-import.ng.html',
      controller: 'importModalInstanceCtrl',
      resolve: {
        importString: function () {
          return $scope.importString;
        }
      }
    });

    importModalInstance.result.then(function (importString) {
      $scope.importString = importString;
      $log.log($scope.importString)
    }, function () {
      $log.info('Import Modal dismissed at: ' + new Date());
    });

    };

    $scope.export = function () {

      $scope.animationExport = new function () {
        this.name = $scope.animation.name;
        this.frames = [];
      };

      $scope.animation.frames.forEach(function (frame, index) {
        var frameExport = {index: index, one_bit_string: "", one_bit: [], eight_bit: []};
        var bitPos = 7;     //  used to calculate row value
        var pixelSum = 0;   //
        frame.pixels.forEach(function (pixel) {
          frameExport.one_bit_string += pixel.value;
          frameExport.one_bit.push(pixel.value);
          pixelSum += pixel.value << bitPos--;
          if(bitPos == -1)  {
            frameExport.eight_bit.push(pixelSum); // we read 1 byte push it
            bitPos = 7;
            pixelSum = 0;
          }
        });
        $scope.animationExport.frames.push(frameExport);
      });

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'client/animations/views/modal-content-export.ng.html',
        controller: 'exportModalInstanceCtrl',
        resolve: {
          animationExport: function () {
            return $scope.animationExport;
          }
        }
      });

      modalInstance.result.then(function () {
        //$scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
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

    $scope.toggleLoop = function () {
      $scope.animationLoop = !$scope.animationLoop;
    };

    $scope.animate = function () {
      $scope.timeout =
          $timeout(function () {
            if ($scope.activeFrame < $scope.animation.frames.length - 1) {
              $scope.activeFrame++;
              $scope.animate();
            } else {
              $scope.activeFrame = 0;
              if(!$scope.animationLoop) {
                $scope.togglePlay();
              } else {
                $scope.animate();
              }
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
    };

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

    $scope.togglePixel = function (lastX, lastY) {
      if(lastX < 10 || lastX > 400 || lastY < 10 || lastY > 400)
        return;
      var pX = Math.floor(lastX / 50);
      var pY = Math.floor(lastY / 50);
      if(lastX % 50 > 10 && lastY % 50 > 10) {
        $scope.getActiveFrame().pixels[pY*8+pX].value =
        $scope.getActiveFrame().pixels[pY*8+pX].value == 1 ? 0 : 1;
      }
    };

    $scope.drawPixel = function (lastX, lastY) {
      if(lastX < 10 || lastX > 400 || lastY < 10 || lastY > 400)
        return;
      var pX = Math.floor(lastX / 50);
      var pY = Math.floor(lastY / 50);
      if(lastX % 50 > 10 && lastY % 50 > 10) {
        $scope.getActiveFrame().pixels[pY * 8 + pX].value = $scope.drawvalue;
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
      //if($scope.saveTimeout)
      //  $timeout.cancel($scope.saveTimeout); // requeue save
      //$scope.saveTimeout =
      //  $timeout(function () {
      //    $scope.animation.save();
      //  }, 750);
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
