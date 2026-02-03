/**
 * SISTEMA DE APRENDIZAJE - Q-LEARNING
 * Responsable de APRENDER de las experiencias
 */
class LearningSystem {
    constructor(learningRate = 0.15, discountFactor = 0.95) {
        this.learningRate = learningRate;
        this.discountFactor = discountFactor;
        this.epsilon = 0.4;
        this.epsilonDecay = 0.9998;
        this.minEpsilon = 0.05;
        
        this.qTable = {};
        this.stats = {
            totalExperiences: 0,
            totalRewards: 0,
            statesDiscovered: 0
        };
    }

    getState(agent, foods, blocks) {
        // Discretizar el mundo en estados
        const x = agent.x;
        const y = agent.y;
        const energy = agent.energy;
        
        // Buscar comida más cercana
        let closestFood = null;
        let minDist = Infinity;
        for (let food of foods) {
            const dist = Math.hypot(food.x - x, food.y - y);
            if (dist < minDist) {
                minDist = dist;
                closestFood = food;
            }
        }
        
        // Crear identificador de estado
        let state = 'no_food';
        if (closestFood) {
            const dx = closestFood.x - x;
            const foodDir = dx < -30 ? 'left' : dx > 30 ? 'right' : 'close';
            const distance = minDist < 100 ? 'near' : 'far';
            const energyLevel = energy < 30 ? 'low' : energy < 70 ? 'med' : 'high';
            const ground = agent.onGround ? 'ground' : 'air';
            
            state = `${foodDir}_${distance}_${energyLevel}_${ground}`;
        }
        
        return state;
    }

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

    updateQValue(state, action, reward, nextState) {
        const qValues = this.getQValues(state);
        const nextQValues = this.getQValues(nextState);
        
        const currentQ = qValues[action];
        const maxNextQ = Math.max(...Object.values(nextQValues));
        
        const newQ = currentQ + this.learningRate * (
            reward + this.discountFactor * maxNextQ - currentQ
        );
        
        qValues[action] = newQ;
    }

    recordExperience(state, action, reward, nextState) {
        this.updateQValue(state, action, reward, nextState);
        this.stats.totalExperiences++;
        this.stats.totalRewards += reward;
    }

    updateEpsilon() {
        this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
    }
}
