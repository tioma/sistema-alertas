/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.factory('Socket', ['socketFactory', function(socketFactory) {

	class Socket {
		constructor(api_endpoint, prefix){
			let ioSocket = io.connect(api_endpoint, { transports: ['polling', 'websocket', 'xhr-polling']});
			this.socket = socketFactory({ioSocket: ioSocket, prefix: prefix});

			this.socket.on('connect', () => {
				//TODO definir mensajes de forward
				console.log('socket conectado');
				this.socket.forward('info');
				this.socket.forward('warning');
				this.socket.forward('alert');

				//PROBANDO CON EVENTOS QUE YA TENGO
				this.socket.forward('invoice');
				this.socket.forward('gate');
				this.socket.forward('appointment');


			});

			this.socket.on('reconnect', () => {
				//TODO definir protocolo en caso de reconeccion
			});

			this.socket.on('disconnect', () => {
				//TODO definir protocolo en caso de desconección
				console.log('socket se desconecto');
			})
		}

		emit(event, data){
			this.socket.emit(event, data);
		}

		//TODO ver si es necesario este metodo
		/*disconnect() {
			ioSocket.disconnect();
		}*/
	}

	return Socket;

}]);