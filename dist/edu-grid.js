// Main eduCrud Module
//Declare app level module which depends on filters, and services
var eduGridServices = angular.module('edu-grid.services', []);
var eduGridDirectives = angular.module('edu-grid.directives', []);
var eduGridFilters = angular.module('edu-grid.filters', []);
var eduGridTpl = angular.module('edu-grid.tpl', []);
// initialization of services into the main module
angular.module('eduGrid', [
  'edu-grid.services',
  'edu-grid.directives',
  'edu-grid.filters',
  'edu-grid.tpl',
  'ngResource',
  'ui.bootstrap',
  'eduField',
  'scrollable-table'
]);
eduGridServices.factory('dataFactoryGrid', [
  '$resource',
  function ($resource) {
    return function (uri, actions) {
      var defActions = {
          getAll: {
            method: 'GET',
            params: {},
            withCredentials: true,
            isArray: true
          },
          getCount: {
            method: 'GET',
            url: uri + '/count',
            params: {},
            withCredentials: true,
            isArray: false
          }
        };
      if (typeof actions !== 'undefined' && actions !== '') {
        for (keyAction in actions) {
          for (keyDefAction in defActions) {
            if (keyAction == keyDefAction) {
              defActions[keyDefAction] = actions[keyAction];
            }
          }
        }
      }
      return $resource(uri, {}, defActions);
    };
  }
]);
eduGridDirectives.filter('toEuros', function () {
  return function (input, fractionDigit) {
    var fractD = fractionDigit ? fractionDigit : 2;
    var amount = Number(input).toLocaleString('es-ES', { minimumFractionDigits: fractD }) + ' \u20ac';
    if (amount == '0,00 \u20ac' || amount == 'NaN \u20ac') {
      return;
    } else {
      return amount;
    }
  };
}).directive('mySortable', function () {
  return {
    link: function (scope, el, attrs) {
      el.sortable({
        axis: 'x',
        revert: true
      });
      //el.disableSelection();
      el.on('sortdeactivate', function (event, ui) {
        var from = angular.element(ui.item).scope().$index;
        var to = el.children().index(ui.item);
        if (to >= 0) {
          scope.$apply(function () {
            if (from >= 0) {
              scope.$emit('my-sorted', {
                from: from,
                to: to
              });
            } else {
              scope.$emit('my-created', {
                to: to,
                name: ui.item.text()
              });
              ui.item.remove();
            }
          });
        }
      });
    }
  };
}).directive('myDraggable', function () {
  return {
    link: function (scope, el, attrs) {
      el.draggable({
        axis: 'x',
        containment: 'parent'
      });  //el.disableSelection();
    }
  };
}).directive('myDroppable', function () {
  return {
    link: function (scope, el, attrs) {
      el.droppable({});
    }
  };
}).directive('myResizable', function () {
  return {
    link: function (scope, el, attrs) {
      el.resizable();
    }
  };
}).directive('eduGrid', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: false,
    scope: { options: '=' },
    templateUrl: 'directives/edu-grid.tpl.html',
    link: function ($scope, $filter) {
      if (!$scope.hasOwnProperty('options')) {
        throw new Error('options are required!');
      }
      for (var fieldKey in $scope.options.listFields) {
        //$scope.options.listFields.sorting = '';
        if (typeof $scope.options.listFields[fieldKey].renderer !== 'function') {
          $scope.options.listFields[fieldKey].orderByValue = $scope.options.listFields[fieldKey].column;
          $scope.options.listFields[fieldKey].renderer = function (input, row, column, type) {
            return input;
          };
        }
      }
    },
    controller: [
      '$scope',
      '$log',
      'dataFactoryGrid',
      '$timeout',
      '$document',
      function ($scope, $log, dataFactoryGrid, $timeout, $document) {
        if (!$scope.hasOwnProperty('options')) {
          throw new Error('options are required!');
        }
        // ---
        // SETUP
        // ---
        $scope.options.overflow_hidden = false;
        $scope.options.table_layout_fixed = false;
        //*
        // fixed first columns
        //*
        //current object edu-grid 
        var objsEduGrid = angular.element('.wrapper-table-edu-grid:last');
        //number of object edu-grid
        $scope.idGrid = angular.element('.wrapper-table-edu-grid').length;
        //set id of current object edu-grid to object position in page
        objsEduGrid.attr('id', $scope.idGrid + '-table-edu-grid');
        $timeout(function () {
          //*
          // resize columns
          //*
          var pressed = false;
          var start = undefined;
          var startX, startWidth;
          angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea thead tr th.noFixedColumn .resizable').mousedown(function (e) {
            start = $(this);
            pressed = true;
            startX = e.pageX;
            startWidth2 = $(this).width();
            startWidth = $(start).parents('.box').width();  //$(start).addClass("resizing");
          });
          angular.element(document).mousemove(function (e) {
            if (pressed) {
              console.log('mousemove:' + (e.pageX - startX));
              //barra vertical sobre la que se hace click para redimensionar
              // redimensiona el contenedor de la celda actual
              //angular.element(start).parents('.box').width(startWidth+(e.pageX-startX));
              //........................................................................................................			
              //obtiene
              var id = angular.element(start).attr('id');
              var nextId = parseInt(id) + 1 + '';
              //redimendiona la celda actual
              //angular.element(start).parents('.th-inner').width(startWidth+(e.pageX-startX));
              //			angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th#'+id).width(startWidth+(e.pageX-startX));
              //			angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th#'+id+ '.th-inner').width(startWidth+(e.pageX-startX));
              //.............................................................................................................			
              //angular.element(start).parents('DIV.col-resizable').find('.dragtarget').width(startWidth+(e.pageX-startX));//.attr('width',startWidth-(e.pageX-startX)+'px');
              console.log('startWidth2:' + startWidth2 + ' startWidth2:' + startWidth2 + ' .dragtarget width:' + (startWidth + (e.pageX - startX)));
              //cambia porcentajes por pixeles
              /*var ths=angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th')
							for(var i=0;i<ths.length;i++){
								$scope.$apply(function () {
									angular.element(ths[i]).attr('width',angular.element(ths[i]).width());
									
								})
							}*/
              for (var i = 0; i < $scope.options.listFields.length; i++) {
              }
              for (var i = 0; i < $scope.options.listFields.length; i++) {
                $scope.$apply(function () {
                });
              }
              var widthCurrentElement = angular.element('#' + $scope.idGrid + '-table-edu-grid #table-grid thead tr th#' + id).width();
              //var widthNextElement=angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th#'+nextId).width();
              //var leftNextElement=angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th#'+nextId).position().left;
              //console.log("current:"+(startWidth+(e.pageX-startX)) + " next:" + (widthNextElement-(e.pageX-startX)))
              //var a=angular.element('#' + $scope.idGrid+'-table-edu-grid TABLE.dragtarget#'+id).parents('.box').width();
              var a2 = angular.element('#' + $scope.idGrid + '-table-edu-grid TH.droptarget#' + id).attr('width');
              //var b=angular.element('#' + $scope.idGrid+'-table-edu-grid TABLE.dragtarget#'+nextId).parents('.box').width();
              var b2 = angular.element('#' + $scope.idGrid + '-table-edu-grid TH.droptarget#' + nextId).attr('width');
              var a22 = a2.replace('%', '');
              var advance = e.pageX - startX;
              var porcCurrent = parseInt(a22);
              var porcentaje = ((widthCurrentElement + advance) * porcCurrent / widthCurrentElement).toFixed(0);
              $scope.$apply(function () {
                $scope.options.listFields[id].weight = porcentaje;  //widthCurrentElement+advance;
              });
              console.log('id' + id + ' avance:' + advance + ' current a22:' + porcCurrent + '% next newPorc:' + porcentaje);  //angular.element('#' + $scope.idGrid+'-table-edu-grid TABLE.dragtarget#'+nextId).parents('.box').width(widthNextElement-(e.pageX-startX));
                                                                                                                               //angular.element('#' + $scope.idGrid+'-table-edu-grid TABLE.dragtarget#'+nextId).parents('.box').css('position','relative');
                                                                                                                               //angular.element('#' + $scope.idGrid+'-table-edu-grid TABLE.dragtarget#'+nextId).parents('.box').css('left',leftNextElement +(e.pageX-startX));
                                                                                                                               //angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th#'+id).attr('width',(startWidth+(e.pageX-startX)));//width(startWidth+(e.pageX-startX));
                                                                                                                               //angular.element('#' + $scope.idGrid+'-table-edu-grid #table-grid thead tr th#'+nextId).attr('width',(widthNextElement-(e.pageX-startX)));
            }
          });
          angular.element(document).mouseup(function () {
            if (pressed) {
              //$(start).removeClass("resizing");
              pressed = false;
            }
          });
          //*
          // fixed columns tools    
          //*
          angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea').on('scroll', function (evt) {
            var pixelsScrolledLeft = angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea')[0].scrollLeft;
            var objs1 = angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea thead tr th.preFixedColumn');
            var pos = 0;
            for (var i = 0; i < objs1.length; i++) {
              angular.element(objs1[i]).css('left', pixelsScrolledLeft + pos + 'px');
              angular.element(objs1[i]).css('position', 'relative');
              pos = pos + angular.element(objs1[i]).width();
            }
            for (var i = 1; i <= objs1.length; i++) {
              var objs2 = angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea tbody tr td.preFixedColumn:nth-child(' + i + ')');
              var pos = 0;
              for (var j = 0; j < objs2.length; j++) {
                angular.element(objs2[j]).css('left', pixelsScrolledLeft + pos + 'px');
                angular.element(objs2[j]).css('position', 'relative');
                angular.element(objs2[j]).css('background-color', '#efefef');  /*angular.element(objs2[j]).css('border-right-style', 'solid');
									angular.element(objs2[j]).css('border-right-color', '#dddddd');
									angular.element(objs2[j]).css('border-right-width', '1px');*/
              }
              pos = pos + angular.element(objs1[i]).width();
            }
          });
          //*
          // column reorder
          //*
          var origin = null;
          angular.element('.dragtarget').on('dragstart', function (event) {
            var dt = event.originalEvent.dataTransfer;
            dt.setData('Text', $(this).attr('id'));
            origin = $(this).attr('id');
          });
          angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea thead tr th.noFixedColumn').on('dragenter dragover dragend dragleave drop ', function (event) {
            event.preventDefault();
            if (event.type === 'dragover') {
              if (origin != '' && origin != null && origin != event.currentTarget.id) {
                if (event.target.className == 'box' || event.target.nodeName == 'TD' || event.target.nodeName == 'SPAN' || event.target.nodeName == 'A') {
                  angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea thead tr th#' + event.currentTarget.id + '.noFixedColumn div.th-inner').css('border', '3px dotted #dddddd');
                }
              }
            }
            if (event.type === 'dragleave') {
              if (event.target.className == 'box' || event.target.nodeName == 'TD' || event.target.nodeName == 'SPAN' || event.target.nodeName == 'A') {
                angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea thead tr th#' + event.currentTarget.id + '.noFixedColumn div.th-inner').css('border', '');
              }
            }
            if (event.type === 'drop') {
              if (event.currentTarget.className.indexOf('noFixedColumn') >= 0) {
                angular.element('#' + $scope.idGrid + '-table-edu-grid .scrollArea thead tr th#' + event.currentTarget.id + '.noFixedColumn div.th-inner').css('border', '');
                var dest = event.currentTarget.id;
                //var orig=event.originalEvent.dataTransfer.getData('Text', $(this).attr('id'));
                $scope.$apply(function () {
                  $scope.changeColumnOrder(dest * 1, origin);
                });
              }
            }
            ;
          });
        });
        $scope.changeColumnOrder = function (new_index, old_index) {
          try {
            new_index = parseInt(new_index);
            old_index = parseInt(old_index);
            if (new_index >= $scope.options.listFields.length) {
              new_index = 0;
            }
            if (new_index < 0) {
              new_index = $scope.options.listFields.length - 1;
            }
            $scope.options.listFields.splice(new_index, 0, $scope.options.listFields.splice(old_index, 1)[0]);
          } catch (e) {
            console.log('error:' + e.description);
          }
        };
        //*
        //default setup
        //*
        $scope.options.selectionRows = [];
        $scope.options.formAvancedSearchResult = {};
        $scope.showOverlayFormSearch = false;
        $scope.options.gridControl = {};
        $scope.options.metaData.offset = 0;
        $scope.options.showOverlayLoading = false;
        $scope.currentPage = undefined;
        $scope.clickReorderColumn = function () {
          $scope.options.listFields.sort(function (a, b) {
            return a.order1 - b.order1;
          });
          var a = $scope.options.listFields;
        };
        // add onClick event like onclick to buttonsUserPre
        if ($scope.options.hasOwnProperty('buttonsUserPre')) {
          for (var i = 0; i < $scope.options.buttonsUserPre.length; i++) {
            $scope.options.buttonsUserPre[i].onClick = $scope.options.buttonsUserPre[i].onclick;
          }
        }
        // add onClick event like onclick to buttonsUserPost
        if ($scope.options.hasOwnProperty('buttonsUserPost')) {
          for (var i = 0; i < $scope.options.buttonsUserPost.length; i++) {
            $scope.options.buttonsUserPost[i].onClick = $scope.options.buttonsUserPost[i].onclick;
          }
        }
        // by default mode
        if (!$scope.options.hasOwnProperty('mode')) {
          $scope.options.mode = 'normal';
        }
        // by default show button refresh
        if (!$scope.options.hasOwnProperty('showRefreshButton')) {
          $scope.options.showRefreshButton = true;
        }
        // By default the global search is performed on all fields
        if (!$scope.options.hasOwnProperty('allFieldsGlobalSearch')) {
          $scope.options.allFieldsGlobalSearch = true;
        }
        // By default shows overlay loading when component is loading
        if (!$scope.options.hasOwnProperty('showOverlayWhenLoading')) {
          $scope.options.showOverlayWhenLoading = true;
        }
        // By default not show extra button in top left
        if (!$scope.options.hasOwnProperty('showExtraButtonTopLeft')) {
          $scope.options.showExtraButtonTopLeft = false;
        }
        // By default show input search							
        if (!$scope.options.hasOwnProperty('showSearch')) {
          $scope.options.showSearch = true;
        }
        // in top
        if (!$scope.options.hasOwnProperty('showTopSearch')) {
          $scope.options.showTopSearch = true;
        }
        // By default not show input search in bottom
        if (!$scope.options.hasOwnProperty('showBottomSearch')) {
          $scope.options.showBottomSearch = false;
        }
        // By default not show button for avanced search
        if (!$scope.options.hasOwnProperty('showAvancedSearch')) {
          $scope.options.showAvancedSearch = false;
        }
        // By default not show form advanced search on header.
        if (!$scope.options.hasOwnProperty('showAdvancedSearchInHeader')) {
          $scope.options.showAdvancedSearchInHeader = false;
        }
        // By default show button advanced search on top
        if (!$scope.options.hasOwnProperty('showTopAdvancedSearch')) {
          $scope.options.showTopAdvancedSearch = true;
        }
        // By default not show button advanced search on top
        if (!$scope.options.hasOwnProperty('showBottomAdvancedSearch')) {
          $scope.options.showBottomAdvancedSearch = false;
        }
        // By default the grid load on init
        if (!$scope.options.hasOwnProperty('loadOnInit')) {
          $scope.options.loadOnInit = true;
        }
        // By default not show border cell
        if (!$scope.options.hasOwnProperty('tableBordered')) {
          $scope.options.tableBordered = false;
        }
        /*
				    
					showItemsPerPage: true,
					paginationWidth: 3,
					
					showButtonsGridUserPre:true,
					showButtonsGridUserPost:true,
					
					
					showRowNumber:true,
					showSelectRow:true,
					
					
				
			     */
        //Default show pagination
        if (!$scope.options.hasOwnProperty('showPagination')) {
          $scope.options.showPagination = true;
        } else {
          if ($scope.options.showPagination) {
            $scope.options.showItemsPerPage = true;
            $scope.options.showMetaData = true;
            $scope.options.paginationWidth = 3;
          } else {
            $scope.options.showItemsPerPage = false;
            $scope.options.showMetaData = false;
          }
        }
        $scope.currentPage = {
          offset: 0,
          label: 1
        };
        $scope.gridStyle = {};
        $scope.gridStyle.height = $scope.options.height + 'px';
        //height for plugin angular-scrollable-table
        $('.scrollableContainer').css('height', $scope.options.height + 'px');
        //extract type of fieldKey
        var typeFieldKey = '';
        for (var i = 0; i < $scope.options.listFields.length; i++) {
          if ($scope.options.listFields[i].column == $scope.options.fieldKey) {
            typeFieldKey = $scope.options.listFields[i].type;
            break;
          }
        }
        // ---
        // METHODS
        // ---
        $scope.internalControl = $scope.options.gridControl || {};
        $scope.internalControl.refresh = function (bCleanFilters) {
          $scope.refresh(bCleanFilters);
        };
        $scope.internalControl.updateFields = function () {
          $scope.updateFields();
          $scope.refresh();
        };
        $scope.internalControl.clearGrid = function () {
          $scope.list = [];
        };
        $scope.internalControl.showOverlayLoading = function (bShow) {
          $scope.options.showOverlayLoadingGrid = bShow;
        };
        $scope.internalControl.showOverlayFormUser = function (bShow) {
          $scope.options.showOverlayFormUser = bShow;
        };
        $scope.internalControl.showOverlayFormAvancedSearch = function (bShow) {
          $scope.showOverlayFormAvancedSearch = bShow;
        };
        $scope.internalControl.showOverlayFormSuccessError = function (type, text, duration) {
          $scope.options.overlayFormSuccessErrorGrid = {};
          $scope.options.overlayFormSuccessErrorGrid.show = true;
          $scope.options.overlayFormSuccessErrorGrid.type = type == '1' ? 'success' : 'danger';
          $scope.options.overlayFormSuccessErrorGrid.message = text;
          var closeForm = function () {
            $scope.options.overlayFormSuccessErrorGrid.show = false;
            $scope.$apply();
          };
          $timeout(closeForm, duration);
        };
        $scope.internalControl.showButtonsUserPre = function (bShow) {
          $scope.options.showButtonsGridUserPre = bShow;
        };
        $scope.internalControl.showButtonsUserPost = function (bShow) {
          $scope.options.showButtonsGridUserPost = bShow;
        };
        $scope.internalControl.clearSelection = function () {
          $scope.options.selectionRows = [];
          for (var i = 0; i < $scope.list.length; i++) {
            $scope.list[i].selected = false;
          }
        };
        $scope.internalControl.clearFormAvancedSearch = function () {
          $scope.formAvancedSearchEventsClean();
        };
        // ---
        // ENABLE DESING-ELEMENTS
        // ---
        $scope.showHeadingBar = $scope.options.heading || $scope.showMetaData || $scope.showRefreshButton;
        $scope.showFooterBar = $scope.options.showPagination || $scope.options.showItemsPerPage || $scope.options.showSearch;
        // ---
        // ADJUST COLUMNS ORDER
        // ---
        for (var field in $scope.options.listFields) {
          if ($scope.options.listFields[field].column.toUpperCase() == $scope.options.metaData.orderBy.toUpperCase()) {
            $scope.options.listFields[field].order = $scope.options.metaData.order.toLowerCase();
          }
        }
        ;
        // ---
        // Calculate pagination
        // ---	  
        $scope.pagination = function () {
          var paginationWidth = $scope.options.paginationWidth || 2;
          var limit = $scope.options.metaData.limit;
          var offset = $scope.options.metaData.offset;
          var total = $scope.options.metaData.total;
          $scope.pages = [];
          if (!(isNaN(limit) || isNaN(offset) || isNaN(total))) {
            var numPages = Math.ceil(total / limit);
            var startPage = Math.floor(offset / limit) - Math.floor(paginationWidth / 2);
            startPage = startPage < 0 ? 0 : startPage;
            var currentPageId = Math.floor(offset / limit);
            for (var i = startPage; i < Math.min(numPages, startPage + paginationWidth); i++) {
              var newPage = {
                  label: i + 1,
                  offset: (i + 0) * limit
                };
              if (i === currentPageId) {
                $scope.currentPage = newPage;
              }
              $scope.pages.push(newPage);
            }
          }
        };
        $scope.api = null;
        if (typeof $scope.options.crudUri !== 'undefined' && $scope.options.crudUri !== '') {
          $scope.api = dataFactoryGrid($scope.options.crudUri, typeof $scope.options.actions !== 'undefined' ? $scope.options.actions : '');
        }
        ;
        $scope.handleButtonClick = function (callback, entry) {
          $scope.selectedRow = entry;
          if (typeof callback === 'function') {
            callback(entry);
          }
        };
        $scope.onRowClick = function (clickedEntry) {
          if (typeof clickedEntry !== 'undefined') {
            for (var i = 0; i < $scope.list.length; i++) {
              if ($scope.list[i][$scope.options.fieldKey] == clickedEntry[$scope.options.fieldKey]) {
                clickedEntry.clicked = true;
              } else {
                $scope.list[i].clicked = false;
              }
            }
            if (!$scope.options.hasOwnProperty('listListeners') || typeof $scope.options.listListeners.onRowClick !== 'function')
              return;
            $scope.options.listListeners.onRowClick(clickedEntry);
          }
        };
        $scope.onPageLoadComplete = function (rows) {
          if (!$scope.options.hasOwnProperty('listListeners') || typeof $scope.options.listListeners.onPageLoadComplete !== 'function')
            return;
          $scope.options.listListeners.onPageLoadComplete($scope.list);
        };
        // ---
        // PAGINATION METHODS
        // --- 
        $scope.setPage = function (page) {
          $log.log('setPage:' + angular.toJson(page));
          $scope.options.metaData.offset = page.offset;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setFirstPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          $scope.options.metaData.offset = 0;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setPreviousPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          var currentOffset = $scope.currentPage.offset;
          $scope.options.metaData.offset = $scope.currentPage.offset - $scope.options.metaData.limit;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setNextPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          var currentOffset = $scope.currentPage.offset;
          $scope.options.metaData.offset = $scope.currentPage.offset + $scope.options.metaData.limit;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setLastPage = function () {
          $log.log('setLastPage');
          if ($scope.options.metaData === undefined)
            return;
          var numPages = Math.ceil($scope.options.metaData.total / $scope.options.metaData.limit);
          $scope.options.metaData.offset = numPages * $scope.options.metaData.limit - $scope.options.metaData.limit;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.isOnFirstPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          return $scope.options.metaData.offset == 0;
        };
        $scope.isOnLastPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          var numPages = Math.ceil($scope.options.metaData.total / $scope.options.metaData.limit);
          return $scope.options.metaData.offset == numPages * $scope.options.metaData.limit - $scope.options.metaData.limit;
        };
        // ---
        // GET DATA
        // ---	
        $scope.getData = function (oParams) {
          //var oParams={};
          if (typeof $scope.options.metaData.limit !== 'undefined' && typeof $scope.options.metaData.offset !== 'undefined') {
            /*if ($scope.options.allFieldsGlobalSearch){
							oParams.filter=(typeof $scope.searchQuery!=='undefined'?$scope.searchQuery.toUpperCase().trim():'');
						} else {
							if ($scope.options.hasOwnProperty('fieldsGlobalSearch')){
								for(field in $scope.options.fieldsGlobalSearch){															
									oParams[$scope.options.fieldsGlobalSearch[field]]=(typeof $scope.searchQuery!=='undefined'?$scope.searchQuery.toUpperCase().trim():'');
								}
							}
							else {
								throw new Error('options are required!');
							}
						}*/
            if ($scope.options.hasOwnProperty('metaData')) {
              oParams.limit = $scope.options.metaData.limit;
              oParams.offset = $scope.options.metaData.offset;
              oParams.orderby = $scope.options.metaData.orderBy;
              oParams.order = $scope.options.metaData.order;
            }
          }
          ;
          /*
					if($scope.options.hasOwnProperty("fieldFk") && typeof $scope.options.fieldFk!='undefined' && $scope.options.hasOwnProperty("valueFk") && typeof $scope.options.valueFk!='undefined'){
						oParams["fieldFk"]=$scope.options.fieldFk;
						oParams["valueFk"]=$scope.options.valueFk;
					}*/
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.transformParams == 'function') {
            oParams = $scope.options.listListeners.transformParams(oParams);
          }
          $scope.api.getAll(oParams, function (data) {
            //$scope.searchQuery="";					
            $scope.list = data;
            $scope.onPageLoadComplete($scope.list);
            for (var i = 0; i < $scope.list.length; i++) {
              var bExists = false;
              for (var j = 0; j < $scope.options.selectionRows.length; j++) {
                if ($scope.options.selectionRows[j] == $scope.list[i][$scope.options.fieldKey]) {
                  $scope.list[i].selected = true;
                  bExists = true;
                  break;
                }
              }
              if (!bExists) {
                $scope.list[i].selected = false;
              }
            }
            $scope.pagination();
            if ($scope.options.hasOwnProperty('showOverlayWhenLoading') && $scope.options.showOverlayWhenLoading) {
              $scope.options.showOverlayLoadingGrid = false;
            }
          }, function (data) {
            $scope.internalControl.showOverlayFormSuccessError('0', data.data, 20005);
          });
        };
        $scope.refresh = function (cleanFilters) {
          var oParams = {};
          /*
					 * Click on button refresh, clear filters
					 */
          if (cleanFilters) {
            //global search
            $scope.searchQuery = '';
            ;
            //advanced search
            $scope.options.formAvancedSearchResult = {};
            //color button advanced search to blue
            $scope.listFiltered = false;
            //clean array seleccion rows
            $scope.options.selectionRows = [];
          }
          // for compatibility with genericRest
          if ($scope.options.hasOwnProperty('mode') && $scope.options.mode == 'genericRest') {
            //....................................................................................................................
            var filterAS = [];
            var filterGS = [];
            var filterFK = '';
            var filter = '';
            // Advanced Search
            if ($scope.options.hasOwnProperty('formAvancedSearch') && $scope.options.formAvancedSearch.hasOwnProperty('fields') && $scope.options.formAvancedSearch.fields != undefined && typeof $scope.options.formAvancedSearchResult != undefined) {
              $scope.options.formAvancedSearch.fields.forEach(function (v, i) {
                if ($scope.options.formAvancedSearchResult.hasOwnProperty(v.key)) {
                  var valor = v.valuefilter ? v.valuefilter($scope.options.formAvancedSearchResult[v.key]) : $scope.options.formAvancedSearchResult[v.key];
                  var campo = v.keyfilter || v.key;
                  var aux;
                  if (v.operator !== 'checknull') {
                    aux = '[' + campo + ']' + v.operator + valor;
                  } else if (valor === 'S' || valor === 's') {
                    aux = '[' + campo + '] IS NULL';
                  } else if (valor === 'N' || valor === 'n') {
                    aux = '[' + campo + '] IS NOT NULL';
                  } else {
                    return;
                  }
                  filterAS.push(aux);
                }
              });
              filter = filterAS.join(' AND ');
            }  // Global Search
            else if ($scope.searchQuery != undefined && $scope.searchQuery != '') {
              if ($scope.options.hasOwnProperty('fieldsGlobalSearch') && Array.isArray($scope.options.fieldsGlobalSearch)) {
                for (var i = 0; i < $scope.options.fieldsGlobalSearch.length; i++) {
                  filterGS.push('[' + $scope.options.fieldsGlobalSearch[i] + ']=' + $scope.searchQuery);
                }
                filter = filterGS.length > 0 ? filterGS.join(' OR ') : '';
              } else {
                filter = $scope.searchQuery;
              }
            }
            // Foreign Key for master/detail
            if ($scope.options.hasOwnProperty('fieldFk') && typeof $scope.options.fieldFk != undefined && $scope.options.hasOwnProperty('valueFk') && typeof $scope.options.valueFk != undefined) {
              filterFK = '[' + $scope.options.fieldFk + ']=' + $scope.options.valueFk;
              filter = filter != '' ? filterFK + ' AND ' + filter : filterFK;
            }
            oParams.filter = filter;  //.....................................................................................................................................
          } else {
            if ($scope.options.allFieldsGlobalSearch) {
              oParams.filter = typeof $scope.searchQuery !== 'undefined' ? $scope.searchQuery.toUpperCase().trim() : '';
            } else {
              if ($scope.options.hasOwnProperty('fieldsGlobalSearch')) {
                for (field in $scope.options.fieldsGlobalSearch) {
                  oParams[$scope.options.fieldsGlobalSearch[field]] = typeof $scope.searchQuery !== 'undefined' ? $scope.searchQuery.toUpperCase().trim() : '';
                }
              } else {
                throw new Error('options are required!');
              }
            }
            if ($scope.options.hasOwnProperty('fieldFk') && typeof $scope.options.fieldFk != 'undefined' && $scope.options.hasOwnProperty('valueFk') && typeof $scope.options.valueFk != 'undefined') {
              oParams['fieldFk'] = $scope.options.fieldFk;
              oParams['valueFk'] = $scope.options.valueFk;
            }
            if ($scope.options.hasOwnProperty('formAvancedSearch') && typeof $scope.options.formAvancedSearchResult != 'undefined') {
              for (var key in $scope.options.formAvancedSearchResult) {
                oParams[key] = $scope.options.formAvancedSearchResult[key];
              }
            }
          }
          if ($scope.options.hasOwnProperty('showOverlayWhenLoading') && $scope.options.showOverlayWhenLoading) {
            $scope.options.showOverlayLoadingGrid = true;
          }
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.transformParams == 'function') {
            oParams = $scope.options.listListeners.transformParams(oParams);
          }
          if ($scope.options.showPagination == true) {
            $scope.api.getCount(oParams, function (data) {
              $scope.options.metaData.total = data.count;
              $scope.getData(oParams);
            }, function (data) {
              $scope.internalControl.showOverlayFormSuccessError('0', data.data, 20000);
            });
          } else {
            $scope.options.metaData.total = 0;
            $scope.getData(oParams);
          }
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onButtonRefreshClick == 'function') {
            $scope.options.listListeners.onButtonRefreshClick($scope.list);
          }
        };
        setTimeout(function () {
          // Assigns value to the specified advanced search fields in property filteOnInit
          if ($scope.options.hasOwnProperty('filterOnInit') && typeof $scope.options.filterOnInit != undefined) {
            for (var key in $scope.options.filterOnInit) {
              $scope.options.formAvancedSearchResult[key] = $scope.options.filterOnInit[key];
            }
          }
          // If loadOnInit, loads the grid
          if ($scope.options.hasOwnProperty('loadOnInit') && typeof $scope.options.loadOnInit != undefined && $scope.options.loadOnInit === true) {
            $scope.refresh();
          } else {
            $scope.list = [];
            $scope.options.loadOnInit = true;
          }
        }, 500);
        //Inicializa la lista de campos para que funcionen correctamente.
        $scope.updateFields = function () {
          for (var fieldKey in $scope.options.listFields) {
            //$scope.options.listFields.sorting = '';
            if (typeof $scope.options.listFields[fieldKey].renderer !== 'function') {
              $scope.options.listFields[fieldKey].orderByValue = $scope.options.listFields[fieldKey].column;
              $scope.options.listFields[fieldKey].renderer = function (input, row, column, type) {
                return input;
              };
            }
          }
          if (typeof $scope.options.crudUri !== undefined && $scope.options.crudUri !== '') {
            $scope.api = dataFactoryGrid($scope.options.crudUri, typeof $scope.options.actions !== undefined ? $scope.options.actions : '');
          }
        };
        // ON CLICK EXTRA BUTTON
        $scope.clickExtraButton = function (value) {
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onExtraButtonClick == 'function') {
            $scope.options.listListeners.onExtraButtonClick();
          }
        };
        // ON CLICK SELECT ALL ROWS CHECKBOX
        $scope.changeSelectAllRows = function (value) {
          if (value) {
            for (var i = 0; i < $scope.list.length; i++) {
              $scope.list[i].selected = true;
            }
          } else {
            for (var i = 0; i < $scope.list.length; i++) {
              $scope.list[i].selected = false;
            }
          }
        };
        // ON CLICK SELECT ROWS CHECKBOX
        $scope.checkSelectRow = function (row) {
          if (row.selected) {
            var bExists = false;
            for (var i = 0; i < $scope.options.selectionRows.length; i++) {
              if ($scope.options.selectionRows[i][$scope.options.fieldKey] == row[$scope.options.fieldKey]) {
                bExists = true;
                break;
              }
            }
            if (!bExists) {
              //$scope.options.selectionRows.push((typeFieldKey=='text')?row[$scope.options.fieldKey]+"":row[$scope.options.fieldKey]);
              $scope.options.selectionRows.push(row);
            }
          } else {
            for (var i = 0; i < $scope.options.selectionRows.length; i++) {
              if ($scope.options.selectionRows[i][$scope.options.fieldKey] == row[$scope.options.fieldKey]) {
                $scope.options.selectionRows.splice(i, 1);
                break;
              }
            }
          }
        };
        // ON ORDER CHANGE
        $scope.changeOrder = function (field, orderBy, order) {
          $scope.options.metaData.orderBy = orderBy;
          $scope.options.metaData.order = order.toUpperCase();
          $scope.refresh();
          for (var fieldKey in $scope.options.listFields) {
            if ($scope.options.listFields[fieldKey] === field)
              continue;
            $scope.options.listFields[fieldKey].order = '';
          }
          field.order = order;
        };
        // ON CHANGE ITEMS PER PAGE
        var timerOnChangeItemsPerPage = null;
        $scope.onChangeItemsPerPage = function () {
          clearInterval(timerOnChangeItemsPerPage);
          timerOnChangeItemsPerPage = setInterval(function () {
            $scope.refresh();
            clearInterval(timerOnChangeItemsPerPage);
          }, 750);
          $scope.options.metaData.offset = 0;
        };
        // ---
        // ON BUTTON CONTINUE FORM USER
        // ---	
        $scope.formUserOnContinue = function (data) {
          // for Backwards compatibility  options.formUser.events.continue
          if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('events') && typeof $scope.options.formUser.formUser.continue == 'function') {
            $scope.options.formUser.events.continue(data);
          }
          if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('listeners') && typeof $scope.options.formUser.listeners.onContinue == 'function') {
            $scope.options.formUser.listeners.onContinue(data);
          }
        };
        // ---
        // ON BUTTON CANCEL FORM USER
        // ---	
        $scope.formUserOnCancel = function () {
          // for Backwards compatibility  options.formUser.events.continue
          if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('events') && typeof $scope.options.formUser.formUser.cancel == 'function') {
            $scope.options.formUser.events.cancel(data);
          }
          if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('listeners') && typeof $scope.options.formUser.listeners.onCancel == 'function') {
            $scope.options.formUser.listeners.onCancel(data);
          }
        };
        // ---
        // ON SEARCH
        // ---	
        var timerOnChangeSearchQuery = null;
        $scope.onChangeSearchQuery = function () {
          clearInterval(timerOnChangeSearchQuery);
          timerOnChangeSearchQuery = setInterval(function () {
            $scope.refresh();
            $scope.setFirstPage();
            clearInterval(timerOnChangeSearchQuery);
            ;
          }, 750);
        };
        // ---
        // ON AVANCEDSEARCH
        // ---	
        $scope.onClickAvancedSearch = function () {
          $scope.showOverlayFormAvancedSearch = true;
        };
        // ---
        // ON CONTINUE BUTTON FORM AVANCED SEARCH
        // ---	
        $scope.formAvancedSearchEventsContinue = function () {
          $scope.refresh();
          $scope.showOverlayFormAvancedSearch = false;
          // for Backwards compatibility
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchContinueClick == 'function') {
            $scope.options.listListeners.onFormAvancedSearchContinueClick($scope.options.formAvancedSearchResult);
          }
          if ($scope.options.hasOwnProperty('formAvancedSearch') && $scope.options.formAvancedSearch.hasOwnProperty('listeners') && typeof $scope.options.formAvancedSearch.listeners.onContinue == 'function') {
            $scope.options.formAvancedSearch.listeners.onContinue($scope.options.formAvancedSearchResult);
          }
          //color button advanced search to red
          $scope.listFiltered = true;
        };
        // ---
        // ON CANCEL BUTTON FORM AVANCED SEARCH
        // ---	
        $scope.formAvancedSearchEventsCancel = function () {
          $scope.showOverlayFormAvancedSearch = false;
          // for Backwards compatibility
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchCancelClick == 'function') {
            $scope.options.listListeners.onFormAvancedSearchCancelClick();
          }
          if ($scope.options.hasOwnProperty('formAvancedSearch') && $scope.options.formAvancedSearch.hasOwnProperty('listeners') && typeof $scope.options.formAvancedSearch.listeners.onCancel == 'function') {
            $scope.options.formAvancedSearch.listeners.onCancel($scope.options.formAvancedSearchResult);
          }
        };
        // ---
        // ON CLEAN BUTTON FORM AVANCED SEARCH
        // ---	
        $scope.formAvancedSearchEventsClean = function () {
          //cleaning filter and refresh grid
          $scope.refresh(true);
          // for Backwards compatibility
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchCleanClick == 'function') {
            $scope.options.listListeners.onFormAvancedSearchCleanClick();
          }
          if ($scope.options.hasOwnProperty('formAvancedSearch') && typeof $scope.options.formAvancedSearch.onClean == 'function') {
            $scope.options.formAvancedSearch.onClean($scope.options.formAvancedSearchResult);
          }
        };
      }
    ]
  };
});
angular.module('edu-grid.tpl').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('directives/edu-grid.tpl.html', '<div><style>.nowrap_overflow_hidden_ellipsis{\r' + '\n' + '\t\twhite-space: nowrap;\r' + '\n' + '        overflow: hidden;\r' + '\n' + '\t\ttext-overflow: ellipsis;\r' + '\n' + '\t}\r' + '\n' + '\t\r' + '\n' + '\t.table_layout_fixed{\r' + '\n' + '\t\ttable-layout:fixed;\r' + '\n' + '\t}\r' + '\n' + '\t\r' + '\n' + '\t.table_layout_auto{\r' + '\n' + '\t\ttable-layout:auto;\r' + '\n' + '\t}\r' + '\n' + '\t.wrapper-table-edu-grid .glyphicon.glyphicon-triangle-bottom {\r' + '\n' + '\t\tfont-size: 8px;\r' + '\n' + '    }\r' + '\n' + '\t.wrapper-table-edu-grid .glyphicon.glyphicon-triangle-top {\r' + '\n' + '\t\tfont-size: 8px;\r' + '\n' + '    }\r' + '\n' + '\t\r' + '\n' + '\t.wrapper-table-edu-grid .glyphicon.glyphicon-chevron-left {\r' + '\n' + '\t\tfont-size: 8px;\r' + '\n' + '    }\r' + '\n' + '\t.wrapper-table-edu-grid .glyphicon.glyphicon-chevron-right {\r' + '\n' + '\t\tfont-size: 8px;\r' + '\n' + '    }\r' + '\n' + '\t.wrapper-table-edu-grid .glyphicon.glyphicon-sort-by-alphabet {\r' + '\n' + '\t\tfont-size: 12px;\r' + '\n' + '    }\r' + '\n' + '\t.wrapper-table-edu-grid .glyphicon.glyphicon-sort-by-alphabet-alt {\r' + '\n' + '\t\tfont-size: 12px;\r' + '\n' + '    }\r' + '\n' + '\t\r' + '\n' + '\t.scrollArea table th .box {\r' + '\n' + '\t\tpadding: 0 0px;\r' + '\n' + '\t\tpadding-right: 0px;\r' + '\n' + '\t\tborder-left: 1px solid #ddd;\r' + '\n' + '\t\t\r' + '\n' + '    }</style><div class=box-edu-grid><div class="panel panel-{{options.metaData.panelType}}"><div class=panel-heading ng-show=showHeadingBar><div class=row><div class=col-md-1><a href="" class="btn btn-primary btn-xs" ng-show=options.showExtraButtonTopLeft ng-click=clickExtraButton()><span class="glyphicon glyphicon-{{options.iconExtraButtonTopLeft || \'plus-sign\'}}"></span> {{options.snippets.extraButtonTop || \'Nuevo\'}}</a></div><div class=col-md-3><strong>{{options.heading}}</strong></div><div class=col-md-2><span ng-show=options.showMetaData>{{options.snippets.showingItems || \'Filas\'}} {{options.metaData.offset+1}} - {{(options.metaData.offset+options.metaData.limit > options.metaData.total) ? (options.metaData.total) : (options.metaData.offset + options.metaData.limit)}} {{options.snippets.of || \'de\'}} {{options.metaData.total}}</span></div><div class=col-md-3><div ng-show="options.showSearch && options.showTopSearch"><label for=ag_search>{{options.snippets.search || \'Buscar:\'}}</label><input class=form-inline ng-model=searchQuery ng-change="onChangeSearchQuery()"></div></div><div class=col-md-2><div ng-show="options.showAvancedSearch && options.showTopAdvancedSearch && !options.showAdvancedSearchInHeader"><a class="btn btn-sm" ng-class="{\'btn-primary\':!listFiltered,\'btn-danger\':listFiltered}" ng-click=onClickAvancedSearch()><i class="glyphicon glyphicon-search"></i> {{options.snippets.avancedSearch || \' Avanzada\'}}</a></div></div><div class=col-md-1><span class="btn btn-xs" ng-show=options.showRefreshButton ng-click=refresh(true)><i class="glyphicon glyphicon-refresh"></i></span> <a href="" class="btn btn-primary btn-xs" ng-show=options.showExtraButtonTopRight ng-click=clickExtraButton()><span class="glyphicon glyphicon-plus-sign"></span> {{options.snippets.extraButtonTop || \'Nuevo\'}}</a></div></div><div ng-if=options.showAdvancedSearchInHeader class=row><fieldset class=avancedSearch><legend class=avancedSearch><i class="fa fa-search"></i></legend><div class=control-group><div ng-repeat="field in options.formAvancedSearch.fields"><div edu-field options=field value=options.formAvancedSearchResult[field.key]></div></div></div></fieldset></div><div ng-if=options.showAdvancedSearchInHeader class=row><div class="col-md-offset-9 col-md-3"><button ng-click=formAvancedSearchEventsContinue() ng-disabled=formAvancedSearch.$invalid class="btn btn-sm btn-primary">{{options.snippets.formAvancedSearchButtonContinue || \'Buscar\'}}</button> <button ng-click=formAvancedSearchEventsClean() class="btn btn-sm">{{options.snippets.formAvancedSearchButtonClean || \'Limpiar\'}}</button></div></div></div><div class=panel-body><div style=overflow-x:scroll id={{idGrid}}-table-edu-grid class=wrapper-table-edu-grid><scrollable-table watch=list><table id=table-grid class="table table-condensed table-hover table-striped" ng-class="{\'table-bordered\':options.tableBordered,\'table_layout_fixed\':options.table_layout_fixed, \'table_layout_auto\':!options.table_layout_fixed}"><thead><tr><th ng-if=options.showRowNumber width=5 title=&nbsp class=preFixedColumn></th><th ng-if=options.showButtonsGridUserPre ng-repeat="button in options.buttonsUserPre" width=5 title=&nbsp class=preFixedColumn></th><th ng-if=options.showSelectRow width=5 title=&nbsp class=preFixedColumn></th><th ng-repeat="field in options.listFields" class="noFixedColumn droptarget" width={{field.weight}}% title=&nbsp style="text-align: center" id={{$index}}><div class=col-resizable><table width=100%><tr><td><table width=100% border=0 class=dragtarget id={{$index}} draggable=true><tr><td width=13px><span class=header-column title="Mover columna a la izquierda"><a ng-click="changeColumnOrder($index-1, $index)"><i class="glyphicon glyphicon-chevron-left"></i></a></span></td><td ng-if="field.notOrder==true"><span class=header-column><a>&nbsp{{field.label}}</a></span></td><td ng-if=!field.notOrder style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis"><span ng-click="changeOrder(field, field.orderByValue, \'desc\')" ng-show="field.order==\'asc\'" class=header-column title="Ordenar por {{field.label}}"><i class="glyphicon glyphicon-sort-by-alphabet"></i> <a>&nbsp{{field.label}}</a></span> <span ng-click="changeOrder(field, field.orderByValue, \'asc\')" ng-show="field.order==\'desc\'" class=header-column title="Ordenar por {{field.label}}"><i class="glyphicon glyphicon-sort-by-alphabet-alt"></i> <a>&nbsp{{field.label}}</a></span> <span ng-click="changeOrder(field, field.orderByValue, \'desc\')" ng-hide="field.order.length>0" class=header-column title="Ordenar por {{field.label}}"><a>&nbsp{{field.label}}</a></span></td><td width=15px><span class=header-column title="Mover columna a la derecha"><a ng-click="changeColumnOrder($index+1, $index)"><i class="glyphicon glyphicon-chevron-right"></i></a></span></td></tr></table></td><td width=0px><table><tr><td class=resizable id={{$index}} style="height:30px;border: 0px solid #ddd;cursor: col-resize;background-color:#ddd"></td></tr></table></td></tr></table></div></th><th ng-if=options.showButtonsGridUserPost ng-repeat="button in options.buttonsUserPost" width=5></th></tr></thead><tbody><tr ng-show="list.length < 1"><td colspan={{options.listFields.length+options.buttons.length}}><span class="glyphicon glyphicon-info-sign"></span> <span>{{options.snippets.emptyGridText || \'No hay datos\'}}</span></td></tr><tr ng-repeat="entry in list" ng-click=onRowClick(entry)><td ng-if=options.showRowNumber class=preFixedColumn><button ng-show=entry.clicked type=button class="btn btn-success btn-xs">{{options.metaData.offset+1+$index}}</button> <button ng-show=!entry.clicked type=button class="btn btn-primary btn-xs">{{options.metaData.offset+1+$index}}</button></td><td ng-if=options.showButtonsGridUserPre ng-repeat="button in options.buttonsUserPre" class=preFixedColumn><div ng-if=!button.button><div ng-if="button.glyphicon.length>0"><a class="btn btn-xs" ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i></a></div><div ng-if="button.iconPath.length>0"><img ng-src=button.iconPath alt="{{button.label}}"></div></div><button ng-if=button.button ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i> <img ng-if="button.iconPath.length>0" ng-src=button.iconPath alt="{{button.label}}">{{button.label}}</button></td><td ng-if=options.showSelectRow class=preFixedColumn><input type=checkbox ng-click=checkSelectRow(entry) ng-model="entry.selected"></td><td ng-repeat="field in options.listFields" ng-click=onRowClick() ng-class="{\'nowrap_overflow_hidden_ellipsis\':options.overflow_hidden}"><div ng-if="field.type!=\'currency\' && field.type!=\'number\' && field.type!=\'date\' && field.type!=\'date-time\'  && field.type!=\'checkbox\' && field.type!=\'input-text\' && field.type!=\'input-date\' && field.type!=\'input-select\' && field.type!=\'input-radio\'">{{field.renderer(entry[field.column], entry, field.column,field.type)}}</div><div ng-if="field.type==\'number\'" class=pull-right>{{field.renderer(entry[field.column], entry, field.column,field.type)}}</div><div ng-if="field.type==\'date\'">{{entry[field.column] | date:field.format ||\'dd/MM/yyyy\'}}</div><div ng-if="field.type==\'currency\'">{{entry[field.column] | toEuros}}</div><div ng-if="field.type==\'checkbox\'"><input type=checkbox ng-model=entry[field.column] ng-false-value="\'N\'" ng-true-value="\'S\'" onclick="return false"></div><div ng-if="field.type==\'input-text\'"><input ng-model=entry[field.column]></div><div ng-if="field.type==\'input-date\'"><input type=date ng-model=entry[field.column]></div><div ng-if="field.type==\'input-select\'"><select><option>1</option><option>2</option></select></div></td><td ng-if=options.showButtonsGridUserPost ng-repeat="button in options.buttonsUserPost"><div ng-if=!button.button><div ng-if="button.glyphicon.length>0"><a class="btn btn-xs" ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i></a></div><div ng-if="button.iconPath.length>0"><img ng-src=button.iconPath alt="{{button.label}}"></div></div><button ng-if=button.button ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i> <img ng-if="button.iconPath.length>0" ng-src=button.iconPath alt="{{button.label}}">{{button.label}}</button></td></tr></tbody></table></scrollable-table></div></div><div class=panel-footer ng-show=showFooterBar><div class=row><div class=col-md-4><ul ng-show=options.showPagination class="pagination pagination col" style="margin: 0px 0px; font-weight: bold"><li ng-class="{\'disabled\':isOnFirstPage()}"><a ng-show=isOnFirstPage() class="glyphicon glyphicon-step-backward btn-xs"></a> <a ng-show=!isOnFirstPage() class="glyphicon glyphicon-step-backward btn-xs" ng-click=setFirstPage()></a></li><li ng-class="{\'disabled\':isOnFirstPage()}"><a ng-show=isOnFirstPage() class="glyphicon glyphicon-fast-backward btn-xs"></a> <a ng-show=!isOnFirstPage() class="glyphicon glyphicon-backward btn-xs" ng-click=setPreviousPage()></a></li><li data-ng-repeat="page in pages" ng-class="{\'disabled\':currentPage.label == page.label}"><a ng-show="currentPage.label != page.label" ng-click=setPage(page) class=btn-xs>{{page.label}}</a> <a ng-show="currentPage.label == page.label" class=btn-xs>{{page.label}}</a></li><li ng-class="{\'disabled\':isOnLastPage()}"><a ng-show=isOnLastPage() class="glyphicon glyphicon-fast-forward btn-xs"></a> <a ng-show=!isOnLastPage() class="glyphicon glyphicon-forward btn-xs" ng-click=setNextPage()></a></li><li ng-class="{\'disabled\':isOnLastPage()}"><a ng-show=isOnLastPage() class="glyphicon glyphicon-step-forward btn-xs"></a> <a ng-show=!isOnLastPage() class="glyphicon glyphicon-step-forward btn-xs" ng-click=setLastPage()></a></li></ul></div><div class=col-md-3><div ng-show=options.showItemsPerPage><label for=ag_itemsperpage>{{options.snippets.itemsPerPage || \'Items por p&aacute;gina:\'}}</label><input id=ag_itemsperpage class=form-inline type=number ng-model=options.metaData.limit ng-change=onChangeItemsPerPage() style="width: 50px"> <a class="glyphicon glyphicon-list-alt btn-xs"></a></div></div><div class=col-md-3 ng-show="options.showSearch && options.showBottomSearch"><div><label for=ag_search>{{options.snippets.search || \'Buscar:\'}}</label><input class=form-inline ng-model=searchQuery ng-change="onChangeSearchQuery()"></div></div><div class=col-md-2 ng-show="options.showAvancedSearch && options.showBottomAdvancedSearch && !options.showAdvancedSearchInHeader"><div><a class="glyphicon glyphicon-search btn btn-primary btn-sm" ng-class="{\'btn-primary\':!listFiltered,\'btn-danger\':listFiltered}" ng-click=onClickAvancedSearch()>{{options.snippets.avancedSearch || \' Avanzada\'}}</a></div></div></div></div></div><div ng-show=options.showOverlayLoadingGrid class=overlay-edu-grid><div class="spin centrado-edu-grid"></div></div><div class=overlay-edu-grid ng-if=showOverlayFormAvancedSearch><div class="panel panel-default centrado-edu-grid" style=width:{{options.formAvancedSearch.width||500}}px><div class=panel-heading><h4>{{options.snippets.formAvancedSearchTitle || "B&uacute;squeda Avanzada"}}</h4></div><div class=panel-body><form name=formAvancedSearchFieldsFormG novalidate><h4>{{options.snippets.formAvancedSearchMessage}}</h4><div ng-repeat="field in options.formAvancedSearch.fields"><div edu-field options=field value=options.formAvancedSearchResult[field.key]></div></div><div><h5>{{options.snippets.formAvancedSearchNota}}</h5></div></form></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=formAvancedSearchEventsContinue() ng-disabled=formAvancedSearch.$invalid class="btn btn-sm btn-primary">{{options.snippets.formAvancedSearchButtonContinue || \'Aceptar\'}}</button> <button ng-click=formAvancedSearchEventsCancel() class="btn btn-sm">{{options.snippets.formAvancedSearchButtonCancel || \'Cancelar\'}}</button> <button ng-click=formAvancedSearchEventsClean() class="btn btn-sm">{{options.snippets.formAvancedSearchButtonClean || \'Limpiar\'}}</button></div></div></div></div></div><div class=overlay-edu-grid ng-show=options.showOverlayFormUser><div class="panel panel-default centrado-edu-grid" style=width:{{options.formUser.width}}><div class=panel-heading><h4>{{options.snippets.formUserTitle}}</h4></div><div class=panel-body><form name=formUser novalidate><h4>{{options.snippets.formUserMessage}}</h4><div class="form-group {{field.col}}" ng-repeat="field in options.formUser.fields"><label for={{field.key}} class=ng-binding style=align:left>{{field.label}} {{field.required ? \'*\' : \'\'}}</label><input class=form-control id={{field.key}} name={{field.key}} ng-model=options.formUser.result[field.key] placeholder={{field.placeholder}} ng-required=field.required ng-disabled=field.disabled></div><div><h5>{{options.snippets.formUserNota}}</h5></div></form></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=formUserOnContinue(options.formUser.result) ng-disabled=formUser.$invalid class="btn btn-sm btn-primary">{{options.snippets.formUserButtonContinue || \'Aceptar\'}}</button> <button ng-click=formUserOnCancel() class="btn btn-sm">{{options.snippets.formUserButtonCancel || \'Cancelar\'}}</button></div></div></div></div></div><div class=overlay-edu-grid ng-show=options.overlayFormSuccessErrorGrid.show><div class="panel panel-{{options.overlayFormSuccessErrorGrid.type|| \'info\'}} centrado-edu-grid" style=min-width:{{options.overlayFormSuccessErrorGrid.width||200}}px><div class=panel-heading><span ng-if="options.overlayFormSuccessErrorGrid.type==\'success\'" class="glyphicon glyphicon-ok pull-right"></span> <span ng-if="options.overlayFormSuccessErrorGrid.type==\'danger\'" class="glyphicon glyphicon-remove pull-right"></span><br></div><div class=panel-body><h4>{{options.overlayFormSuccessErrorGrid.message}}</h4></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click="options.overlayFormSuccessErrorGrid.show=false" class="btn btn-sm btn-primary">{{options.snippets.overlayFormSuccessErrorGrid || \'Aceptar\'}}</button></div></div></div></div></div></div></div>');
  }
]);