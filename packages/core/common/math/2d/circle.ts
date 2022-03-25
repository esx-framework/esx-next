import {Vector2} from "./vec2";
import {Cache} from "../../decorators/cache.decorator";
import {sqr} from "../../utils";

export class Circle {
    constructor(private readonly centerC: Vector2, private readonly radiusC: number) {}

    /**
     * Returns if a point is `inside`, `on` or `outside` of the circle (these are the possible return values, a vector is on the circle if it's exactly on the circle edge)
     * @param point
     */
    @Cache()
    public getPointPosRel(point: Vector2): "on" | "inside" | "outside" {
        const x = point.x
        const y = point.y
        //gotta use those highschool studies
        const result = sqr(x-this.centerC.x) + sqr(y-this.centerC.y)
        const squaredRadius = sqr(this.radiusC)
        if (result === squaredRadius) {
            return "on"
        } else if (result > squaredRadius) {
            return "outside"
        } else {
            return "inside"
        }
    }
    public get center() {
        return this.centerC
    }
    public get radius() {
        return this.radiusC
    }

    /**
     * Checks if a point is on the circle edge
     * @param point
     */
    @Cache()
    public isOn(point: Vector2) {
        return this.getPointPosRel(point) == "on"
    }

    /**
     * Checks if a point is inside the circle
     * @param point
     */
    @Cache()
    public isInside(point: Vector2) {
        return this.getPointPosRel(point) == "inside"
    }

    /**
     * Checks if a point is outside of a circle
     * @param point
     */
    @Cache()
    public isOutside(point: Vector2) {
        return this.getPointPosRel(point) == "outside"
    }


}