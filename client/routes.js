angular.module("eightbyeightHelper").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('animations', {
        url: '/animations',
        templateUrl: 'client/animations/views/animations-list.ng.html',
        controller: 'AnimationsListCtrl'
      })
      .state('animationDetails', {
        url: '/animations/:animationId',
        templateUrl: 'client/animations/views/animation-details.ng.html',
        controller: 'AnimationDetailsCtrl'
      })
      .state('animationEdit', {
        url: '/animations/edit/:animationId',
        templateUrl: 'client/animations/views/animation-edit.ng.html',
        controller: 'AnimationEditCtrl'
      });

    $urlRouterProvider.otherwise("/animations");
  }]);