const TEMPLATE = `
<div>
  <nav class="treepanel-sidebar">
    <div class="treepanel-toggle">
      <i class="treepanel-toggle-icon" role="button"></i> <span>TreePanel</span>

      <div class="popup">
        <div class="arrow"></div>
        <div class="content">
          Hi there, this is TreePanel. Move mouse over this button to display the code tree. You can also press the
          shortkey <kbd>cmd shift s</kbd> (or <kbd>ctrl shift s</kbd>).
        </div>
      </div>
    </div>

    <div class="treepanel-main-icons">
      <a class="treepanel-pin" data-store="PINNED">
        <span class="tooltipped tooltipped-s" aria-label="Pin this sidebar"> <i class="treepanel-icon-pin"></i> </span>
      </a>

      <a class="treepanel-settings">
        <span class="tooltipped tooltipped-s" aria-label="Settings"> <i class="treepanel-icon-settings"></i> </span>
      </a>
    </div>

    <div class="treepanel-views">
      <div class="treepanel-view treepanel-tree-view current">
        <div class="treepanel-view-header"></div>
        <div class="treepanel-view-body"></div>
        <a class="treepanel-spin"> <span class="treepanel-spin--loader"></span> </a>
      </div>

      <div class="treepanel-view treepanel-error-view">
        <div class="treepanel-view-header treepanel-header-text-top"></div>
        <form class="treepanel-view-body"><div class="message"></div></form>
      </div>

      <div class="treepanel-view treepanel-settings-view">
        <div class="treepanel-view-header treepanel-header-text-top">Settings</div>
        <form class="treepanel-view-body">
          <div>
            <label>GitHub access token</label>
            <div class="treepanel-token-actions">
              <a class="treepanel-create-token" target="_blank" tabindex="-1">
                <span class="tooltipped tooltipped-n" aria-label="Generate new token"><i class="treepanel-icon-key"></i></span>
              </a>
              <a
                class="treepanel-help"
                href="https://github.com/treepanel/treepanel#access-token"
                target="_blank"
                tabindex="-1"
              >
                <span class="tooltipped tooltipped-n" aria-label="Learn more">
                  <i class="treepanel-icon-help"></i>
                </span>
              </a>
            </div>
            <input type="text" class="form-control input-block" data-store="TOKEN" />
            <div class="treepanel-disclaimer text-gray">Token is stored in local storage</div>
          </div>

          <div>
            <div>
              <label>Hotkeys</label>
              <div class="treepanel-token-actions">
                <a class="treepanel-help" href="https://github.com/treepanel/treepanel#hotkeys" target="_blank" tabindex="-1">
                  <span class="tooltipped tooltipped-n" aria-label="Learn more">
                    <i class="treepanel-icon-help"></i>
                  </span>
                </a>
              </div>
            </div>
            <input
              type="text"
              autocomplete="off"
              spellcheck="false"
              autocapitalize="off"
              class="form-control"
              data-store="HOTKEYS"
            />
          </div>

          <div>
            <label><input type="checkbox" data-store="HOVEROPEN" /> <span>Show sidebar on hover</span></label>
          </div>
          <div>
            <label><input type="checkbox" data-store="ICONS" /> <span>Show file-type icons</span></label>
          </div>
          <div>
            <label><input type="checkbox" data-store="PR" /> <span>Show pull request changes</span></label>
          </div>
          <div>
            <label><input type="checkbox" data-store="LAZYLOAD" /> <span>Lazy-load code tree</span></label>
            <span class="treepanel-disclaimer is-margin-left text-gray">Speed up large repositories</span>
          </div>

          <div><button class="btn btn-primary">Apply settings</button></div>
        </form>
      </div>
    </div>

    <div class="treepanel-footer"></div>
  </nav>
</div>
`
