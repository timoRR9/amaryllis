angular.module('starter.controllers', ['ngStorage','ionic'])

.factory('Data', function () {
  return{
          cart:[],
          order : ''
        }
})

.controller('MainCtrl', function($scope, $localStorage, Data, $state, $ionicPopup, $http, $stateParams, $ionicModal, $location) {

  //Lien de l'api vers laquelle communique l'application
  var BaseUrl = "http://localhost/amaryllisApi/v1/";

  //Récupération des données la factory
  $scope.Data = Data;

  //Stock les commandes des clients lorsqu'il y en a plusieurs
  $scope.$storage = $localStorage.$default({
    cart : [],
    order : ''
  });

  console.log($scope.$storage);

  $scope.nbArticles = $scope.Data.cart.length;
  console.log($scope.nbArticles);

  $ionicModal.fromTemplateUrl('templates/cart.html', {
    scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  //Récupération des différentes articles (appel : store.html -> ng-init)
  $scope.GetProducts = function(){
    $http.get(BaseUrl + "GetProduits").success(function(response) {
      $scope.produits = response;
      console.log(response);
    });
  }

  //Affiche le produit selectionné par l'utilisateur (appel : product.html -> ng-init)
  $scope.GetProduct = function () {

    var param = {
      productName : $stateParams.productName
    };

    $http.post(BaseUrl + "GetProduct", param).success(function(data) {
        console.log(data);
        $scope.currentProduct = data;
    });
  };

 //Affiche les produis de l'evenement selectionné par l'utilisateur (appel : event.html -> ng-init)
  $scope.GetProductsByEvent = function (){

    var param = {
      eventName : $stateParams.eventName
    };

    $http.post(BaseUrl + "GetProductsByEvent", param).success(function(data) {
        $scope.productsByEvent = data;
    });
  };

  //Sauvergarde l'article pour la commande
  $scope.prepareToPay = function(product){
    $scope.Data.order = product;
    $state.transitionTo('app.commande');
    console.log($scope.Data.order);
  };

  $scope.prepareToPayFromCart = function(){
    $scope.modal.hide();
    $state.transitionTo('app.commande');
  };

  //Vérifie la carte et effectue le paiement (enregistrement bdd + créditation compte stripe)
  $scope.paiement = function(){
    console.log('init pay stripe');
    Stripe.setPublishableKey('pk_test_MMiA4y2GAlZtZUnHM9YgBVog');
    var stripeResponseHandler = function(status, response) {

      var $form = $('#payment-form');
      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
      } else {
        // token contains id, last4, and card type
        var token = response.id;
        console.log(token);
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" id="token" />').val(token));
        // and re-submit
        $scope.submitForm();
      }
    };

    $('#payment-form').submit(function(e) {

      var $form = $(this);
      // Disable the submit button to prevent repeated clicks
      $form.find('button').prop('disabled', true);

      Stripe.card.createToken($form, stripeResponseHandler);
      // Prevent the form from submitting with the default action
      return false;
    });

    $scope.submitForm = function() {

      var param = {
        token : $('#token').val(),
        euro : $scope.Data.order.prix,
        nom_acheteur : document.getElementById('nom_acheteur').value,
        telephone_acheteur : document.getElementById('telephone_acheteur').value,
        mail_acheteur : document.getElementById('mail_acheteur').value,
        nom_destinataire : document.getElementById('nom_destinataire').value,
        adresse_destinataire : document.getElementById('adresse_destinataire').value,
        ville_destinataire : document.getElementById('ville_destinataire').value,
        cp_destinataire : document.getElementById('cp_destinataire').value,
        telephone_destinataire : document.getElementById('telephone_destinataire').value,
        date_livraison : document.getElementById('date_livraison').value,
        horaire_livraison : document.getElementById('horaire_livraison').value,
        message : document.getElementById('message').value,
        produits : $scope.Data.order.nom
      };

      console.log(param);

      $http.post(BaseUrl + "paiement", param)
        .success(function(data) {
          console.log(data);
          console.log("LOURD");

          $http.post(BaseUrl + "commande", param)
            .success(function(data) {
              console.log("commande enregistré");
              $state.transitionTo('app.recap', {productName:param.produits});
            });
        });
    };
  };

  //Vérifie la carte et effectue le paiement depuis le pannier (enregistrement bdd de chaque article + créditation compte stripe)
  $scope.paiementFromCart = function(){
    console.log('init pay stripe');
    Stripe.setPublishableKey('pk_test_MMiA4y2GAlZtZUnHM9YgBVog');
    var stripeResponseHandler = function(status, response) {

      var $form = $('#payment-form');
      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
      } else {
        // token contains id, last4, and card type
        var token = response.id;
        console.log(token);
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" id="token" />').val(token));
        // and re-submit
        $scope.submitForm();
      }
    };

    $('#payment-form').submit(function(e) {

      var $form = $(this);
      // Disable the submit button to prevent repeated clicks
      $form.find('button').prop('disabled', true);

      Stripe.card.createToken($form, stripeResponseHandler);
      // Prevent the form from submitting with the default action
      return false;
    });

    $scope.submitForm = function() {

      var order = $scope.Data.cart;
      var prix;
      var total = 0;
      for(var i= 0; i < order.length; i++)
      {
      prix = order[i].prix;
      parseInt(prix);
      total = total + prix;
      console.log(total);
      }

      var param = {
        token : $('#token').val(),
        euro :  total
      };

      console.log(param);

      $http.post(BaseUrl + "paiement", param)
        .success(function(data) {
          console.log(data);
          console.log("LOURD");
          for(var i= 0; i < order.length; i++)
          {
            var param2 = {
              token : $('#token').val(),
              euro : order[i].prix,
              nom_acheteur : document.getElementById('nom_acheteur').value,
              telephone_acheteur : document.getElementById('telephone_acheteur').value,
              mail_acheteur : document.getElementById('mail_acheteur').value,
              nom_destinataire : document.getElementById('nom_destinataire').value,
              adresse_destinataire : document.getElementById('adresse_destinataire').value,
              ville_destinataire : document.getElementById('ville_destinataire').value,
              cp_destinataire : document.getElementById('cp_destinataire').value,
              telephone_destinataire : document.getElementById('telephone_destinataire').value,
              date_livraison : document.getElementById('date_livraison').value,
              horaire_livraison : document.getElementById('horaire_livraison').value,
              message : document.getElementById('message').value,
              produits : order[i].nom,
            };

            $http.post(BaseUrl + "commande", param2)
              .success(function(data) {
                console.log("commande enregistré");
                $state.transitionTo('app.recap', {productName:'cart'});
              });
          }


        });
    };
  };

  //ajoute l'article dans le panier
  $scope.addToCart = function(product){
    var cartProduct = product;
    $scope.Data.cart.push($scope.currentProduct[0]);
    showAlert(product);
    console.log($scope.Data.cart);
  };

  //Retire l'article du panier
  $scope.removeOfCart = function(product){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmation',
     template: 'Êtes vous sur de vouloir supprimer cet article ?'
    });
    confirmPopup.then(function(res) {
     if(res) {
       var index = 	$scope.Data.cart.map(function (x) { return x.id; }).indexOf(product.id);
   			if (index > -1) {
   			  $scope.Data.cart.splice(index, 1);
           console.log($scope.Data.cart);
         }
     } else {
       console.log('You are not sure');
     }
    });
  };

  //vide l'intégralité du panier
  $scope.emptyCart = function(){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmation',
     template: 'Êtes vous sur de vouloir supprimer cet article ?'
    });
    confirmPopup.then(function(res) {
     if(res) {
       $scope.Data.cart = [];
     } else {
       console.log('You are not sure');
     }
    });
  };

  $scope.emptyStorage = function(){
    $scope.Data.cart = [];
    $scope.Data.order = '';
    $state.transitionTo('app.store', {reload: true});
  };
  //
  var showAlert = function(product) {
    var alertPopup = $ionicPopup.alert({
     title: 'Mon panier',
     template: 'Le produit a été ajouté à votre panier'
    });
    alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.wrongRoad = function(){
    console.log($scope.Data.cart.length);
    console.log($scope.Data.order);
    if ($scope.Data.cart.length == 0 && $scope.Data.order == ''){
      $state.transitionTo('app.store', null, {reload: true});
    }
  };

  $scope.getTotalCart = function(){
    var order = $scope.Data.cart;
    var prix;
    $scope.total = 0;
    for(var i= 0; i < order.length; i++)
    {
      prix = order[i].prix;
      parseInt(prix);
      $scope.total = $scope.total + prix;
      console.log($scope.total);
    }
    return $scope.total;
  }

})

.controller('StripeController', function($scope,$http, $localStorage) {

});
