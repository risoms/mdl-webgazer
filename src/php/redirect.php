<?php
/* by: Semeon Risom (8/23/17)
 * email: semeon.risom@gmail.com
 * description: export survey link from redcap
 * php version: 5.6.25
*/
function redirect($record_id) {
	//get data from redcap
	$data = array(
		'token' => '#####', //hidden for public github release
		'content' => 'surveyLink',
		'format' => 'json',
		'instrument' => 'post_questionnaires',
		'event' => '',
		'record' => $record_id,
		'returnFormat' => 'json'
	);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://redcap.prc.utexas.edu/redcap/api/');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_VERBOSE, 0);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_AUTOREFERER, true);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
	$output = curl_exec($ch);
	curl_close($ch);
	return $output;
};
?>