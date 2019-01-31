(function() {
	'use strict';

	angular
		.module('app.homeState', [
			'ui.router',
      'toaster',
      'ngAnimate'
		])
		.config(function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: 'scripts/states/home/home.html',
					controller: 'homeCtrl as vm',
					cache: false
				});
			$urlRouterProvider.otherwise('/home');
		});
})();
