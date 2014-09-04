'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.value('FIREBASE_URL', 'https://waitandeatben.firebaseIO.com/')
	.factory('dataService', function($firebase, FIREBASE_URL){
		var dataRef = new Firebase(FIREBASE_URL);
		var fireData = $firebase(dataRef);
		return fireData;
	})
	.factory('partyService', function(dataService){
		var users = dataService.$child('users');
		var partyServiceObject = {
			saveParty: function(party, userId){
				users.$child(userId).$child('parties').$add(party);
			},
			getPartiesByUserId: function(userId){
				return users.$child(userId).$child('parties');
			}
		};
		return partyServiceObject;
	})
	.factory('textMessageService', function(dataService, partyService){
		var textMessages = dataService.$child('textMessages');
		var textMessageServiceObject = {
			sendTextMessage: function(party, userId){
				var newTextMessage = {
					phoneNumber: party.phone,
					size: party.size,
					name: party.name
				};
			textMessages.$add(newTextMessage);
			// party.notified = 'Yes';
			// partyService.parties.$save(party.$id);
				partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
			}
		};

		return textMessageServiceObject;
	})
	.factory('authService', function($firebaseSimpleLogin, $location, FIREBASE_URL, $rootScope, dataService){
		var authRef = new Firebase(FIREBASE_URL);
		var auth = $firebaseSimpleLogin(authRef);
		var emails = dataService.$child('emails');

		var authServiceObject = {
			register: function(user) {
				auth.$createUser(user.email, user.password).then(function(data){
				console.log(data);
				authServiceObject.login(user, function(){
					emails.$add({email: user.email});
				});
			});
			},
			login: function(user, optionalCallBack){
				auth.$login('password', user).then(function(data){
				console.log(data);
				if (optionalCallBack){
					optionalCallBack();
				}
				// Redirect users to the wailist page.
				$location.path('/waitlist');
			});
			},
			logout: function(){
				auth.$logout();
				// Redirect users to the landing page.
				$location.path('/');
			},
			getCurrentUser: function(){
				return auth.$getCurrentUser();
			}
		};

		$rootScope.$on('$firebaseSimpleLogin:login', function(e, user){
			// Save current user on our root scope
			$rootScope.currentUser = user;
		});

		$rootScope.$on('$firebaseSimpleLogin:logout', function(e, user){
			$rootScope.currentUser = null;
		});
		return authServiceObject;
	});
  