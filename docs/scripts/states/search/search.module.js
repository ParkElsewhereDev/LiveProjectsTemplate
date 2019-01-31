(function() {
	'use strict';

	angular
		.module('app.searchState', [
      'app.connectionError'
		])
		.config(function($stateProvider) {
			$stateProvider
        .state('searchpostcode', {
          url: '/search/postcode/:postcode',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
          params: {
            latitude:null,
            longitude:null
          },
          resolve: {
            location: ['$stateParams','locationsSrvc', function( $stateParams, locationsSrvc )  {
              return locationsSrvc.getLocation( $stateParams.postcode ).then(
                function gotOkay( location ) {
                  return location.result;
                },
                function fail( err ) {
                  alert(err);
                }
              );
            }],
            postcode: ['$stateParams','locationsSrvc', function( $stateParams, locationsSrvc )  {
              return;
            }]
          }
        })
        .state('search-latlong', {
          url: '/search/latitude/:latitude/longitude/:longitude',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
          params: {
            latitude:null,
            longiude:null
          },
          resolve: {
            postcode: function(locationsSrvc) {
              return locationsSrvc.getPostcodes( {
                latitude:  $state.params.latitude,
                longitude: $state.params.longitude
              }, 100 );
            }
          }
        })
				.state('search', {
					url: '/search',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
          resolve: {
            location: function(locationsSrvc) {
              return locationsSrvc.getBrowserLocation();
            },
            postcode: function(locationsSrvc) {
              locationsSrvc.getBrowserLocation()
                .then(function (position){
                  return locationsSrvc.locationToPostcode(position);
                } )
                .catch( function(error) {
                  return(undefined);
                } )
              ;
            },
          },
					cache: false
				});
		});
})();
