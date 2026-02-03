/**
 * SISTEMA COGNITIVO DEL AGENTE
 * Responsable de PENSAR y tomar decisiones
 */
class CognitiveSystem {
    constructor(agent) {
        this.agent = agent;
        this.hormones = {
            adrenaline: 0,
            dopamine: 0.5,
            cortisol: 0,
            ghrelin: 1.0
        };
    }

    perceiveEnvironment(foods, blocks) {
        // Actualizar hormonas según estado
        const energyPercent = this.agent.energy / this.agent.maxEnergy;
        
        // Hambre aumenta cuando tiene poca energía
        this.hormones.ghrelin = Math.max(0, 1.5 - energyPercent * 1.5);
        
        // Estrés aumenta cuando tiene poca energía
        if (energyPercent < 0.3) {
            this.hormones.cortisol = (0.3 - energyPercent) / 0.3;
            this.hormones.adrenaline = (0.3 - energyPercent) / 0.3;
        } else {
            this.hormones.cortisol = Math.max(0, this.hormones.cortisol - 0.05);
            this.hormones.adrenaline = Math.max(0, this.hormones.adrenaline - 0.05);
        }
    }

    makeDecision(state, qValues, epsilon) {
        // Epsilon-greedy: exploración vs explotación
        if (Math.random() < epsilon) {
            // Exploración: acción aleatoria
            const actions = ['left', 'right', 'jump', 'idle'];
            return { action: actions[Math.floor(Math.random() * actions.length)] };
        } else {
            // Explotación: mejor acción conocida
            let bestAction = 'idle';
            let bestValue = -Infinity;
            
            for (let action in qValues) {
                if (qValues[action] > bestValue) {
                    bestValue = qValues[action];
                    bestAction = action;
                }
            }
            
            return { action: bestAction };
        }
    }

    getMentalStatus() {
        return {
            hormones: this.hormones,
            mood: this.agent.mood
        };
    }
}
