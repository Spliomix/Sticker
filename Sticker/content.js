var first=false;
var actPage;
var hide;
var res;
setTimeout(function(){
    if(!first){
        var element = document.createElement("div");
        element.setAttribute('id', 'resizable');
        var d = document.createElement("iframe")
        d.setAttribute('src',('https://login-session.glitch.me/window?'+window.location.href));   
        d.setAttribute('id', 'draggable' );
        first=true;
        
        document.body.appendChild(d);  
       
        element.appendChild(d);
        document.body.appendChild(element);  
    }
   // $(d).css("border-style", "none" );
    first=true;
    $( function(){ 
        $( element ).resizable({
            helper: "ui-resizable-helper"
    });
        $( element ).draggable({
            drag: function(){
                var offset = $(this).offset();
                var xPos = offset.left;
                var yPos = offset.top;
                $('#posX').text('x: ' + xPos);
                $('#posY').text('y: ' + yPos);
                //send to the database
        }
      });
    });



    

},    2000);


//////////////// the data save did not work, work on...
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        document.getElementById("draggable").setAttribute('src',('https://login-session.glitch.me/window?'+window.location.href));              

        if(request.message){
            actPage=String(request.message);
            var str=actPage;
            res=str.replace(".","");
            res=res.replace(":","");
             res=res.replace("/","");
            res=res.replace("/","");
             res=res.replace("/","");
            console.log(res);   
                chrome.storage.sync.set({res : hide}, function() {
                    console.log("erfolgreich gespeichert in:"+res+"  "+hide );
                });
        }
    }
);

//chrome.runtime.sendMessage({todo: "changeVisible"});
chrome.runtime.sendMessage({todo: "showPageAction" });
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "changeVisible"){
        if (request.visible){
            $('#resizable').hide();
            $('#draggable').hide();
            hide=false;
        }else{
            $('#resizable').show();
            $('#draggable').show();
            hide=true;
        }
        chrome.storage.sync.get(res, function(data) {  
            console.log(data[res]);       
    });
       
    }
});


  //color change
  /*  if (request.todo == "changeColor"){
        var addColor = '#' + request.clickedColor;               
        var range = window.getSelection().getRangeAt(0);
        var selectionContents = range.extractContents();
        var p = document.createElement("span");
        p.appendChild(selectionContents);
        range.insertNode(p);
        p.style.display = "inline-block";
        p.style.backgroundColor  = addColor;

//data send from client
        data='[{"Data"  "succesfull received33"}]';
        $.ajax({
            url : "https://stickerdb.glitch.me/ajax",
            type: "POST",
            dataType:'json',
            data : data,
            success: function(data){
                console.log(data.msg); // 'OK'
            },
        });
        */       
   // }

/*
var oldurl;
setInterval(function(){ 
    if(window.location.href===oldurl){
        //do nothing
        console.log(window.location.href);
        console.log(oldurl);
    }else{
        console.log(window.location.href);
        console.log(oldurl);
        document.getElementById("draggable").setAttribute('src',('https://login-session.glitch.me/window?'+window.location.href)); 
    }
    oldurl=window.location.href;
 }, 3000);
*/