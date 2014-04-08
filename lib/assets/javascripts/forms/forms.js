//= require lodash
//= require lodash_extensions
//= require views/base
//= require forms/template
(function() {
  'use strict';
  var exports = this,
      app = exports.app,
      withResource = app.views.Base.withResource,
      withFormData = app.views.Base.withFormData;

  exports.Forms = function(options) {
    var TemplateRenderer = new app.views.Base({
      el: options.el,
      template: 'forms/template',
      resources: options.resources,
      presenter: function() {
        return {
          types: _.map(this.resources, function(collection, type) {
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
      events: {'submit form': 'updateModel'},
      updateModel: withResource(withFormData(function(resource, data) {
        resource.set(data);
      }))
    });
  };
}).call(this);

