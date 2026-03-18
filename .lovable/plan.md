

## Optimalizácia zobrazenia fotiek

**Problém**: Keď používateľ pridá veľa fotiek, grid sa roztiahne vertikálne a stránka sa stáva veľmi dlhá.

**Riešenie**: Obmedziť grid fotiek na maximálnu výšku (~3 riadky) so scrollom a pridať počítadlo + collapse/expand toggle.

### Zmeny v `src/pages/dashboard/DashboardNewProperty.tsx`:

1. **Obaliť photo grid do ScrollArea** s `max-h-[240px]` (3 riadky thumbnailov) — ak je fotiek viac, scrolluje sa len grid, nie celá stránka.

2. **Pridať summary text** pod gridom ak je fotiek veľa (napr. "Zobrazených 12 z 48 — scrollujte pre viac").

3. **Zmenšiť thumbnaily** z `grid-cols-4 sm:grid-cols-5` na `grid-cols-5 sm:grid-cols-6` pre kompaktnejšie zobrazenie.

Minimálna zmena, maximálny efekt — grid bude mať fixnú výšku a internal scroll.

