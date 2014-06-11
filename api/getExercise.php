<?php

require_once "Spyc.php";

$topdir = realpath(dirname($_SERVER['SCRIPT_FILENAME']) . "/..");
$exdir  = $topdir . "/exercises";

$fn = $exdir . "/" . $_POST['name'] . ".yaml";
if(file_exists($fn)) {
  $result = spyc_load_file($fn);
}
else {
  $result = array(
    "error" => "Exercise '" . $_POST['name'] . "' does not exist.");
}

header('Content-type: application/json');
echo json_encode($result);

?>
