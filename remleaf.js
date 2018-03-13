var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Gpio = require('pigpio').Gpio,
rb = new Gpio(14, {mode: Gpio.OUTPUT}),
rf = new Gpio(15, {mode: Gpio.OUTPUT}),
lb = new Gpio(18, {mode: Gpio.OUTPUT}),
lf = new Gpio(23, {mode: Gpio.OUTPUT});
rb.digitalWrite(0);
rf.digitalWrite(0);
lb.digitalWrite(0);
lf.digitalWrite(0);
var init_value = 0, remote_mode = 0; //mode0 means slidermode && mode 1 means sensor mode
var sensix=44 , sensiy=38, x=0, y=0;
app.use(express.static('/home/pi/Desktop/remleaf'));

io.on('connection', function(socket){
  console.log('user connected');
  socket.emit('dat1',init_value);
  socket.on('dat1', function(msg){
    console.log(msg);
	io.emit('dat1', msg);
	init_value = msg;
  });
  socket.on('remote_mode', function(msg){
    console.log("remote_mode",msg);
	var remote_mode = msg;
  });
  socket.on('left_slider', function(msg){
	var ls=parseInt(msg);  
//	y = (382.5*x)/(127.5 + x)  for curve like y^2
//  y = (x^2)/255 for curve like x^2
//	if (msg>0){lf.pwmWrite(Math.round(Math.pow(2,msg/2)-1));} range is [-16,16]
	if (msg>0){lf.pwmWrite(Math.round((382.5*ls)/(127.5+ls)));}
	else if (msg<0){lb.pwmWrite(Math.round((382.5*(-ls))/(127.5 + (-ls))));} 
	else if (msg==0){lf.digitalWrite(0);lb.digitalWrite(0);}
    console.log('left: ',Math.round((382.5*ls)/(127.5+ls)));
  });
  socket.on('right_slider', function(msg){
  	var rs = parseInt(msg);
	if (msg>0){rf.pwmWrite(Math.round((382.5*rs)/(127.5+rs)));}
	else if (msg<0){rb.pwmWrite(Math.round((382.5*(-rs))/(127.5 + (-rs))));}
	else if (msg==0){rf.digitalWrite(0);rb.digitalWrite(0);}
    console.log('right: ',Math.round((382.5*rs)/(127.5+rs)));
  });
  socket.on('accx', function(msg){
	var x =  -msg*sensix;
	llf(x+y);
	rrf(-x+y);
	llb(-x-y);
	rrb(x-y);
    console.log("accx",x);
  });
  socket.on('accy', function(msg){
    var y = -msg*sensiy;
    llf(x+y);
	rrf(-x+y);
	llb(-x-y);
	rrb(x-y);
    console.log("accy",y);
  });
  /*socket.on('accz', function(msg){
    console.log("accz",msg);
  });*/
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log("listening on",require("ip").address()+":8080");
});

function rrf(power){
        if (power<=255 && power>0){
		rf.pwmWrite(Math.round(power));
}		else if (power>255){
                rf.pwmWrite(255);
}		else {
                rf.digitalWrite(0);
                }
}
function llf(power){
        if (power<=255 && power>0){
		lf.pwmWrite(Math.round(power));
}		else if (power>255){
                lf.pwmWrite(255);
}		else {
		lf.digitalWrite(0);
                }
}
function rrb(power){
        if (power<=255 && power>0){
		rb.pwmWrite(Math.round(power));
}		else if (power>255){
                rb.pwmWrite(255);
}		else {
		rb.digitalWrite(0);
                }
}
function llb(power){
        if (power<=255 && power>0){
		lb.pwmWrite(Math.round(power));
}		else if (power>255){
                lb.pwmWrite(255);
}		else {
		lb.digitalWrite(0);
                }
}

//var ip = require("ip");
//console.log("listening on",require("ip").address()+":8080" );
