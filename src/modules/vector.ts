export default class Vector extends Array<number> {
  /**
   * Create a Vector with provided elements (if only one is provided it is assumed as Vector Lenght)
   *
   * @param {number[]} elements
   */
  constructor(elements: number[]) {
    if (elements.length < 2) {
      throw new Error('At least 2 elements are required to create a vector');
    }

    super(...elements);
  }

  /**
   * Returns the Vector dimension
   */
  get dimension(): number {
    return this.length;
  }

  /**
   * Add current vector to another
   *
   * @param {Vector} otherVector
   *
   * @return {Vector} a new vector with the result
   */
  add(otherVector: Array<number>): Vector {
    const newVectorLength = Math.max(otherVector.length, this.length);

    const currentVectorValues = this || [];

    const newValues = new Array(newVectorLength)
      .fill(0)
      .map((e, i) => (currentVectorValues?.[i] || 0) + (otherVector[i] || 0));

    const newVect = new Vector(newValues);

    return newVect;
  }

  /**
   * Substract current vector to another
   *
   * @param {Vector} otherVector
   *
   * @return {Vector} a new vector with the result
   */
  substract(otherVector: Array<number>): Vector {
    const newVectorLength = Math.max(otherVector.length, this.length);

    const currentVectorValues = this || [];

    const newValues = new Array(newVectorLength)
      .fill(0)
      .map((e, i) => (currentVectorValues?.[i] || 0) - (otherVector[i] || 0));

    const newVect = new Vector(newValues);

    return newVect;
  }

  /**
   * Multiply scalar to current vector
   *
   * @param {number} scalar
   *
   * @return {Vector} resulting vector
   */
  scalarMultiplication(scalar: number): Vector {
    const newValues: number[] = Array.from(this).map(
      (element) => element * scalar,
    );

    const newVector = new Vector(newValues);

    return newVector;
  }

  /**
   * Multiply scalar to provided vector
   *
   * @param {Vector} vector
   * @param {number} scalar
   *
   * @return {Vector} resulting vector
   */
  static scalarMultiplication(vector: Vector, scalar: number): Vector {
    const newValues: number[] = Array.from(vector).map(
      (element) => element * scalar,
    );

    const newVector = new Vector(newValues);

    return newVector;
  }
}
