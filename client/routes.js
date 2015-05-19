angular.module("eightbyeightHelper").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'client/static/about.ng.html',
        controller: 'AnimationsListCtrl'
      })
      .state('animations', {
        url: '/animations',
        templateUrl: 'client/animations/views/animations-list.ng.html',
        controller: 'AnimationsListCtrl',
        resolve: {'subscribe': function($meteor){$meteor.subscribe('animations')}}
      })
      .state('animationDetails', {
        url: '/animations/:animationId',
        templateUrl: 'client/animations/views/animation-details.ng.html',
        controller: 'AnimationDetailsCtrl'
      })
      .state('animationEdit', {
        url: '/animations/edit/:animationId',
        templateUrl: 'client/animations/views/animation-edit.ng.html',
        controller: 'AnimationEditCtrl',
        resolve: {'subscribe': function($meteor){$meteor.subscribe('animations')}}
      })
      .state('newAnimation', {
        url: '/animations/new',
        templateUrl: 'client/animations/views/animations-new.ng.html',
        controller: 'AnimationsNewCtrl',
        resolve: {'subscribe': function($meteor){$meteor.subscribe('animations')}}
      })
    ;

    $urlRouterProvider.otherwise("/animations");
  }]);