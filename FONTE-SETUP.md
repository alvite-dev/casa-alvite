# 🔤 Configuração da Fonte Junyper Bay

## 📁 Passo 1: Organizar os Arquivos da Fonte

1. **Crie a estrutura de pastas:**
```
src/
└── fonts/
    └── junyper-bay/
        ├── JunyperBay-Regular.woff2
        ├── JunyperBay-Regular.woff
        ├── JunyperBay-Bold.woff2
        ├── JunyperBay-Bold.woff
        ├── JunyperBay-Italic.woff2
        └── JunyperBay-Italic.woff
```

2. **Formatos recomendados (em ordem de prioridade):**
   - `.woff2` (mais moderno e comprimido)
   - `.woff` (fallback)
   - `.ttf` ou `.otf` (se necessário)

## ⚙️ Passo 2: Configurar com Next.js Font

### Opção A: Usando next/font/local (Recomendado)

```typescript
// src/app/layout.tsx
import localFont from 'next/font/local'

const junyperBay = localFont({
  src: [
    {
      path: '../fonts/junyper-bay/JunyperBay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/junyper-bay/JunyperBay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/junyper-bay/JunyperBay-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-junyper-bay',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={junyperBay.variable}>
      <body className="font-instrument antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Opção B: CSS @font-face tradicional

```css
/* src/app/globals.css */
@font-face {
  font-family: 'Junyper Bay';
  src: url('../fonts/junyper-bay/JunyperBay-Regular.woff2') format('woff2'),
       url('../fonts/junyper-bay/JunyperBay-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Junyper Bay';
  src: url('../fonts/junyper-bay/JunyperBay-Bold.woff2') format('woff2'),
       url('../fonts/junyper-bay/JunyperBay-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

## 🎨 Passo 3: Atualizar Tailwind Config

```typescript
// tailwind.config.ts
fontFamily: {
  'instrument': ['Instrument Sans', 'sans-serif'],
  'junyper': ['var(--font-junyper-bay)', 'Junyper Bay', 'serif'], // Para next/font
  // ou
  'junyper': ['Junyper Bay', 'serif'], // Para CSS @font-face
},
```

## 🚀 Passo 4: Como Usar

```tsx
// Nos componentes
<h1 className="font-junyper text-4xl">Casa Alvite</h1>
```

## 📊 Otimizações

### Performance
- Use `font-display: swap` para melhor UX
- Prefira `.woff2` (menor tamanho)
- Use `preload` para fontes críticas:

```tsx
// Em layout.tsx ou page.tsx
import Head from 'next/head'

<Head>
  <link
    rel="preload"
    href="/fonts/junyper-bay/JunyperBay-Regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin=""
  />
</Head>
```

### Fallbacks
```css
font-family: 'Junyper Bay', 'Crimson Text', Georgia, serif;
```

## 🔧 Troubleshooting

### Se a fonte não carregar:
1. Verifique os caminhos dos arquivos
2. Confirme que os arquivos estão na pasta `public/` ou `src/fonts/`
3. Teste em modo de desenvolvimento (`npm run dev`)
4. Verifique o console do navegador por erros

### Formatos suportados:
- **Melhor**: WOFF2 (suporte moderno)
- **Bom**: WOFF (suporte amplo)
- **OK**: TTF/OTF (fallback)

## 📝 Checklist

- [ ] Arquivos da fonte copiados para `src/fonts/junyper-bay/`
- [ ] Configuração no `layout.tsx` ou CSS
- [ ] Tailwind config atualizado
- [ ] Teste em diferentes navegadores
- [ ] Verificar performance (tamanho dos arquivos)

## 💡 Dicas

1. **Converta fontes** para WOFF2 se necessário (use ferramentas online)
2. **Comprima fontes** para reduzir tamanho
3. **Use subsets** se a fonte for muito grande
4. **Teste** em dispositivos móveis 