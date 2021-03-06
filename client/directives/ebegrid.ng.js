angular.module('eightbyeightHelper').
  directive("ebegrid", function(){
    return {
      restrict: "A",
      link: function(scope, element){

        // variable that decides if something should be drawn on mousemove
        var drawing = false;
        var draging = false;

        // the last coordinates before the current move
        var lastX;
        var lastY;

        element.bind('mousedown', function(event){
          if(event.offsetX!==undefined){
            lastX = event.offsetX;
            lastY = event.offsetY;
          } else { // Firefox compatibility
            lastX = event.layerX - event.currentTarget.offsetLeft;
            lastY = event.layerY - event.currentTarget.offsetTop;
          }
          // begins new line
          scope.startPosition = {x: lastX, y: lastY};

          drawing = true;
        });

        element.bind('mousemove', function(event){
          if(drawing){
            // get current mouse position
            if(event.offsetX!==undefined){
              currentX = event.offsetX;
              currentY = event.offsetY;
            } else {
              currentX = event.layerX - event.currentTarget.offsetLeft;
              currentY = event.layerY - event.currentTarget.offsetTop;
            }

            if (
              Math.pow(Math.pow(scope.startPosition.x - currentX, 2) +
              Math.pow(scope.startPosition.y - currentY, 2), 0.5) >
              scope.dragThreshold) {
              draging = true;
              scope.drawPixel(currentX, currentY);
              scope.drawFrame();
            }

            // set current coordinates to last one
            lastX = currentX;
            lastY = currentY;
          }

        });

        element.bind('mouseup', function(event){
          if(event.offsetX !== undefined){
            lastX = event.offsetX;
            lastY = event.offsetY;
          } else { // Firefox compatibility
            lastX = event.layerX - event.currentTarget.offsetLeft;
            lastY = event.layerY - event.currentTarget.offsetTop;
          }

          if(!draging) {
            scope.togglePixel(lastX, lastY);
            scope.drawFrame();
          }

          scope.animation.save();
          // stop drawing
          drawing = false;
          // stop draging
          draging = false;
        });

        // canvas reset
        function reset(){
          element[0].width = element[0].width;
        }
      }
    };
  });