<?php
if(!isset($_COOKIE['CRX_USERNAME'])) {
  $result = array(
    "result"  => "error",
    "message" => "Login required."
  );
}
else {
  $topdir   = realpath(dirname($_SERVER['SCRIPT_FILENAME']) . "/..");
  $username = $_COOKIE['CRX_USERNAME'];
  $soldir   = $topdir . "/solutions/" . $username;
  $exname   = basename($_POST['exercise']);

  $count = 0;
  while(file_exists(sprintf("%s/%s.%03d.cpp", $soldir, $exname, $count + 1))) {
    $count += 1;
  }

  $result = array(
    "result"   => "ok",
    "attempts" => $count);
}



header('Content-type: application/json');
echo json_encode($result);

?>
