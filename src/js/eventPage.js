/**
 * @file
 *
 * Event page. Here extension is gonna call FL.ru and parse new data.
 */

var flru_url = "https://www.fl.ru/projects";
//var apikey = "zxcew23sdcxv23xc23k4j23h4j23h4j23b423b23423i983242xc3023u0";
var max_jobs = 30;

/**
 * Add alarm listener.
 */
chrome.alarms.onAlarm.addListener(function(Alarm) {
  if (Alarm.name == 'flru_check') {
    // Get token.
    chrome.storage.sync.get(function(items) {
      
      // Get specialities.
      var specialities = [];
      var common_specialities = [];
      items.specialities.forEach(function(item, i, arr) {
        if (item.match(/0_\d+/)) {
          common_specialities.push(item.replace("0_", ""));
        } else {
          specialities.push(item);
        }
      });
      
      // Retirieve jobs start.
      $.get(flru_url, function(data) {
        
        // Get fl.ru token.
        var pattern = /(var _TOKEN_KEY = \')(.+)(\';)/
        var match = data.match(pattern);
        var token = match[2];
        
        // Get fl.ru jobs.
        var fields = {
          'action': 'postfilter',
          'kind': 1,
          'pf_cost_from': items.budget,
          "currency_text_db_id": items.currency,
          'pf_currency': items.currency,
          'u_token_key': token
        };
        
        // Add common categories
        fields.pf_categofy = new Array();
        var categofy_0 = {};
        var categofy_1 = {};
        
        for (var key in common_specialities) {
          if (common_specialities.hasOwnProperty(key)) {
            var objectKey = common_specialities[key];
            categofy_0 = {objectKey: 0};
          }
        }
        fields.pf_categofy[0] = categofy_0;
        
        // Add special categories
        for (var key in specialities) {
          if (specialities.hasOwnProperty(key)) {
            var objectKey = specialities[key];
            categofy_1 = {objectKey: 1};
          }
        }
        fields.pf_categofy[1] = categofy_1;
//        console.log(fields);
//        // Retirieve projects.
//        $.ajax("https://example.com/v2/login", {
//          method: 'POST',
//          data: fields,
//          crossDomain: true,
//          xhrFields: { withCredentials: true },
//          success: function(data) {
//            // Parse jobs.
//            var jobs = __parse_jobs(data);
//            console.log(jobs);
//            __set_up_jobs(jobs, items);
//          }
//        });
        $.post(
          flru_url,
          fields,
          function(data) {
            // Parse jobs.
            var jobs = __parse_jobs(data);
            console.log(jobs);
            __set_up_jobs(jobs, items);
          }
        );
      });
    });
    
  }
});

/**
 * Parse jobs from html.
 *
 * @param {string} html
 * 
 * @returns {array}
 *   Array of jobs objects.
 */
function __parse_jobs(html) {
  var jobs = new Array();
  $("#projects-list .b-post", html).each(function(index, value) {
    // Set title, id, link.
    var id = $(value).attr("id").replace("project-item", '');
    jobs[id] = {
      id: id,
      title: $(value).find("h2 a").text().trim().replace(/\s+/,' '),
      link: $(value).find("h2 a").attr("href")
    };

    // Budget.
    var pattern = /(document.write\(')(.+)('\))/;
    var match = $(value).find('script').html().match(pattern);
    if (typeof match[2] !== 'undefined') {
      jobs[id].budget = $(match[2]).text().replace(/\s+/,' ');
    }
    
     // Description
     var match = $($(value).find('script')[1]).html().match(pattern);
     if (typeof match[2] !== 'undefined') {
       jobs[id].description = $(match[2]).text().replace(/\s+/,' ');
     }
     
     // Parse publish time.
    var match = $($(value).find('script')[2]).html().match(pattern);
    if (typeof match[2] !== 'undefined') {
      jobs[id].type = $(match[2]).find(".b-layout__txt_inline-block").text().replace(/\s+/,' ');
      pattern = /(b-layout__txt_inline-block\">)([^\<]+)(\<\/span\>)([^\<]+)/;
      match = match[2].match(pattern);
      if (typeof match[4] !== 'undefined') {
        jobs[id].time = $("<div>" + match[4] + "</div>").text().replace(/\s+/,' ');
      }
    }
  });
  
  return jobs;
}

/**
 * Set up jobs to local storage.
 *
 * @param jobs
 */
function __set_up_jobs(jobs, options) {
  // Get jobs list from local storage.
  chrome.storage.local.get(function(jobs_list) {
    // For each job in list.
    Object.keys(jobs_list).forEach(function(job_id, i, arr) {
      // Remove job that already exists. 
      if (typeof(jobs[job_id]) != "undefined") {
        jobs_list[job_id].time = jobs[job_id].time;
        delete jobs[job_id];
      }
    });
    
    // Add new jobs to the job list.
    jobs_list = $.extend(jobs_list, jobs);
    
    // Check if count of the objects more than MAX and remove old jobs.
    Object.keys(jobs_list).every(function(job_id, i, arr) {
      if (Object.keys(jobs_list).length > max_jobs) {
        delete jobs_list[job_id];

        // Delete from new jobs list to have correct jobs count.
        delete jobs[job_id];

        return true;
      } else {
        // BREAK;
        return false;
      }
    });
    
    // Clear before set.
    chrome.storage.local.clear();
    
    // Add jobs to local storage.
    chrome.storage.local.set(jobs_list, function() {
      // Create notification on new jobs.
      if (Object.keys(jobs).length > 0 && options.desktop) {
        var last_key = Object.keys(jobs).length - 1;
        chrome.notifications.create(null, {
          type: chrome.notifications.TemplateType.BASIC,
          iconUrl: '128x128.png',
          title: 'Появилось (' + Object.keys(jobs).length + ') новых работ',
          message: jobs[Object.keys(jobs)[last_key]].title + " с бюджетом " + jobs[Object.keys(jobs)[last_key]].budget + " и др.",
          requireInteraction: true
        });
        
        // Set up number of new jobs on the badge.
        chrome.browserAction.setBadgeText({text: Object.keys(jobs).length.toString()});
      }
    });
    
  });
}