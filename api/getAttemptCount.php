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
  $solutions = glob($soldir . "/" . $exname . ".*.cpp");

  $lastAttempt = null;
  if(!empty($solutions)) {
    end($solutions);
    $lastAttempt = file_get_contents($solutions[key($solutions)]);
  }

  $result = array(
    "result"      => "ok",
    "lastAttempt" => $lastAttempt,
    "attempts"    => count($solutions));
}



header('Content-type: application/json');
echo json_encode($result);

?>
