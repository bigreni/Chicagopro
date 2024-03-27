function onLoad() {
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        document.addEventListener('deviceready', checkFirstUse, false);
    } else {
        notFirstUse();
    }
}


function checkFirstUse()
{
    $("span").remove();
    $(".dropList").select2();
    //checkConsent();
    checkPermissions();
    //document.getElementById('screen').style.display = 'none';     
    askRating();
    document.getElementById('screen').style.display = 'none';     
}

function notFirstUse()
{
    $(".dropList").select2();
    document.getElementById('screen').style.display = 'none';     
}

function askRating()
{
    const appRatePlugin = AppRate;
    appRatePlugin.setPreferences({
        reviewType: {
            ios: 'AppStoreReview',
            android: 'InAppBrowser'
            },
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
storeAppURL: {
            ios: '1369778129',
            android: 'market://details?id=com.chicago.free'
           }
});

AppRate.promptForRating(false);
}

async function checkConsent(){
    if (cordova.platformId === 'ios') {
        const status = await consent.trackingAuthorizationStatus()
        /*
          trackingAuthorizationStatus:
          0 = notDetermined
          1 = restricted
          2 = denied
          3 = authorized
        */
        const statusNew = await consent.requestTrackingAuthorization()
      }
    
      const consentStatus = await consent.getConsentStatus()
      if (consentStatus === consent.ConsentStatus.Required) {
        await consent.requestInfoUpdate()
      }
    
      const formStatus = await consent.getFormStatus()
      if (formStatus === consent.FormStatus.Available) {
          const form = await consent.loadForm()
          form.show()
      }
}


function checkPermissions(){
    const idfaPlugin = cordova.plugins.idfa;

    idfaPlugin.getInfo()
        .then(info => {
            if (!info.trackingLimited) {
                return info.idfa || info.aaid;
            } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                return idfaPlugin.requestPermission().then(result => {
                    if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                        return idfaPlugin.getInfo().then(info => {
                            return info.idfa || info.aaid;
                        });
                    }
                });
            }
        });
}
 

function loadFaves()
{
window.location = "Favorites.html";
}

function getDirections() {
reset();
var url = encodeURI("https://ctabustracker.com/bustime/api/v3/getdirections?requestType=getdirections&locale=en&rt=" + $("#MainMobileContent_routeList").val() + "&rtpidatafeed=bustime&key=uR2atLdE8JtiTVjXhrxDE2Yz9&format=json");
$.get(url, function(data) {processXmlDocumentDirections(data); });
$("span").remove();
$(".dropList").select2();
}

function processXmlDocumentDirections(result)
{
var list = $("#MainMobileContent_directionList");
$(list).empty();
$(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
var jsonSlot = result["bustime-response"].directions;
if(jsonSlot != null || jsonSlot.length >= 1)
{
    for(var i=0; i<jsonSlot.length;i++)
    {
        var name = jsonSlot[i].name;
        var id = jsonSlot[i].id;
        $(list).append($("<option />").val(id).text(name));
    }
}
$(list).val(0);

}

function getStops()
{
reset();
var url = encodeURI("https://www.ctabustracker.com/bustime/api/v3/getstops?requestType=getstops&locale=en&rt=" + $("#MainMobileContent_routeList").val() + "&dir=" + $("#MainMobileContent_directionList").val() + "&rtpidatafeed=bustime&key=uR2atLdE8JtiTVjXhrxDE2Yz9&format=json");
$.get(url, function(data) {  processXmlDocumentStops(data); });
$("span").remove();
$(".dropList").select2();
}

function processXmlDocumentStops(result)
{
    var list = $("#MainMobileContent_stopList");
    $(list).empty();
    $(list).append($("<option disabled/>").val("0").text("- Select Stop -"));
    var jsonSlot = result["bustime-response"].stops;
    if(jsonSlot != null || jsonSlot.length >= 1)
    {
        for(var i=0; i<jsonSlot.length;i++)
        {
            var name = jsonSlot[i].stpnm;
            var id = jsonSlot[i].stpid;
            $(list).append($("<option />").val(id).text(name));
        }
    }
    $(list).val(0);
}

function getArrivalTimes() {
reset();   
var allRoutes = document.getElementById('allRoutes');
var url = encodeURI("https://ctabustracker.com/bustime/api/v3/getpredictions?requestType=getpredictions&locale=en&stpid=" + $("#MainMobileContent_stopList").val() + "&rt=" + $("#MainMobileContent_routeList").val() + "&dir=" + $("#MainMobileContent_directionList").val() + "&rtpidatafeed=bustime&key=uR2atLdE8JtiTVjXhrxDE2Yz9&format=json");
        
if (allRoutes != null) {
    if (allRoutes.checked) {
        url = encodeURI("https://ctabustracker.com/bustime/api/v3/getpredictions?requestType=getpredictions&locale=en&stpid=" + $("#MainMobileContent_stopList").val() + "&rtpidatafeed=bustime&key=uR2atLdE8JtiTVjXhrxDE2Yz9&format=json");
    }
}

$.get(url, function(data) {  processXmlDocumentPredictions(data); });       
$("span").remove();
$(".dropList").select2();
}

function processXmlDocumentPredictions(result)
{
    var outputContainer = $('.js-next-bus-results');
    var predsTag = result["bustime-response"].prd;
    var results = '<table id="tblResults" cellpadding="0" cellspacing="0">'

    if(predsTag != null && predsTag.length >= 1)
    {
        document.getElementById('btnSave').style.visibility = "visible";
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


function displayError(error) {
}



function reset() {
$('.js-next-bus-results').html('').hide(); // reset output container's html
document.getElementById('btnSave').style.visibility = "hidden";
$("#message").text('');        
}

function saveFavorites()
{
var favStop = localStorage.getItem("Favorites");
var allRoutes = document.getElementById('allRoutes');
var newFave = $('#MainMobileContent_routeList option:selected').val() + ">" + $("#MainMobileContent_directionList option:selected").val() + ">" + $("#MainMobileContent_stopList option:selected").val() + ":" + $('#MainMobileContent_routeList option:selected').text() + " > " + $("#MainMobileContent_directionList option:selected").text() + " > " + $("#MainMobileContent_stopList option:selected").text();
if (allRoutes != null) {
    if (allRoutes.checked) {
        newFave = "all >" + $("#MainMobileContent_directionList option:selected").val() + ">" + $("#MainMobileContent_stopList option:selected").val() + ":" + "All > " + $("#MainMobileContent_directionList option:selected").text() + " > " + $("#MainMobileContent_stopList option:selected").text();
    }
}

    if (favStop == null)
    {
        favStop = newFave;
    }   
    else if(favStop.indexOf(newFave) == -1)
    {
        favStop = favStop + "|" + newFave;               
    }
    else
    {
        $("#message").text('Stop is already favorited!!');
        return;
    }
    localStorage.setItem("Favorites", favStop);
    $("#message").text('Stop added to favorites!!');
}