/**
 * Created by kolesnikov-a on 14/02/2017.
 */
sistemaAlertas.factory('Notification', [function(){

	class Notification {

		constructor(notificationData){
			angular.extend(this, notificationData);

			if (this.type == 'ERROR'){
				this.class = 'notification-alert';
			} else if(this.type == 'WARN'){
				this.class = 'notification-warning';
			} else {
				this.class = 'notification-info'
			}

		}
	}

	return Notification;
}]);