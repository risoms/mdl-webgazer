
//image webcam frame
var img;
var brightness;
var lumen;

function getImage() {
	var ctx = webgazerVideoCanvas.getContext('2d');
	ctx.drawImage(webgazerVideoFeed, 0, 0, webgazerVideoCanvas.width, webgazerVideoCanvas.height);
	//opens new window with image from webcam
	//window.open(img, 'test');
	getImageBrightness(img, function (brightness) {
		lumen = brightness
	});
	return lumen;
};
//image luminance
function getImageBrightness() {
	var colorSum = 0, i = 0, len, r, g, b, avg;
	//get canvas
	var canvas = $('#webgazerVideoCanvas')[0];
	var width = canvas.width;
	var height = canvas.height;
	//get canvas context
	var context = canvas.getContext('2d');
	//get canvas data
	var canvasData = context.getImageData(0, 0, width, height);
	var data = canvasData.data;
	//for each data point
	for (i, len = data.length; i < len; i += 4) {
		r = data[i];
		g = data[i + 1];
		b = data[i + 2];
		avg = Math.floor((r + g + b) / 3);
		colorSum += avg;
	}
	//calculate mean color
	var brightness = Math.floor(colorSum / (width * height));

	return brightness;
};
