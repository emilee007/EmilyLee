console.log('Building JS files...');


var buildify = require('buildify');
var modules = require('../assets.json');

for (var p in modules) {
	if(modules.hasOwnProperty(p)){

		buildify()
			.clear()
			.concat(modules[p].js)
			.save('dist/js/' + p + '.js');
	}
}