export function throwIfMissing (name) {
  throw new Error(`Missing parameter: ${name}`)
}

export function throwError (text) {
  throw new Error(`${text}`)
}
