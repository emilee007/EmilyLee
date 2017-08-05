console.log('Building JS files for production...');


var buildify = require('buildify');
var modules = require('../assets.json');

for (var p in modules) {
	if(modules.hasOwnProperty(p)){

		buildify()
			.clear()
			.concat(modules[p].js)
			.uglify()
			.save('dist/js/' + p + '.js');
	}
}