var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('bundle', function() {
  return gulp.src(['../node_modules/angular/angular.js','../node_modules/angular-cookies/angular-cookies.js','../node_modules/angular-route/angular-route.js','../controllers/*.js', '../services/*.js', '../app.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./'));
});