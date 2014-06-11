
var APIROOT = "/~malloy/new.hylian/api";
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

function showError(type, line, column, message)
{
  var msg = 'Your code contains a ' + type + ' on Line ' 
          + line + ': <strong><tt>' + message + '</tt></strong>.';
  $('#error-message').html(msg);
  $('#error-box').fadeTo('fast', 1);
  $('#error-box').data('line', line);
  $('#error-box').data('column', column);
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
  $('#error-box').fadeTo('fast', 0);
  var spin = Ladda.create(this);
  var editor = ace.edit("editor");

  onSubmitExerciseSuccess = function(result, textStatus, xhr) {
    console.log(result);
    spin.stop();

    if(result.Errors.length > 0) {
      showError("syntax error", result.Errors[0].line, 
      result.Errors[0].column, result.Errors[0].message);
    }
    else if(result.Warnings.length > 0) {
      showError("warning", result.Warnings[0].line, 
      result.Warnings[0].column, result.Warnings[0].message);
    }
    else {
      // TODO: check function prototype
      // TODO: calculate McCabe score
      var score = getFunctionsAndMcCabe(result.AST);
      showMcCabe(score, currentExercise);

      // TODO: check function correctness
      // TODO: save source code to git repos
      $('#submit-exercise').attr('data-color', 'green');
      var lbl = $('#submit-exercise').find('.ladda-label');
      lbl.text('Success!');
      spin.disable();
    }
  };

  onSubmitExerciseError = function(xhr, textStatus, errorThrow) {
    spin.stop();
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
