angular.module('eightbyeightHelper',['angular-meteor','eightbyeightHelper.directives','ui.router']).run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

      // It's very handy to add references to $state and $stateParams to the $rootScope
      // so that you can access them from any scope within your applications.For example,
      // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
      // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
)


// counter starts at 0
//Session.setDefault('counter', 0);
//
//Template.hello.helpers({
//  counter: function () {
//    return Session.get('counter');
//  }
//});
//
//Template.hello.events({
//  'click button': function () {
//    // increment the counter when button is clicked
//    Session.set('counter', Session.get('counter') + 1);
//  }
//});