// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

// A message is received
function receiver(request, sender, sendResponse) {

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