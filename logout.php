<?php
  setcookie("CRX_USERNAME", "", time()-3600);
  header("Location: index.php");
?>
