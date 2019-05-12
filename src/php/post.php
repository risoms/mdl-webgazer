<?php
/* by: Semeon Risom (8/23/17)
 * email: semeon.risom@gmail.com
 * description: save data to database after begining experiment
 * php version: 5.6.25
*/
/*prevent direct access by url*/

if(!isset($_SERVER['HTTP_REFERER'])){
    // redirect them to your desired location
    header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
    exit;
};

/*pre-reqs*/
require_once('redirect.php');

/*query request*/
$subject = $_POST['subject'];
$session = $_POST['session'];
$subsession = $_POST['subsession'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];
$location = $_POST['location'];
$score = $_POST['score'];
$webcam = $_POST['webcam'];
$finished = $_POST['finished'];
$uploaded = $_POST['uploaded'];
$slow = $_POST['slow'];

/*debugging: testing data collected from task*/
$pid = array(
    "subject_id" => $subject,
    "subject_session" => $session,
    "subject_subsession" => $subsession,
    "start_time" => $start_time,
	"end_time" => $end_time,
    "location" => $location,
    "score" => $score,
    "webcam" => $webcam,
    "success" => $finished,
    "uploaded" => $uploaded,
    "slow" => $slow
);

/*SQL server connection information*/
$host = 'mysql.utweb.utexas.edu';
$user = '#####';  #hidden for public github release
$pass = '#####';  #hidden for public github release
$db = '#####';  #hidden for public github release
$table = '#####';  #hidden for public github release

/*Connect to mysql database*/
$link = mysqli_connect($host, $user, $pass, $db);

/*debugging: check connection*/
//if fail
if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit();
}
//if success
//echo "Successful connection to MySQL was made!" . PHP_EOL;
//echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;
/*append table*/
//note: using 0 for id allows auto-sequencing
$insert = "INSERT INTO `$table` (
`id`, 
`subject_id`, 
`subject_session`, 
`subject_subsession`,
`start_time`, 
`end_time`, 
`location`, 
`score`, 
`webcam`,
`finished`,
`uploaded`,
`slow`) VALUES 
(0,
'$subject',
'$session', 
'$subsession', 
CAST('$start_time' AS DATETIME),
CAST('$end_time' AS DATETIME),
'$location',
'$score',
'$webcam',
'$finished',
'$uploaded',
'$slow')";

/*get query*/
$query = mysqli_query($link, $insert);

/*Frees the memory from result*/
mysqli_free_result($query);

/*Closes database connection*/
mysqli_close($link);

/*create redirect*/
//if subsession == abc
if ($subsession === 'abc') {
	$redirect_url = redirect($subject);
	echo json_encode($redirect_url);
} else {
	echo json_encode($pid); //prints values back to browser
};
?>