angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('mobileIDE', {
    url: '/page1',
    templateUrl: 'templates/mobileIDE.html',
    controller: 'mobileIDECtrl'
  })

  .state('projectFiles.file1Java', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/file1Java.html',
        controller: 'file1JavaCtrl'
      }
    }
  })

  .state('projectFiles.file2Java', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/file2Java.html',
        controller: 'file2JavaCtrl'
      }
    }
  })

  .state('projectFiles', {
    url: '/side-menu21',
    templateUrl: 'templates/projectFiles.html',
    controller: 'projectFilesCtrl'
  })

  .state('output', {
    url: '/page4',
    templateUrl: 'templates/output.html',
    controller: 'outputCtrl'
  })

$urlRouterProvider.otherwise('/page1')

  

});