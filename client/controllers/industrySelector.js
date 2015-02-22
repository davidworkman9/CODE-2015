var downloading = false;
Template.industrySelector.created = function () {
    this.filter = new Blaze.ReactiveVar();
    downloading = false;
    this.autorun(function () {
        if (!downloading)
            IonLoading.show();
        downloading = true;
        this.subIndustries = Meteor.subscribe('industries',
            0, 50 + Session.get('numDocs'),
            this.filter.get(),
            function () {
                downloading = false;
                Tracker.afterFlush(function () {
                    IonLoading.hide();
                });
            }
        );
    }.bind(this));
    Session.set('numDocs', 50);
};

Template.industrySelector.rendered = function () {
    this.$('.ionic-scroll>.content')
        .off('scroll.infinite-scroll')
        .on('scroll.infinite-scroll', function () {
            var $list = $(this);
            if (!downloading && $list.scrollTop() >= ($list[0].scrollHeight - $list.height()) ) {
                Session.set('numDocs', Session.get('numDocs') + 50);
            }
        }
    );
};

Template.industrySelector.events({
    'change #industry': function (e) {
        Router.go('industryGraph', {
            industry: $(e.target).val()
        });
    },
    'input #industry-filter': function (e, tmpl) {
        if (tmpl.waitInput)
            clearTimeout(tmpl.waitInput);
        tmpl.waitInput = setTimeout(function () {
            tmpl.findParentTemplate('industrySelector').filter.set(e.target.value);
        }, 300);
    }
});
Template.industrySelector.helpers({
    'industries': function () {
        var filter = Template.instance().findParentTemplate('industrySelector').filter.get();
        if (!filter)
            return Industries.find({}, {sort: {industry: 1} });
        return Industries.find({industry: new RegExp(escapeRegExp(filter), 'i')}, {sort: {industry: 1}})
    }
});