(function () {
  'use strict';

  angular
      .module('app.searchState')
      .controller('searchCtrl', searchCtrl);

  searchCtrl.$inject = [
    '$q',
    '$scope',
    '$timeout',
    'locationsSrvc',
    'stickerSrvc',
    'incidentsSrvc',
    '$state',
    '$stateParams',
    'toaster',
    // from state.resolve
    'location',
    'postcode'
  ];

  function searchCtrl(
    $q,
    $scope,
    $timeout,
    locationsSrvc,
    stickerSrvc,
    incidentsSrvc,
    $state,
    $stateParams,
    toaster,
    location,
    postcode
  ) {

    var vm = angular.extend(this, {
    });

    vm.busy = true;

    var startingZoom = 16;
    var currentMapZoom = startingZoom;
    var clusterMarkers = L.markerClusterGroup();

    vm.mapData = []; // dirty hack to work around having to filter client-side; this should be better handled with a service to store and manage data

    vm.fromDate = undefined;
    vm.fromDateOpened = false;
    vm.handleFromDateOpen = function handleFromDateOpen(){
      vm.fromDateOpened = true;
      vm.toDateOpened = false;
    };

    vm.toDate = undefined;
    vm.toDateOpened = false;
    vm.handleToDateOpen = function handleToDateOpen(){
      vm.toDateOpened = true;
      vm.fromDateOpened = false;
    };

    vm.fromDateChange = function fromDateChange(e) {
      vm.refreshMap( vm.postcode );
    };

    vm.toDateChange = function toDateChange(e) {
      vm.refreshMap( vm.postcode );
    };

    //Controller below
    var createMap = function( mapPosition ) {
      var latlng =[ mapPosition.latitude, mapPosition.longitude ];

      var mymap = L.map('mymap', { center: latlng,
                                   zoom: startingZoom, minZoom: 1,  maxZoom: 18,
                                   zoomControl: true } );

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWxpY2VkaWdpdGFsbGFicyIsImEiOiJjamF3YnA1a3UwbWliMnZta3B5b3NpbDBzIn0.39_7KL6gzUbNJEsbeYkpVg'
      }).addTo(mymap);

      clusterMarkers = L.markerClusterGroup();
      mymap.addLayer(clusterMarkers);

      // events
      mymap.on('resize moveend', handleMapMoveEvent );
      mymap.on('zoomlevelschange zoomend', handleMapZoomEvent );

      return mymap;
    };

    var removeMarker = function(map, marker){
      map.removeLayer(marker);
    };

    var removeAllMarkers = function(){
      mymap.removeLayer(clusterMarkers);
      clusterMarkers = L.markerClusterGroup(); //re-new clusters
    };

    vm.centerMap = function centerMap( location ){
        createMap( location );
    };

    vm.refreshMap = function( postcode ) {
      vm.postcode = postcode;
      vm.busy = true;

      getStickersForPostcode( postcode );
    };

    function getStickersForPostcode( postcode ) {
      var fromEpoch = vm.fromDate ? vm.fromDate.getTime() : undefined;
      var toEpoch = vm.toDate ? vm.toDate.getTime() : undefined;
      //console.log( "getStickersForPostcode " + postcode, fromEpoch, toEpoch );
      incidentsSrvc.getStickers( postcode ).then(
        function gotStickersForPostcodeOkay( data ) {
          removeAllMarkers();
          gotStickersForPostcode( data, fromEpoch, toEpoch );
        },
        function getStickersForPostcodeError(err) {
          console.log("error from getStickers:", err);
          toaster.pop('error', "Error: Data Error", 'There was a problem accessing stickers.',0, 'trustedHtml', function(toaster) {
            return(true);
          } );
        }
      ).then( function() {
          vm.busy = false;
        }
      );
    }

    function gotStickersForPostcode(result, fromEpoch, toEpoch){
      //console.log("got stickers from postcode:", fromEpoch, toEpoch);
      result.data
        .filter(function(item,index){
          //console.log(item);
          if( ( isNaN( toEpoch ) && angular.isDefined( fromEpoch ) === false ) && ( isNaN( toEpoch ) && angular.isDefined( toEpoch ) === false ) ) {
            //console.log("no dates!");
            return true;
          }
          var valid=true;
          if( ( ( !isNaN( fromEpoch ) ) && ( angular.isDefined( fromEpoch ) === true ) ) && ( item.date < fromEpoch ) ) {
            //console.log("fromEpoch and invalid");
            valid = false;
          }
          if( ( ( !isNaN( toEpoch   ) ) && ( angular.isDefined( toEpoch   ) === true ) ) && ( item.date > toEpoch   ) ) {
            //console.log("toEpoch and invalid");
            valid = false;
          }
          return valid;
        }, [] )
        .forEach(function(e,index){
          var marker;
          // turn the thing-ID into a string
          stickerSrvc.getstickerFromId(e.thing).then(
            function turnedIdIntoAsticker( payload ){
              marker = L.marker(new L.LatLng(e.lat, e.lon),{
                sticker: payload.data.name,
                date: new Date(e.date).toLocaleDateString(),
                time: new Date(e.date).toLocaleTimeString(),
                location: e.postcode
              });
              marker.bindPopup( payload.data.name+"<br>"+new Date(e.date).toLocaleString()+"<br>"+e.postcode );
              clusterMarkers.addLayer( marker );
            },
            function errorGettingstickerFromID( error ) {
              marker = L.marker(new L.LatLng(e.lat, e.lon),{
                sticker: e.thing+"(problem with sticker service)",
                date: new Date(e.date).toLocaleDateString(),
                time: new Date(e.date).toLocaleTimeString(),
                location: e.postcode
              });
              console.log("errorGettingstickerFromID, ", error);
              marker.bindPopup( e );
              clusterMarkers.addLayer( marker );
            }
          );
          mymap.addLayer( clusterMarkers );
        }
      );
      clusterMarkers.on('clustermouseover', function (a) {
	      // a.layer is actually a cluster
        var popup = L.popup()
            .setLatLng(a.layer.getLatLng())
            .setContent(
              "<table class='sticker-cluster'><thead><tr><th class='first'>sticker</th><th>Date</th><th>Time</th><th>Location</th></tr></thead><tbody>"+
                (a.layer.getAllChildMarkers().reduce(function(flat,toFlatten){
                  return( flat+"<tr>"+"<td class='name'>"+toFlatten.options.sticker+"</td>"+"<td>"+[ toFlatten.options.date, toFlatten.options.time, toFlatten.options.location].join("</td><td>")+"</td></tr>" );
                },""))+
                "</tbody></table>"
            )
            .openOn(mymap);
      }).on('clustermouseout',function(c){
        mymap.closePopup();
      }).on('clusterclick',function(c){
          mymap.closePopup();
      });
    }

    function handleMapZoomEvent() {
      if (mymap.getZoom()<currentMapZoom) {
        getCenterAndRadius();
      }
      //getCenterAndRadius();
      currentMapZoom = mymap.getZoom();
    }

    function handleMapMoveEvent() {
      getCenterAndRadius();
    }

    function getCenterAndRadius() {
      var centerLatLong = mymap.getCenter();
      var mapBounds = mymap.getBounds();
      var distance = mymap.distance(mapBounds._northEast, mapBounds._southWest );
      var fromEpoch = vm.fromDate ? vm.fromDate.getTime() : undefined;
      var toEpoch = vm.toDate ? vm.toDate.getTime() : undefined;

      // zap the markers
      removeAllMarkers();

      // get the postcodes in this area
      vm.busy=true;
      locationsSrvc.locationToPostcode({latitude:centerLatLong.lat, longitude:centerLatLong.lng}, distance).then(
        function gotPostcodeSet( data ){
          var postcodes = [];
          if ( data.result !== null ) {
            postcodes = data.result.map( function(item, index){
              //console.log(item);
              return item.postcode;
            },[]);
          }
          //console.log("postcodes here are:", postcodes);
          if(postcodes.length>0) {
            vm.postcode = postcodes[0];
          }
          // get data for postcodes
          var stickers = [];
          for(var i in postcodes) {
            //console.log(" queueing up for "+postcodes[i]);
            stickers.push( incidentsSrvc.getIncidents( postcodes[i] )
                            .then(
                              function gotBulkStickers(result){
                                gotStickersForPostcode(result, fromEpoch, toEpoch );
                              },
                              function gotBulkStickersError(error){
                                console.log("problem getting bulk stickers",error);
                              }
                            )
                          );
          }
          $q.all(stickers).then(
            function( data ) {
              //console.log("got em all!");
            },
            function( error ) {
              //console.log("oh heck, "+error);
            }
          ).then(
            function(){
              vm.busy = false;
            }
          );
        },
        function failedPostcodeSet( error) {
          console.log( "error getting postcodes! ");
          // @TODO
          toaster.pop('warning', "Oops: Postcode Error", 'There was a a problem retrieving postcodes; please check <ul><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
            alert("click!");
            return true;
          } );

        }
      );
    }

    vm.clearMap = function(){
      removeAllMarkers();
    };
    vm.goHome = function() {
      $state.go("home");
    };

    vm.busy = false;

    var mymap = createMap( location );
    var clusterMarkers = L.markerClusterGroup();
    mymap.addLayer(clusterMarkers);

    // find what's there
    if( location.postcode ) {
      vm.refreshMap( location.postcode );
    }

    if( angular.isDefined( location.postcode ) === true ) {
      vm.postcode = location.postcode;
    } else {
      console.log("*** no postcode!!!", location, postcode);
      //vm.postcode = "W1T 2PR"; // central london tells us we have the wrong location somehow
    }
  }
})();
