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

  if(!file_exists($soldir)) {
    mkdir($soldir);
  }

  $count = 1;
  while(file_exists(sprintf("%s/%s.%03d.cpp", $soldir, $exname, $count))) {
    $count += 1;
  }
  $solution_fn = sprintf("%s/%s.%03d.cpp", $soldir, $exname, $count);
  $message_fn  = sprintf("%s/%s.%03d.msg", $soldir, $exname, $count);

  if(isset($_POST['input'])) {
    file_put_contents($solution_fn, $_POST['input']);
  }
  elseif(isset($_FILES['input'])) {
    $fn = $_FILES['input']['tmp_name'];
    move_uploaded_file($_FILES['input']['tmp_name'], $solution_fn);
  }

  file_put_contents($message_fn, $_POST['message']);

  $result = array(
    "result" => "ok",
    "count"  => $count);
}



header('Content-type: application/json');
echo json_encode($result);

?>
