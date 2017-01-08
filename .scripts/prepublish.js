require('shelljs/global')
var path = require('path')

console.log("> Start transpiling ES2015")

rm('-rf', 'dist')

var babel = ['node_modules', '.bin', 'babel'].join(path.sep);
env['NODE_ENV'] = 'production';
exec(babel + " --ignore __tests__,tests,stories --plugins transform-runtime src --out-dir dist")
cp('-Rf', ['src/static/'], 'dist/static/')

console.log("> Complete transpiling ES2015")

exec('node .scripts/user/prepublish.js')
echo('> Finished')
