/**
 * Created by kolesnikov-a on 07/02/2017.
 */
sistemaAlertas.controller('navigationCtrl', ['clockService', 'notificationService', function(clockService, notificationService){

	this.timer = clockService;
	this.notifications = notificationService;

}]);