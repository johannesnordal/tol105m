<?php
function loadFragment($filename, $variables = []) {
    extract($variables);
    ob_start();
    include $filename;
    return ob_get_clean();
}
?>
