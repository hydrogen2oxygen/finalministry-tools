<?php
header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Authorization, Origin');
header('Access-Control-Allow-Methods:  POST, PUT, GET');
header('Content-Type: application/json; charset=utf-8');

$requestMethod = $_SERVER['REQUEST_METHOD'];

if (!isset($_GET['id'])) {
    echo '{"error":"ID NOT SET!"}';
    exit;
}

if ($requestMethod === 'POST' || $requestMethod === 'PUT') {
    createOrUpdate();
} else if ($requestMethod === 'GET') {
    read();
} else if ($requestMethod === 'DELETE') {
    delete();
}

function delete() {
    $filePath = "maps/mapDesign_" . $_GET['id'] . ".json";

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo '{"error":"file '.$filePath.' does not exist"}';
        exit;
    }

    $outputJSON = file_get_contents($filePath);

    if (json_validator($outputJSON)) {
        if (!unlink($filePath)) {
            echo ('{"error":"file '.$filePath.' cannot be deleted due to an error!"}');
        }
        else {
            echo ('{"info":"file '.$filePath.' has been deleted!"}');
        }
    } else {
        http_response_code(500);
        echo '{"error":"not valid json!"}';
    }

}

function createOrUpdate()
{
    $inputJSON = file_get_contents('php://input');

    if (json_validator($inputJSON)) {
        $filePath = "maps/mapDesign_" . $_GET['id'] . ".json";
        $file = fopen($filePath, 'w');
        fwrite($file, $inputJSON);
        fclose($file);
        echo '{"info":"file '.$filePath.' created!"}';
    } else {
        http_response_code(500);
        echo '{"error":"not valid json!"}';
    }
}

function read()
{
    $filePath = "maps/mapDesign_" . $_GET['id'] . ".json";

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo '{"error":"file '.$filePath.' does not exist"}';
        exit;
    }

    $outputJSON = file_get_contents($filePath);

    if (json_validator($outputJSON)) {
        echo $outputJSON;
    } else {
        http_response_code(500);
        echo '{"error":"not valid json!"}';
    }
}

function json_validator($data = NULL)
{
    if (!empty($data)) {
        @json_decode($data);
        return (json_last_error() === JSON_ERROR_NONE);
    }
    return false;
}

?>
