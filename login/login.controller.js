/**
 * Created by kolesnikov-a on 13/02/2017.
 */
sistemaAlertas.controller('loginCtrl', ['Session', '$state', function(Session, $state){

	let vm = this;

	vm.session = Session;

	if (vm.session.isAuthenticated) $state.transitionTo('notifications');

	vm.login = () => {
		vm.session.login().then(() => {
			$state.transitionTo('notifications');
		}).catch((error) => {

		});
	}

}]);