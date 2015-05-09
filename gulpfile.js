 //
//  Jelly Frontend Framework
//  Developed with love by Mattia Astorino and some awesome peoples
//  www.jellyframework.com
//
//  Licensed under the MIT License
//  https://www.apache.org/licenses/LICENSE-2.0
//  ____________________________________________________________________________


// USER settings. Edit this for customizing your paths folder.
// #############################################################################

   // Paths settings
   var distPath        = './dist'; // Your "distribution" folder
   var cssPath         = '/css';   // Must be inside distPath
   var serverPath      = './dist'; // Local server root folder

   // Less Compiler settings
   var minifyCSS       = true;









// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// ------------------------- DO NOT EDIT AFTER THIS ----------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


// Less Compiler settings
// #############################################################################

   var srcPathLess     = './src/less';
   var srcPathTpl      = './src/jade';
   var notifyLogo      = './assets/jelly.png';
   var defaultCSS      = false;

   // Modules loader
   var gulp            = require('gulp'),
       browserSync     = require('browser-sync'),
       path            = require('path'),
       jade            = require('gulp-jade'),
       lessGlob        = require('less-plugin-glob'),
       less            = require('gulp-less'),
       autoprefixer    = require('gulp-autoprefixer'),
       minifycss       = require('gulp-minify-css'),
       rename          = require('gulp-rename'),
       newer           = require('gulp-newer'),
       gulpif          = require('gulp-if'),
       runSequence     = require('run-sequence'),
       notify          = require('gulp-notify');



   // Browser settings for browser-sync
   var browser_support = ['last 2 versions'];
   var browserReload   = browserSync.reload;






// JADE template compiler
// #############################################################################

   gulp.task('jadeCompiler', function() {
      return gulp.src( srcPathTpl + '/**/*.jade' )

      // run jade and prettify the html output
      .pipe(jade({
         pretty: true
      }))

      .pipe( gulp.dest( distPath ) )
   });



// LESS Task Compiler
// #############################################################################

   // Minify setting override
   if ( minifyCSS == true ) { var defaultCSS = false; }
   else if ( minifyCSS == false ) { var defaultCSS = true; }

   // Less Compiler
   gulp.task('lessCompiler', function() {
      return gulp.src( srcPathLess + '/style.less' )

      // check if files changed
      .pipe( newer( distPath + cssPath ) )

      // Running less parser
      .pipe(less({
         paths: [ path.join( __dirname, srcPathLess ) ],
         plugins: [lessGlob]
      }))

      // Running autoprefixer and write original file
      .pipe( autoprefixer({ browsers: browser_support }) )
      .pipe( gulpif( defaultCSS, gulp.dest( distPath + cssPath ) ) )

      // Minifing and write min files
      .pipe( gulpif( minifyCSS, rename( {suffix: '.min'} ) ) )
      .pipe( gulpif( minifyCSS, minifycss() ) )
      .pipe( gulp.dest( distPath + cssPath ) )


      // Show notification
      .pipe( notify({
         title: "Gulp Compiler",
         message: "CSS compilato con successo"
      }))

   });



// Base watcher task and reloader
// #############################################################################

   gulp.task('watch', function() {
      gulp.watch( srcPathLess + '/**/*.less', [ 'lessCompiler' ] );
      gulp.watch( srcPathTpl + '/**/*.jade', [ 'jadeCompiler' ] );
   });



// Browsersync static server + watching less/html files
// #############################################################################

   gulp.task( 'browser-sync', ['lessCompiler', 'jadeCompiler'], function() {

      // browserSync options
      browserSync({
         server: {
            baseDir: serverPath
         }
      });

      // watching files and run "lessCompiler" task
      gulp.watch( srcPathLess + '/**/*.less', ['lessCompiler', browserSync.reload ] );
      gulp.watch( srcPathTpl + '/**/*.jade', ['jadeCompiler', browserSync.reload ] );
      gulp.watch( distPath + "/**/*.html" ).on( 'change', browserSync.reload );
   });



// Registered tasks
// #############################################################################

   gulp.task('default', [ 'lessCompiler', 'jadeCompiler', 'watch' ]);
   gulp.task('server', [ 'browser-sync' ]);
