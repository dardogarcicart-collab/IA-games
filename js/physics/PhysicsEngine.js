/**
 * SISTEMA DE FÍSICA REALISTA
 * ===========================
 * Simulación física detallada con variables newtonianas y biomecánicas
 */

class PhysicsEngine {
    constructor() {
        // ==========================================
        // CONSTANTES FÍSICAS
        // ==========================================
        this.gravity = 0.6; // m/s²
        this.jumpPower = -12; // Velocidad inicial del salto
        this.moveSpeed = 3; // Velocidad de movimiento
        this.friction = 0.88; // Fricción del aire
        this.groundFriction = 0.7; // Fricción en el suelo
        this.restitution = 0.3; // Elasticidad de colisiones
        
        // ==========================================
        // VARIABLES BIOMECÁNICAS
        // ==========================================
        this.muscleStrength = 1.0; // Fuerza muscular (0-1)
        this.metabolism = {
            basalMetabolicRate: 1.2, // Calorías por segundo en reposo
            movementMultiplier: 2.5, // Factor de aumento con movimiento
            jumpMultiplier: 15.0, // Factor de costo de salto
            muscleRecovery: 0.98 // Recuperación de fatiga muscular
        };
        
        // ==========================================
        // BIOMECÁNICA
        // ==========================================
        this.biomechanics = {
            muscularFatigue: 0, // 0-1
            lactateLevel: 0, // Ácido láctico
            oxygenDebt: 0, // Deuda de oxígeno
            muscleTemperature: 36.5,
            jointFlexibility: 1.0
        };
        
        // ==========================================
        // PROPIEDADES DE MOVIMIENTO
        // ==========================================
        this.maxVelocityX = 5;
        this.maxVelocityY = 15;
        this.acceleration = 0.15;
        this.deceleration = 0.1;
    }
    
    /**
     * APLICAR GRAVEDAD
     */
    applyGravity(agent) {
        agent.vy += this.gravity;
        
        // Limite de caída
        if (agent.vy > this.maxVelocityY) {
            agent.vy = this.maxVelocityY;
        }
    }
    
    /**
     * APLICAR MOVIMIENTO HORIZONTAL CON ACELERACIÓN
     */
    applyMovement(agent, direction) {
        if (direction === 'left') {
            agent.vx = Math.max(-this.maxVelocityX, agent.vx - this.acceleration);
        } else if (direction === 'right') {
            agent.vx = Math.min(this.maxVelocityX, agent.vx + this.acceleration);
        }
    }
    
    /**
     * APLICAR FRICCIÓN
     */
    applyFriction(agent, onGround) {
        if (onGround) {
            // Más fricción en el suelo
            agent.vx *= this.groundFriction;
            if (Math.abs(agent.vx) < 0.1) {
                agent.vx = 0;
            }
        } else {
            // Fricción en el aire
            agent.vx *= this.friction;
        }
    }
    
    /**
     * APLICAR SALTO
     */
    applyJump(agent, jumpPenalty) {
        if (agent.onGround) {
            // Salto exitoso
            agent.vy = this.jumpPower * (1 + this.biomechanics.muscularFatigue * 0.3);
            agent.isJumping = true;
            
            // Costo energético del salto
            const jumpCost = 3;
            const fatigueCost = jumpPenalty ? jumpCost : jumpCost * 0.5;
            
            // Actualizar biomecánica
            this.biomechanics.muscularFatigue = Math.min(1, this.biomechanics.muscularFatigue + 0.15);
            this.biomechanics.lactateLevel = Math.min(1, this.biomechanics.lactateLevel + 0.2);
            this.biomechanics.muscleTemperature += 0.2;
            
            return { success: true, energyCost: fatigueCost };
        } else {
            // Intento fallido de salto
            this.biomechanics.lactateLevel += 0.1;
            return { success: false, energyCost: 1 };
        }
    }
    
    /**
     * CALCULAR CONSUMO METABÓLICO TOTAL
     */
    calculateMetabolicCost(agent) {
        const speed = Math.abs(agent.vx);
        const isJumping = agent.vy < -1;
        
        let cost = this.metabolism.basalMetabolicRate;
        
        // Costo de movimiento
        if (speed > 0.5) {
            cost += speed * this.metabolism.movementMultiplier;
        }
        
        // Costo de salto
        if (isJumping) {
            cost += this.metabolism.jumpMultiplier;
        }
        
        // Costo de fatiga muscular
        cost *= (1 + this.biomechanics.muscularFatigue * 0.5);
        
        // Recuperación de fatiga
        this.biomechanics.muscularFatigue *= this.metabolism.muscleRecovery;
        
        // Recuperación de ácido láctico
        this.biomechanics.lactateLevel = Math.max(0, this.biomechanics.lactateLevel - 0.01);
        
        // Recuperación de temperatura
        if (this.biomechanics.muscleTemperature > 36.5) {
            this.biomechanics.muscleTemperature -= 0.05;
        }
        
        return cost;
    }
    
    /**
     * ACTUALIZAR POSICIÓN
     */
    updatePosition(agent) {
        agent.x += agent.vx;
        agent.y += agent.vy;
    }
    
    /**
     * VERIFICAR COLISIÓN CON LÍMITES
     */
    applyWorldBoundaries(agent, canvas) {
        // Límites horizontales
        if (agent.x < 0) {
            agent.x = 0;
            agent.vx = Math.abs(agent.vx) * this.restitution;
        }
        if (agent.x > canvas.width - agent.size) {
            agent.x = canvas.width - agent.size;
            agent.vx = -Math.abs(agent.vx) * this.restitution;
        }
        
        // Límites verticales (suelo)
        const groundLevel = canvas.height - 50 - agent.size;
        if (agent.y >= groundLevel) {
            agent.y = groundLevel;
            agent.vy = 0;
            agent.onGround = true;
            agent.isJumping = false;
        } else {
            agent.onGround = false;
        }
    }
    
    /**
     * DETECTAR Y RESOLVER COLISIÓN CON BLOQUES
     */
    resolveBlockCollisions(agent, blocks) {
        for (let block of blocks) {
            if (this.isCollidingWithBlock(agent, block)) {
                this.resolveBlockCollision(agent, block);
            }
        }
    }
    
    /**
     * Verificar si hay colisión
     */
    isCollidingWithBlock(agent, block) {
        return agent.x < block.x + block.size &&
               agent.x + agent.size > block.x &&
               agent.y < block.y + block.size &&
               agent.y + agent.size > block.y;
    }
    
    /**
     * Resolver colisión
     */
    resolveBlockCollision(agent, block) {
        const dx = (agent.x + agent.size / 2) - (block.x + block.size / 2);
        const dy = (agent.y + agent.size / 2) - (block.y + block.size / 2);
        const width = block.size + agent.size;
        const height = block.size + agent.size;
        
        // Colisión desde arriba
        if (dy < dx && dy < -dx && agent.vy > 0) {
            agent.y = block.y - agent.size;
            agent.vy = 0;
            agent.onGround = true;
            agent.isJumping = false;
        }
        // Colisión desde abajo
        else if (dy > -dx && dy > dx && agent.vy < 0) {
            agent.y = block.y + block.size;
            agent.vy = 0;
        }
        // Colisión lateral
        else {
            if (dx > 0) {
                agent.x = block.x + block.size;
            } else {
                agent.x = block.x - agent.size;
            }
            agent.vx *= this.restitution;
        }
    }
    
    /**
     * OBTENER ESTADO BIOMECÁNICO
     */
    getBiomechanicStatus() {
        return {
            muscularFatigue: (this.biomechanics.muscularFatigue * 100).toFixed(1) + '%',
            lactateLevel: (this.biomechanics.lactateLevel * 100).toFixed(1) + '%',
            oxygenDebt: (this.biomechanics.oxygenDebt * 100).toFixed(1) + '%',
            muscleTemperature: this.biomechanics.muscleTemperature.toFixed(1) + '°C',
            jointFlexibility: (this.biomechanics.jointFlexibility * 100).toFixed(1) + '%'
        };
    }
    
    /**
     * OBTENER PARÁMETROS FÍSICOS
     */
    getPhysicsStats() {
        return {
            gravity: this.gravity.toFixed(2),
            friction: this.friction.toFixed(2),
            restitution: this.restitution.toFixed(2),
            basalMetabolicRate: this.metabolism.basalMetabolicRate.toFixed(3),
            maxVelocity: Math.max(this.maxVelocityX, this.maxVelocityY).toFixed(2)
        };
    }
}
