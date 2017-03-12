/**
 * Created by Administrator on 2017/3/12.
 */
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('toEs5', () => {
    return gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('../dist'));
});