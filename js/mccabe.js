
function getFunctionName(fDecl) 
{
  console.log("Found function: "+fDecl.name);
}

function _getMcCabeScore(decl) 
{
  if(decl == null) return 0;
  if(decl.Kind == 'FunctionDecl') {
    // This happens when there is more than one function in the file
    return _getMcCabeScore(decl.body);
  }
  if(decl.Kind == 'CompoundStmt') {
    var score = 0;
    for ( var index in decl.body) {
      var thisDecl = decl.body[index];
      score += _getMcCabeScore(thisDecl);
    }
    return score;
  }
  if(decl.op == '&&') {
    return 1;
  }
  if(decl.op == '||') {
    return 1;
  }
  if(decl.Kind == 'IfStmt' || decl.Kind == 'ConditionalOperator') {
    return 1 + _getMcCabeScore(decl.then) 
             + _getMcCabeScore(decl.else)
             + _getMcCabeScore(decl.condition);
  }
  if(decl.Kind == 'SwitchStmt' || decl.Kind == 'BreakStmt') {
    return _getMcCabeScore(decl.body);
  }
  if(decl.Kind == 'CaseStmt') {
    // complexity is 1 + the complexity of the body (subStmt) 
    // of the CaseStmt:
    return 1 + _getMcCabeScore(decl.subStmt);
  }
  if(decl.Kind == 'DoStmt') {
    return 1 + _getMcCabeScore(decl.body);
  }
  if(decl.Kind == 'ForStmt') {
    return 1 + _getMcCabeScore(decl.body);
  }
  if(decl.Kind == 'WhileStmt') {
    return 1 + _getMcCabeScore(decl.body);
  }
  return 0;
}

function checkPrototype(ast, currentExercise) 
{
  var match = false;
  console.log('correct signature '+currentExercise.signature);
  for (var index in ast.decls){
    var decl = ast.decls[index];
    if(decl.Kind == 'FunctionDecl') {
      var sig = decl.returnType;
      //console.log("Function NAME: "+decl.name);
      //console.log("signature:     "+currentExercise.signature);
      sig += ' '+decl.name+'(';
      for (var index in decl.params){ 
        sig += decl.params[index].type;
        if ( index < decl.params.length-1 ) {
          sig += ', ';
        }
      }
      sig += ')';
      console.log('Found sig: '+sig);
      if ( sig == currentExercise.signature ) {
        console.log("Found a signature MATCH.");
        return true;
      }
    }
  }
  return false;
}

function getMcCabeScore(ast) 
{
  var totalScore = 0;
  for (var index in ast.decls){
    var decl = ast.decls[index];
    if(decl.Kind == 'FunctionDecl') {
      var score = _getMcCabeScore(decl);
      totalScore += score;
    }
  }
  return totalScore + 1;
}

