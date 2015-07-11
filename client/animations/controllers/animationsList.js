angular.module("eightbyeightHelper").controller("AnimationsListCtrl", ['$scope', '$meteor', '$rootScope',
  function ($scope, $meteor, $rootScope) {


      $scope.$meteorSubscribe('animations').then(function (handler) {
        $scope.animations = $meteor.collection(Animations);
        if($rootScope.currentUser)  {
          $scope.myanimations = $meteor.collection(function () {
            return Animations.find({owner: $rootScope.currentUser._id});
          });
        }
      });
    $rootScope.$watch('currentUser', function () {
      if($rootScope.currentUser) {
        $scope.myanimations = $meteor.collection(function () {
          return Animations.find({owner: $rootScope.currentUser._id});
        });
      } else {
        $scope.myanimations = null;
      }
    });

    $scope.animinationId = null;
    $scope.remove = function (animation) {
      $scope.animations.splice($scope.animations.indexOf(animation), 1);
    };

  }]);