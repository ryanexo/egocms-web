/* eslint-disable perfectionist/sort-interfaces */
export interface ColProps {
  /**
   * 初始列数
   */
  col?: number
  /**
   * 以col为基数的跨列数量
   */
  span?: number
  /**
   * width >= 1920
   */
  xl?: number
  /**
   * width >= 1280
   */
  lg?: number
  /**
   * width >= 1280
   */
  md?: number
  /**
   * width >= 540
   */
  sm?: number
  /**
   * width < 540
   */
  xs?: number
}

export interface LayoutData {
  cols: number
  layout: keyof Omit<ColProps, 'col' | 'span'>
}

export interface LayoutProps extends Partial<Omit<ColProps, 'col' | 'span'>> {
  follow?: HTMLElement
  gap?: number
}
