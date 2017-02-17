/**
 * Created by kolesnikov-a on 15/02/2017.
 */
sistemaAlertas.factory('NotificationRoom', ['Socket', 'Notification', 'SYSTEMS', '$timeout', 'Session', 'dataService', function(Socket, Notification, SYSTEMS, $timeout, Session, dataService){

	class NotificationRoom {

		constructor(system){

			dataService.getGroups().then((groups) => {
				groups.forEach((group) => {
					if (group._id == system) this.system = group.description;
				});
			}).catch((error) => {
				this.system = SYSTEMS[system];
			});

			this.infoCount = 0;
			this.warningCount = 0;
			this.alertCount = 0;
			this.list = [];

			this.socket = new Socket();

			this.socket.connection.on('connect', () => {

				this.socket.connection.emit('authenticate', {token: Session.token});

				this.socket.connection.emit('room', system);

				this.socket.connection.on('outgoing', (data) => {
					console.log(data);
					this.setNotification(data);
				});

				this.socket.connection.on('incoming', (data) => {
					console.log(data);
					this.setNotification(data);
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

		}

		setNotification(data){
			if (data.type == 'ERROR'){
				this.alertCount++;
			} else if(data.type == 'WARN'){
				this.warningCount++;
			} else {
				this.infoCount++;
			}

			this.list.push(new Notification(data));

		}

		checkNotifications(){
			this.controlPromise = $timeout(() => {
				if (this.list.length > 20){
					this.list.splice(0, this.list.length-20);
				}
				this.checkNotifications()
			}, 5000)
		}

		disconnect(){
			console.log('desconectamos');
			$timeout.cancel(this.controlPromise);
			this.socket.connection.disconnect();
		}

		get totalNotifications(){
			return this.infoCount + this.warningCount + this.alertCount;
		}

	}

	return NotificationRoom;

}]);