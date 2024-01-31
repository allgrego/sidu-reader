import Vector from './modules/vector';

/**
 * Main function. App entry point
 */
(async function (): Promise<void> {
  const a = new Vector([0, 1, 2]);
  const scalar = 8;

  const scaledVector = Vector.scalarMultiplication(a, scalar);

  console.log('Dimension', a.dimension);

  console.log('Vector', a);
  console.log('Scalar', scalar);
  console.log('Scaled Vector', a.scalarMultiplication(scalar));
  console.log('Scaled Vector Static', scaledVector);
})();
