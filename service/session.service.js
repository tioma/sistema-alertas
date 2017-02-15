/**
 * Created by kolesnikov-a on 04/05/2016.
 */
sistemaAlertas.service('Session', ['storageService', '$http', 'API_ENDPOINTS', '$q', '$state', function(storageService, $http, API_ENDPOINTS, $q, $state){

    class Session {
        constructor(){
            this.data = {
                USUARIO: '',
                CLAVE: ''
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

            /*$http.post(inserturl, this.data).then((response) => {
                this.userData = response.data.data;
                this.token = response.data.data.token;
                deferred.resolve(response);
            }).catch((response) => {
                deferred.reject(response);
            });*/

            this.userData = {
                name: 'UsuarioPrueba',
                role: 'admin',
                token: 'untokenloco',
                tasks: ['Monitoreo', 'Facturación terminales', 'Gates terminales', 'Turnos terminales', 'Giro de buques', 'e-PuertoBue']
            };
            this.token = 'untokenloco';
            deferred.resolve();

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
            this.data.name = userData.name;
            this.data.token = userData.token;
            this.data.role = userData.role;
            this.data.tasks = userData.tasks;
            this.data.user = userData.user;

            storageService.setObject('user', this.data);

        }

        get role(){
            return this.data.role;
        }

        get name(){
            return this.data.name;
        }

        get tasks(){
            return this.data.tasks;
        }

        get isAuthenticated(){
            return (this.token !== null);
        }

        logOut(){
            this.data = {
                USUARIO: '',
                CLAVE: ''
            };
            storageService.deleteKey('user');
            storageService.deleteKey('token');
            $state.transitionTo('login');
        }
    }

    return new Session();

}]);