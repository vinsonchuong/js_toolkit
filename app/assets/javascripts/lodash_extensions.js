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
    },

    eachWithObject: function(list, callback, obj, context) {
      _.each(list, _.bind(callback, context, obj));
      return obj;
    }
  });
}).call(this);