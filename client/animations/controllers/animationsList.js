angular.module("eightbyeightHelper").controller("AnimationsListCtrl", ['$scope', '$meteor', '$rootScope',
  function ($scope, $meteor) {

      $scope.$meteorSubscribe('animations').then(function (handler) {
        $scope.animations = $meteor.collection(Animations);
      });

    $meteor.autorun($scope, function() {
      if ($scope.getReactively('currentUser')) {
        $scope.myanimations = $meteor.collection(function () {
            return Animations.find({owner: $scope.getReactively('currentUser')._id});
        });
      }
    });

    $scope.animinationId = null;
    $scope.remove = function (animation) {
      $scope.animations.splice($scope.animations.indexOf(animation), 1);
    };

  }]);