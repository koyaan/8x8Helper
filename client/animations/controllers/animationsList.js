angular.module("eightbyeightHelper").controller("AnimationsListCtrl", ['$scope', '$meteor',
  function ($scope, $meteor) {

    $scope.animations = $meteor.collection(Animations);

    $scope.remove = function (animation) {
      $scope.animations.splice($scope.animations.indexOf(animation), 1);
    };

  }]);