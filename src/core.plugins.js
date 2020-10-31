class Plugin {
  /**
   * Activates the plugin.
   * @param {!{
   *   adapter: !Adapter,
   *   $sidebar: !JQuery,
   *   $toggler: !JQuery,
   *   $views: !JQuery,
   *   treeView: !TreeView,
   *   optsView: !OptionsView,
   *   errorView: !ErrorView,
   * }}
   *
   * @param {{
   *  state: UserState,
   * }}
   *
   * @return {!Promise<undefined>}
   */
  async activate(opts, payload) {
    return
  }

  /**
   * Deactivate the plugin.
   *
   * @param {{
   *  state: UserState,
   * }} payload
   */
  async deactivate(payload) {
    return
  }

  /**
   * Applies the option changes user has made.
   * @param {!Object<!string, [(string|boolean), (string|boolean)]>} changes
   * @return {!Promise<boolean>} iff the tree should be reloaded.
   */
  async applyOptions(changes) {
    return false
  }
}

window.Plugin = Plugin
