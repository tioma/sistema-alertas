/**
 * Created by kolesnikov-a on 01/02/2017.
 */
sistemaAlertas.factory('configFactory', ['$http', '$q', 'API_ENDPOINTS', 'Outgoing', function($http, $q, API_ENDPOINTS, Outgoing){

	class configFactory {

		buildOutgoings(outgoingsData){
			let outgoingsArray = [];
			for (let outgoing of outgoingsData){
				outgoingsArray.push(new Outgoing(outgoing));
			}
			return outgoingsArray;
		}

		getOutgoings(){
			const deferred = $q.defer();
			const uri = `http://${API_ENDPOINTS.NOTIFICACIONES}/outgoings`;
			$http.get(uri).then((response) => {
				if (response.data.status == 'OK'){
					deferred.resolve(this.buildOutgoings(response.data.data));
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

	}

	return new configFactory();

}]);