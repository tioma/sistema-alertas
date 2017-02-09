/**
 * Created by kolesnikov-a on 01/02/2017.
 */
sistemaAlertas.factory('Outgoing', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS){

	class Outgoing {

		constructor(outgoingData){
			if (outgoingData){
				angular.extend(this, outgoingData);
				if (!this.req.headers) this.req.headers = [];
			} else {
				this.name = '';
				this.req = {
					headers: [],
					method: 'GET',
					url: '',
					port: '',
					path: ''
				};
				this.type = 'ERROR';
				this.res = {
					status: 200,
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

		enable(){
			this.status = true;
			this.update();
		}

		disable(){
			this.status = false;
			this.update();
		}

		update(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINTS.NOTIFICACIONES}/outgoing/${this.name}/change`;
			$http.put(inserturl, this).then((response) => {
				if (response.data.status == 'OK'){
					response.data.task = 'update';
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		addNew(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINTS.NOTIFICACIONES}/outgoing`;
			$http.post(inserturl, this).then((response) => {
				if (response.data.status == 'OK'){
					response.data.task = 'new';
					this._id = response.data.data._id;
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		save(){
			if (this._id){
				return this.update();
			} else {
				return this.addNew()
			}
		}

		remove(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINTS.NOTIFICACIONES}/outgoing`;
			$http.delete(inserturl, {params: {_id: this._id}}).then((response) => {
				if (response.data.status == 'OK'){
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
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

		set mailList(mailList){
			this.mail.accounts = [];
			mailList.forEach((mail) => {
				this.mail.accounts.push(mail.text);
			});
		}

		set headers(headersList){
			this.req.headers = {};
			headersList.forEach((header) => {
				this.req.headers[header.name] = header.value;
			});
			console.log(this.req.headers);
		}

		get completeUrl(){
			return `${this.req.url}:${this.req.port}${this.req.path}`;
		}

	}

	return Outgoing;

}]);