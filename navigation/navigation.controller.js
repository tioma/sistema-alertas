/**
 * Created by kolesnikov-a on 07/02/2017.
 */
sistemaAlertas.controller('navigationCtrl', ['$scope', 'clockService', 'notificationService', 'SOCKET_EVENTS', function($scope, clockService, notificationService, SOCKET_EVENTS){

	$scope.timer = clockService;
	$scope.notifications = notificationService;

	$scope.$on(SOCKET_EVENTS.NOTIFICACIONES_ISALIVE, (event, data) => {
		console.log('is alive');
		console.log(data);
		$scope.lastControl = data;
	});

}]);