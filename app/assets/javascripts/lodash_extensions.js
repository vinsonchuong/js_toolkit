//= require lodash
(function() {
  'use strict';
  var exports = this,
      _ = exports._;

  _.mixin({
    namespace: function(obj, path) {
      return _.reduce(path.split('.'), function(obj, key) {
        if (!_.has(obj, key)) { obj[key] = {}; }
        return obj[key];
      }, obj);
    }
  });
}).call(this);