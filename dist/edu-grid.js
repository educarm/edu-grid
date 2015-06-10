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
eduGridDirectives.directive('eduGrid', function () {
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
      /**
                 * Prepare fields
                 */
      for (var fieldKey in $scope.options.listFields) {
        $scope.options.listFields.sorting = '';
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
      function ($scope, $log, dataFactoryGrid, $timeout) {
        if (!$scope.hasOwnProperty('options')) {
          throw new Error('options are required!');
        }
        // ---
        // SETUP
        // ---
        $scope.options.selectionRows = [];
        $scope.options.formAvancedSearchResult = {};
        $scope.showOverlayFormSearch = false;
        $scope.options.gridControl = {};
        $scope.options.metaData.offset = 0;
        $scope.options.showOverlayLoading = false;
        $scope.currentPage = undefined;
        if (!$scope.options.hasOwnProperty('allFieldsGlobalSearch')) {
          $scope.options.allFieldsGlobalSearch = true;
        }
        if (!$scope.options.hasOwnProperty('showOverlayWhenLoading')) {
          $scope.options.showOverlayWhenLoading = true;
        }
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
        if (!$scope.options.hasOwnProperty('showSearch')) {
          $scope.options.showSearch = true;
        }
        if (!$scope.options.hasOwnProperty('showTopSearch')) {
          $scope.options.showTopSearch = true;
        }
        if (!$scope.options.hasOwnProperty('showTopAdvancedSearch')) {
          $scope.options.showTopAdvancedSearch = true;
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
        $scope.internalControl.refresh = function () {
          $scope.refresh();
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
            $scope.options.listFields[field].order = $scope.options.metaData.order;
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
            oParams.limit = $scope.options.metaData.limit;
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
            oParams.offset = $scope.options.metaData.offset;
            oParams.orderby = $scope.options.metaData.orderBy;
            oParams.order = $scope.options.metaData.order;
          }
          ;
          if ($scope.options.hasOwnProperty('fieldFk') && typeof $scope.options.fieldFk != 'undefined' && $scope.options.hasOwnProperty('valueFk') && typeof $scope.options.valueFk != 'undefined') {
            oParams['fieldFk'] = $scope.options.fieldFk;
            oParams['valueFk'] = $scope.options.valueFk;
          }
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
            $scope.formAvancedSearchEventsClean();
            //color button advanced search to blue
            $scope.listFiltered = false;
            //clean array seleccion rows
            $scope.options.selectionRows = [];
          }
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
          if (!$scope.options.hasOwnProperty('loadOnInit')) {
            $scope.refresh();
          } else if (!$scope.options.loadOnInit) {
            $scope.list = [];
            $scope.options.loadOnInit = true;
          } else {
            $scope.refresh();
          }
        }, 500);
        //Inicializa la lista de campos para que funcionen correctamente.
        $scope.updateFields = function () {
          for (var fieldKey in $scope.options.listFields) {
            $scope.options.listFields.sorting = '';
            if (typeof $scope.options.listFields[fieldKey].renderer !== 'function') {
              $scope.options.listFields[fieldKey].orderByValue = $scope.options.listFields[fieldKey].column;
              $scope.options.listFields[fieldKey].renderer = function (input, row, column, type) {
                return input;
              };
            }
          }
          if (typeof $scope.options.crudUri !== 'undefined' && $scope.options.crudUri !== '') {
            $scope.api = dataFactoryGrid($scope.options.crudUri, typeof $scope.options.actions !== 'undefined' ? $scope.options.actions : '');
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
          if (!row.selected) {
            var bExists = false;
            for (var i = 0; i < $scope.options.selectionRows.length; i++) {
              if ($scope.options.selectionRows[i] == row[$scope.options.fieldKey]) {
                bExists = true;
                break;
              }
            }
            if (!bExists) {
              $scope.options.selectionRows.push(typeFieldKey == 'text' ? row[$scope.options.fieldKey] + '' : row[$scope.options.fieldKey]);
            }
          } else {
            for (var i = 0; i < $scope.options.selectionRows.length; i++) {
              if ($scope.options.selectionRows[i] == row[$scope.options.fieldKey]) {
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
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchContinueClick == 'function') {
            $scope.options.listListeners.onFormAvancedSearchContinueClick($scope.options.formAvancedSearchResult);
          }
          //color button advanced search to red
          $scope.listFiltered = true;
        };
        // ---
        // ON CANCEL BUTTON FORM AVANCED SEARCH
        // ---	
        $scope.formAvancedSearchEventsCancel = function () {
          $scope.options.formAvancedSearchResult = {};
          $scope.showOverlayFormAvancedSearch = false;
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchCancelClick == 'function') {
            $scope.options.listListeners.onFormAvancedSearchCancelClick();
          }
        };
        // ---
        // ON CLEAN BUTTON FORM AVANCED SEARCH
        // ---	
        $scope.formAvancedSearchEventsClean = function () {
          //color button advanced search to blue
          $scope.listFiltered = false;
          $scope.options.formAvancedSearchResult = {};
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchCleanClick == 'function') {
            $scope.options.listListeners.onFormAvancedSearchCleanClick();
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
    $templateCache.put('directives/edu-grid.tpl.html', '<div><div class=box-edu-grid><div class="panel panel-{{options.metaData.panelType}}"><div class=panel-heading ng-show=showHeadingBar><div class=row><div class=col-md-1><a href="" class="btn btn-primary btn-xs" ng-show=options.showExtraButtonTopLeft ng-click=clickExtraButton()><span class="glyphicon glyphicon-plus-sign"></span> {{options.snippets.extraButtonTop || \'Nuevo\'}}</a></div><div class=col-md-3><strong>{{options.heading}}</strong></div><div class=col-md-2><span ng-show=options.showMetaData>{{options.snippets.showingItems || \'Filas\'}} {{options.metaData.offset+1}} - {{(options.metaData.offset+options.metaData.limit > options.metaData.total) ? (options.metaData.total) : (options.metaData.offset + options.metaData.limit)}} {{options.snippets.of || \'de\'}} {{options.metaData.total}}</span></div><div class=col-md-3><div ng-show="options.showSearch && options.showTopSearch"><label for=ag_search>{{options.snippets.search || \'Buscar:\'}}</label><input class=form-inline ng-model=searchQuery ng-change="onChangeSearchQuery()"></div></div><div class=col-md-2><div ng-show="options.showAvancedSearch && options.showTopAdvancedSearch"><a class="glyphicon glyphicon-search btn btn-sm" ng-class="{\'btn-primary\':!listFiltered,\'btn-danger\':listFiltered}" ng-click=onClickAvancedSearch()>{{options.snippets.avancedSearch || \' Avanzada\'}}</a></div></div><div class=col-md-1><a class="glyphicon glyphicon-refresh btn btn-xs" ng-show=options.showRefreshButton ng-click=refresh(true)></a> <a href="" class="btn btn-primary btn-xs" ng-show=options.showExtraButtonTopRight ng-click=clickExtraButton()><span class="glyphicon glyphicon-plus-sign"></span> {{options.snippets.extraButtonTop || \'Nuevo\'}}</a></div></div></div><div class=panel-body><scrollable-table watch=list><table class="table table-condensed table-hover table-striped"><thead><tr><th ng-if=options.showRowNumber></th><th ng-if=options.showButtonsGridUserPre ng-repeat="button in options.buttonsUserPre"></th><th ng-if=options.showSelectRow></th><th ng-repeat="field in options.listFields" width={{field.weight}}% title={{field.label}}><span ng-show="field.order==\'asc\'"><i class="glyphicon glyphicon-sort-by-alphabet"></i> <a ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}</a></span> <span ng-show="field.order==\'desc\'"><i class="glyphicon glyphicon-sort-by-alphabet-alt"></i> <a ng-click="changeOrder(field, field.orderByValue, \'asc\')">{{field.label}}</a></span> <span ng-hide="field.order.length>0"><a ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}</a></span></th><th ng-if=options.showButtonsGridUserPost ng-repeat="button in options.buttonsUserPost"></th></tr></thead><tbody><tr ng-show="list.length < 1"><td colspan={{options.listFields.length+options.buttons.length}}><span class="glyphicon glyphicon-info-sign"></span> <span>{{options.snippets.emptyGridText || \'No hay datos\'}}</span></td></tr><tr ng-repeat="entry in list" ng-click=onRowClick(entry)><td ng-if=options.showRowNumber><button ng-if=entry.clicked type=button class="btn btn-success btn-xs">{{options.metaData.offset+1+$index}}</button> <button ng-if=!entry.clicked type=button class="btn btn-primary btn-xs">{{options.metaData.offset+1+$index}}</button></td><td ng-if=options.showButtonsGridUserPre ng-repeat="button in options.buttonsUserPre"><div ng-if=!button.button><div ng-if="button.glyphicon.length>0"><a class="btn btn-xs" ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i></a></div><div ng-if="button.iconPath.length>0"><img ng-src=button.iconPath alt="{{button.label}}"></div></div><button ng-if=button.button ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i> <img ng-if="button.iconPath.length>0" ng-src=button.iconPath alt="{{button.label}}">{{button.label}}</button></td><td ng-if=options.showSelectRow><input type=checkbox ng-click=checkSelectRow(entry) ng-model="entry.selected"></td><td ng-repeat="field in options.listFields" ng-click=onRowClick()><div ng-if="field.type!=\'number\' && field.type!=\'date\' && field.type!=\'date-time\'  && field.type!=\'input-checkbox\' && field.type!=\'input-text\' && field.type!=\'input-date\' && field.type!=\'input-select\' && field.type!=\'input-radio\'">{{field.renderer(entry[field.column], entry, field.column,field.type)}}</div><div ng-if="field.type==\'number\'" class=pull-right>{{field.renderer(entry[field.column], entry, field.column,field.type)}}</div><div ng-if="field.type==\'date\'">{{entry[field.column] | date:\'dd-MM-yyyy\'}}</div><div ng-if="field.type==\'input-checkbox\'"><input type=checkbox ng-model=entry[field.column]></div><div ng-if="field.type==\'input-text\'"><input ng-model=entry[field.column]></div><div ng-if="field.type==\'input-date\'"><input type=date ng-model=entry[field.column]></div><div ng-if="field.type==\'input-select\'"><select><option>1</option><option>2</option></select></div></td><td ng-if=options.showButtonsGridUserPost ng-repeat="button in options.buttonsUserPost"><div ng-if=!button.button><div ng-if="button.glyphicon.length>0"><a class="btn btn-xs" ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i></a></div><div ng-if="button.iconPath.length>0"><img ng-src=button.iconPath alt="{{button.label}}"></div></div><button ng-if=button.button ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i> <img ng-if="button.iconPath.length>0" ng-src=button.iconPath alt="{{button.label}}">{{button.label}}</button></td></tr></tbody></table></scrollable-table></div><div class=panel-footer ng-show=showFooterBar><div class=row><div class=col-md-4><ul ng-show=options.showPagination class="pagination pagination col" style="margin: 0px 0px; font-weight: bold"><li ng-class="{\'disabled\':isOnFirstPage()}"><span ng-show=isOnFirstPage() class="glyphicon glyphicon-step-backward btn-xs"></span> <a ng-show=!isOnFirstPage() class="glyphicon glyphicon-step-backward btn-xs" ng-click=setFirstPage()></a></li><li ng-class="{\'disabled\':isOnFirstPage()}"><span ng-show=isOnFirstPage() class="glyphicon glyphicon-fast-backward btn-xs"></span> <a ng-show=!isOnFirstPage() class="glyphicon glyphicon-backward btn-xs" ng-click=setPreviousPage()></a></li><li data-ng-repeat="page in pages" ng-class="{\'disabled\':currentPage.label == page.label}"><a ng-show="currentPage.label != page.label" ng-click=setPage(page) class=btn-xs>{{page.label}}</a> <span ng-show="currentPage.label == page.label" class=btn-xs>{{page.label}}</span></li><li ng-class="{\'disabled\':isOnLastPage()}"><span ng-show=isOnLastPage() class="glyphicon glyphicon-fast-forward btn-xs"></span> <a ng-show=!isOnLastPage() class="glyphicon glyphicon-forward btn-xs" ng-click=setNextPage()></a></li><li ng-class="{\'disabled\':isOnLastPage()}"><span ng-show=isOnLastPage() class="glyphicon glyphicon-step-forward btn-xs"></span> <a ng-show=!isOnLastPage() class="glyphicon glyphicon-step-forward btn-xs" ng-click=setLastPage()></a></li></ul></div><div class=col-md-3><div ng-show=options.showItemsPerPage><label for=ag_itemsperpage>{{options.snippets.itemsPerPage || \'Items por p&aacute;gina:\'}}</label><input id=ag_itemsperpage class=form-inline type=number ng-model=options.metaData.limit ng-change=onChangeItemsPerPage() style="width: 50px"> <a class="glyphicon glyphicon-list-alt btn-xs"></a></div></div><div class=col-md-3 ng-show="options.showSearch && options.showBottomSearch"><div><label for=ag_search>{{options.snippets.search || \'Buscar:\'}}</label><input class=form-inline ng-model=searchQuery ng-change="onChangeSearchQuery()"></div></div><div class=col-md-2 ng-show="options.showAvancedSearch && options.showBottomAdvancedSearch"><div><a class="glyphicon glyphicon-search btn btn-primary btn-sm" ng-class="{\'btn-primary\':!listFiltered,\'btn-danger\':listFiltered}" ng-click=onClickAvancedSearch()>{{options.snippets.avancedSearch || \' Avanzada\'}}</a></div></div></div></div></div><div ng-show=options.showOverlayLoadingGrid class=overlay-edu-grid><div class="spin centrado-edu-grid"></div></div><div class=overlay-edu-grid ng-show=showOverlayFormAvancedSearch><div class="panel panel-default centrado-edu-grid" style=width:{{options.formAvancedSearch.width||500}}px><div class=panel-heading><h4>{{options.snippets.formAvancedSearchTitle || "B&uacute;squeda Avanzada"}}</h4></div><div class=panel-body><form name=formAvancedSearchFieldsFormG novalidate><h4>{{options.snippets.formAvancedSearchMessage}}</h4><div ng-repeat="field in options.formAvancedSearch.fields"><div edu-field options=field value=options.formAvancedSearchResult[field.key]></div></div><div><h5>{{options.snippets.formAvancedSearchNota}}</h5></div></form></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=formAvancedSearchEventsContinue() ng-disabled=formAvancedSearch.$invalid class="btn btn-sm btn-primary">{{options.snippets.formAvancedSearchButtonContinue || \'Aceptar\'}}</button> <button ng-click=formAvancedSearchEventsCancel() class="btn btn-sm">{{options.snippets.formAvancedSearchButtonCancel || \'Cancelar\'}}</button> <button ng-click=formAvancedSearchEventsClean() class="btn btn-sm">{{options.snippets.formAvancedSearchButtonClean || \'Limpiar\'}}</button></div></div></div></div></div><div class=overlay-edu-grid ng-show=options.showOverlayFormUser><div class="panel panel-default centrado-edu-grid" style=width:{{options.formUser.width}}><div class=panel-heading><h4>{{options.snippets.formUserTitle}}</h4></div><div class=panel-body><form name=formUser novalidate><h4>{{options.snippets.formUserMessage}}</h4><div class="form-group {{field.col}}" ng-repeat="field in options.formUser.fields"><label for={{field.key}} class=ng-binding style=align:left>{{field.label}} {{field.required ? \'*\' : \'\'}}</label><input class=form-control id={{field.key}} name={{field.key}} ng-model=options.formUser.result[field.key] placeholder={{field.placeholder}} ng-required=field.required ng-disabled=field.disabled></div><div><h5>{{options.snippets.formUserNota}}</h5></div></form></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=options.formUser.events.continue(selectedRow) ng-disabled=formUser.$invalid class="btn btn-sm btn-primary">{{options.snippets.formUserButtonContinue || \'Aceptar\'}}</button> <button ng-click=options.formUser.events.cancel() class="btn btn-sm">{{options.snippets.formUserButtonCancel || \'Cancelar\'}}</button></div></div></div></div></div><div class=overlay-edu-grid ng-show=options.overlayFormSuccessErrorGrid.show><div class="panel panel-{{options.overlayFormSuccessErrorGrid.type|| \'info\'}} centrado-edu-grid" style=min-width:{{options.overlayFormSuccessErrorGrid.width||200}}px><div class=panel-heading><span ng-if="options.overlayFormSuccessErrorGrid.type==\'success\'" class="glyphicon glyphicon-ok pull-right"></span> <span ng-if="options.overlayFormSuccessErrorGrid.type==\'danger\'" class="glyphicon glyphicon-remove pull-right"></span><br></div><div class=panel-body><h4>{{options.overlayFormSuccessErrorGrid.message}}</h4></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click="options.overlayFormSuccessErrorGrid.show=false" class="btn btn-sm btn-primary">{{options.snippets.overlayFormSuccessErrorGrid || \'Aceptar\'}}</button></div></div></div></div></div></div></div>');
  }
]);