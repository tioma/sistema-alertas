/**
 * Created by kolesnikov-a on 14/11/2016.
 */
sistemaAlertas.service('notificationService', ['Socket', 'API_ENDPOINTS', 'SOCKET_EVENTS', '$timeout', function(Socket, API_ENDPOINTS, SOCKET_EVENTS, $timeout){

	const socketNotification = new Socket(API_ENDPOINTS.NOTIFICACIONES, 'notificaciones:');

	this.alertsMax = 7;
	this.warningsMax = 5;
	this.infosMax = 5;

	this.infoCount = 0;
	this.warningCount = 0;
	this.alertCount = 0;

	this.infos = [];
	this.warnings = [];
	this.alerts = [];

	this.removeNotifications = () => {
		this.controlPromise = $timeout(() => {
			console.log('chequeamos arrays');
			if (this.infos.length > this.infosMax){
				this.infos.splice(0, this.infos.length-this.infosMax);
			}
			if (this.warnings.length > this.warningsMax){
				this.warnings.splice(0, this.warnings.length-this.warningsMax);
			}
			if(this.alerts.length > this.alertsMax){
				this.alerts.splice(0, this.alerts.length-this.alertsMax);
			}
			this.removeNotifications();
		}, 1500);
	};

	this.cancelControl = () => {
		console.log('cancelamos ejecucion timeout');
		$timeout.cancel(this.controlPromise);
	};

	this.setInfoNotif = (data) => {
		this.infoCount++;

		let info = {
			system: data.name,
			data: data.message,
			timestamp: data.fecha
		};

		this.infos.push(info);
		this.playNotifSound('audio/tonoAviso.mp3');
	};

	this.setWarningNotif = (data) => {
		this.warningCount++;

		let warning = {
			system: data.name,
			data: data.data,
			timestamp: data.fecha
		};

		this.warnings.push(warning);
		this.playNotifSound('audio/tonoAlerta.mp3');
	};

	this.setAlertNotif = (data) => {
		this.alertCount++;

		let alert = {
			system: data.name,
			data: data.message,
			timestamp: data.fecha
		};

		this.alerts.push(alert);
		this.playNotifSound('audio/tonoAlarma.mp3');
	};

	this.playNotifSound = function(url){
		let audio = document.createElement('audio');
		audio.style.display = "none";
		audio.src = url;
		audio.autoplay = true;
		audio.onended = () => {
			audio.remove(); //Remove when played.
		};
		document.body.appendChild(audio);
	}


}]);