## Octotree
Browser extensions (Chrome, Firefox and Safari) to display GitHub code in tree format. Useful for developers who frequently read source in GitHub and do not want to download or checkout too many repositories. Features:

* Easy-to-navigate code tree like IDEs
* Fast browsing with pjax
* Support private repositories (require [personal access token](#github-api-rate-limit))

## Install on Chrome
* Download and install [Octotree](https://chrome.google.com/webstore/detail/octotree/bkhaagjahfmjljalopjnoealnfndnagc) from the Chrome store
* Navigate to any GitHub project (or just refresh this page as an example)
* The code tree should show as follows:

![When extension is active](docs/chrome.png)

## Install on Firefox and Safari
Submitting to Mozilla and Safari stores is quite a tedious process. Octotree 1.0 (not even 1.1) was submitted to Mozilla store and is still being reviewed. Safari store requires even more work and time (that I don't have).

Alternatively, you can just install the prebuilt extensions located in the [dist](https://github.com/buunguyen/octotree/tree/master/dist) folder. For security reason, be sure to install from this location only.

* Firefox: drag `octotree.xpi` to the browser and follow the instructions
* Safari: drag `octotree.safariextz` to the browser and follow the instructions

Note: you can also pack extensions from source by executing the Gulp script that generates extension structures for Chrome, Firefox and Safari. Refer to the documentation of [Firefox](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started) and [Safari](https://developer.apple.com/library/safari/documentation/tools/conceptual/safariextensionguide/UsingExtensionBuilder/UsingExtensionBuilder.html#//apple_ref/doc/uid/TP40009977-CH2-SW1) to learn how to package extensions.

## GitHub API Rate Limit
Octotree uses [GitHub API](https://developer.github.com/v3/) to retrieve repository metadata. By default, it makes unauthenticated requests to the GitHub API. However, there are two situations when requests must be authenticated:

* You access a private repository
* You exceed the [rate limit of unauthenticated requests](https://developer.github.com/v3/#rate-limiting)

When that happens, Octotree shows the screen below to ask for your [GitHub personal access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use). If you don't already have one, [create one](https://github.com/settings/tokens/new), then copy and paste it into the textbox.

![Enter personal access token](docs/token.png)

Minimal scopes that should be granted are `public_repo` and `repo` (if you need access to private repositories).

![Minimal scopes](docs/scopes.png)

Alternatively, you can manually enter or update the token by following these steps:

* Navigate to any GitHub page
* Open the Chrome (or Safari, Firefox) developer console
* Execute the following line:
```javascript
localStorage.setItem('octotree.github_access_token', 'REPLACE WITH TOKEN')
```

## Changelog
### v1.1
* New UI that blends better with GitHub! [#43](https://github.com/buunguyen/octotree/pull/43)
* Hide Octotree on non-code pages [#44](https://github.com/buunguyen/octotree/pull/44), [#42](https://github.com/buunguyen/octotree/pull/42), [#52](https://github.com/buunguyen/octotree/pull/52)
* When asking for token, show more detailed message and not fly out automatically [96ff6](https://github.com/buunguyen/octotree/commit/96ff6196bb99aa36ae8bf08c345354fcd4db79a1)
* Extend pjax timeout to work better with big files [4d5f5](https://github.com/buunguyen/octotree/commit/4d5f526a719191d7f756443c60f471f1c775f8c8)
* Sanitize file and folder names before displaying [a1e8a](https://github.com/buunguyen/octotree/commit/a1e8a63ca894d4ecc58ba722727ca8b3c1a2128d)
* Fix error when a branch name contains slashes [#12](https://github.com/buunguyen/octotree/pull/12)
* Gulp script to build for Chrome, Firefox and Safari [c485b](https://github.com/buunguyen/octotree/commit/c485b144a3d6a9114148e7ca8e2fe4ce0d74b1c4), [61a9e](https://github.com/buunguyen/octotree/commit/61a9e8af864365df4ece208f213a3d49d241de0e)
* And some other minor changes


## Credit
* Thanks to everyone who submit pull requests, report bugs and suggest ideas on GitHub and on [HN](https://news.ycombinator.com/item?id=7740226)
* [Extension icon](https://github.com/pstadler/octofolders) by [pstadler](https://github.com/pstadler)
