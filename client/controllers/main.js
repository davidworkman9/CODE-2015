Template.main.created = function () {
    this.autorun(function () {
        this.subIndustries = Meteor.subscribe('industries');
    }.bind(this));
};

Template.main.rendered = function () {
    this.autorun(function () {
        if (this.subIndustries.ready()) {
            IonLoading.hide();
        } else {
            IonLoading.show();
        }
    }.bind(this));
};
Template.main.events({
    'change #industry': function (e) {
        Router.go('industryGraph', {
            industry: $(e.target).val()
        });
    }
});