export default function(map) {
	if(map instanceof Object) {
		for(var key in map) {
			this.attr(key, map[key]);
		}
	}
	return this;
}