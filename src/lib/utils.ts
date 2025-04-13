export async function sleep(time: number) {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), time)
    })
  }
  
  export function simpleHash(json: any) {
    const stringified = JSON.stringify(json)
    let hash = 0
    for (let i = 0; i < stringified.length; i++) {
      hash = (hash << 5) - hash + stringified.charCodeAt(i)
      hash |= 0 // Convertir a 32 bits
    }
    return hash.toString()
  }