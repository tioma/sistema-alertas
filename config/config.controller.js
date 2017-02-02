/**
 * Created by kolesnikov-a on 01/02/2017.
 */
sistemaAlertas.controller('configCtrl', ['configFactory', 'Outgoing', function(configFactory, Outgoing){

	const vm = this;

	vm.editOutgoing = new Outgoing();

	vm.outgoings = [];

	vm.resetSchedule = () => {
		vm.schedule = {
			second: {
				value: '',
				min: 1
			},
			minute: {
				value: '',
				min: 0
			},
			hour: {
				value: '',
				min: 0
			},
			day: {
				value: ''
			},
			month: {
				value: ''
			},
			repeat: 0
		};
	};

	vm.daysOfWeek = [
		{ day: "D", repeat: false, value: 0 },
		{ day: "L", repeat: false, value: 1 },
		{ day: "M", repeat: false, value: 2 },
		{ day: "M", repeat: false, value: 3 },
		{ day: "J", repeat: false, value: 4 },
		{ day: "V", repeat: false, value: 5 },
		{ day: "S", repeat: false, value: 6 }
	];

	configFactory.getOutgoings().then((data) => {
		console.log(data);
		vm.outgoings = data;
	}).catch((error) => {
		console.log(error);
	});

	vm.setSchedule = () => {
		switch (vm.schedule.repeat){
			case 0:
				vm.schedule.second.min = 1;
				vm.schedule.minute.value = '';
				vm.schedule.hour.value = '';
				vm.schedule.day.value = '';
				vm.schedule.month.value = '';
				break;
			case 1:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 1;
				vm.schedule.hour.value = '';
				vm.schedule.day.value = '';
				vm.schedule.month.value = '';
				break;
			case 2:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 1;
				vm.schedule.day.value = '';
				vm.schedule.month.value = '';
				break;
			case 3:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 0;
				vm.schedule.month.value = '';
				break;
			case 4:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 0;
				break;
			case 5:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 0;
				vm.schedule.month.value = vm.schedule.month.value || 1;
				vm.schedule.day.value = vm.schedule.day.value || 1;
				vm.schedule.hour.value = vm.schedule.hour.value || 0;
				vm.schedule.minute.value = vm.schedule.minute.value || 0;
				vm.schedule.second.value = vm.schedule.second.value || 0;
				vm.daysOfWeek.forEach((day) => {
					day.repeat = false;
				})
		}
	};

	vm.setOutgoing = (outgoing) => {
		vm.editOutgoing = outgoing;
		vm.daysOfWeek.forEach((day) => {
			day.repeat = (vm.editOutgoing.cron.dayOfWeek.indexOf(day.value) != -1);
		});
		vm.resetSchedule();
		if (angular.isDefined(vm.editOutgoing.cron.second)){
			vm.schedule.second.value = vm.editOutgoing.cron.second;
			vm.schedule.repeat = 0;
		}
		if (angular.isDefined(vm.editOutgoing.cron.minute)){
			vm.schedule.minute.value = vm.editOutgoing.cron.minute;
			vm.schedule.repeat = 1;
		}
		if (angular.isDefined(vm.editOutgoing.cron.hour)){
			vm.schedule.hour.value = vm.editOutgoing.cron.hour;
			vm.schedule.repeat = 2;
		}
		if (angular.isDefined(vm.editOutgoing.cron.day)){
			vm.schedule.day.value = vm.editOutgoing.cron.day;
			vm.schedule.repeat = 3;
		}
		if (angular.isDefined(vm.editOutgoing.cron.month)){
			vm.schedule.month.value = vm.editOutgoing.cron.month;
			vm.schedule.repeat = 4;
		}
		vm.setSchedule();
	};

	vm.resetForm = () => {
		vm.editOutgoing = new Outgoing();
		vm.resetSchedule();
		vm.daysOfWeek.forEach((day) => {
			day.repeat = false;
		})
	};

	vm.saveOutgoing = () => {
		let daysRepeat = 0;
		vm.daysOfWeek.forEach((day) => {
			if (day.repeat) daysRepeat++;
		});
		if (vm.schedule.repeat <= 4 && daysRepeat > 0){
			vm.editOutgoing.schedule = vm.schedule;
			vm.editOutgoing.daysOfWeek = vm.daysOfWeek;
			vm.editOutgoing.save().then((data) => {
				console.log(data);
			}).catch((error) => {
				console.log(error)
			});
		} else {
			console.log('no te guardo nada porque tenes que marcar al menos 1 dia');
		}

	};

	vm.resetSchedule();

}]);