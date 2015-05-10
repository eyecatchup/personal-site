//
//  Mattia Astorino Persona Site
//  www.astorinomattia.it
//
//  Licensed under the MIT License
//  http://opensource.org/licenses/MIT
//  ————————————————————————————————————————————————————————————————————————————————————————————————


   // Paths settings
   var distPath        = './dist'; // Your "distribution" folder
   var cssPath         = '/css';   // Must be inside distPath
   var serverPath      = './dist'; // Local server root folder

   // Compiler settings
   var minifyCSS       = true;
   var srcPathLess     = './source/less';
   var srcPathTpl      = './source/jade';
   var srcPathIcns     = './source/icons';
   var notifyLogo      = './logo.png';
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
       svgstore        = require('gulp-svgstore'),
       svgmin          = require('gulp-svgmin'),
       notify          = require('gulp-notify');



   // Browser settings for browser-sync
   var browser_support = ['last 2 versions'];
   var browserReload   = browserSync.reload;






// JADE template compiler
// •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

   gulp.task('jadeCompiler', function() {
      return gulp.src( srcPathTpl + '/**/!(_)*.jade' )

      // run jade and prettify the html output
      .pipe(jade({
         pretty: true
      }))

      // save processed file
      .pipe( gulp.dest( distPath ) )

      // Show notification
      .pipe( notify({
         title: "Gulp Compiler",
         message: "HTML compilato con successo",
         icon: path.join( __dirname, notifyLogo )
      }))
   });



// LESS Task Compiler
// •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

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
         message: "CSS compilato con successo",
         icon: path.join( __dirname, notifyLogo )
      }))

   });



   // SVG SPRITE GENERATOR
   // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

   gulp.task('svgstore', function () {
      return gulp.src( srcPathIcns + '/*.svg' )
      .pipe( svgmin() )
      .pipe( svgstore() )
      .pipe( gulp.dest( distPath + '/assets/images' ) );
   });



// Base watcher task and reloader
// •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

   gulp.task('watch', function() {
      gulp.watch( srcPathLess + '/**/*.less', [ 'lessCompiler' ] );
      gulp.watch( srcPathTpl + '/**/*.jade', [ 'jadeCompiler' ] );
   });



// Browsersync static server + watching less/html files
// •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

   gulp.task( 'browser-sync', ['lessCompiler', 'jadeCompiler', 'svgstore'], function() {

      // browserSync options
      browserSync({
         server: {
            baseDir: serverPath
         }
      });

      // watching files and run compilers
      gulp.watch( srcPathLess + '/**/*.less', ['lessCompiler', browserSync.reload ] );
      gulp.watch( srcPathTpl + '/**/*.jade', ['jadeCompiler', browserSync.reload ] );
      gulp.watch( distPath + "/**/*.html" ).on( 'change', browserSync.reload );
      gulp.watch( srcPathIcns + '/*.svg', [ 'svgstore' ] );
   });



// Registered tasks
// •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

   gulp.task('default', [ 'lessCompiler', 'jadeCompiler', 'watch' ]);
   gulp.task('svg', [ 'svgstore' ]);
   gulp.task('server', [ 'browser-sync' ]);
