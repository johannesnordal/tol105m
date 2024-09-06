<?php
include 'render.php';

if(isset( $_POST['Submit'])) {
    // Convert JSON confid settings to array
    // $config = json_decode($config_json, true);
    // Can be used if user input has to be verified

    //
    // Create JSON payload to pass on to LAMEC
    //
    $payload = array();
    foreach($_POST as $key => $val) {
        if($val != "") {
            $payload[$key] = $val;
        }
    }
    $json_payload = json_encode($payload);

    // putenv('PYTHONPATH="/var/www/apps/jsc/lamec"');
    $Phrase = "./lamec.py '$json_payload'";
    // $command = escapeshellcmd($Phrase);
    $output = shell_exec($Phrase);
    $active = 'form';
    $content = loadFragment('html/output.html', ['output' => $output]);
    include 'base.php';
} else {
    $active = 'form';
    $content = loadFragment('html/form.html');
    include 'base.php';
}
?>
