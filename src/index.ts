import Vector from './modules/vector';

function averageVelocity(
  origin: Vector,
  destination: Vector,
  deltaTime: number,
) {
  return Vector.substract(destination, origin).scalarMultiplication(
    1 / deltaTime,
  );
}

/**
 * Main function. App entry point
 */
(async function (): Promise<void> {
  const i = new Vector([1, 0, 0]);
  const j = new Vector([0, 1, 0]);
  const k = new Vector([0, 0, 1]);

  // console.log('i = ', i);
  // console.log('j = ', j);
  // console.log('k =', k);
  // console.log('||i|| =', i.magnitude());
  // console.log('||j|| =', j.magnitude());
  // console.log('||k|| =', k.magnitude());
  // console.log('i.j =', Vector.dotProduct(i, j));
  // console.log('i+j =', Vector.add(i, j));
  // console.log('i-y =', Vector.substract(i, j));

  // console.log(
  //   'a.b =',
  //   Vector.dotProduct(new Vector([1, 2]), new Vector([2, 3])),
  // );

  // console.log('cosine angle of a.b =', Vector.cosineOnVectors(i, j));
  // console.log(
  //   'angle of a.b =',
  //   Vector.angle(i, j),
  //   '=',
  //   `${Number(Vector.angle(i, j) / Math.PI).toFixed(3)}π radians`,
  // );

  const initialPosition = new Vector([0, 0, 0]); // m

  const finalPosition = new Vector([10, 20, 0]); // m

  const deltaTime = 20; // secs

  console.log(
    'Average velocity',
    averageVelocity(initialPosition, finalPosition, deltaTime),
    'm/s',
    '=',
    averageVelocity(initialPosition, finalPosition, deltaTime).magnitude(),
    'm/s',
  );
})();
