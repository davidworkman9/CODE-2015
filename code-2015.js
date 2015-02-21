if (Meteor.isClient) {
    Template.main.helpers({
        rows: function () {
            return Data03820006.find();
        }
    });
}