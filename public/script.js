$(document).ready(function() {
  var headerTitleElement = $("#header h1");
  var formElement = $("#ping-form");
  var submitElement = $("#ping-submit");
  var inputElement = $("#ping-input");
  var hostAddressElement = $("#host-address");
  var IPv4AddressElement = $("#IPv4-address");
  var hostnameElement = $("#hostname");
  var pingStatus = $("#ping-status");
  var preload = $("#preload");

  $.getJSON("env", function(result){
  	$.each(result, function(i, field){
  		switch(i)
  		{
  			case "HOSTNAME":
  				hostnameElement.append("Hostname (POD Name) = " + field);
  				break;
  			case "IPNETv4":
  				IPv4AddressElement.append("IP Address = " + field);
  				break;
  			default:
  				// do nothing
  				break;
  		}
  	});
  });

  var handleSubmission = function(e) {
    e.preventDefault();

    $.get("ping/" + inputElement.val(), function(data){
      console.log(data)
      if(data == "Success"){
        pingStatus.css("color", "#ADFF2F");
      }else{
        pingStatus.css("color", "#ff0000");
      }
      preload.css("display", "none")
      pingStatus.text("Ping Result: " + data);

    });
    return false;
  }

  // colors = purple, blue, red, green, yellow
  var colors = ["#549", "#18d", "#d31", "#2a4", "#db1"];
  var randomColor = colors[Math.floor(5 * Math.random())];
  (function setElementsColor(color) {
    headerTitleElement.css("color", color);
    submitElement.css("background-color", color);
    inputElement.css("box-shadow", "inset 0 0 0 2px" + color);
  })(randomColor);

  submitElement.click(handleSubmission);
  formElement.submit(handleSubmission);
  submitElement.click(function() {
      pingStatus.text("");
      preload.css('display', 'inline');
  });
  hostAddressElement.append(document.URL);
});
