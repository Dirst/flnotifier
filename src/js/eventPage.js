/**
 * @file
 *
 * Event page. Here extension is gonna call FL.ru and parse new data.
 */

/**
 * Add alarm listener.
 */
chrome.alarms.onAlarm.addListener(function(Alarm) {
  if (Alarm.name == 'flru_check') {
    var data = _get_flru_data();
  }
});

/**
 * Get new jobs in json format.
 * {
 *   name,
 *   description,
 *   budget,
 *   link,
 *   seen,
 *   answered,
 *   date
 * }
 */
function _get_flru_data() {
  console.log();
  return null;
}