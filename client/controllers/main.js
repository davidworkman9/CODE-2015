Template.main.created = function () {
    this.autorun(function () {
        this.subIndustries = Meteor.subscribe('industries');
    }.bind(this));
};

Template.main.rendered = function () {
    var shown = false;
    this.autorun(function () {
        if (this.subIndustries.ready()) {
            IonLoading.hide();
            shown = false;
        } else {
            if (!shown) {
                IonLoading.show();
                shown = true;
            }
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