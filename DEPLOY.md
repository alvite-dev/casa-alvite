# 🚀 Guia de Deploy - Casa Alvite

Este documento contém as instruções para fazer deploy do projeto Casa Alvite no Vercel.

## ✅ Pré-requisitos

- [ ] Projeto commitado no Git
- [ ] Repositório criado no GitHub
- [ ] Conta no Vercel (conectada ao GitHub)

## 📋 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Adicionar todos os arquivos ao Git
git add .

# Fazer commit inicial
git commit -m "feat: initial setup - landing page em construção"

# Conectar ao repositório remoto (substitua pela sua URL)
git remote add origin https://github.com/seu-usuario/casa-alvite.git

# Fazer push para o GitHub
git push -u origin main
```

### 2. Deploy no Vercel

1. **Acesse o Vercel Dashboard**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importar Projeto**
   - Clique em "New Project"
   - Selecione o repositório `casa-alvite`
   - Clique em "Import"

3. **Configurar Deploy**
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

4. **Variáveis de Ambiente** (quando necessário)
   ```
   NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
   ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o processo de build (2-3 minutos)

### 3. Configurações Pós-Deploy

#### Domínio Personalizado (Opcional)
1. No dashboard do projeto no Vercel
2. Vá para "Settings" → "Domains"
3. Adicione seu domínio customizado
4. Configure o DNS conforme instruções

#### Configurações de Deploy
- **Branch de Produção**: `main`
- **Auto-deploy**: Habilitado por padrão
- **Preview Deployments**: Habilitado para PRs

## 🔧 Configurações do Projeto

### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Headers de Segurança (Recomendado)
Adicione no `vercel.json` se necessário:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📊 Monitoramento

### Analytics
- Vercel Analytics: Habilitado automaticamente
- Dados de performance e visitantes

### Logs
- Build logs: Disponíveis no dashboard
- Function logs: Para debugging

## 🚀 URLs Finais

Após o deploy bem-sucedido:

- **URL de Produção**: `https://casa-alvite.vercel.app`
- **URL Personalizada**: `https://seu-dominio.com` (se configurado)
- **Dashboard Vercel**: Para monitoramento e configurações

## 🔄 Atualizações

Para futuras atualizações:

```bash
# Fazer mudanças no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

O deploy acontece automaticamente a cada push na branch `main`.

## 📞 Suporte

- **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Suporte Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Status do Projeto**: ✅ Pronto para deploy
**Última Atualização**: $(date) 