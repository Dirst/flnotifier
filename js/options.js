/**
 * @var filter_specs is accessible
 */

var projects_url = "https://www.fl.ru/projects/";


$(function() {
  // Setup filter
  var select = "";
  filter_specs.forEach(function(item, i, arr) {
    select += "<optgroup label='" + item[0] + "'>";
     select += " <option value=" + i + ">Все специализации</option>";
     item[1].forEach(function(innerItem, innerIndex, innerArr) {
       select += " <option value=" + innerItem[0] + ">" + innerItem[1] + "</option>";
     });
    select += "</optgroup>";
  });
  
  // Set up options.
  $("#categories").html(select);
  
  // Setup chosen plugin
  $("#categories").chosen({no_results_text: "Такая специализация не найдена", disable_search_threshold: 3});
});