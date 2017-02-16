/**
 * Created by kolesnikov-a on 15/02/2017.
 */
sistemaAlertas.factory('NotificationRoom', ['Socket', 'Notification', 'SYSTEMS', '$timeout', function(Socket, Notification, SYSTEMS, $timeout){

	class NotificationRoom {

		constructor(system){
			this.infoCount = 0;
			this.warningCount = 0;
			this.alertCount = 0;
			this.system = SYSTEMS[system];
			this.list = [];

			this.socket = new Socket();

			this.socket.connection.on('connect', () => {

				this.socket.connection.emit('room', system);

				this.socket.connection.on('outgoing', (data) => {
					this.setNotification(data);
				});

				this.socket.connection.on('incoming', (data) => {
					this.setNotification(data);
				});

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
			$timeout.cancel(this.controlPromise);
			this.socket.connection.disconnect();
		}

		get totalNotifications(){
			return this.infoCount + this.warningCount + this.alertCount;
		}

	}

	return NotificationRoom;

}]);