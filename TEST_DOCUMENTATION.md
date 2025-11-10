# Test Documentation - Cosmic Stoner Billiards

## Overview
This document describes the comprehensive unit test suite for the Cosmic Stoner Billiards game. The tests cover all core game mechanics, physics, collision detection, scoring, and rendering.

## Test Coverage

### 1. Ball Creation Tests
- **Purpose**: Verify that game balls are created correctly with proper properties
- **Tests**:
  - Creates exactly 6 balls
  - Each ball has position (x, y), velocity (vx, vy), and radius properties
  - Each ball has a unique color from the predefined palette

### 2. Cue Ball Physics Tests
- **Purpose**: Validate the physics engine for the cue ball
- **Tests**:
  - Cue ball initializes at canvas center with zero velocity
  - Velocity is calculated correctly from drag distance (0.1x multiplier)
  - Friction is applied correctly (0.98 damping factor per frame)
  - Position updates based on velocity each frame

### 3. Collision Detection Tests
- **Purpose**: Ensure accurate collision detection between balls
- **Tests**:
  - Detects when balls are exactly touching (distance = sum of radii)
  - Detects when balls overlap (distance < sum of radii)
  - No false positives when balls are far apart
  - Correct distance calculation for diagonal collisions (Pythagorean theorem)

### 4. Scoring System Tests
- **Purpose**: Verify score tracking and ball removal
- **Tests**:
  - Score increments when a ball is removed after collision
  - Multiple collisions are tracked correctly
  - Score doesn't increment without collision
  - Ball array length decreases correctly

### 5. Snoop Comments Tests
- **Purpose**: Validate the random comment system
- **Tests**:
  - Returns a valid comment from the predefined list
  - Exactly 5 unique comments are available
  - All comments are distinct

### 6. Touch Input Handling Tests
- **Purpose**: Test touch/drag input processing
- **Tests**:
  - Calculates correct velocity from touch drag
  - Handles negative velocity (opposite direction)
  - Handles zero drag (no movement)

### 7. Game State Management Tests
- **Purpose**: Verify game state initialization and transitions
- **Tests**:
  - Game initializes with correct default state
  - Dragging state toggles correctly
  - Game completion detection (all balls removed)

### 8. Canvas Rendering Tests
- **Purpose**: Validate rendering operations
- **Tests**:
  - Canvas is cleared before each frame
  - Circles are drawn with correct parameters

### 9. Performance & Edge Cases Tests
- **Purpose**: Test boundary conditions and edge cases
- **Tests**:
  - Velocity approaching zero (friction over time)
  - Balls at canvas boundaries
  - Multiple simultaneous collisions

## Running the Tests

### Prerequisites
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test:watch
```

### Generate Coverage Report
```bash
npm test:coverage
```

## Test Structure

Each test suite follows this pattern:
```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Arrange: Set up test data
    // Act: Execute the code being tested
    // Assert: Verify the results
  });
});
```

## Coverage Goals

- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

## Key Testing Principles

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Clarity**: Test names clearly describe what is being tested
3. **Completeness**: Tests cover normal cases, edge cases, and error conditions
4. **Maintainability**: Tests are easy to understand and modify

## Physics Formulas Tested

### Distance Calculation
```javascript
distance = √((x₁ - x₂)² + (y₁ - y₂)²)
```

### Velocity from Drag
```javascript
vx = (startX - endX) × 0.1
vy = (startY - endY) × 0.1
```

### Friction Application
```javascript
vx = vx × 0.98
vy = vy × 0.98
```

### Collision Detection
```javascript
isColliding = distance < (radius₁ + radius₂)
```

## Mock Objects

The test suite uses mock DOM objects to simulate:
- Canvas element and 2D context
- Document.getElementById() calls
- Canvas rendering methods (clearRect, arc, fill, etc.)

## Future Test Enhancements

1. **Integration Tests**: Test the complete game loop
2. **Performance Tests**: Measure frame rate and rendering performance
3. **Visual Regression Tests**: Capture and compare screenshots
4. **E2E Tests**: Test actual user interactions in a real browser
5. **Accessibility Tests**: Verify touch target sizes and screen reader support

## Troubleshooting

### Tests Not Running
- Ensure Jest is installed: `npm install --save-dev jest`
- Check that test files end with `.test.js` or `.spec.js`

### Mock Errors
- Verify that mock objects match the actual DOM API
- Update mocks if game code changes

### Coverage Issues
- Run `npm test:coverage` to see which lines aren't covered
- Add tests for uncovered branches and functions

## Contributing

When adding new features to the game:
1. Write tests first (TDD approach)
2. Ensure all existing tests still pass
3. Maintain or improve coverage percentage
4. Update this documentation

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://testingjavascript.com/)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
