/**
 * SISTEMA COGNITIVO DEL AGENTE
 * ============================
 * La inteligencia del agente: Percepción, análisis y toma de decisiones
 * Este módulo es responsable de PENSAR qué hacer en cada momento
 */

class CognitiveSystem {
    constructor(agent) {
        this.agent = agent;
        
        // ==========================================
        // SENSORES NEURALES
        // ==========================================
        this.sensors = {
            vision: {}, // Lo que "ve" en el mundo
            proprioception: {}, // Conocimiento del propio cuerpo
            interoception: {}, // Sensaciones internas
            memory: [] // Memoria de eventos recientes
            
        };
        
        // ==========================================
        // VARIABLES DE ESTADO MENTAL
        // ==========================================
        this.mentalState = {
            attention: 1.0, // Nivel de atención (0-1)
            focus: 'food', // En qué está enfocado
            urgency: 0, // Urgencia de la situación (0-1)
            stress: 0, // Nivel de estrés (0-1)
            motivation: 0.5, // Motivación general
            confidence: 0.5 // Confianza en sus decisiones
        };
        
        // ==========================================
        // VARIABLES NEUROENDOCRINAS
        // ==========================================
        this.hormones = {
            adrenaline: 0, // Adrenalina (peligro/urgencia)
            dopamine: 0.5, // Dopamina (placer/recompensa)
            cortisol: 0, // Cortisol (estrés)
            serotonin: 0.5, // Serotonina (bienestar)
            ghrelin: 1.0 // Grelina (hambre)
        };
        
        // ==========================================
        // MEMORIA Y PREDICCIÓN
        // ==========================================
        this.memories = {
            recentActions: [], // Últimas 10 acciones
            successfulPatterns: {}, // Patrones que funcionaron
            failedPatterns: {}, // Patrones que fallaron
            emotionalMemory: [] // Eventos emocionales importantes
        };
        
        this.predictions = {
            nextStates: {}, // Predicción de próximos estados
            expectedOutcomes: {}, // Qué espera que pase
            riskAssessment: {} // Evaluación de riesgos
        };
        
        // ==========================================
        // HISTORIAL DE PENSAMIENTO
        // ==========================================
        this.thoughtLog = [];
        this.decisionHistory = [];
    }
    
    /**
     * SISTEMA SENSORIAL: Percibir el mundo
     */
    perceiveEnvironment(foods, blocks) {
        // ===== VISIÓN =====
        const nearestFood = this.findNearestFood(foods);
        const nearestBlock = this.findNearestBlock(blocks);
        const foodsCount = foods.length;
        
        // Distancia y dirección a la comida
        let foodRelativePos = { dx: Infinity, dy: Infinity, distance: Infinity };
        if (nearestFood) {
            foodRelativePos.dx = nearestFood.x - (this.agent.x + this.agent.size / 2);
            foodRelativePos.dy = nearestFood.y - (this.agent.y + this.agent.size / 2);
            foodRelativePos.distance = Math.sqrt(foodRelativePos.dx ** 2 + foodRelativePos.dy ** 2);
        }
        
        // ===== PROPIOCEPCIÓN (Conocimiento del cuerpo) =====
        const bodyAwareness = {
            position: { x: this.agent.x, y: this.agent.y },
            velocity: { x: this.agent.vx, y: this.agent.vy },
            onGround: this.agent.onGround,
            isJumping: this.agent.isJumping,
            balance: Math.abs(this.agent.vx) < 2 ? 'balanced' : 'moving'
        };
        
        // ===== INTEROCEPCIÓN (Sensaciones internas) =====
        const internalState = {
            energy: this.agent.energy,
            energyPercent: (this.agent.energy / this.agent.maxEnergy),
            hunger: 1 - (this.agent.energy / this.agent.maxEnergy),
            fatigue: 1 - (this.agent.energy / this.agent.maxEnergy),
            heartRate: 60 + (this.agent.energy < 30 ? 40 : 0) + (this.mentalState.stress * 30),
            temperature: 36.5 + (this.agent.energy < 20 ? -1 : 0)
        };
        
        this.sensors = {
            vision: { nearestFood, nearestBlock, foodsCount, foodRelativePos },
            proprioception: bodyAwareness,
            interoception: internalState
        };
        
        // Registrar en memoria sensorial
        this.updateSensorMemory();
        
        return this.sensors;
    }
    
    /**
     * Actualizar memoria sensorial y detectar cambios
     */
    updateSensorMemory() {
        const memory = {
            timestamp: Date.now(),
            sensors: JSON.parse(JSON.stringify(this.sensors)),
            mentalState: JSON.parse(JSON.stringify(this.mentalState))
        };
        
        this.sensors.memory.push(memory);
        if (this.sensors.memory.length > 20) {
            this.sensors.memory.shift();
        }
    }
    
    /**
     * Buscar comida más cercana
     */
    findNearestFood(foods) {
        let nearest = null;
        let minDist = Infinity;
        
        for (let food of foods) {
            const dist = Math.hypot(
                food.x - (this.agent.x + this.agent.size / 2),
                food.y - (this.agent.y + this.agent.size / 2)
            );
            if (dist < minDist) {
                minDist = dist;
                nearest = food;
            }
        }
        return nearest;
    }
    
    /**
     * Buscar bloque más cercano
     */
    findNearestBlock(blocks) {
        let nearest = null;
        let minDist = Infinity;
        
        for (let block of blocks) {
            const dist = Math.hypot(
                block.x - (this.agent.x + this.agent.size / 2),
                block.y - (this.agent.y + this.agent.size / 2)
            );
            if (dist < minDist) {
                minDist = dist;
                nearest = block;
            }
        }
        return nearest;
    }
    
    /**
     * SISTEMA DE PREDICCIÓN: Imaginar qué pasa si hago una acción
     * El agente puede "simular mentalmente" antes de actuar
     */
    predictOutcome(action, foods, blocks) {
        const simulation = {
            action: action,
            expectedEnergyChange: 0,
            expectedPosition: { x: this.agent.x, y: this.agent.y },
            expectedVelocity: { x: this.agent.vx, y: this.agent.vy },
            risks: [],
            benefits: [],
            confidence: 0.8
        };
        
        // Simular cada tipo de acción
        switch (action) {
            case 'left':
                simulation.expectedVelocity.x = -3;
                simulation.expectedEnergyChange = -0.05; // Movimiento cuesta energía
                simulation.expectedPosition.x -= 15;
                simulation.benefits.push('Moverse hacia la izquierda');
                break;
                
            case 'right':
                simulation.expectedVelocity.x = 3;
                simulation.expectedEnergyChange = -0.05;
                simulation.expectedPosition.x += 15;
                simulation.benefits.push('Moverse hacia la derecha');
                break;
                
            case 'jump':
                if (this.agent.onGround) {
                    simulation.expectedVelocity.y = -12;
                    simulation.expectedEnergyChange = -3;
                    simulation.benefits.push('Salto exitoso');
                    simulation.risks.push('Costo energético alto');
                } else {
                    simulation.expectedEnergyChange = -1;
                    simulation.risks.push('No se puede saltar en el aire');
                    simulation.confidence = 0.2;
                }
                break;
                
            case 'idle':
                simulation.expectedEnergyChange = -0.03;
                simulation.expectedVelocity.x *= 0.7;
                simulation.benefits.push('Conservar energía');
                break;
        }
        
        return simulation;
    }
    
    /**
     * PROCESAMIENTO EMOCIONAL: Actualizar estado mental basado en circunstancias
     */
    processEmotions() {
        const energy = this.sensors.interoception.energyPercent;
        const hunger = this.sensors.interoception.hunger;
        
        // ===== HAMBRE =====
        this.hormones.ghrelin = hunger * 1.5;
        
        // ===== ESTRÉS Y ADRENALINA =====
        if (energy < 0.3) {
            this.hormones.adrenaline = Math.min(1, (0.3 - energy) / 0.3);
            this.mentalState.stress = Math.min(1, (0.3 - energy) / 0.3);
            this.mentalState.urgency = 0.8;
        } else {
            this.hormones.adrenaline = Math.max(0, this.hormones.adrenaline - 0.02);
            this.mentalState.stress = Math.max(0, this.mentalState.stress - 0.01);
            this.mentalState.urgency = 0.3;
        }
        
        // ===== DOPAMINA (Recompensa) =====
        // Aumenta con éxito, disminuye con fracaso
        this.hormones.dopamine = Math.max(0.3, this.hormones.dopamine - 0.01);
        
        // ===== MOTIVACIÓN =====
        this.mentalState.motivation = (this.hormones.dopamine * 0.3) + (hunger * 0.4) + (this.mentalState.stress * 0.3);
        
        // ===== CONFIANZA =====
        // Aumenta con éxito reciente, disminuye con fracasos
        this.mentalState.confidence = Math.max(0.2, Math.min(0.9, this.mentalState.confidence - 0.005));
    }
    
    /**
     * TOMA DE DECISIÓN: Elegir la mejor acción considerando todo
     */
    makeDecision(currentState, qValues, epsilon) {
        this.processEmotions();
        
        const decision = {
            action: null,
            reasoning: [],
            confidence: 0,
            timestamp: Date.now()
        };
        
        const energy = this.sensors.interoception.energyPercent;
        const hunger = this.sensors.interoception.hunger;
        const foodVisible = this.sensors.vision.nearestFood !== null;
        
        // ===== LÓGICA DE DECISIÓN COGNITIVA =====
        
        // Si está muy cansado y hay comida cerca
        if (energy < 0.2 && foodVisible) {
            const foodDx = this.sensors.vision.foodRelativePos.dx;
            if (Math.abs(foodDx) > 30) {
                decision.action = foodDx < 0 ? 'left' : 'right';
                decision.reasoning.push('Ir hacia la comida (URGENCIA)');
                decision.confidence = 0.9;
                return decision;
            } else {
                decision.action = 'idle';
                decision.reasoning.push('Comida cerca, esperar');
                decision.confidence = 0.85;
                return decision;
            }
        }
        
        // Si hay hambre pero energía media
        if (hunger > 0.5 && foodVisible) {
            const foodDx = this.sensors.vision.foodRelativePos.dx;
            if (Math.abs(foodDx) > 50) {
                decision.action = foodDx < 0 ? 'left' : 'right';
                decision.reasoning.push('Acercarse a la comida');
                decision.confidence = 0.8;
                return decision;
            }
        }
        
        // Si está energizado, explorar
        if (energy > 0.6 && Math.random() < 0.1) {
            decision.action = Math.random() > 0.5 ? 'left' : 'right';
            decision.reasoning.push('Exploración: moverse aleatoriamente');
            decision.confidence = 0.5;
            return decision;
        }
        
        // Usar Q-Learning si no hay urgencia
        if (Math.random() < epsilon) {
            const actions = ['left', 'right', 'jump', 'idle'];
            decision.action = actions[Math.floor(Math.random() * actions.length)];
            decision.reasoning.push('Exploración aleatoria (Q-Learning)');
            decision.confidence = 0.5;
        } else {
            decision.action = this.getBestActionFromQ(qValues);
            decision.reasoning.push('Explotación: mejor acción conocida');
            decision.confidence = 0.75;
        }
        
        this.decisionHistory.push(decision);
        if (this.decisionHistory.length > 50) {
            this.decisionHistory.shift();
        }
        
        return decision;
    }
    
    /**
     * Obtener la mejor acción de la tabla Q
     */
    getBestActionFromQ(qValues) {
        let bestAction = 'idle';
        let bestValue = qValues['idle'];
        
        for (let action in qValues) {
            if (qValues[action] > bestValue) {
                bestValue = qValues[action];
                bestAction = action;
            }
        }
        
        return bestAction;
    }
    
    /**
     * Registrar pensamiento importante
     */
    logThought(thought) {
        this.thoughtLog.push({
            timestamp: Date.now(),
            thought: thought,
            mentalState: JSON.parse(JSON.stringify(this.mentalState))
        });
        
        if (this.thoughtLog.length > 100) {
            this.thoughtLog.shift();
        }
    }
    
    /**
     * Obtener estado mental para debug
     */
    getMentalStatus() {
        return {
            attention: this.mentalState.attention.toFixed(2),
            focus: this.mentalState.focus,
            stress: this.mentalState.stress.toFixed(2),
            motivation: this.mentalState.motivation.toFixed(2),
            confidence: this.mentalState.confidence.toFixed(2),
            dopamine: this.hormones.dopamine.toFixed(2),
            adrenaline: this.hormones.adrenaline.toFixed(2),
            ghrelin: this.hormones.ghrelin.toFixed(2),
            heartRate: Math.round(this.hormones.ghrelin * 100)
        };
    }
}
