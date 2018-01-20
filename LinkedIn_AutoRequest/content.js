// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

// A message is received
function receiver(request, sender, sendResponse) {
	if(request.requestOption == "search"){
		console.log("!! RP Search Auto Request Started !!");
		sendSearchRequest(request)
	}
	else{
		console.log("!! RP Individual Request Started !!");
		sendIndividualRequest(request)
	}
}

function sendSearchRequest(request){
	var requestTotal = request.requestCount;
	var recruiterNote = request.noteContent;
	var requestLap = 15000;
	var nextCount = 2;
	var requestCount = 1;
	var currentPage = 1;
	function LoopForever() {
	if (requestCount < requestTotal && currentPage != nextCount) {
		currentPage = nextCount;
		var time = 500;
		$(".search-result.search-result__occluded-item").each(function(){ var searchLi = this;
		setTimeout( function(){ var connectBtn;
			if($(searchLi).find(".search-result__actions .ember-view > .search-result__actions--primary.button-secondary-medium").length == 1) {
			connectBtn = $(searchLi).find(".search-result__actions .ember-view > .search-result__actions--primary.button-secondary-medium"); 
			}
			var searchName = $(searchLi).find(".search-result__info .name.actor-name").text().trim().split(' ')[0];
			var searchOccupation = $(searchLi).find(".search-result__info .subline-level-1.search-result__truncate").text().trim();
			if( connectBtn && connectBtn.html().trim() == "Connect"){ 
				$(connectBtn).click().delay(1000); 
				$(".send-invite__actions .button-secondary-large").click().delay(1000); 
				$(".send-invite__custom-message").val(recruiterNote.replace('_rpConnectionName_',searchName)); 
				$(".send-invite__actions .button-primary-large").click().delay(1000);
				console.log('[' + getDateTime() + '] ' + ' -- Request Sent '+ requestCount + ': ' + searchName+ ' - '+searchOccupation); requestCount += 1;
				time += 1000;
			}
		}
		, time); time += 1000;
		window.scrollTo(0,document.body.scrollHeight); }); 
		time += 1000;
		setTimeout( function(){ if($(".results-paginator.ember-view .next").length == 1) {
		$(".results-paginator.ember-view .next").click().delay(1000); console.log('[' + getDateTime() + '] ' + ' ---------------------------------> Next Page No '+ nextCount); nextCount += 1;
		}
		}, time); time += 1000;
	}
	}; 
	function getDateTime() {
		var currentdate = new Date(); 
		return (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ":" + currentdate.getMilliseconds(); 
	}
	var interval = self.setInterval(function () {
	LoopForever(); }, requestLap);
}

function sendIndividualRequest(request){
	var connectionName = $(".pv-top-card-section__name").html().split(" ")[0];
	$(".pv-s-profile-actions__overflow").find(":button").first().click().delay(1000);
	noteContent = request.noteContent.replace('_rpConnectionName_',connectionName);
	$(".pv-s-profile-actions__overflow-dropdown .pv-s-profile-actions--follow").click().delay(1000);
	$('.pv-s-profile-actions--connect').click().delay(2000);
	$(".send-invite__actions .button-secondary-large").click().delay(2000);
	$(".send-invite__custom-message").val(noteContent);
	if(!request.confirmNote){
	 $(".send-invite__actions .button-primary-large").click();
	}
}
