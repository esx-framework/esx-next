import {degToRad, memo} from "../../utils";
import {Cache} from "../../decorators/cache.decorator";
import {Circle} from "./circle";

export interface Vec2 {
    x: number
    y: number
}

const memoizedLength = memo((x: number, y: number) => Math.sqrt(x * x + y * y))


/**
 * Immutable, memoized class vector for working with 2D vectors
 */
export class Vector2 implements Vec2 {
    constructor(private readonly xC: number, private readonly yC: number) {}

    /**
     * Create a vector from an array (native return usually)
     * @param arr
     */
    public static fromArr(arr: number[]) {
        return new Vector2(arr[0], arr[1])
    }
    public get x() {
        return this.xC
    }
    public get y() {
        return this.yC
    }

    public asArray() {
        return [this.xC, this.yC]
    }

    /**
     * Adds v1 and v2 together returning a new vector
     * @param v1
     * @param v2
     */
    public static add(v1: Vector2, v2: Vector2) {
        const xc = v1.x + v2.x
        const yc = v1.y + v2.y
        return new Vector2(xc, yc)
    }

    /**
     * Adds v to this vector returning a new one
     * @param v
     */
    @Cache()
    public add(v: Vector2) {
        return Vector2.add(this, v)
    }

    /**
     * Subtracts v1 from v2 returning a new one
     * @param v1
     * @param v2
     */
    public static subtract(v1: Vector2, v2: Vector2) {
        const x = v1.x - v2.x
        const y = v1.y - v2.y
        return new Vector2(x, y)
    }

    /**
     * Subtracts v from this vector returning a new one
     * @param v
     */
    @Cache()
    public subtract(v: Vector2) {
        return Vector2.subtract(v, this)
    }

    /**
     * Checks if 2 vectors are equal
     * @param v1
     * @param v2
     */
    public static equals(v1: Vector2, v2: Vector2) {
        return v1.x === v2.x && v1.y === v2.y
    }

    /**
     * Checks if this vector is equal to v
     * @param v
     */
    @Cache()
    public equals(v: Vector2) {
        return Vector2.equals(this, v)
    }

    /**
     * Multiplies v1 with v2
     * @param v1
     * @param v2
     */
    public static multiply(v1: Vector2, v2: Vector2) {
        const x = v1.x * v2.x
        const y = v1.y * v2.y
        return new Vector2(x, y)
    }

    /**
     * Multiplies this vector with v returning a new one
     * @param v
     */
    @Cache()
    public multiply(v: Vector2) {
        return Vector2.multiply(this, v)
    }

    /**
     * Divides v1 with v2
     * @param v1
     * @param v2
     */
    public static divide(v1: Vector2, v2: Vector2) {
        const x = v1.x / v2.x
        const y = v2.y / v2.y
        return new Vector2(x, y)
    }

    /**
     * Divides this vector with v returning a new one
     * @param v
     */
    @Cache()
    public divide(v: Vector2) {
        return Vector2.divide(this, v)
    }

    /**
     * Multiplies v1 with a scalar value
     * @param v1
     * @param num
     */
    public static multiplyScalar(v1: Vector2, num: number) {
        const x = v1.x * num
        const y = v1.y * num
        return new Vector2(x, y)
    }

    /**
     * Multiplies this vector with a scalar number returning a new one
     * @param num
     */
    @Cache()
    public multiplyScalar(num: number) {
        return Vector2.multiplyScalar(this, num)
    }

    /**
     * Divides v1 with a scalar value
     * @param v1
     * @param num
     */
    public static divideScalar(v1: Vector2, num: number) {
        const x = v1.x / num
        const y = v1.y / num
        return new Vector2(x, y)
    }

    /**
     * Divides this vector with a scalar number returning a new one
     * @param num
     */
    @Cache()
    public divideScalar(num: number) {
        return Vector2.divideScalar(this, num)
    }

    /**
     * Returns the cross product of v1 and v2
     * @param v1
     * @param v2
     */
    public static cross(v1: Vector2, v2: Vector2) {
        return v1.x * v2.y - v1.y * v2.x
    }

    /**
     * Calculates the cross product of this vector and another
     * @param v
     */
    @Cache()
    public cross(v: Vector2) {
        return Vector2.cross(this, v)
    }

    /**
     * Returns the dot product of v1 and v2
     * @param v1
     * @param v2
     */
    public static dot(v1: Vector2, v2: Vector2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    /**
     * Calculates the dot product of this vector and another
     * @param v
     */
    @Cache()
    public dot(v: Vector2) {
        return Vector2.dot(this, v)
    }

    /**
     * Returns the distance between 2 vectors (without using the square root formula)
     * @param v1
     * @param v2
     */
    public static distanceBetween(v1: Vector2, v2: Vector2) {
        const div = Vector2.divide(v1, v2)
        return div.length()
    }

    /**
     * Returns the distance between this and another vector
     * @param v
     */
    @Cache()
    public distanceBetween(v: Vector2) {
        return Vector2.distanceBetween(this, v)
    }

    public length() {
        const x = this.x
        const y = this.y
        return memoizedLength(x, y)
    }

    public normalize() {
        return this.divideScalar(this.length())
    }
    @Cache()
    public toString() {
        return `{"x": ${this.xC}, "y": ${this.yC}`
    }

    public toObject(): Vec2 {
        return {x: this.xC, y: this.yC}
    }

    /**
     * Creates a circle with this vector as it's center
     * @param radius
     */
    public toCircle(radius: number) {
        return new Circle(this, radius)
    }

    /**
     * Calculates the direction vector from 2 vectors using the formula dirV(v2.x-v1.x; v2.y-v1.y)
     * @param v1
     * @param v2
     */
    public static direction(v1: Vector2, v2: Vector2) {
        return Vector2.subtract(v2, v1)
    }

    /**
     * Calculates the direction vector of this vector and v
     * @param v
     */
    public direction(v: Vector2) {
        return Vector2.direction(v, this)
    }

    /**
     * Rotates a vector by x radians (counterclockwise)
     * @param rads
     */
    public rotateByRad(rads: number) {
        const x = this.x * Math.cos(rads) - this.y * Math.sin(rads)
        const y = this.x * Math.sin(rads) - this.y * Math.cos(rads)
        return new Vector2(x, y)
    }

    /**
     * Rotates a vector by x degrees (counterclockwise)
     * @param degs
     */
    public rotateByDeg(degs: number) {
        return this.rotateByRad(degToRad(degs))
    }
}