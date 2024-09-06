<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_data = file_get_contents('php://input');
    $json_data = json_decode($raw_data, true);
    $file = fopen('/data/status.json', 'r');
    $data = json_decode(fread($file, filesize('/data/status.json')), true);
    if (array_key_exists($json_data['system'], $data)) {
        if (array_key_exists($json_data['software'],
            $data[$json_data['system']])) {
            $data[$json_data['system']][$json_data['software']]['passed']
                = $json_data['passed'];
        }
    }
    fclose($file);

    $file = fopen('/data/status.json', 'w');
    fwrite($file, json_encode($data, JSON_PRETTY_PRINT));
    fclose($file);
} else {
    include 'render.php';
    $active = 'status';
    $content = loadFragment('html/status.html');
    include 'base.php';
}
?>
