<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_data = file_get_contents('php://input');
    $Phrase = "./lamec.py '$raw_data'";
    $output = shell_exec($Phrase);
    echo $output;
}
?>
