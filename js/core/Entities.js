/**
 * CLASES BASE DEL SISTEMA
 * =======================
 * Definiciones de entidades: Agente, Comida, Bloques
 */

class Agent {
    constructor(canvas) {
        this.canvas = canvas;
        
        // ==========================================
        // POSICIÓN Y VELOCIDAD
        // ==========================================
        this.x = canvas.width / 3;
        this.y = canvas.height - 100;
        this.vx = 0;
        this.vy = 0;
        this.size = 30;
        
        // ==========================================
        // ESTADO FÍSICO
        // ==========================================
        this.onGround = false;
        this.isJumping = false;
        this.color = '#FF6B6B';
        
        // ==========================================
        // SISTEMA DE ENERGÍA
        // ==========================================
        this.energy = 100;
        this.maxEnergy = 100;
        this.baseConsumption = 0.03;
        
        // ==========================================
        // ESTADO EMOCIONAL
        // ==========================================
        this.mood = 'neutral'; // neutral, angry, tired
        this.emotionDecay = 0;
        this.consecutiveFailures = 0;
        
        // ==========================================
        // ESTADÍSTICAS
        // ==========================================
        this.foodEaten = 0;
        this.jumpCount = 0;
        this.failedJumpAttempts = 0;
        this.totalReward = 0;
        
        // ==========================================
        // SISTEMAS PRINCIPALES
        // ==========================================
        this.brain = new CognitiveSystem(this);
        this.learning = new LearningSystem(0.15, 0.95);
        this.physics = new PhysicsEngine();
        
        // ==========================================
        // CONTROL INTERNO
        // ==========================================
        this.lastState = null;
        this.lastAction = null;
        this.lastReward = 0;
        this.experienceCount = 0;
    }
    
    /**
     * CICLO PRINCIPAL DE ACTUALIZACIÓN
     */
    update(foods, blocks, jumpPenalty) {
        // 1. PERCEPCIÓN
        this.brain.perceiveEnvironment(foods, blocks);
        
        // 2. OBTENER ESTADO ACTUAL
        const currentState = this.learning.getState(this, foods, blocks);
        
        // 3. PENSAMIENTO Y DECISIÓN
        const qValues = this.learning.getQValues(currentState);
        const decision = this.brain.makeDecision(currentState, qValues, this.learning.epsilon);
        
        // 4. PROCESAMIENTO DE EXPERIENCIA ANTERIOR
        if (this.lastState !== null && this.lastAction !== null) {
            let reward = -0.05; // Penalización pasiva
            
            if (this.energy < 50) {
                reward -= 0.1;
            }
            
            this.learning.recordExperience(this.lastState, this.lastAction, reward, currentState);
        }
        
        this.lastState = currentState;
        this.lastAction = decision.action;
        
        // 5. EJECUCIÓN DE ACCIÓN
        this.executeAction(decision.action, jumpPenalty);
        
        // 6. FÍSICA
        this.physics.applyGravity(this);
        this.physics.applyFriction(this, this.onGround);
        this.physics.updatePosition(this);
        this.physics.applyWorldBoundaries(this, this.canvas);
        this.physics.resolveBlockCollisions(this, blocks);
        
        // 7. COLISIONES CON COMIDA
        this.checkFoodCollisions(foods);
        
        // 8. CONSUMO DE ENERGÍA
        const metabolicCost = this.physics.calculateMetabolicCost(this);
        this.energy = Math.max(0, this.energy - metabolicCost);
        
        // 9. ESTADO EMOCIONAL
        this.updateMood();
        
        // 10. APRENDIZAJE
        this.learning.updateEpsilon();
    }
    
    /**
     * EJECUTAR ACCIÓN SELECCIONADA
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
                this.jumpCount++;
                
                if (jumpResult.success) {
                    if (jumpPenalty) {
                        this.energy = Math.max(0, this.energy - jumpResult.energyCost);
                        this.lastReward -= 2;
                    }
                    this.consecutiveFailures = 0;
                } else {
                    this.failedJumpAttempts++;
                    this.consecutiveFailures++;
                    this.lastReward -= 1;
                    this.emotionDecay = Math.min(10, this.emotionDecay + 1);
                }
                break;
            
            case 'idle':
                this.vx *= 0.7;
                this.consecutiveFailures = 0;
                break;
        }
    }
    
    /**
     * DETECTAR COLISIONES CON COMIDA
     */
    checkFoodCollisions(foods) {
        for (let i = foods.length - 1; i >= 0; i--) {
            const food = foods[i];
            const centerX = this.x + this.size / 2;
            const centerY = this.y + this.size / 2;
            const dist = Math.hypot(food.x - centerX, food.y - centerY);
            
            if (dist < this.size / 2 + 20 / 2) {
                // ¡COMIDA ENCONTRADA!
                const energyBefore = this.energy;
                this.energy = Math.min(this.maxEnergy, this.energy + 35);
                this.foodEaten++;
                foods.splice(i, 1);
                
                // RECOMPENSA
                const energyGain = this.energy - energyBefore;
                let reward = 50 + (energyGain * 0.5);
                
                if (energyBefore < 40) {
                    reward *= 1.5;
                }
                
                if (this.lastState && this.lastAction) {
                    this.learning.recordExperience(this.lastState, this.lastAction, reward, this.learning.getState(this, foods, []));
                }
                
                this.lastReward = reward;
                this.totalReward += reward;
                this.consecutiveFailures = 0;
                this.emotionDecay = Math.max(0, this.emotionDecay - 3);
            }
        }
    }
    
    /**
     * ACTUALIZAR ESTADO EMOCIONAL
     */
    updateMood() {
        this.emotionDecay = Math.max(0, this.emotionDecay - 0.3);
        
        if (this.energy < 25) {
            this.mood = 'tired';
        } else if (this.emotionDecay > 5 || (this.consecutiveFailures > 3 && this.energy < 50)) {
            this.mood = 'angry';
        } else {
            this.mood = 'neutral';
        }
    }
    
    /**
     * DIBUJAR AGENTE
     */
    draw(ctx) {
        // Cuerpo
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Borde
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Efecto de energía baja
        if (this.energy < 20 && Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.size + 4, this.size + 4);
        }
        
        // Expresión facial
        this.drawFace(ctx);
    }
    
    /**
     * DIBUJAR CARA CON EMOCIONES
     */
    drawFace(ctx) {
        const cx = this.x + this.size / 2;
        const cy = this.y + this.size / 2;
        
        ctx.lineWidth = 2;
        
        if (this.mood === 'neutral') {
            // Ojos
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(cx - 8, cy - 6, 3, 0, Math.PI * 2);
            ctx.arc(cx + 8, cy - 6, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Boca
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(cx - 9, cy + 9);
            ctx.lineTo(cx + 9, cy + 9);
            ctx.stroke();
            
        } else if (this.mood === 'angry') {
            // Cejas
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy - 10);
            ctx.lineTo(cx - 4, cy - 8);
            ctx.moveTo(cx + 12, cy - 10);
            ctx.lineTo(cx + 4, cy - 8);
            ctx.stroke();
            
            // Ojos rojos
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(cx - 8, cy - 4, 2.5, 0, Math.PI * 2);
            ctx.arc(cx + 8, cy - 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Boca enojada
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.arc(cx, cy + 11, 7, 0, Math.PI, true);
            ctx.stroke();
            
        } else if (this.mood === 'tired') {
            // Ojos cerrados
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy - 6);
            ctx.lineTo(cx - 4, cy - 6);
            ctx.moveTo(cx + 4, cy - 6);
            ctx.lineTo(cx + 12, cy - 6);
            ctx.stroke();
            
            // Boca triste
            ctx.beginPath();
            ctx.arc(cx, cy + 8, 6, Math.PI, 0);
            ctx.stroke();
        }
    }
    
    /**
     * OBTENER ESTADO PARA DEBUG
     */
    getStatus() {
        return {
            position: `(${Math.round(this.x)}, ${Math.round(this.y)})`,
            velocity: `(${this.vx.toFixed(2)}, ${this.vy.toFixed(2)})`,
            energy: Math.round(this.energy),
            mood: this.mood,
            foodEaten: this.foodEaten,
            jumpCount: this.jumpCount,
            totalReward: this.totalReward.toFixed(2)
        };
    }
}

/**
 * CLASE COMIDA
 */
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = Math.max(20, Math.min(y, 430));
        this.size = 20;
        this.pulse = 0;
    }
    
    update() {
        this.pulse = (this.pulse + 0.1) % (Math.PI * 2);
    }
    
    draw(ctx) {
        // Manzana
        ctx.fillStyle = '#FF4444';
        const scale = 1 + Math.sin(this.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 2) * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Tallo
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - (this.size / 2));
        ctx.lineTo(this.x, this.y - (this.size / 2) - 6);
        ctx.stroke();
        
        // Hoja
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(this.x + 6, this.y - (this.size / 2) - 3, 5, 3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
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
        // Bloque
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Borde
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Detalles
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + this.size / 2, this.y);
        ctx.lineTo(this.x + this.size / 2, this.y + this.size);
        ctx.moveTo(this.x, this.y + this.size / 2);
        ctx.lineTo(this.x + this.size, this.y + this.size / 2);
        ctx.stroke();
    }
}
