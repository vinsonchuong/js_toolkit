//= require sinon
//= require jquery
//= require jasmine-jquery
//= require lodash
//= require backbone
beforeEach(function() {
  this.$application = $('<div>', {'class': 'application'}).appendTo($('#jasmine_content'));
});

afterEach(function() {
  this.$application.remove();
});