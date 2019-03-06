'use strict';
// Angular Init
var app = angular.module('app', [
	'eduGrid'
]);

app.controller('appController', ['$scope','$http','dataFactoryGrid', function ($scope,$http,dataFactoryGrid) {
	
     $scope.field={key: 'vcodcen',type: 'date',col:'col-md-6',label: 'Código',placeholder: 'Denominación',autofocus:'',required: true }
										
	
	$scope.userFieldsFormGrid=[	  
			        {key: 'campo1',type: 'text',col:'col-md-6',label: 'Código',placeholder: 'Código',autofocus:'',required: true },
					{key: 'campo2',type: 'text',col:'col-md-6',label: 'Código',placeholder: 'Código',autofocus:'',required: true },
					{key: 'campo3',type: 'text',col:'col-md-12',label: 'Código',placeholder: 'Código',autofocus:'',required: true }
				];
	
	$scope.avancedSearchFieldsFormGrid=[	  
			        /*{key: 'fecha_ini_1',type: 'date',col:'col-md-3',label: 'Fecha inicio',placeholder: 'Fecha inicio',autofocus:'',required: false,size:'sm',betweenFields:{
																																											  fieldLeft:'campoIzquierda',
																																											  operatorLeft:'<=null',
																																											  fieldRight:'campoDerecha',
																																											  operatorRight:'NULL'
																																											  
																																											} },
					*/
					{key: 'fecha_fin_1',type: 'date',col:'col-md-3',label: 'Fecha fin',placeholder: 'Fecha fin',autofocus:'',required: false,size:'sm' },
					{key: 'fecha_ini_2',type: 'date',col:'col-md-3',label: 'Fecha inicio',placeholder: 'Fecha inicio',autofocus:'',required: false,size:'sm' },
					{key: 'fecha_fin_2',type: 'date',col:'col-md-3',label: 'Fecha fin',placeholder: 'Fecha fin',autofocus:'',required: false,size:'sm' },
					{key: 'tipo',type: 'text',col:'col-md-12',label: 'Tipo',placeholder: 'Tipo',autofocus:'',required: false,size:'sm' }
				];
	
	$scope.ciudades=[
			        {   value:'ABANILLA',
						 name: 'Abanilla2'		
					}, {
						value:'MURCIA',
						name: 'Murcia2'
					}, {
						value:'ABARÁN',
						name: 'Abarán2'
					}
				];
				
	$scope.municipios=[
					{
						"value":"ABANILLA",
						"name": "Abanilla"	
					},{
						"value":"ABARAN",
						"name": "Abarán2"	
					},{
						"value":"MURCIA",
						"name": "Murcia"	
					},{
						"value":"CARTAGENA",
						"name": "Cartagena"
					},{
						"value":"ALCANTARILLA",
						"name": "Alcantarilla"
					},{
						"value":"ABUDEITE",
						"name": "Albudeite"
					}
				]			
				
	

    $scope.options = {
        heading: 'Demo eduGrid',
		showOverlayWhenLoading:true, //default true
		showOverlayFormUser:false, //default false
        showRefreshButton: true, //default true
		showExtraButtonTopLeft:true, //default false
		showExtraButtonTopRight:true,
		iconExtraButtonTopLeft:'pencil', //default 'plus-sing
		iconExtraButtonTopRight:'file',
        
		showPagination: true,  //default true
		
		dragAndDropColumn:false, // default true
		
		
		
		showSearch: true, //default true
		allFieldsGlobalSearch:true, //default true. Esta y la siguiente son excluyentes. Si la propiedad allFieldsGlobalSearch está definida, ignora la propiedad fieldsGlobalSearch
		fieldsGlobalSearch:['vdencen','vdomcen'],
		
		showTopSearch: true, //default true. Lugar donde se situa el input par introducir el texto a buscar en todos los campos
		showBottomSearch:false, // default false
		
		showAvancedSearch:false, //default false . Éste y el siguiente son excluyentes. showAdvancedSearchInHeader tiene prioridad sobre ésta.
		showAdvancedSearchInHeader:true, //default value false.
		
		showTopAdvancedSearch: true, // default value true. Depende del atributo showAvancedSearch
		showBottomAdvancedSearch: false, //default false
		
		
		loadOnInit:true, // default value true. Used so that it does not load the grid at the beginning
		reloadAfterCleanFilter:false,
		
		filterOnInit:{},//{vcodcen:'30009319'}, //default {}. Assign value to los campos del formulario de búsqueda avanzada
		
		tableBordered:true, //default false
		mode:'normal', //default 'normal', ('normal' | 'genericRest')
		
       
        paginationWidth: 3,
		
		showButtonsGridUserPre:true,
		showButtonsGridUserPost:true,
		
		
		showRowNumber:true,
		showSelectRow:true,
		
       crudUri:'api/v1/centros/:id', //url del servicio rest. Espera métodos get, getAll, count, delete, post, put
		
		// para sobrescribir los métodos del api rest
		//actions:{
		//		 getAll: {method:'GET', url: 'api\/v1\/centros\/\?getData', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:true},
		//		 getCount: {method:'GET', url: 'api\/v1\/centros\/\?getCount', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:false}
		//		},
		
		//fieldFk:'codigo',
		//valueFk:'30000018',
        fieldKey:'vcodcen',
		fieldKeyLabel:'código',
        height:550,
		mode:'genericRest',
		showGroupColumns:true,
		showGroupColumnsL2:true,
        listFields: [
				 // {label: 'Código', column: 'vcodcen', weight: '10',type:'number',group:'Grupo 2', textGroup:'Texto para mostrar',styleGroup:['color:white','background-color:blue'],groupL2:'grupol21', textGroupL2:'Texto para mostrar'},
                 // {label: 'Presupuesto', column: 'presupuesto', weight: '10',type:'currency',group:'Grupo 2',groupL2:'grupol21'},
				 // {label: 'email', column: 'vemail', weight: '10',type:'checkbox','editable':false,group:'Grupo 2',groupL2:'grupol21'},
				 // {label: 'Tit. públ.', column: 'vtitularidad', weight: '10',
						// type:'select',
						// options:[{'value':'S','name':'SÍ'},{'value':'N','name':'NO'}],
				        // listeners:{
									// onChange:function(row){
														   // console.log('changed:'+row);
				                                          // }
				                   // }
				 // ,group:'Grupo 2',groupL2:'grupol21'},
                 // {label: 'Denominación', column: 'vdencen', weight: '30',type:'text',group:'Grupo 4' , textGroup:'Texto para mostrar',groupL2:'grupol21'},
                 // {label: 'Domicilio', column: 'vdomcen', weight: '20',type:'text',group:'Grupo 3', textGroup:'Texto para mostrar',styleGroup:['color:green','background-color:yellow'],groupL2:'grupol22', textGroupL2:'Texto para mostrar'},
                 // {label: 'Localidad', column: 'vloccen', weight: '10',type:'text',group:'Grupo 3',groupL2:'grupol22'},
                 // {label: 'Municipio', column: 'vmuncen', weight: '20',type:'text',notOrder:true,group:'Grupo 5',groupL2:'grupol22'}
				                                             {
                                                                    label: 'Código', column: 'vcodcen', weight: '10',type:'number'
																	,group:'Grupo 20',
                                                                   groupL2:'Grupo 21'
                                                              },
                                                              {
                                                                   label: 'Presupuesto', column: 'presupuesto', weight: '10',type:'currency',
                                                                   //group:'Grupo 2',
                                                                  // groupL2:'Grupo 21',
																   
                                                                    group:'Grupo 2',textGroup:'Texto para mostrar', styleGroup:['color:white','background-color:blue'],
                                                                     groupL2:'Grupo 21',textGroupL2:'Texto para mostrar', styleGroupL2:['color:white','background-color:blue']

                                                              },
                                                              {
                                                                   label: 'email', column: 'vemail', weight: '10',type:'checkbox','editable':false,
                                                                   group:'Grupo 2',
                                                                   groupL2:'Grupo 21'

                                                              },
                                                               
                                                             {
                                                                 label: 'Denominación', column: 'vdencen', weight: '30',type:'text',
                                                                 group:'Grupo 3',
                                                                 groupL2:'Grupo 21'

                                                             },
                                                            {
                                                                 label: 'Domicilio', column: 'vdomcen', weight: '20',type:'text',
                                                                 group:'Grupo 4', textGroup:'Texto para mostrar',styleGroup:['color:green','background-color:yellow'],
                                                                groupL2:'Grupo 22',textGroupL2:'Texto para mostrar', styleGroupL2:['color:white','background-color:blue']
                                                             },
                                                             {
                                                                label: 'Localidad', column: 'vloccen', weight: '10',type:'text',
                                                                group:'Grupo 4', textGroup:'Texto para mostrar',
                                                                groupL2:'Grupo 22'
                                                            },
                                                           {
                                                                label: 'Municipio', column: 'vmuncen', weight: '20',type:'text',notOrder:true,
                                                               group:'Grupo 5', textGroup:'Texto para mostrar',
                                                              groupL2:'Grupo 22'}
                                                         

        ],
        metaData:{
			panelType:"info",
			limit:50,
			orderBy:'vcodcen',
			order:'asc'
        },
        listListeners: {
			onChangeSelectionRows:function(rows){
				console.log('SelectionRows:'+rows.length );
			},
			
			onExtraButtonRightClick:function(){
				alert('button right clicked');
			},
		    onPageLoadComplete:function(rows){
				
				for(var i=0;i<rows.length;i++){
					if(i%2==0){
						rows[i].$styles={'background':'green'};
					}else{
						rows[i].$styles={'background':'red'};
					}
				}
            	//console.log('onPageLoadComplete rows:'+angular.toJson(rows));
            },
            onRowClick:function(row){
            	//console.log('click row:'+angular.toJson(row));
            },onExtraButtonClick:function(){
            	console.log('click extra button:');
            },transformParams:function(oParams){
				console.log('transformParams :'+angular.toJson(oParams));
				return oParams;
			}
        },
		
        buttonsUserPre: [
					{   
						label: 'Ejecutar', 
						class: '', 
						glyphicon: 'flash', 
						button: false,
						onclick: function (row) {
							console.log('ejecutar consulta:', row);
						},
						disabled: function (row) {
							//console.log('disabled button:', row);
							return false;
						},
						hidden: function (row) {
							//console.log('disabled button:', row);
							if(row.vcodcen=='30000018'){
								return true;
							}else{
								return false;
							}
							
						}
				  },
				  {   
						label: 'Boton2', 
						class: '', 
						glyphicon: 'envelope', 
						button: false,
						onclick: function (row) {
							console.log('envío:', row);
						},
						disabled: function (row) {
							return false;
						},
						hidden: function (row) {
							if(row.vcodcen=='30000146'){
								return true;
							}else{
								return false;
							}
						}
				  }
				  
              ],
        buttonsUserPost: [
           // {label: 'Ejecutar', class: '', glyphicon: 'flash', button: false, onclick: function (row) {
           //     console.log('ejecutar consulta:', row);
           // }}
        ],
		formUser:{
		    width:'700px',
			fields:$scope.userFieldsFormGrid,
			listeners:{
					continue: function () {
                      console.log('form User continue button:');
					  $scope.options.gridControl.showOverlayFormUser(false)
                    },
				    cancel: function () {
                      console.log('form User cancel button');
					  $scope.options.formUser.result={};
					  $scope.options.gridControl.showOverlayFormUser(false)
                    }
			  },
		     result:{}
		},
		formAvancedSearch:{
			width:'1200',
			fields: $scope.avancedSearchFieldsFormGrid,
			listeners:{
					onContinue: function (filters) {
                      
                    },
				    onCancel: function () {
                      
                    },
				    onClean: function () {
                      
                    }
			  }
			
		},
		snippets:{
					titleExtraButtonTopRight:'Informes',
					extraButtonTopRight:'Informes'
					
		},
		buttonsBarHeader:{
					align:'right', // left, right, center
					buttons:[
							{class:'btn-primary btn-lg', text:'boton1',
								listeners:{
									onClick:function(){
										alert("boton1 clickado");
									}
								}
							},
							{class:'btn-warning', text:'boton2',
								listeners:{
									onClick:function(){
										alert("boton2 clickado");
									}
								}
							},
							{class:'btn-info btn-xs' , text:'boton3',
								listeners:{
									onClick:function(){
										alert("boton3 clickado");
									}
								}
							}
					]
			
		},
		buttonsBarFooter:{
					align:'center', // left, right, center
					buttons:[
							{class:'btn-primary btn-sm', text:'boton1',
								listeners:{
									onClick:function(){
										alert("boton1 clickado");
									}
								}
							},
							{class:'btn-warning', text:'boton2',
								listeners:{
									onClick:function(){
										alert("boton2 clickado");
									}
								}
							},
							{class:'btn-info btn-xs' , text:'boton3',
								listeners:{
									onClick:function(){
										alert("boton3 clickado");
									}
								}
							}
					]
			
		}
    };
}])

