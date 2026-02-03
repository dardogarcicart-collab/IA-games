# 🧪 GUÍA DE EXPERIMENTOS - Comprueba el Aprendizaje

## Antes de Empezar

**Importante:** Estos experimentos funcionan MEJOR si:
- ✅ Seleccionas **1 agente** (más claro)
- ✅ Objetivo: **🍎 Buscar Comida**
- ✅ Activaste: **Castigo por Saltar** (on)
- ✅ Mapa: **Vacío** (sin obstáculos)

---

## 🧪 EXPERIMENTO 1: Exploración → Explotación (10 minutos)

### Objetivo
Ver cómo el agente cambia de movimiento 100% aleatorio a dirigido.

### Paso 1: Observa Caos Puro (0-20 segundos)

```
1. Abre IASistem.html
2. Deja el agente solo por 20 segundos
3. NO coloques comida aún
4. Observa:

✓ Agente salta sin razón
✓ Cambia dirección constantemente  
✓ Parece "loco" o "nervioso"
✓ NO hay patrón en sus movimientos
✓ Estadísticas:
  - Experiencia: 0-20
  - Comida: 0 (no hay comida)
  - Saltos: muchos
```

**Qué está pasando:** El agente explora el espacio de acciones aleatoriamente.

---

### Paso 2: Introduce Comida (20-50 segundos)

```
5. Coloca 1 comida a la DERECHA del agente
   (aproximadamente x=700, agente está en x=400)

6. Espera 3 segundos sin hacer nada
   Observa: Toca la comida por pura suerte

7. Coloca 3 COMIDAS MÁS a la DERECHA
   (en diferentes alturas)

8. Espera 30 segundos
```

**Observa estos cambios:**

| Tiempo | Comportamiento | Experiencia | Comida |
|--------|---|---|---|
| Seg 0-10 | Todavía muy random | 10-20 | 1-3 |
| Seg 10-20 | Empieza a favorecer derecha | 20-40 | 3-6 |
| Seg 20-30 | Claro sesgo a derecha | 40-60 | 6-12 |

**Qué esperar:**

```
Visualmente:
  ├─ Primeros 5 segundos: Sigue siendo aleatorio
  ├─ Segundos 5-15: ~60% a derecha, 40% aleatorio
  ├─ Segundos 15-30: ~80% a derecha, 20% aleatorio
  └─ Resultado: Va PRINCIPALMENTE a derecha

Panel derecho (Estadísticas):
  ├─ Experiencia sube suavemente: 0 → 60
  ├─ Comida sube más rápido a partir de seg 10
  └─ Aprendizaje: ~0.5 experiencias/frame
```

**✅ Si ves esto: ESTÁ APRENDIENDO**

---

### Paso 3: Cambio Abrupto (50-70 segundos)

```
9. Borra TODAS las comidas
   (Botón 🗑️ Limpiar en "Crear Items")

10. Coloca 4 comidas a la IZQUIERDA
    (opuesto de donde estaban)

11. Espera 20 segundos
```

**Observa la ADAPTACIÓN:**

| Tiempo | Comportamiento | Nota |
|--------|---|---|
| Seg 0-2 | Sigue yendo a derecha (viejo patrón) | Inercia |
| Seg 2-7 | Nota que no hay recompensa a derecha | Confusión |
| Seg 7-15 | Empieza a explorar izquierda | Transición |
| Seg 15-20 | Busca principalmente a izquierda | Nuevo patrón |

**Qué está pasando internamente:**

```
Tabla Q ANTES:
  Q[comida_derecha][ir_derecha] = +50 (alto)
  Q[comida_derecha][ir_izquierda] = -10 (bajo)

Tabla Q DESPUÉS (seg 7-15):
  Q[comida_izquierda][ir_izquierda] = +50 (nuevo)
  Q[comida_izquierda][ir_derecha] = -10 (nuevo)
  
Comportamiento: El agente se ADAPTA
Marca de aprendizaje: Esto demuestra que está REALMENTE aprendiendo
```

**✅ CONFIRMADO: El agente aprendió y se adaptó**

---

## 🧪 EXPERIMENTO 2: Medición Cuantitativa (10 minutos)

### Objetivo
Medir el aprendizaje con números.

### Preparación

```
1. Abre simulador con 1 agente
2. Objetivo: Comida
3. Coloca 15 comidas distribuidas a la DERECHA
4. Inicia cronómetro (teléfono o reloj)
```

### Recopila Datos Cada 30 Segundos

Captura esta información:

```
TIEMPO: 0:00 (inicio)
├─ Experiencia: ___
├─ Comida: ___
├─ Saltos: ___
└─ Observación: _________________________________

TIEMPO: 0:30
├─ Experiencia: ___
├─ Comida: ___
├─ Saltos: ___
└─ Observación: _________________________________

TIEMPO: 1:00
├─ Experiencia: ___
├─ Comida: ___
├─ Saltos: ___
└─ Observación: _________________________________

TIEMPO: 1:30
├─ Experiencia: ___
├─ Comida: ___
├─ Saltos: ___
└─ Observación: _________________________________

TIEMPO: 2:00
├─ Experiencia: ___
├─ Comida: ___
├─ Saltos: ___
└─ Observación: _________________________________
```

### Analiza los Datos

**Experiencia (debe subir exponencial):**

```
Esperado:
  0:00 → 0-10
  0:30 → 20-40
  1:00 → 50-100
  1:30 → 100-200
  2:00 → 200-350

✓ Si sube así: Aprendizaje normal
✗ Si sube poco: Problema (revisar comida)
✗ Si no sube: Bug serio
```

**Comida (debe acelerar después de 0:30):**

```
Esperado:
  0:00 → 0-2
  0:30 → 2-8
  1:00 → 8-20
  1:30 → 20-40
  2:00 → 40-80

✓ Si acelera: Aprendizaje funciona
✗ Si lineal: Podría ser mejor
✗ Si 0: Problema con comida/recompensas
```

**Saltos (debe bajar si penalización activa):**

```
Esperado:
  0:00 → 4-5 por segundo
  0:30 → 3-4 por segundo
  1:00 → 2-3 por segundo
  1:30 → 1-2 por segundo
  2:00 → 1-2 por segundo

✓ Si baja así: Aprende que saltar cuesta
✗ Si no baja: Penalización podría no funcionar
```

---

## 🧪 EXPERIMENTO 3: Cambio de Objetivo (8 minutos)

### Objetivo
Ver que el agente puede aprender diferentes objetivos.

### Paso 1: Aprender Comida (3 minutos)

```
1. Selecciona objetivo: "🍎 Buscar Comida"
2. Coloca 10 comidas dispersas
3. Espera 3 minutos (hasta que suba Experiencia a 150+)
4. Observa: Va principalmente hacia comida
5. Nota comida comida lograda (ej: 20)
```

### Paso 2: Cambiar a Leche (3 minutos)

```
6. Selecciona objetivo: "🥛 Beber Leche"
   NOTA: Esto reinicia el epsilon a 0.3
   
7. Borra comida, coloca 10 LECHE (en otros lugares)
8. Espera 2-3 minutos
9. Observa: Agente empieza a buscar leche
10. Ignora comida (aunque la vea)
```

**Qué demuestra:**

```
✅ El agente puede aprender múltiples objetivos
✅ Cambia su estrategia según el objetivo
✅ Esto prueba que Q-tabla es multiobjetivo
✅ Demuestra FLEXIBILIDAD del sistema
```

---

## 🧪 EXPERIMENTO 4: Efecto de Castigo por Saltar (5 minutos)

### Objetivo
Ver cómo un parámetro cambia el comportamiento.

### Paso 1: CON Castigo (2.5 minutos)

```
1. Verificar: "Castigo por Saltar" = ON
2. Coloca comida a la DERECHA
3. Observa saltos en primeros 30 segundos: ~4/seg
4. Observa saltos después de 2 minutos: ~1/seg
5. Nota: Va a comida pero salta menos
```

### Paso 2: SIN Castigo (2.5 minutos)

```
6. Desactiva: "Castigo por Saltar" = OFF
7. Click en "🔄 Reset Completo"
8. Coloca comida a la DERECHA (mismo lugar)
9. Observa saltos en primeros 30 segundos: ~4/seg
10. Observa saltos después de 2 minutos: ~3-4/seg
11. Nota: Va a comida Y salta más (porque no le cuesta)
```

**Comparación:**

| Parámetro | CON Castigo | SIN Castigo |
|-----------|---|---|
| Saltos inicio | 4/seg | 4/seg |
| Saltos min 2 | 1/seg | 3/seg |
| Comida lograda | 25 | 30 |
| Energía final | Mayor | Menor |
| Estrategia | Prudente | Arriesgada |

**✅ Si ves estas diferencias: Reward shaping funciona**

---

## 🧪 EXPERIMENTO 5: Múltiples Agentes (5 minutos)

### Objetivo
Ver que cada agente aprende diferente.

### Paso a Paso

```
1. Selecciona: "3 Agentes (Trío)"
   └─ Verás 3 colores: Rojo, Turquesa, Amarillo

2. Objetivo: "🍎 Buscar Comida"

3. Coloca comida en 3 lugares DIFERENTES:
   ├─ ARRIBA a la derecha
   ├─ ABAJO al centro
   └─ ARRIBA a la izquierda

4. Espera 2 minutos

5. Observa:
   ├─ Agente ROJO → tiende a zona arriba-derecha
   ├─ Agente TURQUESA → tiende a zona abajo-centro
   ├─ Agente AMARILLO → tiende a zona arriba-izquierda
   └─ SIN COMUNICARSE, cada uno aprendió zona diferente
```

**Click en cada agente para ver stats:**

```
Panel lateral → Botones de agentes

AGENTE 1 (Rojo):
  └─ Comida: 12
  └─ Experiencia: 180
  └─ Visión: "Comida derecha-arriba"

AGENTE 2 (Turquesa):
  └─ Comida: 15
  └─ Experiencia: 200
  └─ Visión: "Comida abajo"

AGENTE 3 (Amarillo):
  └─ Comida: 10
  └─ Experiencia: 160
  └─ Visión: "Comida izquierda-arriba"
```

**✅ Demuestra EMERGENCIA comportamental**

---

## 📊 TEMPLATE: Documenta tus Resultados

```markdown
## Mi Experimento de Aprendizaje

**Fecha:** [FECHA]
**Agentes:** [1 / 3 / 5]
**Objetivo:** [Comida / Leche / Bandera]
**Duración:** [X minutos]

### Observaciones Iniciales (0-1 min)
- [Nota aquí qué viste]
- [Comportamiento aleatorio?]
- [Saltos sin patrón?]

### Observaciones Intermedias (1-3 min)
- [Cambios de patrón?]
- [Dirección preferida?]
- [Exponencial o lineal?]

### Observaciones Finales (3+ min)
- [Comportamiento convergido?]
- [Consistencia?]
- [Adaptación rápida?]

### Métricas
- Experiencia: [valor inicial] → [valor final]
- Comida: [valor inicial] → [valor final]
- Saltos: [valor inicial] → [valor final]

### Conclusión
✅ APRENDIZAJE CONFIRMADO
✗ No visto claramente
❓ Necesita más investigación

### Cambios Recomendados
- [Si necesita mejora]
```

---

## 🎯 QUICK EXPERIMENT (3 minutos)

Si solo tienes 3 minutos:

```
1. Abre simulador → 1 agente
2. Coloca 5 comidas a la DERECHA
3. Espera 1 minuto
4. ESPERA: Agente prefiere derecha
5. Mueve todas a la IZQUIERDA
6. Espera 30 segundos
7. VERIFICA: Agente cambió a izquierda

Si ves paso 4 Y 7: APRENDIZAJE CONFIRMADO ✅
```

---

## ⚠️ TROUBLESHOOTING

### "El agente no va a la comida"

```
Verificar:
□ ¿Hay comida en el mapa?
□ ¿Objetivo es "Comida"?
□ ¿Experiencia sube (contador)?
□ ¿Comida cuenta sube (contador)?

Si SÍ a todo:
  ✅ Es normal, es Q-Learning, es subtil
  → Mira Experimento 1 (cambio dirección)

Si NO:
  ✗ Hay problema
  → Recarga página
  → Verifica consola (F12 - errores)
```

### "Los números no suben"

```
Verificar:
□ ¿El juego está corriendo? (agente se mueve)
□ ¿Hay comida colocada?
□ ¿Panel mostrando 0 todo el tiempo?

Soluciones:
1. Recarga página (Ctrl+R)
2. Coloca comida manualmente
3. Espera 1 minuto
4. Abre consola (F12)
   → Busca errores en rojo
   → Copia error y reporta
```

### "¿Es este el aprendizaje real?"

```
Respuesta: SÍ

Señales:
✅ Experiencia sube exponencial
✅ Comportamiento cambia con tiempo
✅ Adapta cuando cambias comida
✅ Estadísticas mejoran
✅ Menos random con tiempo

Esto ES Q-Learning real
No es simulado
No es truqueado
Es IA pura funcionando
```

---

## 📚 PARA PROFUNDIZAR

Si quieres entender mejor qué está pasando internamente:

1. **Lee:** [ENTENDER_APRENDIZAJE.md](ENTENDER_APRENDIZAJE.md)
2. **Lee:** [IMPLEMENTACION_COMPLETA.md](IMPLEMENTACION_COMPLETA.md)
3. **Abre consola:** F12 → Console
4. **Ejecuta:** `agents[0].learning.getStats()`
   - Verás Q-tabla interna
   - Verás número de estados
   - Verás estadísticas

---

## ✨ CONCLUSIÓN

Estos experimentos te demostrarán que:

✅ **El sistema está aprendiendo realmente**
✅ **Q-Learning funciona**
✅ **Es predecible pero no 100% determinista**
✅ **Cada agente aprende diferente**
✅ **Se adapta cuando cambias el ambiente**

**¡Ahora pruébalo! 🧪🚀**
