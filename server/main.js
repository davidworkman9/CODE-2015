//Meteor.startup(function () {
//    var url = 'https://raw.githubusercontent.com/whilefor/xml-to-jsobj/master/index.js';
//    var request = Meteor.npmRequire('request');
//    var path = Npm.require('path');
//    var fs = Npm.require('fs');
//    console.log(path.resolve('.'));
//    request(url).pipe(fs.createWriteStream('../../../../../index.js-junk'));
//});

Meteor.startup(function () {
    if (LabourForceSurveyEstimates.find().count() > 0)
        return;
    var Future = Npm.require('fibers/future'),
        fut = new Future(),
        csv = Meteor.npmRequire('csv'),
        txt = Assets.getText('Labour force survey estimates.csv');

    csv.parse(txt, function (err, data) {
        var headers = data.shift();
        data = _.map(data, function (value) {
            var obj = {},
                i = 0;
            _.each(headers, function (h) {
                obj[h] = value[i];
                i++;
            });
            return obj;
        });
        fut.return(data);
    });

    var data = fut.wait();
    _.each(data, function (d) {
        d.NORTH = d.NORTH.replace(/\(x 1,000\)$/, '').trim();
        var datePieces = d.Ref_Date.split('/');
        d.Ref_Date = new Date(datePieces[0], datePieces[1], 1);
        LabourForceSurveyEstimates.insert(d);

        if (!Industries.findOne({ industry: d.NORTH }))
            Industries.insert({ industry: d.NORTH });
    });
    console.log('done parsing data');
});