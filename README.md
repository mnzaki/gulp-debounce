# [gulp](https://github.com/gulpjs/gulp)-debounce
[![NPM version][npm-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]

Stream debouncing that works.

This plugin will debounce a stream, that means it will remove/collect duplicate
successive events and emit just one after a short timeout. This is useful if you
want to prevent unnecessary triggering of build logic when a file is changing
too fast. For example because [vim][vim-answer] (or [Coda 2][coda-question]) is saving a copy
and then deleting and moving the file, causing three events to trigger instead
of one and your build system to churn along unnecessarily.


## Installation

`npm install --save-dev gulp-debounce`

## Usage

You can use it to prevent unnecessary sass rebuilds:
```js
var gulp       = require('gulp'),
    size       = require('gulp-size'),
    sass       = require('gulp-sass'),
    watch      = require('gulp-watch'),
    debounce   = require('gulp-debounce'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('watch', function () {
  return gulp.src('src/**/*.scss')
    .pipe(watch('src/**/*.scss'))
    .pipe(debounce({ wait: 1000 }))
    // whenever a scss file changes before 1000ms have elapsed
    // since the last change, then the event will not be passed along
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .pipe(size({showFiles: true}));
});
```

## API

### debounce([options])

Creates a pass through stream that will debounce events passing through it,
bundling similar events into just one.

#### Options

#### options.wait
Type: `Number`
Default: `1000`

> Milliseconds to wait before letting an event through. If another event similar
> to this one arrives in that time period, then the timer is restarted and another
> `wait` interval must pass.

#### options.immediate
Type: `Boolean`
Default: `false`

> When `true`, the first event to arrive passes through, and then all other
> matching events are dropped until the `wait` interval elapses.
> You do *not* normally want this, use at your own risk.

#### options.hashingFn
Type: `Function`
Default: `function (vinyl) { return vinyl.path; }`

> The function used to hash events for comparison. The default is to use the
> file path for comparison.

You could, for example, differentiate between `add`/`change` and `other`
events:

```js
gulp.watch('src/**/*.scss')
.pipe(debounce({
  wait: 1000,
  hashingFn: function (vinyl) {
    // this function will hash add/change events to:
    // "true-path/from/vinyl/object"
    // and all other events to
    // "false-path/from/vinyl/object"
    var t = vinyl.event === 'add' || vinyl.event === 'change';
    return t+"-"+vinyl.path;
  }
}))
```

## License

MIT (c) 2016 Mina Nagy Zaki (mnzaki@gmail.com)

[npm-url]: https://npmjs.org/package/gulp-debounce
[npm-image]: http://img.shields.io/npm/v/gulp-debounce.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dt/gulp-debounce.svg

[depstat-url]: https://david-dm.org/mnzaki/gulp-debounce
[depstat-image]: http://img.shields.io/david/mnzaki/gulp-debounce.svg?style=flat

[coda-question]: http://stackoverflow.com/questions/21608480/gulp-js-watch-task-runs-twice-when-saving-files
[vim-answer]: http://stackoverflow.com/a/23309948/2115616
