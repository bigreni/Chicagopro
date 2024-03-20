function onLoad() {
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        document.addEventListener('deviceready', checkFirstUse, false);
    } else {
        notFirstUse();
    }
}
var admobid = {};
if (/(android)/i.test(navigator.userAgent)) {
    admobid = { // for Android
        banner: 'ca-app-pub-1683858134373419/7790106682',
        interstitial:'ca-app-pub-9249695405712287/3927718795'
    };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
admobid = {
  banner: 'ca-app-pub-1683858134373419/7790106682', 
  interstitial: 'ca-app-pub-9249695405712287/5312118508'
};
}

function initApp() {
    if (!AdMob) { alert('admob plugin not ready'); return; }
    initAd();
    //display interstitial at startup
    loadInterstitial();
}
function initAd() {
    var defaultOptions = {
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'black', // color name, or '#RRGGBB'
        isTesting: false // set to true, to receiving test ad for testing purpose
    };
    AdMob.setOptions(defaultOptions);
    registerAdEvents();
}
// optional, in case respond to events or handle error
function registerAdEvents() {
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('onAdFailLoad', function (data) {
        document.getElementById('screen').style.display = 'none';     
    });
    document.addEventListener('onAdLoaded', function (data) {
        document.getElementById("screen").style.display = 'none';     
        //AdMob.showInterstitial();
    });
    document.addEventListener('onAdPresent', function (data) { });
    document.addEventListener('onAdLeaveApp', function (data) { 
        document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('onAdDismiss', function (data) { 
        document.getElementById('screen').style.display = 'none';     
    });
}

function createSelectedBanner() {
      AdMob.createBanner({adId:admobid.banner});
}

function loadInterstitial() {
    if ((/(android|windows phone)/i.test(navigator.userAgent))) {
        AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: false });
    } else if ((/(ipad|iphone|ipod)/i.test(navigator.userAgent))) {
        AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: false });
    } else
    {
        document.getElementById("screen").style.display = 'none';     
    }
}

function checkFirstUse()
{
    $(".dropList").select2();
    initApp();
    //askRating();
    //window.ga.startTrackerWithId('UA-88579601-15', 1, function(msg) {
    //    window.ga.trackView('Home');
    //});  
    document.getElementById('screen').style.display = 'none';     
}

function notFirstUse()
{
    $(".dropList").select2();
    document.getElementById('screen').style.display = 'none';     
}

function askRating()
{
AppRate.preferences = {
openStoreInApp: true,
useLanguage:  'en',
usesUntilPrompt: 10,
promptAgainForEachNewVersion: true,
storeAppURL: {
            ios: '1369778129',
            android: 'market://details?id=com.chicago.free'
           }
};

AppRate.promptForRating(false);
}

function loadFaves()
{
showAd();
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
showAd();
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

function showAd()
{
document.getElementById("screen").style.display = 'block';     
    AdMob.isInterstitialReady(function(isready){
        if(isready) 
            AdMob.showInterstitial();
    });
document.getElementById("screen").style.display = 'none'; 
}