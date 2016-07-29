export default function(settings) {
	if(settings instanceof Object) {
		for(var key in settings) {
			this.attr(key, settings[key]);
		}
	}
	return this;
}