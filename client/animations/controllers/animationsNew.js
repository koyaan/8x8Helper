angular.module("eightbyeightHelper").controller("AnimationsNewCtrl",
  function ($scope, $meteor, $log, $state) {
    $scope.animations = $meteor.collection(Animations).subscribe("animations");
    var animation = new empty_animation();
    //var animation = new random_animation();
    animation.owner = $scope.currentUser._id;
    var promise = $scope.animations.save(animation);
    promise.then(
      function(data){
        console.log('animation insert success', data);
        $state.go('animationEdit', {animationId: data[0]._id});
      },
      function(err){
        console.log('animation insert failed', err);
      }
    );
  });