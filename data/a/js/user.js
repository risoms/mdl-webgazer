//overlay
function loadingEnd(){
	console.log("loading finished");
	$("#overlay").remove();
};

//graph
function getRandomColor() {//random color generator
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
//generate graph
//stacked barchart
var temp;
var temp_array;
function generate(){
	//Wanted mixed object
	temp = [];
	//Store keys, so we do not need to check from temp if key allready exists
	temp_keys = {};
	json_filter = _.filter(json_data, {subject_subsession: 'abc'}); //filter for relevant subession only
	//Loop trough data
	for (var i in json_filter){
		//Check if key is allready stored in object
		if (!temp_keys[json_filter[i]['subject_id']]){
			//Store new key, and save it''s position
			temp_keys[json_filter[i]['subject_id']] = temp.length;
			//Create new array element as new object
			temp.push({
					'name' : json_filter[i]['subject_id'],
					showlegend: true,
					'x': [], //date
					'y': [], //score
					'session': [],
					'type': 'bar',
					'orientation': 'h'
				});
		}
		//Save values into correct position
		temp[temp_keys[json_filter[i]['subject_id']]]['y'].push(
				//json_filter[i]['subject_id']
				json_filter[i]['subject_id']
		);
		temp[temp_keys[json_filter[i]['subject_id']]]['x'].push(
				json_filter[i]['score']
				//json_filter[i]['subject_session']
		);
			//Save values into correct position
		temp[temp_keys[json_filter[i]['subject_id']]]['session'].push(
				json_filter[i]['subject_session']
		);
	};
	temp_array = Object.keys(temp_keys).reverse();
	function PlotlyTimeSeries(){
		console.log('width'+$('.dashboard-main').width())
		console.log('height'+$('.dashboard-main').height())
		layout = {
			autosize: true,
			width: $('.dashboard-main').width(),
			height: $('.dashboard-main').height(),
			"xaxis": {
				'title': "Scores"
			},
			"yaxis": {
				'title': "Participant",
        		'categoryorder': "array",
				'categoryarray': temp_array
			},
			legend: {
				bgcolor: '#efefef',
				font: {color: '#666666'}
			},	 
			margin: {l: 40,r: 40,b: 42,t: 40,pad: 4},
			paper_bgcolor: '#f7f7f7',
			plot_bgcolor: '#efefef',
			barmode: 'stack',
			title: 'Participant Scores'
		};
		Plotly.plot('dashboard-data', temp, layout, {displayModeBar: false});
	};
	PlotlyTimeSeries();
}

//topbar
function getRecentData() {
	var recentParticipant = (_.uniqBy(cloneJson_data, 'subject_session'))[0]
	recentTicker = "Newest Subject: " + recentParticipant.subject_id +
		", location: " + recentParticipant.location + 
		" (" + recentParticipant.subject_session + "), " + recentParticipant.end_time
	$('#sidebar-subject').text(recentTicker)//most recent subject on top bar
};

//use with defaulting leftside bar as well as recent and old subject list on right-side bar
function getTimeline(){
	var timelineTemplate = [
	'<div class="frst-timeline-block lab-item frst-timeline-completed" data-animation="slideInUp">',
		'<div class="lab-timeline-img"><span></span></div>',
		'<!-- frst-timeline-img -->',
		'<div class="frst-timeline-content animated rotateInDownRight" style="position: relative;">',
			'<div class="frst-timeline-content-inner">',
				'<span class="frst-date">06/16/2017<br>9:00 - 10:00AM</span>',
				'<h2>9999</h2>',
				'<p>session: 1-abc</p>', 
				'<p>score: 4141</p>', 
				'<p>location: lab</p>',
			'</div>',
			'<!-- frst-timeline-content-inner -->',
		'</div>',
		'<!-- frst-timeline-content -->',
	'</div>'
	].join('');
	for (i = 0; i < 1; i++) {
		$('#timeline').append(timelineTemplate)//most recent subject on top bar
	}
};

//recent and old subject list on right-side bar
function getNewList(){
	var newJson = _.uniqBy(cloneJson_data, 'subject_id');
	var newL = newJson.length - 1
	var newElement;
	if (newL < 10){len = newL+1} else {len=10};
	for (i = 0; i < len; i++) {
		var recentSubject = newJson[i];
		subject = recentSubject.subject_id;
		loc=recentSubject.location;
		session=recentSubject.subject_session;
		subsession=recentSubject.subject_subsession;
		score=recentSubject.score;
		date=moment(recentSubject.end_time).format("L");
		time=[moment(recentSubject.start_time).format("hh:mm"),moment(recentSubject.end_time).format("hh:mma")];
		newElement += [
			'<div class="feed-element">',
				'<a class="pull-left">',
					'<div alt="image" class="location-color-'+loc+'"></div>',
				'</a>',
				'<div class="media-body">',
					'<small class="pull-right">'+moment(recentSubject.end_time).fromNow()+'</small>',
					'<strong>'+subject+'</strong> completed session <strong>'+session+'-'+subsession+'</strong> at '+loc+', scoring <strong>'+score+'</strong> points.<br>',
					'<small class="text-muted">'+time[0]+' - '+time[1]+'</small>',
				'</div>',
			'</div>'
		].join('');
	}
	$('#new-subject-container').html(newElement.replace('undefined',''))//most recent subject on top bar
};

function getOldList(){
	var oldJson = _.uniqBy(cloneJson_data, 'subject_id');
	var oldL = oldJson.length - 1
	var oldElement;
	if (oldL < 10){len = oldL+1} else {len=10};
	for (i = 0; i < len; i++) {
		var oldSubject = oldJson[oldL - i];//counting backwards
		subject=oldSubject.subject_id;
		loc=oldSubject.location;
		session=oldSubject.subject_session;;
		subsession=oldSubject.subject_subsession;
		score=oldSubject.score;
		date=moment(oldSubject.end_time).format("L");
		time=[moment(oldSubject.start_time).format("hh:mm"),moment(oldSubject.end_time).format("hh:mma")];
		oldElement +=[
			'<div class="feed-element">',
				'<a class="pull-left">',
					'<div alt="image" class="location-color-'+loc+'"></div>',
				'</a>',
				'<div class="media-body">',
					'<small class="pull-right">'+moment(oldSubject.end_time).fromNow()+'</small>',
					'<strong>'+subject+'</strong> completed session <strong>'+session+'-'+subsession+'</strong> at '+loc+', scoring <strong>'+score+'</strong> points.<br>',
					'<small class="text-muted">'+time[0]+' - '+time[1]+'</small>',
				'</div>',
			'</div>'
		].join('');	
	}
	$('#old-subject-container').html(oldElement.replace('undefined',''))//most recent subject on top barl
};

//timeline searchbar
var cloneJson_data; //cloned and reversed json_data: most recent data first; use with timeline
function getTimelineSearch(){
	$('#timeline-search').keyup(function () {
		var output, inQuotes;
		var searchField = $(this).val();
		if (searchField === '') {
			$('#timeline').html('');
			return;
		}
		//check if in quotes
		if ((searchField.charAt(0)=="'") || (searchField.charAt(0)=="\"")){
			inQuotes = true;
			quoteChar = searchField.charAt(0)
		} else {
			inQuotes = false;
		}
		var regex = new RegExp(searchField, "i");
		var count = 1;
		$.each(cloneJson_data, function (key, val) {
			var time, date;
			//if ((val.employee_salary.search(regex) != -1) || (val.employee_name.search(regex) != -1)) {//two criteria
			if ((inQuotes) && ((quoteChar+val.subject_id+quoteChar).search(regex) != -1)) {
				console.log('quotes')
				date=moment(val.end_time).format("L")
				time=[moment(val.start_time).format("hh:mm"),moment(val.end_time).format("hh:mma")];
				output +=[
					'<div class="frst-timeline-block '+val.location+'-item frst-timeline-completed" data-animation="slideInUp">',
						'<div class="'+val.location+'-timeline-img"> <span></span> </div>',
						'<!-- frst-timeline-img -->',
						'<div class="frst-timeline-content animated rotateInDownRight" style="position: relative;">',
							'<div class="frst-timeline-content-inner">',
								'<span class="frst-date">'+date+'<br>'+time[0]+' - '+time[1]+'</span>',
								'<h2>'+val.subject_id+'</h2>',
								'<p>session: '+val.subject_session+'-'+val.subject_subsession+'</p>', 
								'<p>score: '+val.score+'</p>', 
								'<p>location: '+val.location+'</p>',
							'</div>',
							'<!-- frst-timeline-content-inner -->',
						'</div>',
						'<!-- frst-timeline-content -->',
					'</div>'
				].join('');
			} else if ((val.subject_id.search(regex) != -1) && (!inQuotes)) {
				console.log('no quotes')
				date=moment(val.end_time).format("L")
				time=[moment(val.start_time).format("hh:mm"),moment(val.end_time).format("hh:mma")];
				output +=[
					'<div class="frst-timeline-block '+val.location+'-item frst-timeline-completed" data-animation="slideInUp">',
						'<div class="'+val.location+'-timeline-img"> <span></span> </div>',
						'<!-- frst-timeline-img -->',
						'<div class="frst-timeline-content animated rotateInDownRight" style="position: relative;">',
							'<div class="frst-timeline-content-inner">',
								'<span class="frst-date">'+date+'<br>'+time[0]+' - '+time[1]+'</span>',
								'<h2>'+val.subject_id+'</h2>',
								'<p>session: '+val.subject_session+'-'+val.subject_subsession+'</p>', 
								'<p>score: '+val.score+'</p>', 
								'<p>location: '+val.location+'</p>',
							'</div>',
							'<!-- frst-timeline-content-inner -->',
						'</div>',
						'<!-- frst-timeline-content -->',
					'</div>'
				].join('');				
			} else {
				$('#timeline').html('');
			}
		});
		$('#timeline').html(output.replace('undefined',''))//most recent subject on top bar
	});
}

//file download
function beforeRequest(arguments) {
	arguments.ajaxSettings.contentType = "application/x-www-form-urlencoded";
};
var fileExplorer;
function getDownload(){
	$("#fileExplorer").ejFileExplorer({
		isResponsive: true,
		enableResize: false,
		width:"100%",
		height: $('.dashboard-main').height() - 2,
		minHeight: "400px",
		toolsList: ["layout","navigation", "addressBar", "editing", "copyPaste", "getProperties", "searchBar"],
		tools: {
			layout: ["Layout"],
			navigation: ["Back", "Forward", "Upward"],
			addressBar: ["Addressbar"],
			editing: ["Refresh", "Rename", "Upload", "Download"],
			getProperties: ["Details"],
			copyPaste: ["Copy", "Paste"],
			searchBar: ["Searchbar"]
		},
		contextMenuSettings:{
			items:{
				cwd: ["Refresh", "Paste","|", "SortBy", "|", "NewFolder", "|", "Getinfo", "View"],//rightclick folder
				files: ["Open", "Download",  "|", "Copy", "Paste", "Rename", "|", "Getinfo"],//rightclick file
				navbar: ["Upload", "|", "Copy", "Paste", "Rename", "|", "Getinfo"]//rightclick navbar
			},
			customMenuFields: [{
				id: "View",
				text: "View",
				child: [{
					id: "Tile",
					text: "Tile",
					action: "onlayout"
				},{
					id: "Grid",
					text: "Grid",
					action: "onlayout"
				},{
					id: "LargeIcons",
					text: "Large icons",
					action: "onlayout"
				}]
			}]
		},
		layout: "tile",
		fileTypes: "*.json, *.csv, *.xls, *.pdf, *.png, *.gif, *.jpg, *.jpeg, *.doc, *.docx",
		path: window.location.origin + '/a/webgazer/2/src/csv/data/', 
		ajaxAction: window.location.origin + '/a/webgazer/2/data/a/php/FileExplorer/',
		beforeAjaxRequest: "beforeRequest",
		ajaxDataType: "jsonp",
		layoutChange: "onLayoutChange",
		menuOpen: "onMenuOpen",
		allowMultiSelection: true
	});
	fe = $("#fileExplorer").data("ejFileExplorer");
	$('.e-switchView').hide(); //hide annoying footer info
	return fe;
}

//control calendar
var clndr; var popoverElement;
function popoverTemplate(eventColor,backgroundColor,LocationInfo){
	popTemplate = [
		'<div class="popover popover-'+LocationInfo+'" data-toggle="popover" data-trigger="focus" style="max-width:600px;" >',
			'<div class="arrow"></div>',
			'<div class="popover-header" id="eventClick">',
				'<h3 class="popover-title" id="event-click" style="background-color: '+eventColor+'"></h3>',
			'</div>',
			'<div class="popover-content" style="background-color: '+backgroundColor+'"></div>',
		'</div>'].join('');
	return popTemplate
}

var eventColor,session,headerLabels;
function calendarData(){
	if (window.outerWidth < 800){
		headerLabels = {
			left: 'prev, agendaDay',
			center: 'title',
			right: 'month, next'
		}
	} else {
		headerLabels = {
			left: 'today,prev,next',
			center: 'title',
			right: 'month,agendaWeek,agendaDay,listMonth'
		}
	}
	if(typeof json_data !== "undefined"){
		cloneJson_data = (_.clone(json_data)).reverse()
		getRecentData()//get most recent participant data
		getTimeline()//get timeline
		getTimelineSearch()//get timeline search
		getNewList() //getOldList();//right-side bar
		// generate() //data view
		clndr = $('#calendar').fullCalendar({
			header: headerLabels,
			allDaySlot: false,
			views: {
				month: {editable: false},
				week: {editable: false},
				agendaDay: {
					editable: false,
					titleFormat: 'MMM DD, YYYY'
				}
			},			
			selectable: true,
    		selectHelper: false,
			theme: true,
			themeButtonIcons: {prev: 'left-single-arrow', next: 'right-single-arrow'},
			defaultView: 'month',
			axisFormat: 'h:mm',
			//height: 'auto',
			eventLimit: true,
			eventSources: [{
				events:json_data,
				ignoreTimezone: false,
				eventDataTransform: function (rawEventData) {
					return {
						id: rawEventData.id,
						title: rawEventData.subject_id,
						start: new Date(rawEventData.start_time),
						end: new Date(rawEventData.end_time),
						description: "<p>id: " + rawEventData.id + 
									"<br><p>code: " + rawEventData.code +
									"<br><p>location: " + rawEventData.location +
									"<br><p>score: " + rawEventData.score +
									"<br><p>webcam: " + rawEventData.eyetracking,
						location: rawEventData.location,
						session: rawEventData.subject_session,
						subsession: rawEventData.subject_subsession,
						currentTimezone: 'America/Chicago',
						origin: 'online'
					};
				}
			}],
    		navLinks: true,
			dayClick: function(date, jsEvent, view, resourceObj) {
				$("[data-toggle='popover']").popover('hide');
				console.log('dayclick')
				console.log('day', date.format()); // date is a moment
				if(view.name != 'month'){
    				return;
				} else {
					$('#calendar').fullCalendar('gotoDate',date);
					$('#calendar').fullCalendar('changeView','agendaDay')
				}
			},
			select: function (start, end, jsEvent) {
				console.log('select')
			},
			eventClick: function(event, jsEvent, view) {
				console.log('eventclick');
			},
			eventRender: function (event, element, view) {
				if (event.location == 'home') {
					element[0].style = 'background-color: #ffb3b3 !important';
					eventColor = "#ffb3b3"
					backgroundColor = "#ead0d0"
					LocationInfo = 'home'
					session = "<b>session: </b>" + event.session +"-"+ event.subsession + "<br/>"
				} else if (event.origin == 'scheduled') {
					element[0].style = 'background-color: #98ffa4 !important';
					eventColor = "#98ffa4"
					backgroundColor = "#d3f3d7"
					LocationInfo = 'google'
					session = ""
				} else {
					element[0].style = 'background-color: #b3dcff !important';
					eventColor = "#b3dcff"
					backgroundColor = "#add8e6"
					LocationInfo = 'lab'
					session = "<b>session: </b>" + event.session +"-"+ event.subsession + "<br/>"
				};
				//popover
				element.popover({
					title: "subject: "+ event.title,
					template: popoverTemplate(eventColor,backgroundColor,LocationInfo),
					content: function () {
						session = '';
						if (event.origin != 'scheduled'){
							session = "<b>session: </b>" + event.session + "-" + event.subsession + "<br/>"
						};
						return	"<div>"+
									"<pre style='background-color: #ffffff !important'>"+
									"<p class='popoverContent' id='eventClick' style=font-family: !important;>"+
										"<b>subject: </b>" + event.title + "<br/>"+
										session +
										"<b>location: </b>" + event.location + "<br/>"+
										"<b>start: </b>" + new Date(event.start).toLocaleTimeString() + " GMT-0500" + "<br/>"+
										"<b>end: </b>" + new Date(event.end).toLocaleTimeString() + " GMT-0500" + "<br/>"+
										"<b>origin: </b>" + event.origin + "<br/>"+
									"</p>"+
									"</pre>"+
								"</div>";
					},
					placement: 'auto',
					html: 'true',
					trigger: 'focus',
					animation: 'true',
					container: 'body'
				})
				element.attr('tabindex', -1); // make the element (div) focusable
			}
		})		
		if (window.outerWidth < 800){
			$('#calendar').fullCalendar('option', 'height', 'auto');
		};
		//hide popover on prev next click
		$('.fc-prev-button').click(function () {
			$("[data-toggle='popover']").popover('hide');
		});
		$('.fc-next-button').click(function () {
			$("[data-toggle='popover']").popover('hide');
		});
	} else {
		setTimeout(calendarData, 250);
	}	
};

//control table
var json_data, dotprobe_table;
var tooltipList = {
	"id": "index",
	"subject": "subject id",
	"session": "full session number (i.e. 1, 2, 3)",
	"subsession": "part of session (i.e. 1abc, 2a, 2ab, 2abc)",
	"start time (CST)": "begining of task, in ISO format",
	"end time (CST)": "end of task (or subsession, in ISO format",
	"code": "3-digit code identifying condition (active, placebo, wait)",
	"location": "home or lab",
	"score": "session (if full session [1abc]), or sum of subsession(1ab)",
	"slow": "if over 30% of trials have RT>900msec",
	"uploaded": "data has been uploaded to server"
};

var $td;
function serverData() {
	$.ajax({
		url: "php/get.php", // this is the path to the above PHP script
		type: 'post',
		success: function (data) {
			json_data = JSON.parse(data);
			//if redirect message
			 if (json_data.redirect !== undefined && json_data.redirect){
        		// data.location contains the string URL to redirect to
				console.log('redirect true')
            	window.location.href = json_data.location;
        	} else {
				if (json_data != JSON.parse(data)){
					console.log('not equal')
					dotprobe_table = $('#database').DataTable({
						lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
						lengthChange: false,
						responsive: true,
						order: [[ 0, "desc" ]],
						dom: '<"download"B><"search"f>tp',
						buttons: ['excel', 'csv', {
							text: 'JSON',
							action: function (e, dt, button, config) {
								var data = dt.buttons.exportData();
								$.fn.dataTable.fileSave(new Blob([JSON.stringify(json_data)]),'gRT-dotprobe-js.json')
							}
            			}],
						processing: true,
						data: json_data,
						//serverSide: true,
						columns: [
							{"data": "id"},
							{"data": "subject_id"},
							{"data": "subject_session"},
							{"data": "subject_subsession"},
							{"data": "start_time"},
							{"data": "end_time"},
							{"data": "location"},
							{"data": "score"},
							{"data": "slow"},
							{"data": "webcam"},
							{"data": "uploaded"}],
						initComplete: function (settings) {
							$('#database thead th').each(function () {
								$td = $(this);
								$td.attr('title', tooltipList[$td.text()]);
							});

							/* Apply the tooltips */
							$('#database thead th[title]').tooltip({
								container: 'body',
								position: {
									my: "center bottom-20",
									at: "center top",
									using: function (position, feedback) {
										$(this).css(position);
										$("<div>").addClass("arrow")
										.addClass(feedback.vertical)
										.addClass(feedback.horizontal)
										.appendTo(this);
									}
								}
							});
						}
					});
					//dotprobe_table.buttons().container().prependTo($('#database_filter'));
					$(".download").css({"float": "left", "margin-bottom":'5px'});
					$(".search").css({"float": "right"});
					//highlight table on hover
					$('#database').on('mouseenter', 'td', function () {
						var rowIdx = dotprobe_table.cell(this).index().row;
						$(dotprobe_table.rows().nodes()).removeClass('highlight');
						$(dotprobe_table.rows(rowIdx).nodes()).addClass('highlight');
					});
				} //else {console.log('equal')};
			}
		}
	})
}
