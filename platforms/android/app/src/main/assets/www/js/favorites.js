function loadFavorites()
{
    $('#simplemenu').sidr();
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split(":");
        arrIds = arrStops[0].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right;">&#x2718;</button><a href="javascript:loadArrivals(' + "'" + arrIds[0].trim() + "'," + arrIds[2] + ",'" + arrStops[1].trim() + "'"  +')"; class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}



function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadArrivals(route, stop, text) {
    var url = encodeURI("https://ctabustracker.com/bustime/api/v3/getpredictions?requestType=getpredictions&locale=en&stpid=" + stop + "&rtpidatafeed=bustime&key=uR2atLdE8JtiTVjXhrxDE2Yz9&format=json");
	$.get(url, function(data) {  processXmlDocumentPredictions(data, text); });       
}

function processXmlDocumentPredictions(result, text)
{
        var outputContainer = $('.js-next-bus-results');
		var predsTag = result["bustime-response"].prd;
        var results = '<table id="tblResults" cellpadding="0" cellspacing="0">'

		if(predsTag != null && predsTag.length >= 1)
		{
		    results = results.concat('<tr class="header"><th>ROUTE</th><th>DESTINATION</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="3"></td></tr>');
			for(var i=0; i<predsTag.length;i++)
			{
				var arrival = predsTag[i].prdctdn;
				var route = predsTag[i].rt;
				var destination = predsTag[i].des;
                results = results.concat('<tr class="predictions">');
                results = results.concat("<td>" + route + "</td>" + "<td>" + destination + "</td>" + "<td>" + arrival + "</td>");
			    results = results.concat('</tr><tr><td class="spacer" colspan="3"></td></tr>');
			}
		}
        else
        {
            results = results.concat("<tr><td>No upcoming arrivals</td></tr>");
        }
        results = results + "</table>";
        $(outputContainer).html(results).show();
}