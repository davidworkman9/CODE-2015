if (Meteor.isClient) {
    Template.main.helpers({
        rows: function () {
            return LabourForceSurveyEstimates.find({ NORTH: 'Goods-producing sector'});
        }
    });
}

escapeRegExp = function (e){"use strict";var t=new RegExp("(\\"+["/",".","*","+","?","|","(",")","[","]","{","}","^","\\","$"].join("|\\")+")","g");return e.replace(t,"\\$1")}