

$("#actionButton1").click(function(){
	var app = new fin.desktop.Application({
        url: "http://localhost:9002/application.html",
        uuid: "AppFromMain_"+Math.random()*10,
        name: "AppFromMain_Name_"+Math.random()*10,
        mainWindowOptions: {
            defaultHeight: 200,
            defaultWidth: 200,
            defaultTop: 300,
            defaultLeft: 300,
            autoShow: true
        }
    }, function () {
        console.log("Application successfully created");
        app.run();
    }, function (error) {
        console.log("Error creating application:", error);
    });
});

$("#actionButton2").click(function(){
    var win = new fin.desktop.Window({
        name: "childWindowFromAPP123",
        url: "http://localhost:9002/child.html",
        defaultWidth: 220,
        defaultHeight: 220,
        defaultTop: 10,
        defaultLeft: 300,
        autoShow:true,
        state: "normal"
    }, function () {
    }, function (error) {
        console.log("Error creating window:", error);
    });
});

$("#actionButton3").click(function(){
    
});

$("#actionButton4").click(function(){
    
});


