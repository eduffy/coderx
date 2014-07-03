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
    
    $diff = `diff -p -U 1000 $sol1 $sol2`;
    if($diff == "") {
      $diff = file_get_contents($sol2);
    }
    $lines = explode("\n", $diff);
    foreach($lines as $line) {
      if($line == "") continue;
      if(startsWith($line, "--- ")) continue;
      if(startsWith($line, "+++ ")) continue;
      if(startsWith($line, "@@ ")) continue;
      if(startsWith($line, "\\ ")) continue;

      if($count == 1) {
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

    printf("</pre>\n");
    $count += 1;
  }
}
?>
</div>
</div>
</div>
</body>
</html>

