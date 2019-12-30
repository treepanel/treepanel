class PjaxAdapter extends Adapter {
  constructor(pjaxContainerSel) {
    super(['jquery.pjax.js']);
    this._pjaxContainerSel = pjaxContainerSel;

    $(document)
      .on('pjax:start', () => {
        $(document).trigger(EVENT.REQ_START);
        this._dispatchPjaxEventInDom('pjax:start');
      })
      .on('pjax:end', () => {
        $(document).trigger(EVENT.REQ_END);
        this._dispatchPjaxEventInDom('pjax:end');
      })
      .on('pjax:timeout', (e) => e.preventDefault());
  }

  // @override
  // @api public
  init($sidebar) {
    super.init($sidebar);

    const pjaxContainer = $(this._pjaxContainerSel)[0];

    if (!window.MutationObserver) return;

    // Some host switch pages using pjax. This observer detects if the pjax container
    // Has been updated with new contents and trigger layout.
    const pageChangeObserver = new window.MutationObserver(() => {
      // Trigger location change, can't just relayout as Octotree might need to
      // Hide/show depending on whether the current page is a code page or not.
      return $(document).trigger(EVENT.LOC_CHANGE);
    });

    if (pjaxContainer) {
      pageChangeObserver.observe(pjaxContainer, {
        childList: true
      });
    } else {
      // Fall back if DOM has been changed
      let firstLoad = true,
        href,
        hash;

      function detectLocChange() {
        if (location.href !== href || location.hash !== hash) {
          href = location.href;
          hash = location.hash;

          // If this is the first time this is called, no need to notify change as
          // Octotree does its own initialization after loading options.
          if (firstLoad) {
            firstLoad = false;
          } else {
            setTimeout(() => {
              $(document).trigger(EVENT.LOC_CHANGE);
            }, 300); // Wait a bit for pjax DOM change
          }
        }
        setTimeout(detectLocChange, 200);
      }

      detectLocChange();
    }
  }

  // @override
  // @api public
  selectFile(path) {
    // Do nothing if file is already selected.
    if (location.pathname === path) return;

    // If we're on the same page and just navigating to a different anchor
    // Don't bother fetching the page with pjax
    const pathWithoutAnchor = path.replace(/#.*$/, '');
    const isSamePage = location.pathname === pathWithoutAnchor;
    const loadWithPjax = $(this._pjaxContainerSel).length && !isSamePage;

    if (loadWithPjax) {
      this._patchPjax();
      $.pjax({
        // Needs full path for pjax to work with Firefox as per cross-domain-content setting
        url: location.protocol + '//' + location.host + path,
        container: this._pjaxContainerSel,
        timeout: 0 // global timeout doesn't seem to work, use this instead
      });
    } else {
      super.selectFile(path);
    }
  }

  /**
   * Dispatches a pjax event directly in the DOM.
   *
   * GitHub's own pjax implementation dispatches its events directly in the DOM, while
   * the jQuery pjax library we use dispatches its events only within its jQuery instance.
   * Because some GitHub add-ons listen to certain pjax events in the DOM it may be
   * necessary to forward an event from jQuery to the DOM to make sure those add-ons
   * don't break.
   *
   * Note that we don't forward the details/extra parameters or whether they're cancellable,
   * because the pjax implementations differ in this case!
   *
   * @see https://github.com/ovity/octotree/issues/490
   *
   * @param {string} type The name of the event
   * @api protected
   */
  _dispatchPjaxEventInDom(type) {
    const pjaxContainer = $(this._pjaxContainerSel)[0];

    if (pjaxContainer) {
      pjaxContainer.dispatchEvent(new Event(type, {
        bubbles: true
      }));
    }
  }

  // @api protected
  _patchPjax() {
    // The pjax plugin ($.pjax) is loaded in same time with Octotree (document ready event) and
    // we don't know when $.pjax fully loaded, so we will do patching once in runtime
    if (!!this._$pjaxPatched) return;

    /**
     * At this moment, when users are on Github Code page, Github sometime refreshes the page when
     * a file is clicked on its file list. Internally, Github uses pjax
     * (a jQuery plugin - defunkt/jquery-pjax) to fetch the file content being selected, and there is
     * a change on Github's server rendering that cause the refreshing problem. And this also impacts
     * on Octotree where Github page refreshes when users select a file in Octotree's sidebar
     *
     * The refresh happens due to this code https://github.com/defunkt/jquery-pjax/blob/c9acf5e7e9e16fdd34cb2de882d627f97364a952/jquery.pjax.js#L272.
     *
     * While waiting for Github to solve the wrong refreshing, below code is a hacking fix that
     * Octotree won't trigger refreshing when a file selected in sidebar (but Github still refreshes
     * if file selected at Github file view)
     */
    $.pjax.defaults.version = function () {
      // Disables checking layout version to prevent refreshing in pjax library
      return null;
    };

    this._$pjaxPatched = true;
  }
}
