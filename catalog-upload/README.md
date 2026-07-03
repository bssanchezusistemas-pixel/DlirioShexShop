# Catálogo — imágenes para subir

1. Coloca tus fotos en `images/`
2. Copia `manifest.example.json` → `manifest.json`
3. Completa nombre, precio y categoría por producto
4. Ejecuta: `npm run upload:catalog`

## Categorías válidas
- `juguetes`
- `sen-intimo`
- `lenceria`
- `lubricantes`
- `kits`

Las imágenes se comprimen a WebP (~900px, calidad 78%) antes de subir a Supabase Storage.
