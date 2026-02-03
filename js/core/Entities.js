/**
 * CLASES BASE DEL SISTEMA - ENTIDADES
 */

class Agent {
    constructor(canvas, objective = 'food') {
        this.canvas = canvas;
        this.objective = objective; // food, milk, flag, no_jump
        
        // POSICIÓN Y FÍSICA
        this.x = canvas.width / 3;
        this.y = canvas.height - 100;
        this.vx = 0;
        this.vy = 0;
        this.size = 30;
        this.onGround = false;
        this.isJumping = false;
        
        // ENERGÍA
        this.energy = 100;
        this.maxEnergy = 100;
        this.color = '#FF6B6B';
        
        // ESTADO
        this.mood = 'neutral';
        this.framesSinceAction = 0;
        this.spikeDamage = false;
        
        // ESTADÍSTICAS
        this.foodEaten = 0;
        this.milkDrunk = 0;
        this.flagsReached = 0;
        this.jumpCount = 0;
        this.totalReward = 0;
        
        // SISTEMAS INTEGRADOS
        this.brain = new CognitiveSystem(this);
        this.learning = new LearningSystem();
        this.physics = new PhysicsEngine();
        
        // CONTROL INTERNO
        this.lastState = null;
        this.lastAction = null;
    }

    /**
     * CICLO PRINCIPAL DE ACTUALIZACIÓN
     */
    update(foods, blocks, spikes, milks, flags, jumpPenalty) {
        // 1. Escanear ambiente
        this.brain.scanEnvironment(foods, blocks, spikes, milks, flags);
        
        // 2. Obtener estado actual
        const currentState = this.learning.getState(this, foods, blocks, spikes, milks, flags, this.objective);
        
        // 3. Obtener valores Q
        const qValues = this.learning.getQValues(currentState);
        
        // 4. Tomar decisión
        const decision = this.brain.makeDecision(qValues, this.learning.epsilon);
        
        // 5. Procesar experiencia anterior
        if (this.lastState !== null && this.lastAction !== null) {
            let reward = -0.03; // Penalización pasiva
            
            if (this.energy < 30) {
                reward -= 0.1;
            }
            
            this.learning.recordExperience(this.lastState, this.lastAction, reward, currentState);
        }
        
        this.lastState = currentState;
        this.lastAction = decision.action;
        
        // 6. Ejecutar acción
        this.executeAction(decision.action, jumpPenalty);
        
        // 7. Aplicar física
        this.physics.applyGravity(this);
        this.physics.applyFriction(this, this.onGround);
        this.physics.updatePosition(this);
        this.physics.applyWorldBoundaries(this, this.canvas);
        this.physics.resolveBlockCollisions(this, blocks);
        
        // 8. Detectar colisiones con pinchos
        this.physics.checkSpikeCollisions(this, spikes);
        
        // 9. Detectar colisiones con items
        this.checkFoodCollisions(foods);
        this.checkMilkCollisions(milks);
        this.checkFlagCollisions(flags);
        
        // 10. Consumir energía
        const cost = this.physics.calculateMetabolicCost(this);
        this.energy = Math.max(0, this.energy - cost);
        
        // 11. Actualizar estado emocional
        this.updateMood();
        
        // 12. Reducir exploración
        this.learning.updateEpsilon();
    }

    /**
     * EJECUTAR ACCIÓN
     */
    executeAction(action, jumpPenalty) {
        switch(action) {
            case 'left':
                this.physics.applyMovement(this, 'left');
                break;
            case 'right':
                this.physics.applyMovement(this, 'right');
                break;
            case 'jump':
                const jumpResult = this.physics.applyJump(this, jumpPenalty);
                if (jumpResult.success) {
                    this.jumpCount++;
                    if (jumpResult.energyCost > 0) {
                        this.energy = Math.max(0, this.energy - jumpResult.energyCost);
                    }
                }
                break;
            case 'idle':
                this.vx *= 0.6;
                break;
        }
    }

    /**
     * COLISIÓN CON COMIDA
     */
    checkFoodCollisions(foods) {
        for (let i = foods.length - 1; i >= 0; i--) {
            const food = foods[i];
            const centerX = this.x + this.size / 2;
            const centerY = this.y + this.size / 2;
            const dist = Math.hypot(food.x - centerX, food.y - centerY);
            
            if (dist < this.size / 2 + 15) {
                this.energy = Math.min(this.maxEnergy, this.energy + 35);
                this.foodEaten++;
                foods.splice(i, 1);
                
                let reward = 50;
                if (this.objective === 'food') {
                    reward += 100; // Bonus por cumplir objetivo
                    this.learning.recordObjectiveCompleted();
                }
                
                if (this.lastState && this.lastAction) {
                    this.learning.recordExperience(this.lastState, this.lastAction, reward, this.learning.getState(this, foods, [], [], [], [], this.objective));
                }
                
                this.totalReward += reward;
            }
        }
    }

    /**
     * COLISIÓN CON LECHE
     */
    checkMilkCollisions(milks) {
        for (let i = milks.length - 1; i >= 0; i--) {
            const milk = milks[i];
            const centerX = this.x + this.size / 2;
            const centerY = this.y + this.size / 2;
            const dist = Math.hypot(milk.x - centerX, milk.y - centerY);
            
            if (dist < this.size / 2 + 15) {
                this.energy = Math.min(this.maxEnergy, this.energy + 50);
                this.milkDrunk++;
                milks.splice(i, 1);
                
                let reward = 40;
                if (this.objective === 'milk') {
                    reward += 100;
                    this.learning.recordObjectiveCompleted();
                }
                
                if (this.lastState && this.lastAction) {
                    this.learning.recordExperience(this.lastState, this.lastAction, reward, this.learning.getState(this, [], [], [], milks, [], this.objective));
                }
                
                this.totalReward += reward;
            }
        }
    }

    /**
     * COLISIÓN CON BANDERA
     */
    checkFlagCollisions(flags) {
        for (let i = flags.length - 1; i >= 0; i--) {
            const flag = flags[i];
            const centerX = this.x + this.size / 2;
            const centerY = this.y + this.size / 2;
            const dist = Math.hypot(flag.x - centerX, flag.y - centerY);
            
            if (dist < this.size / 2 + 15) {
                this.flagsReached++;
                flags.splice(i, 1);
                
                let reward = 200;
                if (this.objective === 'flag') {
                    reward += 200;
                    this.learning.recordObjectiveCompleted();
                }
                
                if (this.lastState && this.lastAction) {
                    this.learning.recordExperience(this.lastState, this.lastAction, reward, this.learning.getState(this, [], [], [], [], flags, this.objective));
                }
                
                this.totalReward += reward;
            }
        }
    }

    /**
     * ACTUALIZAR ÁNIMO
     */
    updateMood() {
        this.spikeDamage = false;
        
        if (this.energy < 20) {
            this.mood = 'dying';
        } else if (this.energy < 40) {
            this.mood = 'tired';
        } else if (this.energy > 80) {
            this.mood = 'happy';
        } else {
            this.mood = 'neutral';
        }
    }

    /**
     * DIBUJAR AGENTE CON EXPRESIÓN
     */
    draw(ctx) {
        // Cuerpo
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Borde
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Ojos (posición según expresión)
        const eyeY = this.mood === 'tired' ? this.y + 12 : this.y + 8;
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, eyeY, 6, 6);
        ctx.fillRect(this.x + 19, eyeY, 6, 6);
        
        // Pupilas (expresión emocional)
        ctx.fillStyle = '#000';
        if (this.mood === 'dying') {
            ctx.fillRect(this.x + 6, eyeY + 1, 4, 4);
            ctx.fillRect(this.x + 20, eyeY + 1, 4, 4);
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x + 5, eyeY, 6, 6);
            ctx.strokeRect(this.x + 19, eyeY, 6, 6);
        } else if (this.mood === 'tired') {
            ctx.fillRect(this.x + 6, eyeY + 3, 4, 2);
            ctx.fillRect(this.x + 20, eyeY + 3, 4, 2);
        } else if (this.mood === 'happy') {
            ctx.fillRect(this.x + 6, eyeY + 2, 4, 4);
            ctx.fillRect(this.x + 20, eyeY + 2, 4, 4);
        } else {
            ctx.fillRect(this.x + 6, eyeY + 2, 4, 4);
            ctx.fillRect(this.x + 20, eyeY + 2, 4, 4);
        }
        
        // Mostrar objetivo objetivo
        if (this.objective === 'food') {
            ctx.fillText('🍎', this.x + 5, this.y - 5);
        } else if (this.objective === 'milk') {
            ctx.fillText('🥛', this.x + 5, this.y - 5);
        } else if (this.objective === 'flag') {
            ctx.fillText('🚩', this.x + 5, this.y - 5);
        } else if (this.objective === 'no_jump') {
            ctx.fillText('🚫', this.x + 5, this.y - 5);
        }
    }
}

/**
 * CLASE COMIDA
 */
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
        this.pulse += 0.05;
    }

    draw(ctx) {
        const scale = 1 + Math.sin(this.pulse) * 0.15;
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 5, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * CLASE LECHE
 */
class Milk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.wobble = 0;
    }

    update() {
        this.wobble += 0.08;
        this.y = Math.sin(this.wobble) * 3 + this.y;
    }

    draw(ctx) {
        // Vaso de leche
        ctx.fillStyle = '#FFF8DC';
        ctx.fillRect(this.x - 8, this.y, 16, 20);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 8, this.y, 16, 20);
        
        // Contenido
        ctx.fillStyle = '#FFFACD';
        ctx.fillRect(this.x - 7, this.y + 5, 14, 10);
    }
}

/**
 * CLASE PINCHO
 */
class Spike {
    constructor(x, y) {
        this.x = Math.max(0, Math.min(x, 760));
        this.y = Math.max(0, Math.min(y, 420));
        this.size = 25;
    }

    draw(ctx) {
        // Triángulo peligroso
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#990000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

/**
 * CLASE BLOQUE
 */
class Block {
    constructor(x, y) {
        this.x = Math.max(0, Math.min(x, 760));
        this.y = Math.max(0, Math.min(y, 430));
        this.size = 40;
    }

    draw(ctx) {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + (i + 1) * 10, this.y);
            ctx.lineTo(this.x + (i + 1) * 10, this.y + this.size);
            ctx.stroke();
        }
    }
}

/**
 * CLASE BANDERA
 */
class Flag {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.flagSize = 30;
        this.wavePhase = 0;
    }

    update() {
        this.wavePhase += 0.1;
    }

    draw(ctx) {
        // Poste
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 3, this.y, 6, 40);
        
        // Bandera con onda
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(this.x + 3, this.y + 10);
        
        for (let i = 0; i <= this.flagSize; i += 5) {
            const wave = Math.sin(this.wavePhase + i / 10) * 5;
            ctx.lineTo(this.x + 3 + i, this.y + 10 + wave);
        }
        
        ctx.lineTo(this.x + 3, this.y + 30);
        ctx.closePath();
        ctx.fill();
    }
}
