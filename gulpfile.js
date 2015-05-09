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

   // Compiler settings
   var minifyCSS       = true;









// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// ------------------------- DO NOT EDIT AFTER THIS ----------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


// Compiler settings
// #############################################################################

   var srcPath         = './src/less';
   var notifyLogo      = './assets/jelly.png';
   var defaultCSS      = false;

   // Browser support for browser-sync
   var browser_support = ['last 2 versions'];

   // Modules loader
   var gulp            = require('gulp'),
       browserSync     = require('browser-sync'),
       path            = require('path'),
       lessGlob        = require('less-plugin-glob'),
       less            = require('gulp-less'),
       autoprefixer    = require('gulp-autoprefixer'),
       minifycss       = require('gulp-minify-css'),
       rename          = require('gulp-rename'),
       newer           = require('gulp-newer'),
       gulpif          = require('gulp-if'),
       runSequence     = require('run-sequence'),
       notify          = require('gulp-notify');



// LESS Task Compiler
// #############################################################################

   // Minify setting override
   if ( minifyCSS == true ) { var defaultCSS = false; }
   else if ( minifyCSS == false ) { var defaultCSS = true; }

   // Compiler
   gulp.task('compiler', function() {
      return gulp.src( srcPath + '/main.less' )

      .pipe( newer( distPath + cssPath ) )

      // Running less parser
      .pipe(less({
         paths: [ path.join( __dirname, srcPath ) ],
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



// Browsersync static server + watching less/html files
// #############################################################################

   gulp.task( 'browser-sync', ['compiler'], function() {

      // browserSync options
      browserSync({
         server: {
            baseDir: serverPath
         }
      });

      // watching files and run "compiler" task
      gulp.watch( srcPath + '/**/*.less', ['compiler', browserSync.reload] );
      gulp.watch( distPath + "/**/*.html" ).on( 'change', browserSync.reload );
   });



// Base watcher task
// #############################################################################

   gulp.task('watch', function() {
      gulp.watch( srcPath + '/**/*.less', ['compiler'] );
   });



// Registered tasks
// #############################################################################

   gulp.task('default', ['compiler', 'watch']);
   gulp.task('server', ['browser-sync']);
