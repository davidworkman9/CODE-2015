//Meteor.startup(function () {
//    var url = 'https://raw.githubusercontent.com/whilefor/xml-to-jsobj/master/index.js';
//    var request = Meteor.npmRequire('request');
//    var path = Npm.require('path');
//    var fs = Npm.require('fs');
//    console.log(path.resolve('.'));
//    request(url).pipe(fs.createWriteStream('../../../../../index.js-junk'));
//});


//Meteor.startup(function () {
//    //SalaryInfo.remove();
//    if (SalaryInfo.find().count > 0)
//        return;
//    var Future = Npm.require('fibers/future'),
//        fut = new Future(),
//        csv = Meteor.npmRequire('csv'),
//        txt = Assets.getText('03820006-eng.csv');
//
//    csv.parse(txt, function (err, data) {
//        var headers = data.shift();
//        fut.return({ headers: headers, data: data });
//    });
//
//    var d = fut.wait();
//    console.time('processing time');
//    _.each(d.data, function (value) {
//        var obj = {};
//        var i = 0;
//        _.each(d.headers, function (h) {
//            obj[h] = value[i];
//            ++i;
//        });
//        SalaryInfo.insert(obj);
//        process.stdout.write('.');
//    });
//    console.timeEnd('processing time');
//});


Meteor.startup(function () {
    TenureByIndustry.remove({});
    LabourForceSurveyEstimates.remove({});
    Industries.remove({});
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
        d.NORTH_lc = d.NORTH.toLowerCase();
        LabourForceSurveyEstimates.insert(d);
    });

    var fut = new Future(),
        txt = Assets.getText('sectors.csv');

    csv.parse(txt, function (err, data) {
       var headers = data.shift();
       fut.return({ headers: headers, data: data });
    });

    var d = fut.wait();
    var parentId;
    console.time('processing time');
    _.each(d.data, function (value) {
       var obj = {};
       var i = 0;
       _.each(d.headers, function (h) {
           obj[h] = value[i];
           ++i;
       });
       if (!Industries.findOne({industry: obj.industry})){
            Industries.insert({industry: obj.industry, parentId: obj.industry});
            parentId = obj.industry
        }
        Industries.insert({industry: obj.sector, parentId: parentId });
    });

    // Job Tenure by Industry
    // var fut = new Future(),
    //     txt = Assets.getText('tenure by industry.csv');

    // csv.parse(txt, function (err, data) {
    //    var headers = data.shift();
    //    fut.return({ headers: headers, data: data });
    // });
    // console.log('tenure by industry');
    // var d = fut.wait();
    // console.time('processing time');
    // _.each(d.data, function (value) {
    //    var obj = {};
    //    var i = 0;
    //    _.each(d.headers, function (h) {
    //        obj[h] = value[i];
    //        ++i;
    //    });
    //     var datePieces = obj.Ref_Date.split('/');
    //     obj.Ref_Date = new Date(datePieces[0], datePieces[1], obj);
    //     obj.JOBTENURE = obj.JOBTENURE.replace(/\(x 1,000\)$/, '').trim().toLowerCase();
    //     obj.INDUSTRY = obj.INDUSTRY.toLowerCase();
    //     TenureByIndustry.insert(obj);
    // });

    console.log('done parsing data');
});

