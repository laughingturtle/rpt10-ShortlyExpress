Shortly.SignupView = Backbone.View.extend({
  className: 'signup',

  template: Templates['signup'],

  render: function() {
    this.$el.html(this.template(this));
    return this;
  }
});
