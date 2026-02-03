# 🤖 Simulador de Vida Artificial Avanzado - Q-Learning Real

Un simulador completamente funcional de IA que **aprende de verdad** usando Q-Learning en tiempo real.

## 🎯 OBJETIVOS QUE PUEDE APRENDER

```
🍎 Buscar Comida      → Localiza y come automáticamente
🥛 Beber Leche        → Prioriza leche sobre comida
🚩 Alcanzar Bandera   → Navega a objetivos específicos
🚫 No Saltar          → Aprende que saltar cuesta energía
```

## 🛠️ ELEMENTOS DEL MUNDO

| Elemento | Efecto | Enseñanza |
|----------|--------|-----------|
| 🍎 Comida | +35 energía | Recompensa: +50 |
| 🥛 Leche | +50 energía | Recompensa: +40 |
| 🧱 Bloque | Obstáculo | No pasar |
| ⚠️ Pincho | -20 energía | Evitar siempre |
| 🚩 Bandera | Objetivo | Recompensa: +200 |

## 🧠 CÓMO FUNCIONA LA IA

### 1. **PERCEPCIÓN INTELIGENTE** 🔍
- Escanea 100 píxeles alrededor
- Detecta comida, leche, pinchos, banderas
- Sabe dirección y distancia exacta
- Identifica obstáculos inmediatos

### 2. **DECISIÓN NATURAL** 💭
```
✓ No spammea izq/derecha (cooldown 3 frames)
✓ EVITA PINCHOS SIEMPRE (máxima prioridad)
✓ Aprende costo del salto (promedia últimos 50)
✓ Elige acciones deliberadamente
```

### 3. **APRENDIZAJE REAL** 🧬
```
Q(s,a) = Q(s,a) + α[r + γ×max(Q(s',a')) - Q(s,a)]

α (learning rate) = 0.2      (velocidad)
γ (discount factor) = 0.95   (valor futuro)
ε (epsilon) = 0.5 → 0.05    (exploración)
```

### 4. **DINÁMICAS ADAPTATIVAS** ⚡
- Prioridad 1: Evitar pinchos → saltar
- Prioridad 2: Si saltar es caro → no saltar
- Prioridad 3: Epsilon-greedy (explorar vs usar lo aprendido)
- Prioridad 4: Mejor acción conocida

## 📊 ESTADÍSTICAS EN TIEMPO REAL

- **Estado**: Dying 💀 / Tired 😴 / Neutral 😐 / Happy 😊
- **Energía**: Barra visual + porcentaje
- **Comida Consumida**: Contador
- **Leche Bebida**: Contador
- **Banderas Alcanzadas**: Misiones completadas
- **Saltos**: Total realizados
- **Experiencia**: Decisiones aprendidas
- **Aprendizaje %**: Qué tan convergida (100% = no explora)

## 🗺️ MAPAS PREDEFINIDOS

| Mapa | Complejidad | Características |
|------|-------------|-----------------|
| Vacío | ⭐ | Nada, exploración pura |
| Simple | ⭐⭐ | 1 bloque + 1 comida |
| Obstáculos | ⭐⭐⭐ | 2 bloques + pincho |
| Laberinto | ⭐⭐⭐⭐ | Navegación compleja |

## 🎮 CÓMO USAR

### Crear Items
1. **Click Izquierdo**: Comida 🍎 (por defecto)
2. **Rueda del Ratón**: Cambiar tipo de item
3. **Botones**: Seleccionar rápidamente

### Cambiar Objetivo
- Selecciona en **"Objetivo del Agente"**
- La IA reinicia su aprendizaje
- Observa cómo cambia el comportamiento

### Configuración
- **Color**: Personaliza el agente
- **Castigo por Saltar**: 
  - ON = saltar cuesta 3 energía
  - OFF = saltar es gratis
  - La IA lo aprenderá automáticamente

## 🔬 EXPERIMENTOS PROPUESTOS

### Experimento 1: Detectar Costo del Salto
```
1. Activa "Castigo por Saltar"
2. Crea 3 comidas en línea horizontal
3. Frames 0-50: El agente explora, salta mucho
4. Frames 50-100: Empieza a notar el costo
5. Frames 100+: Reduce saltos drásticamente
→ Observa "Costo Salto" en debug aumentar
```

### Experimento 2: Evasión de Pinchos
```
1. Mapas → Obstáculos (contiene pincho)
2. Crea más comida alrededor del pincho
3. La IA aprenderá a rodearla, NUNCA atravesarla
4. Incluso saltará preemptivamente para evitar
→ Es aprendizaje de verdad, no código hardcoded
```

### Experimento 3: Cambiar Objetivos
```
1. Objetivo: Comida (10 min)
2. Objetivo: Leche (cambia instantáneamente)
3. Observa cómo adapta su comportamiento
4. Objetivo: Bandera en lugar lejano
→ La IA debe navegar, no solo buscar
```

### Experimento 4: Navegación Compleja
```
1. Mapas → Laberinto
2. Objetivo: Alcanzar Bandera
3. Deja corriendo 10 minutos
4. Verás mejora DRAMÁTICA en navegación
→ Aprendizaje profundo en acción
```

## 📈 SEÑALES DE APRENDIZAJE REAL

✅ **El agente está aprendiendo:**
- Deja de spammear acciones después de 1-2 minutos
- Busca deliberadamente objetivos
- Evita pinchos con propósito (no random)
- Reduce saltos si detecta costo
- % de aprendizaje aumenta continuamente

❌ **Algo está mal:**
- Sigue spammeando después de 3 minutos
- Ignora pinchos constantemente
- Nunca alcanza objetivos
- La gráfica de aprendizaje no cambia

## 🎓 CONCEPTOS TÉCNICOS

### Q-Table (Tabla de Valores)
Cada estado discreto tiene 4 valores Q:

```javascript
Estado: "izquierda_cercano_energía-baja_suelo_peligro"
{
  left:  -2.5,  // Ir izquierda es malo aquí
  right: -5.0,  // Ir derecha es peor
  jump:  0.8,   // Saltar es bueno (evita peligro)
  idle:  -0.1   // Esperar es neutral
}
```

### Estados Discretos (Automáticos)
Se crean al vuelo basándose en:
- **Dirección**: left / right / searching
- **Distancia**: close (< 50) / medium (< 150) / far
- **Energía**: low (< 30) / medium (< 70) / high
- **Posición**: ground / air
- **Peligro**: safe / danger

Esto genera ~100 estados únicos automáticamente.

### Recompensas (Diseño Inteligente)
```javascript
// Cada frame:
-0.03            // Costo base de existir
-0.1 si energía < 30%  // Incentiva buscar comida

// Al comer:
+50              // Comida normal
+150             // BONUS si objetivo es "food"

+40              // Leche
+140             // BONUS si objetivo es "milk"

+200             // Bandera
+400             // BONUS si objetivo es "flag"

-20              // Daño de pincho (enseña a evitar)
```

## 💡 OPTIMIZACIONES IMPLEMENTADAS

1. **Sin Spam**: Cooldown de 3 frames entre acciones
2. **Detección Temprana**: Escanea peligro con anticipación
3. **Aprendizaje de Costos**: Promedia últimos 50 saltos
4. **Estados Comprimidos**: Discretización inteligente
5. **Épsilon Decay**: Reduce exploración gradualmente (0.9995/frame)
6. **Prioridades**: Pinchos > Costo > Aleatorio > Aprendido

## 📚 REFERENCIAS

- **Q-Learning Wikipedia**: https://en.wikipedia.org/wiki/Q-learning
- **DeepMind RL Glossary**: https://www.deepmind.com/learning-resources
- **Epsilon-Greedy**: https://en.wikipedia.org/wiki/Multi-armed_bandit

## 🐛 TROUBLESHOOTING

**P: ¿Por qué no aprende?**
- ✓ Verifica que haya items en el mapa
- ✓ El objetivo debe coincidir con los items
- ✓ Espera 3+ minutos
- ✓ Usa mapas simples primero

**P: ¿Por qué hace spam de movimiento?**
- Normal en primeros 30 segundos (exploración)
- Después debería calmarse

**P: ¿Cómo acelero el aprendizaje?**
- Usa mapas simples
- Pon muchos items
- Desactiva "Castigo por Saltar"

**P: ¿Qué es "Aprendizaje 85%"?**
- Significa que epsilon es 0.15 (15% exploración)
- Confía 85% en lo aprendido
- 100% = no explora más

## 🚀 VERSIÓN

- **Versión**: 2.0 Avanzada
- **Fecha**: Febrero 2026
- **Motor**: Canvas + Vanilla JS
- **Algoritmo**: Q-Learning tabular
- **Estado**: Completamente funcional

---

**Creado por:** Dardo García + GitHub Copilot  
**Licencia:** MIT  
**Mantenimiento:** Activo
