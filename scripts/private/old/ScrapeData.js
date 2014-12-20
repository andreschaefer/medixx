#!/usr/bin/env node

// Script which scrapes http://google.com/medic and generates JSON files used by this application
// To run this file you will need node.js and dependencies listed below

var httpAgent = require('http-agent'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    sys = require('sys');


var agent = httpAgent.create('www.google.com', ['/medic/']);
var baseDir = __dirname + '/../app/medics/';
var medics = [];

function boolean (text) {
  return /true/i.test(text);  
}

agent.addListener('next', function (error, agent) {
  var htmlPage = agent.body.replace('</head>', '</head><body>').
                            replace(/<script[\s\S]*?<\/script>/gi, '');
//  console.log(htmlPage);                            
  var window = jsdom.jsdom(htmlPage).createWindow();
  jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.4.2.min.js', function (window, jquery) {
    var body = jquery('body');
    if (medics.length) {
      var c1 = body.find('.g-section .g-unit:nth-child(1)');
      var c2 = body.find('.g-section .g-unit:nth-child(2)');
      var medic = {};
      medic.id = agent.url.split(/\//).pop();
      medic.name = body.find('h2').text().trim();
      medic.description = body.find('.description').text().trim();
      medic.availability = c1.find('table:nth-child(1) th:contains("Availability")+td').text().trim().split(/\s*\n\s*/),
      medic.battery = {
        type: c1.find('table:nth-child(2) th:contains("Type")+td').text(),
        talkTime:  c1.find('table:nth-child(2) th:contains("Talk time")+td').text(),
        standbyTime:  c1.find('table:nth-child(2) th:contains("Standby time")+td').text()
      };
      medic.storage = {
        ram: c1.find('table:nth-child(3) th:contains("RAM")+td').text(),
        flash: c1.find('table:nth-child(3) th:contains("Internal storage")+td').text()
      };
      medic.connectivity = {
        cell:  c1.find('table:nth-child(4) th:contains("Network support")+td').text(),
        wifi:  c1.find('table:nth-child(4) th:contains("WiFi")+td').text(),
        bluetooth:  c1.find('table:nth-child(4) th:contains("Bluetooth")+td').text(),
        infrared:  boolean(c1.find('table:nth-child(4) th:contains("Infrared")+td img').attr('src')),
        gps:  boolean(c1.find('table:nth-child(4) th:contains("GPS")+td img').attr('src'))
      };
      medic.android = {
        os: c2.find('table:nth-child(1) th:contains("OS Version")+td').text(),
        ui: c2.find('table:nth-child(1) th:contains("UI")+td').text()
      };
      medic.sizeAndWeight = {
        dimensions: c2.find('table:nth-child(2) th:contains("Dimensions")+td').text().trim().split(/\s*\n\s*/),
        weight: c2.find('table:nth-child(2) th:contains("Weight")+td').text().trim()
      };
      medic.display = {
        screenSize:  c2.find('table:nth-child(3) th:contains("Screen size")+td').text(),
        screenResolution:  c2.find('table:nth-child(3) th:contains("Screen resolution")+td').text(),
        touchScreen:  boolean(c2.find('table:nth-child(3) th:contains("Touch screen")+td img').attr('src'))
      };
      medic.hardware = {
        fmRadio:  boolean(c2.find('table:nth-child(4) th:contains("FM Radio")+td img').attr('src')),
        physicalKeyboard: c2.find('table:nth-child(4) th:contains("Physical keyboard")+td img').attr('src'),
        accelerometer: boolean(c2.find('table:nth-child(4) th:contains("Accelerometer")+td img').attr('src')),
        cpu: c2.find('table:nth-child(4) th:contains("CPU")+td').text(),
        usb: c2.find('table:nth-child(4) th:contains("USB")+td').text(),
        audioJack: c2.find('table:nth-child(4) th:contains("Audio / headmedic jack")+td').text()
      };
      medic.camera= {
        primary: c2.find('table:nth-child(5) th:contains("Primary")+td').text(),
        features: c2.find('table:nth-child(5) th:contains("Features")+td').text().trim().split(/\s*\n\s*/)
      };
      medic.additionalFeatures = c2.find('table:nth-child(6) td').text();
      medic.images = [];
      body.find('#thumbs img').each(function(){
        var imgUrl = 'http://www.google.com' + jquery(this).attr('src');
        medic.images.push({
          small: imgUrl,
          large: imgUrl.replace(/\/small$/, '/large')
        });
      });
      fs.writeSync(fs.openSync(baseDir + medic.id + '.json', 'w'), JSON.stringify(medic));
    } else {
      var age = 0;
      body.find('ul.mediclist li.list').each(function(a){
        var url = jquery(this).find('.name a').attr('href');
        console.log('=======>', url);
        var medic = {};
        medic.id = url.split(/\//).pop();
        medic.age = age++;
        medic.imageUrl = 'http://google.com' +
          jquery(this).find('img.medic').attr('src');
        medic.snippet = jquery(this).find('.description').text().trim();
        medic.name = jquery(this).find('strong').text().trim();
        medic.carrier = jquery(this).find('.buy-from img').attr('alt');
        medic.buyUrl = jquery(this).find('.buy-from a').attr('href');
        console.log(medic);
        medics.push(medic);
        agent.addUrl(url);
      });
      fs.writeSync(fs.openSync(baseDir + '.json', 'w'), JSON.stringify(medics));
    }
    console.log(medic);
    agent.next();
  });
});

agent.addListener('stop', function (error, agent) {
  sys.puts('the agent has stopped');
});

agent.start();