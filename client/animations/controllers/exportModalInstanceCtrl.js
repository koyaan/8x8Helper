angular.module('eightbyeightHelper').controller('exportModalInstanceCtrl', function ($scope, $log, $modalInstance, animationExport) {

    $log.info("Exporting");
    $log.log(animationExport);
    $scope.animationExport = animationExport;
    $log.log(JSON.stringify($scope.animationExport));

    $scope.ok = function () {
        $modalInstance.close();
    };
});