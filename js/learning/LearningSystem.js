/**
 * SISTEMA DE APRENDIZAJE - Q-LEARNING MEJORADO
 * Aprende qué acciones son mejores en cada situación
 */
class LearningSystem {
    constructor(learningRate = 0.2, discountFactor = 0.95) {
        this.learningRate = learningRate;
        this.discountFactor = discountFactor;
        this.epsilon = 0.5; // Exploración inicial
        this.epsilonDecay = 0.9995;
        this.minEpsilon = 0.05;
        
        this.qTable = {};
        this.stats = {
            totalExperiences: 0,
            totalRewards: 0,
            statesDiscovered: 0,
            objectivesCompleted: 0
        };
    }

    /**
     * CREAR ESTADO DISCRETO DEL MUNDO
     */
    getState(agent, foods, blocks, spikes, milks, flags, objective) {
        let state = 'neutral';

        // Buscar objeto objetivo más cercano
        let objectPos = null;
        let objectType = null;

        if (objective === 'food') {
            for (let food of foods) {
                const dist = Math.abs(food.x - agent.x);
                if (!objectPos || dist < Math.abs(objectPos - agent.x)) {
                    objectPos = food.x;
                    objectType = 'food';
                }
            }
        } else if (objective === 'milk') {
            for (let milk of milks) {
                const dist = Math.abs(milk.x - agent.x);
                if (!objectPos || dist < Math.abs(objectPos - agent.x)) {
                    objectPos = milk.x;
                    objectType = 'milk';
                }
            }
        } else if (objective === 'flag') {
            for (let flag of flags) {
                const dist = Math.abs(flag.x - agent.x);
                if (!objectPos || dist < Math.abs(objectPos - agent.x)) {
                    objectPos = flag.x;
                    objectType = 'flag';
                }
            }
        }

        // Verificar pinchos cercanos
        let spikesNear = false;
        for (let spike of spikes) {
            if (Math.abs(spike.x - agent.x) < 80) {
                spikesNear = true;
                break;
            }
        }

        // Crear estado
        if (!objectPos) {
            state = 'searching';
        } else {
            const direction = objectPos < agent.x ? 'left' : 'right';
            const distance = Math.abs(objectPos - agent.x);
            const distanceBucket = distance < 50 ? 'close' : distance < 150 ? 'medium' : 'far';
            const energyBucket = agent.energy < 30 ? 'low' : agent.energy < 70 ? 'medium' : 'high';
            const groundStatus = agent.onGround ? 'ground' : 'air';
            const danger = spikesNear ? 'danger' : 'safe';
            
            state = `${direction}_${distanceBucket}_${energyBucket}_${groundStatus}_${danger}`;
        }

        return state;
    }

    /**
     * OBTENER VALORES Q PARA ESTADO
     */
    getQValues(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = {
                'left': 0,
                'right': 0,
                'jump': 0,
                'idle': 0
            };
            this.stats.statesDiscovered++;
        }
        return this.qTable[state];
    }

    /**
     * SELECCIONAR ACCIÓN EPSILON-GREEDY
     */
    selectAction(state) {
        const qValues = this.getQValues(state);
        
        if (Math.random() < this.epsilon) {
            const actions = ['left', 'right', 'jump', 'idle'];
            return actions[Math.floor(Math.random() * actions.length)];
        }
        
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
     * ACTUALIZAR TABLA Q - FÓRMULA ESTÁNDAR
     */
    updateQValue(state, action, reward, nextState) {
        const qValues = this.getQValues(state);
        const nextQValues = this.getQValues(nextState);
        
        const currentQ = qValues[action];
        const maxNextQ = Math.max(...Object.values(nextQValues));
        
        // Q(s,a) = Q(s,a) + α[r + γ max(Q(s',a')) - Q(s,a)]
        const newQ = currentQ + this.learningRate * (
            reward + this.discountFactor * maxNextQ - currentQ
        );
        
        qValues[action] = newQ;
    }

    /**
     * REGISTRAR EXPERIENCIA Y APRENDER
     */
    recordExperience(state, action, reward, nextState) {
        this.updateQValue(state, action, reward, nextState);
        this.stats.totalExperiences++;
        this.stats.totalRewards += reward;
    }

    /**
     * REDUCIR EXPLORACIÓN GRADUALMENTE
     */
    updateEpsilon() {
        this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
    }

    /**
     * RESGUARDO DE OBJETIVO CUMPLIDO
     */
    recordObjectiveCompleted() {
        this.stats.objectivesCompleted++;
    }

    /**
     * OBTENER ESTADÍSTICAS
     */
    getStats() {
        return {
            experiences: this.stats.totalExperiences,
            rewards: Math.round(this.stats.totalRewards),
            epsilon: this.epsilon.toFixed(4),
            states: this.stats.statesDiscovered,
            objectives: this.stats.objectivesCompleted
        };
    }
}
