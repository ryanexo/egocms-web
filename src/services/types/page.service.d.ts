import type { NavigationFailure, RouteLocationNormalizedLoadedGeneric } from 'vue-router'

export interface IPageService {
  addOpenedPage(route: RouteLocationNormalizedLoadedGeneric): void
  /**
   * closeAll 关闭所有页面
   *
   * 关闭后会重定向至默认页，返回为falsy时表示路由导航完成
   */
  closeAll(): Promise<NavigationFailure | undefined | void>
  closeAllExceptCurrent(): void
  closeLeadingPages(): void
  /**
   * 关闭指定页面
   *
   * 如关闭当前页面，关闭后会重定向至homePath，返回结果为falsy时表示路由导航完成
   */
  closePage(id: string): Promise<NavigationFailure | undefined | void>
  closeTrailingPages(): void
  movePage(id: string, pos: number): void
  pin(id: string): void
  /**
   * 刷新当前页面
   *
   * 返回结果fulfilled时表示刷新完成，但不保证组件已加载完成
   */
  refreshCurrentPage(): Promise<void>
  unpin(id: string): void
}
