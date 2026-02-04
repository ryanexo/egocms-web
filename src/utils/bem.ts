export function useClassNs(block: string) {
  const b = () => block
  const e = (el: string) => `${block}__${el}`
  const em = (el: string, mod: string) => `${block}__${el}--${mod}`
  const m = (mod: string) => `${block}--${mod}`

  return { b, e, em, m }
}
