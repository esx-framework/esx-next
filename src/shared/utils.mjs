
export function joaat(key) {

  const keyLowered = key.toLowerCase();
  const length     = keyLowered.length;

  let hash, i;

  for (hash = i = 0; i < length; i++) {
    hash += keyLowered.charCodeAt(i);
    hash += (hash <<  10);
    hash ^= (hash >>>  6);
  }

  hash += (hash <<   3);
  hash ^= (hash >>> 11);
  hash += (hash <<  15);

  return toUnsigned(hash);

}

export function toSigned(value, nbit = 32) {
  value = value << 32 - nbit;
  value = value >> 32 - nbit;
  return Math.floor(value);
}

export function toUnsigned(value) {
  return Math.floor(value >>> 0);
}

export function nameClass(name, cls) {
  return ({[name] : class extends cls {}})[name];
}