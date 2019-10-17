import compose from './compose'
import { Middleware, MiddlewareAPI } from './types/middleware'
import { AnyAction } from './types/actions'
import { StoreEnhancer, StoreCreator, Dispatch } from './types/store'
import { Reducer } from './types/reducers'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param middlewares The middleware chain to be applied.
 * @returns A store enhancer applying the middleware.
 *
 * @template Ext Dispatch signature added by a middleware.
 * @template S The type of the state supported by a middleware.
 */
export default function applyMiddleware(): StoreEnhancer
export default function applyMiddleware<Ext1, S>(
  middleware1: Middleware<Ext1, S, any>
): StoreEnhancer<{ dispatch: Ext1 }>
export default function applyMiddleware<Ext1, Ext2, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 }>
export default function applyMiddleware<Ext1, Ext2, Ext3, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 }>
export default function applyMiddleware<Ext1, Ext2, Ext3, Ext4, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
  middleware4: Middleware<Ext4, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 & Ext4 }>
export default function applyMiddleware<Ext1, Ext2, Ext3, Ext4, Ext5, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
  middleware4: Middleware<Ext4, S, any>,
  middleware5: Middleware<Ext5, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 & Ext4 & Ext5 }>
export default function applyMiddleware<Ext, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }>

//应用中间件 中间件示例：
//
// 定义一个thunk中间件处理action如果是函数情形
// const thunkMiddle =  store => next => action => {
//    拦截action是函数的action
//    if(typeof action === 'function'){
//      执行66行的dispatch方法，重新dispatch 一个action
//      return store.dispatch(
//        action(store.dispatch, store.getState)
//      )
//    }
//    非函数执行next
//    return next(action);
// }
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return (createStore: StoreCreator) => <S, A extends AnyAction>(
    reducer: Reducer<S, A>,
    ...args: any[]
  ) => {
    //创建store
    const store = createStore(reducer, ...args)
    // const middleware = store => {
    //  store.dispatch();                 如果在这儿执行了store.dispatch会触发以下错误
    //  return next=>...
    // }
    let dispatch: Dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    //一个简单的store api
    const middlewareAPI: MiddlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    //构造中间件，在这儿执行了thunkMiddle(middlewareAPI)，也就是参数是store的那个中间件函数
    //所以这儿的chain保存的是 [next=>... , next=>... , ...]
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    /**
     * 替换dispatch
     *
     * 举例：
     * const middlewares = applyMiddleware(promiseMiddle,thunkMiddle);
     *
     * 首先执行 thunkMiddle        中 next =>... 的函数    这儿next 是store.dispatch，因为compose是从右向左的
     * 返回    thunkMiddle        中 action =>...
     *
     * 然后执行 promiseMiddle      中 next =>... 的函数    这儿next 是thunkMiddle 中的　action=>...
     * 返回    promiseMiddle      中 action =>...        也就是下面的dispatch就等于这个返回
     *
     * dispatch(()=>({type:'ADD_TODO'}))    当派发一个函数的action时
     *
     * 首先执行 promiseMiddle      中 action =>...   由于不符合promise
     * 然后执行 promiseMiddle      中 next(action)   这儿的next是  thunkMiddle 中的　action=>... 在这儿action符合函数
     * 然后执行 thunkMiddle        中 dispatch(action(...)) 在这儿执行了这个函数action
     * 也就是等于dispatch({type:'ADD_TODO'}) 然后继续执行以上 dispatch 的流程
     *
     * 再次执行到 thunkMiddle      中　action=>... 时  action为{type:'ADD_TODO'}  这个时候action就不符合函数了
     * 继续执行   thunkMiddle      中 next(action)   这儿的next是store.dispatch
     * 然后执行store的dispatch方法    然后就是执行reducer   返回state...
     */
    dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
