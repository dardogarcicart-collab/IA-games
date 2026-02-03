# ⚡ GUÍA RÁPIDA - 5 MINUTOS

## 🚀 EMPEZAR AHORA

```bash
cd /workspaces/IA-games
python3 -m http.server 8000
# → Abre http://localhost:8000/IASistem.html
```

## 🎮 PRIMEROS PASOS

1. **Abre el simulador** - Ya debería estar cargado
2. **Haz click izquierdo** - Crea una manzana
3. **Espera 30 segundos** - La IA aprenderá a buscarla
4. **Observa el Debug** - Ve qué está pensando
5. **Cambia objetivo** - Elige otro para verlo readaptarse

## 📊 QUÉ SIGNIFICAN LOS NÚMEROS

| Stat | Significado |
|------|-------------|
| **Comida** | Cuántas veces comió |
| **Leche** | Cuántas veces bebió |
| **Banderas** | Objetivos completados |
| **Saltos** | Total de saltos realizados |
| **Experiencia** | Decisiones de IA × 1 |
| **Aprendizaje 65%** | IA confía 65% en lo aprendido |

## 🎯 OBJETIVOS RÁPIDOS

```
🍎 COMIDA      → Crea 3 comidas, deja 2 minutos
🥛 LECHE       → Crea leche en lugar visible
🚩 BANDERA     → Mapas → Laberinto
🚫 NO SALTAR   → Activa "Castigo", observa Costo Salto
```

## 🛠️ CREAR ITEMS

**Modo activo** se ve en consola (F12):
```javascript
// Click izquierdo → Comida
// Rueda del ratón → Cambiar tipo
// Botones → Seleccionar rápido
```

### Tipos:
- 🍎 Comida
- 🥛 Leche
- ⚠️ Pincho (¡peligro!)
- 🧱 Bloque (obstáculo)
- 🚩 Bandera (objetivo)

## 📈 SEÑALES DE ÉXITO

✅ **Después de 1 minuto:**
- Deja de saltar tan frecuentemente
- Busca deliberadamente

✅ **Después de 3 minutos:**
- Comportamiento claramente optimizado
- Evita peligros con propósito
- Reduce saltos si es caro

✅ **Después de 5 minutos:**
- Aparentemente "experto"
- Navega eficientemente
- Minimiza acciones innecesarias

## 🔴 PROBLEMAS RÁPIDOS

| Problema | Solución |
|----------|----------|
| No hace nada | Crea items con click |
| Spam infinito | Espera 30 segundos |
| Muy lento | Baja items en mapa |
| No aprende | Usa mapa Simple primero |

## 💡 3 EXPERIMENTOS FÁCILES

### #1: El Salto Caro (3 min)
```
1. Activa "Castigo por Saltar"
2. Crea 3 comidas en línea horizontal
3. Observa: Al inicio salta mucho
4. Resultado: Aprende a no saltar
5. Métrica: "Costo Salto" sube en Debug
```

### #2: Cambio de Objetivo (2 min)
```
1. Objetivo = Comida (1 min)
2. Objetivo = Leche (cambio instantáneo)
3. La IA adapta comportamiento inmediatamente
4. Prueba con Bandera después
5. Observa inteligencia adaptativa
```

### #3: Evitar Pinchos (2 min)
```
1. Mapas → Obstáculos (hay pincho!)
2. Crea comida alrededor del pincho
3. La IA NUNCA atraviesa el pincho
4. Aprenderá a rodear o saltar
5. Es verdadero aprendizaje, no código
```

## 🎓 LO IMPORTANTE

```javascript
// La IA hace esto CADA FRAME:

1. PERCIBIR
   ↓ "Veo comida a 50 píxeles a la derecha"

2. PENSAR
   ↓ "¿Qué hago? Derecha tiene 3.2 valor"

3. ACTUAR
   ↓ "Voy a la derecha"

4. APRENDER
   ↓ "Si fue bueno, lo recordaré"

// Después de 1000 frames → INTELIGENCIA
```

## 📚 ARCHIVOS IMPORTANTES

```
IASistem.html          ← Abre esto
js/brain/              ← Percepción y decisión
js/learning/           ← Q-Learning
js/physics/            ← Movimiento y colisiones
js/core/               ← Entidades (Agente, Comida, etc)
README.md              ← Documentación completa
FEATURES.md            ← Todas las características
```

## ⚙️ PARÁMETROS TÉCNICOS

```javascript
// Puedes cambiar en el código:

// En LearningSystem.js:
this.learningRate = 0.2;      // Qué tan rápido aprende
this.discountFactor = 0.95;   // Importancia del futuro
this.epsilon = 0.5;           // Exploración inicial

// En PhysicsEngine.js:
this.jumpCost = 3;            // Costo energético del salto
this.gravity = 0.6;           // Fuerza de gravedad

// En CognitiveSystem.js:
this.actionCooldown = 3;      // Frames entre acciones
```

## 🎯 META FINAL

Después de 5-10 minutos deberías ver:
- ✅ IA que se mueve naturalmente
- ✅ Toma decisiones deliberadas
- ✅ Evita peligros
- ✅ Busca objetivos
- ✅ Adapta si cambias el objetivo
- ✅ Aprende si cambian los costos

**= IA VERDADERA FUNCIONANDO**

---

## ❓ QUICK FAQ

**P: ¿Es real el aprendizaje?**
R: 100%. Usa Q-Learning real, algoritmo estándar.

**P: ¿Puedo ver la tabla Q?**
R: Sí, está en `agent.learning.qTable`
Abre consola (F12) e inspecciona.

**P: ¿Por qué a veces hace cosas malas?**
R: Exploración. Epsilon > 0 = sigue probando.

**P: ¿Cuál es el máximo aprendizaje?**
R: ~100%. Epsilon llega a 0.05 mínimo.

**P: ¿Se guarda el aprendizaje?**
R: No. Reset = borra Q-Table. Puedes agregar localStorage.

---

**¡Diviértete observando inteligencia artificial real!** 🤖
