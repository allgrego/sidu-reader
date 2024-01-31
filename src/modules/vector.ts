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
  add(otherVector: Vector): Vector {
    return Vector.add(this, otherVector);
  }

  /**
   * Substract current vector to another
   *
   * @param {Vector} otherVector
   *
   * @return {Vector} a new vector with the result
   */
  substract(otherVector: Vector): Vector {
    return Vector.substract(this, otherVector);
  }

  /**
   * Multiply scalar to current vector
   *
   * @param {number} scalar
   *
   * @return {Vector} resulting vector
   */
  scalarMultiplication(scalar: number): Vector {
    return Vector.scalarMultiplication(this, scalar);
  }

  /**
   * Calculate the magnitude or length of a vector
   */
  magnitude(): number {
    const components: number[] = Array.from(this);

    const squaredModule = components.reduce(
      (accumulator = 0, component) => accumulator + Math.pow(component, 2),
      0,
    );

    const module = Math.sqrt(squaredModule);

    return module;
  }

  /**
   * dotProcut of current vector with provided one
   *
   * @param {Vector} vector
   *
   * @return {number} resulting product
   */
  dotProduct(vector: Vector): number {
    return Vector.dotProduct(this, vector);
  }

  /**
   * Calculate the cosine of the angle between current vector and provided vector
   *
   * @param {Vector} vector
   *
   * @return {number}
   */
  cosineOnVector(vector: Vector): number {
    return Vector.cosineOnVectors(this, vector);
  }

  /**
   * Add current vector to another
   *
   * @param {Vector} otherVector
   *
   * @return {Vector} a new vector with the result
   */
  static add(vectorA: Vector, vectorB: Vector): Vector {
    const newVectorDimension = Math.max(vectorA.dimension, vectorB.dimension);

    const currentVectorValues = Array.from(vectorA);

    const newValues = new Array(newVectorDimension)
      .fill(0)
      .map((e, i) => (currentVectorValues?.[i] || 0) + (vectorB?.[i] || 0));

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
  static substract(vectorA: Vector, vectorB: Vector): Vector {
    const newVectorDimension = Math.max(vectorA.dimension, vectorB.dimension);

    const currentVectorValues = Array.from(vectorA);

    const newValues = new Array(newVectorDimension)
      .fill(0)
      .map((e, i) => (currentVectorValues?.[i] || 0) - (vectorB?.[i] || 0));

    const newVect = new Vector(newValues);

    return newVect;
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

  /**
   * dotProcut for provided vectors
   *
   * @param {Vector} vectorA
   * @param {Vector} vectorB
   *
   * @return {number} resulting product
   */
  static dotProduct(vectorA: Vector, vectorB: Vector): number {
    if (vectorA.dimension !== vectorB.dimension) {
      throw new Error(
        'Vectors must have the same dimension to apply dot product',
      );
    }

    const dotProductResult: number = Array.from(vectorA).reduce(
      (accumulator, component, index) =>
        accumulator + component * (vectorB?.[index] || 0),
      0,
    );

    return dotProductResult;
  }

  /**
   * Calculate the cosine of the angle between two provided vectors
   *
   * @param {Vector} vectorA
   * @param {Vector} vectorB
   *
   * @return {number} cosine of angle between vectors
   */
  static cosineOnVectors(vectorA: Vector, vectorB: Vector): number {
    const dotProduct = this.dotProduct(vectorA, vectorB);
    const magnitudeA = vectorA.magnitude();
    const magnitudeB = vectorB.magnitude();

    const cosine = Number(dotProduct / (magnitudeA * magnitudeB));

    return cosine;
  }

  /**
   * Returns the angle of two vectors in radians
   *
   * @param {Vector} vectorA
   * @param {Vector} vectorB
   *
   * @return {number}
   */
  static angle(vectorA: Vector, vectorB: Vector): number {
    const cosine = vectorA.cosineOnVector(vectorB);

    return Math.acos(cosine);
  }
}
