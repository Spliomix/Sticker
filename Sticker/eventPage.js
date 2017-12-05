var tabURL;


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){  
  if (request.todo == "showPageAction")
    {
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        });
    }
    if (request.todo == "changeVisible")
    {
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
          chrome.pageAction.show(tabs[0].id);
        });
        
      /*  chrome.storage.sync.set({ tabURL: request.visible}, function(){
          console.log("data saved");
          alert("data saved");
      });
      chrome.storage.sync.get(String[tabURL], function(items){
        //  items = [ { "yourBody": "myBody" } ]
        alert(items);
    });*/
    }
    
      
});


  chrome.tabs.onActivated.addListener(function(evt){ 
    chrome.tabs.get(evt.tabId, function(tab){ 
      tabURL=(tab.url);
      chrome.tabs.sendMessage(tab.id, {"message": (tab.url)}, function(response) {});
      //chrome.tabs.sendMessage(tab.id, {"visible": visible}, function(response) {});     
    }); 
  });
  