/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.controller('notificationsCtrl', ['notificationService',
	function(notificationService){

		this.notifications = notificationService;
		this.notifications.init();

		let totalSystems = this.notifications.watchedSystems.length;
		let widthPanel = 4;

		this.panelHeigth = 'half-screen';
		if (totalSystems < 4){
			widthPanel = 12 / totalSystems;
			this.panelHeigth = 'full-screen';
		} else if (totalSystems == 4){
			widthPanel = 6;
		}

		this.panelWidth = `col-xs-${widthPanel}`;

	}]);