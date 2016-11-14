/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.controller('alertsCtrl', ['$scope', 'Socket', 'API_ENDPOINTS', 'SOCKET_EVENTS', 'notificationService', function($scope, Socket, API_ENDPOINTS, SOCKET_EVENTS, notificationService){

	$scope.notifications = notificationService;

	$scope.$on(SOCKET_EVENTS.TERMINALES_INFO, (event, data) => {
		console.log(data);
	});

	$scope.$on(SOCKET_EVENTS.TERMINALES_WARNING, (event, data) => {
		console.log(data);
	});

	$scope.$on(SOCKET_EVENTS.TERMINALES_ALERT, (event, data) => {
		console.log(data);
	});

	$scope.$on('terminales:invoice', (event, data) => {
		console.log('invoice');
		console.log(data);

		$scope.notifications.setAlertNotif('Terminales', data);
	});

	$scope.$on('terminales:gate', (event, data) => {
		console.log('gate');
		console.log(data);

		$scope.notifications.setWarningNotif('Terminales', data);
	});

	$scope.$on('terminales:appointment', (event, data) => {
		console.log('appointment');
		console.log(data);

		$scope.notifications.setInfoNotif('Terminales', data);
	})

}]);