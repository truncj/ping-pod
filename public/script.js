$(document).ready(function() {
  var headerTitleElement = $("#header h1");
  var formElement = $("#host-form");
  var pingSubmit = $("#ping-submit");
  var curlSubmit = $("#curl-submit");
  var inputElement = $("#host-input");
  var hostAddressElement = $("#host-address");
  var IPv4AddressElement = $("#IPv4-address");
  var hostnameElement = $("#hostname");
  var hostStatus = $("#host-status");
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

  var handlePing = function(e) {
    e.preventDefault();

    $.get("ping/" + inputElement.val(), function(data){
      if(data.Status == "Success"){
         hostStatus.css("color", "#ADFF2F");
      }else{
        hostStatus.css("color", "#ff0000");
      }
      hostStatus.text("Ping Result: " + data.Status);
      preload.css("display", "none")
      console.log("Ping Result: " + data.Response);
    });
  }

  var handleCurl = function(e) {
    e.preventDefault();

    $.get("curl/" + inputElement.val(), function(data){
      if(data.Status == "Success"){
         hostStatus.css("color", "#ADFF2F");
      }else{
        hostStatus.css("color", "#ff0000");
      }
      hostStatus.text("Curl Result: " + data.Status);
      preload.css("display", "none")
      console.log("Curl Result: " + data.Response);
    }).fail(function(){
      // Handle error here
      hostStatus.css("color", "#ff0000");
      preload.css("display", "none")
      hostStatus.text("Please use ip:port formatting (eg. 127.0.0.1:3000)")
    });
  }

  // colors = purple, blue, red, green, yellow
  var colors = ["#549", "#18d", "#d31", "#2a4", "#db1"];
  var randomColor = colors[Math.floor(5 * Math.random())];
  (function setElementsColor(color) {
    headerTitleElement.css("color", color);
    pingSubmit.css("background-color", color);
    curlSubmit.css("background-color", color);
    inputElement.css("box-shadow", "inset 0 0 0 2px" + color);
  })(randomColor);

  pingSubmit.click(handlePing);
  curlSubmit.click(handleCurl);

  pingSubmit.click(function() {
      hostStatus.text("");
      preload.css('display', 'inline');
  });

  curlSubmit.click(function() {
      hostStatus.text("");
      preload.css('display', 'inline');
  });
  hostAddressElement.append(document.URL);
});
