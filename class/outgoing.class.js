/**
 * Created by kolesnikov-a on 01/02/2017.
 */
sistemaAlertas.factory('Outgoing', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS){

	class Outgoing {

		constructor(outgoingData){
			if (outgoingData){
				angular.extend(this, outgoingData);
			} else {
				this.name = '';
				this.req = {
					url: '',
					port: '',
					path: ''
				};
				this.type = 'ERROR';
				this.res = {
					status: '',
					description: ''
				};
				this.mail = {
					status: false,
					period: 'minute',
					count: 1,
					accounts: []
				}
			}
		}

		update(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINTS.NOTIFICACIONES}/outgoing/${this.name}/change`;
			$http.post(inserturl, this).then((response) => {
				console.log(response);
				deferred.resolve(response.data);
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		addNew(){
			const deferred = $q.defer();
			deferred.resolve();
			return deferred.promise;
		}

		//post /outgoing/:name/change
		save(){
			if (this._id){
				return this.update();
			} else {
				return this.addNew()
			}
		}


		set schedule(newSchedule){
			this.cron = {};
			for (let property in newSchedule) {
				if (newSchedule.hasOwnProperty(property) && property != 'repeat' && typeof newSchedule[property].value == 'number') {
					this.cron[property] = newSchedule[property].value;
				}
			}
		}

		set daysOfWeek(days){
			this.cron.dayOfWeek = [];
			days.forEach((day) => {
				if (day.repeat) this.cron.dayOfWeek.push(day.value);
			});
		}

		get completeUrl(){
			return `${this.req.url}:${this.req.port}${this.req.path}`;
		}

	}

	return Outgoing;

}]);