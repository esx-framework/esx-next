import { Vector3 } from '@math.gl/core/dist/esm';

export function getEntityCoords(entity) {
  return new Vector3(...global.GetEntityCoords(entity));
}

export function getEntityRotation(entity) {
  return new Vector3(...global.GetEntityRotation(entity));
}

export function getDistanceBetweenCoords(x1, y1, z1, x2, y2, z2, useZ) {

  const v1 = new Vector3(x1, y1, useZ ? z1 : 0.0);
  const v2 = new Vector3(x2, y2, useZ ? z2 : 0.0);

  return v1.distance(v2);

}
