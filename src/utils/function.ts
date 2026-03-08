export const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
export const isWeb = import.meta.env.VITE_PLATTFORM === 'web'
let baseURL = import.meta.env.BASE_URL
baseURL = baseURL.slice(0, baseURL.length - 1)
// console.log('baseURL: ', baseURL, isProduction)
export const prependBaseUrl = (url: string): string => (isProduction ? `${baseURL}${url}` : url)
export const repeat = (n: number, callback: (_: any, i: number) => string): string[] => [...new Array(n)].map(callback)

export const mergeObjectsRecursive = (obj1: any, obj2: any) => {
  ;[...Object.keys(obj2)].forEach(key => {
    try {
      if (obj2[key].constructor == Object) {
        obj1[key] = mergeObjectsRecursive(obj1[key], obj2[key])
      } else {
        obj1[key] = obj2[key]
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[key] = obj2[key]
    }
  })

  return obj1
}