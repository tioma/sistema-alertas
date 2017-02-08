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

				//this.socket.forward('outgoing'); //eventos que hay que mostrar
				//this.socket.forward('incoming'); //alguna aplicación avisa algo
				//this.socket.forward('isAlive'); //el servicio está vivo
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