angular.module('app.controllers', ['ionic', 'ui.router'])

.controller('mobileIDECtrl', ['$scope', '$stateParams',  '$ionicLoading', '$location', "$http", "$ionicSideMenuDelegate", "$ionicPopup", "$rootScope", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $location, $http, $ionicSideMenuDelegate, $ionicPopup, $rootScope) {

	$scope.data = {};

	$scope.toggleLeftSideMenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	      mode: "text/x-java",
	      lineWrapping: true,
	      lineNumbers: false,
	});

	$scope.file = "HelloWorld";
	$scope.editor = editor;

	$scope.newFile = function() {
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
		  template: '<input type="text" ng-model="data.newFileName">',
		  title: 'Enter File Name',
		  subTitle: 'Please enter file name without extensions',
		  scope: $scope,
		  buttons: [
			{ text: 'Cancel' },
			{
			  text: '<b>Create</b>',
			  type: 'button-positive',
			  onTap: function(e) {
				if (!$scope.data.newFileName) {
				  //don't allow the user to close unless he enters file name
				  e.preventDefault();
				} else {
				  return $scope.data.newFileName;
				}
			  }
			}
		  ]
		});

		myPopup.then(function(res) {
			var type = window.TEMPORARY;
			var size = 1*1024*1024;

			window.requestFileSystem(type, size, successCallback, errorCallback)

			function successCallback(fs) {
				fs.root.getFile(res+".java", {create: true, exclusive: true}, function(fileEntry) {
				 	//alert('File creation successfull!');
					var storedFiles = JSON.parse(localStorage.getItem("files"));
					if(!storedFiles) {
						storedFiles = {};
					}
					storedFiles[res] = res;
					console.log(storedFiles);
					localStorage.setItem("files", JSON.stringify(storedFiles));
					$scope.file = res;
					$scope.allfiles = storedFiles;
					$(".fileNameHeading").html(res + ".java");
					editor.setValue($("#tmpCode").val());
					$rootScope.$broadcast('onFileCreate', res);
				}, errorCallback);
			}

			function errorCallback(error) {
				alert("ERROR: " + error.code)
			}
		});
	}

	$scope.output = function() {
		$ionicLoading.show({
	      template: 'Compiling...'
	  	});
        $http({
               url:'http://ec2-52-88-199-115.us-west-2.compute.amazonaws.com/mobileide/index.php',
               method:"POST",
               headers: {
				   'Content-Type': 'application/x-www-form-urlencoded'
               },
               data: $.param({
				   'code': editor.getValue(),
				   'filename': $scope.file
               })
         }).then(function successCallback(response) {
			 $ionicLoading.hide();
			 var data = response.data;
			 data = data.replace(/(?:\r\n|\r|\n)/g, '<br />');
			 console.log(data);
			 $location.path('page4').search({output: data, filename: $scope.file+".java"});
			 // this callback will be called asynchronously
			 // when the response is available
		 }, function errorCallback(response) {
			 $ionicLoading.hide();
			 $location.path('page4').search({output: data, filename: $scope.file+".java"});
			 // called asynchronously if an error occurs
			 // or server returns response with an error status.
		 });
	};

	$scope.save = function() {
		var fileName = $scope.file + ".java";
		var type = window.TEMPORARY;
		var size = 1*1024*1024;
		$ionicLoading.show({
	      template: 'Saving...'
	  	});

		window.requestFileSystem(type, size, successCallback, errorCallback)

		function successCallback(fs) {

		 fs.root.getFile(fileName, {create: true}, function(fileEntry) {

			fileEntry.createWriter(function(fileWriter) {
			   fileWriter.onwriteend = function(e) {
				   $ionicLoading.hide();
				  //alert('Write completed.');
			   };

			   fileWriter.onerror = function(e) {
				  alert('Write failed: ' + e.toString());
			   };

			   var blob = new Blob([editor.getValue()], {type: 'text/plain'});
			   fileWriter.write(blob);
			}, errorCallback);

		 }, errorCallback);

		}

		function errorCallback(error) {
		 alert("ERROR: " + error.code)
		}

	};

	$scope.$on('onFileLoad', function(response, fileName, content) {
		console.log('coming inside');
		console.log(fileName);
		console.log(content);
		$scope.file = fileName;
		$(".fileNameHeading").html(fileName + ".java");
		editor.setValue(content);
	});
}])

.controller('file1JavaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('file2JavaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('projectFilesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('outputCtrl', ['$scope', '$stateParams', '$location', '$sce',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $location, $sce) {
	var urlParams = $location.search();
	$scope.output = $sce.trustAsHtml(urlParams.output);
	$scope.filename = urlParams.filename;
}])

.controller('sideBarCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate',
	function($scope, $rootScope, $ionicSideMenuDelegate) {
		var storedFiles = JSON.parse(localStorage.getItem("files"));
		$scope.allfiles = storedFiles;

		$scope.$on('onFileCreate', function(response) {
			var storedFiles = JSON.parse(localStorage.getItem("files"));
			$scope.allfiles = storedFiles;
		});

		$scope.openFile = function(fileName) {
			console.log(fileName);
			$ionicSideMenuDelegate.toggleLeft();

			var type = window.TEMPORARY;
			var size = 1*1024*1024;

			window.requestFileSystem(type, size, successCallback, errorCallback)

			function successCallback(fs) {

			  fs.root.getFile(fileName + ".java", {}, function(fileEntry) {

			     fileEntry.file(function(file) {
			        var reader = new FileReader();

			        reader.onloadend = function(e) {
						$rootScope.$broadcast('onFileLoad', fileName, this.result);
			        };

			        reader.readAsText(file);

			     }, errorCallback);

			  }, errorCallback);
			}

			function errorCallback(error) {
			  alert("ERROR: " + error.code)
			}
		}
	}
])
