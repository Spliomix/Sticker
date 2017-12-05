const serverAddress = "https://stickerdb.glitch.me/:8081"


$(function(){
    var hide=false;
    $('#checkBox').click(function(){
     if($('#checkBox').prop('checked')) {
        hide=false;  
     } 
     if(!($('#checkBox').is(':checked'))) {   
        hide=true;
     }
     
     chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "changeVisible", visible : hide 
     });
    });
    });
    color = $('#fontColor').val();
    $("#fontColor").on("change paste keyup", function() {
        color = $(this).val(); 
    });
    
   $('#btnChange').click(function(){      
    chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "changeColor", clickedColor: color 
        });
        });
       
   });
});




