(function() { // IIFE to protect global scope
  'use strict';
// Event Handlers, Functions, and App Scope Variables **************************


// App Scope Variables *********************
var $buttons = $('.buttons');
var $operators = $('.operator');
var $digits = $buttons.find('span:not(".operator")');
var $screen = $('#screen');


// Event Handlers **************************
var inputOperator = function(event) {

  // Store the operator
  var operator = event.target.textContent;

  // Lock out for "ERROR"
  if ($screen.text() === "ERROR" && operator !== "C") {
    return;
  }

  // Switch based on operator
  switch (operator) {

    // The clear operator
    case 'C':
      updateScreen('');
      break;

    // The equal operator
    case '=':
      if (validateCalculate()) {
        var expression = toExpression($screen.text());
        var result = calculate(expression);

        // Trap for divide by 0 error
        if (result == Infinity) {
          updateScreen('ERROR');
          return;
        }
        // console.log(result);
        // rounds result due to lack of decimals in calculator
        var displayText = toDisplayText(result);
        updateScreen(displayText);
      }
      break;

    // Math operators
    default:
      if (validateMathOperators(operator)) { addToScreen(operator); }
      break;
  }
};

var inputDigit = function(event) {
  if ($screen.text() === "ERROR") { return; }
  addToScreen(event.target.textContent);
};


// Functions ****************************

var addToScreen = function(value) {
  $screen.text(`${$screen.text()}${value}`);
};

// Always returns boolean to validate the ability to calculate
var validateCalculate = function() {
  var screenText = $screen.text();

  // If only a minus on the screen then clear the screen and don't calculate
  if (screenText === "-") {
    updateScreen('');
    return false;
  }

  return true;
};




// Recursively calculate the result of the expression obeying order of operations
var calculate = function(expression) {
  // console.log(`${expression} evals to: ${eval(expression)}`);

  // Concept: Returns a string just like incoming expression with sequentially fewer operators processed in order of operations.
  var components = expression.match(/((-?\d+\.?\d*)|(\D))/g); //|(\d+\.?\d?)
  var arr = [];

  // Loop through components and create new array with + inserted between operands
  for (var i = 0; i < components.length; i++) {
    arr.push(components[i]);
    if (!isNaN(Number.parseFloat(components[i])) && i < components.length -1 && !isNaN(Number.parseFloat(components[i+1]))) {
      arr.push('+');
    }
  }
  components = arr;

  if (components[0] === "-") {
    components = components.slice(1);
    components[0] = "-" + components[0];
  }

  console.log(components);
  // Guard clause for single operand and no operators.
  if (components.length === 1) { return components.join(''); }

  var index;
  var arr;
  var reduced;

  // Unable to parameterize 4 repetitive tasks due to difference in operators.
  switch (true) {
    case components.includes('*'):
      index = components.indexOf('*');
      arr = components.slice(0,index);
      arr[arr.length-1] = Number.parseFloat(arr[arr.length-1]) * Number.parseFloat(components[index+1])
      reduced = arr.concat(components.slice(index+2));
      break;

    case components.includes('/'):
      index = components.indexOf('/');
      arr = components.slice(0,index);
      arr[arr.length-1] = Number.parseFloat(arr[arr.length-1]) / Number.parseFloat(components[index+1])
      reduced = arr.concat(components.slice(index+2));
      break;

    case components.includes('+'):
      index = components.indexOf('+');
      arr = components.slice(0,index);
      arr[arr.length-1] = Number.parseFloat(arr[arr.length-1]) + Number.parseFloat(components[index+1])
      reduced = arr.concat(components.slice(index+2));
      break;

    case components.includes('-'):
      index = components.indexOf('-');
      arr = components.slice(0,index);
      console.log(arr);
      arr[arr.length-1] = Number.parseFloat(arr[arr.length-1]) - Number.parseFloat(components[index+1])
      reduced = arr.concat(components.slice(index+2));
      break;
  }

  console.log(reduced);
  var result = reduced.join('');

  if (reduced.length > 1) {
    // Recursive call to calculate
    return calculate(result);
  } else {
    return result;
  }
};

// var a = calculate('-56+21*-65/6+311');
// console.log(a);


// Process the displayed text into a usable expression
var toExpression = function(displayText) {
  var processed;

  // Replace all pretty math symbols with actual JavaScript math operators
  processed = displayText.replace(/x/g,"*").replace(/÷/g,"/");

  // Trim any non digits from right side
  if (isNaN(parseInt(processed[processed.length -1]))) {
    processed = processed.substring(0, processed.length -1)
  }

  return processed;
};

var toDisplayText = function(calculated) {
  var result = Math.round(calculated).toString(10);

  return result;
}

var updateScreen = function(displayText) {
  $screen.text(displayText);
}

// Always returns boolean to determine if input is valid
var validateMathOperators = function(operator) {

  var screenText = $screen.text();

  // Check for empty screen and allow only a '-' to be placed
  if (screenText === '') { return (operator === '-'); }

  // Check for only a "-" on the screen
  if (screenText === '-') { return false; }

  // Store right most character of screen
  var rightChar = screenText[screenText.length -1];
  var rightCharIsOperator = isNaN(Number.parseInt(rightChar));

  // Allow a '-' to be placed after another operator except a '-'
  if (operator === '-' && rightCharIsOperator && rightChar ==! '-') { return true; }

  // Trim the old operator (change operation)
  if (rightCharIsOperator) {
    $screen.text(screenText.substr(0, screenText.length -1));
    return true;
  }

  // rightChar is a number and it's ok to append an operator
  return true;
};








// Immediate Execution *********************************************************

// Establish event listeners
$buttons.on('click', '.operator', inputOperator);
$buttons.on('click', 'span:not(".operator")', inputDigit)







// *****************************************************************************
})(); // IIFE to protect global scope
