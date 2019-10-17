/**
 * @param obj The object to inspect.
 * @returns True if the argument appears to be a plain object.
 */
//判断是否为朴素对象 也就是纯对象
//朴素对象：原型链上直接继承Object.prototype的对象，即是否用对象直接量{}或new Object()创建的对象
export default function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  //proto最终赋值为obj原型链的顶层
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
