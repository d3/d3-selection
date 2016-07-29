export default function(settings) {
	if(settings instanceof Object) {
		for(var key in settings) {
			this.style(key, settings[key]);
		}
	}
	return this;
}