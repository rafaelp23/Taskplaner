# 🏠 Dashboard IoT - Monitoramento Ambiental Residencial

## 📋 Descrição do Projeto

Este é um sistema de monitoramento IoT focado em **Monitoramento Ambiental Residencial**, desenvolvido como projeto acadêmico para demonstrar conhecimentos em desenvolvimento web com APIs REST.

## 🎯 Objetivos de Aprendizagem

- ✅ Implementar API RESTful em PHP
- ✅ Criar interface web responsiva
- ✅ Trabalhar com comunicação cliente-servidor
- ✅ Validar dados no backend e frontend
- ✅ Persistir dados em JSON
- ✅ Desenvolver dashboard em tempo real

## 📊 Sensores Monitorados

- **Temperatura**: -40 a 80 °C
- **Umidade**: 0 a 100 %
- **CO2**: 0 a 5000 PPM
- **Luminosidade**: 0 a 65535 lux

## 🚀 Como Executar

### Pré-requisitos
- XAMPP (ou WAMP/LAMP)
- Navegador web moderno
- Editor de código (VS Code recomendado)

### Passo a Passo

1. **Copie o projeto para o htdocs do XAMPP**
   ```
   C:\xampp\htdocs\meu-projeto\
   ```

2. **Inicie o Apache no XAMPP**

3. **Acesse no navegador**
   ```
   http://localhost/meu-projeto/
   ```

4. **Teste o sistema**
   - Preencha o formulário
   - Clique em "Enviar Leitura"
   - Veja os dados no monitor em tempo real
   - Confira o histórico

## 📁 Estrutura de Arquivos

```
meu-projeto/
├── index.html              ← Interface principal
├── css/
│   └── style.css          ← Estilos (PERSONALIZE AQUI!)
├── js/
│   └── dashboard.js       ← Lógica JavaScript
├── api/
│   ├── status.php         ← Verifica se API está online
│   ├── sensor-data.php    ← Recebe dados dos sensores
│   └── dashboard.php      ← Retorna histórico
└── data/
    └── sensor-readings.json  ← Dados armazenados
```

## 🎨 Personalização

### Cores (no arquivo `css/style.css`)

Procure pela cor principal e altere:
```css
/* Linha ~30 aproximadamente */
color: #2E7D32;  /* ← Mude para sua cor favorita! */
```

### Ícones (no arquivo `index.html`)

Troque os emojis por outros:
```html
<div class="icon">🌡️</div>  <!-- ← Mude o emoji aqui -->
```

### Título (no arquivo `index.html`)

```html
<h1>🏠 Seu Título Personalizado</h1>
```

## 🧪 Como Testar a API

### Teste 1: Verificar Status
```
http://localhost/meu-projeto/api/status.php
```

### Teste 2: Ver Histórico
```
http://localhost/meu-projeto/api/dashboard.php
```

### Teste 3: Limpar Dados
```
http://localhost/meu-projeto/api/sensor-data.php?action=clear_all
```

## 📝 O Que Você Deve Entregar

1. ✅ Código funcionando 100%
2. ✅ Este README.md preenchido
3. ✅ Comentários explicativos no código
4. ✅ Print screens do sistema funcionando
5. ✅ Apresentação de 15 minutos

## 👥 Equipe

- **Membro 1**: [Nome] - [RGM] - [Função]
- **Membro 2**: [Nome] - [RGM] - [Função]
- **Membro 3**: [Nome] - [RGM] - [Função]
- **Membro 4**: [Nome] - [RGM] - [Função]
- **Membro 5**: [Nome] - [RGM] - [Função]

## 📚 Conceitos Aplicados

### Frontend
- HTML5 semântico
- CSS3 com Flexbox e Grid
- JavaScript Vanilla (Fetch API)
- DOM Manipulation

### Backend
- PHP 7.4+
- API REST
- Validação de dados
- Persistência em JSON
- HTTP Status Codes

### Arquitetura
- Separação em camadas
- Cliente-Servidor
- Comunicação assíncrona

## 🐛 Problemas Comuns

**Problema**: "API: Offline"
- **Solução**: Verifique se o Apache está rodando no XAMPP

**Problema**: Dados não aparecem
- **Solução**: Verifique se a pasta `data/` tem permissão de escrita

**Problema**: Erro 404
- **Solução**: Confira o caminho do projeto no htdocs

## 📞 Suporte

Dúvidas? Fale com o professor ou consulte a documentação no Moodle.

---

**Desenvolvido por**: [Nome do Grupo]  
**Data**: [Data]  
**Disciplina**: Desenvolvimento Web com IoT
