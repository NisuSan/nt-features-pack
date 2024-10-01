export function capitalize(word: string) {
  return word?.toLowerCase().split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
}
