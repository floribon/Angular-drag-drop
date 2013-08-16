$(function() {

    angular.module('dragAndDrop', [])
        .directive( 'drag', function ( dndApi ) {

        var drags = [],
            dragging = new RegExp( '(\\s|^)dragging(\\s|$)' );

        return {
            restrict: 'A',
            scope: {
                item: '=drag',
                whenStart : '&',
                whenEnd : '&'
            },
            link: function ( scope, elem, attr, ctrl ) {

                elem[0].addEventListener( 'dragstart', function ( e ) {

                    if ( drags.length === 0 ) {
                        drags = document.querySelectorAll( '.drop' );
                    }

                    angular.forEach( drags, function ( value, key ) {
                        $(value).addClass('dragging');
                    } );

                    $(this).addClass('in-drag');

                    dndApi.setData(scope.item);

                    e.dataTransfer.effectAllowed = 'move';

                    scope.$apply( function () {
                        scope.whenStart( { data: dndApi.getData() } );
                    } );

                } );

                elem[0].addEventListener( 'dragend', function ( e ) {

                    $(this).removeClass('in-drag');

                    angular.forEach( drags, function ( value, key ) {
                        $(value).removeClass('dragging');
                    } );

                    scope.$apply( function () {
                        scope.whenEnd( { data: dndApi.getData() } );
                    } );

                    dndApi.removeData();

                } );

                elem[0].draggable = true;

                elem.addClass('drag');

            }
        };
    } ).directive( 'drop', function ( dndApi ) {

        var drags = [],
            dragging = new RegExp( '(\\s|^)dragging(\\s|$)');

        return {
            scope: {
                whenDrop: '&',
                whenEnter : '&',
                whenLeave : '&'
            },
            link: function ( scope, elem, attr, ctrl ) {

                var left = elem[0].offsetLeft,
                    right = left + elem[0].offsetWidth,
                    top = elem[0].offsetTop,
                    bottom = top + elem[0].offsetHeight;

                elem[0].addEventListener( 'drop', function ( e ) {

                    if(e.stopPropagation()){
                        e.preventDefault();
                    }

                    scope.$apply( function () {
                        scope.whenDrop( { data: dndApi.getData(), elem: elem } );
                    } );

                    if ( drags.length === 0 ) {
                        drags = document.querySelectorAll( '.drop' );
                    }

                    angular.forEach( drags, function ( value, key ) {

                        $(value).removeClass('dragging');

                    } );

                    dndApi.removeData();

                } );

                // elem.bind( 'dragenter', function(e){

                //     if(elem[0] === e.currentTarget)
                //     {
                //         scope.$apply( function () {
                //             scope.whenEnter( { data: dndApi.getData() } );
                //         } );
                //     }

                // });

                elem[0].addEventListener ( 'dragleave', function(e){


                    if( (e.x < left || e.x > right) ||
                        (e.y < top  || e.y > bottom) )
                    {
                        scope.$apply( function () {
                            scope.whenLeave( { data: dndApi.getData(), elem: elem } );
                        } );
                    }
                });

                elem[0].addEventListener ( 'dragover', function ( e ) {

                    if ( e.preventDefault ) {
                        e.preventDefault();
                    }

                    return false;

                } );

                elem.addClass('drop');

            }
        };
    } ).factory('dndApi', function(){

            var dnd = {
                dragObject : {}
            };

            return {
                setData : function(data){
                    dnd.dragObject = data;
                },
                removeData : function(){
                    dnd.dragObject = null;
                },
                getData : function(){
                    return dnd.dragObject;
                }
            };
    } );

});
