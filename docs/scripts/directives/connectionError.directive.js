console.log("connectionError.directive.js imported");
(function () {
  'use strict';

  angular
    .module('app.connectionError', [

    ])
    .directive('connectionerror', [function(){
    return {
      restrict: 'E',
      scope: {
        show: '='
      },
      replace: true,
      transclude: true,
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        if (attrs.width) {
          scope.dialogStyle.width = attrs.width;
        }
        if (attrs.height) {
          scope.dialogStyle.height = attrs.height;
        }
        scope.hideModal = function hideModal() {
          scope.show = false;
        };
      },
      template: "<div class='ng-modal' ng-show='show'>\
  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\
  <div class='ng-modal-dialog' ng-style='dialogStyle'>\
    <div class='ng-modal-close' ng-click='hideModal()'>×</div>\
    <div class='ng-modal-dialog-content' ng-transclude></div>\
  </div>\
</div>"
    };
  }]);
})();

