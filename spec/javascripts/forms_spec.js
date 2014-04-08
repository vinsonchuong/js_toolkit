//= require spec_helper
//= require forms/forms
describe('forms', function() {
  beforeEach(function() {
    this.resources = {
      foo: new Backbone.Collection([{id: 1, name: 'Foo 1'}, {id: 2, name: 'Foo 2'}]),
      bar: new Backbone.Collection([{id: 1, name: 'Bar 1'}, {id: 2, name: 'Bar 2'}])
    };
    new Forms({
      el: this.$application,
      resources: this.resources
    });
  });

  describe('when the user submits the form', function() {
    beforeEach(function() {
      $('[data-type="foo"] [data-id="2"] [name="tags"]').val('A, B,    C');
      $('[data-type="foo"] [data-id="2"] [name="score"]').val('8');
      $('[data-type="foo"] [data-id="2"]').submit();
    });

    it('updates the resources', function() {
      expect(this.resources.foo.get(2).get('tags')).toEqual(['A', 'B', 'C']);
      expect(this.resources.foo.get(2).get('score')).toEqual(8);
    });

    it('maintains the form data', function() {
      expect($('[data-type="foo"] [data-id="2"] [name="tags"]').val()).toEqual('A, B, C');
      expect($('[data-type="foo"] [data-id="2"] [name="score"]').val()).toEqual('8');
    });
  });
});