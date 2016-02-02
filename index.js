'use strict';

var through = require('through');

function debounceHashed(fn, hashingFn, interval, immediate) {
  var calls = {}

  function ap(f, d) {
    return f.apply(d.context, d.args);
  }

  function debounced() {
    var hash = hashingFn.apply(this, arguments);
    var prevCall = calls[hash];
    var callNow = immediate && !prevCall;

    if (prevCall) {
      clearTimeout(prevCall.timeout);
    }

    function later() {
      var data = calls[hash];
      delete calls[hash];
      if (!immediate) ap(fn, data);
    }

    calls[hash] = {
      context: this,
      args: arguments,
      timeout: setTimeout(later, interval)
    };

    if (callNow) ap(fn, calls[hash]);
  }

  debounced.flush = function() {
    Object.keys(calls).forEach(function(hash) {
      var call = calls[hash];
      delete calls[hash];
      clearTimeout(call.timeout);
      ap(fn, call);
    });
  };

  return debounced;
}

var defaultOptions = {
  hashingFn: function (data) {
    return data.path;
  },
  wait: 1000,
  immediate: false
};

function gulpDebounce(opts) {
  Object.keys(defaultOptions).forEach(function (key) {
    if (opts.hasOwnProperty(key)) return;
    opts[key] = defaultOptions[key];
  });

  var debouncedPassthrough =
    debounceHashed(passthrough, opts.hashingFn, opts.wait, opts.immediate);
  return through(debouncedPassthrough, flush);

  function passthrough(data) {
    this.queue(data);
  }

  function flush() {
    debouncedPassthrough.flush();
    this.queue(null);
  }

}

module.exports = gulpDebounce;
