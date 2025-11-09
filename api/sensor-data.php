<?php
/**
 * ============================================================================
 * ARQUIVO: api/sensor-data.php
 * FUNÇÃO: Receber e armazenar dados de sensores
 * MÉTODOS: POST (enviar dados), GET (limpar dados)
 * ============================================================================
 */

header('Content-Type: application/json; charset=UTF-8');
date_default_timezone_set('America/Sao_Paulo');

// ===== AÇÃO DE LIMPEZA (GET) =====
if (isset($_GET['action']) && $_GET['action'] === 'clear_all') {
    $file = __DIR__ . "/../data/sensor-readings.json";
    
    if (file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Dados limpos com sucesso."
    ], JSON_PRETTY_PRINT);
    exit;
}

// ===== RECEBER DADOS (POST) =====

// Validar sensor_id
if (!isset($_POST['sensor_id']) || empty($_POST['sensor_id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Campo 'sensor_id' é obrigatório"
    ], JSON_PRETTY_PRINT);
    exit;
}

$sensor_id = $_POST['sensor_id'];


// Validar Temperatura
if (!isset($_POST['temperatura']) || $_POST['temperatura'] === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Campo 'Temperatura' é obrigatório"
    ], JSON_PRETTY_PRINT);
    exit;
}

$temperatura = floatval($_POST['temperatura']);
if ($temperatura < -40 || $temperatura > 80) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Temperatura deve estar entre -40 e 80"
    ], JSON_PRETTY_PRINT);
    exit;
}

// Validar Umidade
if (!isset($_POST['umidade']) || $_POST['umidade'] === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Campo 'Umidade' é obrigatório"
    ], JSON_PRETTY_PRINT);
    exit;
}

$umidade = floatval($_POST['umidade']);
if ($umidade < 0 || $umidade > 100) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Umidade deve estar entre 0 e 100"
    ], JSON_PRETTY_PRINT);
    exit;
}

// Validar CO2
if (!isset($_POST['co2']) || $_POST['co2'] === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Campo 'CO2' é obrigatório"
    ], JSON_PRETTY_PRINT);
    exit;
}

$co2 = floatval($_POST['co2']);
if ($co2 < 0 || $co2 > 5000) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "CO2 deve estar entre 0 e 5000"
    ], JSON_PRETTY_PRINT);
    exit;
}

// Validar Luminosidade
if (!isset($_POST['luminosidade']) || $_POST['luminosidade'] === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Campo 'Luminosidade' é obrigatório"
    ], JSON_PRETTY_PRINT);
    exit;
}

$luminosidade = floatval($_POST['luminosidade']);
if ($luminosidade < 0 || $luminosidade > 65535) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Luminosidade deve estar entre 0 e 65535"
    ], JSON_PRETTY_PRINT);
    exit;
}

// ===== PROCESSAR E SALVAR DADOS =====

// Criar array com os dados
$data = array(
        "sensor_id" => $sensor_id,
        "temperatura" => $temperatura,
        "umidade" => $umidade,
        "co2" => $co2,
        "luminosidade" => $luminosidade,
        "timestamp" => date("Y-m-d H:i:s")
);

// Caminho do arquivo JSON
$file = __DIR__ . "/../data/sensor-readings.json";

// Ler dados existentes
$readings = [];
if (file_exists($file)) {
    $jsonData = file_get_contents($file);
    $readings = json_decode($jsonData, true);
    if ($readings === null) {
        $readings = [];
    }
}

// Adicionar nova leitura
$readings[] = $data;

// Limitar a 500 leituras (manter arquivo pequeno)
if (count($readings) > 500) {
    $readings = array_slice($readings, -500);
}

// Salvar no arquivo
file_put_contents($file, json_encode($readings, JSON_PRETTY_PRINT));

// Retornar sucesso
http_response_code(201);
echo json_encode([
    "success" => true,
    "message" => "Dados recebidos e salvos com sucesso",
    "data" => $data
], JSON_PRETTY_PRINT);
?>