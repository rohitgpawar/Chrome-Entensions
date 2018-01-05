
function setup() {
 var noteHeader = "Hi _rpConnectionName_,\n";
 var noteType1Content = localStorage["noteType1Content"] ;
 var noteType2Content = localStorage["noteType2Content"] ;;
 var noteType3Content = localStorage["noteType3Content"] ;;
 var noteType4Content = localStorage["noteType4Content"] ;;
 var noteContent = '';

  $(document).ready(function(){
	var text_max = 280;
    $('#textarea_feedback').html(text_max);
	$('#rpNoteContent').keyup(function() {
        var text_length = $('#rpNoteContent').val().length;
        var text_remaining = text_max - text_length;
		if (text_length >= 279) {
          $('#rpNoteContent').val($('#rpNoteContent').val().substring(0, 279));
        } 
        $('#textarea_feedback').html(text_remaining);
	});
});

  $("#rpSettingImg").click(function () {
		$("#rpMainDiv").hide();
		$("#rpSettingsDiv").show();
		var noteType = $('#rpNoteTypeDropdown').val();
		var selectedNoteContent = ''
		switch(noteType){
		case "NoteType1":
			selectedNoteContent = noteType1Content;
			break;
		case "NoteType2":
			selectedNoteContent = noteType2Content;
			break;
		case "NoteType3":
			selectedNoteContent = noteType3Content;
			break;
		case "NoteType4":
			selectedNoteContent = noteType4Content;
			break;
		}
		$("#rpNoteContent").val(selectedNoteContent);
  });
  
	$("#rpSaveSettingBtn").click(function () {
		$("#rpSettingsDiv").hide();
		$("#rpMainDiv").show();
		var noteType = $('#rpNoteTypeDropdown').val();
		var selectedNoteContent = ''
		switch(noteType){
		case "NoteType1":
			noteType1Content=$("#rpNoteContent").val();
			localStorage["noteType1Content"]=noteType1Content;
			break;
		case "NoteType2":
			noteType2Content=$("#rpNoteContent").val();
			localStorage["noteType2Content"]=noteType2Content;
			break;
		case "NoteType3":
			noteType3Content=$("#rpNoteContent").val();
			localStorage["noteType3Content"]=noteType3Content;
			break;
		case "NoteType4":
			noteType4Content=$("#rpNoteContent").val();
			localStorage["noteType4Content"]=noteType4Content;
			break;
		}
		$( "#rpConfirmNoteChk").prop('checked', true);
	});

   $("#rpSendBtn").click(function () {
        var end = this.value;
		var noteType = $('#rpNoteTypeDropdown').val();
		switch(noteType){
		case "NoteType1":
			if (noteType1Content !== undefined){
				noteContent = noteHeader+noteType1Content;
			}
			break;
		case "NoteType2":
			if (noteType2Content !== undefined){
				noteContent = noteHeader+noteType2Content;
			}
			break;
		case "NoteType3":
			if (noteType3Content !== undefined){
				noteContent = noteHeader+noteType3Content;
			}
			break;
		case "NoteType4":
			if (noteType4Content !== undefined){
				noteContent = noteHeader+noteType4Content;
			}
			break;
		}

		if(noteContent && noteContent.length > 25){
			sendMessage(noteContent);
		}
		else{
			alert("Note Content is Empty. \nPlease enter content by clicking on Settings icon");
		}
        
    });

  function sendMessage(noteContent) {
	var confirmNote = false;
  if ($('#rpConfirmNoteChk').is(':checked')) {
	confirmNote=true;
  }
    var msg = {
      from: 'popup',
      noteContent: noteContent,
	  confirmNote:confirmNote
    }
    var params = {
      active: true,
      currentWindow: true    
    }
    chrome.tabs.query(params, gotTabs);
    function gotTabs(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg);//, messageBack);
    }
  }
}