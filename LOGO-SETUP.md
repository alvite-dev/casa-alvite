# 🎨 Como Adicionar a Logo da Casa Alvite

## 📁 Passo 1: Preparar os Arquivos da Logo

### Formatos Recomendados:
- **SVG** (melhor para web - escalável e pequeno)
- **PNG** com fundo transparente (boa qualidade)
- **WebP** (formato moderno, menor tamanho)

### Tamanhos Sugeridos:
- **Logo principal**: 400x400px ou maior
- **Favicon**: 32x32px, 64x64px, 128x128px
- **Diferentes versões**: horizontal, vertical, símbolo

## 📂 Passo 2: Estrutura de Pastas

```
public/
└── images/
    └── logo/
        ├── logo.svg           (principal)
        ├── logo.png           (fallback)
        ├── logo-horizontal.svg
        ├── logo-symbol.svg    (só o símbolo)
        └── favicon/
            ├── favicon.ico
            ├── favicon-32x32.png
            └── favicon-192x192.png
```

## ⚙️ Passo 3: Implementar no Código

### Substituir o Logo Temporário

```tsx
// src/app/page.tsx
// Trocar isto:
<div className="w-24 h-24 mx-auto bg-gradient-to-br from-amarelo to-terracotta rounded-full flex items-center justify-center shadow-lg">
  <div className="text-cream text-3xl font-bold">CA</div>
</div>

// Por isto:
<div className="w-32 h-32 mx-auto flex items-center justify-center">
  <Image
    src="/images/logo/logo.svg"
    alt="Casa Alvite Logo"
    width={128}
    height={128}
    className="drop-shadow-lg"
    priority
  />
</div>
```

### Configurar Favicon

```tsx
// src/app/layout.tsx - adicionar no metadata
export const metadata: Metadata = {
  title: 'Casa Alvite - Experiências em Cerâmica',
  description: 'Experiências únicas em cerâmica com sistema de agendamento e pagamento online.',
  keywords: 'cerâmica, experiências, agendamento, Casa Alvite, arte, criatividade',
  icons: {
    icon: '/images/logo/favicon/favicon.ico',
    shortcut: '/images/logo/favicon/favicon.ico',
    apple: '/images/logo/favicon/favicon-192x192.png',
  },
}
```

### Logo Responsiva

```tsx
// Versão responsiva da logo
<div className="flex items-center justify-center">
  <Image
    src="/images/logo/logo.svg"
    alt="Casa Alvite"
    width={120}
    height={120}
    className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 drop-shadow-lg"
    priority
  />
</div>
```

## 🚀 Passo 4: Otimizações

### Performance
```tsx
// Para logos importantes use priority
<Image
  src="/images/logo/logo.svg"
  alt="Casa Alvite"
  width={128}
  height={128}
  priority
  className="drop-shadow-lg"
/>

// Para logos menores use loading lazy
<Image
  src="/images/logo/logo-symbol.svg"
  alt="Casa Alvite"
  width={64}
  height={64}
  loading="lazy"
  className="opacity-80"
/>
```

### Fallbacks
```tsx
// Com fallback para PNG
<Image
  src="/images/logo/logo.svg"
  alt="Casa Alvite"
  width={128}
  height={128}
  onError={(e) => {
    e.currentTarget.src = '/images/logo/logo.png'
  }}
/>
```

## 📝 Checklist

- [ ] Logo salva em `/public/images/logo/`
- [ ] Formato SVG (recomendado) ou PNG
- [ ] Favicon criado em diferentes tamanhos
- [ ] Import do Image component do Next.js
- [ ] Configuração no metadata (layout.tsx)
- [ ] Teste em diferentes tamanhos de tela
- [ ] Verificar acessibilidade (alt text)

## 💡 Dicas

1. **Use SVG** quando possível (menor tamanho, escalável)
2. **Otimize PNGs** com ferramentas como TinyPNG
3. **Teste em fundos claros e escuros**
4. **Crie versões monocromaticas** se necessário
5. **Use `priority`** para logos principais (above the fold)

## 🔧 Ferramentas Úteis

- **Converter para SVG**: Online SVG converters
- **Redimensionar**: Figma, Photoshop, ou online tools
- **Otimizar**: SVGO, TinyPNG
- **Favicon Generator**: realfavicongenerator.net

---

**Quando você tiver a logo pronta, me avise que eu implemento automaticamente!** 🎨 