/**
 * SISTEMA DE FÍSICA REALISTA
 */
class PhysicsEngine {
    constructor() {
        this.gravity = 0.6;
        this.jumpPower = -13;
        this.moveSpeed = 2.5;
        this.friction = 0.85;
        this.groundFriction = 0.6;
        this.maxVelocityX = 5;
        this.maxVelocityY = 15;
        
        // Costos metabólicos
        this.basalCost = 0.02;
        this.movementCost = 0.02;
        this.jumpCost = 3; // Costo energético del salto
    }

    applyGravity(agent) {
        if (!agent.onGround) {
            agent.vy += this.gravity;
            if (agent.vy > this.maxVelocityY) {
                agent.vy = this.maxVelocityY;
            }
        } else {
            agent.vy = 0;
        }
    }

    applyFriction(agent, onGround) {
        if (onGround) {
            agent.vx *= this.groundFriction;
        } else {
            agent.vx *= this.friction;
        }
    }

    applyMovement(agent, direction) {
        if (direction === 'left') {
            agent.vx = Math.max(-this.moveSpeed, agent.vx - 0.5);
        } else if (direction === 'right') {
            agent.vx = Math.min(this.moveSpeed, agent.vx + 0.5);
        }
    }

    applyJump(agent, jumpPenalty) {
        if (agent.onGround) {
            agent.vy = this.jumpPower;
            agent.onGround = false;
            agent.isJumping = true;
            
            // Registrar costo del salto
            const cost = jumpPenalty ? this.jumpCost : 0;
            agent.brain.recordJumpCost(cost);
            
            return { success: true, energyCost: cost };
        }
        return { success: false, energyCost: 0 };
    }

    updatePosition(agent) {
        agent.x += agent.vx;
        agent.y += agent.vy;
    }

    applyWorldBoundaries(agent, canvas) {
        const groundLevel = canvas.height - 50 - agent.size;
        
        if (agent.x < 0) agent.x = 0;
        if (agent.x > canvas.width - agent.size) {
            agent.x = canvas.width - agent.size;
        }
        
        if (agent.y >= groundLevel) {
            agent.y = groundLevel;
            agent.onGround = true;
            agent.isJumping = false;
        } else {
            agent.onGround = false;
        }
    }

    calculateMetabolicCost(agent) {
        let cost = this.basalCost;
        
        if (Math.abs(agent.vx) > 0.5) {
            cost += this.movementCost;
        }
        
        return cost;
    }

    resolveBlockCollisions(agent, blocks) {
        for (let block of blocks) {
            const collidingX = agent.x < block.x + block.size &&
                              agent.x + agent.size > block.x;
            const collidingY = agent.y < block.y + block.size &&
                              agent.y + agent.size > block.y;
            
            if (collidingX && collidingY) {
                // Colisión desde arriba
                if (agent.y + agent.size <= block.y + 15) {
                    agent.y = block.y - agent.size;
                    agent.vy = 0;
                    agent.onGround = true;
                }
                // Colisión desde abajo
                else if (agent.y >= block.y + block.size - 15) {
                    agent.y = block.y + block.size;
                    agent.vy = 0;
                }
                // Colisión lateral
                else {
                    if (agent.x < block.x) {
                        agent.x = block.x - agent.size;
                    } else {
                        agent.x = block.x + block.size;
                    }
                    agent.vx = 0;
                }
            }
        }
    }

    checkSpikeCollisions(agent, spikes) {
        for (let spike of spikes) {
            const collidingX = agent.x < spike.x + spike.size &&
                              agent.x + agent.size > spike.x;
            const collidingY = agent.y < spike.y + spike.size &&
                              agent.y + agent.size > spike.y;
            
            if (collidingX && collidingY) {
                // Daño del pincho
                agent.energy = Math.max(0, agent.energy - 20);
                agent.spikeDamage = true;
                return true;
            }
        }
        return false;
    }
}
