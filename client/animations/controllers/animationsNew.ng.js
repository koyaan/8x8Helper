angular.module("eightbyeightHelper").controller("AnimationsNewCtrl",
  function ($scope, $meteor, $log, $state) {
    $scope.animations = $meteor.collection(Animations).subscribe("animations");
    var animation = new empty_animation();
    //var animation = new random_animation();
    // TODO: what if not authed
    if(!$scope.currentUser) {
      alert("You must be logged in to create a new Animation");
      $state.go('animations');
      return;
    }
    animation.owner = $scope.currentUser._id;
    $log.log($scope.currentUser);
    animation.nickname = $scope.currentUser.username;
    var promise = $scope.animations.save(animation);
    promise.then(
      function(data){
        console.log('animation insert success', data);
        $scope.animinationId = data[0]._id;
        $state.go('animationEdit', {animationId: data[0]._id});
      },
      function(err){
        console.log('animation insert failed', err);
      }
    );
  });