/*namespace*/
var mdl = window.mdl || {}; //store of calibration data
mdl.calibration = [];

/*create task events*/
var experiment = [];
var debug = false; //flag if debugging
var isHeatmap = false; //flag if using heatmap
var webgazer_idle = true; //check if webgazer is in idle mode
/*webgazer*/
var MediaDevice = '-1'; //name of webcam //if behavioral, set equal to -1
var gaze_x, gaze_y, webgazer, task, tasktrial;
var webgazer_time; //webgazer clock (only used for validation)
var webgazer_stream;
/*calibration*/
var isCalibrating = false; //flag whether or not calibration is occuring
var calibration_block = 0; //which calibration event (occuring after each break)
var calibration_trial = 0; //which calibration circle (0-8)
var calibration_click = 0; //number of clicks (0-19)
var calibration_time_0 = 0; //perfomrnace.now() time calibration started
var calibration_time_1 = 0; //time since calibration_time_0
var mouse_y; //mouse click y-axis
var mouse_x; //mouse click x-axis
var circle_x; //center of circle x-axis
var circle_y; //center of circle x-axis
var circle_width; //circle width
var progressbar_div; //the DOM element of circle
var progress_position; //the position of the DOM element
var isBounds; //function to update webgazer bounds (if fixation is within bounds)
var progressbar; //circle calibration progression bar
var calibrationNum = 8; //number of calibration points
var clickNum = 20; //number of clicks per calibration point
/*validation*/
var isValidating = false; //flag whether or not validation is occuring
var calibration_time_limit = 10000;//check if time limit has occured yet
var end_trial; //end validation trial
var isFirst = 0; //is first sample
/*practice*/
var	first_practice = true; //first practice trial
var	iteration_finished = false; //have all trials finished before next loop
var	prac_trial_value = 0; //setting practice trial counter to zero
var	prac_iter = 0; //setting practice iteration counter to zero
/*task*/
var first_task = true; //first practice trial
var	task_trial_value = 0; //setting practice trial counter to zero
var	task_iter = 0; //setting practice iteration counter to zero
var trialNumTask = 0; //first task trial
var task_array; //list of trials

/*camera_check syntax*/
var camera_check = {
	type: 'camera-coordinates'
};

/*camera_instructions syntax*/
var camera_instructions = {
	type: "instructions",
	pages: [
		"<div id=instructions>" +
		"<p>Please position yourself approximately 18 inches from the screen. Your eyes should be roughly center to the screen as well.</p>" +
		"</div>",

		"<div id=instructions>" +
		"<p>After the instructions, you will see an object on the screen which will be following your movements." +
		"<p>This object will react to your distance from the screen. " +
		"<p>If you are too far back, the object will appear transparent.</p>" +
		"<img id='img_ok' src='dist/img/calibrate/g.png' width='" + 200*scaleImage + "px';'>"+
		"<img id='img_t' src='dist/img/calibrate/g_t.png' width='" + 200*scaleImage + "px';'>" +
		"</div>",

		"<div id=instructions>" +
		"<p>This object will also react to your position from the screen. " +
		"<p>If you are too far away from the center of the screen, the object will appear red.</p>" +
		"<p>The object will also match your position.</p>" +
		"<img id='img_rl' src='dist/img/calibrate/r_l.png' width='" + 200*scaleImage + "px';'>" +
		"<img id='img_ru' src='dist/img/calibrate/r_u.png' width='" + 200*scaleImage + "px';'>" +
		"<img id='img_rr' src='dist/img/calibrate/r_r.png' width='" + 200*scaleImage + "px';'>" +
		"</div>",
		
		"<div id=instructions>" +
		"<p>If the object does not appear to be reacting to your movements, press the <code>SPACE</code> button.</p>" +
		"<p>This will allow the camera to reset.</p>" +
		"</div>",

		"<div>" +
		"<p>Once the webcam is ready, the task will continue automatically.</p>" +
		"<p>If you need to review these instructions, press the Previous button. " +
		"<p>No recording will occur at any point in this experiment." +
		"<br>" +
		"<p>Press Next when you're ready to begin.</p>" +
		"</div>"
	],
	show_clickable_nav: true,
	allow_backward: true,
};

/*camera_finished syntax*/
var camera_finished = {
	type: "instructions",
	pages: [
		"<div id=instructions>" +
		"<p>Your camera is prepared.</p>" +
		"<p>Next, we will have to train your web camera to be used in the experiment.<br>" +
		"<p>Following these instructions, a progress bar will appear. Please click on it repeatedly using your mouse until the progress bar fills. \
		Also during this time be sure to keep your eyes on the center of progress bar." +
		"<p>This bar will appear a few times until training is complete." +
		"<br>" +
		"<p>Press Next when you're ready to begin.</p>" +
		"</div>"
  	],
	show_clickable_nav: true,
	allow_backward: false
};

/*camera_finished syntax*/
var calibrate_instructions = {
	type: "instructions",
	pages: [
		"<div id=instructions>" +
		"<p>Next, we will have to train your web camera to be used in the experiment.<br>" +
		"<p>Following these instructions, a progress bar will appear. Please click on it repeatedly using your mouse until the progress bar fills. \
		Also during this time be sure to keep your eyes on the center of progress bar." +
		"<p>This bar will appear a few times until training is complete." +
		"<br>" +
		"<p>Press Next when you're ready to begin.</p>" +
		"</div>"
  	],
	show_clickable_nav: true,
	allow_backward: false
};

/*camera_finished syntax*/
var validate_instructions = {
	type: "instructions",
	pages: [
		"<div id=instructions>" +
		"<p>For this step we will need to confirm some of our eyetracking parameters.<br>" +
		"<p>Following these instructions, a progress bar will appear like before. However, this time you will only look at the center of the progress bar as it fills automatically." +
		"<p>You will not need to use the mouse for this portion of the experiment." +
		"<p>This bar will appear a few times until training is complete." +
		"<br>" +
		"<p>Press Next when you're ready to begin.</p>" +
		"</div>"
  	],
	show_clickable_nav: true,
	allow_backward: false
};

/*practice_instructions syntax*/
var practice_instructions = {
	type: "instructions",
	pages: [
		"<div id=instructions>" +
		"<p>Welcome to the training session." +
		"<br>" +
		"<p>At the beginning of each trial you will see a cross (+) in the middle of the screen. Please look at the cross when it is on the screen.</p>" +
		"</div>",

		"<div id=instructions>" +
		"<p>The cross will then disappear and two pictures will then appear on the screen. After these pictures disappear, one dot (*) or two dots (**) \
		will appear on either side of the screen.</p>" +
		"</div>",

		"<div id=instructions>" +
		"<p>Press the <code>8</code> key if one dot appears and press the <code>9</code> key if two dots appear. After your response, the next trial will begin. \
		Please look at the cross at the beginning of each trial." +
		"<br>" +
		"<p>Press Next to begin the practice session.</p>" +
		"</div>",
	],
	show_clickable_nav: true,
	allow_backward: true
};

/*task instructions syntax*/
var instructions = {
	type: "instructions",
	pages: [
		"<p>That was the end of the practice trials.</p>" +
		"<p>You are about to continue with the actual experiment.</p>" +
		"<p>Remember to keep your eyes fixated on the cross.</p>" +
		"<p>Also remember: <code>8</code>=(*), <code>9</code>=(**). " +
		"<br>" +
		"<p>Press Next when you're ready to begin.</p>"
  ],
	show_clickable_nav: true,
	allow_backward: false
};

/*task instructions syntax*/
var break_end = {
	type: "instructions",
	pages: [
		"<p>That was the end of the calibration and validation.</p>" +
		"<p>Press Next when you're ready to continue the experiment.</p>"
  ],
	show_clickable_nav: true,
	allow_backward: false
};
/*practice crtieria*/
var practice = {
	timeline: [{
		type: 'dotprobe-practice',
		block_order: "Prac",
		coordinates: [500, 500],
		timing_response: 7500,
		choices: ['8', '9', '33', '38', '104', '105'],
		response_ends_trial: true,
	}],
	loop_function: function () {
		//if practice block has finished and accuracy is > 80%
		if (iteration_finished == true && prac_avg > 80) {
			return false; //break loop
			//if practice block has finished but accuracy is < 79.9%
		} else if ((iteration_finished == true) && (prac_avg < 79.9)) {
			return true; //continue practice
			//if practice block is not finished
		} else {
			return true; //continue practice
		}
	}
}

// add generated experiment settings to saved data
jsPsych.data.addProperties({
	participant_id: participant_id
});

//prevent following labels to be included in outputted data
jsPsych.data.ignore(['trial_index', 'time_elapsed', 'participant_id']);

/*checking browser*/
setTimeout(checkBrowser(), 99999999);

/*call getdatabase and check if its ready before begining task*/
console.log('%c1.starting experiment','color: green');
/**
 * Top level control module
 * @alias module:webgazer
 * @exports webgazer
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
$.when(getDatabase()).done(function () {
	console.log('%c6.getDatabase() resolved','color: green');	
	if (debug) {
		if ((pid.location == 'home')||(pid.session == 0)){
			settings.blocks=8;
			pid.subsession='a';
		} else {
			settings.blocks=8;
			pid.subsession='a';
		};
	} else {
		if ((pid.location == 'home')||(pid.session == 0)){
			settings.blocks=8;
			pid.subsession='a';
		} else {
			settings.blocks=8;
			pid.subsession='a';
		};
	};
	// the code here will be executed when ajax request resolves
	if (start_task == true) {
		if (condition == "wait"){
			postDatabase();
		} else {
			task_array = all_task_trials();
			console.log('%c7.starting eyetracker()','color: green');
			eyetracker()
		};
	};
}).catch(function() {
	console.log('catch');
});

/*prepare eyetracker*/
var WebcamMessage; //message to store webcam results //NotAllowedError (blocked by browser), PreviousFail (browser not working last session, Success (allowed to stream)

/**
 * prepare eyetracker
 * @param {gazeListener} listener - callback to handle a gaze prediction event
 * @param {function} startWebgazer - initialize webgazer
 */
function eyetracker() {
	function startWebgazer() {
		console.log('%c8.starting webgazer','color: green');
		//start eyetracking
		webgazer.setRegression('ridge')
			.setTracker('clmtrackr')
			.setGazeListener(function (data, clock) {
				//data is available
				if (data) {
					//store gaze coordinates
					gaze_x = data.x;
					gaze_y = data.y;
					data.time = clock;
					delete data.all;

					//if calibrating
					if (isCalibrating) {

					//else if isValidating, collect gaze location
					} else if (isValidating) {
						//if first sample
						if (isFirst == 0){
							calibration_trial = 0;
							calibration_time_0 = clock;
							isFirst = 1;
						};
						///reset position of circle and debug divs
						circle_x = (validation_coordinates[calibration_trial][0]/100) * window.screen.width;
						circle_y = (validation_coordinates[calibration_trial][1]/100) * window.screen.height;
						//get left and right
						left = validation_coordinates[calibration_trial][0];
						right = validation_coordinates[calibration_trial][1];
						//make webgazer time public
						webgazer_time = clock;
						//calculate distance
						var dist = Math.sqrt(((gaze_x - circle_x) * (gaze_x - circle_x)) + ((gaze_y - circle_y) * (gaze_y - circle_y)));
						if (dist <= circle_width){isSuccess_dist=true}else{isSuccess_dist=false};
						var data_sample = {
							'participant': participant_id,
							'expName': settings.expName,
							'session': pid.session,
							'subsession': pid.subsession,
							'timestamp': calibration_time_1,
							'event': 'isValidating',
							'event_block': calibration_block,
							'event_trial': calibration_trial,
							'event_click': 'nan',
							'mouse_x': 'nan', 'mouse_y': 'nan', //mouse coordinates
							'gx': gaze_x, 'gy': gaze_y, //gaze coordinates
							'cx': circle_x, 'cy': circle_y, //circle coordinates
							'left': left+"%", 'right': right+"%", //requested coordinates
							'dist': dist, //distance between gaze and calibration circle
							'isSuccess': isSuccess_dist, //is distance within calibration area
							'width': circle_width //radius of calibration circle
						};
						//append stored data
						mdl.calibration.push(data_sample);
						//get current time
						calibration_time_1 = clock - calibration_time_0;
						//if trial finished and not last trial
						if (((calibration_time_1) >= calibration_time_limit) && (calibration_trial !== calibrationNum)){
							//append to trial_counter
							calibration_trial = calibration_trial + 1;
							///reset position of circle and debug divs
							circle_x = (validation_coordinates[calibration_trial][0]/100) * window.screen.width;
							circle_y = (validation_coordinates[calibration_trial][1]/100) * window.screen.height;
							//get left and right
							left = validation_coordinates[calibration_trial][0];
							right = validation_coordinates[calibration_trial][1];
							//reset bar to 0
							progressbar.set(0);
							//reset bar to to webgazer time for next trial
							calibration_time_0 = clock;
							///progress bar
							$('#progress-container').css({
								'left': left + "%",
								'top': right + "%"
							});
							///bounds and circle, if debug
							if (debug) {
								console.log({
									//event
									'event': 'isValidating',
									'calibration_trial': calibration_trial,
									//requested coordinates
									'left': left+"%", 'right': right+"%"
								});
								//adjust bounds
								$('#bounds').css({'left': (circle_x - progress_position.width) + "px", 'top': (circle_y - progress_position.width) + "px"});
								$('#center').css({'left': circle_x + "px", 'top': circle_y + "px"});
							};
						//if last trial
						} else if (((calibration_time_1) >= calibration_time_limit) && (calibration_trial === calibrationNum)){
							console.log('validation finished');
							//end flag
							isValidating=false;
							//add to counter
							calibration_block = calibration_block + 1;
							//reset counters
							calibration_trial = 0; //which calibration circle (0-8)
							calibration_click = 0; //number of clicks (0-20)
							calibration_time_0 = 0; //time calibration started
							calibration_time_1 = 0; //time calibration started
							//if debug remove bounds, and center
							if (debug) {
								$('#bounds').remove();
								$('#center').remove();
							};
							//remove progress
							$('#progress-container').remove();
							//end trial
							end_trial();
							//save data to server
							setTimeout(save_calibration, 100);
							//reset first trial flag
							first_task = true;
						};
						//update bar
						if (isValidating){
							progressbar.set(calibration_time_1 / calibration_time_limit);
							//update bounds
							if (debug){
								isBounds();
							};
						};
					};
				};
			})
			.showFaceOverlay(false)
			.showFaceFeedbackBox(false)
			.showPredictionPoints(false)
			.begin();
		setTimeout(checkWebgazer, 100);
	};
	startWebgazer();
	
	/**
	 * prepare eyetracker
	 * @callback gazeListener
	 * @param {element} video - video element
	 * @return {webgazer} this
	*/
	function setup(){
		console.log('%c9-1.webgazerVideoFeed created','color: green');
		//video feed parameters
		var video = document.getElementById('webgazerVideoFeed');
		video.style.display = 'block';
		video.style.margin = '0px';
		video.style.position = 'absolute';
		video.style.top = '0%';
		video.style.left = '0%';
		video.style.visibility = 'hidden';
		//show canvas and video (if debugging)
		control_canvas_visibility(debug)
		//webgazer pause and start task
		webgazer.pause();
		start();
	};

	//webgazer timeout
	function checkWebgazer() {
		if (webgazer.isReady()) {
			console.log('%c9.webgazer ready','color: green');
			setup();
		} else {
			if (subject.webcam_used!= false){
				setTimeout(checkWebgazer, 100);
			} else {
				console.log('%c9.webgazer unavailable','color: red');
				console.log('subject.webcam_used: '+subject.webcam_used);
				start();
			};
		};
	};
};

/*prepare task*/
function start(){
	console.log('%c10.start()','color: green')
	/*calibrate*/
	calibration_coordinates = _.shuffle(calibration_coordinates);
	var calibrate = {
		type: 'camera-calibration',
		event: 'isCalibrating',
		trialNum: 0,
		coordinates: calibration_coordinates,
		//number of clicks required to run next iteration
		clickNum: clickNum,
		image_size: [200, 200],
		timing_response: -1
	};

	/*validation*/
	validation_coordinates = _.shuffle(calibration_coordinates);
	var validate = {
		type: 'camera-calibration',
		event: 'isValidating',
		trialNum: 0,
		coordinates: validation_coordinates,
		image_size: [200, 200],
		timing_response: -1
	};

	/*task*/
	function createTrials() {
		//loop var turns off progress div - this prevents interferance to other divs
		loop = 1;
		var block_var_array = [];
		var block_array = [];
		var trialNum_all = 0;
		var iapsDotLoc;
		var pofaDotLoc;
		//total trials
		var block_order = ["p0", "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","i0", "i1","i2","i3","i4","i5","i6","i7","i8","i9"];
		//if condition is active
		if (condition == 'active'){
			//80% likelihood neutral
			iapsDotLoc = Array(10).fill('Neutral').concat(Array(2).fill('Sad'));
			pofaDotLoc = Array(8).fill('Neutral').concat(Array(2).fill('Sad'));
		} else {
			//50% likelihood neutral
			iapsDotLoc = Array(6).fill('Neutral').concat(Array(6).fill('Sad'));
			pofaDotLoc = Array(5).fill('Neutral').concat(Array(5).fill('Sad'));
		}
		/*block level*/
		for (var j = 0; j <= (settings.blocks); ++j) {
			//shuffle order of trials (pofa or iaps)
			blockID = _.shuffle(_.clone(block_order))
			//shuffle order of DotLoc
			iapsDotLocID = _.shuffle(_.clone(iapsDotLoc))
			pofaDotLocID = _.shuffle(_.clone(pofaDotLoc))
			/*trial level*/
			for (var i = 0; i <= settings.trials; ++i) {
				//pop array for each additional trial
				///if iaps event
				if (blockID[i].charAt(0) == 'i'){
					DotLocID = iapsDotLocID.splice(0, 1)[0];
				} else {
				///else pofa event
					DotLocID = pofaDotLocID.splice(0, 1)[0];
				};
				/*stimuli level*/
				var trial_event = {
					type: 'dotprobe-task',
					trialNum: i,
					blockNum: j,
					block_order: 'Task',
					coordinates: [500, 500],
					timing_response: 7500,
					choices: ['56', '57', '104', '105'],
					trialID: blockID[i],
					DotLoc: DotLocID,
					response_ends_trial: true
				};
				block_array.push(trial_event);
			};
		};
		return block_array
	};
	
	//creating task array
	task = createTrials();
	
	//append calibrate_instructions, calibrate, validate_instructions, and validate before each break (preceeding start of block 2 and block 5)
	function add_calibration(experiment_){
		//find begining of block 2, 5
		for (var i of [calibrate_instructions, calibrate, validate_instructions, validate, break_end]) {
			for (var j of [2,5]) {
				var loc = _.indexOf(experiment_, _.find(experiment_, {trialNum: 0, blockNum: Number(j)}));
				experiment_.splice(Number(loc), 0, i)
			}
		}
		return experiment_
	}

	function EventList() {
		if (debug) {
			//if eyetracking is successful
			if (subject.webcam_used == true) {
				subject.webcam_size = [webgazerVideoFeed.videoWidth+"x"+webgazerVideoFeed.videoHeight];
				createEvent(); //prepare worker
				experiment = add_calibration([].concat(calibrate, validate_instructions, validate, task)); 
			//else run behavioral version
			} else if (subject.webcam_used == false) {
				experiment = [].concat(practice_instructions, practice, instructions, task);
			};
		} else {
			//if eyetracking is successful
			if (subject.webcam_used == true) {
				subject.webcam_size = [webgazerVideoFeed.videoWidth+"x"+webgazerVideoFeed.videoHeight];
				createEvent(); //prepare worker
				experiment = add_calibration([].concat(camera_instructions, camera_check, camera_finished, calibrate,
												validate_instructions, validate, practice_instructions, practice, instructions, task));
				//else run behavioral version
			} else if (subject.webcam_used == false){
				experiment = [].concat(practice_instructions, practice, instructions, task);
			};
		}
	};

	/*preload screen optimized with preloading images*/
	function updateLoadedCount(nLoaded) {
		var percentcomplete = nLoaded / image_array.length;
		loading.set(percentcomplete);
	}

	//preload images
	function preload(){
		//get loadingbar ready
		loadingbar();
		//function to preload
		jsPsych.pluginAPI.preloadImages(
			image_array,
			function(){
				console.log('%c11.preload finished. starting task','color: green');
				startExperiment();
			},
			function (nLoaded) {
				updateLoadedCount(nLoaded);
			}
		);
	}
	preload();
	
	/*start experiment*/
	function startExperiment() {
		EventList(),
			loading.destroy(),
			d3.selectAll("#progress").remove(),
			//get gpu
			getGPU()
			//start
			jsPsych.init({
				display_element: $('#jspsych-target'),
				timeline: experiment,
				fullscreen: true,
				use_webaudio: false,
				show_progress_bar: false,
				show_preload_progress_bar: false,
				on_finish: function () {
					pid.subsession = "abc";
					if (subject.webcam_used == true) {
						//terminate worker
						my_worker.terminate();
						$(document).ready(function () {
							saveData(participant_id + "_" + pid.session + pid.subsession + ".csv", jsPsych.data.forServer());
						})
					} else {
						$(document).ready(function () {
							saveData(participant_id + "_" + pid.session + pid.subsession + ".csv", jsPsych.data.dataAsCSV());
						})
					}
				}
			});
	};
};