import * as natives from 'natives';
import { Vector3 } from '@math.gl/core';

export function getEntityCoords(entity) {
  const {x, y, z} = natives.getEntityCoords(entity);
  return new Vector3(x, y, z);
}

export function getEntityRotation(entity) {
  const {x, y, z} = natives.getEntityRotation(entity);
  return new Vector3(x, y, z);
}

export function getDistanceBetweenCoords(x1, y1, z1, x2, y2, z2, useZ) {

  const v1 = new Vector3(x1, y1, useZ ? z1 : 0.0);
  const v2 = new Vector3(x2, y2, useZ ? z2 : 0.0);

  return v1.distance(v2);

}
