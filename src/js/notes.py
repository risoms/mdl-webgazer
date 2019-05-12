'''
Modifications
'''
'''
1) Changed settings.trials to '1'
'''
# original
# /**
#  * Settings configuration
#  */
# var iterate = 0;
# //note: onset/offset times are within their respective events (not trial level)
# var settings = {
# 	//calibration level
# 	expName:'gRT-dotprobe-2',
# 	trials: 21,

'''
2) Changed debug to true
'''
# original
# } else {
# 			//if eyetracking is successful
# 			if (subject.webcam_used == true) {
# 				subject.webcam_size = [webgazerVideoFeed.videoWidth+"x"+webgazerVideoFeed.videoHeight];
# 				createEvent(); //prepare worker
# 				experiment = experiment.concat(camera_instructions, camera_check, camera_finished, calibrate, instructions, task);

'''
To Do
'''
'''
1) check dist packages for updates (headtracker.js, webgazer)
'''
'''
2) impliment new code (block level calibration, store calibration data (analysis compare error rate between estimated and webgazer identified fixation location))
'''
'''
1) Set correct redcap links
'''


deni
lap