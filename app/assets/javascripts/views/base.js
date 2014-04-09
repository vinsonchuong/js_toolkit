//= require lodash
//= require lodash_extensions
//= require jquery
//= require backbone
//= require handlebars.runtime
(function() {
  'use strict';
  var exports = this,
    _ = exports._,
    $ = exports.$,
    Backbone = exports.Backbone,
    Handlebars = exports.Handlebars;

  var DOM_EVENTS = [
    'blur', 'canplay', 'canplaythrough', 'change', 'click', 'contextmenu',
    'copy', 'cut', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave',
    'dragover', 'dragstart', 'drop', 'durationchange', 'emptied', 'ended',
    'focus', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'loadeddata',
    'loadedmetadata', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove',
    'mouseout', 'mouseover', 'mouseup', 'paste', 'pause', 'play', 'playing',
    'ratechange', 'reset', 'scroll', 'seeked', 'seeking', 'select', 'show',
    'stalled', 'submit', 'suspend', 'timeupdate', 'volumechange', 'waiting',
    'wheel'
  ];

  function transform(fn) {
    return function(callback) {
      return function() {
        var e = _.last(arguments);
        callback.apply(this, Array.prototype.slice.call(arguments, 0, -1).concat(fn.call(this, e), e));
      };
    };
  }

  var Base = Backbone.View.extend({
    initialize: function(options) {
      _.extend(this, _.omit(options, '$el', 'el', 'model'));
      if (this.resource) { this.resources = [this.resource]; }

      if (this.events) {
        this.delegateEvents.apply(this, _.isArray(this.events) ? this.events : [this.events]);
      }

      if (this.template || this.render !== Base.prototype.render) {
        _.each(this.resources, function(resource) {
          if (resource instanceof Backbone.Model || resource instanceof Backbone.Collection) {
            this.delegateEvents([resource, {add: 'render', remove: 'render', change: 'render', reset: 'render'}]);
          }
        }, this);
        this.render();
      }
    },

    render: function() {
      this.$el.html(JST[this.template](this.presenter()));
      return this;
    },

    presenter: function() {
      return this.resource ? {resource: _.result(this.resource, 'toJSON')} :
             this.resources ? {
               resources: _.map(this.resources, function(collection, type) {
                 return {type: type, values: collection.toJSON()};
               })
             } :
             {};
    },

    delegateEvents: function() {
      var self = this;

      _.each(arguments, function(tuple) {
        if (!_.isArray(tuple)) {
          tuple = [self.$el, tuple];
        }

        var target = self[tuple[0]] || tuple[0];
        _.each(tuple[1], function(callbacks, event) {
          if (!_.isArray(callbacks)) {
            callbacks = [callbacks];
          }

          _.each(callbacks, function(callback) {
            callback = _.bind(self[callback] || callback, self);
            if (target === self.$el || target === self.el) {
              var match = event.match(/(\S+)\s(.+)/);
              if (match) {
                self.$el.on(match[1] === 'all' ? DOM_EVENTS.join(' ') : match[1], match[2], callback);
              } else {
                self.$el.on(event === 'all' ? DOM_EVENTS.join(' ') : event, callback);
              }
            } else {
              self.listenTo(target, event, callback);
            }
          })
        });
      });
    }
  }, {
    withResource: transform(function(e) {
      var type = $(e.currentTarget).closest('[data-type]').data('type'),
          id = $(e.currentTarget).closest('[data-id]').data('id');

      return this.resource instanceof Backbone.Model ? this.resource :
             this.resource instanceof Backbone.Collection ? this.resource.get(id) :
             this.resources && id ? this.resources[type].get(id) :
             this.resources[type];
    }),

    withFormData: transform(function(e) {
      var CONVERTER = {
        string: String,
        number: Number,
        boolean: Boolean,
        integer: Math.floor,
        float: parseFloat
      };

      var $form = $(e.currentTarget);
      return _.eachWithObject($form.serializeArray(), function(result, item) {
        var $field = $form.find('[name="'+item.name+'"]'),
            match = ($field.data('type') || 'string').match(/^([a-z]+)(?:\[([\s\S]*)\]|)$/),
            type = match[1],
            separator = match[2],
            value = _.isUndefined(separator) ? item.value : item.value.split(RegExp(separator) || '\n'),
            converter = CONVERTER[type] || String
          ;
        result[item.name] = _.isArray(value) ? value.map(converter) : converter(value);
      }, {});
    })
  });

  Handlebars.registerHelper('join', function(array, string) {
    return _.isArray(array) && array.join(string);
  });

  _.namespace(exports, 'app.views').Base = Base;
}).call(this);