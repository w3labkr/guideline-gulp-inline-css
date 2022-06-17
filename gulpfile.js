const gulp = require('gulp');
const { src, dest, watch, series, parallel } = require('gulp');

const del = require('del');

const fileinclude = require('gulp-file-include');
const beautify = require('gulp-jsbeautifier');
const imagemin = require('gulp-imagemin');

const inlineCss = require('gulp-inline-css');

function clean() {
  return del(['dist/']);
}

function htmlTranspile() {
  return src(['src/index.html'])
    .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
    .pipe(inlineCss({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: true,
      removeLinkTags: true,
      preserveMediaQueries: false,
      applyWidthAttributes: false,
      applyTableAttributes: false,
      removeHtmlSelectors: true,
    }))
    .pipe(beautify())
    .pipe(dest('dist'));
}

function imageTranspile() {
  return src(['src/assets/images/**/*']).pipe(imagemin()).pipe(dest('dist/assets/images'));
}

exports.watch = function () {
  watch('src/**/*.html', htmlTranspile);
  watch('src/assets/images/**/*', imageTranspile);
};

exports.build = series(
  clean,
  parallel(htmlTranspile, imageTranspile)
);
