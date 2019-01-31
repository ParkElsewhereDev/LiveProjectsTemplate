//module definition
(function() {
	'use strict';

	angular
		.module('app.locations', [
		])
    .factory('locationsSrvc', locationsSrvc);

  locationsSrvc.$inject = [
    '$q',
    '$http',
    '$timeout'
  ];
  function locationsSrvc(
    $q,
    $http,
    $timeout
  ) {
    var service = {};

    service.NO_GEOLOCATION_OBJECT = "No access to geolocation";
    service.BAD_LOCATION_OBJECT = "Bad location object";
    service.BAD_POSTCODE = "Bad postcode";

    service.POSTCODE_VALIDATION_REGEX = "^(GIR 0AA)|((([A-Z-[QVX]][0-9][0-9]?)|(([A-Z-[QVX]][A-Z-[IJZ]][0-9][0-9]?)|(([A-Z-[QVX]][0-9][A-HJKSTUW])|([A-Z-[QVX]][A-Z-[IJZ]][0-9][ABEHMNPRVWXY]))))\s?[0-9][A-Z-[CIKMOV]]{2})$";

    service.getBrowserLocation = function getBrowserLocation() {
      var defer = $q.defer();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          defer.resolve(position.coords);
        },function(error){
          defer.reject(error);
        },{timeout:10000});
      } else {
        console.log("locationsSrvc.getBrowserLocation: exception");
        throw service.NO_GEOLOCATION_OBJECT;
      }
      return defer.promise;
    };

    // wrapper for locationToPostcode
    service.getPostcodes = function getPostcodes(location, radius_m) {
      return service.locationToPostcode( location, radius_m, 1 );
    };

    // coords: an object with a 'latitude' and 'longitude' property
    // radius: integer specifying radius (optional)
    // limit: maximum result count (optional)
    // after promise: returns a list of postcode objects
    service.locationToPostcode = function locationToPostcode( coords, requested_radius, requested_limit ) {
      var defer  = $q.defer();

      var limit = Math.min(requested_limit, 99); // API sets maximum 99 as limit
      var radius = Math.min(requested_radius, 1999); // API sets maximum radius of 1999

      var requestUrl = "";
      if( angular.isObject( coords ) === true  ) {
        if( ( coords.latitude ) && ( coords.longitude ) ) {
          requestUrl = "https://api.postcodes.io/postcodes?lon="+coords.longitude+"&lat="+coords.latitude;
        }
        if( ( angular.isDefined(radius)===true ) && ( Number.isInteger(radius)===true ) ){
          requestUrl = requestUrl + "&radius=" + radius;
        }
        if( ( angular.isDefined(limit)===true ) && ( Number.isInteger(limit)===true ) ) {
          requestUrl = requestUrl + "&limit=" + limit;
        }
      }
      if(requestUrl !== "" ) {
        $http.get( requestUrl )
          .success(function (data, status, headers, config ) {
            defer.resolve( data );
          })
          .error(function ( data, status, headers, config ) {
            throw new Error( status );
            //defer.reject( status );
          });
        return defer.promise;
      };
      throw new Error( service.BAD_LOCATION_OBJECT, coords );
    };

    service.getPostcodesFromPartial = function getPostcodesFromPartial( partial ) {
      var defer = $q.defer();
      if( partial.length>0 ) {
        var requestUrl = "https://api.postcodes.io/postcodes?q=" + partial;
        $http.get( requestUrl ).then (
          function getPostcodeFromPartialResponse(data){
            defer.resolve( data.data.result );
          },
          function getPostcodeFromPartialResponseError( error ) {
            defer.reject( error );
          }
        );
      } else {
        throw "getPostcodesFromPartial - called with nothing";
      }
      return defer.promise;
    };

    // postcode: a string
    // after promise: returns a location object (with latitude and longitude properties)
    service.getLocation = function getLocation( postcode ) {
      var defer = $q.defer();

      var requestUrl = "";
      if( angular.isDefined( postcode ) ) {
        requestUrl = "https://api.postcodes.io/postcodes/" + postcode;
      }
      if( requestUrl !== "" ) {
        $http.get( requestUrl )
          .success(function ( data, status, headers, config ) {
            //console.log( "locationsSrvc.getLocation:", data );
            defer.resolve( data )
          } )
          .error( function ( data, status, headers, config ) {
            throw new Error( status );
            defer.reject( status );
          } );
        return defer.promise;
      }
      throw new Error( service.BAD_POSTCODE );
    };
    return service;
  }
})();
