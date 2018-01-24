// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

function notifyBackgroundPage(currentRequestCount) {
	if(currentRequestCount)
	{
	  var sending = chrome.runtime.sendMessage({
		requestCount: currentRequestCount
	  });
	}
}

function WriteLog(request)
{
	if(request.confirmLog)
	{
		return true;
	}
	else
	{
		return false;
	}
}
// A message is received
function receiver(request, sender, sendResponse) {
	if(request.requestOption == "search"){
		if(WriteLog(request))
		{
			console.log("!! RP Search Auto Request Started !!");
		}
		sendSearchRequest(request)
		
	}
	else if(request.requestOption == "individual"){
		if(WriteLog(request))
		{
			console.log("!! RP Individual Request Started !!");
		}
		sendIndividualRequest(request)
	}
	else if(request.requestOption == "message"){
		if(WriteLog(request))
		{
			console.log("!! RP Message Started !!");
		}
		sendSearchMessage(request)
	}
	else if(request.requestOption == "nextMessage"){
		if(WriteLog(request))
		{
			console.log("!! RP Next Message Started !!");
		}
		getNextMessageElement()
	}
}

function getDateTime() {
	var currentdate = new Date(); 
	return (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ":" + currentdate.getMilliseconds(); 
}

function sendSearchRequest(request){
	var requestTotal = request.requestCount;
	var recruiterNote = request.noteContent;
	var requestLap = 15000;
	var nextCount = 2;
	var requestCount = 1;
	var currentPage = 1;
	function LoopForRequestCount() {
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
				if(WriteLog(request))
				{
					console.log('[' + getDateTime() + '] ' + ' -- Request Sent '+ requestCount + ': ' + searchName+ ' - '+searchOccupation); 
					console.log(recruiterNote.replace('_rpConnectionName_',searchName));
				}
				notifyBackgroundPage(requestCount);
				requestCount += 1;
				time += 1000;
			}
		}
		, time); time += 1000;
		window.scrollTo(0,document.body.scrollHeight); }); 
		time += 1000;
		setTimeout( function(){ if($(".results-paginator.ember-view .next").length == 1) {
		$(".results-paginator.ember-view .next").click().delay(1000); 
		if(WriteLog(request))
		{
			console.log('[' + getDateTime() + '] ' + ' ---------------------------------> Next Page No '+ nextCount); 
		}
		nextCount += 1;
		}
		}, time); time += 1000;
	}
	}; 

	var interval = self.setInterval(function () {
			if(requestCount < requestTotal)
			{
				LoopForRequestCount(); 
			}
			else
			{
				clearInterval(interval);
			}
		}, requestLap);
}

function sendIndividualRequest(request){
	var connectionName = $(".pv-top-card-section__name").html().split(" ")[0];
	$(".pv-s-profile-actions__overflow").find(":button").first().click().delay(1000);
	noteContent = request.noteContent.replace('_rpConnectionName_',connectionName);
	$(".pv-s-profile-actions__overflow-dropdown .pv-s-profile-actions--follow").click().delay(1000);
	$('.pv-s-profile-actions--connect').click().delay(2000);
	$(".send-invite__actions .button-secondary-large").click().delay(2000);
	$(".send-invite__custom-message").val(noteContent);
	if(request.confirmLog)
	{
		console.log('[' + getDateTime() + '] ' + ' -- Request Sent : ' + connectionName); 
		console.log(noteContent);
	}
	if(!request.confirmNote){
	 $(".send-invite__actions .button-primary-large").click();
	 notifyBackgroundPage("1");
	}
}

var selectedMsg;
var selectedMsgId = 0;
function getNextMessageElement(){
	var totalMessagesOnPage = $(".search-result.search-result__occluded-item").find(".search-result__actions .ember-view > .search-result__actions--primary.message-anywhere-button").length;
	if(selectedMsgId > 0){
		//Clear Previous Selection
		$(".search-result.search-result__occluded-item").find(".search-result__actions .ember-view > .search-result__actions--primary.message-anywhere-button").eq(selectedMsgId - 1).css("background-color","").css("box-shadow","").css("color","");
	}
	if(selectedMsgId > 2){

	}
	
	if(selectedMsgId < totalMessagesOnPage)
	{
		selectedMsg = $(".search-result.search-result__occluded-item").find(".search-result__actions .ember-view > .search-result__actions--primary.message-anywhere-button").eq(selectedMsgId);
		$(selectedMsg).css("background-color","rgba(0,115,177,.25)").css("box-shadow","inset  0 0 0 1px #0084bf,inset 0 0 0 2px #0073b1,inset 0 0 0 3px transparent").css("color","#0073b1")
		//Scroll to Next Message
		var position = $(selectedMsg).position();  //your current y position on the page
		$(window).scrollTop(position.top - 150);
		selectedMsgId = selectedMsgId+1;
	}
	else
	{
		selectedMsgId = 0;
		if($(".results-paginator.ember-view .next").length == 1) {
		$(".results-paginator.ember-view .next").click().delay(1000); 
		}
		setTimeout( function(){ 
			getNextMessageElement();
		}, 1000);
	}
}

function sendSearchMessage(request){
	if(selectedMsg)
	{
		selectedMsg.click();
		setTimeout( function(){ 
		var closeBtn = $(".msg-overlay-conversation-bubble > .msg-overlay-conversation-bubble--header").find(".msg-overlay-bubble-header__control");
		var recipientName = $(".msg-overlay-conversation-bubble").find(".msg-connections-lookup__recipients").find(".msg-connections-lookup__recipient-name").text().trim().split(' ')[0];
		var msgContent = request.noteContent.replace('_rpConnectionName_',recipientName);
		var sendBtn = $(".msg-overlay-conversation-bubble > .msg-overlay-conversation-bubble__content-wrapper").find(".msg-messaging-form__send-button");
		var messageBox = $(".msg-overlay-conversation-bubble").find(".msg-overlay-conversation-bubble__messaging-form").find(".msg-messaging-form__message");
		if(messageBox && recipientName && closeBtn && sendBtn){
			$(sendBtn).removeAttr("disabled");
			$(messageBox).val(msgContent);
			if(!request.confirmNote){
				$(sendBtn).click();
				$(closeBtn).click();
				if(request.confirmLog)
				{
					console.log('[' + getDateTime() + '] ' + ' -- Message Sent to : ' + recipientName); 
					console.log(msgContent);
				}
			}
		}
		}, 200);
	}
}