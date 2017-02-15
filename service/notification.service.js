/**
 * Created by kolesnikov-a on 14/11/2016.
 */
sistemaAlertas.service('notificationService', ['Socket', 'API_ENDPOINTS', 'SOCKET_EVENTS', '$timeout', 'Session', 'Notification', function(Socket, API_ENDPOINTS, SOCKET_EVENTS, $timeout, Session, Notification){

	this.infoCount = 0;
	this.warningCount = 0;
	this.alertCount = 0;

	this.lastControl = null;

	this.watchedSystems = [];

	this.init = () => {

		this.infoCount = 0;
		this.warningCount = 0;
		this.alertCount = 0;

		this.lastControl = null;

		this.watchedSystems = [];

		Session.tasks.forEach((task) => {
			this.watchedSystems.push({system: task, list: []});
		});

		this.socket = new Socket(API_ENDPOINTS.NOTIFICACIONES, 'notificaciones:');

		this.socket.connection.on('outgoing', (data) => {
			console.log('outgoing');
			console.log(data);
			this.setNotification(data);
		});

		this.socket.connection.on('incoming', (data) => {
			console.log('incoming');
			console.log(data);
			this.setNotification(data);
		});

		this.socket.connection.on('isAlive', (data) => {
			this.lastControl = data;
		});

		this.socket.connection.on('connect', () => {
			this.lastControl = {
				name: 'Conexión establecida',
				type: 'INFO',
				fecha: new Date()
			}
		});

		this.socket.connection.on('disconnect', () => {
			let data = {
				system: 'Monitoreo',
				title: 'Sistema de monitoreo',
				description: 'Se ha perdido la conexion con el servidor de monitoreo.',
				type: 'ERROR',
				code: 'CONTROL',
				fecha: new Date()
			};
			this.setNotification(data);
		});

		this.socket.connection.on('connect_error', () => {
			let data = {
				system: 'Monitoreo',
				title: 'Sistema de monitoreo',
				description: 'No se pudo establecer la conexión con el servidor de monitoreo.',
				type: 'ERROR',
				code: 'CONTROL',
				fecha: new Date()
			};
			this.setNotification(data);
		});


		this.socket.connection.on('reconnect_attempt', () => {
			this.lastControl = {
				name: 'Intentando reconectar...',
				fecha: new Date(),
				type: 'INFO'
			}
		});

		this.removeNotifications();

	};

	this.setNotification = (data) => {
		if (data.type == 'ERROR'){
			this.alertCount++;
		} else if(data.type == 'WARN'){
			this.warningCount++;
		} else {
			this.infoCount++;
		}

		let notification = new Notification(data);

		this.watchedSystems.forEach((system) => {
			if (system.system == notification.system){
				system.list.push(notification);
				notification.playSound();
			}
		})
	};

	this.removeNotifications = () => {
		this.controlPromise = $timeout(() => {
			console.log('chequeamos arrays');
			this.watchedSystems.forEach((system) => {
				if (system.list.length > 20){ //Valor arbitrario para definir un máximo de notificaciones que se guardan
					system.list.splice(0, system.list.length - 20);
				}
			});
			this.removeNotifications();
		}, 1500);
	};

	/*this.cancelControl = () => {
		console.log('cancelamos ejecucion timeout');
		$timeout.cancel(this.controlPromise);
	};*/

	/*this.setInfoNotif = (data) => {
		this.infoCount++;

		let info = {
			system: data.name,
			data: data.description,
			timestamp: data.fecha
		};

		this.infos.push(info);
		this.playNotifSound('audio/tonoAviso.mp3');
	};

	this.setWarningNotif = (data) => {
		this.warningCount++;

		let warning = {
			system: data.name,
			data: data.description,
			timestamp: data.fecha
		};

		this.warnings.push(warning);
		this.playNotifSound('audio/tonoAlerta.mp3');
	};

	this.setAlertNotif = (data) => {
		this.alertCount++;
		let repeated = false;
		let message = {
			description: data.description,
			timestamp: data.fecha
		};

		this.alerts.forEach((alert) => {
			if (alert.system == data.name){
				alert.messages.push(message);
				repeated = true;
			}
		});

		if (!repeated){
			let alert = {
				system: data.name,
				messages: [message]
			};
			this.alerts.push(alert);
		}

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
	};*/

	//this.removeNotifications();


}]);