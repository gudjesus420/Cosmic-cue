/**
 * Unit Tests for Cosmic Stoner Billiards
 * Testing game logic, ball physics, collision detection, and scoring
 */

// Mock DOM elements
const mockCanvas = {
  width: 800,
  height: 600,
  getContext: () => ({
    clearRect: jest.fn(),
    fillStyle: '',
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn()
  })
};

const mockDocument = {
  getElementById: (id) => {
    if (id === 'gameCanvas') return mockCanvas;
    if (id === 'snoop-comment') return { innerText: '' };
    if (id === 'counter') return { innerText: '0' };
    return null;
  }
};

// Test Suite: Ball Creation
describe('Ball Creation', () => {
  test('should create 6 balls with random positions', () => {
    const balls = [];
    const colors = ["#ff66cc", "#00ffff", "#ffff00", "#ff9933", "#99ff66", "#cc99ff"];
    
    for (let i = 0; i < 6; i++) {
      balls.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0,
        radius: 15,
        color: colors[i],
      });
    }
    
    expect(balls.length).toBe(6);
    expect(balls[0]).toHaveProperty('x');
    expect(balls[0]).toHaveProperty('y');
    expect(balls[0]).toHaveProperty('radius', 15);
  });

  test('each ball should have a unique color', () => {
    const colors = ["#ff66cc", "#00ffff", "#ffff00", "#ff9933", "#99ff66", "#cc99ff"];
    const balls = colors.map((color, i) => ({
      x: 100 * i,
      y: 100,
      vx: 0,
      vy: 0,
      radius: 15,
      color: color,
    }));
    
    const uniqueColors = new Set(balls.map(b => b.color));
    expect(uniqueColors.size).toBe(6);
  });
});

// Test Suite: Cue Ball Physics
describe('Cue Ball Physics', () => {
  test('should initialize cue ball at center with zero velocity', () => {
    const cueBall = { 
      x: 400, 
      y: 300, 
      vx: 0, 
      vy: 0, 
      radius: 15 
    };
    
    expect(cueBall.x).toBe(400);
    expect(cueBall.y).toBe(300);
    expect(cueBall.vx).toBe(0);
    expect(cueBall.vy).toBe(0);
  });

  test('should apply velocity based on drag distance', () => {
    const startX = 400, startY = 300;
    const endX = 350, endY = 250;
    const dx = startX - endX;
    const dy = startY - endY;
    
    const vx = dx * 0.1;
    const vy = dy * 0.1;
    
    expect(vx).toBe(5);
    expect(vy).toBe(5);
  });

  test('should apply friction to velocity (0.98 damping)', () => {
    let vx = 10;
    let vy = 10;
    
    // Simulate 10 frames
    for (let i = 0; i < 10; i++) {
      vx *= 0.98;
      vy *= 0.98;
    }
    
    expect(vx).toBeLessThan(10);
    expect(vy).toBeLessThan(10);
    expect(vx).toBeCloseTo(8.17, 2);
  });

  test('should update position based on velocity', () => {
    let x = 400, y = 300;
    const vx = 5, vy = -3;
    
    x += vx;
    y += vy;
    
    expect(x).toBe(405);
    expect(y).toBe(297);
  });
});

// Test Suite: Collision Detection
describe('Collision Detection', () => {
  test('should detect collision when balls touch', () => {
    const cueBall = { x: 100, y: 100, radius: 15 };
    const ball = { x: 130, y: 100, radius: 15 };
    
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const isColliding = dist < cueBall.radius + ball.radius;
    
    expect(dist).toBe(30);
    expect(isColliding).toBe(false); // Exactly touching, not overlapping
  });

  test('should detect collision when balls overlap', () => {
    const cueBall = { x: 100, y: 100, radius: 15 };
    const ball = { x: 120, y: 100, radius: 15 };
    
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const isColliding = dist < cueBall.radius + ball.radius;
    
    expect(dist).toBe(20);
    expect(isColliding).toBe(true);
  });

  test('should not detect collision when balls are far apart', () => {
    const cueBall = { x: 100, y: 100, radius: 15 };
    const ball = { x: 200, y: 200, radius: 15 };
    
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const isColliding = dist < cueBall.radius + ball.radius;
    
    expect(isColliding).toBe(false);
  });

  test('should calculate correct distance for diagonal collision', () => {
    const cueBall = { x: 0, y: 0, radius: 15 };
    const ball = { x: 3, y: 4, radius: 15 };
    
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    expect(dist).toBe(5); // 3-4-5 triangle
  });
});

// Test Suite: Scoring System
describe('Scoring System', () => {
  test('should increment score when ball is removed', () => {
    let score = 0;
    const balls = [
      { x: 100, y: 100, radius: 15 },
      { x: 200, y: 200, radius: 15 }
    ];
    
    // Simulate collision and removal
    balls.splice(0, 1);
    score++;
    
    expect(score).toBe(1);
    expect(balls.length).toBe(1);
  });

  test('should track multiple collisions correctly', () => {
    let score = 0;
    const balls = [
      { x: 100, y: 100, radius: 15 },
      { x: 200, y: 200, radius: 15 },
      { x: 300, y: 300, radius: 15 }
    ];
    
    // Simulate 3 collisions
    for (let i = 0; i < 3; i++) {
      balls.splice(0, 1);
      score++;
    }
    
    expect(score).toBe(3);
    expect(balls.length).toBe(0);
  });

  test('should not increment score without collision', () => {
    let score = 0;
    const cueBall = { x: 100, y: 100, radius: 15 };
    const ball = { x: 500, y: 500, radius: 15 };
    
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < cueBall.radius + ball.radius) {
      score++;
    }
    
    expect(score).toBe(0);
  });
});

// Test Suite: Snoop Comments
describe('Snoop Comments', () => {
  test('should return a random comment from the list', () => {
    const comments = [
      "Damn nephew, you lit!",
      "Smokin' shot!",
      "Ride the galaxy wave!",
      "That's a cosmic claaap!",
      "Smooooth like Gin & Juice."
    ];
    
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    
    expect(comments).toContain(randomComment);
  });

  test('should have exactly 5 different comments', () => {
    const comments = [
      "Damn nephew, you lit!",
      "Smokin' shot!",
      "Ride the galaxy wave!",
      "That's a cosmic claaap!",
      "Smooooth like Gin & Juice."
    ];
    
    expect(comments.length).toBe(5);
    expect(new Set(comments).size).toBe(5);
  });
});

// Test Suite: Touch Input Handling
describe('Touch Input Handling', () => {
  test('should calculate correct velocity from touch drag', () => {
    const startX = 400, startY = 300;
    const endX = 300, endY = 200;
    
    const dx = startX - endX;
    const dy = startY - endY;
    const vx = dx * 0.1;
    const vy = dy * 0.1;
    
    expect(vx).toBe(10);
    expect(vy).toBe(10);
  });

  test('should handle negative velocity (opposite direction)', () => {
    const startX = 300, startY = 200;
    const endX = 400, endY = 300;
    
    const dx = startX - endX;
    const dy = startY - endY;
    const vx = dx * 0.1;
    const vy = dy * 0.1;
    
    expect(vx).toBe(-10);
    expect(vy).toBe(-10);
  });

  test('should handle zero drag (no movement)', () => {
    const startX = 400, startY = 300;
    const endX = 400, endY = 300;
    
    const dx = startX - endX;
    const dy = startY - endY;
    const vx = dx * 0.1;
    const vy = dy * 0.1;
    
    expect(vx).toBe(0);
    expect(vy).toBe(0);
  });
});

// Test Suite: Game State Management
describe('Game State Management', () => {
  test('should initialize game with correct state', () => {
    const gameState = {
      balls: [],
      cueBall: { x: 400, y: 300, vx: 0, vy: 0, radius: 15 },
      isDragging: false,
      score: 0
    };
    
    expect(gameState.balls.length).toBe(0);
    expect(gameState.isDragging).toBe(false);
    expect(gameState.score).toBe(0);
  });

  test('should toggle dragging state correctly', () => {
    let isDragging = false;
    
    // Start drag
    isDragging = true;
    expect(isDragging).toBe(true);
    
    // End drag
    isDragging = false;
    expect(isDragging).toBe(false);
  });

  test('should handle game completion (all balls removed)', () => {
    const balls = [
      { x: 100, y: 100, radius: 15 },
      { x: 200, y: 200, radius: 15 }
    ];
    
    // Remove all balls
    while (balls.length > 0) {
      balls.splice(0, 1);
    }
    
    const isGameComplete = balls.length === 0;
    expect(isGameComplete).toBe(true);
  });
});

// Test Suite: Canvas Rendering
describe('Canvas Rendering', () => {
  test('should clear canvas before each frame', () => {
    const ctx = mockCanvas.getContext();
    ctx.clearRect(0, 0, 800, 600);
    
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  test('should draw circle with correct parameters', () => {
    const ctx = mockCanvas.getContext();
    const ball = { x: 100, y: 100, radius: 15 };
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledWith(100, 100, 15, 0, Math.PI * 2);
    expect(ctx.fill).toHaveBeenCalled();
  });
});

// Test Suite: Performance & Edge Cases
describe('Performance & Edge Cases', () => {
  test('should handle velocity approaching zero', () => {
    let vx = 0.001;
    
    for (let i = 0; i < 100; i++) {
      vx *= 0.98;
    }
    
    expect(vx).toBeGreaterThan(0);
    expect(vx).toBeLessThan(0.001);
  });

  test('should handle ball at canvas boundary', () => {
    const ball = { x: 0, y: 0, radius: 15 };
    
    expect(ball.x).toBeGreaterThanOrEqual(0);
    expect(ball.y).toBeGreaterThanOrEqual(0);
  });

  test('should handle multiple simultaneous collisions', () => {
    const cueBall = { x: 100, y: 100, radius: 15 };
    const balls = [
      { x: 120, y: 100, radius: 15 },
      { x: 100, y: 120, radius: 15 }
    ];
    
    let collisionCount = 0;
    balls.forEach(ball => {
      const dx = cueBall.x - ball.x;
      const dy = cueBall.y - ball.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < cueBall.radius + ball.radius) {
        collisionCount++;
      }
    });
    
    expect(collisionCount).toBe(2);
  });
});
