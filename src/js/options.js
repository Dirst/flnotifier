
/**
 * @file
 * options control script.
 *
 * @var filter_specs is accessible from filter_array.js
 */

var projects_url = "https://www.fl.ru/projects/";
var all_spec_text = "Все специализации";

/**
 * Adjust options.
 */
$(function() {
  
  // Set up specialities options.
  _setup_options();
  
  // Deselect options if "ALL" parent has been seleceted.
  _deselect_options_on_all();

  // Budget validation control.
  $("#budget").on("input", function() {
    this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');
  });
  
  // Setup chosen plugin
  $("#categories").chosen();
});

/**
 * Set up options for categories filter multiple select.
 */
function _setup_options() {
  var select = "";
  filter_specs.forEach(function(item, i, arr) {
    select += "<optgroup label='" + item[0] + "'>";
     // Add "ALL" option in format 0_ID
     select += " <option value=0_" + i + "> " + all_spec_text + " (" + item[0] + ") </option>";
     item[1].forEach(function(innerItem, innerIndex, innerArr) {
       select += " <option value=" + innerItem[0] + ">" + innerItem[1] + "</option>";
     });
    select += "</optgroup>";
  });
 
  // Set up options.
  $("#categories").html(select);
}

/**
 * Deselect all options in optgroup if "ALL" spec has been selected.
 */
function _deselect_options_on_all() {
  $("#categories").on("change", function() {
    $(this).val().forEach(function(item, i, arr) {
      if (item.match(/0_\d+/)) {
        $("#categories option[value=" + item + "]").parents("optgroup").find("option").not("option[value=" + item + "]").each(function(index, elem) {
          $(elem).prop("selected", false);
        });
      }
    });
    // Update chosen select.
    $("#categories").trigger("chosen:updated");
  });
}

/**
 * Save/Restore options.
 */
$(function() {
  // Save options.
  $("#save").on('click', function() {
    chrome.storage.sync.set({
      specialities: $("#categories").val(),
      budget: $("#budget").val(),
      currency: $("#currency").val(),
      notifyTimer: $("#notify-every").val(),
      desktop: $("#desktop-check").prop("checked")
    }, function() {
      // Update status to let user know options were saved.
      var status = $('.status');
      status.text('Опции сохранены');
      status.addClass("opened");
      
      // Clear jobs list.
      chrome.storage.local.clear();
      
      // Clear and create new alarm for jobs check.
      chrome.alarms.clear("flru_check"); 
      chrome.alarms.create("flru_check", {periodInMinutes: parseInt($("#notify-every").val())});
      
      
      setTimeout(function() {
        status.text('');
        status.removeClass("opened")
      }, 5000);
    });
  });
  
  // Restore options.
  chrome.storage.sync.get(function(items) {
    $("#categories").val(items.specialities);
    $("#categories").trigger("chosen:updated");
    $("#budget").val(items.budget);
    $("#currency").val(items.currency);
    $("#notify-every").val(items.notifyTimer);
    $("#desktop-check").prop("checked", items.desktop);
  });
});