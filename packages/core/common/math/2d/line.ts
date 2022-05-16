import {Vector2} from "./vec2";
import {Cache} from "../../decorators/cache.decorator";

/**
 * Represents a line between 2 points
 */
export class Line {
    constructor(private readonly p1C: Vector2, private readonly p2C: Vector2) {}

    /**
     * Checks if a point is on the line
     * @param vec
     */
    @Cache()
    public isOn(vec: Vector2) {
        return this.p1C.distanceBetween(vec) + this.p2C.distanceBetween(vec) === this.p1C.distanceBetween(this.p2C)
    }

    public get p1() {
        return this.p1C
    }

    public get p2() {
        return this.p2C
    }



    /**
     * Returns the center of the line as a vector
     */
    @Cache()
    public getCenter() {
        const x = (this.p1C.x + this.p2C.x) / 2
        const y = (this.p1C.y + this.p2C.y) / 2
        return new Vector2(x, y)
    }

    /**
     * Returns the trisection point on relative to the selected point (defaults to p1)
     */
    @Cache()
    public getTrisection(point: "p1" | "p2" = "p1") {
        if (point == "p1") {
            return this.getTrisectionP1()
        } else {
            return this.getTrisectionP2()
        }
    }

    /**
     * Returns the trisection point relative to p1
     */
    @Cache()
    public getTrisectionP1() {
        const x = ((this.p1C.x * 2) + this.p2C.x) / 3
        const y = ((this.p1C.y * 2) + this.p2C.y) / 3
        return new Vector2(x, y)
    }

    /**
     * Returns the trisection point relative to P2
      */
    @Cache()
    public getTrisectionP2() {
        const x = ((this.p2C.x * 2) + this.p1C.x) / 3
        const y = ((this.p2C.y * 2) + this.p1C.y) / 3
        return new Vector2(x, y)
    }

    public length() {
        return this.p1C.distanceBetween(this.p2C)
    }

    /**
     * Gets a normal vector for this line
     */
    public getNormal() {
        return this.p1C.direction(this.p2C).normalize()
    }

    /**
     * Gets the intersecting point as a vector between 2 lines (returns undefined if the lines are the same or doesn't intersect)
     * @param l1
     * @param l2
     */
    public static getIntersectionPoint(l1: Line, l2: Line): Vector2 | undefined {
        const p1 = l1.p1
        const p2 = l1.p2
        const p3 = l2.p1
        const p4 = l2.p2
        const c2x = p3.x - p4.x
        const c2y = p3.y - p4.y

        const c3x = p1.x - p2.y
        const c3y = p1.y - p2.y

        const formula = c3x * c2y - c3y * c2x
        if (formula === 0) { //lines either doesn't intersect or they are the same
            return undefined
        }
        const upper1 = p1.x * p2.y - p1.y * p2.x
        const upper4 = p3.x * p4.y - p3.y * p4.x
        const px = (upper1 * c2x - c3x * upper4) / formula;
        const py = (upper1 * c2y - c3y * upper4) / formula;

        return new Vector2(px, py)
    }

    /**
     * Gets the intersection point between this line and another (returns undefined if the lines are the same or doesn't intersect)
     * @param l
     */
    @Cache()
    public getIntersectionPoint(l: Line) {
        return Line.getIntersectionPoint(this, l)
    }

    /**
     * Checks if this line intersects with another line
     * @param l
     */
    @Cache()
    public intersects(l: Line) {
        return !!Line.getIntersectionPoint(this, l)
    }

    /**
     * Checks if 2 lines are equal (assumes that the lines lengths are infinity, so the starting points doesn't matter)
     * @param l1
     * @param l2
     */
    public static equals(l1: Line, l2: Line) {
        const p1 = l1.p1 //copied over from getIntersectionPoint for perf reasons
        const p2 = l1.p2
        const p3 = l2.p1
        const p4 = l2.p2
        const c2x = p3.x - p4.x
        const c2y = p3.y - p4.y

        const c3x = p1.x - p2.y
        const c3y = p1.y - p2.y

        const formula = c3x * c2y - c3y * c2x
        return formula === 0
    }

    /**
     * Checks if the lines are equal (assumes that the lines lengths are infinity, so the starting points doesn't matter)
     * @param l
     */
    @Cache()
    public equals(l: Line) {
        return Line.equals(this, l)
    }

}