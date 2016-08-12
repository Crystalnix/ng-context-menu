'''
    ng-context-menu - v1.0.1 - An AngularJS directive to display a context menu
    when a right-click event is triggered

    @author Ian Kennington Walter (http:/ /ianvonwalter.com)
'''

angular.module 'ng-context-menu', []
.factory 'ContextMenuService', ->
    return {
        element: null
        menuElement: null
    }
.directive 'contextMenu', [
    '$document'
    'ContextMenuService'
    ($document, ContextMenuService) ->

        restrict: 'A'
        scope:
            'callback': '&contextMenu'
            'closeCallback': '&contextMenuClose'

            'disabled': '=contextMenuDisabled'

        link: ($scope, $element, $attrs) ->
            opened = no

            open = (event, menuElement) ->
                menuElement.addClass 'open'
                doc = $document[0].documentElement
                docLeft = (window.pageXOffset or doc.scrollLeft) - (doc.clientLeft or 0)
                docTop = (window.pageYOffset or doc.scrollTop) - (doc.clientTop or 0)
                elementWidth = menuElement[0].scrollWidth
                elementHeight = menuElement[0].scrollHeight
                docWidth = doc.clientWidth + docLeft
                docHeight = doc.clientHeight + docTop
                totalWidth = elementWidth + event.pageX
                totalHeight = elementHeight + event.pageY
                left = Math.max(event.pageX - docLeft, 0)
                top = Math.max(event.pageY - docTop, 0)
                if totalWidth > docWidth
                    left = left - (totalWidth - docWidth)
                if totalHeight > docHeight
                    top = top - (totalHeight - docHeight)
                menuElement.css 'top', top + 'px'
                menuElement.css 'left', left + 'px'
                opened = yes
                return


            close = (menuElement) ->
                menuElement.removeClass 'open'
                if opened
                    do $scope.closeCallback
                opened = no
                return


            handleKeyUpEvent = (event) ->
                if not $scope.disabled and opened and event.keyCode is 27
                    $scope.$apply ->
                        close ContextMenuService.menuElement
                return


            handleClickEvent = (event) ->
                if not $scope.disabled and opened and (event.button isnt 2 or event.target isnt ContextMenuService.element)
                    $scope.$apply ->
                        close ContextMenuService.menuElement
                return


            $element.bind 'contextmenu', (event) ->
                unless $scope.disabled
                    if ContextMenuService.menuElement isnt null
                        close ContextMenuService.menuElement
                    ContextMenuService.menuElement = angular.element(document.getElementById($attrs.target))
                    ContextMenuService.element = event.target
                    #console.log('set', ContextMenuService.element);
                    do event.preventDefault
                    do event.stopPropagation
                    $scope.$apply ->
                        $scope.callback $event: event
                    $scope.$apply ->
                        open event, ContextMenuService.menuElement
                return



            $document.bind 'keyup', handleKeyUpEvent

            # Firefox treats a right-click as a click and a contextmenu event
            # while other browsers just treat it as a contextmenu event
            $document.bind 'click', handleClickEvent

            $document.bind 'contextmenu', handleClickEvent

            $scope.$on '$destroy', ->
                #console.log('destroy');
                $document.unbind 'keyup', handleKeyUpEvent
                $document.unbind 'click', handleClickEvent
                $document.unbind 'contextmenu', handleClickEvent
                return

            return

]
