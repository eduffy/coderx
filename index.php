<!DOCTYPE html>
<html>
 <head>
  <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
  <link rel="stylesheet" href="ladda/ladda-themeless.min.css" />
  <style>
#editor {
  position: relative;
  height: 400px;
}
  </style>

 </head>
 <body>
  <nav class="navbar navbar-default" role="navigation">
   <div class="container-fluid">
    <ul class="nav navbar-nav navbar-right">
     <li><a href="#">Login to Code&#8478;</a></li>
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
      <div id="error-box" class="col-md-6 alert alert-warning">
        <p id="error-message">&nbsp;</p>
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

 <script src="jquery-2.1.1.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="bootstrap/js/bootstrap.min.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="ace/ace.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="ace/mode-c_cpp.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="ace/theme-clouds.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="ladda/spin.min.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="ladda/ladda.min.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="McCabe/mccabe.js" type="text/javascript" 
         charset="utf-8"></script>
 <script src="subclang.js" type="text/javascript" 
         charset="utf-8"></script>


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
});
</script>
  
</html>
