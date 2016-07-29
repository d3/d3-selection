export default function(map) {
	if(map instanceof Object) {
		for(var key in map) {
			this.style(key, map[key]);
		}
	}
	return this;
}