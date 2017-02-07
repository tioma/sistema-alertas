/**
 * Created by kolesnikov-a on 11/11/2016.
 */
var sistemaAlertas = angular.module('sistemaAlertas', [
	'ui.router',
	'ui.bootstrap',
	'btford.socket-io',
	'ngAnimate',
	'ngTagsInput'
]);


sistemaAlertas.constant('API_ENDPOINTS', {
	TERMINALES: '10.1.0.61:8090',
	//NOTIFICACIONES: '10.1.0.55:8073' //SERVIDOR DESA
	NOTIFICACIONES: '10.10.0.223:8073' //SERVIDOR DIEGO
});

sistemaAlertas.constant('SOCKET_EVENTS', {
	NOTIFICACIONES_ERR: 'notificaciones:outgoing',
	NOTIFICACIONES_INFO: 'notificaciones:incoming',
	NOTIFICACIONES_ISALIVE: 'notificaciones:isAlive'
});



sistemaAlertas.config(['$urlRouterProvider', '$stateProvider',  function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise('/alerts');

	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'login/login.html',
		controller: 'loginCtrl'
	}).state('notifications', {
		url: '/notifications/:filter',
		templateUrl: 'notifications/notifications.html',
		controller: 'notificationsCtrl'
	}).state('config', {
		url: '/config',
		templateUrl: 'config/config.html',
		controller: 'configCtrl as config'
	}).state('config.outgoing', {
		url: '/outgoings',
		templateUrl: 'config/outgoings/outgoing.html',
		controller: 'outgoingCtrl as vmOutgoings'
	}).state('config.incoming', {
		url: '/incomings',
		templateUrl: 'config/incomings/incoming.html',
		controller: 'incomingCtrl as vmIncoming'
	})

}]);

//Configuración para interceptar respuestas http y tratar errores
sistemaAlertas.config(['$provide', '$httpProvider', function($provide, $httpProvider){

	// register the interceptor as a service
	$provide.factory('myHttpInterceptor', ['$rootScope', '$q',
		function($rootScope, $q) {
			return {
				// optional method
				'request': function(config) {
					// do something on success
					//config.headers['Token'] = $rootScope.session.getToken();
					//config.headers['Content-Type'] = 'application/json';
					//config.timeout = 2000;

					return config;
				},
				// optional method
				'requestError': function(rejection) {
					// do something on error

					/*if (canRecover(rejection)) {
					 return responseOrNewPromise
					 }*/
					return $q.reject(rejection);
				},
				// optional method
				'response': function(response) {
					// do something on success
					return response;
				},
				// optional method
				'responseError': function(rejection) {
					//TODO config custom messages for http Error status
					if (rejection.status == 404){ //Not found
						rejection.data = {
							status: 'ERROR',
							message: 'No se ha encontrado la ruta en el servidor.'
						}
					}

					if (rejection.status == -1) rejection.data = { message: 'No se ha podido establecer comunicación con el servidor.', status: 'ERROR' };
					// do something on error
					/*if (canRecover(rejection)) {
					 return responseOrNewPromise
					 }*/
					return $q.reject(rejection);
				}
			};
		}]);

	$httpProvider.interceptors.push('myHttpInterceptor');

}]);


sistemaAlertas.run(['$rootScope', 'notificationService', 'clockService',
	function($rootScope, notificationService, clockService){

		//$rootScope.notifications = notificationService;
		//$rootScope.timer = clockService;

		//$rootScope.timer.tick();

		/*$rootScope.session = Session;

		if ($rootScope.session.isAuthenticated()){
			Idle.watch();
		}

		$rootScope.requests401 = [];
		$rootScope.routeChange = {
			to: '',
			from: ''
		};
		$rootScope.loggedUser = '';
		$rootScope.dialogIdle = null;

		$rootScope.$on('IdleStart', function() {
			$rootScope.dialogIdle = dialogsService.notify('Usuario inactivo', 'Se ha detectado que se encuentra inactivo, se procederá a cerrar su sesión en 60 segundos.');
		});

		$rootScope.logOut = function(){
			$rootScope.session.logOut();
			Idle.unwatch();
			$state.transitionTo('login');
		};

		$rootScope.$on('IdleTimeout', function() {
			$rootScope.dialogIdle.dismiss();
			dialogsService.notify('Usuario inactivo', 'Se ha cerrado su sesión debido a que ha sobrepasado el período de inactividad permitido.');
			$rootScope.logOut();
		});

		$rootScope.$on('IdleEnd', function() {
			$rootScope.dialogIdle.dismiss();
			Title.restore();
		});

		$rootScope.$on('Keepalive', function(){
			console.log('hago keep alive');
			$rootScope.session.keepAlive(() => {}, (error) => {
				console.log(error);
				$rootScope.logOut();
			})
		});

		$rootScope.$on(AUTH_EVENTS.notAuthorized, function(){
			dialogsService.notify('Error de acceso', 'Su usario no se encuentra autorizado para realizar esa operación.')
		});

		$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(){
			if ($rootScope.routeChange.from != 'login'){
				var loginDialog = dialogsService.login();
				loginDialog.result.then(function(result){
					if (result.statusText != 'OK'){
					 dialogsService.error('Error', result.data);
					 $state.transitionTo('login');
					 }
				}, function(){
					$state.transitionTo('login');
				});
			} else {
				dialogsService.notify('No autorizado', 'Se requiere un inicio de sesión antes de poder continuar.')
			}
		});

		$rootScope.$on(AUTH_EVENTS.loginSucces, function() {
			Title.restore();
			Idle.watch();

			//$rootScope.session.setData(user);
			//$rootScope.session.setToken(token);

			if ($rootScope.requests401.length > 0){
				var i, requests = $rootScope.requests401;
				for (i = 0; i < requests.length; i++) {
					retry(requests[i]);
				}
				$rootScope.requests401 = [];
			} else if ($rootScope.routeChange.to != '' ){
				var next = $rootScope.routeChange.to;
				$rootScope.routeChange = {
					to: '',
					from: ''
				};
				$state.transitionTo(next);
			}


			function retry(req) {
				$http(req.config).then(function(response) {
					req.deferred.resolve(response);
				});
			}
		});

		$rootScope.socket = appSocket;
		$rootScope.socket.connect();

		$rootScope.loginScreen = true;

		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromParams) {
			$rootScope.loginScreen = (toState.name == 'login');
		});

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

			if (angular.isDefined(toState.data)){ //state requires logged user
				var authorizedRoles = toState.data.authorizedRoles;
				if ($rootScope.session.isAuthenticated()){
					if (!$rootScope.session.isAuthorized(authorizedRoles)){
						event.preventDefault();
						$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
					}
				} else {
					event.preventDefault();
					// user is not logged in
					$rootScope.routeChange ={
						to: toState.name,
						from: fromState.name
					};
					$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
				}

			}

		})*/

	}]);