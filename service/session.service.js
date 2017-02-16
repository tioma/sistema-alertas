/**
 * Created by kolesnikov-a on 04/05/2016.
 */
sistemaAlertas.service('Session', ['storageService', '$http', 'API_ENDPOINTS', '$q', '$state', function(storageService, $http, API_ENDPOINTS, $q, $state){

    class Session {
        constructor(){
            this.data = {
                email: '',
                password: '',
                group: []
            };

            if (storageService.getKey('token') !== null){
                this.reloadData();
            }
            /*if (storageService.getSessionKey('token') !== null){
                this.reloadData(false)
            }*/
        }

        login(){
            const deferred = $q.defer();
            const inserturl = `http://${API_ENDPOINTS.NOTIFICACIONES}/login`;

            $http.post(inserturl, this.data).then((response) => {
                console.log(response);
                this.userData = response.data.data;
                this.token = response.data.data.token;
                deferred.resolve(response);
            }).catch((response) => {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        reloadData(){
            let user = null;
            user = storageService.getObject('user');
            angular.extend(this.data, user);
        }

        set token(token){
            storageService.setKey('token', token);
        }

        get token(){
            return storageService.getKey('token');
        }

        set userData(userData){
            //angular.extend(this.data, userData);
            //this.data.full_name = userData.full_name;
            this.data.firstname = userData.firstname;
            this.data.lastname = userData.lastname;
            this.data.token = userData.token;
            this.data.role = userData.role;
            this.data.group = userData.group;
            this.data.user = userData.user;

            storageService.setObject('user', this.data);

        }

        get isAdmin(){
            return this.data.group.indexOf('ADMIN') != -1;
        }

        get name(){
            return `${this.data.firstname} ${this.data.lastname}`;
        }

        get tasks(){
            return this.data.group;
        }

        get isAuthenticated(){
            return (this.token !== null);
        }

        logOut(){
            this.data = {
                email: '',
                password: '',
                group: []
            };
            storageService.deleteKey('user');
            storageService.deleteKey('token');
            $state.transitionTo('login');
        }
    }

    return new Session();

}]);