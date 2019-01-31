(function () {
  'use strict';

  angular
    .module('app.homeState')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [
    '$scope',
    '$timeout',
    '$q',
    'locationsSrvc',
    'stickerSrvc',
    'sightingsSrvc',
    '$state',
    'toaster'
  ];

  function homeCtrl(
    $scope,
    $timeout,
    $q,
    locationsSrvc,
    stickerSrvc,
    sightingsSrvc,
    $state,
    toaster
  ) {
    var vm = angular.extend(this, {

    });

    vm.homeForm={
      postcode:"",
      sticker:""
    };

    vm.postcode="";
    vm.sticker="";

    vm.logItButtonDisabled=true;
    vm.searchItButtonDisabled=true;
    vm.isMyLocation = false;
    vm.myPostcode = "";
    vm.postcodeValidator = locationsSrvc.POSTCODE_VALIDATION_REGEX;

    $scope.$on( '$stateChangeSuccess', vm.initialiseView );

    //Controller below
    vm.initialiseView = function initialiseView() {
      vm.handleIsMyLocation();
    };

    vm.setform = function setform(f){
      console.log("vm.setform - got ",f);
    };

    vm.goSearch = function() {
      $state.go('search');
    };

    vm.goAbout = function() {
      $state.go('about');
    };

    vm.getLocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
    };

    vm.handleSearchIt = function handleSearchIt() {
      // this is 'search it'
      if( vm.postcode ) {
        $state.go('searchpostcode',{ "postcode": vm.postcode });
      }
    };

    vm.handleLogIt = function handleLogIt() {
      //window.alert("Log It\npostcode: "+vm.postcode+"\nsticker:"+vm.sticker);
      // has to perform https://trello.com/c/QAvEzIPT/57-logging-preparation-process
      // 1. prep the living thing
      // 2. invoke logging process
      //    1. postcode
      //    2. location
      //    3. date
      //    4. living thing reference UUID
      // 3. push to restlet
      // 4. fail?
      // 5. logging feedback
      //    1. postcode
      //    2. living thing reference
      //    3. date
      var livingThing = stickerSrvc.registersticker( vm.sticker ).then( // 1.
        function registeredstickerOk( confirmedLivingThing ) {
          console.log(confirmedLivingThing);
          sightingsSrvc.registerSighting( // 2.1 -> 2.4, 3
            vm.postcode,
            vm.location,
            confirmedLivingThing.id
          ).then(
            function registeredstickerOkAndPostedSightingOk(success){ // 5
              var now = new Date();
              var dateFromEpoch = now.getTime();
              /*
              dateFrom.setHours(0,0,0,0); // midnight
              var dateTo = new Date();
              dateTo.setHours(23,59,59,9999) */
              var dateToEpoch = dateFromEpoch - ( 24*60*60 );
              sightingsSrvc.getSightings( vm.postcode,
                                          dateFromEpoch,
                                          dateToEpoch,
                                          confirmedLivingThing.id ).then(
                                            function getSightingsOk( payload ) {
                                              // @TODO
                                              toaster.pop('success', "Sighting Logged", 'Your sighting of a <b>'+vm.sticker+'</b> was successful.',5000, 'trustedHtml', function(toaster) {
                                                //alert("click!");
                                                return true;
                                              } );                                            },
                                            function getSightingsError( error ) {
                                              // @TODO
                                              toaster.pop('error', "Error: Logging Error", 'There was a problem finding similar sticker recordings; please check <ul><li>You have provided all required information</li><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
                                                return true;
                                              } );

                                            }
                                          );
            },
            function registeredstickerOkButPostedSightingFail(error){ // 4
              toaster.pop('error', "Error: Logging Error", 'There was a problem uploading your sighting; please check <ul><li>You have provided all required information</li><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
                //alert("click!");
                return true;
              } );
           }
          );
        },
        function registeredstickerFail( error ) {
          console.log("registeredstickerFail: ",error);
          toaster.pop('error', "Error: Logging Error", 'There was a problem uploading your logging; please check <ul><li>You have provided all required information</li><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
            //alert("click!");
            return true;
          } );
       }
      );
    };

    vm.getsticker = function getsticker(partial) {
      var defer = $q.defer();
      stickerSrvc.getSuggestedstickerNames( partial ).then(
        function gotstickerNames( results ) {
          defer.resolve(results);
        },
        function gotstickerNamesError( error ) {
          console.log( "error, somehow" );
          defer.reject( error );
        }
      );
      return defer.promise;
    };

    vm.getPostcodes = function getPostcodes(partial) {
      var defer = $q.defer();
      locationsSrvc.getPostcodesFromPartial( partial ).then(
        function gotPostcodes( results ) {
            defer.resolve( results );
          },
          function error( error ) {
            console.log("getPostcodes: error ",error);
            defer.reject( error );
          }
        ).catch(function(e){
          console.log("EXCEPTION",e);
          toaster.pop('error', "Error: Postcode Error", 'There was a problem accesing the Postcodes API; please check your intenet connection',0, 'trustedHtml', function(toaster) {
            //alert("click!");
            return true;
          } );

          return[];
        });
      return defer.promise;
    };

    vm.revalidateForm = function revalidateForm() {
      if(vm.homeForm.postcode.$invalid===true) {
        vm.searchItButtonDisabled=false;
      } else {
        vm.searchItButtonDisabled=true;
      }

      if( vm.myPostcode===vm.postcode) {
        vm.isMyLocation = true;
      } else {
        vm.isMyLocation = false;
      }

      if( ((vm.homeForm.sticker.$invalid===true)) && (vm.isMyLocation===true) ) {
        vm.logItButtonDisabled=false;
      } else {
        vm.logItButtonDisabled=true;
      }
    };

    ////

    vm.maybeSetPostcodeToHere = function maybeSetPostcodeToHere( newpostcode ) {
      vm.myPostcode = newpostcode;
      vm.postcode = newpostcode;
      vm.revalidateForm();
    };

    vm.handleIsMyLocation = function handleIsMyLocation() {
      locationsSrvc.getBrowserLocation().then(
        function gotBrowserLocation( position ){
          locationsSrvc.locationToPostcode( position, 100, 1 ).then(
            function gotPostcodeFromPosition( results ) {
              // postcode is in result.postcode
              vm.location = {
                "lat":results.result[0].latitude,
                "lon": results.result[0].longitude
              };
              vm.maybeSetPostcodeToHere( results.result[0].postcode );
            },
            function errorPostcodeFromPosition( error ) {
              console.log(error);
            }
          );
        },
        function errorBrowserLocation( error ){
          // @TODO this is the user rejecting browser access
          toaster.pop({
            type: 'error',
            title: "Error: No Location Access",
            body: 'Please grant access to your location in this browser window before trying again.',
            bodyOutputType: 'trustedHtml',
            tapToDismiss: false,
            showCloseButton: true,
            timeout: 0,
            onHideCallback: function (toast) {
              //alert("click!");
              vm.handleIsMyLocation(); // try again!
              return true;
            }
          } );
        }
      );
    };

    this.$onInit = function onInit() {
      vm.initialiseView();
    };
  }
})();
