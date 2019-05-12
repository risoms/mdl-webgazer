/**
 * Set up webcam for eyetracking experiment.
 * @module camera-calibration
 */
jsPsych.plugins["camera-calibration"] = (function() {
	var plugin = {};
	jsPsych.pluginAPI.registerPreload('camera-calibration', 'stimulus', 'image', function(t) {
		return !t.is_html || t.is_html == 'undefined'
	});
	plugin.info = {
		name: 'camera-calibration',
		description: '',
		parameters: {
			stimulus: {
				type: [jsPsych.plugins.parameterType.STRING],
				default: undefined,
				no_function: false,
				description: ''
			},
			trialNum: {
				type: [jsPsych.plugins.parameterType.STRING],
				default: undefined,
				no_function: false,
				description: ''
			},
			coordinates: {
				type: [jsPsych.plugins.parameterType.INT],
				array: true,
				default: [400, 400],
				no_function: false,
				description: ''
			},
			canvas_size: {
				type: [jsPsych.plugins.parameterType.INT],
				array: true,
				default: [400, 400],
				no_function: false,
				description: ''
			},
			clickNum: {
				type: [jsPsych.plugins.parameterType.STRING],
				default: undefined,
				no_function: false,
				description: ''
			},
			image_size: {
				type: [jsPsych.plugins.parameterType.INT],
				array: true,
				default: [100, 100],
				no_function: false,
				description: ''
			},
			choices: {
				type: [jsPsych.plugins.parameterType.KEYCODE, jsPsych.plugins.parameterType.SELECT],
				options: ['mouse'],
				array: true,
				default: undefined,
				no_function: false,
				description: ''
			},
			timing_stim: {
				type: [jsPsych.plugins.parameterType.INT],
				default: -1,
				no_function: false,
				description: ''
			},
			timing_response: {
				type: [jsPsych.plugins.parameterType.INT],
				default: -1,
				no_function: false,
				description: ''
			},
			response_ends_trial: {
				type: [jsPsych.plugins.parameterType.BOOL],
				default: true,
				no_function: false,
				description: ''
			},
			csv_directory: {
				type: [jsPsych.plugins.parameterType.STRING],
				default: '',
				no_function: false,
				description: ''
			}
		}
	}

	plugin.trial = function(display_element, trial) {
		$('body').css('background-color', '#6e6e6e');
		//is this calibration or validation
		console.log('%cevent: %s','color: green',trial.event);

		//calibration is occuring
		if(trial.event==='isCalibrating'){isCalibrating = true; isValidating = false; $('body').css('cursor',"auto");}
		else if (trial.event==='isValidating'){isCalibrating = false; isValidating = true; calibration_time_0 = webgazer_time; $('body').css('cursor',"none");}

		// if any trial variables are functions
		// this evaluates the function and replaces
		// it with the output of the function
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

		// set default values for the parameters
		trial.timing_stim = trial.timing_stim || -1;
		trial.timing_response = trial.timing_response || -1;
		trial.canvas_size = trial.canvas_size || [400, 400];
		trial.image_size = trial.image_size || [100, 100];
		trial.coordinates = trial.coordinates || [100, 100];
		
		//start eyelink
		if ((subject.webcam_used == true)){
			/*pause eyetracking*/
			//check if webcam is used
			function webgazerResume(){		
				//put webcam in idle
				if (webgazer_idle == true){
					webgazer.resume(); //begins collecting click data and activates the camera	
					console.log('%ceyelink started','color: orange');
					webgazer_idle = false;
				};
			};
			webgazerResume();
		};

		//time
		if (isCalibrating){
			calibration_time_0 = performance.now();
		};
		
		//if first trial
		if (calibration_trial == 0){
			//checking display window size
			subject.display_window = [window.innerWidth+"x"+window.innerHeight];
		}
		
		// this array holds handlers from setTimeout calls
		// that need to be cleared if the trial ends early
		var setTimeoutHandlers = [];

		//prepare display stimulus
		var image_size = [200, 200];
		
		//timeout to allow svg to finish (msec)
		var delay = (function() {
    		var timer = 0;
    		return function(callback, ms) {
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
    		};
		})();
		
		//move circle and bounds
		move_bounds = function(){
			//get progress position
			progress_position = progressbar_div.getBoundingClientRect();
			///if bounds not created
			if ($('#bounds').length === 0){
				//create circle
				$('<div id="bounds"></div>').appendTo('body').css({
					'border': '20px solid #363636', 'border-radius': '50%', 
					'z-index': '-1','position': 'absolute', 'box-sizing': 'border-box',
					'width': progress_position.width * 2, 'height': progress_position.width * 2,
					'left': (circle_x - progress_position.width) + "px", 'top': (circle_y - progress_position.width) + "px"
				});
			///if bounds already created
			} else {
				$('#bounds').css({'left': (circle_x - progress_position.width) + "px", 'top': (circle_y - progress_position.width) + "px"});
			};
			//draw center of calibration
			///if center not created
			if ($('#center').length === 0){
				$('<div id="center"></div>').appendTo('body').css({
					'background':'blue',
					'z-index': '1','position': 'absolute', 'border-radius': '50%',
					'width': 5, 'height': 5, 
					'left': circle_x + "px", 'top': circle_y + "px"
				});
			///if center already created
			} else {
				$('#center').css({'left': circle_x + "px", 'top': circle_y + "px"});
			};
		};

		//create progress element (only if not yet created)
		if ($('#progress-container').length == 0){
			if(debug){
				console.log('creating progressbar parent');
			};
			$('.container-inner').append("<div id='progress-container'></div>");
		};

		//create progress bar (only if not yet created)
		if ($('#progressbar').length === 0){
			if (isCalibrating){
				console.log('isCalibrating');
				///reset position of circle and debug divs
				circle_x = (calibration_coordinates[calibration_trial][0]/100) * window.screen.width;
				circle_y = (calibration_coordinates[calibration_trial][1]/100) * window.screen.height;
				//get left and right
				left = calibration_coordinates[calibration_trial][0];
				right = calibration_coordinates[calibration_trial][1];
			} else {
				console.log('isValidating');
				///reset position of circle and debug divs
				circle_x = (validation_coordinates[calibration_trial][0]/100) * window.screen.width;
				circle_y = (validation_coordinates[calibration_trial][1]/100) * window.screen.height;
				//get left and right
				left = validation_coordinates[calibration_trial][0];
				right = validation_coordinates[calibration_trial][1];
			};
			//create progress svg
			progressbar = new ProgressBar.Circle('#progress-container', {
				color: '#ffffff',
				// This has to be the same size as the maximum width to
				// prevent clipping
				strokeWidth: 10,
				trailWidth: 10,
				easing: 'linear',
				duration: 0,
				from: {
					color: '#ff0000',
					width: 1
				},
				to: {
					color: '##00ff00',
					width: 10
				},
				// Set default step function for all animate calls
				step: function(state, circle) {
					circle.path.setAttribute('stroke', state.color);
					circle.path.setAttribute('stroke-width', state.width);
				}
			});
			progressbar.svg.id = "progressbar";
			//get progress element
			progressbar_div = $('#progress-container')[0];
			//get progress position
			progress_position = progressbar_div.getBoundingClientRect();
			///set progress coordiantes
			$('#progress-container').css({
				'left': left + "%",
				'top': right + "%"
			});
			//create circle and point
			move_bounds();
		};

		//change color of bounds if gaze is within it
		isBounds = function(){
			//compare
			var min = 0.75
			var max = 1.25
			//x and y is 85% of circle
			var param = ((circle_x * min) <= gaze_x && gaze_x < (circle_x * max)) && ((circle_y * min) <= gaze_y && gaze_y < (circle_y * max));
			///webgazer change color if param
			if (param){
				$('#bounds').css({'background':'#608b62'})
			} else {
				$('#bounds').css({'background':'#efe486'})
			};
		}

		// function to end trial when it is time
		//delay duration (msec)
		var delay_t = 500;
		end_trial = function() {
			var visible = is_PageVisible();
			delay(function(){
				//flag calibration/validation as ended
				console.log('ending: '+trial.event);
				//if calibration is finished
				if(isCalibrating){
					isCalibrating = false;
					//clear click event
					$(document).off('click', "#progress-container");
					//remove progress, bounds, and center
					if (debug) {
						$('#bounds').remove();
						$('#center').remove();
					};
					$('#progress-container').remove();
				};
				//reset counters
				calibration_trial = 0; //which calibration circle (0-8)
				calibration_click = 0; //number of clicks (0-20)
				calibration_time_0 = 0; //time calibration started
				calibration_time_1 = 0; //time calibration started
				left = ''; //coordinates
				right = ''; //coordinates
				// kill any remaining setTimeout handlers
				for(var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}
				// kill keyboard listeners
				if(typeof keyboardListener !== 'undefined') {
					jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				}
				// clear the display
				display_element.html('');
				// move on to the next trial
				jsPsych.finishTrial();
			}, delay_t);
		};

		//if isCalibrating use mouse event listener 
		if (isCalibrating){
			//mouse event listener
			//if event has not been created yet
			if (($._data(document,"events").click) === undefined){
				$(document).on('click', "#progress-container", function(event){
					//if end of trial
					if(calibration_click === trial.clickNum){
						//if end of calibration
						if(calibration_trial === calibrationNum){
							console.log('calibration finished');
							//reset progressbar counter
							progressbar.animate(0);
							//end calibration
							end_trial();
						//calibration not over yet
						} else {
							//update time 
							calibration_time_0 = performance.now();
							//update counter
							calibration_trial = calibration_trial + 1;
							///move circle and bounds
							if (debug){
								console.log({
									//event
									'event': 'isCalibrating',
									//click info
									'calibration_click': calibration_click,
									'calibration_trial': calibration_trial,
									'left': calibration_coordinates[calibration_trial][0]+"%", 
									'right': calibration_coordinates[calibration_trial][1]+"%", //requested coordinates
								});
							};
							//reset progressbar counter
							progressbar.animate(0);
							//reset calibration_click for each trial
							calibration_click = 0; //number of clicks (0-19)
							calibration_time_0 = 0; //time calibration started
							calibration_time_1 = 0; //time calibration started
							//center of bounds and circle
							circle_x = (calibration_coordinates[calibration_trial][0]/100) * window.screen.width;
							circle_y = (calibration_coordinates[calibration_trial][1]/100) * window.screen.height;
							//move circle, progress, and bounds
							///move progress
							$('#progress-container').css({
								'left': calibration_coordinates[calibration_trial][0] + "%",
								'top': calibration_coordinates[calibration_trial][1] + "%"
							});
							///move circle and bounds
							if (debug){
								//move bounds circle
								move_bounds();
							};
						};
					//trial not over
					} else {
						if (debug){
							console.log('calibration_click: '+ calibration_click);
							console.log('mouse_x: '+ event.clientX + ', mouse_y: '+ event.clientY);
							console.log('circle_x: '+ circle_x + ', circle_y: '+ circle_y);
						};
						//get coordinates
						/// mouse coordinates
						mouse_x = event.clientX;
						mouse_y = event.clientY;
						/// get center of bounds and circle
						circle_x = (calibration_coordinates[calibration_trial][0]/100) * window.screen.width;
						circle_y = (calibration_coordinates[calibration_trial][1]/100) * window.screen.height;
						/// circle position
						circle_width = progress_position.width
						/// time now
						calibration_time_1 = performance.now() - calibration_time_0;
						
						//update log
						var data_sample = {
							'participant': participant_id,
							'expName': settings.expName,
							'session': pid.session,
							'subsession': pid.subsession,
							'timestamp': calibration_time_1,
							'event': 'isCalibrating',
							'event_block': calibration_block,
							'event_trial': calibration_trial,
							'event_click': calibration_click,
							'mx': mouse_x, 'my': mouse_y, //mouse coordinates
							'gx': gaze_x, 'gy': gaze_y, //gaze coordinates
							'cx': circle_x, 'cy': circle_y, //circle coordinates
							'left': calibration_coordinates[calibration_trial][0]+"%", 'right': calibration_coordinates[calibration_trial][1]+"%", //requested coordinates
							'dist': 'nan', //distance between gaze and calibration circle
							'isSuccess': 'nan', //is distance within calibration area
							'width': circle_width, //radius of calibration circle
						};
						///append stored data
						mdl.calibration.push(data_sample);

						//update circle click counter
						calibration_click = calibration_click + 1;
						//animate
						progressbar.animate((calibration_click) / (clickNum));
					};
				});
			};
		//if isValidating
		} else {
			///reset position of circle and debug divs
			circle_x = (validation_coordinates[calibration_trial][0]/100) * window.screen.width;
			circle_y = (validation_coordinates[calibration_trial][1]/100) * window.screen.height;
			//get left and right
			left = validation_coordinates[calibration_trial][0];
			right = validation_coordinates[calibration_trial][1];
			///progress bar
			$('#progress-container').css({
				'left': left + "%",
				'top': right + "%"
			});
			//print
			if (debug){
				//adjust bounds
				$('#bounds').css({'left': (circle_x - progress_position.width) + "px", 'top': (circle_y - progress_position.width) + "px"});
				$('#center').css({'left': circle_x + "px", 'top': circle_y + "px"});
				console.log({
					//event
					'event': 'isValidating',
					'calibration_trial': calibration_trial,
					//requested coordinates
					'left': validation_coordinates[calibration_trial][0]+"%", 'right': validation_coordinates[calibration_trial][1]+"%"
				});
			}
		};	

		// hide image if timing is set
		if(trial.timing_stim > 0) {
			var t1 = setTimeout(function() {
				$('#jspsych-calibration-canvas').css('visibility', 'hidden');
			}, trial.timing_stim);
			setTimeoutHandlers.push(t1);
		}

		// end trial if time limit is set
		if(trial.timing_response > 0) {
			var t2 = setTimeout(function() {
				end_trial();
			}, trial.timing_response);
			setTimeoutHandlers.push(t2);
		}
	};

	return plugin;
})();