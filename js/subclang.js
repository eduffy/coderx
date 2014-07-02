
var API_UPDATE_ATTEMPT_COUNT = APIROOT + "/getAttemptCount.php";
var API_LOAD_EXERCISE_LIST = APIROOT + "/getExerciseList.php";
var API_LOAD_EXERCISE      = APIROOT + "/getExercise.php";
var API_SAVE_SUBMISSION    = APIROOT + "/saveSubmission.php";
var API_SUBMIT_EXERCISE    = "/~eduffy/clang/clangAST.php";

var currentExercise = null;


function initCodeEditor()
{
  var editor = ace.edit("editor");
  editor.getSession().setMode("ace/mode/c_cpp");
  editor.setTheme("ace/theme/clouds");
  editor.setShowPrintMargin(false);
  editor.setReadOnly(true);
}

function updateAttemptCount()
{
  var ordinalSeries = [ "first", "second", "third", "fourth", "fifth", "sixth", ];
  onUpdateAttemptCountSuccess = function(count, textStatus, xhr) {
    var editor = ace.edit("editor");
    console.log('attemps', count);
    if(count.attempts == 0) {
      editor.setValue("// Type your code here!\n");
      $('#view-history-link').hide();
      $('#clear-history-link').hide();
    }
    else {
      editor.setValue(count.lastAttempt);

      $('#view-history-link').attr('href', "history.php?exercise=" + currentExercise.name);
      $('#clear-history-link').data('exercise', currentExercise.name);
      $('#view-history-link').show();
      $('#clear-history-link').show();
    }
    editor.clearSelection();

    $('#attempt-count').text(ordinalSeries[count.attempts]);
    $('#attempt-message').show();
  }

  onUpdateAttemptCountError = function(xhr, textStatus, errorThrown) {
    console.log(xhr);
    console.log(textStatus);
    console.log(errorThrown);
    setMessageHTML('danger', "<strong>Internal Error.</strong>  This is not your fault, please report this error to your instructor.");
  }

  $.ajax({
    async:    true,
    url :     API_UPDATE_ATTEMPT_COUNT,
    type:     'POST',
    data:     { 'exercise': currentExercise.name },
    dataType: 'json',
    success:  onUpdateAttemptCountSuccess,
    error:    onUpdateAttemptCountError,
  });
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
    updateAttemptCount();
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
    /* at this point, the solution has passed all tests. perhaps
       we congratulate the student on out-smarting metrics ! */
    msg = "Wow -- your solution is above and beyond!";
    passed = true;
  }
  else if(number == exercise.mccabe)
    msg = "Excellent job -- your solution is the highest quality.";
  else if(number == exercise.mccabe+1) {
    msg = "Good, but you can write a better solution.";
    passed = true;
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

function saveSubmission(event)
{
  var editor  = ace.edit("editor");
  var message = $('#message-text').text();

  console.log('message',message);

  onSaveSubmissionSuccess = function(result, textStatus, xhr) {
    console.log(result);
  };

  onSaveSubmissionError = function(xhr, textStatus, errorThrown) {
    console.log(xhr);
    console.log(textStatus);
    console.log(errorThrown);
    setMessageHTML('danger', "<strong>Internal Error.</strong>  This is not your fault, please report this error to your instructor.");
  };

  $.ajax({
    async:    true,
    url :     API_SAVE_SUBMISSION,
    type:     'POST',
    data:     { 'exercise': currentExercise.name
              , 'input':    editor.getValue()
              , 'message':  message
              },
    dataType: 'json',
    success:  onSaveSubmissionSuccess,
    error:    onSaveSubmissionError,
  });

  return false;
}

function submitExercise(button)
{
  $('#message-box').fadeTo('fast', 0);
  var spin = Ladda.create(button);
  var editor = ace.edit("editor");

  onSubmitExerciseSuccess = function(result, textStatus, xhr) {
    console.log(result);
    spin.stop();

    var passed = true;

    if(result.Errors.length > 0) {
      setClangErrorMessage("syntax error", result.Errors[0].line, 
      result.Errors[0].column, result.Errors[0].message);
      passed = false;
    }

    if(passed && result.Warnings.length > 0) {
      setClangErrorMessage("warning", result.Warnings[0].line, 
      result.Warnings[0].column, result.Warnings[0].message);
      passed = false;
    }

    if(passed) {
      passed = checkPrototype(result.AST, currentExercise);
      if ( !passed ) {
        var msg = 'The function prototype must match the specification';
        setMessageHTML('warning', msg);
      }
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
    updateAttemptCount();
  };

  onSubmitExerciseError = function(xhr, textStatus, errorThrown) {
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
