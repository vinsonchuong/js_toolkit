//= require lodash
//= require lodash_extensions
//= require views/base
//= require dropdowns/template
(function() {
  'use strict';
  var exports = this,
      $ = exports.$,
      app = exports.app,
      withResource = app.views.Base.withResource,
      withFormData = app.views.Base.withFormData;

  exports.Dropdowns = function(options) {
    var TemplateRenderer = new app.views.Base({
      el: options.el,
      template: 'dropdowns/template',
      resources: options.resources
    });

    var DropdownManager = new app.views.Base({
      el: 'body',
      resources: options.resources,
      events: {'click': 'toggleDropdown'},
      toggleDropdown: function(e) {
        var $launcher = $(e.target),
            notOpening = $launcher.is(':not(.dropdown-launcher), .dropdown.open .dropdown-launcher');
        this.$('.dropdown').removeClass('open');
        this.$('.dropdown-menu-container').remove();
        if (notOpening) { return; }

        $launcher.closest('.dropdown').addClass('open');
        $('<div>')
          .addClass('dropdown-menu-container')
          .css('position', 'absolute')
          .css('left', $launcher.offset().left)
          .css('top', $launcher.offset().top + $launcher.outerHeight(true))
          .css('min-width', $launcher.outerWidth(true))
          .append($launcher.siblings('.dropdown-content').prop('content').cloneNode(true))
          .appendTo('body');
      }
    });
  };
}).call(this);

