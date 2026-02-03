# 🚀 GUÍA RÁPIDA - REFERENCIA INMEDIATA

## Abrir Simulador (30 segundos)

```bash
cd /workspaces/IA-games
python3 -m http.server 8000
# Luego abre: http://localhost:8000/IASistem.html
```

## Lo Básico (5 minutos)

| Acción | Resultado |
|--------|-----------|
| **Click Izquierdo** | Crear manzana 🍎 (recompensa) |
| **Click Derecho** | Crear bloque 🧱 (obstáculo) |
| **Color** | Cambia color del agente |
| **Castigo** | Toggle ON/OFF = saltar cuesta energía |
| **Reset** | Reinicia la IA desde cero |

## Observables de Aprendizaje (mientras ves)

```
⏱️  Segundo 0-30:    RANDOM. Se mueve al azar.
⏱️  Segundo 30-60:   Crea comida. Eventualmente la encuentra.
⏱️  Minuto 1-2:      Empieza a ver PATRÓN. Busca cerca de dónde estaba.
⏱️  Minuto 2-5:      MEJORA CLARA. Busca deliberadamente.
⏱️  Minuto 5-10:     CONVERGENCIA. Comportamiento óptimo observado.
```

## Archivos Principales

```
IASistem.html        ← ABRE ESTO EN NAVEGADOR
js/brain/            ← Inteligencia (toma decisiones)
js/learning/         ← Aprendizaje (Q-Learning)
js/physics/          ← Motor físico (gravedad, colisiones)
js/core/             ← Clases base (Agent, Food, Block)
```

## 3 Sistemas que Trabajan Juntos

```
🧠 BRAIN          📚 LEARNING        ⚙️ PHYSICS
├─ Percepción    ├─ Q-Learning      ├─ Gravedad
├─ Emociones     ├─ Tabla Q         ├─ Colisiones
├─ Predicción    ├─ Experiencias    ├─ Metabolismo
└─ Decisión      └─ Patrones        └─ Biomecánica
```

## Variables Realmente Implementadas

### Hormonal (¡sí, realmente!)
- **Adrenalina**: ↑ con urgencia
- **Dopamina**: ↑ con comida
- **Cortisol**: ↑ con estrés
- **Grelina**: ↑ con hambre

### Biomecánica (¡sí, de verdad!)
- **Fatiga**: Afecta altura de saltos
- **Ácido Láctico**: Acumula con movimiento
- **Temperatura**: Sube/baja con esfuerzo

### Aprendizaje (Q-Learning real)
- **Tabla Q**: Se actualiza cada frame
- **Epsilon**: Decay de 0.9998 (menos random con tiempo)
- **Convergencia**: Observable en el comportamiento

## Parámetros Cambiables

**Rápido** (En UI):
- Color agente
- Castigo por saltar ON/OFF
- Reset

**Avanzado** (Editar JS):
- `js/learning/`: learning rate, discount factor, epsilon
- `js/physics/`: gravedad, jump power, metabolismo
- `js/brain/`: umbrales de decisión, pesos emocionales

## Recompensas (Sistema Sofisticado)

```
Comer       → +50 (+ bonus si energía <40%)
Existir     → -0.05 (penalización pasiva)
Energía baja→ -0.10 (incentiva buscar comida)
Salto fallo → -1 (error)
Saltar OK   → -2 a -3 (si castigo ON)
```

## Qué Significa Todo

| Métrica | Significa |
|---------|-----------|
| Energía ↓ | Necesita comida urgentemente |
| 😠 Enojado | Frustrado o hambriento |
| 😴 Cansado | Energía crítica |
| Experiencia ↑ | Aprendiendo (frame a frame) |
| Comida ↑ | Mejoró su búsqueda |

## Estados Posibles de la IA

```
Ejemplo: "right_near_low_ground"
  ├─ right      = comida a la derecha
  ├─ near       = a menos de 120 px
  ├─ low        = energía < 40%
  └─ ground     = en el suelo
```

## Documentación Completa

- `README.md` → Cómo usar, características
- `ARQUITECTURA.md` → Técnico, API, variables
- `INTEGRACION.md` → Cómo los 3 sistemas trabajan

## Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| No se ve nada | Recarga F5. Revisa consola (F12) |
| No se mueve | Crea comida (click izq). Espera. |
| Muy lento | Menos bloques/comida. Reset. |
| No aprende | Espera más minutos. Crea muchos items. |

## Lo Especial de Este Simulador

✓ **Modular**: 3 sistemas independientes
✓ **Realista**: Biomecánica, hormonas, metabolismo
✓ **Inteligente**: Q-Learning real, no reglas
✓ **Emocional**: Expresión facial que cambia
✓ **Observable**: Ves el aprendizaje en vivo
✓ **Simple**: Un solo HTML, módulos JS

---

**Prueba ahora**: Abre HTML, crea 3 manzanas, espera 5 minutos, observa INTELIGENCIA REAL emergiendo. 🤖✨
