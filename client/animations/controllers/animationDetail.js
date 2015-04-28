angular.module("eightbyeightHelper").controller("AnimationDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function ($scope, $stateParams, $meteor) {

    $scope.animationId = $stateParams.animationId;
    $scope.animation = $meteor.object(Animations, $stateParams.animationId);
  }]);