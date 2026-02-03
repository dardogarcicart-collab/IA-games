# 🤖 Simulador de Vida Artificial con IA

Un simulador interactivo donde una IA aprende mediante **Q-Learning** en tiempo real. El agente comienza sin saber nada y gradualmente descubre qué acciones son beneficiosas.

## ✨ Características Principales

### 🧠 Inteligencia Artificial Modular

El agente tiene **3 sistemas integrados** que funcionan conjuntamente:

1. **Brain (Cognitivo)** - `js/brain/CognitiveSystem.js`
   - Percepción del mundo (visión, propiocepción, interocepción)
   - Procesamiento de emociones y hormonas
   - Predicción mental de acciones
   - Toma de decisiones inteligente

2. **Learning (Aprendizaje)** - `js/learning/LearningSystem.js`
   - Q-Learning con tabla Q dinámica
   - Descubrimiento de estados
   - Experiencias y patrones aprendidos
   - Epsilon-greedy para exploración/explotación

3. **Physics (Física)** - `js/physics/PhysicsEngine.js`
   - Motor físico realista con gravedad
   - Biomecánica: fatiga muscular, ácido láctico, oxígeno
   - Sistema metabólico con consumo de energía
   - Colisiones precisas (AABB)

### 🎓 Aprendizaje Real

- ✅ Comienza **completamente ignorante** (movimiento aleatorio)
- ✅ Aprende mediante **recompensas** al encontrar comida
- ✅ Descubre que ciertos patrones funcionan mejor
- ✅ Gradualmente **optimiza su comportamiento**
- ✅ Tabla Q converge hacia política óptima

### 😊 Estados Emocionales Dinámicos

- **😐 Neutral**: Estado base, relajado
- **😠 Enojado**: Frustrado por fallos repetidos o baja energía
- **😴 Cansado**: Energía crítica, necesita comida urgentemente

### 🎮 Interactividad Studio Real

- **Click Izquierdo**: Crear comida (manzanas rojas)
- **Click Derecho**: Colocar bloques (obstáculos)
- **Color Customizable**: Elige el color del agente
- **Toggle Castigo**: Activa/desactiva penalización por saltar
- **Reset**: Reinicia la simulación

### 📊 Estadísticas en Tiempo Real

- Energía con barra de color (verde/naranja/rojo)
- Estado emocional visible
- Comida consumida
- Saltos realizados
- Experiencias aprendidas

## 🚀 Cómo Usar

### 1. Abrir el simulador
```bash
# Navegar a la carpeta
cd /workspaces/IA-games

# Opción 1: Abrir IASistem.html directamente en navegador
# Opción 2: Usar servidor web
python3 -m http.server 8000
# Luego: http://localhost:8000/IASistem.html
```

### 2. Experimentar

**Observa cómo aprende:**
1. Al inicio, el agente se mueve aleatoriamente
2. Crea comida haciendo click izquierdo
3. Verás que eventualmente busca la comida
4. Después de varias recompensas, aprende el patrón

**Prueba variables:**
- Desactiva "Castigo por Saltar" y observa más saltos
- Actívalo de nuevo para ver cómo aprende a evitar saltos innecesarios
- Crea obstáculos y observa cómo se adapta

## 📁 Estructura del Proyecto

```
IA-games/
├── IASistem.html              # Archivo principal (HTML + UI)
├── ARQUITECTURA.md            # Documentación técnica detallada
├── README.md                  # Este archivo
└── js/
    ├── brain/
    │   └── CognitiveSystem.js # Inteligencia y toma de decisiones
    ├── learning/
    │   └── LearningSystem.js  # Q-Learning y memoria
    ├── physics/
    │   └── PhysicsEngine.js   # Física y biomecánica
    └── core/
        └── Entities.js        # Clases: Agent, Food, Block
```

## 🔬 Variables Realistas Incluidas

### Biomecánicas
- Fatiga muscular (afecta altura de saltos)
- Ácido láctico (acumula con movimiento intenso)
- Deuda de oxígeno (recuperación gradual)
- Temperatura muscular (sube con esfuerzo)
- Flexibilidad de articulaciones

### Sistema Hormonal
- **Adrenalina**: Responde a peligro/urgencia
- **Dopamina**: Motivación y placer por recompensas
- **Cortisol**: Estrés y ajustes de comportamiento
- **Grelina**: Hambre e impulso de comer
- **Serotonina**: Bienestar general

### Metabolismo
- Tasa basal: 1.2 energía/frame
- Movimiento: 2.5x multiplicador
- Salto: 15x multiplicador
- Fatiga aumenta consumo hasta 50%

## 🧠 Cómo Funciona el Q-Learning

### Fórmula Estándar
```
Q(s,a) = Q(s,a) + α[r + γ max(Q(s',a')) - Q(s,a)]
```

Donde:
- `s` = estado actual
- `a` = acción
- `r` = recompensa
- `γ` = factor de descuento (0.95)
- `α` = velocidad de aprendizaje (0.15)

### Parámetros
- **Exploración inicial**: 40%
- **Decay de epsilon**: 0.9998 por frame
- **Mínimo de exploración**: 5%

### Proceso

1. **Percepción**: Crea estado discreto (ej: `"left_near_high_ground"`)
2. **Decisión**: Elige acción (greedy o aleatoria)
3. **Recompensa**: Calcula r según resultado
4. **Actualización**: Ajusta Q-value de esa acción
5. **Repetición**: Convergencia gradual a política óptima

## 📈 Observables de Aprendizaje

Mira estos indicadores para ver el progreso:

1. **Experiencia (Contador)**: Sube constantemente = aprendiendo
2. **Comida Consumida**: Aumenta = mejora su búsqueda
3. **Energía**: Se mantiene estable = decisiones eficientes
4. **Expresión Facial**: Menos enojado = menos frustración
5. **Movimiento**: Más dirigido hacia comida = aprendizaje convergido

## 🎯 Recompensas

| Evento | Recompensa |
|--------|-----------|
| Comer comida | +50 (+bonus si energía baja) |
| Sobrevivir | -0.05 (penalización pasiva) |
| Energía baja | -0.10 (incentiva buscar comida) |
| Salto fallido | -1 (castigo por error) |
| Saltar (si castigo activo) | -2 a -3 |

## 💡 Consejos de Uso

### Para Ver Aprendizaje Rápido
1. Crea muchas manzanas (click izquierdo)
2. Colócalas en lugares variados
3. Observa cómo el patrón de búsqueda mejora
4. Nota cómo baja la exploración aleatoria

### Para Estudiar Comportamiento
1. Desactiva castigo por saltar
2. Crea obstáculos que requieren saltos
3. Observa cómo aprende a saltarlos estratégicamente
4. Vuelve a activar castigo y ve cómo cambia

### Para Entrenar Larga Sesión
1. Crea 5-10 manzanas
2. Deja que corra 5-10 minutos
3. Observa convergencia de tabla Q
4. Reset y repite con diferentes configuraciones

## 🔧 Personalización

Puedes editar los parámetros en cada módulo:

**En `js/learning/LearningSystem.js`:**
```javascript
this.learningRate = 0.15;       // Qué tan rápido aprende
this.discountFactor = 0.95;     // Importancia del futuro
this.epsilon = 0.4;              // Exploración inicial
this.epsilonDecay = 0.9998;     // Velocidad de aprendizaje
```

**En `js/physics/PhysicsEngine.js`:**
```javascript
this.gravity = 0.6;              // Intensidad de gravedad
this.jumpPower = -12;            // Fuerza de salto
this.metabolism.basalMetabolicRate = 1.2;  // Consumo en reposo
```

**En `js/brain/CognitiveSystem.js`:**
```javascript
// Ajustar umbrales de decisión
// Modificar pesos de sensores
// Cambiar criterios emocionales
```

## 📚 Para Entender Mejor

Revisa `ARQUITECTURA.md` para:
- Documentación técnica completa
- Flujo de ejecución por frame
- Variables disponibles
- API de cada módulo
- Ejemplos de uso avanzado

## 🎨 Visualización

**Elementos visuales:**
- 🟥 Agente (cuadrado coloreable)
- 🍎 Comida (manzana roja pulsante)
- 🧱 Bloques (ladrillos marrones)
- 🟩 Suelo con césped decorativo
- 🌤️ Cielo con gradiente azul

**Expresiones faciales:**
- Ojos y boca que cambian según estado emocional
- Parpadeo de estrés cuando energía muy baja
- Animaciones suaves

## 🐛 Troubleshooting

**Si no aparece nada:**
- Verifica que los archivos JS estén en `js/brain/`, `js/learning/`, etc.
- Abre consola (F12) para ver errores
- Recarga la página

**Si el agente no se mueve:**
- Crea comida (click izquierdo)
- Espera un momento (necesita explorar primero)
- Verifica que no haya errores en consola

**Si está muy lento:**
- Son demasiados bloques y comida
- Haz reset y comienza con menos objetos
- La física y IA corren en el mismo thread

## 📝 Licencia

Código libre para experimentar y aprender sobre IA.

## 🚀 Mejoras Futuras Posibles

- [ ] Visualización de tabla Q en tiempo real
- [ ] Gráficas de convergencia
- [ ] Guardado/carga de tabla Q entrenada
- [ ] Múltiples agentes aprendiendo simultáneamente
- [ ] Entorno más complejo con más tipos de objetos
- [ ] Red neuronal en lugar de Q-Learning discreto
- [ ] Exportación de datos de entrenamiento

---

**¡Diviértete observando cómo una IA aprende desde cero!** 🤖✨
