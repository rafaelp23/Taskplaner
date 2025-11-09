/* ========================================
   DASHBOARD JAVASCRIPT - MONITORAMENTO AMBIENTAL RESIDENCIAL
   Lógica de Interação (CORRIGIDO + ANIMAÇÕES)
   ======================================== */

// ===== THRESHOLDS PARA MONITORAMENTO AMBIENTAL =====
const THRESHOLDS = {
    temperatura: {
        normal: { min: 18, max: 26 },     
        moderate_low: { min: 15, max: 17 },
        moderate_high: { min: 27, max: 30 },    
        dangerous_low: { min: -40, max: 14 }, // Cobre tudo abaixo de 'moderate_low'
        dangerous_high: { min: 31, max: 80 }  // Cobre tudo acima de 'moderate_high'
    },
    umidade: {
        normal: { min: 30, max: 60 },
        moderate_low: { min: 20, max: 29 },
        moderate_high: { min: 61, max: 80 },
        dangerous_low: { min: 0, max: 19 },
        dangerous_high: { min: 81, max: 100 }
    },
    co2: {
        // Valores de CO2 são apenas para cima
        normal: { min: 0, max: 800 }, // Guia pedia 400-800, mas 0-800 é mais seguro
        moderate: { min: 801, max: 1500 },
        dangerous: { min: 1501, max: 5000 } // Acima de 1500
    },
    luminosidade: {
        normal: { min: 300, max: 1000 }, 
        moderate_low: { min: 100, max: 299 },   
        moderate_high: {min: 1001, max: 2000},
        dangerous_low: { min: 0, max: 99 },     
        dangerous_high: { min: 2001, max: 65535 }
    }
};

// ===== NOVA FUNÇÃO AUXILIAR (Segue a lógica "avaliarStatus" do guia) =====
/**
 * Determina o status (texto, classe E NÍVEL) com base no valor e tipo do sensor.
 * @param {string} type - O tipo de sensor (ex: 'temperatura', 'umidade')
 * @param {number} value - O valor lido do sensor
 * @returns {{text: string, class: string, level: string}} - Objeto com o texto, a classe e o nível
 */
function getSensorStatus(type, value) {
    const limits = THRESHOLDS[type];
    value = parseFloat(value); // Garante que o valor é um número

    if (!limits) {
        return { text: 'Normal', class: 'status-normal', level: 'normal' };
    }

    // 1. Checar Normal
    if (value >= limits.normal.min && value <= limits.normal.max) {
        return { text: 'Normal', class: 'status-normal', level: 'normal' };
    }

    // 2. Checar Alerta (Moderate)
    if ((limits.moderate_low && (value >= limits.moderate_low.min && value <= limits.moderate_low.max)) ||
        ((limits.moderate_high || limits.moderate) && (value >= (limits.moderate_high || limits.moderate).min && value <= (limits.moderate_high || limits.moderate).max))) {
        return { text: 'Alerta', class: 'status-moderate', level: 'moderate' };
    }

    // 3. Checar Crítico (Dangerous)
    if ((limits.dangerous_low && (value >= limits.dangerous_low.min && value <= limits.dangerous_low.max)) ||
        ((limits.dangerous_high || limits.dangerous) && (value >= (limits.dangerous_high || limits.dangerous).min && value <= (limits.dangerous_high || limits.dangerous).max))) {
        return { text: 'Crítico', class: 'status-dangerous', level: 'dangerous' };
    }
    
    // Fallback caso o valor esteja fora de todas as faixas
    // Se não for normal, assume Alerta por padrão.
    return { text: 'Alerta', class: 'status-moderate', level: 'moderate' };
}

// ===== APLICAR ANIMAÇÕES DE ALERTA (VERSÃO CORRIGIDA) =====
// (Esta versão usa as classes 'alert-normal', 'alert-moderate', etc. que o seu CSS espera)
function aplicarAnimacaoAlerta(cardId, level) {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
        console.warn('Elemento do card não encontrado:', cardId);
        return;
    }
    
    // Remover classes de estado anteriores
    cardElement.classList.remove('alert-normal', 'alert-moderate', 'alert-dangerous');
    
    // Adicionar a nova classe de estado com base no nível
    if (level === 'normal') {
        cardElement.classList.add('alert-normal');
    } else if (level === 'moderate') {
        cardElement.classList.add('alert-moderate');
    } else if (level === 'dangerous') {
        cardElement.classList.add('alert-dangerous');
    }
}


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
        
        // Coletar dados do form para atualizar o monitor imediatamente
        const dataToUpdate = {
            temperatura: formData.get('temperatura'),
            umidade: formData.get('umidade'),
            co2: formData.get('co2'),
            luminosidade: formData.get('luminosidade')
        };
        
        const response = await fetch('api/sensor-data.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✓ Dados enviados com sucesso!');
            atualizarMonitor(dataToUpdate); // Atualiza o monitor com os dados do form
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

// ===== ATUALIZAR MONITOR (Versão Corrigida + Animações) =====
function atualizarMonitor(data) {
    let status; // Variável para guardar o status
    let statusElement; // Variável para o elemento HTML

    // Atualizar Temperatura
    if (data.temperatura !== undefined) {
        document.getElementById('temperatura-valor').textContent = 
            data.temperatura + ' °C';
        
        status = getSensorStatus('temperatura', data.temperatura);
        statusElement = document.getElementById('temperatura-status');
        statusElement.textContent = status.text;
        statusElement.className = 'status ' + status.class;

        // ** APLICA ANIMAÇÃO **
        // (Assumindo que o ID do seu card de temperatura é 'temperatura-card')
        aplicarAnimacaoAlerta('temperatura-card', status.level);
    }

    // Atualizar Umidade
    if (data.umidade !== undefined) {
        document.getElementById('umidade-valor').textContent = 
            data.umidade + ' %';
        
        status = getSensorStatus('umidade', data.umidade);
        statusElement = document.getElementById('umidade-status');
        statusElement.textContent = status.text;
        statusElement.className = 'status ' + status.class;

        // ** APLICA ANIMAÇÃO **
        // (Assumindo que o ID do seu card de umidade é 'umidade-card')
        aplicarAnimacaoAlerta('umidade-card', status.level);
    }

    // Atualizar CO2
    if (data.co2 !== undefined) {
        document.getElementById('co2-valor').textContent = 
            data.co2 + ' PPM';
        
        status = getSensorStatus('co2', data.co2);
        statusElement = document.getElementById('co2-status');
        statusElement.textContent = status.text;
        statusElement.className = 'status ' + status.class;

        // ** APLICA ANIMAÇÃO **
        // (Assumindo que o ID do seu card de CO2 é 'co2-card')
        aplicarAnimacaoAlerta('co2-card', status.level);
    }

    // Atualizar Luminosidade
    if (data.luminosidade !== undefined) {
        document.getElementById('luminosidade-valor').textContent = 
            data.luminosidade + ' lux';
        
        status = getSensorStatus('luminosidade', data.luminosidade);
        statusElement = document.getElementById('luminosidade-status');
        statusElement.textContent = status.text;
        statusElement.className = 'status ' + status.class;
        
        // ** APLICA ANIMAÇÃO **
        // (Assumindo que o ID do seu card de luminosidade é 'luminosidade-card')
        aplicarAnimacaoAlerta('luminosidade-card', status.level);
    }
}

// ===== CARREGAR HISTÓRICO =====
async function carregarHistorico() {
    try {
        const response = await fetch('api/dashboard.php');
        const data = await response.json();
        
        if (data.success && data.history.length > 0) {
            renderizarHistorico(data.history);
            // Atualiza o monitor com o dado mais recente do histórico
            atualizarMonitor(data.history[0]);
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
            // Limpa o monitor visualmente
            const clearData = { temperatura: 0, umidade: 0, co2: 0, luminosidade: 0 };
            atualizarMonitor(clearData);
        } else {
            alert('✗ Erro ao limpar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('✗ Erro ao limpar dados');
    }
}