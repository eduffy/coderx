
var API_LOAD_EXERCISE_LIST = APIROOT + "/getExerciseList.php";
var API_LOAD_EXERCISE = APIROOT + "/getExercise.php";
var API_SUBMIT_EXERCISE = "/~eduffy/clang/clangAST.php";

var currentExercise = null;


function initCodeEditor()
{
  var editor = ace.edit("editor");
  editor.getSession().setMode("ace/mode/c_cpp");
  editor.setTheme("ace/theme/clouds");
  editor.setShowPrintMargin(false);
  editor.setReadOnly(true);
}

function loadExerciseList()
{
  onLoadExerciseListSuccess = function(exercises, textStatus, xhr) {
    console.log(exercises);
    var html = '';
    for(i in exercises) {
      html += '<li><a class="exercise-option" data-name="' 
           + exercises[i].name + '" '
           +  'href="#">' + exercises[i].title + '</a></li>';
    }
    $('#exercise-list').html(html);
    $('.exercise-option').click(loadExercise);
  };

  onLoadExerciseListError = function(xhr, textStatus, errorThrown) {
    console.log(xhr);
    console.log(textStatus);
    console.log(errorThrown);
    setMessageHTML('danger', "<strong>Internal Error.</strong>  This is not your fault, please report this error to your instructor.");
  };

  $.ajax({
    async:    true,
    url :     API_LOAD_EXERCISE_LIST,
    type:     'POST',
    dataType: 'json',
    success:  onLoadExerciseListSuccess,
    error:    onLoadExerciseListError,
  });
}

function loadExercise()
{
  onLoadExerciseSuccess = function(exercise, textStatus, xhr) {
    console.log(exercise);
    currentExercise = exercise;
    $('#exercise-title').text(exercise.title);
    $('#exercise-desc').html(exercise.description);
    console.log("Expected McCabe is: "+exercise.mccabe);
    $('#exercise-panel').fadeTo('fast', 1);
    $('#submit-exercise').removeAttr('disabled');
    $('#submit-exercise').find('.ladda-label').text('Submit');

    var editor = ace.edit("editor");
    editor.setReadOnly(false);
  };

  onLoadExerciseError = function(xhr, textStatus, errorThrown) {
    console.log(xhr);
    console.log(textStatus);
    console.log(errorThrown);
    setMessageHTML('danger', "<strong>Internal Error.</strong>  This is not your fault, please report this error to your instructor.");
  };

  var name = $(this).data('name');
  $.ajax({
    async:    true,
    url :     API_LOAD_EXERCISE,
    type:     'POST',
    data:     { name: name },
    dataType: 'json',
    success:  onLoadExerciseSuccess,
    error:    onLoadExerciseError,
  });
}

function setMessageHTML(type, message, line, column)
{
  /* type is "danger", "warning", or "success" */
  $('#message-box').removeClass('alert-danger');
  $('#message-box').removeClass('alert-warning');
  $('#message-box').removeClass('alert-success');
  $('#message-box').addClass('alert-' + type);

  $('#message-text').html(message);
  $('#message-box').fadeTo('fast', 1);
  $('#message-box').data('line', line ? line : 0);
  $('#message-box').data('column', column ? column : 0);
}

function setClangErrorMessage(errorType, line, column, message)
{
  var msg = 'Your code contains a ' + errorType + ' on Line ' 
          + line + ': <strong><tt>' + message + '</tt></strong>.';
  setMessageHTML('warning', msg, line, column);
}

function showMcCabe(number, exercise)
{
  var passed = true;
  var msg = null;
  console.log("Your McCabe number is: "+number);
  if(number < exercise.mccabe) {
    /* at this point, the solution has passed all tests.
       perhaps we congradulate the student on out-smarting the professor! */
    msg = "Oops -- your solution is impossible!";
    passed = false;
  }
  else if(number == exercise.mccabe)
    msg = "Excellent job -- your solution is the highest quality.";
  else if(number == exercise.mccabe+1) {
    msg = "Good, but you can write a better solution.";
    passed = false;
  }
  else {
    msg = "You can do much better.";
    passed = false;
  }
  setMessageHTML(passed ? 'success' : 'warning', msg);
  return passed;
}

function onClickErrorMessage(event)
{
  var editor = ace.edit("editor");
  var line = $(this).data('line') - 1;
  var col  = $(this).data('column') - 1;
  editor.moveCursorTo(line, col, false);
  editor.focus();
}

function submitExercise(event)
{
  event.preventDefault();
  $('#message-box').fadeTo('fast', 0);
  var spin = Ladda.create(this);
  var editor = ace.edit("editor");

  onSubmitExerciseSuccess = function(result, textStatus, xhr) {
    console.log(result);
    spin.stop();

    // TODO: save source code to git repos

    var passed = true;

    if(result.Errors.length > 0) {
      setClangErrorMessage("syntax error", result.Errors[0].line, 
      result.Errors[0].column, result.Errors[0].message);
    }

    if(passed && result.Warnings.length > 0) {
      setClangErrorMessage("warning", result.Warnings[0].line, 
      result.Warnings[0].column, result.Warnings[0].message);
    }

    if(passed) {
      // TODO: check function prototype
    }

    if(passed) {
      // TODO: check function correctness
    }

    if(passed) {
      // TODO: calculate McCabe score
      var score = getMcCabeScore(result.AST);
      passed = showMcCabe(score, currentExercise);
    }


    if(passed) {
      $('#submit-exercise').attr('data-color', 'green');
      var lbl = $('#submit-exercise').find('.ladda-label');
      lbl.text('Success!');
      spin.disable();
    }
  };

  onSubmitExerciseError = function(xhr, textStatus, errorThrow) {
    spin.stop();
    console.log(xhr);
    console.log(textStatus);
    console.log(errorThrown);
    setMessageHTML('danger', "<strong>Internal Error.</strong>  This is not your fault, please report this error to your instructor.");
  };

  spin.start();
  $.ajax({
    async:    true,
    url :     API_SUBMIT_EXERCISE,
    type:     'POST',
    data:     { InputSource: editor.getValue() },
    dataType: 'json',
    success:  onSubmitExerciseSuccess,
    error:    onSubmitExerciseError,
  });

  return false;
}
