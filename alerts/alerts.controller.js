/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.controller('alertsCtrl', ['$scope', 'Socket', 'API_ENDPOINTS', 'SOCKET_EVENTS', 'notificationService', 'clockService',
	function($scope, Socket, API_ENDPOINTS, SOCKET_EVENTS, notificationService, clockService){

		$scope.timer = clockService;
		$scope.notifications = notificationService;

		$scope.lastControl = null;
		$scope.filterNotifications = '';

		$scope.$on(SOCKET_EVENTS.NOTIFICACIONES_ERR, (event, data) => {
			console.log(data);
			if (data.type == 'ERROR'){
				$scope.notifications.setAlertNotif(data);
			} else if (data.type == "WARN"){
				$scope.notifications.setWarningNotif(data);
			} else {
				$scope.notifications.setInfoNotif(data);
			}
		});

		$scope.$on(SOCKET_EVENTS.NOTIFICACIONES_INFO, (event, data) => {
			console.log(data);
		});

		$scope.$on(SOCKET_EVENTS.NOTIFICACIONES_ISALIVE, (event, data) => {
			$scope.lastControl = data;
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
		});

		$scope.notifications.removeNotifications();

	}]);