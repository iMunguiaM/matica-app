# Mática - Módulo de cálculo

App web de cálculo mental para niños de primaria, creada con React, TypeScript, Vite, Tailwind CSS y lucide-react.

## Cómo correrla en tu computadora

```bash
npm install
npm run dev
```

Luego abre la URL que Vite te muestre, normalmente `http://localhost:5173`.

## Cómo crear la versión final

```bash
npm run build
```

La app final se genera en la carpeta `dist`.

## Publicación en GitHub Pages

Este proyecto ya incluye un workflow en `.github/workflows/deploy.yml`.

1. Sube todo este proyecto a un repositorio de GitHub.
2. En GitHub entra a **Settings > Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions**.
4. Haz push a la rama `main`.
5. GitHub construirá y publicará la app automáticamente.

## Estructura importante

- `src/App.tsx`: componente principal de la app.
- `src/main.tsx`: punto de entrada de React.
- `src/index.css`: Tailwind y estilos base.
- `tailwind.config.cjs`: configuración para conservar las clases visuales.
- `vite.config.ts`: configuración para que GitHub Pages no rompa rutas de CSS/JS.
