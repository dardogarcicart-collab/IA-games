# 🤖 IA Life Simulator - Múltiples Agentes

## ¿Qué es nuevo?

Esta es una **versión completamente mejorada** de tu simulador de IA que ahora soporta:

### 1. **👥 Múltiples Agentes (Amigos)**
Ahora puedes tener hasta **5 agentes trabajando simultáneamente**, cada uno:
- 🧠 Con su propia red neural (Q-Learning)
- 🎨 Con color único
- 📊 Con estadísticas independientes
- 🎯 Aprendiendo su propio objetivo

```
Panel lateral: "👥 Múltiples Agentes"
  ↓ Selecciona 1-5 agentes
  ↓ Observa cómo aprenden
  ↓ Click en cada uno para ver estadísticas
```

### 2. **🎨 Editor Visual de Mapas**
Debajo del canvas principal hay un **canvas de dibujo personalizado**:
- ✏️ Dibuja obstáculos con tu mouse
- 📥 Click "Cargar Mapa" para convertir a bloques
- 🗑️ Limpiar para comenzar de nuevo

```
[Juego Principal]
[Canvas de Dibujo] ← Dibuja aquí
[Botones] ✏️ Modo Dibujo | 📥 Cargar | 🗑️ Limpiar
```

### 3. **⚡ Menos "Caprichos"**
El aprendizaje es más estable:

| Parámetro | Antes | Ahora | Efecto |
|-----------|-------|-------|--------|
| Exploración inicial | 50% | 30% | Menos random |
| Velocidad decay | 0.9995 | 0.9998 | Más consistente |
| Explotación final | 95% | 98% | Aprendizaje puro |

**Resultado:** Los agentes actúan más deliberadamente, menos "caprichosos".

### 4. **🎮 Nuevos Items (3 Tipos)**

#### ⚡ PowerUp
- Color dorado giratorio
- Tipos: speed, shield, energy
- Se coloca con botón "⚡ PowerUp"

#### 🌀 Portal
- Color cyan pulsante
- Teleportador para agentes
- Se coloca con botón "🌀 Portal"

#### 🕳️ Trampa
- Oculta/roja al activarse
- Causa daño al agente
- Se coloca con botón "🕳️ Trampa"

**Total de items:** 8 tipos
```
Originales (5):    🍎 🥛 ⚠️ 🧱 🚩
Nuevos (3):        ⚡ 🌀 🕳️
```

## 🚀 Cómo Empezar

### Opción 1: Modo Amigos (2-3 agentes)
1. Abre `IASistem.html` en navegador
2. Selecciona "2 Agentes (Dupla)" en el panel lateral
3. Haz click en "Cargar Mapa" simple
4. Observa cómo aprenden juntos 👀

### Opción 2: Personalizar Mapa
1. Click "✏️ Modo Dibujo"
2. Dibuja obstáculos en el canvas inferior
3. Click "📥 Cargar Mapa"
4. Coloca items con rueda del mouse
5. ¡Observa a los agentes aprender!

### Opción 3: Probar Nuevos Items
1. Coloca varios **⚡ PowerUps** (dorados)
2. Coloca **🌀 Portales** (cyan)
3. Coloca **🕳️ Trampas** (marrones)
4. Observa cómo reaccionan los agentes

## 📋 Panel de Control

### 👥 Múltiples Agentes
```
Selector: 1-5 agentes
Botones: Click para ver stats de cada uno
Cada agente = Color diferente
```

### 🎨 Editor de Mapa
```
Canvas inferior: Área de dibujo
✏️ Dibuja tus niveles
📥 Carga el mapa dibujado
🗑️ Limpia el canvas
```

### 🛠️ Crear Items
```
🍎 Comida
🥛 Leche
⚠️ Pincho
🧱 Bloque
🚩 Bandera
⚡ PowerUp (NUEVO)
🌀 Portal (NUEVO)
🕳️ Trampa (NUEVO)
```

## 🧠 Características de IA

### Q-Learning
- **Matriz de estados:** ~100 estados discretos
- **Acciones:** 4 (izquierda, derecha, saltar, quieto)
- **Actualización:** Tiempo real, cada frame
- **Convergencia:** ~1-2 minutos

### Percepción Inteligente
```
El agente "ve":
├─ Dirección del objetivo (izq/der/buscando)
├─ Distancia (cerca/medio/lejos)
├─ Energía (baja/media/alta)
├─ Posición (suelo/aire)
└─ Peligro (seguro/peligro)

Total: ~100 estados únicos
```

### Aprendizaje Adaptativo
- Empieza explorando (30% random)
- Explota progresivamente lo aprendido
- Converge a estrategia óptima
- Diferente para cada agente/objetivo

## 🎯 Ejemplos de Uso

### Ejemplo 1: Equipo de 3 Agentes
```
1. Selecciona "3 Agentes (Trío)"
2. Objetivo: 🍎 Buscar Comida (default)
3. Coloca comida en diferentes lugares
4. Observa cómo se especializan
5. Panel muestra cada uno por separado
```

### Ejemplo 2: Mapa Personalizado
```
1. Click "✏️ Modo Dibujo"
2. Dibuja un laberinto en el canvas inferior
3. Click "📥 Cargar Mapa"
4. Agentes deben navegar obstáculos
5. ¡Aprenden a resolver el laberinto!
```

### Ejemplo 3: Evitar Trampas
```
1. Selecciona objetivo "🚫 No Saltar"
2. Coloca múltiples 🕳️ Trampas
3. Agentes aprenden a evitarlas
4. Castigo por saltar en zona de trampa
5. Comportamiento defensivo emerge
```

## 📊 Estadísticas

Cada agente muestra:
- **Estado:** 😊 Happy / 😐 Neutral / 😴 Tired / 💀 Dying
- **Energía:** Barra en tiempo real
- **Comidas:** Total recogido
- **Leche:** Total bebido
- **Banderas:** Total alcanzado
- **Saltos:** Total realizados
- **Experiencia:** Frames aprendidos
- **Aprendizaje:** % de explotación

## ⚙️ Configuración

En el panel "⚙️ Configuración":
- **Castigo por Saltar:** Toggle on/off
- **Reset Completo:** Reinicia todo

En JavaScript puedes modificar:
```javascript
// Agentes simultáneos (línea ~410)
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'];

// Parámetros Q-Learning (js/learning/LearningSystem.js)
this.epsilon = 0.3;        // Exploración inicial
this.epsilonDecay = 0.9998;  // Velocidad de decay
this.minEpsilon = 0.02;    // Mínimo (máximo aprendizaje)
```

## 🔧 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- ~2MB RAM
- Conexión local (no requiere internet)

## 📁 Estructura

```
IA-games/
├── IASistem.html              ← Archivo principal
├── js/
│   ├── brain/CognitiveSystem.js
│   ├── learning/LearningSystem.js
│   ├── physics/PhysicsEngine.js
│   └── core/Entities.js
├── README.md
├── CHANGELOG_MULTIPLES_AGENTES.md
└── [otros archivos de docs]
```

## 🎓 Conceptos de IA Implementados

### 1. **Q-Learning Tabular**
Aprende valor de cada acción en cada estado.
```
Q(s,a) = Q(s,a) + α[r + γ·max(Q(s',a')) - Q(s,a)]
```

### 2. **Epsilon-Greedy**
Balance entre exploración y explotación.
```
30% → 2%: Menos random con el tiempo
```

### 3. **State Discretization**
Convierte mundo continuo en ~100 estados discretos.

### 4. **Reward Shaping**
Recompensas estructuradas para guiar aprendizaje.
```
Objetivo: +50 a +400
Peligro: -20
Vivir: -0.03/frame
```

## 🐛 Troubleshooting

### "Los agentes no se mueven"
- Asegúrate que haya comida en el mapa
- Verifica que el objetivo esté seleccionado
- Recarga la página

### "El canvas de dibujo no funciona"
- Usa mouse (no trackpad)
- Dibuja con click + drag
- Verifica "✏️ Modo Dibujo" esté activo

### "Un agente va loco"
- Es normal durante primeros 30 segundos
- Está explorando estados
- Se estabiliza después

### "Las estadísticas están en 0"
- Click en el agente en el panel lateral
- Asegúrate que sea el agente activo
- Recarga si es necesario

## 💡 Consejos para Mejores Resultados

1. **Comienza simple:** 1 agente, objetivo comida
2. **Aumenta dificultad:** Agrega obstáculos
3. **Múltiples agentes:** Observa especialización
4. **Mapas personalizados:** Dibuja laberintos
5. **Nuevos items:** Mezcla PowerUps y Trampas

## 🎮 Modo de Juego: Ideas

### Desafío 1: Recolector (Food Chase)
```
- 1-5 agentes
- Objetivo: 🍎 Comida
- Obstáculos: Bloques
- Meta: Máxima comida en 2 minutos
```

### Desafío 2: Navegador (Maze Master)
```
- 1 agente
- Tu dibujo: Laberinto
- Objetivo: 🚩 Bandera
- Meta: Mínimo tiempo
```

### Desafío 3: Superviviente (Trap Dodger)
```
- 3 agentes
- Items: Muchas 🕳️ Trampas
- Objetivo: Máxima energía
- Meta: Sobrevivir 5 minutos
```

## 📞 Soporte

Si algo no funciona:
1. Abre consola (F12)
2. Busca mensajes de error
3. Recarga la página
4. Verifica estructura de archivos

## 🌟 Características Futuras

Próximas versiones podrían incluir:
- [ ] Múltiples Q-tables compartidas (comunicación)
- [ ] Guardar/cargar mapas personalizados
- [ ] Efectos reales de PowerUp
- [ ] Teletransporte funcional de Portales
- [ ] Historial de aprendizaje (gráficos)
- [ ] Modo competitivo (vs otros agentes)
- [ ] API para crear nuevos items

---

**¡Disfruta tu simulador de IA mejorado! 🤖👥🎮**

Versión: 2.0 (Múltiples Agentes)
Fecha: 2024
