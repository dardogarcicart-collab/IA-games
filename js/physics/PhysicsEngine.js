/**
 * SISTEMA DE FÍSICA REALISTA
 * Simula movimiento, gravedad, colisiones
 */
class PhysicsEngine {
    constructor() {
        this.gravity = 0.6;
        this.jumpPower = -12;
        this.moveSpeed = 3;
        this.friction = 0.88;
        this.groundFriction = 0.7;
        this.maxVelocityX = 5;
        this.maxVelocityY = 15;
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
            agent.vx = -this.moveSpeed;
        } else if (direction === 'right') {
            agent.vx = this.moveSpeed;
        }
    }

    applyJump(agent, jumpPenalty) {
        if (agent.onGround) {
            agent.vy = this.jumpPower;
            agent.isJumping = true;
            agent.onGround = false;
            return { success: true, energyCost: jumpPenalty ? 2 : 0 };
        }
        return { success: false, energyCost: 0 };
    }

    updatePosition(agent) {
        agent.x += agent.vx;
        agent.y += agent.vy;
    }

    applyWorldBoundaries(agent, canvas) {
        const groundLevel = canvas.height - 50 - agent.size;
        
        // Límites horizontales
        if (agent.x < 0) agent.x = 0;
        if (agent.x > canvas.width - agent.size) {
            agent.x = canvas.width - agent.size;
        }
        
        // Límites verticales
        if (agent.y >= groundLevel) {
            agent.y = groundLevel;
            agent.onGround = true;
            agent.isJumping = false;
        } else {
            agent.onGround = false;
        }
    }

    calculateMetabolicCost(agent) {
        let cost = 0.03;
        
        if (Math.abs(agent.vx) > 0.5) {
            cost += 0.02;
        }
        
        if (agent.isJumping) {
            cost += 0.05;
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
                if (agent.y + agent.size <= block.y + 10) {
                    agent.y = block.y - agent.size;
                    agent.vy = 0;
                    agent.onGround = true;
                }
                // Colisión desde abajo
                else if (agent.y >= block.y + block.size - 10) {
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
}
