<?php
  $username = null;
  if(isset($_POST['username'])) {
    $username = $_POST['username'];
    if($_POST['rememberMe'] == "remember-me") {
      setcookie('CRX_USERNAME', $_POST['username'], time()+60*60*24*30);
    }
  }
  elseif(isset($_COOKIE['CRX_USERNAME'])) {
    $username = $_COOKIE['CRX_USERNAME'];
  }
?><!DOCTYPE html>
<html>
 <head>
  <title>Code&#8478;</title>
  <link rel="stylesheet" href="third-party/bootstrap-3.1.1-dist/css/bootstrap.min.css" />
  <link rel="stylesheet" href="third-party/ladda/ladda-themeless.min.css" />
  <link rel="stylesheet" href="style.css" />
  <style>
#editor {
  position: relative;
  height: 400px;
}
  </style>

 </head>
 <body>

  <div id="login-modal" class="modal fade">
   <form id="login-form" action="index.php" method="GET">
    <div class="modal-dialog">
     <div class="modal-content">
      <div class="modal-header">
       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
       <h4 class="modal-title">Login</h4>
      </div>
      <div class="modal-body">
       <input id="login-username" type="text" class="form-control" name="username" placeholder="Username" required="" autofocus="" />
       <input id="login-password" type="password" class="form-control" name="password" placeholder="Password" required=""/>      
       <label class="checkbox">
        <input type="checkbox" value="remember-me" id="rememberMe" name="rememberMe"> Remember me
       </label>
       <p>Any username will do. DO NOT submit a real password.  There is no authentication at this time.</p>
      </div>
      <div class="modal-footer">
       <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
       <button id="submit-login-info" type="button" class="btn btn-primary">Login</button>
      </div>
     </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
   </form>
  </div><!-- /.modal -->

  <nav class="navbar navbar-default" role="navigation">
   <div class="container-fluid">
    <a class="navbar-brand" href="#">Code&#8478;</a>
    <ul class="nav navbar-nav navbar-right">
<?php if($username == null): ?>
     <li><a id="login-button" href="#" data-toggle="modal" data-target="#login-modal">Login</a></li>
<?php else: ?>
     <li><a href="#">Welcome, <?php echo $username; ?></a></li>
     <li><a href="logout.php">Logout</a></li>
<?php endif; ?>
    </ul>
   </div>
  </nav>

  <div id="wrap">
   <div id="main">
    <div class="container-fluid">

     <div class="row">
      <div class="col-md-5">
       <div class="btn-group">
        <a class="btn btn-default dropdown-toggle" 
           data-toggle="dropdown">
          Select an Exercise&nbsp;<span class="caret"></span>
        </a>
        <ul id="exercise-list" class="dropdown-menu" role="menu">
        </ul>
       </div>
      </div>
      <div id="message-box" class="col-md-6 alert">
        <p id="message-text">&nbsp;</p>
      </div>
      <div class="col-md-1">&nbsp;</div>
     </div>

     <!--div class="row">&nbsp;</div-->

     <div class="row">
      <div class="col-md-4">

       <div id="exercise-panel" class="panel panel-default hide">
        <div class="panel-heading">
         <h4 id="exercise-title"></h4>
        </div>
        <div class="panel-body">
         <p id="exercise-desc"></p>
        </div>
       </div>
      </div>
      <div class="col-md-8">
       <div class="well">
        <div id="editor">// Type your code here!
</div>
       </div>
      </div>
     </div> <!--row-->

     <div class="row">
      <div class="col-md-4">&nbsp;</div>
      <div class="col-md-8">
       <center>
        <a id="submit-exercise" href="#" class="btn btn-primary ladda-button" data-style="contract">
         <span class="ladda-label">Submit</span>
        </a>
       </center>
      </div>
     </div> <!--row-->

    </div>
   </div>
  </div>
 
 </body>

 <script src="third-party/jquery-2.1.1.js" type="text/javascript" charset="utf-8"></script>
 <script src="third-party/bootstrap-3.1.1-dist/js/bootstrap.min.js" type="text/javascript" charset="utf-8"></script>
 <script src="third-party/ace/src-min/ace.js" type="text/javascript" charset="utf-8"></script>
 <script src="third-party/ace/src-min/mode-c_cpp.js" type="text/javascript" charset="utf-8"></script>
 <script src="third-party/ace/src-min/theme-clouds.js" type="text/javascript" charset="utf-8"></script>
 <script src="third-party/ladda/spin.min.js" type="text/javascript" charset="utf-8"></script>
 <script src="third-party/ladda/ladda.min.js" type="text/javascript" charset="utf-8"></script>

 <script>var APIROOT="<?php echo dirname($_SERVER["SCRIPT_NAME"]); ?>/api";</script>
 <script src="js/mccabe.js" type="text/javascript" charset="utf-8"></script>
 <script src="js/subclang.js" type="text/javascript" charset="utf-8"></script>


<script>
$(document).ready(function() {
    /* start it hidden so there's no "blink" effect 
       when the page loads */
    $('#exercise-panel').fadeTo(0, 0)
                        .removeClass('hide');
    $('#error-box').fadeTo(0, 0);

    $('.dropdown-toggle').dropdown();
    $('#error-box').click(onClickErrorMessage);
    $('#submit-exercise').click(submitExercise);
    initCodeEditor();
    loadExerciseList();

    $('#login-button').click(function() {
      $('#login-modal').modal('show');
    });
    $('#submit-login-info').click(function() {
      $('#login-form').submit();
    });
});
</script>
  
</html>
