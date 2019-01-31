(function() {
	'use strict';

	angular
		.module('app.aboutState', [
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('about', {
					url: '/about',
					templateUrl: 'scripts/states/about/about.html',
					controller: 'aboutCtrl as vm',
					cache: false
				})
		});
})();