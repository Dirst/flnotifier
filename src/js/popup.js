/*
 * @file
 *
 * Popup control.
 */

$(function() {
  // Remove badge from extension on popup.
  chrome.browserAction.setBadgeText({text: ''});
  
  // Render jobs
  chrome.storage.local.get(function(jobs) {
    console.log(jobs);
    Object.keys(jobs).forEach(function(job_id) {
      $("body .container").prepend(renderTemplate('popup-item', jobs[job_id]));
    });
  });
});

/**
 * Simple template render function.
 *
 * @param string name
 *   Template ID
 * @param object data
 *   Variables list.
 * 
 * @returns string
 *   Rendered template.
 */
function renderTemplate(name, data) {
  var template = document.getElementById(name).innerHTML;

  for (var property in data) {
      if (data.hasOwnProperty(property)) {
          var search = new RegExp('{' + property + '}', 'g');
          template = template.replace(search, data[property]);
      }
  }
  return template;
}