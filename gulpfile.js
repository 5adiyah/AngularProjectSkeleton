//////////////////// DEPENDENCIES ////////////////////

var gulp = require('gulp'),

    // used for concatenating/minifying bower files and other js/css
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),

    // set up server with watchers and run typescript compiler in the shell
    browserSync = require('browser-sync').create(),
    shell = require('gulp-shell'),

    // sass dependencies
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),

    // used for build and clean tasks.
    del = require('del'),
    utilities = require('gulp-util'),
    buildProduction = utilities.env.production;

  // used for pulling in bower files.
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

////////////////////// MY PATHS //////////////////////
var paths = {
    tsFiles: 'app/*.ts',
    tsDirectory: 'app/',
    jsFiles: 'resources/js/*.js',
    jsDirectory: 'resources/js/',
    scssFiles: 'resources/styles/*.scss',
    scssDirectory: 'resources/styles/'
};

////////////////////// DEFUALT TASK //////////////////////

// Runs build task (which runs sassBuild, bowerBuild, compiles ts, and starts server)
gulp.task('default', ['build', 'ts'], function(){
  // Runs the server and starts the watch task
  gulp.start('serve');
});

////////////////////// BUILD TASKS //////////////////////

// global build task with individual clean tasks as dependencies.
gulp.task('build', ['ts'], function(){
  // we can use the buildProduction environment variable here later.
  gulp.start('bower');
  gulp.start('sassBuild');
});

gulp.task('jsBuild', function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

gulp.task('cssBuild', ['sassBuild'], function(){
  browserSync.reload();
});

gulp.task('tsBuild', ['ts'], function(){
  browserSync.reload();
});

////////////////////// WATCH TASK //////////////////////

gulp.task('watch', function(){
  gulp.watch([paths.jsFiles], ['jsBuild']); // vanilla js changes, reload.
  gulp.watch(['*.html'], ['htmlBuild']); // html changes, reload.
  gulp.watch([paths.scssFiles], ['cssBuild']); // css or sass changes, concatenate all css/sass, build, reload.
  gulp.watch([paths.tsFiles], ['tsBuild']); // typescript files change, compile then reload.
});

////////////////////// SERVER (BROWSERSYNC) //////////////////////

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });

  gulp.start('watch');
});

///////////////////////// SASS /////////////////////////

gulp.task('sassBuild', function() {
  return gulp.src(['resources/styles/*']) //grabs all scss files, compiles them to css
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'));
});


////////////////////// TYPESCRIPT //////////////////////

// clean task, removes all of the generated .js files and their .map files so that we are sure that we get the most recent versions of our code.
gulp.task('tsClean', function(){
  return del(['app/*.js', 'app/*.js.map']);
});

// clean and then compile once. To be called from server and global build.
gulp.task('ts', ['tsClean'], shell.task([
  'tsc'
]));

///////////////////////// BOWER /////////////////////////
// when adding a new bower depndency:
// stop the server
// always use the `bower install --save` flag.
// run `gulp bower` to build vendor files
// restart server.

gulp.task('jsBowerClean', function(){
  return del(['./build/js/vendor.min.js']);
});

//CREATES FILE FOR VENDOR JSv
gulp.task('jsBower', ['jsBowerClean'], function() {
  return gulp.src(lib.ext('js').files) //grabs all the vendor js files
    .pipe(concat('vendor.min.js')) //concats them
    .pipe(uglify()) //uglifies them
    .pipe(gulp.dest('./build/js')); //moves them to the build/js folder
});

gulp.task('cssBowerClean', function(){
  return del(['./build/css/vendor.css']);
});

//CREATES FILE FOR VENDOR CSS
gulp.task('cssBower', ['cssBowerClean'], function() {
  return gulp.src(lib.ext('css').files) //grabs all the vendor css fiels
    .pipe(concat('vendor.css')) //concats them
    .pipe(gulp.dest('./build/css')); //moves them to the build/css folder
});

//Bower Task
gulp.task('bower', ['jsBower', 'cssBower']); //when you run bower, it runs both jsBower and cssBower


////////////////////// SETUP NOTES //////////////////////

/*
- clone repo
- npm install
- bower install
- install globals if needed (gulp, bower, sass, typescript, typescript packages.)
  - npm install gulp -g
  - npm install bower -g
  - gem install sass
  - npm install typescript -g
  - apm install atom-typescript
- gulp build
- gulp
*/
