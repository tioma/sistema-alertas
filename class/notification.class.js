/**
 * Created by kolesnikov-a on 14/02/2017.
 */
sistemaAlertas.factory('Notification', [function(){

	class Notification {

		constructor(notificationData){
			angular.extend(this, notificationData);

			if (this.type == 'ERROR'){
				this.class = 'notification-alert';
				this.soundPath = 'audio/tonoAlarma.mp3';
			} else if(this.type == 'WARN'){
				this.class = 'notification-warning';
				this.soundPath = 'audio/tonoAlerta.mp3';
			} else {
				this.class = 'notification-info';
				this.soundPath = 'audio/tonoAviso.mp3';
			}

		}

		playSound(){
			let audio = document.createElement('audio');
			audio.style.display = "none";
			audio.src = this.soundPath;
			audio.autoplay = true;
			audio.onended = () => {
				audio.remove(); //Remove when played.
			};
			document.body.appendChild(audio);
		}
	}

	return Notification;
}]);