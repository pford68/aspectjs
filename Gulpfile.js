'use strict';

const { src, series, task } = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const jshint = require('gulp-jshint');
const jasmine = require('gulp-jasmine');
const main = './index.js';


//======================================================================== Tasks
/*
Generates JSDoc
 */
task('doc', cb => {
    src(['README.md', main], {read: false})
        .pipe(jsdoc(cb));
});


/*
 Linting
 */
task('lint', () => {
    return src(main)
        .pipe(jshint('.jshintrc'))
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});


/*
Test task
 */
task('test', done => {
    src('test/spec/*.js').pipe(jasmine());
    done();
});


task('default', series('lint', 'test', 'doc'));
