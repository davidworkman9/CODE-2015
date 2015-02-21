Meteor.publish('industries', function () {
    return Industries.find();
});


Meteor.publish('industry-data', function (industry) {
    check(industry, String);
    return LabourForceSurveyEstimates.find({
        NORTH_lc: industry.toLowerCase(),
        //Ref_Date: {
        //    $lte: new Date(2012, 6, 1),
        //    $gt: new Date(2012, 1, 1)
        //}
    });
});
