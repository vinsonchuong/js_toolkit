//= require lodash
//= require views/base
//= require one_to_many/template
(function() {
  'use strict';
  var exports = this,
      app = exports.app,
      withResource = app.views.Base.withResource;

  exports.OneToMany = function(options) {
    var TemplateRenderer = new app.views.Base({
      el: options.el,
      template: 'one_to_many/template',
      resources: options.resources,
      presenter: function() {
        return {
          resources: _.map(this.resources, function(collection, type) {
            return {
              type: type,
              values: collection.toJSON(),
              checked: collection.where({checked: true}).length
            };
          })
        };
      }
    });

    var ResourceUpdater = new app.views.Base({
      el: options.el,
      resources: options.resources,
      events: {'change [data-id]': 'updateModel'},
      updateModel: withResource(function(resource, e) {
        resource.set({checked: $(e.target).prop('checked')});
      })
    });
  };
}).call(this);