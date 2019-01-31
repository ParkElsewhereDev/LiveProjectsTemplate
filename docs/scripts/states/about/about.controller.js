(function () {
  'use strict';

  angular
		.module('app.aboutState')
		.controller('aboutCtrl', aboutCtrl);

  aboutCtrl.$inject = [
	  '$scope',
	  '$timeout',
	  '$state'
  ];

  function aboutCtrl(
    $scope,
    $timeout,
    $state
  ) {
    var vm = angular.extend(this, {});
    //Controller below
    vm.goHome = function goHome(){
	    console.log("go home!");
      $state.go('home');
    }
		return vm;
	}
		
})();
