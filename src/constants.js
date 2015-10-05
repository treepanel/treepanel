const
    PREFIX = 'octotree'

  , STORE = {
    TOKEN     : 'octotree.github_access_token',
    TABSIZE   : 'octotree.tabsize',
    REMEMBER  : 'octotree.remember',
    NONCODE   : 'octotree.noncode_shown',
    LAZYLOAD  : 'octotree.lazyload',
    RECURSIVE : 'octotree.recursive',
    COLLAPSE  : 'octotree.collapse',
    HOTKEYS   : 'octotree.hotkeys',
    GHEURLS   : 'octotree.gheurls',
    WIDTH     : 'octotree.sidebar_width',
    POPUP     : 'octotree.popup_shown',
    SHOWN     : 'octotree.sidebar_shown'
  }

  , DEFAULTS = {
    TOKEN    : '',
    TABSIZE  : '',
    REMEMBER : true,
    NONCODE  : true,
    LAZYLOAD : true,
    RECURSIVE: true,
    COLLAPSE : true,
    // @ifdef SAFARI
    HOTKEYS  : '⌘+b, ⌃+b',
    // @endif
    // @ifndef SAFARI
    HOTKEYS  : '⌘+⇧+s, ⌃+⇧+s',
    // @endif
    GHEURLS  : '',
    WIDTH    : 250,
    POPUP    : false,
    SHOWN    : false
  }

  , EVENT = {
    TOGGLE        : 'octotree:toggle',
    LOC_CHANGE    : 'octotree:location',
    LAYOUT_CHANGE : 'octotree:layout',
    REQ_START     : 'octotree:start',
    REQ_END       : 'octotree:end',
    OPTS_CHANGE   : 'octotree:change',
    VIEW_READY    : 'octotree:ready',
    VIEW_CLOSE    : 'octotree:close',
    FETCH_ERROR   : 'octotree:error'
  }
