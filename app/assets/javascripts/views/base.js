//= require lodash
//= require lodash_extensions
//= require jquery
//= require backbone
//= require handlebars.runtime
(function() {
  'use strict';
  var exports = this,
    _ = exports._,
    Backbone = exports.Backbone;

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
    },

    presenter: function() {
      return {model: _.result(this.model, 'toJSON')};
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
              self.$el.on(match[1], match[2], callback);
            } else {
              self.listenTo(target, event, callback);
            }
          })
        });
      });
    }
  }, {
    withResource: function(callback) {
      return function(e) {
        var type = $(e.currentTarget).closest('[data-type]').data('type'),
            id = $(e.currentTarget).closest('[data-id]').data('id');

        var resource =
          this.resource instanceof Backbone.Model ? this.resource :
          this.resource instanceof Backbone.Collection ? this.resource.get(id) :
          this.resources && id ? this.resources[type].get(id) :
          this.resources[type];

        callback(resource, e)
      }
    }
  });

  _.namespace(exports, 'app.views').Base = Base;
}).call(this);