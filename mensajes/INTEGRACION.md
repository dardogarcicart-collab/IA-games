# 🧠 Guía de Integración de Módulos

## Resumen de la Arquitectura

Has creado una IA modular que funciona como un verdadero sistema cognitivo. Aquí te explico cómo **PIENSAN** los 3 sistemas juntos.

## 🧠 + 📚 + ⚙️ = 🤖 IA REAL

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT (Agente Principal)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │   BRAIN          │  │   LEARNING       │  │   PHYSICS  │  │
│  │  (Cognitivo)     │  │  (Aprendizaje)   │  │  (Motor)   │  │
│  ├──────────────────┤  ├──────────────────┤  ├────────────┤  │
│  │ • Percepción     │  │ • Q-Learning     │  │ • Gravedad │  │
│  │ • Emociones      │  │ • Tabla Q        │  │ • Colisiones│ │
│  │ • Predicción     │  │ • Experiencias   │  │ • Metabolismo
│  │ • Decisión       │  │ • Patrones       │  │ • Biomecánica
│  └──────────────────┘  └──────────────────┘  └────────────┘  │
│         │                      │                     │         │
│         └──────────────────────┼─────────────────────┘         │
│                                │                               │
│                          ┌─────▼─────┐                        │
│                          │   UPDATE   │                        │
│                          │  (60 FPS)  │                        │
│                          └─────┬─────┘                        │
└────────────────────────────────┼────────────────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │   RENDERIZADO  │
                         │   (Canvas)     │
                         └────────────────┘
```

## 🔄 Flujo por Frame (Ciclo de Actualización)

### Frame N

```
1️⃣  PERCEPCIÓN (BRAIN)
    ├─ brain.perceiveEnvironment(foods, blocks)
    ├─ Sensores: Visión, Propiocepción, Interocepción
    ├─ Actualiza estado sensorial interno
    └─ Busca comida y bloques más cercanos

2️⃣  OBTENER ESTADO (LEARNING)
    ├─ state = learning.getState(agent, foods, blocks)
    ├─ Ej: "right_near_low_ground"
    ├─ Discretiza el espacio continuo
    └─ Identifica patrón del mundo actual

3️⃣  DECISIÓN INTELIGENTE (BRAIN + LEARNING)
    ├─ qValues = learning.getQValues(state)
    ├─ decision = brain.makeDecision(state, qValues, epsilon)
    ├─ Considera: urgencia, emociones, patrones aprendidos
    └─ Retorna acción: left, right, jump, idle

4️⃣  APRENDER DEL PASADO (LEARNING)
    ├─ Si frame anterior existe:
    ├─ Calcula recompensa r (comida, energía, etc)
    ├─ learning.recordExperience(lastState, lastAction, r, state)
    ├─ Actualiza Q-values con Bellman
    └─ Tabla Q mejora gradualmente

5️⃣  EJECUTAR ACCIÓN (BRAIN + PHYSICS)
    ├─ agent.executeAction(decision.action)
    ├─ Llama a physics.applyMovement()
    ├─ O physics.applyJump()
    └─ Modifica velocidad del agente

6️⃣  FÍSICA (PHYSICS)
    ├─ physics.applyGravity(agent)
    ├─ physics.applyFriction(agent)
    ├─ physics.updatePosition(agent)
    ├─ physics.applyWorldBoundaries(agent)
    ├─ physics.resolveBlockCollisions(agent, blocks)
    └─ Actualiza posición y velocidad realista

7️⃣  COLISIONES CON COMIDA (BRAIN + LEARNING)
    ├─ agent.checkFoodCollisions(foods)
    ├─ Si colisiona:
    ├─ reward = +50 (+ bonus si energía baja)
    ├─ learning.recordExperience(..., reward, ...)
    ├─ brain.emotionDecay baja (menos frustración)
    └─ foodEaten++

8️⃣  METABOLISMO (PHYSICS)
    ├─ cost = physics.calculateMetabolicCost(agent)
    ├─ Considera: reposo, movimiento, salto, fatiga
    ├─ agent.energy -= cost
    └─ Fatiga se recupera (biomecánica)

9️⃣  EMOCIONES (BRAIN)
    ├─ brain.processEmotions()
    ├─ Ajusta hormonas según circunstancias
    ├─ agent.updateMood()
    └─ Expresión facial cambia (neutral/angry/tired)

🔟  OPTIMIZACIÓN (LEARNING)
    ├─ learning.updateEpsilon()
    ├─ Epsilon *= 0.9998 (decay gradual)
    └─ Menos exploración aleatoria con el tiempo

1️⃣1️⃣  RENDERIZADO (UI)
    ├─ Dibujar mundo (cielo, suelo, etc)
    ├─ Dibujar bloques
    ├─ Dibujar comida
    ├─ Dibujar agente con expresión
    └─ Actualizar UI (energía, mood, stats)
```

## 💡 Ejemplo Práctico: El Agente Aprende

### Minuto 0:0 (Inicio)

```
Estado: "none_far_high_ground"
Acción: ALEATORIO → "right" (epsilon=0.40)
Resultado: Se mueve despacho a la derecha
Recompensa: -0.05 (penalización pasiva)
Q-table: Q[none_far_high_ground][right] = -0.05
```

### Minuto 0:15 (Encuentro comida)

```
Crear comida → Estado cambia a "right_near_high_ground"
Acción: ALEATORIO → "idle" (epsilon=0.39)
Colisión: ¡Come comida!
Recompensa: +75 (50 base + 25 bonus porque energía baja)
Q-table: Q[right_near_high_ground][idle] = 75
Emoción: dopamina ↑, satisfaction ↑, enojado baja
```

### Minuto 1:00 (Patrón se forma)

```
Estado: "left_far_medium_ground"
Acción: Epsilon-greedy
- 36% EXPLORACIÓN aleatoria (epsilon=0.36)
- 64% EXPLOTACIÓN: "right" (Q-value más alto)
```

### Minuto 5:00 (Convergencia)

```
Estado: "right_far_low_ground"
Acción: Casi siempre "right" 
- 5% EXPLORACIÓN (min epsilon)
- 95% EXPLOTACIÓN
Comportamiento: Definitivamente busca comida hacia donde la vea
```

## 📊 Variables que Cambian Dinámicamente

### En BRAIN (Inteligencia)

```javascript
mentalState = {
    attention: 1.0,        // ↑ cuando ve comida
    urgency: 0.8,          // ↑ cuando energía baja
    stress: 0.3,           // ↑ cuando falla
    motivation: 0.6        // ↑ con dopamina
}

hormones = {
    adrenaline: 0.2,       // ↑ peligro/urgencia
    dopamine: 0.8,         // ↑ después de comer
    cortisol: 0.1,         // ↑ estrés
    ghrelin: 0.4           // ↑ hambre
}
```

### En LEARNING (Aprendizaje)

```javascript
qTable = {
    "left_far_high_ground": { 
        left: 5.2, 
        right: 2.1, 
        jump: -0.5, 
        idle: 0 
    },
    "right_near_low_ground": { 
        left: -1.0, 
        right: 12.5,  // ← Más alto = mejor acción
        jump: 3.2, 
        idle: 8.1 
    }
}

epsilon: 0.25  // Disminuye cada frame
convergence: 0.73  // % de estabilidad
```

### En PHYSICS (Motor)

```javascript
biomechanics = {
    muscularFatigue: 0.3,   // ↑ con saltos
    lactateLevel: 0.1,      // ↑ movimiento intenso
    oxygenDebt: 0.0,        // ↑ anaeróbico
    muscleTemperature: 37.2 // ↑ con esfuerzo
}

metabolicCost = 1.5  // energía/frame
```

## 🎯 Cómo Se Comunican los Módulos

### BRAIN → LEARNING

```
brain.makeDecision() 
  ↓
  Usa learning.getQValues() para ver qué aprendió
  ↓
  Usa learning.epsilon para decidir: explorar o explotar
  ↓
  Retorna decision con action + reasoning
```

### BRAIN → PHYSICS

```
agent.executeAction(action)
  ↓
  Llama a physics.applyMovement(agent, direction)
  o physics.applyJump(agent, jumpPenalty)
  ↓
  Physics actualiza agent.vx, agent.vy, agent.vy
  ↓
  Next frame: PHYSICS controla gravedad y colisiones
```

### LEARNING → AGENT

```
learning.recordExperience(state, action, reward, nextState)
  ↓
  Actualiza qTable[state][action]
  ↓
  Calcula nuevas preferencias
  ↓
  Próximas decisiones serán diferentes
```

### PHYSICS → BRAIN

```
energy = physics.calculateMetabolicCost()
  ↓
  agent.energy -= cost
  ↓
  brain.perceiveEnvironment() detecta energy baja
  ↓
  brain.processEmotions() → mood = 'tired'
  ↓
  Expresión facial cambia
```

## 🧬 Tabla Q como "Memoria Inteligente"

La tabla Q es básicamente:
- **Clave**: Descripción del mundo (estado)
- **Valor**: Qué tan buena es cada acción en ese estado

```
"left_near_high_ground" → {
    left:  -5.2  ← MALA (se aleja de comida)
    right: 25.8  ← EXCELENTE (hacia comida)
    jump:  8.3   ← OK (saltar hacia comida)
    idle:  -0.1  ← MALA (pierde oportunidad)
}
```

Con el tiempo:
- Los valores **correctos suben** (valores Q positivos altos)
- Los valores **incorrectos bajan** (valores Q negativos)
- El agente **elige automáticamente** la acción de mayor valor

## 🎓 El Aprendizaje en Fórmula

Cada vez que el agente toma una acción y ve resultado:

```
ΔQ = α [r + γ max(Q(s')) - Q(s,a)]
      ↓   ↑       ↑              ↑
    cambio recompensa futuro valor actual
```

- **α (learning rate) = 0.15**: Qué tan rápido cambia
- **γ (discount) = 0.95**: Cuánto importa el futuro
- **r (reward)**: Lo que obtuvo en este frame
- **Q(s')**: Lo mejor que espera el próximo estado

## 🔬 Ejemplo Numérico

### Inicial
```
Q[right_far][right] = 0
```

### Frame 1: Se mueve a la derecha
```
State: right_far
Action: right
Reward: -0.05 (penalización pasiva)
NextState: right_near (¡más cerca!)
MaxQ(right_near) = 12.5

ΔQ = 0.15 * (-0.05 + 0.95 * 12.5 - 0)
   = 0.15 * (11.825)
   = 1.77

Q[right_far][right] = 0 + 1.77 = 1.77
```

### Frame 2: Come comida
```
State: right_near
Action: idle
Reward: +75 (¡comida!)
NextState: right_far (nuevo ciclo)
MaxQ(right_far) = 1.77

ΔQ = 0.15 * (75 + 0.95 * 1.77 - 0)
   = 0.15 * (76.68)
   = 11.5

Q[right_near][idle] = 0 + 11.5 = 11.5
```

¡Ahora sabe que "estar cerca" → "idle" = bueno!

## 🎮 Cómo Experimentar

### Para ver BRAIN trabajando:
1. Crea 1 manzana en el centro
2. Observa el patrón de búsqueda
3. Cambia su expresión según emociones

### Para ver LEARNING trabajando:
1. Coloca muchas manzanas aleatorias
2. Observa cómo mejora el contador de "Experiencia"
3. Verás cómo Q-values convergen

### Para ver PHYSICS trabajando:
1. Crea bloques obstaculizando el camino
2. Activa/desactiva "Castigo por Saltar"
3. Observa cómo aprende a saltarlos (o no)

---

**La belleza de este sistema:** Ninguno de los 3 módulos sabe completamente qué hacen los otros, pero juntos **crean inteligencia real**. 🤖✨
