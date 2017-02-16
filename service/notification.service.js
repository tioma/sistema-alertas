/**
 * Created by kolesnikov-a on 14/11/2016.
 */
sistemaAlertas.service('notificationService', ['Socket', 'API_ENDPOINTS', 'SOCKET_EVENTS', '$timeout', 'Session', 'Notification', 'NotificationRoom', function(Socket, API_ENDPOINTS, SOCKET_EVENTS, $timeout, Session, Notification, NotificationRoom){

	class notificationService {

		constructor(){
			this.lastControl = null;

			this.watchedSystems = [];
		}

		init(){

			this.lastControl = null;

			this.watchedSystems = [];

			this.socket = new Socket(API_ENDPOINTS.NOTIFICACIONES, 'notificaciones:');

			let totalSystems = Session.tasks.length;
			let widthPanel = 4;

			this.panelHeigth = 'half-screen';
			if (totalSystems < 4){
				widthPanel = 12 / totalSystems;
				this.panelHeigth = 'full-screen';
			} else if (totalSystems == 4){
				widthPanel = 6;
			}

			this.panelWidth = `col-xs-${widthPanel}`;

			this.socket.connection.on('connect', () => {
				console.log('socket conectado');

				Session.tasks.forEach((task) => {
					let room = new NotificationRoom(task);
					this.watchedSystems.push(room);
					room.checkNotifications();
				});

				this.lastControl = new Notification({
					system: 'Monitoreo',
					name: 'Monitoreo - conexión establecida',
					type: 'INFO',
					fecha: new Date()
				});

				this.socket.connection.on('isAlive', (data) => {
					this.lastControl = data;
				});

			});

			this.socket.connection.on('disconnect', () => {
				console.log('socket desconectado');
				let data = {
					system: 'Monitoreo',
					name: 'Sistema de monitoreo',
					description: 'Se ha perdido la conexion con el servidor de monitoreo.',
					type: 'ERROR',
					code: 'CONTROL',
					fecha: new Date()
				};
				this.setNotification(data);
			});

			this.socket.connection.on('connect_error', () => {
				console.log('error de conexión');
				let data = {
					system: 'Monitoreo',
					name: 'Sistema de monitoreo',
					description: 'No se pudo establecer la conexión con el servidor de monitoreo.',
					type: 'ERROR',
					code: 'CONTROL',
					fecha: new Date()
				};
				this.setNotification(data);
			});


			this.socket.connection.on('reconnect_attempt', () => {
				console.log('intentando reconectar');
				this.lastControl = new Notification({
					name: 'Intentando reconectar...',
					fecha: new Date(),
					type: 'INFO'
				});
			});

			//this.removeNotifications();

		};

		setNotification(data){
			/*if (data.type == 'ERROR'){
				this.alertCount++;
			} else if(data.type == 'WARN'){
				this.warningCount++;
			} else {
				this.infoCount++;
			}*/

			let notification = new Notification(data);

			this.watchedSystems.forEach((system) => {
				if (system.system == notification.system){
					system.count++;
					system.list.push(notification);
					notification.playSound();
				}
			})
		};

		closeConnection(){
			$timeout.cancel(this.controlPromise);
			this.watchedSystems.forEach((system) => {
				system.disconnect();
			});
			this.socket.connection.disconnect();
		};

		get infoCount(){
			let total = 0;
			this.watchedSystems.forEach((system) => {
				total+= system.infoCount;
			});
			return total;
		}

		get warningCount(){
			let total = 0;
			this.watchedSystems.forEach((system) => {
				total+= system.warningCount;
			});
			return total;
		}

		get alertCount(){
			let total = 0;
			this.watchedSystems.forEach((system) => {
				total+= system.alertCount;
			});
			return total;
		}

	}

	return new notificationService();

}]);