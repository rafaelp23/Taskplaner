<?php
/**
 * ============================================================================
 * ARQUIVO: api/dashboard.php
 * FUNÇÃO: Retornar histórico de leituras
 * MÉTODO: GET
 * ============================================================================
 */

header('Content-Type: application/json; charset=UTF-8');
date_default_timezone_set('America/Sao_Paulo');

// Caminho do arquivo JSON
$file = __DIR__ . "/../data/sensor-readings.json";

// Verificar se o arquivo existe
if (!file_exists($file)) {
    echo json_encode([
        "success" => true,
        "count" => 0,
        "history" => []
    ], JSON_PRETTY_PRINT);
    exit;
}

// Ler dados do arquivo
$jsonData = file_get_contents($file);
$readings = json_decode($jsonData, true);

// Verificar se decodificou corretamente
if ($readings === null) {
    $readings = [];
}

// Limitar às últimas 50 leituras
$readings = array_slice($readings, -50);

// Retornar histórico
echo json_encode([
    "success" => true,
    "count" => count($readings),
    "history" => array_reverse($readings)
], JSON_PRETTY_PRINT);
?>