import {writable as internal, get} from 'svelte/store'
export function writable(key, initialValue) {
    // create an underlying store
    const store = internal(initialValue)
    const {subscribe, set} = store
    // get the last value from localStorage
    const json = localStorage.getItem(key)
    
    // use the value from localStorage if it exists
    if (json) {
      set(JSON.parse(json))
    }
    
    // return an object with the same interface as svelte's writable()
    return {
      // capture set and write to localStorage
      set(value) {
        localStorage.setItem(key, JSON.stringify(value))
        set(value)
      },
      // capture updates and write to localStore
      update(cb) {
        const value = cb(get(store))
        this.set(value)
      },
      // punt subscriptions to underlying store
      subscribe
    }
  } 
  