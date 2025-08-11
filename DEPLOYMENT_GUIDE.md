# 🚀 Guia de Deploy - Portfólio Evolua Web Design

## 📋 Pré-requisitos

### Servidor Web
- **Apache 2.4+** ou **Nginx 1.18+**
- **PHP 7.4+** (opcional, para formulário)
- **SSL Certificate** (recomendado)
- **Domínio próprio** configurado

### Recursos Mínimos
- **CPU**: 1 vCore
- **RAM**: 512MB
- **Storage**: 1GB SSD
- **Bandwidth**: 10GB/mês

## 🔧 Opções de Deploy

### 1. Deploy Simples (Hospedagem Compartilhada)

#### Passo a Passo
1. **Compactar arquivos**:
   ```bash
   zip -r evolua-portfolio.zip evolua-portfolio-html/
   ```

2. **Upload via FTP/cPanel**:
   - Acesse o painel da hospedagem
   - Navegue até `public_html/`
   - Faça upload do arquivo ZIP
   - Extraia os arquivos

3. **Configurar domínio**:
   - Aponte o domínio para a pasta do projeto
   - Configure SSL se disponível

#### Hospedagens Recomendadas
- **Hostinger** (Brasil)
- **UOL Host** (Brasil)
- **Netlify** (Gratuito)
- **Vercel** (Gratuito)

### 2. Deploy Avançado (VPS/Cloud)

#### Nginx Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seudominio.com.br www.seudominio.com.br;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seudominio.com.br www.seudominio.com.br;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Document root
    root /var/www/evolua-portfolio;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### Apache Configuration (.htaccess)
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 3. Deploy com CDN

#### Cloudflare Setup
1. **Criar conta** no Cloudflare
2. **Adicionar domínio** ao Cloudflare
3. **Configurar DNS** apontando para o servidor
4. **Ativar proxy** (nuvem laranja)
5. **Configurar SSL** (Full/Strict)

#### Configurações Recomendadas
- **Minification**: HTML, CSS, JS ativado
- **Brotli Compression**: Ativado
- **Rocket Loader**: Ativado
- **Auto Minify**: Ativado
- **Browser Cache TTL**: 1 ano

## 📧 Configuração do Formulário

### PHP Backend (formulario.php)
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Validação
$nome = filter_var($input['nome'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$telefone = filter_var($input['telefone'] ?? '', FILTER_SANITIZE_STRING);
$empresa = filter_var($input['empresa'] ?? '', FILTER_SANITIZE_STRING);
$servico = filter_var($input['servico'] ?? '', FILTER_SANITIZE_STRING);
$mensagem = filter_var($input['mensagem'] ?? '', FILTER_SANITIZE_STRING);

if (!$nome || !$email || !$telefone || !$mensagem) {
    http_response_code(400);
    echo json_encode(['error' => 'Campos obrigatórios não preenchidos']);
    exit;
}

// Configurações de email
$to = 'contato@evoluawebdesign.com.br';
$subject = 'Novo contato do site - ' . $nome;
$headers = [
    'From: noreply@evoluawebdesign.com.br',
    'Reply-To: ' . $email,
    'Content-Type: text/html; charset=UTF-8'
];

$body = "
<html>
<head>
    <title>Novo contato do site</title>
</head>
<body>
    <h2>Novo contato recebido</h2>
    <p><strong>Nome:</strong> {$nome}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Telefone:</strong> {$telefone}</p>
    <p><strong>Empresa:</strong> {$empresa}</p>
    <p><strong>Serviço:</strong> {$servico}</p>
    <p><strong>Mensagem:</strong></p>
    <p>{$mensagem}</p>
</body>
</html>
";

if (mail($to, $subject, $body, implode("\r\n", $headers))) {
    echo json_encode(['success' => 'Mensagem enviada com sucesso']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao enviar mensagem']);
}
?>
```

### Integração com EmailJS (Alternativa)
```javascript
// Adicionar ao main.js
emailjs.init("YOUR_PUBLIC_KEY");

function sendEmail(formData) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: formData.nome,
        from_email: formData.email,
        phone: formData.telefone,
        company: formData.empresa,
        service: formData.servico,
        message: formData.mensagem
    }).then(
        function(response) {
            console.log('Email enviado!', response);
        },
        function(error) {
            console.log('Erro ao enviar email:', error);
        }
    );
}
```

## 🔍 SEO e Analytics

### Meta Tags Essenciais
```html
<!-- Já incluídas no index.html -->
<meta name="description" content="Evolua Web Design - Criação de sites profissionais, e-commerce e soluções digitais que geram resultados reais para seu negócio.">
<meta name="keywords" content="criação de sites, desenvolvimento web, e-commerce, landing pages, SEO, marketing digital">
<meta name="author" content="Evolua Web Design">

<!-- Open Graph -->
<meta property="og:title" content="Evolua Web Design - Seu Futuro Online Começa Aqui">
<meta property="og:description" content="Transformamos sua visão em uma presença digital poderosa que gera resultados reais para o seu negócio.">
<meta property="og:image" content="https://seudominio.com.br/assets/images/og-image.jpg">
<meta property="og:url" content="https://seudominio.com.br">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Evolua Web Design - Seu Futuro Online Começa Aqui">
<meta name="twitter:description" content="Transformamos sua visão em uma presença digital poderosa que gera resultados reais para o seu negócio.">
<meta name="twitter:image" content="https://seudominio.com.br/assets/images/twitter-card.jpg">
```

### Google Analytics 4
```html
<!-- Adicionar antes do </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Search Console
1. **Verificar propriedade** do site
2. **Enviar sitemap** (criar sitemap.xml)
3. **Monitorar indexação**
4. **Corrigir erros** de rastreamento

## 🛡️ Segurança

### Checklist de Segurança
- ✅ **SSL Certificate** instalado
- ✅ **Security headers** configurados
- ✅ **HTTPS redirect** ativo
- ✅ **File permissions** corretas (644 para arquivos, 755 para pastas)
- ✅ **Backup automático** configurado
- ✅ **Firewall** ativo
- ✅ **Updates** regulares do servidor

### Monitoramento
- **Uptime monitoring** (UptimeRobot)
- **Performance monitoring** (GTmetrix)
- **Security scanning** (Sucuri)
- **Error logging** ativo

## 📊 Performance

### Otimizações Implementadas
- ✅ **Minificação** CSS/JS
- ✅ **Compressão Gzip**
- ✅ **Cache headers** configurados
- ✅ **Lazy loading** de imagens
- ✅ **Preload** de recursos críticos
- ✅ **WebP images** (quando possível)

### Métricas Alvo
- **PageSpeed Score**: 90+
- **GTmetrix Grade**: A
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s

## 🔄 Backup e Manutenção

### Backup Automático
```bash
#!/bin/bash
# Script de backup diário
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/evolua-portfolio"
SITE_DIR="/var/www/evolua-portfolio"

# Criar backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$SITE_DIR" .

# Manter apenas últimos 30 backups
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup criado: backup_$DATE.tar.gz"
```

### Cron Job
```bash
# Adicionar ao crontab
0 2 * * * /path/to/backup-script.sh
```

### Atualizações
- **Mensal**: Verificar atualizações de segurança
- **Trimestral**: Revisar performance e métricas
- **Semestral**: Atualizar conteúdo e cases
- **Anual**: Redesign parcial se necessário

## 📞 Suporte e Troubleshooting

### Problemas Comuns

#### WebGL não carrega
- Verificar se Three.js está carregando
- Testar em diferentes navegadores
- Verificar console para erros JavaScript

#### Formulário não funciona
- Verificar configuração PHP
- Testar envio de email manual
- Verificar logs do servidor

#### Site lento
- Verificar compressão Gzip
- Otimizar imagens
- Revisar cache headers
- Usar CDN

### Logs Importantes
- **Error log**: `/var/log/nginx/error.log`
- **Access log**: `/var/log/nginx/access.log`
- **PHP errors**: `/var/log/php/error.log`

## 🎯 Checklist Final

### Pré-Deploy
- [ ] Testar em diferentes navegadores
- [ ] Verificar responsividade
- [ ] Validar formulário
- [ ] Otimizar imagens
- [ ] Minificar CSS/JS
- [ ] Configurar meta tags

### Pós-Deploy
- [ ] Verificar SSL
- [ ] Testar velocidade
- [ ] Configurar Analytics
- [ ] Enviar sitemap
- [ ] Configurar backup
- [ ] Monitorar uptime

### Manutenção
- [ ] Backup semanal
- [ ] Monitorar performance
- [ ] Atualizar conteúdo
- [ ] Verificar segurança
- [ ] Revisar métricas
- [ ] Otimizar SEO

---

**🚀 Com este guia, o portfólio da Evolua Web Design estará pronto para impressionar clientes e gerar resultados excepcionais!**

