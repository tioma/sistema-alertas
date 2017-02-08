/**
 * Created by kolesnikov-a on 07/02/2017.
 */
sistemaAlertas.controller('incomingCtrl', ['configFactory', 'Incoming', 'validatorService', 'dialogsService', function(configFactory, Incoming, validatorService, dialogsService){

	let vm = this;

	vm.incomings = [];
	vm.emailList = [];
	vm.editIncoming = new Incoming();
	vm.validator = validatorService;

	function getIncomings(){
		configFactory.getIncomings().then((incomings) => {
			vm.incomings = incomings;
			console.log(vm.incomings);
		});
	}

	vm.setIncoming = (incoming) => {
		vm.editIncoming = incoming;
		vm.emailList = [];
		vm.editIncoming.mail.accounts.forEach((mail) => {
			vm.emailList.push({text: mail});
		})
	};

	vm.resetForm = () => {
		vm.emailList = [];
		vm.editIncoming = new Incoming();
	};

	vm.saveIncoming = () => {
		if (vm.validator.checkMailList(vm.emailList, vm.editIncoming)){
			vm.editIncoming.mailList = vm.emailList;
			vm.editIncoming.save().then((data) => {
				dialogsService.notify('Monitoreo', `Los cambios en la tarea ${vm.editIncoming.name} se han guardado correctamente`);
				if (data.task == 'new'){
					vm.incomings.push(vm.editIncoming);
				}
				vm.resetForm();
			}).catch((error) => {
				dialogsService.error('Monitoreo', `Se produjo un error al intentar guardar los cambios. ${error}`);
			});
		} else {
			dialogsService.notify('Monitoreo', 'Al activar el envío de mails, se debe especificar al menos una dirección válida donde enviarlo');
		}
	};

	vm.deleteOutgoing = () => {
		const question = dialogsService.confirm('Monitoreo', `¿Desea eliminar la tarea ${vm.editIncoming.name}?`);
		question.result.then(() => {
			vm.editIncoming.remove().then((data) => {
				getIncomings();
				vm.resetForm();
			}).catch((error) => {
				dialogsService.error('Monitoreo', `Se produjo un error al borrar la tarea. ${error.data}`);
			});
		})
	};

	getIncomings();

}]);