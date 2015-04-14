if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

    //angular.module('eightbyeightHelper',['angular-meteor']);
    angular.module('eightbyeightHelper', [
            'angular-meteor',
            'eightbyeightHelper.filters',
            'eightbyeightHelper.services',
            'eightbyeightHelper.directives',
            'eightbyeightHelper.controllers']
    );

    angular.module('eightbyeightHelper.controllers', []).

        controller('eightbyeightController', ['$scope','$timeout', '$log', function($scope, $timeout, $log) {

            this.dragThreshold = 7; // amount of pixels to consider dragging motion
            this.mousedown = false;
            this.drawvalue = true;
            this.timeout= null;

            this.baseFrame = function() {
                this.pixels = [];
                this.duration = 500; // 0.5fps
            };

            this.init = function() {
                var savedAnimation;
                if( false/* savedAnimation = localStorageService.get('eightByEightHelper.animation')*/) {
                    this.pixelAnimation = savedAnimation
                }   else {
                    this.pixelAnimation = {
                        frames: [],
                        playing: false,
                        activeFrame: -1,
                        loop: false,
                        name: "Unitled Animation"
                    };
                    this.addFrame();  /* initialize with one empty frame */
                }

            };

            this.getActiveFrame =  function() {
                return this.pixelAnimation.frames[this.pixelAnimation.activeFrame];
            };

            this.export = function() {

                var animationExport = [];

                this.pixelAnimation.frames.forEach(function(frame, index) {
                    var frameExport = {index: index, pixels: ""};
                    frame.pixels.forEach(function(pixel)   {
                        frameExport.pixels += pixel.value ? "1":"0";
                    });
                    animationExport.push(frameExport);
                });
                console.log(JSON.stringify(this.pixelAnimation));
            };

            this.cloneFrame = function() {

                var clonedFrame = new this.baseFrame();

                for(var i=0; i<64; i++) {
                    clonedFrame.pixels.push({value: this.getActiveFrame().pixels[i].value});
                }

                this.pixelAnimation.frames.splice(this.pixelAnimation.activeFrame, 0, clonedFrame);
                this.pixelAnimation.activeFrame++;
            };

            this.toggle  = function() {
                if(this.pixelAnimation.playing = !this.pixelAnimation.playing) {
                    this.animate();
                } else {
                    $timeout.cancel(this.timeout);
                }
            };

            this.animate = function() {
                this.timeout =
                    $timeout(function() {
                        if($scope.ebeHelper.pixelAnimation.activeFrame < $scope.ebeHelper.pixelAnimation.frames.length-1) {
                            $scope.ebeHelper.pixelAnimation.activeFrame++;
                            $scope.ebeHelper.animate();
                        } else {
                            $scope.ebeHelper.toggle();
                        }
                    }, $scope.ebeHelper.getActiveFrame().duration);
            };

            this.addFrame = function() {
                var newFrame = new this.baseFrame();

                for(var i=0; i<64; i++) {
                    newFrame.pixels.push({value: false});
                }

                if(this.pixelAnimation.activeFrame == -1)    {
                    this.pixelAnimation.frames.push(newFrame);
                } else {
                    this.pixelAnimation.frames.splice(this.pixelAnimation.activeFrame+1, 0, newFrame);
                }
                this.pixelAnimation.activeFrame++;
            };

            this.gotoFrame = function(index) {
                this.pixelAnimation.activeFrame = index;
            };

            this.prevFrame = function() {
                this.gotoFrame(this.pixelAnimation.activeFrame > 0 ? this.pixelAnimation.activeFrame-1 : 0);
            };

            this.nextFrame = function() {
                if(this.pixelAnimation.activeFrame < this.pixelAnimation.frames.length-1)   {
                    this.gotoFrame(this.pixelAnimation.activeFrame+1);
                }
            };

            this.firstFrame = function() {
                this.gotoFrame(0);
            };

            this.lastFrame = function () {
                this.gotoFrame(this.pixelAnimation.frames.length-1)
            }

            this.fillFrame = function() {
                for(var i=0; i<64; i++) {
                    this.pixelAnimation.frames[this.pixelAnimation.activeFrame].pixels[i].value = true;
                }
                this.drawvalue = false;
            };

            this.clearFrame = function() {
                for(var i=0; i<64; i++) {
                    this.pixelAnimation.frames[this.pixelAnimation.activeFrame].pixels[i].value = false;
                }
                this.drawvalue = true;
            };

            this.removeFrame = function() {

                if(this.pixelAnimation.activeFrame == 0 && this.pixelAnimation.frames.length == 1)   {
                    return;
                }

                this.pixelAnimation.frames.splice(this.pixelAnimation.activeFrame,1);

                if(this.pixelAnimation.activeFrame > 0)   {
                    this.pixelAnimation.activeFrame--;
                }

            };

            this.localSave = function() {
                $log("not implemented");
                //localStorageService.add('eightByEightHelper.animation', this.pixelAnimation);
            };

            this.keypressHandler = function(event) {
                console.log(event.keyCode);
                switch(event.keyCode)   {
                    case 13:    /* KP_ENTER */
                        this.cloneFrame();
                        break;
                    case 32:    /* SPACE */
                    case 44:    /* KP_, */
                        this.drawvalue = !this.drawvalue;
                        break;
                    case 43:    /* KP_PLUS */
                        this.addFrame();
                        break;
                    case 45:    /* KP_MINUS */
                        this.removeFrame();
                        break;
//                case 48:    /* KP_0 */
//                    this.pixelAnimation.toggle();
//                    break;
//                case 49:   /* KP_1 */
//                    this.firstFrame();
//                    break;
//                case 51:    /* KP_§ */
//                    this.lastFrame();
//                    break;
//                case 52:    /* KP_4 */
//                    this.prevFrame();
//                    break;
//                case 54:    /* KP_6 */
//                    this.nextFrame();
//                    break;
                }
            };

            this.mousemovePixel = function(event, pixel)    {
                if(this.mousedown)    {
                    if(Math.pow(Math.pow(this.startPosition.x - event.pageX, 2) + Math.pow(this.startPosition.y - event.pageY, 2), 0.5) > this.dragThreshold) {
                        pixel.value =  this.drawvalue;
                    }
                }
            };

            this.clickPixel = function(pixel) {

                pixel.value = ! pixel.value

            };

            this.mousedownHandler = function(event)   {
                this.mousedown = true;
                this.startPosition = { x: event.pageX, y: event.pageY};
            };

            this.nextdoubleClick = function() {
                if(this.pixelAnimation.activeFrame == this.pixelAnimation.frames.length-1)    {
                    this.addFrame();
                }
            };

        }]);

    angular.module('eightbyeightHelper.directives', []).
        directive('appVersion', ['version', function(version) {
            return function(scope, elm, attrs) {
                elm.text(version);
            };
        }]).
        directive('contenteditable', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    // view -> model
                    elm.on('blur', function() {
                        scope.$apply(function() {
                            ctrl.$setViewValue(elm.html());
                        });
                    });

                    // model -> view
                    ctrl.$render = function(value) {
                        elm.html(value);
                    };

                    // load init value from DOM
                    //   ctrl.$setViewValue(value);
                }
            };
        });

    /* Filters */

    angular.module('eightbyeightHelper.filters', []).
        filter('interpolate', ['version', function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            }
        }]);

    /* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
    angular.module('eightbyeightHelper.services', []).
        value('version', '0.1');
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
