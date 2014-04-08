//= require jquery
//= require lodash
//= require backbone
//= require handlebars.runtime
//= require views/base
//= require templates/application
//= require one_to_many/one_to_many
//= require forms/forms
(function() {
  'use strict';
  var exports = this,
      $ = exports.$,
      JST = exports.JST;

  new app.views.Base({el: $('.application'), template: 'templates/application'});

  var collections = {
    foo: new Backbone.Collection([{id: 1, name: 'Foo 1'}, {id: 2, name: 'Foo 2'}, {id: 3, name: 'Foo 3'}]),
    bar: new Backbone.Collection([{id: 1, name: 'Bar 1'}, {id: 2, name: 'Bar 2'}, {id: 3, name: 'Bar 3'}]),
    baz: new Backbone.Collection([{id: 1, name: 'Baz 1'}, {id: 2, name: 'Baz 2'}, {id: 3, name: 'Baz 3'}])
  };

  exports.OneToMany({el: $('.one_to_many'), resources: collections});
  exports.Forms({el: $('.forms'), resources: collections});
}).call(this);