export function singletonProxy <T extends new (...args: any[]) => any>(className: T){
  let instance = null
  return new Proxy<T>(className, {
    construct (target, args) {
      // 内部类
      class ProxyClass {
        constructor () {
          if (instance === null) {
            instance = new target(...args)
          }
          return instance
        }
      }
      return new ProxyClass()
    }
  }) 
}
