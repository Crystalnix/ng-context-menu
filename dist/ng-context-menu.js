'ng-context-menu - v1.0.1 - An AngularJS directive to display a context menu\nwhen a right-click event is triggered\n\n@author Ian Kennington Walter (http:/ /ianvonwalter.com)';
angular.module('ng-context-menu', []).factory('ContextMenuService', function() {
  return {
    element: null,
    menuElement: null
  };
}).directive('contextMenu', [
  '$document', 'ContextMenuService', function($document, ContextMenuService) {
    return {
      restrict: 'A',
      scope: {
        'callback': '&contextMenu',
        'closeCallback': '&contextMenuClose',
        'disabled': '=contextMenuDisabled'
      },
      link: function($scope, $element, $attrs) {
        var close, handleClickEvent, handleKeyUpEvent, open, opened;
        opened = false;
        open = function(event, menuElement) {
          var doc, docHeight, docLeft, docTop, docWidth, elementHeight, elementWidth, left, top, totalHeight, totalWidth;
          menuElement.addClass('open');
          doc = $document[0].documentElement;
          docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
          docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
          elementWidth = menuElement[0].scrollWidth;
          elementHeight = menuElement[0].scrollHeight;
          docWidth = doc.clientWidth + docLeft;
          docHeight = doc.clientHeight + docTop;
          totalWidth = elementWidth + event.pageX;
          totalHeight = elementHeight + event.pageY;
          left = Math.max(event.pageX - docLeft, 0);
          top = Math.max(event.pageY - docTop, 0);
          if (totalWidth > docWidth) {
            left = left - (totalWidth - docWidth);
          }
          if (totalHeight > docHeight) {
            top = top - (totalHeight - docHeight);
          }
          menuElement.css('top', top + 'px');
          menuElement.css('left', left + 'px');
          opened = true;
        };
        close = function(menuElement) {
          menuElement.removeClass('open');
          if (opened) {
            $scope.closeCallback();
          }
          opened = false;
        };
        handleKeyUpEvent = function(event) {
          if (!$scope.disabled && opened && event.keyCode === 27) {
            $scope.$apply(function() {
              return close(ContextMenuService.menuElement);
            });
          }
        };
        handleClickEvent = function(event) {
          if (!$scope.disabled && opened && (event.button !== 2 || event.target !== ContextMenuService.element)) {
            $scope.$apply(function() {
              return close(ContextMenuService.menuElement);
            });
          }
        };
        $element.bind('contextmenu', function(event) {
          if (!$scope.disabled) {
            if (ContextMenuService.menuElement !== null) {
              close(ContextMenuService.menuElement);
            }
            ContextMenuService.menuElement = angular.element(document.getElementById($attrs.target));
            ContextMenuService.element = event.target;
            event.preventDefault();
            event.stopPropagation();
            $scope.$apply(function() {
              return $scope.callback({
                $event: event
              });
            });
            $scope.$apply(function() {
              return open(event, ContextMenuService.menuElement);
            });
          }
        });
        $document.bind('keyup', handleKeyUpEvent);
        $document.bind('click', handleClickEvent);
        $document.bind('contextmenu', handleClickEvent);
        $scope.$on('$destroy', function() {
          $document.unbind('keyup', handleKeyUpEvent);
          $document.unbind('click', handleClickEvent);
          $document.unbind('contextmenu', handleClickEvent);
        });
      }
    };
  }
]);
