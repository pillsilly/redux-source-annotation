/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
//返回随机字符串 类似于 7.u.a.7.n.p 这种格式
const randomString = () =>
  Math.random()
    //number的方法 基数为36进制返回[0-9a-z]
    .toString(36)
    .substring(7)
    .split('')
    .join('.')

//redux内置的types
const ActionTypes = {
  //redux init type
  INIT: `@@redux/INIT${randomString()}`,
  //redux replace type
  REPLACE: `@@redux/REPLACE${randomString()}`,
  //unknown type，检测reducer时用到
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

export default ActionTypes
