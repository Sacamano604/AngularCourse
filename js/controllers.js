'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitlistController', ['$scope', 'partyService', 'textMessageService', 'authService', function($scope, partyService, textMessageService, authService){
		// Bind users' parties to $scope.parties
		authService.getCurrentUser().then(function(user){
			if (user) {
				$scope.parties = partyService.getPartiesByUserId(user.id);
			};
		})
		// Object to store data from the waitlist form.
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};
		
		// Function to save a new party to the waitlist
		$scope.saveParty = function(){
			partyService.saveParty($scope.newParty, $scope.currentUser.id);
			$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};
		};
		
		// Function to send text message to a party.
		$scope.sendTextMessage = function(party){
			textMessageService.sendTextMessage(party, $scope.currentUser.id);
		};
	}])
	.controller('AuthController', ['$scope', 'authService', function($scope, authService){
		// Object bound to inputs on the regsiter and login pages
		$scope.user = {email: '', password: ''};
		// Method to register a new user using authService
		$scope.register = function(){
			authService.register($scope.user);
		};
		// Method to login a new user using authService
		$scope.login = function() {
			authService.login($scope.user);
		};
		// Method to logout a new user using authService
		$scope.logout = function() {
			authService.logout();
		};
	}]);