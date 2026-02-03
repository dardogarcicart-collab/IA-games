/**
 * CLASES BASE DEL SISTEMA
 * Agente, Comida, Bloques
 */

class Agent {
    constructor(canvas) {
        this.canvas = canvas;
        
        // POSICIÓN Y VELOCIDAD
        this.x = canvas.width / 3;
        this.y = canvas.height - 100;
        this.vx = 0;
        this.vy = 0;
        this.size = 30;
        
        // ESTADO FÍSICO
        this.onGround = false;
        this.isJumping = false;
        this.color = '#FF6B6B';
        
        // ENERGÍA
        this.energy = 100;
        this.maxEnergy = 100;
        
        // EMOCIONES
        this.mood = 'neutral';
        
        // ESTADÍSTICAS
        this.foodEaten = 0;
        this.jumpCount = 0;
        this.consecutiveFailures = 0;
        this.totalReward = 0;
        
        // SISTEMAS
        this.brain = new CognitiveSystem(this);
        this.learning = new LearningSystem();
        this.physics = new PhysicsEngine();
        
        // CONTROL INTERNO
        this.lastState = null;
        this.lastAction = null;
    }

    update(foods, blocks, jumpPenalty) {
        // 1. Percibir
        this.brain.perceiveEnvironment(foods, blocks);
        
        // 2. Obtener estado actual
        const currentState = this.learning.getState(this, foods, blocks);
        
        // 3. Obtener tabla Q
        const qValues = this.learning.getQValues(currentState);
        
        // 4. Tomar decisión
        const decision = this.brain.makeDecision(currentState, qValues, this.learning.epsilon);
        
        // 5. Procesar experiencia anterior
        if (this.lastState !== null && this.lastAction !== null) {
            let reward = -0.05;
            if (this.energy < 50) reward -= 0.1;
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
        
        // 8. Colisiones con comida
        this.checkFoodCollisions(foods);
        
        // 9. Consumir energía
        const cost = this.physics.calculateMetabolicCost(this);
        this.energy = Math.max(0, this.energy - cost);
        
        // 10. Actualizar ánimo
        this.updateMood();
        
        // 11. Actualizar epsilon
        this.learning.updateEpsilon();
    }

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
                    if (jumpPenalty) {
                        this.energy = Math.max(0, this.energy - jumpResult.energyCost);
                    }
                } else {
                    this.consecutiveFailures++;
                }
                break;
            case 'idle':
                this.vx *= 0.7;
                break;
        }
    }

    checkFoodCollisions(foods) {
        for (let i = foods.length - 1; i >= 0; i--) {
            const food = foods[i];
            const centerX = this.x + this.size / 2;
            const centerY = this.y + this.size / 2;
            const dist = Math.hypot(food.x - centerX, food.y - centerY);
            
            if (dist < this.size / 2 + 15) {
                // ¡COMIDA!
                this.energy = Math.min(this.maxEnergy, this.energy + 35);
                this.foodEaten++;
                foods.splice(i, 1);
                
                // Recompensa
                let reward = 50;
                if (this.lastState && this.lastAction) {
                    this.learning.recordExperience(this.lastState, this.lastAction, reward, this.learning.getState(this, foods, []));
                }
                
                this.totalReward += reward;
                this.consecutiveFailures = 0;
            }
        }
    }

    updateMood() {
        if (this.energy < 20) {
            this.mood = 'tired';
        } else if (this.energy < 50) {
            this.mood = 'angry';
        } else {
            this.mood = 'neutral';
        }
    }

    draw(ctx) {
        // Cuerpo
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Borde
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Ojos
        const eyeY = this.y + 8;
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, eyeY, 5, 5);
        ctx.fillRect(this.x + 20, eyeY, 5, 5);
        
        // Pupils (expresión según ánimo)
        ctx.fillStyle = '#000';
        if (this.mood === 'angry') {
            ctx.fillRect(this.x + 6, eyeY + 1, 3, 3);
            ctx.fillRect(this.x + 21, eyeY + 1, 3, 3);
        } else if (this.mood === 'tired') {
            ctx.fillRect(this.x + 6, eyeY + 3, 3, 2);
            ctx.fillRect(this.x + 21, eyeY + 3, 3, 2);
        } else {
            ctx.fillRect(this.x + 6, eyeY + 2, 3, 3);
            ctx.fillRect(this.x + 21, eyeY + 2, 3, 3);
        }
    }
}

class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.pulse = 0;
    }

    update() {
        this.pulse += 0.05;
    }

    draw(ctx) {
        // Manzana roja
        const scale = 1 + Math.sin(this.pulse) * 0.1;
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 5, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Block {
    constructor(x, y) {
        this.x = Math.max(0, Math.min(x, 760));
        this.y = Math.max(0, Math.min(y, 430));
        this.size = 40;
    }

    draw(ctx) {
        // Bloque
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Borde
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Textura
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
