angular.module('eightbyeightHelper').
  directive('ebeframe', function () {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model
        var ctx = element[0].getContext('2d');
        ngModel.$render = function() {
          ngModel.$viewValue.pixels.forEach(function(pixel, index){
            var pX = 3 +  index % 8 * (7 + 3);
            var pY = 3 + Math.floor(index / 8) * (7 + 3);
            if(pixel.value) {
              ctx.fillStyle = "#d43f3a";
            } else {
              ctx.fillStyle = "#b9def0";
            }
            ctx.fillRect(pX,pY,7,7);
          });
        };

      }
    };
  });