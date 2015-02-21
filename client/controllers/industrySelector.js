Template.industrySelector.created = function () {
    this.autorun(function () {
        this.subIndustries = Meteor.subscribe('industries');
    }.bind(this));
    this.filter = new Blaze.ReactiveVar();
};

Template.industrySelector.rendered = function () {
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
Template.industrySelector.events({
    'change #industry': function (e) {
        Router.go('industryGraph', {
            industry: $(e.target).val()
        });
    },
    'input #industry-filter': function (e, tmpl) {
        tmpl.findParentTemplate('industrySelector').filter.set(e.target.value);
    }
});
Template.industrySelector.helpers({
    'industries': function () {
        var filter = Template.instance().findParentTemplate('industrySelector').filter.get();
        if (!filter)
            return Industries.find({}, {sort: {industry: 1}});
        console.log(escapeRegExp(filter))
        return Industries.find({industry: new RegExp(escapeRegExp(filter), 'i')}, {sort: {industry: 1}})
    }
});