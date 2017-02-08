/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.controller('notificationsCtrl', ['notificationService', '$stateParams',
	function(notificationService, $stateParams){

		this.notifications = notificationService;

		this.filterNotifications = $stateParams.filter;

	}]);