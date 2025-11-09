/* ========================================
   DASHBOARD JAVASCRIPT - MONITORAMENTO AMBIENTAL RESIDENCIAL
   Lógica de Interação
   ======================================== */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Monitoramento Ambiental Residencial iniciado!');
    verificarStatusAPI();
    carregarHistorico();
    
    // Verificar status da API a cada 30 segundos
    setInterval(verificarStatusAPI, 30000);
});

// ===== VERIFICAR STATUS DA API =====
async function verificarStatusAPI() {
    try {
        const response = await fetch('api/status.php');
        const data = await response.json();
        
        const statusElement = document.getElementById('status-api');
        if (data.status === 'online') {
            statusElement.textContent = 'API: Online ✓';
            statusElement.className = 'status online';
        } else {
            statusElement.textContent = 'API: Offline ✗';
            statusElement.className = 'status offline';
        }
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        document.getElementById('status-api').textContent = 'API: Erro';
        document.getElementById('status-api').className = 'status offline';
    }
}

// ===== ENVIAR DADOS DO FORMULÁRIO =====
document.getElementById('sensor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(this);
        
        const response = await fetch('api/sensor-data.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✓ Dados enviados com sucesso!');
            atualizarMonitor(data.data);
            carregarHistorico();
        } else {
            alert('✗ Erro: ' + data.error);
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('✗ Erro ao enviar dados. Verifique o console.');
    }
});

// ===== GERAR DADOS ALEATÓRIOS =====
function gerarDadosAleatorios() {
    document.querySelector('[name="temperatura"]').value = (Math.random() * (80 - -40) + -40).toFixed(1);
    document.querySelector('[name="umidade"]').value = (Math.random() * (100 - 0) + 0).toFixed(1);
    document.querySelector('[name="co2"]').value = (Math.random() * (5000 - 0) + 0).toFixed(0);
    document.querySelector('[name="luminosidade"]').value = (Math.random() * (65535 - 0) + 0).toFixed(0);
    alert('🎲 Dados aleatórios gerados!');
}

// ===== ATUALIZAR MONITOR =====
function atualizarMonitor(data) {

    // Atualizar Temperatura
    if (data.temperatura !== undefined) {
        document.getElementById('temperatura-valor').textContent = 
            data.temperatura + ' °C';
        
        // Aqui você pode adicionar lógica de status (normal, alerta, crítico)
        let statusElement = document.getElementById('temperatura-status');
        statusElement.textContent = 'Normal';
        statusElement.className = 'status status-normal';
    }

    // Atualizar Umidade
    if (data.umidade !== undefined) {
        document.getElementById('umidade-valor').textContent = 
            data.umidade + ' %';
        
        // Aqui você pode adicionar lógica de status (normal, alerta, crítico)
        let statusElement = document.getElementById('umidade-status');
        statusElement.textContent = 'Normal';
        statusElement.className = 'status status-normal';
    }

    // Atualizar CO2
    if (data.co2 !== undefined) {
        document.getElementById('co2-valor').textContent = 
            data.co2 + ' PPM';
        
        // Aqui você pode adicionar lógica de status (normal, alerta, crítico)
        let statusElement = document.getElementById('co2-status');
        statusElement.textContent = 'Normal';
        statusElement.className = 'status status-normal';
    }

    // Atualizar Luminosidade
    if (data.luminosidade !== undefined) {
        document.getElementById('luminosidade-valor').textContent = 
            data.luminosidade + ' lux';
        
        // Aqui você pode adicionar lógica de status (normal, alerta, crítico)
        let statusElement = document.getElementById('luminosidade-status');
        statusElement.textContent = 'Normal';
        statusElement.className = 'status status-normal';
    }
}

// ===== CARREGAR HISTÓRICO =====
async function carregarHistorico() {
    try {
        const response = await fetch('api/dashboard.php');
        const data = await response.json();
        
        if (data.success && data.history.length > 0) {
            renderizarHistorico(data.history);
        } else {
            document.getElementById('historico-list').innerHTML = 
                '<p style="text-align: center; color: #666;">Nenhuma leitura encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('historico-list').innerHTML = 
            '<p style="text-align: center; color: red;">Erro ao carregar histórico.</p>';
    }
}

// ===== RENDERIZAR HISTÓRICO =====
function renderizarHistorico(history) {
    const container = document.getElementById('historico-list');
    
    const html = history.slice(0, 10).map(item => `
        <div class="historico-item">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong>🔹 ${item.sensor_id}</strong>
                <span style="color: #666;">📅 ${item.timestamp}</span>
            </div>
            <div style="font-size: 14px;">
                    <strong>Temperatura:</strong> ${item.temperatura} °C<br>
                    <strong>Umidade:</strong> ${item.umidade} %<br>
                    <strong>CO2:</strong> ${item.co2} PPM<br>
                    <strong>Luminosidade:</strong> ${item.luminosidade} lux<br>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// ===== LIMPAR DADOS =====
async function limparDados() {
    if (!confirm('⚠️ Tem certeza que deseja limpar todos os dados?')) {
        return;
    }
    
    try {
        const response = await fetch('api/sensor-data.php?action=clear_all');
        const data = await response.json();
        
        if (data.success) {
            alert('✓ Dados limpos com sucesso!');
            carregarHistorico();
        } else {
            alert('✗ Erro ao limpar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('✗ Erro ao limpar dados');
    }
}
