<html>
<head>
<link rel="stylesheet" href="third-party/bootstrap-3.1.1-dist/css/bootstrap.min.css" />
</head>
<body>
 <div id="wrap">
   <div id="main">
    <div class="container-fluid">
<?php

function startsWith($haystack, $needle) {
  return $needle === "" || strpos($haystack, $needle) === 0;
}

if(!isset($_COOKIE['CRX_USERNAME'])) {
  $result = array(
    "result"  => "error",
    "message" => "Login required."
  );
}
else {
  $topdir   = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
  $username = $_COOKIE['CRX_USERNAME'];
  $soldir   = $topdir . "/solutions/" . $username;
  $exname   = basename($_GET['exercise']);

  $count = 1;
  while(file_exists(sprintf("%s/%s.%03d.cpp", $soldir, $exname, $count))) {
    $sol1 = $count > 1 ? sprintf("%s/%s.%03d.cpp", $soldir, $exname, $count-1) : "/dev/null";
    $sol2 = sprintf("%s/%s.%03d.cpp", $soldir, $exname, $count);

    $msg  = file_get_contents(sprintf("%s/%s.%03d.msg", $soldir, $exname, $count));
    printf("<h4>%s<small class=\"pull-right\">%s</small></h4><pre>", $msg, date("D F d Y, H:i:s", filemtime($sol2)));
    
    $diff = `diff -Nup $sol1 $sol2`;
    echo $diff;

    printf("</pre>\n");
    $count += 1;
  }
}


exit(0);

$log = file_get_contents("sample_git_log.txt");
$lines = explode("\n", $log);
$numEntries = 0;
$inHeader = false;
$date = null;
foreach($lines as $line) {
  if($line == "") continue;
  if(startsWith($line, "Author: ")) continue;
  if(startsWith($line, "diff --git")) continue;
  if(startsWith($line, "new file ")) continue;
  if(startsWith($line, "index ")) continue;
  if(startsWith($line, "--- ")) continue;
  if(startsWith($line, "+++ ")) continue;

  if(startsWith($line, "commit ")) {
    $numEntries += 1;
    $inHeader = true;
  }
  elseif(startsWith($line, "@@ ")) {
    if($inHeader) printf("<small class=\"pull-right\">%s</small></h4><pre>", $date);
    $inHeader = false;
  }
  elseif(startsWith($line, "Date: ")) {
    if($numEntries > 1) printf("</pre>");
    /* printf("<h4><small>%s</small> ", substr($line, 6, 21)); */
    printf("<h4>");
    $date = substr($line, 6, 21);
  }
  elseif(startsWith($line, "    ") && $inHeader) {
    printf("%s", substr($line, 4));
  }
  elseif(startsWith($line, "+") && $numEntries == 1) {
    printf(" %s\n", substr($line, 1));
  }
  elseif(startsWith($line, "+")) {
    printf("<font color=\"green\">%s</font>\n", $line);
  }
  elseif(startsWith($line, "-")) {
    printf("<font color=\"red\">%s</font>\n", $line);
  }
  else {
    printf("%s\n", $line);
  }
}
printf("</pre>");

?>
</div>
</div>
</div>
</body>
</html>

