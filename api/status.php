<?php
/**
 * ============================================================================
 * ARQUIVO: api/status.php
 * FUNÇÃO: Verificar se a API está online
 * MÉTODO: GET
 * ============================================================================
 */

header('Content-Type: application/json; charset=UTF-8');

// Retorna status online
echo json_encode([
    "status" => "online",
    "message" => "API funcionando corretamente",
    "timestamp" => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>