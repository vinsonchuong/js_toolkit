//= require spec_helper
//= require one_to_many/one_to_many
describe('one to many', function() {
  beforeEach(function() {
    new OneToMany({
      el: this.$application,
      resources: {
        foo: new Backbone.Collection([{id: 1, name: 'Foo 1'}, {id: 2, name: 'Foo 2'}]),
        bar: new Backbone.Collection([{id: 1, name: 'Bar 1'}, {id: 2, name: 'Bar 2'}])
      }
    });
  });

  it('renders the collections', function() {
    expect('[data-type="foo"] [data-id="1"]').toHaveText('Foo 1');
    expect('[data-type="foo"] [data-id="2"]').toHaveText('Foo 2');
    expect('[data-type="foo"]').toContainText('0/2 Checked');

    expect('[data-type="bar"] [data-id="1"]').toHaveText('Bar 1');
    expect('[data-type="bar"] [data-id="2"]').toHaveText('Bar 2');
    expect('[data-type="bar"]').toContainText('0/2 Checked');
  });

  it('updates the checked count when checkboxes checked', function() {
    $('[data-type="foo"] [data-id="2"] input[type="checkbox"]').prop('checked', true).change();
    expect('[data-type="foo"]').toContainText('1/2 Checked');
    expect('[data-type="bar"]').toContainText('0/2 Checked');
  });
});