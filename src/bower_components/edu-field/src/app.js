'use strict';
// Angular Init
var app = angular.module('app', [
	'eduField'
]);

app.controller('appController', ['$scope','$http', function ($scope,$http) {
     $scope.selectedTema=(typeof $scope.result!=='undefined' ?$scope.result.CODIGO_TEMA:'');
	 
	 $scope.enter=function(){
		 alert("hola");
	 }
	
     $scope.result={};
	 $scope.municipios=[
						{
							"value":"ABANILLA",
							"name": "Abanilla",
                            "poblacion":34566							
						},{
							"value":"ABARAN",
							"name": "Abarán",
                            "poblacion":1566	
						},{
							"value":"MURCIA",
							"name": "Murcia",
                            "poblacion":45586	
						},{
							"value":"CARTAGENA",
							"name": "Cartagena",
                            "poblacion":7896434
						},{
							"value":"ALCANTARILLA",
							"name": "Alcantarilla",
                            "poblacion":123456790
						},
						{
							"value":"ALBUDEITE",
							"name": "Albudeite",
                            "poblacion":789543
						}
				];		
				
				
		var itemsG=$scope.municipios;	
        var listFieldsG= [
				 {label: 'Value', column: 'value', weight: '30',type:'text'},
                 {label: 'Name', column: 'name', weight: '40',type:'text'},
				  {label: 'Población', column: 'poblacion', weight: '30',type:'number'}
				 
        ]	
				
     $scope.fields=[ 
					 {key: 'ckeckbox2',name:'checkbox2',type: 'checkbox',inputSize:"md",col:'col-md-2',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
					
					{key: 'areatexto2',type: 'textarea',col:'col-md-6',rows: 5,label: 'Área de texto',placeholder: 'Área de texto',autofocus:false,required: true,minlength:5,maxlength:100,disabled:false,readonly:false	},
    	            
	                {key: 'button6',type: 'button',col:'col-md-1',label:'button',icon:'fa fa-external-link-square fa-2x',state:"danger",size:"",disabled:false,onClick:function(){ 
																									console.log("botón clickado");
																										/*if($scope.fields[10].fieldControl.filesInQueue()>0){
																				
																											$scope.fields[10].fieldControl.clearQueue();
																											var c=$scope.fields[10].fieldControl.filesInQueue();
																										}*/
																										
																								   } 
					},
					{key: 'button7',type: 'button',col:'col-md-2',label:'button',icon:'fa fa-external-link-square fa-2x',state:"danger",size:"",disabled:false,onClick:function(){ 
																									console.log("botón clickado");
																										/*if($scope.fields[10].fieldControl.filesInQueue()>0){
																				
																											$scope.fields[10].fieldControl.clearQueue();
																											var c=$scope.fields[10].fieldControl.filesInQueue();
																										}*/
																										
																								   } 
					},
					
	                 //row zero
					 {key: 'iban1',type: 'iban',col:'col-md-3',inputSize:"",showButton:false,typebutton:"warning",
						fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban:"+value);
							},
							onFocus:function(value,subitem){
								console.log("onFocus iban:"+value);
							},
							onBlur:function(value,subitem){
								console.log("onBlur iban:"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},label: 'Nº cuenta cliente',placeholder: 'IBAN',autofocus:false,required: true,name:"nombre"  },
						
						{key: 'iban2',type: 'iban',col:'col-md-3',inputSize:"",showButton:false,typebutton:"warning",
						fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban:"+value);
							},
							onFocus:function(value,subitem){
								console.log("onFocus iban:"+value);
							},
							onBlur:function(value,subitem){
								console.log("onBlur iban:"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},label: 'Nº cuenta cliente',placeholder: 'IBAN',autofocus:false,required: true,name:"nombre"  },
						
						{key: 'iban3',type: 'iban',col:'col-md-3',inputSize:"",showButton:false,typebutton:"warning",
						fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban:"+value);
							},
							onFocus:function(value,subitem){
								console.log("onFocus iban:"+value);
							},
							onBlur:function(value,subitem){
								console.log("onBlur iban:"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},label: 'Nº cuenta cliente',placeholder: 'IBAN',autofocus:false,required: true,name:"nombre"  },
						
						{key: 'iban4',type: 'iban',col:'col-md-3',inputSize:"",showButton:false,typebutton:"warning",
						fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban:"+value);
							},
							onFocus:function(value,subitem){
								console.log("onFocus iban:"+value);
							},
							onBlur:function(value,subitem){
								console.log("onBlur iban:"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},label: 'Nº cuenta cliente',placeholder: 'IBAN',autofocus:false,required: true,name:"nombre"  },
	 
	 
	                  //row one
					  {key: 'texto61',name:'texto61',type: 'text',default:'texto por defecto',col:'col-md-4',label: 'Texto2',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					  {key: 'xxselectremoto1',name:'xxselectremoto1', type: 'select',col:'col-md-12',required:true,label: 'Select datos remotos',emptyOptionText:'Seleccione una opción',selecttypesource:'url',selectsource: 'api/v1/municipios',optionname:"name",optionvalue:"value",selectconcatvaluename:true},
				      
					  //row two
					  {key: 'texto6',name:'texto6',type: 'text',default:'texto por defecto',
					  fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban:"+value);
								
							}
						},
						uppercase:true,col:'col-md-4',label: 'Texto1',uppercase:true,placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					  
					  {key: 'ckeckbox24',name:'checkbox2',type: 'checkbox',inputSize:"md",col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
					  
					  //row three
					  {key: 'ckeckbox21',type: 'checkbox',inputSize:"md",col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
					  {key: 'ckeckbox22',type: 'checkbox',inputSize:"md",col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
					  {key: 'ckeckbox23',type: 'checkbox',inputSize:"md",col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
				      
					  //row for
					  {key: 'texto62',type: 'text',default:'texto por defecto',col:'col-md-4',label: 'Texto3',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					  {key: 'ckeckbox3',type: 'checkbox',inputSize:"md",col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
					  {key: 'texto4',type: 'text',default:'texto por defecto',col:'col-md-4',label: 'Texto4',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					  
					  //row five
					  {key: 'grid',type: 'grid',height:'180',col:'col-md-12',label: 'Grid1',readonly:false,'showButtons':false,
					    fieldKey:'vcodcen',
						uri:'api\/v1\/instalaciones/:id',
						fieldFk:'codcen',
		                valueFk:'30000018',
						//gridRows:itemsG,
						listFields:[
									{label: 'Código', column: 'codigo', weight: '20',type:'text'},
									 {label: 'Descripción', column: 'descripcion', weight: '60',type:'text'},
									 {label: 'Localidad', column: 'vloccen', weight: '20',type:'select',options:[
																													{value:'ABANILLA',descripcion:'Abanilla'},
																													{value:'CARAVACA DE LA CRUZ',descripcion:'Caravaca de la Cruz'},
																													{value:'CEHEGIN',descripcion:'Cehegín'},
																													{value:'LORCA',descripcion:'Lorca'},
																													{value:'CARTAGENA',descripcion:'Cartagena'},
																													{value:'CIEZA',descripcion:'Cieza'},
																													{value:'JUMILLA',descripcion:'Jumilla'},
																													{value:'TOTANA',descripcion:'Totana'},
									 ]}
								]
					   },
					  
					  //row six
					  {key: 'texto5',type: 'text',default:'texto por defecto',col:'col-md-6',label: 'Texto5',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					  {key: 'texto51',type: 'text',default:'texto por defecto',col:'col-md-6',label: 'Texto6',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					  {key: 'texto52',type: 'text',default:'texto por defecto',col:'col-md-6',label: 'Texto7',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
	                  
	 
	 
	 
	                  {key: 'oculto',type: 'hidden',value:"campo oculto",name:"nombre",id:"id" },
					  {key: 'moneda',type: 'currency',col:'col-md-4',min:1,max:12,label: 'Moneda',placeholder: 'Moneda',autofocus:false,required: false },
					 {key: 'moneda1',type: 'currency',col:'col-md-4',min:1,max:12,label: 'Moneda1',placeholder: 'Moneda',autofocus:false,required: false },
					
					//{key: 'fecha',type: 'date-ag-ui',col:'col-md-2',lines: 5,label:'Fecha',placeholder: 'Fecha',autofocus:false,required: true,showPopupCalendar:true,format:"dd/MM/yyyy"}, 
					{key: 'literal',type: 'literal',col:'col-md-12',label:'campo literal',text:"*Nota: campo literal para que podamos colocar textos en cualquier parte del formulario",id:"id" },
					{key: 'button1',type: 'button',col:'col-md-3',label:'button',icon:'fa fa-external-link-square fa-2x',state:"danger",size:"",disabled:false,onClick:function(){ 
																									console.log("botón clickado");
																										/*if($scope.fields[10].fieldControl.filesInQueue()>0){
																				
																											$scope.fields[10].fieldControl.clearQueue();
																											var c=$scope.fields[10].fieldControl.filesInQueue();
																										}*/
																										
																								   } 
					},
					
					{key: 'iban',type: 'iban',col:'col-md-4',inputSize:"",showButton:false,typebutton:"warning",
						fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban:"+value);
							},
							onFocus:function(value,subitem){
								console.log("onFocus iban:"+value);
							},
							onBlur:function(value,subitem){
								console.log("onBlur iban:"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},label: 'Nº cuenta cliente',placeholder: 'IBAN',autofocus:false,required: true,name:"nombre"  },
						
						{key: 'iban2',type: 'iban2',col:'col-md-4',inputSize:"",showButton:false,typebutton:"warning",
						fieldListeners:{
							onChange:function(value,subitem){
								console.log("onChange iban-"+subitem+":"+value);
							},
							onFocus:function(value,subitem){
								console.log("onFocus iban-"+subitem+":"+value);
							},
							onBlur:function(value,subitem){
								console.log("onBlur iban-"+subitem+":"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},label: 'Nº cuenta cliente',placeholder: 'IBAN2',autofocus:false,required: true,name:"nombre"  },
						
					{key: 'nif',type: 'nifniecif',col:'col-md-4',inputSize:"sm",label: 'NIF',textbutton:'NIF',placeholder: 'NIF',autofocus:false,required: true },
					{key: 'nie',type: 'nifniecif',col:'col-md-4',inputSize:"sm",label: 'NIE',textbutton:'NIE',placeholder: 'NIE',autofocus:false,required: true },
					{key: 'cif',type: 'nifniecif',col:'col-md-4',inputSize:"sm",typebutton:"danger",label: 'CIF',textbutton:'Cif',placeholder: 'CIF',autofocus:false,required: true ,disabled:true},
	                {key: 'texto',type: 'text',default:'texto por defecto',
						fieldListeners:{
							onChange:function(value){
								console.log("cambio texto:"+value);
							},
							onFocus:function(value){
								console.log("entrada al control:"+value);
							},
							onBlur:function(value){
								console.log("salida del control:"+value);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						},col:'col-md-6',label: 'Texto',placeholder: 'Texto',autofocus:false,required:false,readonly:false },
					{key: 'textobtn',type: 'textbutton',inputSize:"lg",default:'texto por def.',showbutton:true,typebutton:'info',icon:'search',textbutton:'texto',
						fieldListeners:{
						    onClick:function(value){
								console.log("click on button: "+value);
							},
							onChange:function(value){
								console.log("cambio texto:"+value);
							},
							onFocus:function(value){
								console.log("entrada al control:"+value);
							},
							onBlur:function(value){
								console.log("salida del control:"+value);
							}
						},col:'col-md-6',label: 'Texto',placeholder: 'Texto',autofocus:false,required: true },
					{key: 'upload',fieldListeners:{
																
																onAfterAddingFile:function(item){
																	var a = item;
																},
																onBeforeUploadItem:function(item){
																	var b=item;
																},onSuccessItem:function(item){
																	if(typeof item!=='undefined'){
																		if($scope.fields[10].fieldControl.filesInQueue()>0){
																			
																			$scope.optionsCrud.formFields.tabs[10].fieldControl.clearQueue();
																		    var c=$scope.fields[4].fieldControl.filesInQueue();
																		}
																	}
																	
																},onProgressItem:function(progressPercentage,filemane){
																	console.log("progress upload file "+filename+":"+progresssPercentage+'%');
																	
																}
													}
							,type: 'upload',typeButton:'info',inputSize:'lg',showprogressbar:true,showbuttons:true,url:"/api/v1/upload",iconButton:'folder-open',labelButton:'Sel. fichero',col:'col-md-12',label: 'Subida fichero',placeholder: 'Upload',autofocus:false },
					
					{key: 'upload15x',fieldListeners:{
																onErrorItem:function(error){
																	alert("Ha ocurrido un error subiendo el fichero "+ error)
																},
																onAfterAddingFile:function(item){
																	var a = item;
																},onSuccessItem:function(item){
																	var a=item;
																}
													}
							,type: 'upload15x',typeButton:'info',inputSize:'',showprogressbar:true,showbuttons:true,url:'/api/v1/upload',maxsize:'20MB',pattern:'.pdf,.jpg,video,image',iconButtonSelectFile:'folder-open',labelButtonSelectFile:'',iconButtonUploadFile:'upload',labelButtonUploadFile:'',col:'col-md-6',label: 'Subida fichero',placeholder: 'Upload',autofocus:false },
					
					
					
					{key: 'numeroentero',type: 'number',col:'col-md-4',min:1,max:12,label: 'Número entero',placeholder: 'Número entero',autofocus:false,required: false },
					
					{key: 'numerodecimal',type: 'number',col:'col-md-4',min:1,max:12,pattern:"/^-?[0-9]+([,\.][0-9]*)?$/",label: 'Número decimal',placeholder: 'Número decimal',autofocus:false,required: true },
					
					{key: 'email',type: 'email',col:'col-md-4',label: 'Email',placeholder: 'Email',autofocus:false,required: false },
					{key: 'url',type: 'url',col:'col-md-4',label: 'Url',placeholder: 'Url',autofocus:false,required: true },
					{key: 'password',type: 'password',pattern:"/^123456$/",col:'col-md-4',label: 'Password (123456)',placeholder: 'Password',autofocus:false,required: true },
				   
					{key: 'ckeckbox',type: 'checkbox',inputSizeClass:"input-lg",col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:false,disabled:false,required: true,default:'N'},
					
					
					{key: 'radio',type: 'radio',col:'col-md-4',inputSizeClass:"input-sm",label: 'Radio',name:'mamifero',required:true,options:[{"name":"perro","value":"1"},{"name":"gato","value":"2"}],
						fieldListeners:{
							onChange:function(value){
								console.log("onChange radio button value:"+value);
							}
						},placeholder: 'Checkbox',autofocus:'',required: true },
					{key: 'rango',type: 'range',col:'col-md-6',label: 'Slider',min:100,max:500,placeholder: 'Slider',autofocus:false,required: true },
					
					
					{key: 'fecha',type: 'date',col:'col-md-4',lines: 5,inputSize:'sm',label:'Fechaxx',placeholder: 'Fecha',autofocus:false,required: true,showButtonCalendar:true,format:'dd/MM/yyyy',disabled:false,readonly:false,
						fieldListeners:{
							onChange:function(value,subitem,showCalendar){
								console.log("onChange date:"+value+ ' ' +subitem+ ' showCalendar:'+showCalendar);
							},
							onFocus:function(value){
								console.log("onFocus date:"+value);
							},
							onBlur:function(value,showCalendar){
								console.log("onBlur Date"+value+ ' showCalendar:'+showCalendar);
							},
							onKeypress:function(event){
								console.log("pulsada la tecla con código:"+event.keyCode);
							}
						}
					}, 
					{key: 'fechahora',type: 'date-time',col:'col-md-4',label:'Fecha Hora',placeholder: 'Fecha Hora',autofocus:false,required: true,disabled:false},					 
					{key: 'mes',type: 'month',col:'col-md-4',label: 'Fecha mes',placeholder: 'Fecha mes',autofocus:false,required: true },
					{key: 'semana',type: 'week',col:'col-md-4',label: 'Semana',placeholder: 'Semana',autofocus:false,required: true },
					{key: 'hora',type: 'time',col:'col-md-4',label: 'Hora',placeholder: 'Hora',autofocus:false,required: true ,disabled:false,readonly:false},
					
					{key: 'autocompletelocal',type: 'autocomplete',inputSize:"sm",autofocus:true,col:'col-md-4',required:true,label: 'Autocomplete datos locales',autoclocaldata:$scope.municipios,autocsearchfields:"name",autocminlength:3,autocfieldtitle:"value,name",autocfielddescription:"",autocfieldvalue:"value",autocpause:300,disabled:false,readonly:false},
				   
				   {key: 'autocompleteremoto',type: 'autocomplete',widthdropdown:'400px',col:'col-md-4',required:true,label: 'Autocomplete datos remotos',autocurldata: 'api/v1/municipios?filter=',autocsearchfields:"name",autocminlength:3,autocfieldtitle:"value,name",autocfielddescription:"name",autocfieldvalue:"value",autocpause:300,disabled:false,readonly:false,
						fieldListeners:{
						    
							onChange:function(value,item){
								console.log("Cambio selección :"+value + " item:"+ angular.toJson(item));
							}
						}
				   },											   
					
					{key: 'autocompleteremotoloadall',
							type:'autocomplete',
							widthdropdown:'600px',
							col:'col-md-4',
							required:true,
							label: 'Autocomplete datos remotos load all',			 
							autocurldataloadall: 'api/v1/municipios',
							autocsearchfields:"name",
							autocminlength:3,
							autocfieldtitle:"value,name",
							autocfielddescription:"",
							autocfieldvalue:"value",
							autocpause:300,
							disabled:false,
							readonly:false,
							whenNotFoundReturnSearchString:true
					},											   
				    
					
					{key: 'button2',type: 'button',col:'col-md-3',label:'show loading select',icon:'fa fa-external-link-square fa-2x',state:"danger",size:"",disabled:false,onClick:function(){ 
																									console.log("botón clickado");
																										//$scope.fields[28].loading=true;
																										$scope.fields[42].hidden=!$scope.fields[42].hidden;
																								   } 
					},
					{key: 'button3',type: 'button',col:'col-md-3',label:'hide loading select',icon:'fa fa-external-link-square fa-2x',state:"danger",size:"",disabled:false,onClick:function(){ 
																									console.log("botón clickado");
																										$scope.fields[28].loading=false;
																								   } 
					}, 
					{key: 'selectlocal',type: 'select',inputSize:"sm",loading:false,col:'col-md-4',required:true,label: 'Select datos locales',selecttypesource:'array',selectsource: $scope.municipios,groupBy:"value",
																																																				fieldListeners:{
																																																					onChange:function(value,item){
																																																						console.log("cambio selelct:"+value);
																																																						
																																																					}
																																																				},optionname:"name",optionvalue:"value",selectconcatvaluename:true,disabled:false,readonly:false},
					{key: 'selectremoto', type: 'select',col:'col-md-4',required:true,label: 'Select datos remotos',emptyOptionText:'Seleccione una opción',selecttypesource:'url',selectsource: 'api/v1/municipios',optionname:"name",optionvalue:"value",selectconcatvaluename:true},
					
					{key: 'CODIGO_TEMA',emptyOptionText:'Seleccione una opción',
						fieldListeners:{
							onChange:function(value,item){
								// There are a method 'clean' for empty select options.  Example:
								// $scope.fields[23].fieldControl.clean();
								console.log("cambio tema:"+value+ "   item:"+angular.toJson(item));
								$scope.fields[23].fieldControl.refresh("fieldFk=TEMA&valueFk="+value);
							}
						
						},
						type: 'select',col:'col-md-6',label: 'Tema',selecttypesource:'url', selectsource:'services/temasservice/temas?limit=100000&offset=0&order=asc&orderby=CODIGO' ,optionvalue:'CODIGO',optionname:'TEMA',selectconcatvaluename:false,placeholder: 'xxx',autofocus:false,required: false,disabled:false },						
					
					{key: 'CODIGO_SUBTEMA',type: 'select',autoload:false,col:'col-md-6',label: 'Subtema depende de tema',selecttypesource:'url', selectsource:'services/subtemasservice/subtemas?limit=100000&offset=0&order=asc&orderby=DESCRIPCION',optionvalue:'SUBTEMA',optionname:'DESCRIPCION',selectconcatvaluename:true,placeholder: '',autofocus:false,required: false,disabled:false },
											
					
					{key: 'areatexto',type: 'textarea',col:'col-md-4',rows: 5,label: 'Área de texto',placeholder: 'Área de texto',autofocus:false,required: true,minlength:5,maxlength:100,disabled:false,readonly:false	},
    	            
					{key: 'areatextoedit',type: 'textedit',col:'col-md-4',rows: 5,toolbar:[['bold','italics']],  label: 'Área de texto rico',placeholder: 'Área de texto rico',autofocus:'',required: true,disabled:false,readonly:false	}
    	                     
					
					
					];
					
					
										

}])

