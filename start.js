require('shelljs/global');
$ = require('jquery');
var path = require('path');
var appDir = path.dirname(require.main.filename);

console.log(appDir);

var output_window = document.getElementById('output_window');
var output_window2 = document.getElementById('output_window2');
var status_indicator = document.getElementById('application_status');
var process = null;

// exec('source ~/.bash_profile && pwd && whoami && echo $$ && echo $0 && echo $PATH', { async: true }).stdout.on('data', function(data) {
//   console.log('PLATFORM INFORMATIONS:\n' + data);
// })

function send_output_to(proc, out) {
  proc.stderr.on('data', function(data) {
    console.log('Getting errors!')
    out.innerHTML += '<div class="red">' + data + '</div>';
  });
  proc.stdout.on('data', function(data) {
    console.log('Getting data!')
    out.innerHTML += '<div>' + data + '</div>';
  });
}

function runApplication() {
  if (process == null) {
    var button = $(this);
    button.attr("disabled", 'disabled');
    var process = exec('cd ' + appDir + '/../../../.. && bash -l script/start', { async: true });
    status_indicator.innerText = 'Running!';
    console.log(process);
    send_output_to(process, output_window);
    process.on('close', function() {
      output_window.innerHTML += '<div class="green">***APPLICATION CLOSED ***</div><br><br>';
      process = null;
      status_indicator.innerText = 'Not running.';
      button.removeAttr('disabled');
    })
  } else {
    alert('The application is already running...')
  }
}

function stopApplication() {
  var button = $(this);
  button.attr("disabled", 'disabled');
  var kill_process = exec('cd ' + appDir + '/../../../.. && bash -l script/kill_all', { async: true });
  send_output_to(kill_process, output_window2);
  kill_process.on('close', function(data) {
    output_window2.innerHTML += '<div class="green">***APPLICATION CLOSED ***</div><br><br>';
    process = null;
    status_indicator.innerText = 'Not running.';
    button.removeAttr('disabled');
  });
}

$('#run_app').on('click', runApplication);
$('#stop_app').on('click', stopApplication);
