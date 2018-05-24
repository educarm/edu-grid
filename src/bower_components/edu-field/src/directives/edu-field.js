'use strict';
/*eduFieldDirectives.directive('validDate', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, control) {
            control.$parsers.push(function (viewValue) {
                var newDate = model.$viewValue;
                control.$setValidity("invalidDate", true);  
                if (typeof newDate === "object" || newDate == "") return newDate;  // pass through if we clicked date from popup
                if (!newDate.match(/^\d{1,2}\/\d{1,2}\/((\d{2})|(\d{4}))$/))
                    control.$setValidity("invalidDate", false);
                return viewValue;
            });
        }
    };
})*/


eduFieldDirectives
 /**
 * Angularjs Module for pop up timepicker
 */
.factory('timepickerState', function() {
  var pickers = [];
  return {
		addPicker: function(picker) {
			pickers.push(picker);
		},
		closeAll: function() {
			for (var i=0; i<pickers.length; i++) {
				pickers[i].close();
			}
		}
	};
})
.directive("timeFormat", function($filter) {
  return {
    restrict : 'A',
    require : 'ngModel',
    scope : {
      showMeridian : '=',
    },
    link : function(scope, element, attrs, ngModel) {
        var parseTime = function(viewValue) {

        if (!viewValue) {
          ngModel.$setValidity('time', true);
          return null;
        } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
          ngModel.$setValidity('time', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var timeRegex = /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i;
          if (!scope.showMeridian) {
            timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          }
          if (!timeRegex.test(viewValue)) {
            ngModel.$setValidity('time', false);
            return undefined;
          } else {
            ngModel.$setValidity('time', true);
            var date = new Date();
            var sp = viewValue.split(":");
            var apm = sp[1].match(/[a|p]m/i);
            if (apm) {
              sp[1] = sp[1].replace(/[a|p]m/i, '');
              if (apm[0].toLowerCase() == 'pm') {
                sp[0] = sp[0] + 12;
              }
            }
            date.setHours(sp[0], sp[1]);
            return date;
          };
        } else {
          ngModel.$setValidity('time', false);
          return undefined;
        };
      };

      ngModel.$parsers.push(parseTime);

      var showTime = function(data) {
        parseTime(data);
        var timeFormat = (!scope.showMeridian) ? "HH:mm" : "hh:mm a";
        return $filter('date')(data, timeFormat);
      };
      ngModel.$formatters.push(showTime);
      scope.$watch('showMeridian', function(value) {
        var myTime = ngModel.$modelValue;
        if (myTime) {
          element.val(showTime(myTime));
        }

      });
    }
  };
})

.directive('timepickerPop', function($document, timepickerState) {
      return {
        restrict : 'E',
        transclude : false,
        scope : {
          inputTime : "=",
          showMeridian : "=",
          disabled : "="
        },
        controller : function($scope, $element) {
          $scope.isOpen = false;
          
          $scope.disabledInt = angular.isUndefined($scope.disabled)? false : $scope.disabled;

          $scope.toggle = function() {
        	if ($scope.isOpen) {
        		$scope.close();
        	} else {
        		$scope.open();
        	}
          };
        },
        link : function(scope, element, attrs) {
          var picker = {
        		  open : function () {
        			  timepickerState.closeAll();
        			  scope.isOpen = true;
        		  },
        		  close: function () {
        			  scope.isOpen = false;
        		  }
          		  
          }
          timepickerState.addPicker(picker);
          
          scope.open = picker.open;
          scope.close = picker.close;
          
          scope.$watch("disabled", function(value) {
            scope.disabledInt = angular.isUndefined(scope.disabled)? false : scope.disabled;
          });
          
          scope.$watch("inputTime", function(value) {
            if (!scope.inputTime) {
              element.addClass('has-error');
            } else {
              element.removeClass('has-error');
            }

          });

          element.bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
          });

          $document.bind('click', function(event) {
            scope.$apply(function() {
           		scope.isOpen = false;
            });
          });

        },
        template : "<input type='text' class='form-control' ng-model='inputTime' ng-disabled='disabledInt' time-format show-meridian='showMeridian' ng-focus='open()' />"
            + "  <div class='input-group-btn' ng-class='{open:isOpen}'> "
            + "    <button type='button' ng-disabled='disabledInt' class='btn btn-default ' ng-class=\"{'btn-primary':isOpen}\" data-toggle='dropdown' ng-click='toggle()'> "
            + "        <i class='glyphicon glyphicon-time'></i></button> "
            + "          <div class='dropdown-menu pull-right'> "
            + "            <timepicker ng-model='inputTime' show-meridian='showMeridian'></timepicker> "
            + "           </div> " + "  </div>"
      };
});



eduFieldDirectives.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
		  if(attrs.capitalize=='true'){
			var capitalize = function(inputValue) {
			  if (inputValue == undefined) inputValue = '';
			  var capitalized = inputValue.toUpperCase();
			  if (capitalized !== inputValue) {
				// see where the cursor is before the update so that we can set it back
				var selection = element[0].selectionStart;
				modelCtrl.$setViewValue(capitalized);
				modelCtrl.$render();
				// set back the cursor after rendering
				element[0].selectionStart = selection;
				element[0].selectionEnd = selection;
			  }
			  return capitalized;
			}
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		  }
      }
    };
});

eduFieldDirectives.factory('dataFactoryField', [ '$resource', function ( $resource) {
    return function (uri,actions) {
	    var defActions={
						getAll: {method:'GET', params:{}, withCredentials: true, isArray:true},
						getCount: {method:'GET', url: uri + '/count', params:{}, withCredentials: true, isArray:false},
						get: {method:'GET', params:{}, withCredentials: true, isArray:false},
						insert: {method:'POST', params:{}, withCredentials: true, isArray:false},
						update: {method:'PUT', params:{}, withCredentials: true, isArray:false},
						remove: {method:'DELETE', params:{}, withCredentials: true, isArray:false}
						
		};
		
		if (typeof actions!=='undefined' && actions!==''){
			for(keyAction in actions){
				for(keyDefAction in defActions){
					if(keyAction==keyDefAction){
						defActions[keyDefAction]=actions[keyAction];
					}
				}
			}
		}
    	return $resource(	uri ,
							{},
							defActions
		);        
    };
}]);

eduFieldDirectives.directive('eduFocus', function($timeout) {
    return {
        link: function ( scope, element, attrs ) {
            scope.$watch( attrs.eduFocus, function ( val ) {
                if ( angular.isDefined( val ) && val ) {
                    $timeout( function () { element[0].focus(); } );
                }
            }, true);

            element.bind('blur', function () {
                if ( angular.isDefined( attrs.ngFocusLost ) ) {
                    scope.$apply( attrs.ngFocusLost );

                }
            });
        }
    };
});

eduFieldDirectives.directive('datepickerLocaldate', ['$parse', function ($parse) {
    var directive = {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
        var ngModelController = ctrls[0];

        // called with a JavaScript Date object when picked from the datepicker
        ngModelController.$parsers.push(function (viewValue) {
            // undo the timezone adjustment we did during the formatting----
			if(viewValue!=null){
				var minutes=viewValue.getMinutes();
				if(typeof(minutes)!='undefined'){
					viewValue.setMinutes(minutes - viewValue.getTimezoneOffset());
				}
				// we just want a local date in ISO format
				return viewValue.toISOString().substring(0, 10);
			}else{
				return viewValue;
			}
        });
    }
}]);

eduFieldDirectives.directive("validateIban",function($compile){
		return {
			restrict:"A",
			require: 'ngModel',
			//priority:1000,
			link: function(scope, elm, attrs, ctrl) {
				function myValidation(value) {
					/*if (value.indexOf("e") > -1) {
					  ctrl.$setValidity('charE', true);
					} else {
					  ctrl.$setValidity('charE', false);
					}*/
					
					//---------------------------------------
					var prefId=attrs.id.substring(0,attrs.id.indexOf("-"));
				  
				  var pais=angular.element("input#"+prefId+"-pais");
				  var entidad=angular.element("input#"+prefId+"-entidad");
				  var oficina=angular.element("input#"+prefId+"-oficina");
				  var control2=angular.element("input#"+prefId+"-control2");
				  var cuenta=angular.element("input#"+prefId+"-cuenta");
				  
				  var iban=pais.val()+entidad.val()+oficina.val()+control2.val()+cuenta.val();
				  
				  
				  var valid=false;
				  
				  if(!pais.attr('class') && !entidad.attr('class') && !oficina.attr('class') && !control2.attr('class') && !cuenta.attr('class')){
					valid=true;  
				  } 
				
				  
				  
				  if(attrs.name==pais.attr("name")){
					
					if(pais.val().length==pais.attr("maxlength")){
						valid=true;
						entidad.focus();
					}
				  }else if(attrs.name==entidad.attr("name")){
					
					if(entidad.val().length==entidad.attr("maxlength")){
						valid=true;
						oficina.focus();
					}
					  
				  }else if(attrs.name==oficina.attr("name")){
					
					if(oficina.val().length==oficina.attr("maxlength")){
						valid=true;
						control2.focus();
					}
					  
				  }else if(attrs.name==control2.attr("name")){
					if(control2.val().length==control2.attr("maxlength")){
						valid=true;
						cuenta.focus();
					}
					
					  
				  }else if(attrs.name==cuenta.attr("name")){
					  
					  //if(cuenta.val().length==cuenta.attr("maxlength")){
						 valid=IBAN.isValid(iban);
						 ctrl.$setValidity('validateIban', valid);
						 return iban;
					  //}
				  }
					
				  
					
					
					return value;
				}
				ctrl.$parsers.push(myValidation);
				
			
			}
		};
	});

eduFieldDirectives.directive("dynamicName",function($compile){
    return {
        restrict:"A",
        terminal:true,
        priority:1000,
        link:function(scope,element,attrs){
            element.attr('name', scope.$eval(attrs.dynamicName));
            element.removeAttr("dynamic-name");
            $compile(element)(scope);
        }
    };
});
eduFieldDirectives.directive(
        'dateInput',
        function(dateFilter) {
            return {
                require: 'ngModel',
                template: '<input type="date" ></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        return dateFilter(modelValue, 'yyyy-MM-dd');
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return new Date(viewValue);
                    });
                },
            };
    });
	
	eduFieldDirectives.directive(
        'replaceBlank',
        function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
						if(typeof(modelValue)!='undefined'){
							return modelValue.replace(new RegExp(' ', 'g'), 'aeiou');
						}else{
							return modelValue
						}
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
						if(typeof(viewValue)!='undefined'){
							return viewValue.replace(new RegExp('aeiou', 'g'), ' ');
						}else{
							return viewValue
						}
                    });
                },
            };
    });
	eduFieldDirectives.directive(
        'dateTimeInput',
        function(dateFilter) {
            return {
                require: 'ngModel',
                template: '<input type="datetime-local"></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        return dateFilter(modelValue, 'yyyy-MM-ddTHH:mm');
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return new Date(viewValue);
                    });
                },
            };
    });
    
	eduFieldDirectives
	 .filter('toEuros', function() {
	  return function(input,fractionDigit) {
		var fractD=fractionDigit?fractionDigit:2;
		var amount= Number(input).toLocaleString("es-ES", {minimumFractionDigits: fractD}) + ' €';
		if(amount=='0,00 €' || amount=='NaN €'){
		//if(amount=='NaN €'){
			return; 
		}else{
			return amount;
		}  
		
	  };
	});
	
	eduFieldDirectives.directive('currency', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
				
				if(ctrl.$modelValue){
					return $filter('toEuros')(ctrl.$modelValue.toString().replace(',','.'));
				}else{
					return $filter('toEuros')('');
				}
				
            });
			
			elem.bind('keydown', function(event) {
				
				if (event.which==188 || event.keyCode==188 ){
					return false;
				}
				
			});	

            elem.bind('blur', function(event) {
				var arrPartsNumber;
				// La primera vez que se introduce un valor en el input no puede contener coma porque el evento 'keydown' no lo permite.
				
				
				// si lleva coma es porque ya ha sido procesada la entrada por el input currency y entonces puede llevar también puntos de miles.
				// Por eso quitamos todos los puntos y el simbolo del euro
				if(elem.val().indexOf(',')>=0){
					var pureNumber=elem.val().replace('€','').replace(/\./g, '');
					var arrPartsNumber=pureNumber.split(',');
				}
				// si no lleva coma es porque la entrada es nueva  y no ha sido procesado por el input currency.
				// Puede llevar puntos
				else{ 
					var pureNumber=elem.val().replace('€','');
					var arrPartsNumber=pureNumber.split('.');
				}
				
				elem.val($filter('toEuros')(arrPartsNumber.join('.')));
				
				//var partEntera='';
				//var partDecimal='';
				
				//if(arrPartsNumber[0] && arrPartsNumber[1]){
					//partEntera=arrPartsNumber[0];
					//elem.val($filter('toEuros')(partEntera+'.'+partDecimal));
				//}
				
				//if(arrPartsNumber[1]){
					//partDecimal=arrPartsNumber[1];
				//}
				
                // var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '').replace('€','');
			    //var plainPartEntera=partEntera.replace(/[^\d|\-+|\.+]/g, '');
				//var plainPartDecimal=partDecimal.replace(/[^\d|\-+|\.+]/g, '');
			    //elem.val($filter('toEuros')(partEntera+'.'+partDecimal));
            });
        }
    };
}]);


eduFieldDirectives.directive('eduField', function formField($http, $compile, $templateCache,$timeout) {

	var getTemplateUrl = function(type) {
		var templateUrl = '';

		switch(type) {
			case 'tritoggle':
				templateUrl = 'directives/edu-field-tritoggle-tpl.html';
				break;
			case 'image':
				templateUrl = 'directives/edu-field-image-tpl.html';
				break;
		    case 'textbutton':
				templateUrl = 'directives/edu-field-textbutton-tpl.html';
				break;
			case 'button':
				templateUrl = 'directives/edu-field-button-tpl.html';
				break;
			case 'currency':
				templateUrl = 'directives/edu-field-currency-tpl.html';
				break;
			case 'hidden':
				templateUrl = 'directives/edu-field-hidden-tpl.html';
				break;
			case 'literal':
				templateUrl = 'directives/edu-field-literal-tpl.html';
				break;
			case 'upload':
				templateUrl = 'directives/edu-field-upload-tpl.html';
				break;
			case 'upload15x':
				templateUrl = 'directives/edu-field-upload15x-tpl.html';
				break;
		    case 'nifniecif':
				templateUrl = 'directives/edu-field-nifniecif-tpl.html';
				break;
			case 'grid':
				templateUrl = 'directives/edu-field-grid-tpl.html';
				break;
			case 'iban':
				templateUrl = 'directives/edu-field-iban-tpl.html';
				break;
			case 'iban2':
				templateUrl = 'directives/edu-field-iban2-tpl.html';
				break;
			case 'autocomplete':
				templateUrl = 'directives/edu-field-autocomplete-tpl.html';
				break;
			case 'range':
				templateUrl = 'directives/edu-field-range-tpl.html';
				break;
			case 'textedit':
				templateUrl = 'directives/edu-field-textedit-tpl.html';
				break;
			case 'url':
				templateUrl = 'directives/edu-field-url-tpl.html';
				break;
			case 'time':
				templateUrl = 'directives/edu-field-time-tpl.html';
				break;
			case 'week':
				templateUrl = 'directives/edu-field-week-tpl.html';
				break;
			case 'month':
				templateUrl = 'directives/edu-field-month-tpl.html';
				break;
			case 'date<13':
				templateUrl = 'directives/edu-field-date-tpl.html';
				break;
			case 'date':
				templateUrl = 'directives/edu-field-date-ag-ui-tpl.html';
				break;
			case 'date-time':
				templateUrl = 'directives/edu-field-date-time-tpl.html';
				break;
			case 'textarea':
				templateUrl = 'directives/edu-field-textarea-tpl.html';
				break;
			case 'radio':
				templateUrl = 'directives/edu-field-radio-tpl.html';
				break;
			case 'select':
				templateUrl = 'directives/edu-field-select-tpl.html';
				break;
			case 'number':
				templateUrl = 'directives/edu-field-number-tpl.html';
				break;
			case 'checkbox':
				templateUrl = 'directives/edu-field-checkbox-tpl.html';
				break;
			case 'password' :
				templateUrl = 'directives/edu-field-password-tpl.html';
				break;
			case 'hidden' :
				templateUrl = 'directives/edu-field-hidden-tpl.html';
				break;
			case 'email':
				templateUrl = 'directives/edu-field-email-tpl.html';
				break;
			case 'text':
				templateUrl = 'directives/edu-field-text-tpl.html';
				break;
			default :
				templateUrl = null;
				break;
		}

		return templateUrl;
	};
	var getStringPattern = function(type) {
		var stringPattern = '';

		switch(type) {
			case 'image':
		    case 'textbutton':
			case 'button':
				stringPattern = '';
				break;
			case 'currency':
				stringPattern = '';
				break;
			case 'hidden':
				stringPattern = '';
				break;
			case 'literal':
				stringPattern = '';
				break;
			case 'upload':
				stringPattern = '';
				break;
			case 'upload15x':
				stringPattern = '';
				break;
		    case 'nifniecif':
				stringPattern = '';
				break;
			case 'grid':
				stringPattern = '';
				break;
			case 'iban':
				stringPattern = '';
				break;
			case 'autocomplete':
				stringPattern = '';
				break;
			case 'range':
				stringPattern = '';
				break;
			case 'textedit':
				stringPattern = '';
				break;
			case 'url':
				stringPattern = '';
				break;
			case 'time':
				stringPattern = '';
				break;
			case 'week':
				stringPattern = '';
				break;
			case 'month':
				stringPattern = '^(19|20)\d\d[- \/](0[1-9]|1[012])$';
				break;
			case 'date<13':
				stringPattern = '';
				break;
			case 'date':
				stringPattern = '';
				break;
			case 'date-time':
				stringPattern = '';
				break;
			case 'textarea':
				stringPattern = '';
				break;
			case 'radio':
				stringPattern = '';
				break;
			case 'select':
				stringPattern = '';
				break;
			case 'number':
				stringPattern = '^-?[0-9]+$';
				break;
			case 'checkbox':
				stringPattern = '';
				break;
			case 'password' :
				stringPattern = '';
				break;
			case 'hidden' :
				stringPattern = '';
				break;
			case 'email':
				stringPattern = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|es|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b$";
				break;
			case 'text':
				stringPattern = '';
				break;
			default :
				stringPattern = '';
				break;
		}

		return stringPattern;
	};
	return {
		restrict: 'AE',
		transclude: true,
		scope: {
			options: '=options',
			value:'=value'
		},
		
		
		// -------------------------------------------------- //
        //        LINK
        // -------------------------------------------------- //
		
		
		link: function fieldLink($scope, $element, $attr) {
			
			
			
			if (!$scope.hasOwnProperty('options')) {
				throw new Error('options are required!');
            }
			
			
		    // load the correct template
			var templateUrl = $scope.options.templateUrl || getTemplateUrl($scope.options.type);
			
			if (templateUrl) {
				$http.get(templateUrl, {
					cache: $templateCache
				}).success(function(data) {
					$element.html(data);
					$compile($element.contents())($scope);					
				});
			} else {
				console.log('eduField Error: plantilla tipo \'' + $scope.options.type + '\' no soportada.');
			}
			
            // validate field
            $scope.$dirty=false;
			$scope.$invalid=false;
			$scope.$invalidRequired=false;
			$scope.$invalidPattern=false;
			$scope.$invalidMinlength=false;
			$scope.$invalidMaxlength=false;
			$scope.$invalidMin=false;
			$scope.$invalidMax=false;
			
			if($scope.options.type=='grid'){
				//height scrollable-table
				$timeout(function () {
					$("#input-grid-"+ $scope.options.key +" .scrollableContainer").css("height",$scope.options.height+'px');
				});
				
		    }
			
			// ---
			// CALLBACKS
			// ---
			$scope.onClick=function() {
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onClick == 'function'){
					$scope.options.fieldListeners.onClick($scope.value);
				}
			}
			
			$scope.onChange=function(subitem) {
				
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChange == 'function'){
					var item={};
					var value="";
					if($scope.options.type=='select'){
						for(var i=0;i<$scope.optionsSelect.length;i++){
							if($scope.optionsSelect[i][$scope.options.optionvalue]==$scope.value){
								item=$scope.optionsSelect[i];
								value=$scope.value;
								break;
							}
						}
					}else if($scope.options.type=='iban2'){
						value=$scope.value[subitem];
						item=subitem;
						
					}else if($scope.options.type=='autocomplete'){
						value=$scope.value;
						item=subitem;
					
				    }else{
						value=$scope.value;	
				    }
					
					$scope.options.fieldListeners.onChange(value,item,$scope.options.showPopupCalendar);
				}
			}
			
			$scope.onKeypress=function($event) {
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onKeypress == 'function'){
					$scope.options.fieldListeners.onKeypress($event);
				}
			}
			
			$scope.onInit=function() {
				 var callInit=function(){
							    	$scope.options.fieldListeners.onInit($scope.value);
									$scope.$apply() ;
							}
								
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onInit == 'function'){
					$timeout(callInit,2000);
				}
			}
			
			$scope.onFocus=function(subitem) {
				var item="";
				var value="";
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onFocus == 'function'){
					if($scope.options.type=='iban'){
						value=($scope.value)?$scope.value[subitem]:'';
						item=subitem;
					}else{
						value=$scope.value;
						
					}
					$scope.options.fieldListeners.onFocus(value,item);
				}
			}
			
			$scope.onBlur=function(subitem) {
				var item="";
				var value="";
				var elementClass=$element.find("[id^='"+$scope.id+"']").attr('class');
				$element.find("[id^='"+$scope.id+"']").attr('blur',true);
				if(typeof elementClass!=="undefined"){
				    var aClass=elementClass.split(" ");
					for(var i=0;i<aClass.length;i++){
						if(aClass[i]==="ng-dirty"){ $scope.$dirty=true;}
						else if(aClass[i]=="ng-invalid"){ $scope.$invalid=true;}
						else if(aClass[i]=="ng-invalid-required"){ $scope.$invalidRequired=true; }
						else if(aClass[i]=="ng-invalid-pattern"){ $scope.$invalidPattern=true;}
						else if(aClass[i]=="ng-invalid-minlength"){ $scope.$invalidMinlength=true;}
						else if(aClass[i]=="ng-invalid-maxlength"){ $scope.$invalidMaxlength=true;}
						else if(aClass[i]=="ng-invalid-min"){ $scope.$invalidMin=true;}
						else if(aClass[i]=="ng-invalid-max"){ $scope.$invalidMax=true;}
						
						else if(aClass[i]=="ng-valid"){ $scope.$invalid=false;}
						else if(aClass[i]=="ng-valid-required"){ $scope.$invalidRequired=false;}
						else if(aClass[i]=="ng-valid-pattern"){ $scope.$invalidPattern=false;}
						else if(aClass[i]=="ng-valid-minlength"){ $scope.$invalidMinlength=false;}
						else if(aClass[i]=="ng-valid-maxlength"){ $scope.$invalidMaxlength=false;}
					}
				}
				
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onBlur == 'function'){
					if($scope.options.type=='iban'){
						value=($scope.value)?$scope.value[subitem]:'';
						item=subitem;
					}else{
						value=($scope.value)?$scope.value:'';
					}
					
					$scope.options.fieldListeners.onBlur(value,$scope.options.showPopupCalendar);
				}
				
			}	
		},
		
		
		
		// -------------------------------------------------- //
        //        CONTROLLER
        // -------------------------------------------------- //
		
		
		
		controller: function fieldController($scope,$http, Upload,FileUploader,dataFactoryField) {
			
			// component control
			$scope.options.fieldControl={};
		   
		    $scope.internalControl = $scope.options.fieldControl || {};
			
			// ---
			// METHODS
			// ---  
			$scope.internalControl.upload = function(idxFile) {
				console.log("llamada a file upload file:"+idxFile);
				if($scope.options.type=="upload"){
					$scope.uploader.queue[idxFile-1].upload();
				}
				if($scope.options.type=="upload15x"){
					$scope.ngfupload();
				}
			}
			$scope.internalControl.filesInQueue = function() {
				
				if($scope.options.type=="upload"){
					return $scope.uploader.queue.length;
				}else{
					return 0;
				}
			}
			
			$scope.internalControl.clearQueue = function() {
				
				if($scope.options.type=="upload"){
					return $scope.uploader.clearQueue();
				}else{
					return 0;
				}
			}
			
			
			$scope.internalControl.refresh = function(value) {
				if($scope.options.type=="select"){
					$scope.refreshSelect(value);
				}
				if($scope.options.type=="grid"){
					if(value){
						$scope.options.valueFk=value;
					}
					$scope.refreshGrid();
				}
			}
			
			$scope.internalControl.clean = function(value) {
				if($scope.options.type=="select"){
					$scope.optionsSelect=[];
				}
			}
			
			if (!$scope.options.hasOwnProperty('loadOnInit')&&$scope.options.type=='select'){
				$scope.options.loadOnInit=true;
			}
			
			//apply pattern to types. For fix change to 1.5.x
			$scope.pattern_validator = (function() {
				var regexp = '';
				if($scope.options.hasOwnProperty("pattern")){
					regexp=$scope.options.pattern;
					if(regexp.substr(0,1)=='/'){
						regexp=regexp.substr(1);
					}
					if(regexp.substr(regexp.length-1,1)=='/'){
						regexp=regexp.substr(0,regexp.length-1);
					}
					
				}else{
					regexp=getStringPattern($scope.options.type);
				}
				return regexp;
			})();
			
			
			
			
			$scope.onChange=function(subitem) {
				
				
				if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChange == 'function'){
					var item={};
					var value="";
					
					
					
					
					if($scope.options.type=='select'){
						for(var i=0;i<$scope.optionsSelect.length;i++){
							if($scope.optionsSelect[i][$scope.options.optionvalue]==$scope.value){
								item=$scope.optionsSelect[i];
								value=$scope.value;
								break;
							}
						}
					}else if($scope.options.type=='iban2'){
						value=$scope.value[subitem];
						item=subitem;
						
					}else if($scope.options.type=='autocomplete'){
						value=$scope.value;
						item=subitem;
					    console.log('onChange()- edu-field.js -- subitem:'+subitem);
					
				    }
					$scope.options.fieldListeners.onChange(value,item);
				}
			}
			
			// ----------------------------------------------------------//
			// CONTROL TYPE= checkbox
		    // ----------------------------------------------------------//
			if($scope.options.type=='checkbox'){
				if(!$scope.options.false_value){
					$scope.options.false_value="'N'";
				}
				if(!$scope.options.true_value){
					$scope.options.true_value="'S'";
				}
			}
			
			//-----------------------------------------------------------//
			// CONTROL TYPE= grid
			//-----------------------------------------------------------//
			if($scope.options.type=='grid'){
				$scope.options.state='list';
				function configField(){
					$scope.field=null;
					for(var k=0,field;field=$scope.options.listFields[k];k++){
						$scope.field=field;
						//for transform content input before render
						for (var property in field) {
							if (typeof field.renderer !== 'function') {
								field.orderByValue = field.column;
								field.renderer = function (input, row, column,type) {
									return input;
								};
							}
						}
							
						// if item in listField is checkbox, by default, false and true value are 'N' and 'S'
						if(field.type=='checkbox'){
							if(!field.false_value){
								field.false_value="'N'";
							}
							if(!field.true_value){
								field.true_value="'S'";
							}
						}
						
						if(field.type=='select'){
							if(field.selecttypesource=='url'){
								if(field.hasOwnProperty('selectsource') && field.selectsource!=''){
								//****************************************************************************
									$http.get(field.selectsource).success(function (data, status, headers, config) {
										$scope.field.selectOptions = data;
										
										//for each option, adjust properties value an name
										for (var i = 0,option; option=$scope.field.selectOptions[i]; i++) {
													  
											if (!option.hasOwnProperty('value')) {
												option.value= option[$scope.field.optionvalue];
											}
											
											if (!option.hasOwnProperty('name')) {
												if ($scope.field.selectconcatvaluename) {
													option.name = option[$scope.field.optionvalue] + ' - ' + option[$scope.field.optionname];
												} else {
													option.name = option[$scope.field.optionname];
												}
												
											} else {
												if ($scope.field.selectconcatvaluename) {
													option.name = option['value'] + ' - ' + option['name'];
												} else {
													option.name = option[$scope.field.optionname];
												}
											}
										}
										
										//guarda la descripción de la opción del select correspondiente con el código en select.option.value
										//para poder mostarla cuando la fila esté en edición
										if($scope.gridRows){
											for(var i=0,row;row=$scope.gridRows[i];i++){
												row.$optionSelectedName={};
												for(var key in row){
													if(key==$scope.field.column){
														row.$optionSelectedName[key]=_.find($scope.field.selectOptions,{'value':row[key]}).name;
													}
													
												}
												
											}
										}
										
									}).error(function (data, status, headers, config) {
										  console.log("Error getting options select:" + data);
									}); 


								//****************************************************************************
								}
							}
						}	
						
					}
				}
				
				
				
				var apiField=null;
				
            	if( typeof $scope.options.uri!=='undefined' && $scope.options.uri!==''){
					apiField=dataFactoryField($scope.options.uri,(typeof $scope.options.actions!=='undefined'?$scope.options.actions:''));
            	};
				
				$scope.refreshGrid=function(){
					//get all element with foreing key like  fieldFk
					$scope.options.loading=true;
					
					var filterFK='';
					var oParamGrid={};
					if($scope.options.valueFk!=''){
						if($scope.options.hasOwnProperty("fieldFk") && typeof $scope.options.fieldFk!=undefined && $scope.options.hasOwnProperty("valueFk") && typeof $scope.options.valueFk!=undefined){
							filterFK= '[' + $scope.options.fieldFk + ']=' + $scope.options.valueFk;
							oParamGrid.filter=filterFK;
						}
								
						apiField.getAll(oParamGrid,function (data) {  
							$scope.options.loading=false;
							$scope.gridRows=data
							
							configField();
							
						},function(data){
							$scope.options.loading=false;
							$scope.internalControl.showOverlayFormSuccessError('0',data.data,20005);
						});
					}
				}
				
			
				
				// get one element for edit
				$scope.gridEdit=function(item){
					var dataCopy={};
					angular.copy(item,dataCopy);
					item.$dataCopy=dataCopy;
					
					item.$visible=true;
					item.$inserted=false;
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChangeState == 'function'){
						$scope.options.fieldListeners.onChangeState($scope.options.state,'edit');
						$scope.options.state='edit';
					}else{
						$scope.options.state='edit';
					}
				}	
				
				// button grid cancel
				$scope.gridCancel=function(item){
					angular.extend(item, item.$dataCopy)
					item.$visible=false;
					item.$inserted=false;
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChangeState == 'function'){
						$scope.options.fieldListeners.onChangeState($scope.options.state,'list');
						$scope.options.state='list';
					}else{
						$scope.options.state='list';
					}
				}
				
				// button grid delete
				$scope.gridDelete=function(item,index){
					$scope.options.showOverlayInputGridFormDelete=true;
					$scope.itemForDelete={item:item,index:index};
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChangeState == 'function'){
						$scope.options.fieldListeners.onChangeState($scope.options.state,'list');
						$scope.options.state='list';
					}else{
						$scope.options.state='list';
					}
				}
				
				// button grid add new
				$scope.gridNew=function(){
					var newItem={};
					for( var i=0; i<$scope.options.listFields.length;i++){
						newItem[$scope.options.listFields[i].column]='';
					}
					$scope.gridRows.unshift(newItem);
					
					newItem.$visible=true;
					newItem.$inserted=true;
					
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChangeState == 'function'){
						$scope.options.fieldListeners.onChangeState($scope.options.state,'new');
						$scope.options.state='new';
					}else{
						$scope.options.state='new';
					}
					
				}
				
				// button grid save
				$scope.gridSave=function(item){
					console.log('gridLocalSave: '+angular.toJson(item));
					var dataTemp={};
					angular.copy(item,dataTemp);
					delete dataTemp.$optionSelectedName;
					delete dataTemp.$dataCopy;
					delete dataTemp.$visible;
					delete dataTemp.$inserted;
					
					if(item.$inserted){
						dataTemp[$scope.options.fieldFk]=$scope.options.valueFk;
						apiField.insert(dataTemp,function (data) { 
                            item.$visible=false;
							if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onSaveSuccess == 'function'){
								$scope.options.fieldListeners.onSaveSuccess(data);
							}
							if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChangeState == 'function'){
								$scope.options.fieldListeners.onChangeState($scope.options.state,'list');
								$scope.options.state='list';
							}else{
								$scope.options.state='list';
							}
							$scope.refreshGrid();		
            	        },function(data){
						   //$scope.internalControl.showOverlayFormSuccessError('0',data.data,20005);
						});
					}else{
						var oId = getOid(dataTemp);
						
						apiField.update(oId,dataTemp,function (data) {  
                            item.$visible=false;
							if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onUpdateSuccess == 'function'){
								$scope.options.fieldListeners.onUpdateSuccess(data);
							}
							if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onChangeState == 'function'){
								$scope.options.fieldListeners.onChangeState($scope.options.state,'list');
								$scope.options.state='list';
							}else{
								$scope.options.state='list';
							}
            	        },function(data){
							//$scope.internalControl.showOverlayFormSuccessError('0',data.data,20005);
						});
					}
					
				}
				
				$scope.inputGridFormDeleteContinue=function(){
					
					
					var oId={};
					oId.id=$scope.itemForDelete.item[$scope.options.fieldKey];
					
					apiField.delete(oId,function (data) { 
                            $scope.gridRows.splice($scope.itemForDelete.index, 1);
					},function(data){
					  // $scope.internalControl.showOverlayFormSuccessError('0',data.data,20005);
					});
					
					$scope.options.showOverlayInputGridFormDelete=false;
				}
				
				$scope.inputGridFormDeleteCancel=function(){
					$scope.options.showOverlayInputGridFormDelete=false;
				}
		    
				function getOid(row){
					var vid=row[$scope.options.fieldKey];
					var oId={};
					oId['id']=vid;
			   
					return oId;
				}
				
				
			}
			
			
			
			//Especific validator
			
			// ----------------------------------------------------------//
			// CONTROL TYPE= date
		    // ----------------------------------------------------------//
			if($scope.options.type=='date'){
				$scope.options.dateOptions= {
										"startingDay": 1,
										"showWeeks":false
									};
									
			    $scope.internalControl.showCalendar = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					$scope.options.showPopupCalendar=true;
				};
			}
			
			// ----------------------------------------------------------//
			// CONTROL TYPE= iban
		    // ----------------------------------------------------------//
			$scope.ibanValidator = (function() {
				return {
					test: function(value) {
						return IBAN.isValid(value)
					}
				};
			})();
			
			// ----------------------------------------------------------//
			// CONTROL TYPE= nif nie cif
		    // ----------------------------------------------------------//
		    $scope.nifniecifValidator = (function() {
				return {
					test: function(value) {
						var sValid=valida_nif_cif_nie(value)
						if(sValid>0) return true;
						else 
						  return false
					}
				};
			})();

			// ---
			// CONTROL TYPE= ss
		    // ---
			$scope.ssValidator = (function() {
				return {
					test: function(value) {
						var sValid=ss(value)
						if(sValid>=0) return true;
						else 
						  return false
					}
				};
			})();
			
			
			// ---
			// CONTROL TYPE= uploader15x -- plugin ng-file-upload
		    // ---
			$scope.ngfselect=function(file){
				if(file){
					$scope.value=file.$ngfName || file.name;
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onAfterAddingFile == 'function'){
						$scope.options.fieldListeners.onAfterAddingFile(file);
					}
				}
			}
			$scope.uploading=false;
			$scope.ngfupload=function(){
				$scope.uploading=true;
				if($scope.file){
					Upload.upload({
						url: $scope.options.url,
						data: {file: $scope.file}
					}).then(function (resp) {
						$scope.uploading=false;
						if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onSuccessItem == 'function'){
							$scope.options.fieldListeners.onSuccessItem(resp.config.data.file,resp);
						}
					}, function (resp) {
						$scope.uploading=false;
						if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onErrorItem == 'function'){
							$scope.options.fieldListeners.onErrorItem(resp.status);
						}
					}, function (evt) {
						$scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onProgressItem == 'function'){
							$scope.options.fieldListeners.onProgressItem($scope.progressPercentage,evt.config.data.file.name);
						}
					});
				}
			}
			// ---
			// CONTROL TYPE= grid
		    // ---
			 if ($scope.options.type == 'grid') {
				if ($scope.options.selecttypesource == 'url' && (typeof $scope.options.autoload == 'undefined' || $scope.options.autoload == true)) {
					var sUrl = $scope.options.selectsource;
					if ($scope.options.loadOnInit) {
						$http.get(sUrl).success(function (data, status, headers, config) {
						  $scope.optionsSelect = data;
						});
					}
				}
			 }
			
			// ---
			// CONTROL TYPE= uploader
		    // ---

			    // create a uploader with options
			    var uploader = $scope.uploader = new FileUploader({
					url: $scope.options.url
				});

				// FILTERS

				uploader.filters.push({
					name: 'customFilter',
					fn: function(item /*{File|FileLikeObject}*/, options) {
						return this.queue.length < 10;
					}
				});

				// CALLBACKS

				uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onWhenAddingFileFailed == 'function'){
						$scope.options.fieldListeners.onWhenAddingFileFailed(item, filter, options);
					}
				};
				uploader.onAfterAddingFile = function(fileItem) {
					$scope.value=uploader.queue[0]._file.name
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onAfterAddingFile == 'function'){
						$scope.options.fieldListeners.onAfterAddingFile(fileItem);
					}
				};
				uploader.onAfterAddingAll = function(addedFileItems) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onAfterAddingAll == 'function'){
						$scope.options.fieldListeners.onAfterAddingAll(addedFileItems);
					}
				};
				uploader.onBeforeUploadItem = function(item) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onBeforeUploadItem == 'function'){
						$scope.options.fieldListeners.onBeforeUploadItem(item);
					}
				};
				uploader.onProgressItem = function(fileItem, progress) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onProgressItem == 'function'){
						$scope.options.fieldListeners.onProgressItem( fileItem, progress);
					}
				};
				uploader.onProgressAll = function(progress) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onProgressAll == 'function'){
						$scope.options.fieldListeners.onProgressAll( progress);
					}
				};
				uploader.onSuccessItem = function(fileItem, response, status, headers) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onSuccessItem == 'function'){
						$scope.options.fieldListeners.onSuccessItem(fileItem, response, status, headers);
					}
				};
				uploader.onErrorItem = function(fileItem, response, status, headers) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onErrorItem == 'function'){
						$scope.options.fieldListeners.onErrorItem(fileItem, response, status, headers);
					}
				};
				uploader.onCancelItem = function(fileItem, response, status, headers) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onCancelItem == 'function'){
						$scope.options.fieldListeners.onCancelItem(fileItem, response, status, headers);
					}
				};
				uploader.onCompleteItem = function(fileItem, response, status, headers) {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onCompleteItem == 'function'){
						$scope.options.fieldListeners.onCompleteItem(fileItem, response, status, headers);
					}
				};
				uploader.onCompleteAll = function() {
					if ($scope.options.hasOwnProperty('fieldListeners') && typeof $scope.options.fieldListeners.onCompleteAll == 'function'){
						$scope.options.fieldListeners.onCompleteAll();
					}
				};

			
			// ---
			// CONTROL TYPE= SELECT
		    // ---
		$scope.refreshSelect = function (value) {
            if ($scope.options.selecttypesource == 'url' && true) {
              var sUrl = $scope.options.selectsource;
              if (typeof value != 'undefined') {
                sUrl = sUrl + '&' + value;
              }
              $scope.options.loading=true;
              $http.get(sUrl).success(function (data, status, headers, config) {
                $scope.optionsSelect = data;
                for (var i = 0; i < $scope.optionsSelect.length; i++) {
				 			  
					if (!$scope.optionsSelect[i].hasOwnProperty('value')) {
						var val= $scope.optionsSelect[i][$scope.options.optionvalue];
						//if(typeof(val)=='string'){
						//	$scope.optionsSelect[i].value=val.replace(new RegExp(' ', 'g'), 'aeiou');
						//}else{
							$scope.optionsSelect[i].value=val;
						//}
						//$scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue].replace(' ','|');
					}
                  if (!$scope.optionsSelect[i].hasOwnProperty('name')) {
                    if ($scope.options.selectconcatvaluename) {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + ' - ' + $scope.optionsSelect[i][$scope.options.optionname];
                    } else {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                    }
                    //delete $scope.optionsSelect[i][$scope.options.optionname];
                    //delete $scope.optionsSelect[i][$scope.options.optionvalue];
                  } else {
                    if ($scope.options.selectconcatvaluename) {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i]['value'] + ' - ' + $scope.optionsSelect[i]['name'];
                    } else {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                    }
                  }
                }
                $scope.onInit();
				$scope.options.loading=false;
              }).error(function (data, status, headers, config) {
				  $scope.options.loading=false;
              }); 
            } else if ($scope.options.selecttypesource == 'array') {
              $scope.optionsSelect = $scope.options.selectsource;
             
                if (typeof $scope.optionsSelect != 'undefined') {
                  for (var i = 0; i < $scope.optionsSelect.length; i++) {
				    if (!$scope.optionsSelect[i].hasOwnProperty('value')) {
						var val= $scope.optionsSelect[i][$scope.options.optionvalue];
						//if(typeof(val)=='string'){
						//	$scope.optionsSelect[i].value=val.replace(new RegExp(' ', 'g'), 'aeiou');
						//}else{
							$scope.optionsSelect[i].value=val;
						//}
                        //$scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue].replace(' ','|');
                    }
					if (!$scope.optionsSelect[i].hasOwnProperty('name')) {
						if ($scope.options.selectconcatvaluename) {
							$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + ' - ' + $scope.optionsSelect[i][$scope.options.optionname];
						   
						} else {
						    $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
						}
					    
					}
                    
                  }
                }
                $scope.onInit();
         
            }
          };
          
          if ($scope.options.type == 'select') {
            if ($scope.options.selecttypesource == 'url' && (typeof $scope.options.autoload == 'undefined' || $scope.options.autoload == true)) {
              var sUrl = $scope.options.selectsource;
              if ($scope.options.loadOnInit) {
				$scope.options.loading=true;
                $http.get(sUrl).success(function (data, status, headers, config) {
                  $scope.optionsSelect = data;
                  for (var i = 0; i < $scope.optionsSelect.length; i++) {
                    if (!$scope.optionsSelect[i].hasOwnProperty('value')) {
						var val= $scope.optionsSelect[i][$scope.options.optionvalue];
						//if(typeof(val)=='string'){
						//	$scope.optionsSelect[i].value=val.replace(new RegExp(' ', 'g'), 'aeiou');
						//}else{
							$scope.optionsSelect[i].value=val;
						//}
						//$scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue].replace(' ','|');
                    }
                    if (!$scope.optionsSelect[i].hasOwnProperty('name')) {
                      if ($scope.options.selectconcatvaluename) {
                        $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + ' - ' + $scope.optionsSelect[i][$scope.options.optionname];
                      } else {
                        $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                      }
                      //delete $scope.optionsSelect[i][$scope.options.optionname];
                      //delete $scope.optionsSelect[i][$scope.options.optionvalue];
                    } else {
                      if ($scope.options.selectconcatvaluename) {
                        $scope.optionsSelect[i].name = $scope.optionsSelect[i]['value'] + ' - ' + $scope.optionsSelect[i]['name'];
                      } else {
                        $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                      }
                    }
                  }
                  $scope.onInit();
				  $scope.options.loading=false;
                }).error(function (data, status, headers, config) {
					$scope.options.loading=false;
                });
              }
            } else if ($scope.options.selecttypesource == 'array') {
              $scope.optionsSelect = $scope.options.selectsource;
              $scope.$watchCollection('optionsSelect', function () {
                if (typeof $scope.optionsSelect != 'undefined' && !$scope.optionsSelect[0].hasOwnProperty('value')) {
                  for (var i = 0; i < $scope.optionsSelect.length; i++) {
				    if (!$scope.optionsSelect[i].hasOwnProperty('value')) {
						var val= $scope.optionsSelect[i][$scope.options.optionvalue];
						//if(typeof(val)=='string'){
						//	$scope.optionsSelect[i].value=val.replace(new RegExp(' ', 'g'), 'aeiou');
						//}else{
							$scope.optionsSelect[i].value=val;
						//}
                        //$scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue].replace(' ','|');
                    }
					if (!$scope.optionsSelect[i].hasOwnProperty('name')) {
						if ($scope.options.selectconcatvaluename) {
							$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + ' - ' + $scope.optionsSelect[i][$scope.options.optionname];
						    
						} else {
						    $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
						}
					    
					}
                    
                  }
                }
                $scope.onInit();
              });
            }
          }
			
			// default value
			if (typeof $scope.options.default !== 'undefined') {
				$scope.value = $scope.options.default;
			}

			// set field id and name
			$scope.id = $scope.options.id ||$scope.options.key ;
			$scope.name = $scope.options.name || $scope.options.key

		}
	};
});
