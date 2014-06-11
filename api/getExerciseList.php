<?php

require_once "Spyc.php";

$topdir = realpath(dirname($_SERVER['SCRIPT_FILENAME']) . "/..");
$exdir  = $topdir . "/exercises";

$result = array();
foreach(glob($exdir . "/*.yaml") as $fn) {
  $ex = spyc_load_file($fn);
  $result[] = array(
    'title' => $ex['title'],
    'name'  => basename($fn, '.yaml'));
}

header('Content-type: application/json');
echo json_encode($result);

?>
