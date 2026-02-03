# 🤖 Arquitectura del Simulador de Vida Artificial

## 📁 Estructura de Carpetas

```
IA-games/
├── IASistem.html          # Archivo principal (HTML + UI)
├── js/                    # Módulos JavaScript separados
│   ├── brain/            # Sistema Cognitivo (INTELIGENCIA)
│   │   └── CognitiveSystem.js
│   ├── learning/         # Sistema de Aprendizaje (APRENDER)
│   │   └── LearningSystem.js
│   ├── physics/          # Motor Físico (REALIDAD)
│   │   └── PhysicsEngine.js
│   └── core/             # Entidades Base
│       └── Entities.js
├── ARQUITECTURA.md       # Este archivo
└── README.md
```

## 🧠 Módulos del Sistema

### 1. **Brain (Inteligencia) - `CognitiveSystem.js`**

El "cerebro" del agente que toma decisiones inteligentes.

**Responsabilidades:**
- 👁️ **Percepción Sensorial** (`perceiveEnvironment`)
  - Visión: Detectar comida y bloques cercanos
  - Propiocepción: Conocimiento del propio cuerpo
  - Interocepción: Sensaciones internas (hambre, fatiga)

- 🧬 **Estado Mental**
  - Atención, enfoque, urgencia
  - Estrés y motivación
  - Confianza en decisiones

- 🔬 **Sistema Neuroendocrino**
  - Adrenalina (respuesta al peligro)
  - Dopamina (placer/recompensa)
  - Cortisol (estrés)
  - Serotonina (bienestar)
  - Grelina (hambre)

- 🎯 **Predicción Mental** (`predictOutcome`)
  - Simula mentalmente qué pasa con cada acción
  - Evalúa riesgos y beneficios
  - Predice próximos estados

- ❤️ **Procesamiento Emocional** (`processEmotions`)
  - Actualiza estado mental según circunstancias
  - Ajusta hormones
  - Determina urgencia de acciones

- 🤔 **Toma de Decisión** (`makeDecision`)
  - Usa toda la información disponible
  - Integra emociones y lógica
  - Retorna acción elegida con razonamiento

### 2. **Learning (Aprendizaje) - `LearningSystem.js`**

El sistema de memoria y optimización del agente.

**Responsabilidades:**
- 🎓 **Q-Learning Estándar**
  - Tabla Q: Mapeo estado → acción → valor
  - Fórmula: Q(s,a) = Q(s,a) + α[r + γ max(Q(s',a')) - Q(s,a)]
  - Parámetros configurables

- 📍 **Gestión de Estados**
  - Discretización del espacio de estados
  - Descripción en texto: `"left_near_high_ground"`
  - Seguimiento de estados visitados

- 📚 **Experiencias y Patrones**
  - Buffer de experiencias recientes
  - Identificación de patrones aprendidos
  - Historial de acciones por estado

- 📊 **Estadísticas de Aprendizaje**
  - Total de experiencias
  - Recompensa total acumulada
  - Convergencia de la tabla Q
  - Epsilon (factor de exploración)

- 🎯 **Selección de Acciones**
  - Epsilon-greedy: Balance exploración/explotación
  - Exploración inicial: 40%
  - Decay gradual: 0.9998 por frame
  - Mínimo: 5%

### 3. **Physics (Física) - `PhysicsEngine.js`**

Motor de física realista con variables biomecánicas.

**Responsabilidades:**
- ⚙️ **Física Básica**
  - Gravedad: 0.6 m/s²
  - Velocidades máximas
  - Fricción (aire y suelo)
  - Aceleración y desaceleración

- 💪 **Biomecánica**
  - Fatiga muscular (0-1)
  - Ácido láctico
  - Deuda de oxígeno
  - Temperatura muscular
  - Flexibilidad de articulaciones

- 🔥 **Metabolismo**
  - Tasa metabólica basal: 1.2
  - Multiplicador de movimiento: 2.5x
  - Multiplicador de salto: 15x
  - Recuperación de fatiga: 98% por frame

- 💥 **Colisiones**
  - AABB (Axis-Aligned Bounding Box)
  - Resolución de colisiones desde 4 direcciones
  - Elasticidad (restitución)
  - Límites del mundo

- ⚡ **Cálculo de Energía**
  - Consumo metabólico total
  - Impacto de fatiga muscular
  - Recuperación automática

### 4. **Core (Entidades) - `Entities.js`**

Clases principales de objetos en el simulador.

**Agent**
- Integra todos los sistemas
- Ciclo principal: Percepción → Pensamiento → Acción → Física
- Actualización 60 veces por segundo
- Dibuja expresión facial según emociones

**Food (Comida)**
- Objeto recolectable
- Efecto visual de pulso
- Genera +35 energía al ser consumida
- Recompensa de +50 en Q-Learning

**Block (Bloque)**
- Obstáculo físico
- Colisiones realistas
- Detalles visuales estilo ladrillo

## 🔄 Flujo de Ejecución por Frame

```
1. PERCEPCIÓN
   ├─ Brain.perceiveEnvironment()
   └─ Actualizar sensores

2. DECISIÓN
   ├─ Learning.getState() → descripción del mundo
   ├─ Learning.getQValues() → valores aprendidos
   ├─ Brain.makeDecision() → toma inteligente
   └─ Retorna acción elegida

3. APRENDIZAJE (paso anterior)
   ├─ Calcular recompensa
   └─ Learning.recordExperience() → actualiza tabla Q

4. ACCIÓN
   └─ Agent.executeAction() → movimiento/salto

5. FÍSICA
   ├─ Physics.applyGravity()
   ├─ Physics.applyFriction()
   ├─ Physics.updatePosition()
   ├─ Physics.applyWorldBoundaries()
   └─ Physics.resolveBlockCollisions()

6. COLISIONES CON COMIDA
   └─ Agent.checkFoodCollisions() → recompensa grande

7. CONSUMO DE ENERGÍA
   └─ Physics.calculateMetabolicCost()

8. EMOCIONES
   └─ Agent.updateMood() → ajusta expresión facial

9. OPTIMIZACIÓN DEL APRENDIZAJE
   └─ Learning.updateEpsilon() → menos exploración

10. RENDERIZADO
    ├─ Dibujar mundo
    ├─ Dibujar comida
    ├─ Dibujar bloques
    ├─ Dibujar agente
    └─ Actualizar UI
```

## 🎓 Variables de Aprendizaje

### Estados Posibles
```
formato: "foodDirection_foodDistance_energyLevel_groundPos"

Ejemplos:
- "left_far_high_ground"   → Comida a la izquierda, lejos, energía alta, en suelo
- "right_near_low_air"     → Comida a la derecha, cerca, energía baja, en aire
- "none_far_medium_ground" → Sin comida visible, energía media, en suelo
```

### Acciones
- `left`: Moverse izquierda
- `right`: Moverse derecha
- `jump`: Saltar (si está en suelo)
- `idle`: Quedarse quieto

### Recompensas
- **Comer comida**: +50 (más bonus si energía baja)
- **Movimiento eficiente**: -0.05 (penalización pasiva)
- **Energía baja**: -0.1 (incentiva buscar comida)
- **Salto en aire**: -1 (intento fallido)
- **Castigo por saltar**: -2 a -3 (configurable)

## 🧪 Variables Realistas Agregadas

### Biomecánicas
- Fatiga muscular: Afecta altura del salto
- Ácido láctico: Limita movimiento sostenido
- Deuda de oxígeno: Recuperación gradual
- Temperatura: Sube con esfuerzo, baja en reposo
- Flexibilidad: Rango de movimiento

### Hormonales
- **Adrenalina**: ↑ con estrés, activa urgencia
- **Dopamina**: ↑ con recompensas, motiva acción
- **Cortisol**: ↑ con estrés, afecta decisiones
- **Grelina**: ↑ con hambre, impulsa buscar comida
- **Serotonina**: ↑ con satisfacción, define bienestar

### Metabolismo
- Consumo basal: 1.2 energía/frame
- Movimiento: 2.5x multiplicador
- Salto: 15x multiplicador
- Fatiga: Aumenta consumo hasta 50%

## 🎯 Proceso de Aprendizaje

1. **Exploración Inicial (Epsilon = 40%)**
   - Agente prueba acciones aleatoriamente
   - Construye tabla Q inicial
   - Descubre efectos de cada acción

2. **Primeras Recompensas**
   - Al encontrar comida: recompensa alta
   - Q-values suben para "ir hacia comida"
   - Comienza a formar patrones

3. **Explotación Gradual**
   - Epsilon decae lentamente (0.9998x/frame)
   - Usa valores Q más confiables
   - Comportamiento se vuelve más dirigido

4. **Convergencia**
   - Tabla Q se estabiliza
   - Comportamiento predecible y eficiente
   - Busca comida deliberadamente

## 🛠️ Cómo Usar los Módulos

### En el HTML
```html
<!-- Importar módulos en orden -->
<script src="js/brain/CognitiveSystem.js"></script>
<script src="js/learning/LearningSystem.js"></script>
<script src="js/physics/PhysicsEngine.js"></script>
<script src="js/core/Entities.js"></script>
```

### Crear un Agente
```javascript
const agent = new Agent(canvas);

// Sistema cognitivo (inteligencia)
agent.brain.perceiveEnvironment(foods, blocks);
const decision = agent.brain.makeDecision(...);

// Sistema de aprendizaje
const state = agent.learning.getState(agent, foods, blocks);
agent.learning.recordExperience(state, action, reward, nextState);

// Motor físico
agent.physics.applyGravity(agent);
agent.physics.resolveBlockCollisions(agent, blocks);
```

### Acceder a Estadísticas
```javascript
// Cognitivas
const mentalStatus = agent.brain.getMentalStatus();
// {attention, stress, motivation, dopamine, ...}

// De Aprendizaje
const learningStats = agent.learning.getLearningStats();
// {epsilon, statesDiscovered, convergence, ...}

// Físicas
const biomechanics = agent.physics.getBiomechanicStatus();
// {muscularFatigue, lactateLevel, temperature, ...}
```

## 📈 Observables de Aprendizaje

Para ver cómo aprende el agente, observa:
1. **Experiencia**: Sube constantemente en el UI
2. **Comida Consumida**: Aumenta conforme aprende
3. **Saltos Fallidos**: Disminuye cuando aprende a no saltar en aire
4. **Expresión Facial**: Cambia según frustración
5. **Movimiento**: Más dirigido hacia la comida

---

**Diseño modular** para fácil experimentación y extensión. ¡Cada módulo es independiente pero integrado!
