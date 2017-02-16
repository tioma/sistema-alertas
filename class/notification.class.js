/**
 * Created by kolesnikov-a on 14/02/2017.
 */
sistemaAlertas.factory('Notification', [function(){

	class Notification {

		constructor(notificationData){
			angular.extend(this, notificationData);

			if (this.type){
				this.playSound();
			} else {
				this.type = this.status;
			}

		}

		playSound(){
			let audio = document.createElement('audio');
			audio.style.display = "none";
			audio.src = this.notificationSound;
			audio.autoplay = true;
			audio.onended = () => {
				audio.remove(); //Remove when played.
			};
			document.body.appendChild(audio);
		}

		get notificationStyle(){
			if (this.type == 'ERROR'){
				return 'notification-alert';
			} else if(this.type == 'WARN'){
				return 'notification-warning';
			} else {
				return 'notification-info';
			}
		}

		get notificationSound(){
			if (this.type == 'ERROR'){
				return 'audio/tonoAlarma.mp3';
			} else if(this.type == 'WARN'){
				return 'audio/tonoAlerta.mp3';
			} else {
				return 'audio/tonoAviso.mp3';
			}
		}

		get notificationTextStyle(){
			if (this.type == 'ERROR'){
				return 'text-danger';
			} else if(this.type == 'WARN'){
				return 'text-warning';
			} else {
				return 'text-info';
			}
		}
	}

	return Notification;
}]);