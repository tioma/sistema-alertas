/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.factory('Socket', ['socketFactory', function(socketFactory) {

	class Socket {
		constructor(){
			//const api_endpoint = '10.1.0.55:8073'; //SERVIDOR DESA
			//NOTIFICACIONES: '10.1.0.55:8073' //SERVIDOR DESA
			const api_endpoint = '10.10.0.223:8073'; //SERVIDOR DIEGO

			let ioSocket = io.connect(api_endpoint, { transports: ['polling', 'websocket', 'xhr-polling']});
			//this.socket = socketFactory({ioSocket: ioSocket, prefix: prefix});
			this.socket = socketFactory({ioSocket: ioSocket});

			/*this.socket.on('connect', () => {
				//TODO definir mensajes de forward
				console.log('socket conectado');
				//this.socket.emit('room', system);

				//this.socket.forward('outgoing'); //eventos que hay que mostrar
				//this.socket.forward('incoming'); //alguna aplicación avisa algo
				//this.socket.forward('isAlive'); //el servicio está vivo
			});

			/*this.socket.on('connect_failed', () => {
				console.log('falló la conexiónnnnnnn');
			});

			this.socket.on('reconnect', () => {
				//TODO definir protocolo en caso de reconeccion
				console.log('reconectamosssssss');
			});

			this.socket.on('disconnect', () => {
				//TODO definir protocolo en caso de desconección
				console.log('socket se desconecto');
			})*/
		}

		emit(event, data){
			this.socket.emit(event, data);
		}

		get connection(){
			return this.socket;
		}

		//TODO ver si es necesario este metodo
		/*disconnect() {
			ioSocket.disconnect();
		}*/
	}

	return Socket;

}]);