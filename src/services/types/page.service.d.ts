import type { NavigationFailure, RouteLocationNormalizedLoadedGeneric } from 'vue-router'

export interface IPageService {
  /**
   * 关闭指定页面
   *
   * 如关闭当前页面，关闭后会重定向至homePath，返回结果为falsy时表示路由导航完成
   */
  close(id: string): Promise<NavigationFailure | undefined | void>
  close(index: number): Promise<NavigationFailure | undefined | void>

  closeAfter(id: string): void

  closeAfter(index: number): void
  /**
   * closeAll 关闭所有页面
   *
   * 关闭后会重定向至默认页，返回为falsy时表示路由导航完成
   */
  closeAll(): Promise<NavigationFailure | undefined | void>

  closeBefore(id: string): void
  closeBefore(index: number): void

  closeOther(id: string): void
  closeOther(index: number): void

  move(id: string, targetIndex: number): void
  move(currentIndex: number, targetIndex: number): void

  open(route: RouteLocationNormalizedLoadedGeneric): void

  pin(id: string): void
  /**
   * 刷新当前页面
   *
   * 返回结果fulfilled时表示刷新完成，但不保证组件已加载完成
   */
  refresh(): Promise<void>
  unpin(id: string): void
}
