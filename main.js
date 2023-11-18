const IMAGE_WIDTH = 2048;
const IMAGE_HEIGHT = 1536;

// responsive canvas
var canvas = document.getElementById("canvas");
canvas.style.cursor = "default";

var widthRatio = IMAGE_WIDTH / IMAGE_HEIGHT;
canvas.height = IMAGE_HEIGHT; //document.body.scrollHeight;
canvas.width = IMAGE_WIDTH; //canvas.height * widthRatio;
const ctx = canvas.getContext("2d");
ctx.save();
let clickedAsset = null;
let redrawScreenTO = null;

// debug
function debug(msg, data) {
	console.log(msg);
	data && console.log(JSON.stringify(data));
}

// draw image
const images = {};
function doDrawImage(img, dx, dy, width, height, highlighted, callback) {
	ctx.save();
	if (highlighted) {
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowColor = "white";
		ctx.shadowBlur = 30;
	}
	ctx.drawImage(img, dx, dy, width, height);
	ctx.restore();
	callback && callback();
}

function drawImage(url, dx, dy, width, height, highlighted, callback) {
	debug("drawImage", { url, dx, dy, width, height });
	let img = images[url];
	if (img === undefined) {
		img = new Image();
		img.src = url;
		img.addEventListener("load", (e) => {
			doDrawImage(img, dx, dy, width, height, highlighted, callback);
		});
		images[url] = img;
	} else {
		doDrawImage(img, dx, dy, width, height, highlighted, callback);
	}
}

function intersects(e, oX, oY, oWidth, oHeight) {
	const rect = canvas.getBoundingClientRect();
	const scale = IMAGE_HEIGHT / window.innerHeight;
	const x = (e.clientX - rect.left) * scale;
	const y = (e.clientY - rect.top) * scale;
	return x > oX && x < oX + oWidth && y > oY && y < oY + oHeight;
}
const handlers = {};
function addAsset(
	url,
	audioId,
	oX,
	oY,
	oWidth,
	oHeight,
	highlighted,
	callback
) {
	drawImage(
		url,
		Math.round(oX),
		Math.round(oY),
		Math.round(oWidth),
		Math.round(oHeight),
		url == clickedAsset
	);
	if (!handlers[url]) {
		canvas.addEventListener("click", function (e) {
			if (intersects(e, oX, oY, oWidth, oHeight)) {
				clickedAsset = url;
				drawScreen();
				Audio.play(audioId % 15);
				clearTimeout(redrawScreenTO);
				redrawScreenTO = setTimeout(function () {
					clickedAsset = null;
					redrawScreenTO = null;
					drawScreen();
				}, 1000);
			}
		});
		handlers[url] = true;
	}
}

function addAllAssets() {
	addAsset("./assets/herisson1.png", 0, 1783, 1419, 119, 105);
	addAsset("./assets/herisson2.png", 1, 591, 1422, 130, 107);
	addAsset("./assets/champignon1.png", 2, 1599, 1313, 39, 39);
	addAsset("./assets/champignon2.png", 3, 1233, 1313, 54, 84);
	addAsset("./assets/champignon3.png", 4, 81, 1426, 57, 74);
	addAsset("./assets/ecureuil1.png", 5, 577, 864, 117, 110);
	addAsset("./assets/ecureuil2.png", 6, 71, 820, 249, 101);
	addAsset("./assets/hibou.png", 7, 1925, 534, 79, 113);
	addAsset("./assets/oiseau1.png", 8, 1915, 1269, 111, 96);
	addAsset("./assets/oiseau2.png", 9, 1857, 1124, 45, 49);
	addAsset("./assets/oiseau3.png", 10, 1287, 886, 82, 70);
	addAsset("./assets/oiseau4.png", 11, 908, 223, 115, 118);
	addAsset("./assets/renard.png", 12, 835, 1255, 365, 269, true);
	addAsset("./assets/graines.png", 13, 910, 871, 92, 62, true);
	addAsset("./assets/pomme.png", 14, 1395, 1264, 43, 64);
	//addAsset("./assets/feuille.png", 15, 1510, 1450, 106, 64);
	addAsset("./assets/baies.png", 16, 398, 896, 57, 67);
}

function drawScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawImage(
		"./background.png",
		0,
		0,
		canvas.width,
		canvas.height,
		false,
		addAllAssets
	);
}

drawScreen();

///
window.onload = function () {
	var bufferLoader = new BufferLoader(
		Audio.audioContext,
		[
			"./sound/3-g.wav",
			"./sound/4-a.wav",
			"./sound/4-as.wav",
			"./sound/4-b.wav",
			"./sound/4-c.wav",
			"./sound/4-cs.wav",
			"./sound/4-d.wav",
			"./sound/4-ds.wav",
			"./sound/4-e.wav",
			"./sound/4-f.wav",
			"./sound/4-fs.wav",
			"./sound/4-g.wav",
			"./sound/4-gs.wav",
			"./sound/5-a.wav",
			"./sound/5-b.wav",
			"./sound/5-c.wav"
		],
		finishedLoading
	);
	bufferLoader.load();
	function finishedLoading(bufferList) {
		Audio.init(bufferList);
	}
};
