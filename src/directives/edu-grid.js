
 eduGridDirectives
 .filter('toEuros', function() {
  return function(input,fractionDigit) {
	var fractD=fractionDigit?fractionDigit:2;
	var amount= Number(input).toLocaleString("es-ES", {minimumFractionDigits: fractD}) + ' €';
	if(amount=='0,00 €' || amount=='NaN €' || amount=='NaN'){
		return; 
	}else{
		return amount;
	}  
	
  };
})
.directive('mySortable',function(){
  return {
    link:function(scope,el,attrs){
      el.sortable({
		axis:'x',
		
        revert: true
      });
      //el.disableSelection();
      
      el.on( "sortdeactivate", function( event, ui ) { 
        var from = angular.element(ui.item).scope().$index;
        var to = el.children().index(ui.item);
        if(to>=0){
          scope.$apply(function(){
            if(from>=0){
              scope.$emit('my-sorted', {from:from,to:to});
            }else{
              scope.$emit('my-created', {to:to, name:ui.item.text()});
              ui.item.remove();
            }
          })
        }
      } );
	  
    }
  }
})
.directive('myDraggable',function(){
  
  return {
    link:function(scope,el,attrs){
      el.draggable({
			
			axis:'x',
			containment: "parent"
		});
    //el.disableSelection();
    }
  }
  
})
.directive('myDroppable',function(){
  
  return {
    link:function(scope,el,attrs){
      el.droppable({});
    }
  }
  
})

.directive('myResizable',function(){
  
  return {
    link:function(scope,el,attrs){
      el.resizable();
    }
  }
  
})

 .directive('eduGrid', function () {
        return {
            restrict: "A",
            replace: true,
            transclude: false,
            scope: {
                options: '='
            },
            templateUrl:'directives/edu-grid.tpl.html',
            link: function ($scope,$filter) {
			
				if (!$scope.hasOwnProperty('options')) {
                    throw new Error('options are required!');
                }
			
                for (var fieldKey in $scope.options.listFields) {
                    //$scope.options.listFields.sorting = '';

                    if (typeof $scope.options.listFields[fieldKey].renderer !== 'function') {
                        $scope.options.listFields[fieldKey].orderByValue = $scope.options.listFields[fieldKey].column;
                        $scope.options.listFields[fieldKey].renderer = function (input, row, column,type) {
							return input;
                        };
                    }
                }
				
				
				
		        
            },
			
            // ------------------------------------------------------------------------------------------- //
            //    CONTROLLER
            // ------------------------------------------------------------------------------------------- //
            controller: function ($scope,$log,dataFactoryGrid,$timeout,$document) {
				if (!$scope.hasOwnProperty('options')) {
                    throw new Error('options are required!');
                }
				
			  // ---
			  // SETUP
			  // ---
				$scope.options.overflow_hidden=false;
				$scope.options.table_layout_fixed=false
				
				
				
				//set id of current object edu-grid to object position in page
				if($scope.options.metaData && !$scope.options.metaData.id){
					$scope.options.metaData.id='grid'+ Math.floor((Math.random() * 100000) + 1);	
				}
				
				
				
				$timeout(function() {
					//height for plugin angular-scrollable-table
					$("#"+$scope.options.metaData.id+" .scrollableContainer").css("height",$scope.options.height+'px');
					
						
					//*
					// resize columns
					//*
					var pressed = false;
					var start = undefined;
					var startX, startWidth;
					
					angular.element('#' + $scope.options.metaData.id+'  .scrollArea thead tr th.noFixedColumn .resizable').mousedown(function(e) {
						
						start = $(this);
						pressed = true;
						startX = e.pageX;
						startWidth2 = $(this).width();
						startWidth =$(start).parents('.box').width();
						//$(start).addClass("resizing");
					});
					
					angular.element(document).mousemove(function(e) {
						
						if(pressed) {
							
							console.log('mousemove:'+(e.pageX-startX));
							//barra vertical sobre la que se hace click para redimensionar
							
							// redimensiona el contenedor de la celda actual
							//angular.element(start).parents('.box').width(startWidth+(e.pageX-startX));
							
							
							
				//........................................................................................................			
							//obtiene
							var id=angular.element(start).attr('id');
							var nextId= parseInt(id)+1+'';
							
							//redimendiona la celda actual
							//angular.element(start).parents('.th-inner').width(startWidth+(e.pageX-startX));
				//			angular.element('#' + $scope.options.metaData.id+' #table-grid thead tr th#'+id).width(startWidth+(e.pageX-startX));
				//			angular.element('#' + $scope.options.metaData.id+' #table-grid thead tr th#'+id+ '.th-inner').width(startWidth+(e.pageX-startX));
							
							
				//.............................................................................................................			
							
							//angular.element(start).parents('DIV.col-resizable').find('.dragtarget').width(startWidth+(e.pageX-startX));//.attr('width',startWidth-(e.pageX-startX)+'px');
							console.log("startWidth2:"+startWidth2+" startWidth2:"+startWidth2+ " .dragtarget width:"+(startWidth+(e.pageX-startX)))
							
							
							
							//cambia porcentajes por pixeles
							/*var ths=angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th')
							for(var i=0;i<ths.length;i++){
								$scope.$apply(function () {
									angular.element(ths[i]).attr('width',angular.element(ths[i]).width());
									
								})
							}*/
							
							
							
							for(var i=0;i<$scope.options.listFields.length;i++){
								//$scope.options.listFields[i].width=angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th#'+i).width();
							}
							
							for(var i=0;i<$scope.options.listFields.length;i++){
								$scope.$apply(function () {
									//$scope.options.listFields[i].weight=$scope.options.listFields[i].width;
								})
							}
							
							
							var widthCurrentElement=angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th#'+id).width();
							//var widthNextElement=angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th#'+nextId).width();
							//var leftNextElement=angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th#'+nextId).position().left;
							
							//console.log("current:"+(startWidth+(e.pageX-startX)) + " next:" + (widthNextElement-(e.pageX-startX)))
							
							//var a=angular.element('#' + $scope.options.metaData.id+'  TABLE.dragtarget#'+id).parents('.box').width();
							var a2=angular.element('#' + $scope.options.metaData.id+'  TH.droptarget#'+id).attr('width');
							
							
							//var b=angular.element('#' + $scope.options.metaData.id+'  TABLE.dragtarget#'+nextId).parents('.box').width();
							var b2=angular.element('#' + $scope.options.metaData.id+'  TH.droptarget#'+nextId).attr('width');
							var a22=a2.replace('%','');
							
							var advance=(e.pageX-startX);
							var porcCurrent=parseInt(a22);
							var porcentaje=( (widthCurrentElement+advance) * porcCurrent / widthCurrentElement).toFixed(0);
							
							
							
							
							$scope.$apply(function () {
										$scope.options.listFields[id].weight=porcentaje;//widthCurrentElement+advance;
							})
							console.log("id" +id+" avance:" + advance+" current a22:"+porcCurrent + "% next newPorc:" + porcentaje);
							//angular.element('#' + $scope.options.metaData.id+'  TABLE.dragtarget#'+nextId).parents('.box').width(widthNextElement-(e.pageX-startX));
							//angular.element('#' + $scope.options.metaData.id+'  TABLE.dragtarget#'+nextId).parents('.box').css('position','relative');
							//angular.element('#' + $scope.options.metaData.id+'  TABLE.dragtarget#'+nextId).parents('.box').css('left',leftNextElement +(e.pageX-startX));
							
							//angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th#'+id).attr('width',(startWidth+(e.pageX-startX)));//width(startWidth+(e.pageX-startX));
							//angular.element('#' + $scope.options.metaData.id+'  #table-grid thead tr th#'+nextId).attr('width',(widthNextElement-(e.pageX-startX)));
						}
					});
					
					angular.element(document).mouseup(function() {
						if(pressed) {
							//$(start).removeClass("resizing");
							pressed = false;
						}
					});
					
					
					//*
					// fixed columns tools    
					//*
					
					angular.element('#' + $scope.options.metaData.id+'  .scrollArea').on('scroll' ,function( evt ) {
						
						var pixelsScrolledLeft =angular.element('#' + $scope.options.metaData.id+'  .scrollArea')[0].scrollLeft;
							var objs1=angular.element('#' + $scope.options.metaData.id+'  .scrollArea thead tr th.preFixedColumn');
							var pos=0;
							for(var i=0;i<objs1.length;i++){
								
								angular.element(objs1[i]).css('left', pixelsScrolledLeft + pos + 'px');   
								angular.element(objs1[i]).css('position', 'relative');   
								pos=pos + angular.element(objs1[i]).width()
							}
							
							for(var i=1;i<=objs1.length;i++){
								var objs2=angular.element('#' + $scope.options.metaData.id+'  .scrollArea tbody tr td.preFixedColumn:nth-child('+i+')');
								var pos=0;
								for(var j=0;j<objs2.length;j++){
									
									angular.element(objs2[j]).css('left', pixelsScrolledLeft + pos + 'px');   
									angular.element(objs2[j]).css('position', 'relative');
									angular.element(objs2[j]).css('background-color', '#efefef');
									/*angular.element(objs2[j]).css('border-right-style', 'solid');
									angular.element(objs2[j]).css('border-right-color', '#dddddd');
									angular.element(objs2[j]).css('border-right-width', '1px');*/
								}
								pos=pos + angular.element(objs1[i]).width()
							}
					    
						
					});
	
					//*
					// column reorder
					//*
					
					var origin=null;
					angular.element('.dragtarget').on("dragstart", function (event) {
							var dt = event.originalEvent.dataTransfer;
							dt.setData('Text', $(this).attr('id'));
							origin=$(this).attr('id');
					});
						
					
					angular.element('#' + $scope.options.metaData.id+'  .scrollArea thead tr th.noFixedColumn').on("dragenter dragover dragend dragleave drop ", function (event) {	
		
						event.preventDefault();
						
						if (event.type === 'dragover') {
							
							if (origin !='' && origin!=null &&   origin!= event.currentTarget.id ) {
								if ( event.target.className == "box" || event.target.nodeName == "TD"  || event.target.nodeName == "SPAN" || event.target.nodeName == "A") {
									angular.element('#' + $scope.options.metaData.id+'  .scrollArea thead tr th#'+event.currentTarget.id+'.noFixedColumn div.th-inner').css('border', '3px dotted #dddddd');
								}
							}	
						}
						
						if (event.type === 'dragleave') {
							if ( event.target.className == "box" || event.target.nodeName == "TD"  || event.target.nodeName == "SPAN" || event.target.nodeName == "A") {
								angular.element('#' + $scope.options.metaData.id+'  .scrollArea thead tr th#'+event.currentTarget.id+'.noFixedColumn div.th-inner').css('border', '');
							}
						}
						
						if (event.type === 'drop') {
							if(event.currentTarget.className.indexOf('noFixedColumn')>=0){
								angular.element('#' + $scope.options.metaData.id+'  .scrollArea thead tr th#'+event.currentTarget.id+'.noFixedColumn div.th-inner').css('border', '');
								
								var dest=event.currentTarget.id;
								//var orig=event.originalEvent.dataTransfer.getData('Text', $(this).attr('id'));
								
								$scope.$apply(function () {
									$scope.changeColumnOrder(dest*1, origin);
								})
							}
						};
					    
					});

					
				});
				 
				$scope.changeColumnOrder= function(new_index, old_index){
					try{
						new_index=parseInt(new_index);
						old_index=parseInt(old_index);
						
						if(new_index >= $scope.options.listFields.length){
							new_index=0;
						}
						
						if(new_index < 0){
							new_index=$scope.options.listFields.length-1;
						}
						
						$scope.options.listFields.splice(new_index, 0, $scope.options.listFields.splice(old_index, 1)[0]);
					}catch(e){
						console.log('error:'+e.description)
					}
				}
				
				
				

				
				//*
				//default setup
				//*
			    $scope.options.selectionRows=[];
				$scope.options.formAvancedSearchResult={};
				$scope.showOverlayFormSearch=false;
				$scope.options.gridControl={};
			    $scope.options.metaData.offset=0;
				$scope.options.showOverlayLoading=false;
				$scope.currentPage = undefined;
				
				$scope.clickReorderColumn=function(){
					$scope.options.listFields.sort(function(a, b){
						return a.order1-b.order1
						});
					var a=$scope.options.listFields
				}
				
				// add onClick event like onclick to buttonsUserPre
				if ($scope.options.hasOwnProperty('buttonsUserPre')){
					for(var i=0;i<$scope.options.buttonsUserPre.length;i++){
						$scope.options.buttonsUserPre[i].onClick=$scope.options.buttonsUserPre[i].onclick
					}
				}
				
				// add onClick event like onclick to buttonsUserPost
				if ($scope.options.hasOwnProperty('buttonsUserPost')){
					for(var i=0;i<$scope.options.buttonsUserPost.length;i++){
						$scope.options.buttonsUserPost[i].onClick=$scope.options.buttonsUserPost[i].onclick
					}
				}
				
				// by default mode
				if (!$scope.options.hasOwnProperty('mode')){
					$scope.options.mode='normal';
				}
				
				// by default show button refresh
				if (!$scope.options.hasOwnProperty('showRefreshButton')){
					$scope.options.showRefreshButton=true;
				}
				
				// By default the global search is performed on all fields
				if (!$scope.options.hasOwnProperty('allFieldsGlobalSearch')){
					$scope.options.allFieldsGlobalSearch=true;
				}
				
				// By default shows overlay loading when component is loading
				if (!$scope.options.hasOwnProperty('showOverlayWhenLoading')){
					$scope.options.showOverlayWhenLoading=true;
				}
				
				// By default not show extra button in top left
				if (!$scope.options.hasOwnProperty('showExtraButtonTopLeft')){
					$scope.options.showExtraButtonTopLeft=false;
				}
				
				// By default not show extra button in top right
				if (!$scope.options.hasOwnProperty('showExtraButtonTopRight')){
					$scope.options.showExtraButtonTopRight=false;
				}
				
				// By default show input search							
				if (!$scope.options.hasOwnProperty('showSearch')){
					$scope.options.showSearch=true;
				}
				// in top
				if (!$scope.options.hasOwnProperty('showTopSearch')){
					$scope.options.showTopSearch=true;
				}
				// By default not show input search in bottom
				if (!$scope.options.hasOwnProperty('showBottomSearch')){
					$scope.options.showBottomSearch=false;
				}
				
				// By default not show button for avanced search
				if (!$scope.options.hasOwnProperty('showAvancedSearch')){
					$scope.options.showAvancedSearch=false;
				}
				 // By default not show form advanced search on header.
				if (!$scope.options.hasOwnProperty('showAdvancedSearchInHeader')){
					$scope.options.showAdvancedSearchInHeader=false;
				}
				
				// By default show button advanced search on top
				if (!$scope.options.hasOwnProperty('showTopAdvancedSearch')){
					$scope.options.showTopAdvancedSearch=true;
				}
				
				// By default not show button advanced search on top
				if (!$scope.options.hasOwnProperty('showBottomAdvancedSearch')){
					$scope.options.showBottomAdvancedSearch=false;
				}
				
				// By default the grid load on init
				if (!$scope.options.hasOwnProperty('loadOnInit')){
						$scope.options.loadOnInit=true;
				}
				
				// By default not show border cell
				if (!$scope.options.hasOwnProperty('tableBordered')){
						$scope.options.tableBordered=false;
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
				if (!$scope.options.hasOwnProperty('showPagination')){
					$scope.options.showPagination=true;
				}else{
					if($scope.options.showPagination){
						$scope.options.showItemsPerPage=true;
						$scope.options.showMetaData=true;
						$scope.options.paginationWidth= 3;
					}else{
						$scope.options.showItemsPerPage=false;
						$scope.options.showMetaData=false;
					}
				}
				
				
				
				
				
				
				
				$scope.currentPage={
            	                       offset:0,
            	                       label:1
            	                   };
								   
				//height for plugin angular-scrollable-table
				$("#"+$scope.options.metaData.id+" .scrollableContainer").css("height",$scope.options.height+'px');
				
				
				//extract type of fieldKey
				var typeFieldKey="";
				for(var i=0;i<$scope.options.listFields.length;i++){
					if($scope.options.listFields[i].column==$scope.options.fieldKey){
						typeFieldKey=$scope.options.listFields[i].type;
						break;
					}
				}
				
				// ---
				// METHODS
				// ---
				$scope.internalControl = $scope.options.gridControl || {};
			  
				$scope.internalControl.refresh = function(bCleanFilters) {
					$scope.refresh(bCleanFilters);  
				}
				
				$scope.internalControl.updateFields = function() {
					$scope.updateFields();  
					$scope.refresh();
				}
				$scope.internalControl.clearGrid = function() {
					$scope.list=[];  				
				}
				
				$scope.internalControl.showOverlayLoading = function(bShow) {
					$scope.options.showOverlayLoadingGrid=bShow;  
				}
			  
				$scope.internalControl.showOverlayFormUser = function(bShow) {
					$scope.options.showOverlayFormUser=bShow;  
				}
				
				$scope.internalControl.showOverlayFormAvancedSearch = function(bShow) {
					$scope.showOverlayFormAvancedSearch=bShow;  
				}
				
				$scope.internalControl.showOverlayFormSuccessError = function(type,text,duration) {
				
					$scope.options.overlayFormSuccessErrorGrid={};
					$scope.options.overlayFormSuccessErrorGrid.show=true;
					$scope.options.overlayFormSuccessErrorGrid.type=type=='1'?'success':'danger';
					$scope.options.overlayFormSuccessErrorGrid.message=text;
					var closeForm=function(){
						$scope.options.overlayFormSuccessErrorGrid.show=false;
						$scope.$apply() ;
					}
					$timeout(closeForm,duration);
				}
				
				$scope.internalControl.showButtonsUserPre = function(bShow) {
					$scope.options.showButtonsGridUserPre=bShow;  
				}
				$scope.internalControl.showButtonsUserPost = function(bShow) {
					$scope.options.showButtonsGridUserPost=bShow;  
				}
				
				$scope.internalControl.clearSelection = function() {
					$scope.options.selectionRows=[];  
                    for( var i=0;i< $scope.list.length;i++){
							$scope.list[i].selected=false;
					}					
				  }
				  
				$scope.internalControl.clearFormAvancedSearch = function() {  
					$scope.formAvancedSearchEventsClean();
				}
				
				

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
                };
				
				// ---
                // Calculate pagination
                // ---	  
											                
				$scope.pagination=function(){
            		   var paginationWidth = $scope.options.paginationWidth || 2;
	                    var limit = $scope.options.metaData.limit;
	                    var offset = $scope.options.metaData.offset;
	                    var total = $scope.options.metaData.total;
	
	                    $scope.pages = [];
	                    if (!(isNaN(limit) || isNaN(offset) || isNaN(total))) {
	                        var numPages = Math.ceil(total / limit);
	                        var startPage = Math.floor(offset / limit) - Math.floor(paginationWidth / 2);
	                        startPage = (startPage < 0) ? 0 : startPage;
	
	                        var currentPageId = Math.floor(offset / limit);
	                        for (var i = startPage; i < Math.min(numPages, startPage + paginationWidth); i++) {
	                            var newPage = {
	                                label: i + 1,
	                                offset:( i+0) * limit
	                            };
	                            if (i === currentPageId) {
	                                $scope.currentPage = newPage;
	                            }
	                            $scope.pages.push(newPage);
	                        }
	                    }
            	};
            	
            	$scope.api=null;
				
            	if( typeof $scope.options.crudUri!=='undefined' && $scope.options.crudUri!==''){
					$scope.api=dataFactoryGrid($scope.options.crudUri,(typeof $scope.options.actions!=='undefined'?$scope.options.actions:''));
            	};
            	
                $scope.handleButtonClick = function (callback, entry) {
				    $scope.selectedRow=entry;
                    if (typeof callback === 'function') {
                        callback(entry);
                    } 
                };
    			
                $scope.onRowClick = function(clickedEntry) {
					if(typeof clickedEntry!=='undefined'){
						for(var i=0;i<$scope.list.length;i++){
							if($scope.list[i][$scope.options.fieldKey]==clickedEntry[$scope.options.fieldKey]){
								clickedEntry.clicked=true;
							}else{
								$scope.list[i].clicked=false;
							}
						}
						if (!$scope.options.hasOwnProperty('listListeners')|| typeof $scope.options.listListeners.onRowClick !== 'function')
							return;
					    $scope.options.listListeners.onRowClick(clickedEntry);
					}
							
                    
                };
				
				$scope.onPageLoadComplete = function(rows) {
                    if (!$scope.options.hasOwnProperty('listListeners') || typeof $scope.options.listListeners.onPageLoadComplete !== 'function')
                        return;
					$scope.options.listListeners.onPageLoadComplete($scope.list);
                };
				
				
				
				// ---
				// PAGINATION METHODS
				// --- 
				
				
				
                $scope.setPage = function (page) {
                	$log.log("setPage:"+angular.toJson(page));
                	$scope.options.metaData.offset=page.offset;
                	$scope.pagination();
                	$scope.refresh(); 
                };
                $scope.setFirstPage = function () {
                    if ($scope.options.metaData === undefined) return;
                    $scope.options.metaData.offset=0;
                    $scope.pagination();
                    $scope.refresh(); 
                };
                $scope.setPreviousPage = function () {
                    if ($scope.options.metaData === undefined) return;
                    var currentOffset = $scope.currentPage.offset;
                    $scope.options.metaData.offset=$scope.currentPage.offset-$scope.options.metaData.limit;
                    $scope.pagination();
                    $scope.refresh();
                };
                $scope.setNextPage = function () {
                    if ($scope.options.metaData === undefined) return;
                    var currentOffset = $scope.currentPage.offset;
                    $scope.options.metaData.offset=$scope.currentPage.offset+$scope.options.metaData.limit;
                    $scope.pagination();
                    $scope.refresh(); 
                };
                $scope.setLastPage = function () {
                	$log.log("setLastPage");
                    if ($scope.options.metaData === undefined) return;
                    var numPages = Math.ceil($scope.options.metaData.total / $scope.options.metaData.limit);
                    $scope.options.metaData.offset=numPages*$scope.options.metaData.limit-$scope.options.metaData.limit;
                    $scope.pagination();
                    $scope.refresh(); 
                };

                $scope.isOnFirstPage = function () {
                    if ($scope.options.metaData === undefined) return;
                    return $scope.options.metaData.offset == 0;
                };

                $scope.isOnLastPage = function () {
                    if ($scope.options.metaData === undefined) return;
                    var numPages = Math.ceil($scope.options.metaData.total / $scope.options.metaData.limit);
					return $scope.options.metaData.offset == numPages * $scope.options.metaData.limit - $scope.options.metaData.limit;
                };

                // ---
                // GET DATA
                // ---	
                $scope.getData = function (oParams) {
                	//var oParams={};
                	if(typeof $scope.options.metaData.limit!=='undefined' && typeof $scope.options.metaData.offset!=='undefined'){
                        
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
						if( $scope.options.hasOwnProperty('metaData')){
							oParams.limit=$scope.options.metaData.limit;
							oParams.offset=$scope.options.metaData.offset;
							oParams.orderby=$scope.options.metaData.orderBy;
							oParams.order=$scope.options.metaData.order;
						}
                    };
                    /*
					if($scope.options.hasOwnProperty("fieldFk") && typeof $scope.options.fieldFk!='undefined' && $scope.options.hasOwnProperty("valueFk") && typeof $scope.options.valueFk!='undefined'){
						oParams["fieldFk"]=$scope.options.fieldFk;
						oParams["valueFk"]=$scope.options.valueFk;
					}*/
					
					/*if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.transformParams == 'function'){
                       oParams=$scope.options.listListeners.transformParams(oParams);
					}
					*/
					
	                $scope.api.getAll(oParams,function (data) {  
                        //$scope.searchQuery="";					
	             		$scope.list =data;
						$scope.onPageLoadComplete($scope.list);
						for( var i=0;i< $scope.list.length;i++){
							var bExists=false;
							for( var j=0;j< $scope.options.selectionRows.length;j++){
								if($scope.options.selectionRows[j]==$scope.list[i][$scope.options.fieldKey]){
									$scope.list[i].selected=true;
									bExists=true;
									break;
								}
							}
							if(!bExists){
								$scope.list[i].selected=false;
							}
						}
						
	                    $scope.pagination();
						if ($scope.options.hasOwnProperty('showOverlayWhenLoading') && $scope.options.showOverlayWhenLoading){
							$scope.options.showOverlayLoadingGrid=false;
						}
	                },function(data){
						$scope.internalControl.showOverlayFormSuccessError('0',data.data || data.message,20005);
					});
                };
				/**
            	 * internal functions form crud
            	 */
				 
				function getOid(row){
				
                		var vid=row[$scope.options.fieldKey];
            	    	var oId={};
						oId['id']=vid;
            	    	
						//agm88x: 10-04-2015 añadir mecanismo de transformParams
						if ($scope.options.hasOwnProperty('gridListeners') && typeof $scope.options.gridListeners.transformParams == 'function'){
							oId=$scope.options.gridListeners.transformParams(row);
						}
						
						return oId;
				}
				
				$scope.onInputEditableChange=function(row,options){
					console.log('checkbox changed value:'+row[options.column]);
					if(options.editable){
					    console.log('checkbox editable:'+row);
						var oId = getOid(row);
						
						$scope.api.update(oId,row,function (data) {  
                             if ($scope.options.hasOwnProperty('gridListeners')){
								if ($scope.options.gridListeners.hasOwnProperty('onAfterSave')&& typeof($scope.options.gridListeners.onAfterSave)=='function') {
									$scope.options.gridListeners.onAfterSave(data);
								}
							}
								
							if(!data.success){
								$scope.options.gridControl.showOverlayFormSuccessError('0',data.message,20000);
							}
							
            	        },function(data){
							if ($scope.options.hasOwnProperty('gridListeners')){
								if ($scope.options.gridListeners.hasOwnProperty('onAfterSave')&& typeof($scope.options.gridListeners.onAfterSave)=='function') {
									$scope.options.gridListeners.onAfterSave(data);
								}
							}		
							$scope.options.gridControl.showOverlayFormSuccessError('0',data.data || data.message,20000);
						});
					
					}
				}
				
				
                
                $scope.refresh=function(cleanFilters){
					var oParams={};
					/*
					 * Click on button refresh, clear filters
					 */
					if(cleanFilters){
						//global search
						 $scope.searchQuery="";;
						
						//advanced search
						$scope.options.formAvancedSearchResult={};
						//color button advanced search to blue
						$scope.listFiltered=false;
						//clean array seleccion rows
						$scope.options.selectionRows=[];
					}
					
					
					// for compatibility with genericRest
					if($scope.options.hasOwnProperty("mode") && $scope.options.mode=='genericRest'){
			        //....................................................................................................................
						var filterAS=[];
						var filterGS=[];
						var filterFK='';
						var filter='';
						
						
						// Advanced Search
						if($scope.options.hasOwnProperty("formAvancedSearch") && $scope.options.formAvancedSearch.hasOwnProperty("fields") && $scope.options.formAvancedSearch.fields!=undefined && typeof $scope.options.formAvancedSearchResult!=undefined){
							
							$scope.options.formAvancedSearch.fields.forEach(function(v,i)
							{
								if ($scope.options.formAvancedSearchResult.hasOwnProperty(v.key))
								{
									
									if (v.hasOwnProperty('betweenFields')){
											var bNullLeft=false;
											var bNullRight=false;
											if(v.betweenFields.hasOwnProperty('fieldRight') && v.betweenFields.hasOwnProperty('fieldLeft')){
												var optionsBF={
																operatorLeft:'<=',
																operatorRight:'>='
												}
												
												angular.extend(optionsBF,v.betweenFields);
												
												optionsBF.operatorLeft=optionsBF.operatorLeft.toUpperCase();
												optionsBF.operatorRight=optionsBF.operatorRight.toUpperCase();
												
												if(optionsBF.operatorLeft.indexOf('NULL')>=0){
													optionsBF.operatorLeft=optionsBF.operatorLeft.replace('NULL','');
													bNullLeft=true;
												}
												
												/*if(optionsBF.operatorLeft.indexOf('null')>=0){
													optionsBF.operatorLeft=optionsBF.operatorLeft.replace('null','');
													bNullLeft=true;
												}*/
												
												if(optionsBF.operatorRight.indexOf('NULL')>=0){
													optionsBF.operatorRight=optionsBF.operatorRight.replace('NULL','');
													bNullRight=true;
												}
												
												/*if(optionsBF.operatorRight.indexOf('null')>=0){
													optionsBF.operatorRight=optionsBF.operatorRight.replace('null','');
													bNullRight=true;
												}*/
												
												var filterBF="(left_OR_NULL) AND (right_OR_NULL)";
												
												
												var filterBFLeft=[];
												if(optionsBF.operatorLeft!=''){
													filterBFLeft.push("["+optionsBF.fieldLeft +"]"+ optionsBF.operatorLeft + $scope.options.formAvancedSearchResult[v.key]);
												}
												
												if(bNullLeft){
													filterBFLeft.push("["+ optionsBF.fieldLeft +"] IS NULL");	
												}
												
												
												var leftOrNull=filterBFLeft.join(' OR ');
												
												filterBF=filterBF.replace('left_OR_NULL',leftOrNull);
															 
												
												var filterBFRight=[];
												
												if(optionsBF.operatorRight!=''){
													filterBFRight.push("["+optionsBF.fieldRight +"]"+ optionsBF.operatorRight + $scope.options.formAvancedSearchResult[v.key]);
												}
												
												if(bNullRight){
													filterBFRight.push("["+ optionsBF.fieldRight +"] IS NULL");
												}
													
												
												var rightOrNull=filterBFRight.join(' OR ');
												
												filterBF=filterBF.replace('right_OR_NULL',rightOrNull);	
												
												filterAS.push(	filterBF);											
													
											}
											
									}else{
										var valor = v.valuefilter?v.valuefilter($scope.options.formAvancedSearchResult[v.key]):$scope.options.formAvancedSearchResult[v.key];
										var campo = v.keyfilter || v.key;
										var aux;
										angular.extend(v, {operator:'='});
										if (v.operator !== "checknull") {
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
								}
								
							});
							
							
							filter= filterAS.join(' AND ');
					
						}
						// Global Search
						else if ($scope.searchQuery!=undefined && $scope.searchQuery!=''){
							if($scope.options.hasOwnProperty('fieldsGlobalSearch') && Array.isArray($scope.options.fieldsGlobalSearch)){
								for(var i=0; i< $scope.options.fieldsGlobalSearch.length;i++){
									
									filterGS.push('['+ $scope.options.fieldsGlobalSearch[i] + ']=' + $scope.searchQuery); 
									
								}
								
								filter=filterGS.length>0?filterGS.join(' OR '):'';
								
							}else{
								filter=$scope.searchQuery;
							}

						}
						// Foreign Key for master/detail
						if($scope.options.hasOwnProperty("fieldFk") && typeof $scope.options.fieldFk!=undefined && $scope.options.hasOwnProperty("valueFk") && typeof $scope.options.valueFk!=undefined){
							filterFK= '[' + $scope.options.fieldFk + ']=' + $scope.options.valueFk;
							
							filter=filter!=''?filterFK + ' AND ' + filter : filterFK;
						}
						
						oParams.filter=filter;
			//.....................................................................................................................................
						
					}else{
						if ($scope.options.allFieldsGlobalSearch){
								oParams.filter=(typeof $scope.searchQuery!=='undefined'?$scope.searchQuery.toUpperCase().trim():'');
						}else {
								if ($scope.options.hasOwnProperty('fieldsGlobalSearch')){
									for(field in $scope.options.fieldsGlobalSearch){															
										oParams[$scope.options.fieldsGlobalSearch[field]]=(typeof $scope.searchQuery!=='undefined'?$scope.searchQuery.toUpperCase().trim():'');
									}
								}
								else {
									throw new Error('options are required!');
								}
						}
						
						if($scope.options.hasOwnProperty("fieldFk") && typeof $scope.options.fieldFk!='undefined' && $scope.options.hasOwnProperty("valueFk") && typeof $scope.options.valueFk!='undefined'){
							oParams["fieldFk"]=$scope.options.fieldFk;
							oParams["valueFk"]=$scope.options.valueFk;
						}
						
						
						 
						if($scope.options.hasOwnProperty("formAvancedSearch") && typeof $scope.options.formAvancedSearchResult!='undefined'){
							for(var key in $scope.options.formAvancedSearchResult){
								oParams[key]=$scope.options.formAvancedSearchResult[key];
							}
						}
				    }
					
					if ($scope.options.hasOwnProperty('showOverlayWhenLoading') && $scope.options.showOverlayWhenLoading){
						$scope.options.showOverlayLoadingGrid=true;
					}
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.transformParams == 'function'){
                       oParams=$scope.options.listListeners.transformParams(oParams);
					}
					
					if($scope.options.showPagination == true){
						$scope.api.getCount(oParams,function (data) {
								$scope.options.metaData.total=data.count;
								$scope.getData(oParams);
						},function(data){ 

								$scope.internalControl.showOverlayFormSuccessError('0',data.data || data.message,20000);
						});
					}
					else{
						$scope.options.metaData.total=0;
						$scope.getData(oParams);
					
					}
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onButtonRefreshClick == 'function'){
                       $scope.options.listListeners.onButtonRefreshClick($scope.list);
					}
					
					
                };
				
                setTimeout(function(){		
                    // Assigns value to the specified advanced search fields in property filteOnInit
                    if($scope.options.hasOwnProperty("filterOnInit") && typeof $scope.options.filterOnInit!=undefined){
						for(var key in $scope.options.filterOnInit){
							$scope.options.formAvancedSearchResult[key]=$scope.options.filterOnInit[key];
						}
					}
					
                    // If loadOnInit, loads the grid
					if ($scope.options.hasOwnProperty('loadOnInit') && typeof $scope.options.loadOnInit!=undefined && $scope.options.loadOnInit===true){
						$scope.refresh();
					} else {
						$scope.list=[];
						$scope.options.loadOnInit=true;
					} 
					
					
					
	            },500);
				
				//Inicializa la lista de campos para que funcionen correctamente.
				$scope.updateFields = function(){
					for (var fieldKey in $scope.options.listFields) {
						//$scope.options.listFields.sorting = '';

						if (typeof $scope.options.listFields[fieldKey].renderer !== 'function') {
							$scope.options.listFields[fieldKey].orderByValue = $scope.options.listFields[fieldKey].column;
							$scope.options.listFields[fieldKey].renderer = function (input, row, column,type) {
								return input;
							};
						}
					}
						if (typeof $scope.options.crudUri !== undefined && $scope.options.crudUri !== '') {
							$scope.api = dataFactoryGrid($scope.options.crudUri, typeof $scope.options.actions !== undefined ? $scope.options.actions : '');
						}
				};
				
                // ON CLICK EXTRA BUTTON
				$scope.clickExtraButton=function(value){ 
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onExtraButtonClick == 'function'){
                       $scope.options.listListeners.onExtraButtonClick();
					}
				}
				
				// ON CLICK EXTRA BUTTON RIGHT
				$scope.clickExtraButtonRight=function(value){ 
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onExtraButtonRightClick == 'function'){
                       $scope.options.listListeners.onExtraButtonRightClick();
					}
				}
				
                // ON CLICK SELECT ALL ROWS CHECKBOX
				$scope.changeSelectAllRows=function(value){
					if (value){
						for( var i=0;i< $scope.list.length;i++){
							$scope.list[i].selected=true;
						}
					}else{
						for( var i=0;i< $scope.list.length;i++){
							$scope.list[i].selected=false;
						}
					}
				}
				
                // ON CLICK SELECT ROWS CHECKBOX
				$scope.checkSelectRow=function(row){
					if(row.selected){
						var bExists=false;
						for( var i=0;i< $scope.options.selectionRows.length;i++){
							if($scope.options.selectionRows[i][$scope.options.fieldKey]==row[$scope.options.fieldKey]){
								bExists=true;
								break;
							}
						}
						if(!bExists){
							//$scope.options.selectionRows.push((typeFieldKey=='text')?row[$scope.options.fieldKey]+"":row[$scope.options.fieldKey]);
							$scope.options.selectionRows.push(row);
						}
					}else{
						
						for( var i=0;i< $scope.options.selectionRows.length;i++){
							if($scope.options.selectionRows[i][$scope.options.fieldKey]==row[$scope.options.fieldKey]){
								$scope.options.selectionRows.splice( i, 1 );
								break;
							}
						}
					}
				}
				
                // ON ORDER CHANGE
                $scope.changeOrder = function (field, orderBy, order) {
                	$scope.options.metaData.orderBy=orderBy;
				    $scope.options.metaData.order=order.toUpperCase();
                	$scope.refresh();
                   
                    for (var fieldKey in $scope.options.listFields) {
                        if ($scope.options.listFields[fieldKey] === field) continue;
                        $scope.options.listFields[fieldKey].order = '';
                    }
                    field.order = order;
                };

                
				
                // ON CHANGE ITEMS PER PAGE
				var timerOnChangeItemsPerPage=null;
                $scope.onChangeItemsPerPage=function(){
					clearInterval(timerOnChangeItemsPerPage);
					timerOnChangeItemsPerPage = setInterval(function(){$scope.refresh();clearInterval(timerOnChangeItemsPerPage);}, 750);
					$scope.options.metaData.offset = 0;
				};
                
                // ---
                // ON BUTTON CONTINUE FORM USER
                // ---	
				$scope.formUserOnContinue=function(data){
					// for Backwards compatibility  options.formUser.events.continue
					if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('events') && typeof $scope.options.formUser.formUser.continue == 'function'){
                       $scope.options.formUser.events.continue(data);
					}
					
					if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('listeners') && typeof $scope.options.formUser.listeners.onContinue == 'function'){
                       $scope.options.formUser.listeners.onContinue(data);
					}
				}
			  
			    // ---
                // ON BUTTON CANCEL FORM USER
                // ---	
				$scope.formUserOnCancel=function(){
					// for Backwards compatibility  options.formUser.events.continue
					if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('events') && typeof $scope.options.formUser.formUser.cancel == 'function'){
                       $scope.options.formUser.events.cancel(data);
					}
					
					if ($scope.options.hasOwnProperty('formUser') && $scope.options.formUser.hasOwnProperty('listeners') && typeof $scope.options.formUser.listeners.onCancel == 'function'){
                       $scope.options.formUser.listeners.onCancel(data);
					}
				}
				
				
				// ---
                // ON SEARCH
                // ---	
				 var timerOnChangeSearchQuery=null;
                 $scope.onChangeSearchQuery=function(){
					clearInterval(timerOnChangeSearchQuery);
					timerOnChangeSearchQuery = setInterval(function(){
					$scope.refresh();
					$scope.setFirstPage();
					clearInterval(timerOnChangeSearchQuery)
					;}, 750);

				 };
				 
				
				// ---
                // ON AVANCEDSEARCH
                // ---	
				 $scope.onClickAvancedSearch=function(){
					$scope.showOverlayFormAvancedSearch=true;
				 }
				 
				
				// ---
                // ON CONTINUE BUTTON FORM AVANCED SEARCH
                // ---	
				 $scope.formAvancedSearchEventsContinue=function(){
					$scope.refresh();
					$scope.showOverlayFormAvancedSearch=false;
					
					// for Backwards compatibility
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchContinueClick == 'function'){
                       $scope.options.listListeners.onFormAvancedSearchContinueClick($scope.options.formAvancedSearchResult);
					}
					
					if ($scope.options.hasOwnProperty('formAvancedSearch') && $scope.options.formAvancedSearch.hasOwnProperty('listeners') && typeof $scope.options.formAvancedSearch.listeners.onContinue == 'function'){
                       $scope.options.formAvancedSearch.listeners.onContinue($scope.options.formAvancedSearchResult);
					}

					//color button advanced search to red
					$scope.listFiltered=true;
				 }
				 
				 
				// ---
                // ON CANCEL BUTTON FORM AVANCED SEARCH
                // ---	
				 $scope.formAvancedSearchEventsCancel=function(){ 
					$scope.showOverlayFormAvancedSearch=false;
					
					// for Backwards compatibility
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchCancelClick == 'function'){
                       $scope.options.listListeners.onFormAvancedSearchCancelClick();
					}
					
					if ($scope.options.hasOwnProperty('formAvancedSearch') && $scope.options.formAvancedSearch.hasOwnProperty('listeners') && typeof $scope.options.formAvancedSearch.listeners.onCancel == 'function'){
                       $scope.options.formAvancedSearch.listeners.onCancel($scope.options.formAvancedSearchResult);
					}
				}

				// ---
                // ON CLEAN BUTTON FORM AVANCED SEARCH
                // ---	
				 $scope.formAvancedSearchEventsClean=function(){
					//cleaning filter and refresh grid
				    $scope.refresh(true);
					
					// for Backwards compatibility
					if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onFormAvancedSearchCleanClick == 'function'){
                       $scope.options.listListeners.onFormAvancedSearchCleanClick();
					}
					
					if ($scope.options.hasOwnProperty('formAvancedSearch') && typeof $scope.options.formAvancedSearch.onClean == 'function'){
                       $scope.options.formAvancedSearch.onClean($scope.options.formAvancedSearchResult);
					}
				}	    				
            }
        };
    })
	