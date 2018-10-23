// require file system and jsdom
const fs = require('fs');

// For jsdom version 10 or higher.
// Require JSDOM Class.
const JSDOM = require('jsdom').JSDOM;
// Create instance of JSDOM.
const jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'});
// Get window
const window = jsdom.window;

const anychart = require('anychart')(window);
const anychartExport = require('anychart-nodejs')(anychart);

module.exports = {
    generateDoughnut: function (item) {
        // create and a chart to the jsdom window.
        // chart creating should be called only right after anychart-nodejs module requiring
        const chart = anychart.pie([10, 20, 7, 18, 30]);
        chart.bounds(0, 0, 800, 600);
        chart.container('container');
        chart.draw();

        // generate JPG image and save it to a file
        anychartExport.exportTo(chart, 'jpg').then(function(image) {
            fs.writeFile('anychart.jpg', image, function(fsWriteError) {
                if (fsWriteError) {
                    console.log(fsWriteError);
                } else {
                    console.log('Complete');
                }
            });
        }, function(generationError) {
            console.log(generationError);
        });
    }
};

