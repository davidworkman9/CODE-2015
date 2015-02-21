Template.main.rendered = function () {
    this.$('select').select2({

    });
};

Template.main.events({
    'change #industry': function (e) {
        Router.go('industryGraph', {
            industry: $(e.target).val()
        });
    }
});