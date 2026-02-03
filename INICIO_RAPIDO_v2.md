# 🎮 INICIO RÁPIDO - IA Life Simulator v2.0 Múltiples Agentes

## 🚀 EMPIEZA EN 30 SEGUNDOS

### Paso 1: Abre el archivo
```
Abre: IASistem.html
En tu navegador (Chrome, Firefox, Safari, Edge)
```

### Paso 2: Selecciona agentes
```
Panel derecho → "👥 Múltiples Agentes"
Elige "2 Agentes (Dupla)"
```

### Paso 3: ¡Observa!
```
Verás dos agentes (🔴 rojo y 🔷 turquesa) aprendiendo
Cada uno con color y estadísticas propias
```

---

## 🎨 PROBAR CANVAS DE DIBUJO

### Paso 1: Activar modo dibujo
```
Canvas inferior → "✏️ Modo Dibujo"
Botón se pone rojo (dibujando...)
```

### Paso 2: Dibujar
```
Con tu mouse:
- Click y arrastra en canvas inferior
- Dibuja líneas/formas
- Son azules
```

### Paso 3: Cargar mapa
```
Click "📥 Cargar Mapa"
Los dibujos se convierten en obstáculos
Agentes evitan los obstáculos
```

### Paso 4: Limpiar
```
Click "🗑️ Limpiar"
Canvas se borra
Dibuja otra vez
```

---

## ⚡ PROBAR NUEVOS ITEMS

### Opción A: PowerUp (⚡)
```
1. En "🛠️ Crear Items" → "⚡ PowerUp"
2. Click en canvas principal
3. Aparece círculo dorado giratorio
4. Agentes lo buscan
```

### Opción B: Portal (🌀)
```
1. En "🛠️ Crear Items" → "🌀 Portal"
2. Click en canvas
3. Aparece círculo cyan pulsante
4. Agentes son atraídos
```

### Opción C: Trampa (🕳️)
```
1. En "🛠️ Crear Items" → "🕳️ Trampa"
2. Click en canvas
3. Aparece cuadrado marrón
4. Agentes aprenden a evitarlas
```

---

## 🧪 EXPERIMENTO 1: Aprendizaje Individual

### Observar diferencias entre agentes
```
1. Selecciona "3 Agentes (Trío)"
2. Objetivo: 🍎 Buscar Comida
3. Coloca comida en 3 lugares diferentes
4. Click en cada agente en el panel
5. Verás que:
   - Agente 1 se especializa en zona norte
   - Agente 2 en zona sur
   - Agente 3 en zona este
   (Sin comunicación, cada uno aprende diferente)
```

### Resultado esperado
```
✓ Estadísticas diferentes para cada agente
✓ Colores diferentes (rojo, turquesa, amarillo)
✓ Comportamientos distintos
✓ Menos aleatoriedad después de 1 minuto
```

---

## 🧪 EXPERIMENTO 2: Mapa Personalizado

### Crear tu propio laberinto
```
1. Click "✏️ Modo Dibujo"
2. Dibuja forma de S en canvas inferior
3. Coloca 🍎 Comida al final
4. Click "📥 Cargar Mapa"
5. Agentes navegan TUUU diseño
6. Aprenden a resolver TU laberinto
```

### Resultado esperado
```
✓ Obstáculos siguiendo tus dibujos
✓ Agentes buscan comida
✓ Evitan obstáculos
✓ Encuentran camino óptimo
```

---

## 🧪 EXPERIMENTO 3: Ambiente Hostil

### Mundo difícil con trampas
```
1. Selecciona "2 Agentes (Dupla)"
2. Objetivo: 🚫 No Saltar (importante)
3. Coloca muchas 🕳️ Trampas
4. Coloca 🍎 Comida lejos de trampas
5. Agentes deben:
   - No saltar en trampas
   - Buscar comida
   - Maximizar energía
```

### Resultado esperado
```
✓ Agentes evitan saltar en trampas
✓ Comportamiento defensivo
✓ Cada uno busca ruta segura
✓ Aprendizaje de prudencia
```

---

## 🎯 CARACTERÍSTICAS CLAVE

### 👥 Múltiples Agentes
```
✓ 1-5 agentes simultáneos
✓ Cada uno aprende independiente
✓ Colores diferenciados
✓ Estadísticas individuales
✓ Selector dinámico
```

### 🧠 Menos Caprichos
```
✓ Exploración inicial: 30% (antes 50%)
✓ Convergencia más rápida
✓ Comportamiento predecible
✓ Menos "moody"
```

### 🎨 Editor Visual
```
✓ Canvas de dibujo integrado
✓ Dibujar con mouse
✓ Convertir a obstáculos
✓ Sin necesidad de código
```

### ⚡ 8 Items Totales
```
🍎 Comida (energía)
🥛 Leche (nutrientes)
⚠️ Pincho (daño)
🧱 Bloque (obstáculo)
🚩 Bandera (objetivo)
⚡ PowerUp (boost) [NUEVO]
🌀 Portal (teleport) [NUEVO]
🕳️ Trampa (evitar) [NUEVO]
```

---

## ⚙️ CONTROLES

| Función | Cómo |
|---------|------|
| **Cambiar agentes** | Panel "👥 Múltiples Agentes" → Dropdown |
| **Ver stats de agente** | Click botón del agente (azul = activo) |
| **Dibujar mapa** | ✏️ Modo Dibujo + drag mouse en canvas inferior |
| **Cargar dibujo** | 📥 Cargar Mapa |
| **Limpiar dibujo** | 🗑️ Limpiar |
| **Colocar items** | Click botones o rueda mouse en canvas principal |
| **Cambiar objetivo** | Dropdown "🎯 Objetivo del Agente" |
| **Reset todo** | 🔄 Reset Completo |

---

## 🐛 TROUBLESHOOTING

### "No veo 2 agentes"
```
Solución: 
1. Abre consola (F12)
2. Verifica sin errores (rojo)
3. Recarga página (Ctrl+R)
4. Selecciona "2 Agentes" de nuevo
```

### "El canvas de dibujo no dibuja"
```
Solución:
1. Asegúrate que ✏️ esté ROJO (dibujando)
2. Usa mouse (no trackpad)
3. Haz click + arrastra
4. Recarga si no funciona
```

### "Los agentes no se mueven"
```
Solución:
1. Hay comida en el mapa? (Si = bien)
2. Hay energía? (Barra verde = si)
3. Objetivo está seleccionado? (Dropdown)
4. ¿Primeros 30 segundos? (Es normal explorar)
```

### "Stats muestran 0"
```
Solución:
1. Click en el agente en el panel lateral
2. Espera 2 segundos para actualizar
3. Recarga si persiste
```

---

## 💡 TIPS AVANZADOS

### Para ver aprendizaje en acción
```
1. Coloca 🍎 en un lugar
2. Observa primeros 30 seg (aleatorio)
3. Después segundo 30 (dirigido)
4. Tercer minuto (óptimo)
```

### Para comparar agentes
```
1. Crea 2 agentes
2. Mismo objetivo
3. Click en cada uno
4. Verás aprendizaje diferente
5. Eso es Q-Learning funcionando
```

### Para crear nivel imposible
```
1. Dibuja laberinto muy complejo
2. Coloca muchas trampas
3. Comida en punto ciego
4. Observa si logran resolver
5. Algunos sí, otros no (azar computacional)
```

---

## 📊 QUELLE ESPERAR

### Frame 0-30 (Primeros 30 segundos)
```
- Agentes se mueven aleatoriamente
- Exploración del ambiente
- Normal y esperado
- Epsilon ≈ 30%
```

### Frame 30-120 (Segundo minuto)
```
- Comportamiento más dirigido
- Empiezan a aprender
- Menos movimientos aleatorios
- Epsilon ≈ 15%
```

### Frame 120+ (Después 2 minutos)
```
- Comportamiento óptimo
- Siguen comida directamente
- Pocas acciones random
- Epsilon ≈ 2%
```

---

## 🎓 CONCEPTOS DE IA

### Q-Learning
```
Cada agente aprende:
"Si estoy en [estado],
 y hago [acción],
 recibo [recompensa]"

100 estados × 4 acciones = 400 valores aprendidos
```

### Exploración vs Explotación
```
Exploración: Probar cosas nuevas (30% inicio)
Explotación: Usar lo aprendido (70% inicio)

Con el tiempo: 2% exploración, 98% explotación
```

### Recompensas
```
Comida:      +50 energía
Leche:       +40 energía  
Bandera:     +200 puntos
Pincho:      -20 daño
Vivir:       -0.03 cost/frame
Saltar:      -3 energía (si activado)
```

---

## 🚀 PRÓXIMOS PASOS (OPCIONAL)

Cosas que podrías experimentar:

1. **Cambiar epsilon manualmente**
   - Abre DevTools (F12)
   - `agents[0].learning.epsilon = 0.5`
   - Verás más aleatoriedad

2. **Agregar más agentes**
   - Selecciona "5 Agentes (Equipo)"
   - Observa caos creativo
   - Emergen patrones nuevos

3. **Combinar items nuevos**
   - PowerUp + Portal + Trampa
   - Crea ambiente complejo
   - Agentes resuelven diverso

4. **Crear mapas temáticos**
   - Dibuja ciudad
   - Dibuja castillo
   - Dibuja selva
   - Agentes exploran

---

## 📞 SOPORTE RÁPIDO

```
Error en consola (F12):
→ Copia error
→ Verifica estructura de archivos
→ Recarga página

Canvas negro:
→ Abre consola
→ Busca "Error"
→ Recarga

Agente congelado:
→ Aún está aprendiendo
→ Espera 1 minuto
→ Recarga si persiste
```

---

## ✅ CHECKLIST INICIAL

- [ ] HTML abierto en navegador
- [ ] Panel derecho visible
- [ ] Dropdown de agentes visible
- [ ] Canvas de dibujo visible
- [ ] Selecciona 2 agentes
- [ ] Ves dos colores diferentes
- [ ] Activé ✏️ Modo Dibujo
- [ ] Dibujé algo
- [ ] Click "📥 Cargar Mapa"
- [ ] Obstáculos aparecen en el juego

✅ Si todo pasó: **¡FUNCIONA PERFECTAMENTE!**

---

## 🎉 ¡DISFRUTA!

Ahora tienes un simulador de IA completo con:
- ✅ Múltiples agentes
- ✅ Aprendizaje menos caótico  
- ✅ Editor visual
- ✅ Nuevos elementos

**¡A explorar comportamientos emergentes! 🤖👥🚀**

---

*Versión: 2.0*
*Última actualización: 2024*
*Estado: Listo para producción* ✓
