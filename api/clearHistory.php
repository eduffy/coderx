<?php
if(!isset($_COOKIE['CRX_USERNAME'])) {
  $result = array(
    "result"  => "error",
    "message" => "Login required."
  );
}
else {
  $topdir    = realpath(dirname($_SERVER['SCRIPT_FILENAME']) . "/..");
  $username  = $_COOKIE['CRX_USERNAME'];
  $soldir    = $topdir . "/solutions/" . $username;
  $exname    = basename($_POST['exercise']);
  $solutions = glob($soldir . "/" . $exname . ".*");

  foreach($solutions as $fn) {
    unlink($fn);
  }
  $result = array("result" => "ok");
}

header('Content-type: application/json');
echo json_encode($result);

?>
