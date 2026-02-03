/**
 * SISTEMA COGNITIVO - ANÁLISIS INTELIGENTE DEL MUNDO
 * Detecta objetos, evita peligros, toma decisiones naturales
 */
class CognitiveSystem {
    constructor(agent) {
        this.agent = agent;
        
        // Visión del agente
        this.vision = {
            foodAhead: null,
            milkAhead: null,
            spikeAhead: null,
            blockAhead: null,
            flagAhead: null,
            distanceToObject: Infinity,
            objectDirection: 'none' // left, right, none
        };
        
        this.lastActionTime = 0;
        this.actionCooldown = 3; // frames entre acciones
        
        // Aprendizaje sobre costos
        this.learnedCosts = {
            jumpCosts: [], // historial de costos de saltar
            spikeDanger: 0 // peligro percibido de pinchos
        };
    }

    /**
     * Escanear ambiente inteligentemente
     */
    scanEnvironment(foods, blocks, spikes, milks, flags) {
        this.vision = {
            foodAhead: null,
            milkAhead: null,
            spikeAhead: null,
            blockAhead: null,
            flagAhead: null,
            distanceToObject: Infinity,
            objectDirection: 'none'
        };

        const visionRange = 100;
        const scanX1 = this.agent.x - visionRange;
        const scanX2 = this.agent.x + visionRange;

        let closestDist = Infinity;
        let closestType = null;

        // Buscar comida
        for (let food of foods) {
            if (food.x > scanX1 && food.x < scanX2) {
                const dist = Math.abs(food.x - this.agent.x);
                if (dist < closestDist) {
                    closestDist = dist;
                    this.vision.foodAhead = food;
                    this.vision.objectDirection = food.x < this.agent.x ? 'left' : 'right';
                    closestType = 'food';
                }
            }
        }

        // Buscar leche (si es objetivo)
        for (let milk of milks) {
            if (milk.x > scanX1 && milk.x < scanX2) {
                const dist = Math.abs(milk.x - this.agent.x);
                if (dist < closestDist && this.agent.objective === 'milk') {
                    closestDist = dist;
                    this.vision.milkAhead = milk;
                    this.vision.objectDirection = milk.x < this.agent.x ? 'left' : 'right';
                    closestType = 'milk';
                }
            }
        }

        // Buscar bandera (si es objetivo)
        for (let flag of flags) {
            if (flag.x > scanX1 && flag.x < scanX2) {
                const dist = Math.abs(flag.x - this.agent.x);
                if (dist < closestDist && this.agent.objective === 'flag') {
                    closestDist = dist;
                    this.vision.flagAhead = flag;
                    this.vision.objectDirection = flag.x < this.agent.x ? 'left' : 'right';
                    closestType = 'flag';
                }
            }
        }

        // SIEMPRE detectar pinchos como peligro
        for (let spike of spikes) {
            if (spike.x > scanX1 && spike.x < scanX2) {
                this.vision.spikeAhead = spike;
            }
        }

        this.vision.distanceToObject = closestDist === Infinity ? Infinity : closestDist;
    }

    /**
     * Tomar decisión inteligente y natural
     */
    makeDecision(qValues, epsilon) {
        // Control de cooldown - no spammear acciones
        this.agent.framesSinceAction = (this.agent.framesSinceAction || 0) + 1;
        
        if (this.agent.framesSinceAction < this.actionCooldown) {
            return { action: 'idle' };
        }

        // PRIORIDAD 1: Evitar pinchos SIEMPRE
        if (this.vision.spikeAhead && this.agent.onGround) {
            this.agent.framesSinceAction = 0;
            return { action: 'jump' };
        }

        // PRIORIDAD 2: Si aprende que saltar es caro, evitarlo
        const avgJumpCost = this.getAverageJumpCost();
        if (avgJumpCost > 3 && Math.random() < 0.7) {
            // Preferir no saltar si es muy caro
            const groundActions = ['left', 'right', 'idle'];
            if (qValues[groundActions[0]] > -10) { // si hay opción mejor
                return { action: 'idle' };
            }
        }

        // PRIORIDAD 3: Epsilon-greedy normal
        if (Math.random() < epsilon) {
            const actions = ['left', 'right', 'jump', 'idle'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            this.agent.framesSinceAction = 0;
            return { action };
        }

        // PRIORIDAD 4: Usar mejor acción conocida
        let bestAction = 'idle';
        let bestValue = qValues['idle'] || 0;

        for (let action in qValues) {
            if (qValues[action] > bestValue) {
                bestValue = qValues[action];
                bestAction = action;
            }
        }

        this.agent.framesSinceAction = 0;
        return { action: bestAction };
    }

    /**
     * Aprender costo del salto
     */
    recordJumpCost(cost) {
        this.learnedCosts.jumpCosts.push(cost);
        if (this.learnedCosts.jumpCosts.length > 50) {
            this.learnedCosts.jumpCosts.shift();
        }
    }

    getAverageJumpCost() {
        if (this.learnedCosts.jumpCosts.length === 0) return 0;
        const sum = this.learnedCosts.jumpCosts.reduce((a, b) => a + b, 0);
        return sum / this.learnedCosts.jumpCosts.length;
    }

    getMentalStatus() {
        return {
            vision: `${this.vision.foodAhead ? '🍎' : ''}${this.vision.milkAhead ? '🥛' : ''}${this.vision.flagAhead ? '🚩' : ''}${this.vision.spikeAhead ? '⚠️' : ''}`,
            jumpCost: this.getAverageJumpCost().toFixed(2)
        };
    }
}
