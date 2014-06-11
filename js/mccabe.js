
function getFunctionName(fDecl) 
{
  // console.log("Found function: "+fDecl.name);
  return fDecl.name;
}

function getMcCabeScore(decl) 
{
  if ( decl == null ) return 0;
  if ( decl.Kind == 'FunctionDecl' ) {
    return getMcCabeScore(decl.body);
  }
  if ( decl.Kind == 'CompoundStmt' ) {
    var score = 0;
    for ( var index in decl.body ) {
      var thisDecl = decl.body[index];
      score += getMcCabeScore(thisDecl);
    }
    return score;
  }
  if ( decl.op == '&&' ) {
    return 1;
  }
  if ( decl.op == '||' ) {
    return 1;
  }
  if ( decl.Kind == 'IfStmt' ) {
    var score = 0;
    if ( decl.else != null ) {
      score += 1 + getMcCabeScore(decl.else);
    }
    score += 1 + getMcCabeScore(decl.then) + getMcCabeScore(decl.condition);
    return score;
  }
  if ( decl.Kind == 'SwitchStmt' || decl.Kind == 'BreakStmt' ) {
    return getMcCabeScore(decl.body);
  }
  if ( decl.Kind == 'CaseStmt' ) {
    // complexity is 1 + the complexity of the body (subStmt) of the CaseStmt:
    return 1 + getMcCabeScore(decl.subStmt);
  }
  if ( decl.Kind == 'DoStmt' ) {
    return 1 + getMcCabeScore(decl.body);
  }
  if ( decl.Kind == 'ForStmt' ) {
    return 1 + getMcCabeScore(decl.body);
  }
  if ( decl.Kind == 'WhileStmt' ) {
    return 1 + getMcCabeScore(decl.body);
  }
  return 0;
}

function getFunctionsAndMcCabe(ast) 
{
  var totalScore = 0;
  for ( var index in ast.decls ) {
    var decl = ast.decls[index];
    // console.log(decl);
    if ( decl.Kind == 'FunctionDecl' ) {
      var name = getFunctionName(decl);
      var score = getMcCabeScore(decl);
      totalScore += score;
      //console.log(name, score+1);
    }
  }
  return totalScore+1;
}

function showMcCabe(number, exercise)
{
  var msg = null;
  console.log("Your McCabe number is: "+number);
  if ( number < exercise.mccabe ) {
    msg = "Oops -- your solution is impossible!";
  }
  else if ( number == exercise.mccabe ) {
    msg = "Excellent job -- your solution is the highest quality.";
  }
  else if ( number == exercise.mccabe+1 ) {
    msg = "Good, but you can write a better solution.";
  }
  else {
    msg = "You can do much better.";
  }

  $('#error-message').html(msg);
  $('#error-box').fadeTo('fast', 1);
}

