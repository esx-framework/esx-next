import * as alt                         from 'alt';
import * as natives                     from 'natives';
import { Vector3, Quaternion, Matrix4 } from '@math.gl/core';

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

export function getPedHeadBlendData(ped){

  const buffer = new alt.MemoryBuffer(77);
  
  natives.getPedHeadBlendData(ped, buffer);

  const data = [
    buffer.int(0),
    // padding 4
    buffer.int(8),
    // padding 4
    buffer.int(16),
    // padding 4
    buffer.int(24),
    // padding 4
    buffer.int(32),
    // padding 4
    buffer.int(40),
    // padding 4
    buffer.floatLE(48),
    // padding 4
    buffer.floatLE(56),
    // padding 4
    buffer.floatLE(64),
    // padding 4
    // bool isParent
    // padding 4
  ];

  buffer.free();

  return data;
}

export function getCamMatrix(cam){

  const _pos = natives.getCamCoord(cam);
  const pos  = new Vector3(_pos.x, _pos.y, _pos.z);
  const rot  = natives.getCamRot(cam);

  const pitch = (rot.x % 360) * DEG2RAD;
  const roll  = (rot.y % 360) * DEG2RAD;
  const yaw   = (rot.z % 360) * DEG2RAD;

  const cy = Math.cos(yaw   * 0.5);
  const sy = Math.sin(yaw   * 0.5);
  const cr = Math.cos(roll  * 0.5);
  const sr = Math.sin(roll  * 0.5);
  const cp = Math.cos(pitch * 0.5);
  const sp = Math.sin(pitch * 0.5);

  const quat = new Quaternion(
    cy * sp * cr - sy * cp * sr,
    cy * cp * sr + sy * sp * cr,
    sy * cr * cp - cy * sr * sp,
    cy * cr * cp + sy * sr * sp
  );

  const mat = new Matrix4();

  mat.fromQuaternion(quat);
  mat.translate(pos);

  return [
    new Vector3(mat[0],  mat[1],  mat[2]),  // right
    new Vector3(mat[4],  mat[5],  mat[6]),  // forward
    new Vector3(mat[8],  mat[9],  mat[10]), // up
    new Vector3(mat[12], mat[13], mat[14]), // at
  ];

}
