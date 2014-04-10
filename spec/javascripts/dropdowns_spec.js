//= require spec_helper
//= require dropdowns/dropdowns
describe('dropdowns', function() {
  beforeEach(function() {
    this.resources = {
      foo: new Backbone.Collection([{id: 1, name: 'Foo 1'}, {id: 2, name: 'Foo 2'}]),
      bar: new Backbone.Collection([{id: 1, name: 'Bar 1'}, {id: 2, name: 'Bar 2'}])
    };
    new Dropdowns({
      el: this.$application,
      resources: this.resources
    });
    $('[data-type="bar"] .dropdown-launcher').click();
  });
  afterEach(function() {
    //close the dropdowns
    $('body').click();
  });
  it("opens dropdowns", function() {
      expect($('.dropdown-menu-container')).toContainText('Bar 1');
      expect($('.dropdown-menu-container')).toContainText('Bar 2');
  });
  it("closes dropdowns when clicking outside of them", function() {
    $('body').click();
    expect($('.dropdown-menu-container')).not.toExist();
  });
  it("closes other dropdowns when opening new ones", function() {
    $('[data-type="foo"] .dropdown-launcher').click();
    expect($('.dropdown-menu-container')).not.toContainText('Bar 1');
    expect($('.dropdown-menu-container')).toContainText('Foo 1');
    expect($('.dropdown-menu-container')).toContainText('Foo 2');
  });
  it('closes open dropdowns when re-clicking on the launcher', function() {
    $('[data-type="bar"] .dropdown-launcher').click();
    expect($('.dropdown-menu-container')).not.toExist();
  });
  it('proxies click events through the dropdown', function() {
    var capturedEvent;
    $('[data-type="bar"] .dropdown-content').on('click li', function(e) {
      capturedEvent = e;
    });
    var liToClick = $('.dropdown-menu-container li:first');
    liToClick.click();
    expect(capturedEvent.target).toEqual(liToClick[0]);
  });
});