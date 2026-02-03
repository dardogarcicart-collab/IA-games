/**
 * SISTEMA DE APRENDIZAJE POR REFUERZO
 * ====================================
 * El aprendizaje del agente: Q-Learning, memoria y optimización
 * Este módulo es responsable de APRENDER de las experiencias
 */

class LearningSystem {
    constructor(learningRate = 0.15, discountFactor = 0.95) {
        // ==========================================
        // PARÁMETROS DE Q-LEARNING
        // ==========================================
        this.learningRate = learningRate;
        this.discountFactor = discountFactor;
        this.epsilon = 0.4; // Exploración inicial
        this.epsilonDecay = 0.9998;
        this.minEpsilon = 0.05;
        
        // ==========================================
        // TABLA Q Y EXPERIENCIAS
        // ==========================================
        this.qTable = {}; // Estado -> Acciones -> Valores Q
        this.stateVisits = {}; // Contar visitas a cada estado
        this.actionHistory = {}; // Historial de acciones por estado
        this.experiences = []; // Buffer de experiencias
        
        // ==========================================
        // ESTADÍSTICAS DE APRENDIZAJE
        // ==========================================
        this.stats = {
            totalExperiences: 0,
            totalRewards: 0,
            episodeRewards: [],
            statesDiscovered: 0,
            actionValueChange: {},
            convergence: 0 // Qué tan convergida está la tabla Q
        };
        
        // ==========================================
        // PATRONES APRENDIDOS
        // ==========================================
        this.learnedPatterns = {
            'go_to_food': { count: 0, avgReward: 0 },
            'jump_food': { count: 0, avgReward: 0 },
            'safe_idle': { count: 0, avgReward: 0 },
            'explore': { count: 0, avgReward: 0 }
        };
    }
    
    /**
     * OBTENER ESTADO: Descrición simplificada pero informativa del mundo
     */
    getState(agent, foods, blocks) {
        const nearestFood = this.findNearestFood(agent, foods);
        
        // Dirección a comida
        let foodDir = 'none';
        let foodDist = 'far';
        
        if (nearestFood) {
            const dx = nearestFood.x - (agent.x + agent.size / 2);
            const distance = Math.abs(dx);
            
            foodDir = dx < -80 ? 'left' : dx > 80 ? 'right' : 'close';
            foodDist = distance < 120 ? 'near' : 'far';
        }
        
        // Energía
        const energyLevel = agent.energy > 75 ? 'high' : 
                            agent.energy > 40 ? 'medium' : 'low';
        
        // Posición
        const groundPos = agent.onGround ? 'ground' : 'air';
        
        return `${foodDir}_${foodDist}_${energyLevel}_${groundPos}`;
    }
    
    /**
     * Buscar comida más cercana
     */
    findNearestFood(agent, foods) {
        let nearest = null;
        let minDist = Infinity;
        
        for (let food of foods) {
            const dist = Math.hypot(
                food.x - (agent.x + agent.size / 2),
                food.y - (agent.y + agent.size / 2)
            );
            if (dist < minDist) {
                minDist = dist;
                nearest = food;
            }
        }
        return nearest;
    }
    
    /**
     * INICIALIZAR Q-VALUES para un estado
     */
    initQValues(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = {
                'left': 0,
                'right': 0,
                'jump': 0,
                'idle': 0
            };
            
            this.stateVisits[state] = 0;
            this.actionHistory[state] = {
                'left': { count: 0, rewards: [] },
                'right': { count: 0, rewards: [] },
                'jump': { count: 0, rewards: [] },
                'idle': { count: 0, rewards: [] }
            };
            
            this.stats.statesDiscovered++;
        }
    }
    
    /**
     * SELECCIONAR ACCIÓN: Epsilon-greedy con inteligencia
     */
    selectAction(state, epsilon = null) {
        this.initQValues(state);
        
        const useEpsilon = epsilon !== null ? epsilon : this.epsilon;
        
        // EXPLORACIÓN: Acción aleatoria
        if (Math.random() < useEpsilon) {
            const actions = ['left', 'right', 'jump', 'idle'];
            return actions[Math.floor(Math.random() * actions.length)];
        }
        
        // EXPLOTACIÓN: Mejor acción conocida
        const qValues = this.qTable[state];
        let bestActions = ['idle'];
        let bestValue = qValues['idle'];
        
        for (let action in qValues) {
            if (qValues[action] > bestValue) {
                bestValue = qValues[action];
                bestActions = [action];
            } else if (Math.abs(qValues[action] - bestValue) < 0.1) {
                // Si están muy cerca, considerar ambas
                bestActions.push(action);
            }
        }
        
        return bestActions[Math.floor(Math.random() * bestActions.length)];
    }
    
    /**
     * ACTUALIZAR TABLA Q: Fórmula estándar de Q-Learning
     */
    updateQValue(state, action, reward, nextState) {
        this.initQValues(state);
        this.initQValues(nextState);
        
        const currentQ = this.qTable[state][action];
        const maxNextQ = Math.max(...Object.values(this.qTable[nextState]));
        
        // Q(s,a) = Q(s,a) + α[r + γ max(Q(s',a')) - Q(s,a)]
        const newQ = currentQ + this.learningRate * (
            reward + this.discountFactor * maxNextQ - currentQ
        );
        
        const qChange = Math.abs(newQ - currentQ);
        this.qTable[state][action] = newQ;
        
        // Registrar cambio
        const key = `${state}_${action}`;
        this.stats.actionValueChange[key] = qChange;
        
        // Actualizar historial de acciones
        this.actionHistory[state][action].count++;
        this.actionHistory[state][action].rewards.push(reward);
        
        // Registrar experiencia
        this.stats.totalExperiences++;
        this.stats.totalRewards += reward;
        
        // Actualizar convergencia
        this.calculateConvergence();
    }
    
    /**
     * REGISTRAR EXPERIENCIA: Guardar interacción para análisis
     */
    recordExperience(state, action, reward, nextState) {
        const experience = {
            timestamp: Date.now(),
            state: state,
            action: action,
            reward: reward,
            nextState: nextState,
            qValue: this.qTable[state]?.[action] || 0
        };
        
        this.experiences.push(experience);
        
        // Mantener buffer de últimas 1000 experiencias
        if (this.experiences.length > 1000) {
            this.experiences.shift();
        }
        
        this.updateQValue(state, action, reward, nextState);
    }
    
    /**
     * IDENTIFICAR PATRONES APRENDIDOS
     */
    identifyPatterns() {
        // Revisar estados exitosos
        for (let state in this.qTable) {
            const qValues = this.qTable[state];
            
            if (state.includes('close') && qValues['idle'] > 20) {
                this.learnedPatterns['safe_idle'].count++;
            }
            
            if (state.includes('left') || state.includes('right')) {
                if (state.includes('food') && qValues['left'] > 10 || qValues['right'] > 10) {
                    this.learnedPatterns['go_to_food'].count++;
                }
            }
            
            if (qValues['jump'] > 15) {
                this.learnedPatterns['jump_food'].count++;
            }
        }
    }
    
    /**
     * CALCULAR CONVERGENCIA: Qué tan estable es la tabla Q
     */
    calculateConvergence() {
        if (this.stats.totalExperiences < 100) return;
        
        let totalChange = 0;
        let count = 0;
        
        for (let key in this.stats.actionValueChange) {
            totalChange += this.stats.actionValueChange[key];
            count++;
        }
        
        const avgChange = count > 0 ? totalChange / count : 0;
        this.stats.convergence = Math.max(0, 1 - (avgChange * 10)); // 0-1
    }
    
    /**
     * DECAIMIENTO DE EPSILON: Menos exploración con el tiempo
     */
    updateEpsilon() {
        this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
    }
    
    /**
     * OBTENER TABLA Q PARA UN ESTADO
     */
    getQValues(state) {
        this.initQValues(state);
        return this.qTable[state];
    }
    
    /**
     * OBTENER MEJOR ACCIÓN PARA UN ESTADO
     */
    getBestAction(state) {
        const qValues = this.getQValues(state);
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
     * OBTENER ESTADÍSTICAS DE APRENDIZAJE
     */
    getLearningStats() {
        const stateCount = Object.keys(this.qTable).length;
        const avgRewardPerExperience = this.stats.totalExperiences > 0 
            ? (this.stats.totalRewards / this.stats.totalExperiences).toFixed(2)
            : 0;
        
        return {
            epsilon: this.epsilon.toFixed(4),
            statesDiscovered: this.stats.statesDiscovered,
            totalExperiences: this.stats.totalExperiences,
            avgRewardPerExperience: avgRewardPerExperience,
            convergence: (this.stats.convergence * 100).toFixed(1) + '%',
            learningRate: this.learningRate.toFixed(3),
            discountFactor: this.discountFactor.toFixed(2)
        };
    }
    
    /**
     * OBTENER TABLA Q COMPLETA (Para debug)
     */
    getFullQTable() {
        return JSON.parse(JSON.stringify(this.qTable));
    }
    
    /**
     * RESETEAR SISTEMA DE APRENDIZAJE
     */
    reset() {
        this.qTable = {};
        this.stateVisits = {};
        this.actionHistory = {};
        this.experiences = [];
        this.epsilon = 0.4;
        this.stats = {
            totalExperiences: 0,
            totalRewards: 0,
            episodeRewards: [],
            statesDiscovered: 0,
            actionValueChange: {},
            convergence: 0
        };
        this.learnedPatterns = {
            'go_to_food': { count: 0, avgReward: 0 },
            'jump_food': { count: 0, avgReward: 0 },
            'safe_idle': { count: 0, avgReward: 0 },
            'explore': { count: 0, avgReward: 0 }
        };
    }
}
