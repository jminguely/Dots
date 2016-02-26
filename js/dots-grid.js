var dots = [];
var resizeId;

var mainColor = "e6e6e5";
var primColor = "98c21f";
var secondColor = "a773b4";

var widthWindow, heightWindow, aspectRatio;

var radiusDot = 3;
var marginDot = 5;
var cols = 0, rows = 0;

var currentElementId = undefined;

var renderer, stage, graphics;

var lastTickTime;
var lastAnimationTime;
var defaultLifespanAnimation = 200;
var defaultDistance = 20;

var lowPerf = false;
var animationQueue = [];
var animationSpeed = 40;

var keywords = [];

var affectedDots = [];
var defaultLifespan = 20;
var lastCoord = [];

var animations = [
[
[[-3, -3]],
[[-2, -2]],
[[-1, -1]],
[[0, 0]],
[[1, 1]],
[[2, 2]],
[[3, 3]]
],
[
[[3, -3]],
[[2, -2]],
[[1, -1]],
[[0, 0]],
[[-1, 1]],
[[-2, 2]],
[[-3, 3]]
],
[
[[0, -2], [0, 2], [2, 0], [-2, 0]],
[[0, -3], [0, 3], [3, 0], [-3, 0]],
[[0, -4], [0, 4], [4, 0], [-4, 0]],
[[0, -5], [0, 5], [5, 0], [-5, 0]],
[[0, -6], [0, 6], [6, 0], [-6, 0]]
],
[
[[0, -2], [0, 2], [2, 0], [-2, 0]],
[[0, -3], [-3, 0]],
[[0, -4], [-4, 0]],
[[0, -5], [-4, 0]],
[[0, -6], [-5, 0]]
],
[
[[0, -2], [0, 2], [2, 0], [-2, 0]],
[[0, -3], [3, 0]],
[[0, -4], [4, 0]]

],
[
[[0, -2], [0, 2], [2, 0], [-2, 0]],
[[0, 3], [3, 0]],
[[0, 4], [4, 0]]

],
[
[[0, -2], [0, 2], [2, 0], [-2, 0]],
[[0, 3], [-3, 0]],
[[0, 4], [-4, 0]]

],
[
[[-4, -4]],
[[-3, -3]],
[[-2, -2]],
[[-1, -1]],
[[0, 0]],
[[1, 0]],
[[2, 0]],
[[3, 0]]
],
[
[[4, -4]],
[[3, -3]],
[[2, -2]],
[[1, -1]],
[[0, 0]],
[[-1, 0]],
[[-2, 0]],
[[-3, 0]]
],
[
[[4, -4]],
[[3, -3]],
[[2, -2]],
[[1, -1]],
[[0, 0]],
[[-1, 1]],
[[-2, 2]],
[[-2, 1], [-1, 2]],
[[-2, 0], [0, 2]],
[[-2, -1], [1, 2]],
],
[
[[-4, -4]],
[[-3, -3]],
[[-2, -2]],
[[-1, -1]],
[[0, 0]],
[[1, 1]],
[[2, 2]],
[[2, 1], [1, 2]],
[[2, 0], [0, 2]],
[[2, -1], [-1, 2]],
],
[
[[-5, 2], [2, -5]],
[[-5, 1], [-4, 2], [1, -5], [2, -4]],
[[-5, 0], [-3, 2], [0, -5], [2, -3]],
[[-5, -1], [-2, 2], [-1, -5], [2, -2]],
[[-5, -2], [-1, 2], [-2, -5], [2, -1]],
[[-5, -3], [0, 2], [-3, -5], [2, 0]],
[[-5, -4], [1, 2], [-4, -5], [2, 1]],
[[-5, -5], [2, 2], [-5, -5], [2, 2]],

[[-4, 1], [1, -4]],
[[-4, 0], [-3, 1], [0, -4], [1, -3]],
[[-4, -1], [-2, 1], [-1, -4], [1, -2]],
[[-4, -2], [-1, 1], [-2, -4], [1, -1]],
[[-4, -3], [-3, -4]],
[[-4, -4], [1, 1], [-4, -4], [1, 1]],

[[-3, 0], [0, -3]],
[[-3, -1], [-1, -3], [0, -2]],
[[-3, -2], [-2, -3]],
[[-3, -3], [-3, -3]],

[[-2, -1], [-1, -2]],
[[-2, -2], [-2, -2], [-1, -1]],
[[-2, 0]],

]

];


function initializeGrid(){
	WebFont.load({
		custom: {
			families: ["CustomMuseoSansBold"]
		},
		active: function() {
			init();
		}
	});
}


function init(){

	setDimension();

	myView = document.getElementById('grid');

	renderer = PIXI.autoDetectRenderer(widthWindow, heightWindow, {
		view: myView,
		transparent: true, 
		antialias: false,
		resolution: aspectRatio
	});

	stage = new PIXI.Container();

	renderer.render(stage);

	graphics = new PIXI.Graphics();
	graphics2 = new PIXI.Graphics();
	lines = new PIXI.Graphics();
	animationGraphics = new PIXI.Graphics();
	stage.addChild(graphics);
	stage.addChild(graphics2);
	stage.addChild(lines);
	stage.addChild(animationGraphics);

	document.onmousemove = mouseEventHandler;

	doneResizing();
	render();
}

window.onresize = resizeStart;
function resizeStart(){
	clearTimeout(resizeId);
	flushStage();
	graphics.clear();
	graphics2.clear();
	animationGraphics.clear();
	$("div.overlay").removeClass("visible").find(".content").html("");
	resizeId = setTimeout(doneResizing, 500);
}
function flushStage(){
	if(typeof gridElements != 'undefined'){
		gridElements.forEach(function(element) {
			if(element.graphics){
				element.graphics.clear();
			}
		});
	}
}
function setDimension(){
	widthWindow = $("#grid").width();
	heightWindow = $("#grid").height();
	aspectRatio = window.devicePixelRatio;
}
function doneResizing()
{
	setDimension();
	renderer.resize(widthWindow, heightWindow);
	cols = Math.ceil(widthWindow/(marginDot+radiusDot*2));
	rows = Math.ceil(heightWindow/(marginDot+radiusDot*2));
	drawGrid();
}

function drawGrid(){
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			var x = i*(marginDot+radiusDot*2) + marginDot+radiusDot;
			var y = j*(marginDot+radiusDot*2) + marginDot+radiusDot;

			graphics.beginFill("0x"+mainColor);
			graphics.drawCircle(x, y, radiusDot);
			graphics.endFill();
		};
	};
	if(typeof gridElements != 'undefined'){
		gridElements.forEach(function(element, index) {

			var x = Math.round(cols/100*element.dotX);
			var y = Math.round(rows/100*element.dotY);


			gridElements[index].graphics = new PIXI.Graphics();
			stage.addChild(gridElements[index].graphics);
			gridElements[index].graphics.beginFill("0x"+secondColor);


			for (var i = 1; i >= -1; i--) {
				for (var j = 1; j >= -1; j--) {
					if(Math.abs(i)!=Math.abs(j) || (i === 0 && j === 0)){
						var xPos = (x+i)*(marginDot+radiusDot*2) + marginDot+radiusDot;
						var yPos = (y+j)*(marginDot+radiusDot*2) + marginDot+radiusDot;
						gridElements[index].graphics.drawCircle(xPos, yPos, radiusDot);

					}
				}

			}
			gridElements[index].graphics.endFill();
			gridElements[index].graphics.interactive = true;
			gridElements[index].graphics.buttonMode = true;
			gridElements[index].graphics.defaultCursor = "pointer";
			var hitBoxRadius = (radiusDot*2+marginDot)*2;
			gridElements[index].graphics.hitArea = new PIXI.Rectangle(x*(marginDot+radiusDot*2) + marginDot+radiusDot -hitBoxRadius, y*(marginDot+radiusDot*2) + marginDot+radiusDot -hitBoxRadius, hitBoxRadius*2, hitBoxRadius*2);



			gridElements[index].graphics.click = gridElements[index].graphics.tap = function(data){	
				if(currentElementId === index){
					if(element.type = "html"){
						closeOverlay();
					}
					if(element.type = "keywords"){
						hideKeywords();
					}
					animationGraphics.clear();
					currentElementId = undefined;
				} else{
					hideKeywords();
					currentElementId = index;
					xBox = (x + element.overlayX)*(marginDot+radiusDot*2) + marginDot+radiusDot-element.anchorX;
					yBox = (y + element.overlayY)*(marginDot+radiusDot*2) + marginDot+radiusDot-element.anchorY;
					playAnimation(x, y, element.animation);
					if(element.type === "html"){
						changeOverlayContent(element.src, xBox, yBox, element.w, element.h);
					} else if(element.type === "keywords"){
						closeOverlay();
						displayKeywords(element.content, xBox, yBox, element.w, element.h);
					}

				}


			};

		});
	}

}



function playAnimation(x, y, animationId){
	animationGraphics.clear();
	var animation = animations[animationId];

	for (var stepId in animation) {
		var step = animation[stepId];
		var newStep = [];
		for (var dotId in step) {
			newStep.push([x+step[dotId][0], y+step[dotId][1]]);
		}
		animationQueue.push(newStep);


	}
}




function hideKeywords(){
	for(var keywordId in keywords){
		keywords[keywordId].textObject.destroy();
	}
	keywords = [];
}
function displayKeywords(content, x, y){
	var widthFirstElement = 0;
	var heightFirstElement = 0;
	var widthSecondElement = 0;
	var heightSecondElement = 0;
	for(var textId in content){
		var text = content[textId];
		var textObject = new PIXI.Text(text.toUpperCase(), {font:"20px CustomMuseoSansBold", fill:"#"+secondColor, stroke: "#FFFFFF", strokeThickness: 3});
		textObject.pivot = new PIXI.Point(textObject.width/2, textObject.height/2);
		textObject.resolution = 2;
		var xT, yT;

		if(heightSecondElement > 0){
			xT = x-(widthFirstElement);
			yT = y+heightFirstElement+heightSecondElement;
		}else if(widthFirstElement > 0){
			xT = x+widthFirstElement;
			yT = y+heightFirstElement*2;
			widthSecondElement = textObject.width;
			heightSecondElement = textObject.height;
		} else{
			xT = x;
			yT = y;
		}
		widthFirstElement = textObject.width;
		heightFirstElement = textObject.height;


		stage.addChild(textObject);

		textObject.x = x;
		textObject.y = y;


		keywords.push({
			textObject: textObject,
			x: xT,
			y: yT,
			baseX: x,
			baseY: y,
			objX: xT+Math.round(Math.random()*defaultDistance-defaultDistance/2),
			objY: yT+Math.round(Math.random()*defaultDistance-defaultDistance/2),
			lifespanAnimation: 90,
			currentTimeAnimation: 0

		});
	}

}


function closeOverlay(){
	$("div.overlay").removeClass("visible").css({top: 0, width: 0});
	$("div.overlay .content").html("");
}

function changeOverlayContent(content, x, y, width, height){

	if(x <= 0) x = 0;
	if(y <= 0) y = 0;

	if(x+width > widthWindow) x = widthWindow-width;
	if(y+height > heightWindow) y = heightWindow-height;

	if(!$("div.overlay").hasClass("visible")){
		$("div.overlay")
		.addClass("visible")
		.css({
			left: x,
			top: y,
			width: width,
			height: height
		});
		$("div.overlay .content").html(content);
	}else{
		$("div.overlay").removeClass("visible");

		setTimeout(function(){
			$("div.overlay .content").html(content);
			$("div.overlay")
			.addClass("visible")
			.css({
				left: x,
				top: y,
				width: width,
				height: height
			});
		}, 300);


	}


}

function rgb(string){
	return string.match(/\w\w/g).map(function(b){ return parseInt(b,16) })
}

function blendColor(rgb1, rgb2, index){
	var rgb1 = rgb(rgb1);
	var rgb2 = rgb(rgb2);
	var rgb3 = [];
	for (var i=0; i<3; i++) rgb3[i] = rgb1[i]+index*(rgb2[i]-rgb1[i])|0;
		return rgb3.map(function(n){ return n.toString(16) }).map(function(s){ return "00".slice(s.length)+s}).join('');
}


function mouseEventHandler(e){
	var parentOffset = $("#grid").offset(); 

	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;

	interactionHandler(relX, relY);
}
function interactionHandler(x, y){

	var ratioX = x/widthWindow;
	var ratioY = y/heightWindow;

	var closestCol = Math.round(cols*ratioX);
	var closestRow = Math.round(rows*ratioY);

	var delta = 4;
	var radius = delta;


	for (var dx = -(radius); dx <= radius; dx++) {
		for (var dy = -(radius); dy <= radius; dy++) {
			if(	closestCol+dx >= 0
				&& closestCol+dx < cols
				&& closestRow+dy >= 0
				&& closestRow+dy < rows
				){

				var key = (closestCol+dx)+"-"+(closestRow+dy);
			var distance = Math.max(Math.ceil(Math.sqrt(Math.pow(Math.abs(dx), 2)+Math.pow(Math.abs(dy), 2))), 1);

			if(!affectedDots.hasOwnProperty(key) || distance < affectedDots[key].distance){

				affectedDots[key] = {
					distance: distance,
					effet: distance/Math.sqrt(Math.pow(radius, 2)+Math.pow(radius, 2)),
					x: closestCol+dx,
					y: closestRow+dy,
					lifespan: defaultLifespan
				};
			}

		}

	};
};
}



function render(){
	var now = new Date().getTime();
	var perf = (now-lastTickTime)/1000;
	var fps = 1/perf;

	if(fps > 20){
		lowPerf = false;
	}else{
		lowPerf = true;
	}

	if(!lowPerf){
		graphics2.clear();
		lines.clear();
	}

	

	if(fps > 20){
		lowPerf = false;
	}else{
		lowPerf = true;
	}

	if(!lowPerf){

		for (var id in affectedDots) {
			affectedDots[id].lifespan = affectedDots[id].lifespan-1;


			var dot = affectedDots[id];

			var x = dot.x*(marginDot+radiusDot*2) + marginDot+radiusDot;
			var y = dot.y*(marginDot+radiusDot*2) + marginDot+radiusDot;

			var nEffet = (1-dot.effet)/defaultLifespan*affectedDots[id].lifespan;

			graphics2.beginFill("0x"+blendColor(mainColor, primColor, nEffet));
			graphics2.drawCircle(x, y, Math.max(radiusDot/dot.effet/6, radiusDot));
			graphics2.endFill();

			if(affectedDots[id].lifespan <= 0){
				delete affectedDots[id];
			}
		}
	}


	for (var idKeyword in keywords) {

		keyword = keywords[idKeyword];

		if(keyword.currentTimeAnimation >= keyword.lifespanAnimation){
			var newLifeSpan = Math.round(Math.random()*defaultLifespanAnimation)+defaultLifespanAnimation/2;
			keyword.lifespanAnimation= newLifeSpan;
			keyword.currentTimeAnimation = 0;
			keywords[idKeyword].baseX = keywords[idKeyword].textObject.x;
			keywords[idKeyword].baseY = keywords[idKeyword].textObject.y;
			keywords[idKeyword].objX = keywords[idKeyword].x+Math.random()*defaultDistance-defaultDistance/2;
			keywords[idKeyword].objY = keywords[idKeyword].y+Math.random()*defaultDistance-defaultDistance/2;
		}
		keyword.currentTimeAnimation++;
		var dX = easeInOut(keyword.currentTimeAnimation, keywords[idKeyword].baseX, keywords[idKeyword].objX-keywords[idKeyword].baseX, keyword.lifespanAnimation);
		var dY = easeInOut(keyword.currentTimeAnimation, keywords[idKeyword].baseY, keywords[idKeyword].objY-keywords[idKeyword].baseY, keyword.lifespanAnimation);
		
		keyword.textObject.x = dX;
		keyword.textObject.y = dY;

		var idNexLine = parseInt(idKeyword)+1;
		if(parseInt(idKeyword) === keywords.length-1){
			idNexLine = 0;
		}
		lines.lineStyle(2, "0x"+primColor, 1);
		lines.moveTo(keywords[idKeyword].textObject.x, keywords[idKeyword].textObject.y);
	 	lines.lineTo(keywords[idNexLine].textObject.x, keywords[idNexLine].textObject.y);//draw min Y line
	 }


	 lastTickTime = now;
	 if(!lowPerf){
	 	if((lastTickTime-lastAnimationTime) > animationSpeed || lastAnimationTime === undefined){

	 		if(animationQueue[0] !== undefined){
	 			var step = animationQueue.shift();
	 			for(dotId in step){
	 				var dot = step[dotId];
	 				var x = dot[0]*(marginDot+radiusDot*2) + marginDot+radiusDot;
	 				var y = dot[1]*(marginDot+radiusDot*2) + marginDot+radiusDot;
	 				animationGraphics.beginFill("0x"+primColor);
	 				animationGraphics.drawCircle(x, y, radiusDot);
	 				animationGraphics.endFill();
	 			}
	 		}
	 		lastAnimationTime = lastTickTime;

	 	}

	 }

	 renderer.render(stage);
	 requestAnimationFrame(render);

	}



	function easeInOut(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}