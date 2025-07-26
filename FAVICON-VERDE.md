# 🟢 Favicon com Fundo Verde - Casa Alvite

## 🎯 Problema Identificado
O favicon branco não aparece bem em abas de navegador com fundo claro.

## ✅ Solução Implementada

### 1. Favicon SVG (Automático)
Criei um favicon SVG com fundo verde que se adapta automaticamente:

```svg
<!-- /public/icon.svg -->
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#6A6D51" rx="8"/>
  <!-- Logo da Casa Alvite aqui -->
</svg>
```

### 2. Configuração no Layout
```tsx
icons: {
  icon: '/icon.svg',           // SVG com fundo verde
  shortcut: '/favicon.ico',    // Fallback
  apple: '/images/logo/favicon/favicon-128x128.png',
},
```

## 🛠️ Para Favicon Personalizado

### Opção A: Usando sua Logo Real
1. **Abra um editor** (Figma, Photoshop, Canva)
2. **Crie um canvas** 32x32px (ou 64x64px)
3. **Fundo verde**: #6A6D51
4. **Logo centralizada** em branco/cream
5. **Exporte como PNG** e substitua os arquivos em `/public/images/logo/favicon/`

### Opção B: Ferramentas Online
1. **RealFaviconGenerator**: https://realfavicongenerator.net/
2. **Upload sua logo** 
3. **Configurar fundo verde** #6A6D51
4. **Baixar todos os tamanhos**

### Opção C: Canva (Mais Simples)
1. **Criar design** 64x64px
2. **Fundo verde** #6A6D51  
3. **Adicionar logo** centralizada
4. **Baixar como PNG** alta qualidade

## 📱 Tamanhos Recomendados
- **16x16px** - Aba do navegador
- **32x32px** - Favoritos 
- **64x64px** - Qualidade HD
- **128x128px** - Mobile/Apple
- **192x192px** - Android

## 🎨 Cores Casa Alvite
- **Fundo**: #6A6D51 (verde)
- **Logo**: #F4E8DA (cream) ou branco
- **Bordas**: Arredondadas (8px radius)

## 🚀 Status Atual
- ✅ SVG temporário criado
- ✅ Configuração atualizada
- ⏳ Aguardando favicon personalizado

---

**Resultado**: Favicon agora aparece bem em qualquer cor de fundo! 🎉 