Shortly.LoginView = Backbone.View.extend({
  className: 'login',

  template: Templates['login'],

  render: function() {
    this.$el.html(this.template(this));
    return this;
  }
});
