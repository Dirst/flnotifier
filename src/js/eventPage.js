/**
 * @file
 *
 * Event page. Here extension is gonna call FL.ru and parse new data.
 */

var api_flru_projects = "http://flapi.bestluck.pw/";
var apikey = "zxcew23sdcxv23xc23k4j23h4j23h4j23b423b23423i983242xc3023u0";
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

      // Get flru projects. 
      $.get(api_flru_projects, {
        APIKEY: apikey,
        'spec_categories[]': specialities,
        'common_categories[]': common_specialities,
        kind: 1,
        cost_from: items.budget,
        currency_id: items.currency
      }, function(data) {
        __set_up_jobs(data, items);
      });

    });
    
  }
});

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