/**
 * Created by kolesnikov-a on 14/11/2016.
 */
sistemaAlertas.service('notificationService', ['Socket', 'API_ENDPOINTS', 'SOCKET_EVENTS', function(Socket, API_ENDPOINTS, SOCKET_EVENTS){

	const socketTerminales = new Socket(API_ENDPOINTS.TERMINALES, 'terminales:');

	this.infoCount = 0;
	this.warningCount = 0;
	this.alertCount = 0;

	this.infos = [];
	this.warnings = [];
	this.alerts = [];

	this.setInfoNotif = (system, data) => {
		this.infoCount++;

		let info = {
			system: system,
			data: data.data,
			timestamp: Date.now()
		};

		this.infos.push(info);
	};

	this.setWarningNotif = (system, data) => {
		this.warningCount++;

		let warning = {
			system: system,
			data: data.data,
			timestamp: Date.now()
		};

		this.warnings.push(warning);
	};

	this.setAlertNotif = (system, data) => {
		this.alertCount++;

		let alert = {
			system: system,
			data: data.data,
			timestamp: Date.now()
		};

		this.alerts.push(alert);
	}


}]);