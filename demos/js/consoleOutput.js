(function initConsoleLogDiv() {
  'use strict';


  if (console.log.toDiv) {
    return;
  }

  function toString(x) {
    return typeof x === 'string' ? x : JSON.stringify(x);
  }
  var d = window.top.document;
  var log = console.log.bind(console);
  var error = console.error.bind(console);
  var warn = console.warn.bind(console);
  var table = console.table ? console.table.bind(console) : null;
  var consoleId = 'console-log-div';
  var divStyles = `#console-log-div {
    min-height: 55px;
    width: calc(100% - 20px);
    max-width: 400px;
    position:fixed;
    margin: 10px;
    padding: 5px 0 0 0;
    
    font-family: "Input Mono", monospace;
    font-weight: 400;
    font-size: 0.8em;
    line-height: 1.4em;
    
    color: rgba(0,0,0,.61);
    border-radius: 2px;
    
    box-shadow: inset 0 0 2px rgba(0,0,0,.1);
    background-color: $base-color;
    
    #legend, .log-row, td {
      padding: 10px 0 8px 0;
      text-indent: 10px;
    }
    #legend {
      padding-bottom: 12px;
      font-size: 1.2em;
    }
    .log-row {
      &:nth-child(odd) {
        background: rgba(0,0,0,.1);
      }
    }
    thead {
      background: rgba(0,0,0,.2);
    }
  }`;
//Append Syles to head
  // (() => {
  //   var htmlStyle = d.createElement("style");
  //   htmlStyle.innerHTML = divStyles;
  //   d.head.appendChild(htmlStyle)
  // })() 
// Create the Console Div container.
  function createOuterElement(id) {
    var outer = d.getElementById(id);
    if (!outer) {
      outer = d.createElement('fieldset');
      outer.id = id;
      d.getElementById("consoleDiv").appendChild(outer);
    }
    var style = outer.style;
    return outer;
  }
// Create the logging div and adornments.
  var logTo = (function createLogDiv() {

    var outer = createOuterElement(consoleId);
    //var caption = d.createTextNode('Console Output');
    //var legend = d.createElement('div');
    //legend.id = "legend";
    //legend.appendChild(caption);
    //outer.appendChild(legend);

    var div = d.createElement('div');
    div.id = 'console-log-text';
    
    outer.appendChild(div);
    return div;
  }());

  function printToDiv() {
    var msg = Array.prototype.slice.call(arguments, 0)
      .map(toString)
      .join(' ');
    var item = d.createElement('div');
    item.classList.add('log-row');
    item.textContent = msg;
    logTo.appendChild(item);
  }

  function logWithCopy() {
    var ele = d.getElementById('console-log-div');
    // setDarkLight(ele);
    log.apply(null, arguments);
    printToDiv.apply(null, arguments);
  }

  console.log = logWithCopy;
  console.log.toDiv = true;

  console.error = function errorWithCopy() {
    error.apply(null, arguments);
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('ERROR:');
    printToDiv.apply(null, args);
  };

  console.warn = function logWarning() {
    warn.apply(null, arguments);
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('WARNING:');
    printToDiv.apply(null, args);
  };

  function printTable(objArr, keys) {

    var numCols = keys.length;
    var len = objArr.length;
    var $table = d.createElement('table');
    $table.style.width = '100%';
    $table.setAttribute('border', '1');
    var $head = d.createElement('thead');
    var $tdata = d.createElement('td');
    $tdata.innerHTML = 'Index';
    $head.appendChild($tdata);

    for (var k = 0; k < numCols; k++) {
      $tdata = d.createElement('td');
      $tdata.innerHTML = keys[k];
      $head.appendChild($tdata);
    }
    $table.appendChild($head);

    for (var i = 0; i < len; i++) {
      var $line = d.createElement('tr');
      $tdata = d.createElement('td');
      $tdata.innerHTML = i;
      $line.appendChild($tdata);

      for (var j = 0; j < numCols; j++) {
        $tdata = d.createElement('td');
        $tdata.innerHTML = objArr[i][keys[j]];
        $line.appendChild($tdata);
      }
      $table.appendChild($line);
    }
    var div = d.getElementById('console-log-text');
    div.appendChild($table);
    
  }

  console.table = function logTable() {
    if (typeof table === 'function') {
      table.apply(null, arguments);
    }

    var objArr = arguments[0];
    var keys;

    if (typeof objArr[0] !== 'undefined') {
      keys = Object.keys(objArr[0]);
    }
    printTable(objArr, keys);
  };

  window.addEventListener('error', function (err) {
    printToDiv( 'EXCEPTION:', err.message + '\n  ' + err.filename, err.lineno + ':' + err.colno);
  });
  
  //   Detect dark or light colors.

  // function setDarkLight(element) {
  //   var color = window.getComputedStyle(element, null).backgroundColor;
  //   if(isDark(color)) {
  //     element.style.color = "rgba(255,255,255,1)";
  //   } else {
  //     element.style.color = "rgba(0,0,0,.61)";
  //   }
  // }
  
  // function isDark( color ) {
  //   var match = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(color);
  //   return parseFloat(match[1])
  //        + parseFloat(match[2])
  //        + parseFloat(match[3])
  //          < 3 * 256 / 2; // r+g+b should be less than half of max (3 * 256)
  // }
}());