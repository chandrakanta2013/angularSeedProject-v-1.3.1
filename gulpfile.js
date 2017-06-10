/* File: gulpfile.js for angularSeedProject v-1.3.1 */
/*Gupt module*/
var gulp = require('gulp');

/*JShint modules*/
var jshint = require('gulp-jshint');

/*JS minify modules*/
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var minify = require('gulp-minify');
var gulpIgnore = require('gulp-ignore');
var fs = require("fs");
var path = require('path');

/* HTML minify Modules */
var minifyHTML = require('gulp-minify-html');

/*Image minify module*/
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');

/* CSS Minify Modules */
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

/*Creating dynamic files*/
var template = require('gulp-template');
var tap = require('gulp-tap');
var argv = require('yargs');

/*Creating components Modules*/
var template = require('gulp-template');
var tap = require('gulp-tap');

var argv = require('yargs').argv;
var rename = require("gulp-rename");

/* saas compilation */
var sass = require('gulp-sass');
var compass = require('gulp-compass')


// define the default task and add the watch task to it
gulp.task('default', ['watch','js-libs','ng-libs','app-common-min-js','app-components-js','app-common-js','app-common-html','app-components-html','app-components-styles','css-libs','sass','assets-styles','fontmin','imagemin']);


/*########################
# Creating components dynamically #
#########################*/
function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

var sp = "samples", dp = "src/app/components";

gulp.task('create-comps', function() {
    var folders = getFolders(sp);
    console.log(path.join(dp, argv.dirname))
    return gulp.src([path.join(sp, '/*.html'),path.join(sp, '/*.js'),path.join(sp, '/*.css')])
        .pipe(template({
              sourcefile: argv.dirname
            }))
        .pipe(rename(function (path) {
            
            path.basename = argv.dirname+path.basename;
            path.extname = path.extname
          }))
        .pipe(gulp.dest(path.join(dp, argv.dirname)));
});



/*########################
# JavaScript Tasks #
#########################*/

gulp.task('jshint-one', function() {
    return gulp.src('src/app/common/services/constants.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

});

/* Jshint task*/
gulp.task('jshint', function() {
    return gulp.src('src/app/components/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

});

/* JS Minify task*/
gulp.task('js-libs', function() {
    gulp.src([
            "src/assets/vendor/jquery/dist/jquery.js",
            "src/assets/vendor/bootstrap/dist/js/bootstrap.min.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('js.lib.js'))
        //only uglify if gulp is ran with '--type production'
        //.pipe(1 ? uglify() : gutil.noop())
        .pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets/js'));
});
/* Angular library Minify task*/
gulp.task('ng-libs', function() {
    gulp.src([
            "src/assets/vendor/angular/angular.min.js",
            "src/assets/vendor/angular-ui-router/release/angular-ui-router.min.js",
            "src/assets/vendor/angular-cookies/angular-cookies.min.js",
            "src/assets/vendor/oclazyload/dist/ocLazyLoad.min.js",
            "src/assets/vendor/angular-sanitize/angular-sanitize.min.js",
            "src/assets/vendor/angular-local-storage/dist/angular-local-storage.min.js",
            "src/assets/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js",
            "src/assets/vendor/angular-animate/angular-animate.min.js",
            "src/assets/vendor/angular-messages/angular-messages.min.js",
            "src/assets/vendor/angular-material/angular-material.min.js",
            "src/assets/vendor/angular-aria/angular-aria.min.js",
            "src/assets/js/pace/pace.min.js"            

        ])
        .pipe(sourcemaps.init())
        .pipe(concat('ng.libs.js'))
        .pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets/js'));
});

gulp.task('app-common-min-js', function() {
    gulp.src([
            "src/app/common/services/configs.js",
            "src/app/common/services/defaultServices.js",
            "src/app/common/services/authenticationServices.js",
            "src/app/common/directives/commonDirectives.js",
            "src/app/common/controllers/MainController.js",
            "src/app/common/router/route.js",
            "src/app/common/router/user.route.js",
            "src/app/common/router/admin.route.js",
            "src/app/common/services/user.api.services.js",
            "app.js"

        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.common.js'))
        .pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets/js'));
});

/* Angular application files Minify task*/

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString())
    this.emit('end')
}
var componentsSrcPath = "src/app/components"; 
var componentsDstPath = "build/app/components";
gulp.task('app-components-js', function() {
    var folders = getFolders(componentsSrcPath);
    folders.map(function(folder) {
        return gulp.src(path.join(componentsSrcPath, folder, '/*.js'))
            // concat into foldername.js
            //.pipe(concat(folder + '.js'))
            // write to output
            .pipe(minify({
                ext: {
                    src: '-debug.js',
                    min: '.js'
                }
            }))
            .on('error', swallowError)
            .pipe(gulp.dest(path.join(componentsDstPath, folder)));
    });


});

/* Angular common application files Minify task*/
var commonPath = "src/app/common";
gulp.task('app-common-js', function() {
    var folders_common = getFolders(commonPath);
    folders_common.map(function(folder) {
        return gulp.src(path.join(commonPath, folder, '/*.js'))
            // concat into foldername.js
            //.pipe(concat(folder + '.js'))
            // write to output
            .pipe(minify({
                ext: {
                    src: '-debug.js',
                    min: '.js'
                }
            }))
            .on('error', swallowError)
            .pipe(gulp.dest(path.join('build/app/common', folder)));
    });


});


/*########################
# HTML Tasks #
#########################*/
/* minify common HTML pages */
gulp.task('app-common-html', function() {
    var htmlSrc = 'src/app/common',
        htmlDst = 'build/app/common';
    var folders_common_html = getFolders(htmlSrc);
    folders_common_html.map(function(folder) {
        return gulp.src(path.join(htmlSrc, folder, '/*.html'))
            .pipe(changed(htmlDst))
            // write to output
            .pipe(minifyHTML())

        .pipe(gulp.dest(path.join(htmlDst, folder)));
    });

});

/* minify common HTML pages */
gulp.task('app-components-html', function() {
    var htmlSrc1 = 'src/app/components',
        htmlDst1 = 'build/app/components';
    var folders_html = getFolders(htmlSrc1);
    folders_html.map(function(folder) {
        return gulp.src(path.join(htmlSrc1, folder, '/*.html'))
            .pipe(changed(htmlDst1))
            // write to output
            .pipe(minifyHTML())

        .pipe(gulp.dest(path.join(htmlDst1, folder)));
    });

});

gulp.task('html-v', function () {
    var validate = require('html-angular-validate');
     
    validate.validate(
        ["src/app/components/**/*.html", "src/app/common/**/*.html"],
        {
            angular:true,
            customtags:['ng-*'],
            relaxerror: [
                        'Start tag seen without seeing a doctype first.',
                        'Element “head” is missing a required instance of child element “title”'
                    ]
        }
    ).then(function(result) {
            if (result.allpassed) {
                console.log('HTML validator passed all files successfully');
            } else {
                console.log('HTML validator found errors for ' +
                            result.filesfailed +
                            ' out of ' +
                            result.fileschecked +
                            ' files total\n==========');
         
                for (var fileerr in result.failed) {
                    console.log('  ' +(parseInt(fileerr)+1) + ' => '+
                                result.failed[fileerr].filepath +
                                ' has '+
                                result.failed[fileerr].numerrs +
                                ' errors'
                                );
                    for (var err in result.failed[fileerr].errors) {
                        console.log('    [' +
                                    result.failed[fileerr].errors[err].line +
                                    ':' +
                                    result.failed[fileerr].errors[err].col +
                                    '] ' +
                                    result.failed[fileerr].errors[err].msg);
                    }
                    console.log('\n -------------')
                }
            }
        }, function(err) {
            console.log('HTML validator error: ' + err);
        });
});

/*########################
# CSS Tasks #
#########################*/
// CSS concat, auto-prefix and minify

gulp.task('app-components-styles', function() {
    var cssSrc = 'src/app/components', cssDst = 'build/app/components/';
    var folders_css = getFolders(cssSrc);
    folders_css.map(function(folder) {
        return gulp.src(path.join(cssSrc, folder, '/*.css'))
            .pipe(changed(cssDst))
            //.pipe(concat(folder + '.css')
            // write to output
            .pipe(minifyCSS())
            .pipe(gulp.dest(path.join(cssDst, folder)));
    });

});

gulp.task('assets-styles', function() {
    var cssSrc1 = 'src/assets', cssDst1 = 'build/assets';
    var folders_css = getFolders(cssSrc1);
    folders_css.map(function(folder) {
        return gulp.src(path.join(cssSrc1, folder, '/*.css'))
        .pipe(changed(cssDst1))
            //.pipe(concat(folder + '.css')
            // write to output
            .pipe(minifyCSS())
            .pipe(gulp.dest(path.join(cssDst1, folder)));
            });

    });  

gulp.task('css-libs', function() {
  gulp.src([
    'src/assets/css/bootstrap.min.css',
    'src/assets/css/bootstrap-theme.min.css',
    'src/assets/css/font-awesome.min.css',
    'src/assets/css/animation.css',
    'src/assets/css/pace.css',
    // 'src/assets/css/styles.css',
    // 'src/assets/css/responsive.css',
    // 'src/assets/css/print.css'
    ])
    .pipe(concat('styles-min.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/assets/css'));
});

/* css compilation form scss*/
gulp.task('sass', function () {
  return gulp.src('src/assets/scss/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError)) /* expanded / compact / compressed*/
    //.pipe(sass.sync().on('error', sass.logError))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('src/assets/css'));
});

gulp.task('compass', function() {
  gulp.src('src/assets/scss/*.scss')
    .pipe(compass({
      css: 'src/assets/css',
      sass: 'src/assets/scss',
      image: 'src/assets/images'
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('assets/css'));
});

/* Fonts minigy task*/
gulp.task('fontmin', function() {
    gulp.src('src/assets/fonts/*')
        .pipe(gulp.dest('build/assets/fonts'));
});

/* W3c css validation */
var cssvalidate = require('gulp-w3c-css');
gulp.task('css-v', function() {
  gulp.src(['src/assets/css/styles.css','src/assets/css/responsive.css'])
  .pipe(cssvalidate())
  .pipe(gulp.dest('src/assets/css/csserr'));
});
/*########################
# Images Tasks #
#########################*/
/* Images minigy task*/
gulp.task('imagemin', function() {
    var imgSrc = 'src/assets/img/*',
        imgDst = 'build/assets/img';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('src/assets/vendor/**/*.js', ['js-libs','ng-libs']);
    gulp.watch('src/app/common/**/*.js', ['app-common-js','app-common-min-js']);
    gulp.watch('app.js', ['app-common-js','app-common-min-js']);
    gulp.watch('src/app/components/**/*.js', ['app-components-js']);
    gulp.watch('src/app/common/**/*.html', ['app-common-html']);
    gulp.watch('src/app/components/**/*.html', ['app-components-html']);
    gulp.watch('src/app/components/**/*.css', ['app-components-styles']);
    gulp.watch('src/assets/scss/*.scss', ['sass']);
    gulp.watch('src/assets/css/*.css', ['assets-styles','css-libs']);
    gulp.watch('src/assets/img/*', ['imagemin']);
    gulp.watch('src/assets/fonts/*', ['fontmin']);
});