//name  
export const stringGuid = () => {
  let str = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < 8; i++) {
    let index = Math.floor(Math.random() * str.length)
    result += str[index]
  }
  return result
}