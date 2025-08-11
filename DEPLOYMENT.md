# 🚀 Guia de Deploy - Portfólio Evolua Web Design

Este documento contém instruções detalhadas para fazer o deploy do portfólio em diferentes plataformas.

## 📋 Pré-requisitos

- Arquivos do projeto completos
- Acesso a um servidor web ou plataforma de hosting
- Domínio configurado (opcional)

## 🌐 Opções de Deploy

### 1. Netlify (Recomendado)

#### Vantagens
- Deploy automático via Git
- HTTPS gratuito
- CDN global
- Formulários funcionais

#### Passos
1. Acesse [netlify.com](https://netlify.com)
2. Conecte seu repositório Git
3. Configure build settings:
   - **Build command**: (deixe vazio)
   - **Publish directory**: `/`
4. Deploy automático

### 2. Vercel

#### Vantagens
- Performance otimizada
- Deploy instantâneo
- Analytics integrado

#### Passos
1. Acesse [vercel.com](https://vercel.com)
2. Importe o projeto
3. Configure:
   - **Framework**: Other
   - **Root Directory**: `/`
4. Deploy

### 3. GitHub Pages

#### Vantagens
- Gratuito para repositórios públicos
- Integração com GitHub

#### Passos
1. Faça upload dos arquivos para um repositório GitHub
2. Vá em Settings > Pages
3. Configure source como `main branch`
4. Acesse via `username.github.io/repository-name`

### 4. Servidor Próprio (cPanel/FTP)

#### Vantagens
- Controle total
- Customização completa

#### Passos
1. Acesse o painel de controle do hosting
2. Vá para File Manager ou use FTP
3. Faça upload dos arquivos para `public_html/`
4. Configure permissões se necessário

## ⚙️ Configurações Importantes

### 1. Arquivo .htaccess (Apache)
```apache
# Habilitar compressão
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

# Cache de arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Redirecionamento HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 2. Headers de Segurança
```apache
# Segurança
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"
```

## 📱 Configuração de Domínio

### 1. DNS Settings
```
Type: A
Name: @
Value: [IP do servidor]

Type: CNAME
Name: www
Value: [dominio.com]
```

### 2. SSL Certificate
- Use Let's Encrypt (gratuito)
- Configure redirecionamento HTTP → HTTPS
- Verifique certificado válido

## 📊 Monitoramento e Analytics

### 1. Google Analytics
Adicione o código no `<head>` do index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 2. Google Search Console
1. Adicione a propriedade
2. Verifique a propriedade
3. Envie o sitemap.xml

## 🔧 Otimizações Pós-Deploy

### 1. Performance
- Ative compressão Gzip
- Configure cache de arquivos estáticos
- Otimize imagens (WebP quando possível)
- Minifique CSS/JS se necessário

### 2. SEO
- Configure meta tags personalizadas
- Adicione sitemap.xml
- Configure robots.txt
- Implemente dados estruturados

### 3. Formulário de Contato
Para o formulário funcionar, configure:

#### Netlify Forms
```html
<form name="contact" method="POST" data-netlify="true">
  <!-- campos do formulário -->
</form>
```

#### Formspree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <!-- campos do formulário -->
</form>
```

#### EmailJS
```javascript
// Configurar no main.js
emailjs.init("YOUR_USER_ID");
```

## 🚨 Checklist Pré-Deploy

- [ ] Todos os arquivos estão incluídos
- [ ] Links internos funcionando
- [ ] Imagens carregando corretamente
- [ ] WebGL funcionando em diferentes navegadores
- [ ] Formulário configurado
- [ ] WhatsApp links corretos
- [ ] Meta tags configuradas
- [ ] Favicon adicionado
- [ ] Teste em mobile
- [ ] Performance verificada

## 🔄 Atualizações Futuras

### Processo de Atualização
1. Faça backup dos arquivos atuais
2. Teste mudanças localmente
3. Faça upload dos arquivos modificados
4. Verifique funcionamento
5. Limpe cache se necessário

### Versionamento
- Use Git para controle de versão
- Mantenha branches para desenvolvimento
- Documente mudanças importantes

## 📞 Suporte Técnico

Em caso de problemas no deploy:

1. **Verifique logs** do servidor
2. **Teste localmente** primeiro
3. **Verifique permissões** de arquivos
4. **Confirme configurações** de DNS
5. **Entre em contato** com suporte do hosting

---

**Deploy realizado com sucesso! 🎉**

O portfólio da Evolua Web Design está pronto para impressionar clientes e gerar resultados!

