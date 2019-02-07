// api interface module
// see https://trello.com/c/KOPeRLUa/67-api-module
//
(function() {
  'use strict';

  angular
    .module('app.api', [ 'restlet.sdk' ])
    .factory('stickerSrvc', stickerSrvc)
    .factory('incidentsSrvc', incidentsSrvc)
  ;

  //
  //
  // stickerSrvc
  //
  //

  stickerSrvc.$inject = [
    '$q',
    '$timeout',
    '$sce',
    '$http',
    'parkelsewhere'
  ];
  function stickerSrvc(
    $q,
    $timeout,
    $sce,
    $http,
    parkelsewhere
  ) {
    var service = {};

    service.baseRestletURL = "https://parkelsewheredb.herokuapp.com/";

    parkelsewhere.configureHTTP_BASICAuthentication( window.parkelsewherecredentials.restlet.user, window.parkelsewherecredentials.restlet.pass );

    // methods as per https://trello.com/c/3sLYXMgq/64-sticker-service

    service.getSuggestedstickerNames = function getSuggestedstickerNames( searchTerms ) {
      var defer = $q.defer();
      var requestUrl = "";
      var cleanedSearchTerms = searchTerms.replace(/[^a-zA-Z0-9 :]/g, ''); // regex out all non alphanumeric characters

      if( cleanedSearchTerms.length>0 ) {
        requestUrl = "https://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatch?jsonP=JSON_CALLBACK&srchKey=" + cleanedSearchTerms;
      }
      if( requestUrl !== "" ) {
        return $http.jsonp( requestUrl , { jsonpCallbackParam: "JSON_CALLBACK" } )
          .then(
            function response(data, status, headers, config ) {
              var names = data.data.anyMatchList.map(function(item,index){
		            return(item.commonNameList.commonNames.map(
			            function(commonname,indextrose){
				            return(commonname.commonName);
			            }
                ));
	            })
              .reduce(function(flat,toFlatten){
                return (flat.concat(toFlatten) );
	            },[] )
	            .filter(function(name, index, self){
		            return( ( name!== null ) && ( index === self.indexOf(name) ) );
	            });
              return( names /*.slice(0,100) */ ); /* re-enble a limiter! */
            }, function( error ) {
              //console.log( "getSuggeestedstickerNames error: ", error );
              defer.reject( error );
            } );
      } else {
        defer.resolve();
      }
    };

    service.getRegisteredsticker = function getRegisteredsticker( stickerName ) {
      var endpointUri = service.baseRestletURL + "stickers/?name="+encodeURIComponent( stickerName );
      return($http({method:"GET",url:endpointUri}));
    };

    service.getstickerFromId = function getstickerFromId( idString ) {
      var endpointUri = service.baseRestletURL + "stickers/" + idString;
      return($http({method:"GET",url:endpointUri}));
    };

    // inserts a sticker based on name. Should not create duplicate ites
    service.registersticker = function registersticker( stickerName ) {
      var registerstickerDoesNotExist = function registerstickerDoesNotExist( error ) {
        return parkelsewhere.poststickers({
          "name": stickerName
        }).then(
          function registerstickerFinal( data ) {
            console.log("registersticker: created a new ", stickerName );
            return data.data;
          },
          function registerstickerFinalError( error ) {
            console.log( "registerstickerFinalError: ", error );
            return error;
          }
        );
      };

      return(
        service.getRegisteredsticker( stickerName ).then(
          function registerstickerButExists( data ) {
            if( data.data.length>0 ) {
              console.log("registersticker: sticker already exists! ", stickerName, data );
              return data.data.shift();
            } else {
              // not in the database
              return registerstickerDoesNotExist( {} );
            }
          }
          // also request failure // registerstickerDoesNotExist( stickerName )
        )
      );
    };
    return service;
  }

  //
  //
  // incidentsSrvc
  //
  //

  incidentsSrvc.$inject = [
/*    '$ionicPlatform', */
    '$q',
    '$timeout',
    '$https',
    'parkelsewhere'
  ];
  function incidentsSrvc(
    $q,
    $timeout,
    $https,
    parkelsewhere
  ) {
    var service = {};

    service.baseRestletURL = "https://parkelsewheredb.herokuapp.com/";

    service.getIncidents = function getIncidents( postcode, dateFrom, dateTo, stickersReference ) {
      // Incidents are 'events'

      function addParameter( starting, parameter, value) {
        return( starting+(starting.length>0?"&":"")+
                encodeURIComponent( parameter )+"="+
                encodeURIComponent( value ) );
      }

      var parameters = "";
      if (angular.isDefined(postcode) ) {
        parameters = addParameter( parameters, "postcode", sanitisePostcode( postcode ) );
      }
      /*if (angular.isDefined(dateFrom) ) {
        parameters = addParameter( parameters, "date>", dateFrom );
      }
      if (angular.isDefined(dateTo) ) {
        parameters = addParameter( parameters, "date<", dateTo );
      }*/
      if (angular.isDefined(stickersReference) ) {
        parameters = addParameter( parameters, "sticker", stickersReference );
      }

      var endpointUri = service.baseRestletURL + "incidents/?"+parameters;

      //console.log( "incidentsSrvc.getIncidents: getting  "+endpointUri );

      return($https({method:"GET",url:endpointUri}));
    };

    service.registerSighting = function registerSighting( postcode, location, stickersReference ) {
      var incident = {
        incident: (new Date).getTime()
      };
      if( angular.isDefined( postcode ) ) {
        incident.postcode = sanitisePostcode( postcode );
      }
      if( angular.isDefined( location ) ) {
        incident.lat = location.lat;
        incident.lon = location.lon;
      }
      if( angular.isDefined( stickersReference ) ) {
        incident.sticker = stickersReference;
      }
      //console.log( "incidentsSrvc.registerSighting registering ", incident );
      return parkelsewhere.postIncidents( incident );
    };

    // standardises a postcode for data storage
    // @TODO, maybe - for now just returns inbounf postcode
    var sanitisePostcode = function sanitisePostcode( postcode ) {
      return postcode;
    };

    //
    return service;
  }

})();
