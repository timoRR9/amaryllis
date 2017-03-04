// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MainCtrl'
  })

  .state('accueil', {
    url: '/accueil',
    templateUrl: 'templates/accueil.html',
    controller: 'MainCtrl'
  })

  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.event', {
    url: '/events/:eventName',
    views: {
      'menuContent': {
        templateUrl: 'templates/event.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.store', {
    url: '/store',
    views: {
      'menuContent': {
        templateUrl: 'templates/store.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.commande', {
    url: '/commande',
    views: {
      'menuContent': {
        templateUrl: 'templates/commande.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.paiement', {
    url: '/paiement',
    views: {
      'menuContent': {
        templateUrl: 'templates/paiement.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.recap', {
    url: '/recap/:productName',
    views: {
      'menuContent': {
        templateUrl: 'templates/recapitulatif-commande.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.services', {
    url: '/services',
    views: {
      'menuContent': {
        templateUrl: 'templates/services.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.contact', {
    url: '/contact',
    views: {
      'menuContent': {
        templateUrl: 'templates/contact.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.validation', {
    url: '/validation',
    views: {
      'menuContent': {
        templateUrl: 'templates/validation.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.product', {
    url: '/store/:productName',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller: 'MainCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/accueil');
});
