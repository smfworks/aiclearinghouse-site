---
slug: "move-root-path-onto-fastapi-run"
title: "How to put a stripped proxy prefix on fastapi run --root-path"
excerpt: "FastAPI 0.146.0 deprecates root_path on the constructor. Move a stripped prefix onto the server flag, and clear openapi_prefix before you jump past 0.145.0."
date: "2026-10-19"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "FastAPI", "APIs", "Open Source"]
tags: ["fastapi", "proxy", "root-path", "cli"]
readTime: 11
image: "/images/blog/move-root-path-onto-fastapi-run-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/move-root-path-onto-fastapi-run"
---

You can take a stripped path prefix off `FastAPI(root_path=...)` and put it on the server command instead. [FastAPI 0.146.0](https://github.com/fastapi/fastapi/releases/tag/0.146.0), published 18 October 2026, deprecates that constructor argument. The command the release names is `fastapi run --root-path /api/v1`. The [Behind a Proxy](https://fastapi.tiangolo.com/advanced/behind-a-proxy/) page shows the same flag. If the code still passes `openapi_prefix`, clear that before you install 0.145.0 or later. On 0.146.0 that keyword is already a `TypeError`. I did not put an app in front of a proxy, and I did not run the project's tutorial test.

## Print the version, then read the tag you would install

On the machine I am writing from, the installed package is not 0.146.0:

```bash
python3 -c "import fastapi; print(fastapi.__version__)"
```

That printed `0.133.1`. The `fastapi` command on that same install cannot run. `fastapi --version` raised `RuntimeError: To use the fastapi command, please install "fastapi[standard]"`. That is this install. Yours may already have the extra.

PyPI's current version is 0.146.0. The wheel filename is `fastapi-0.146.0-py3-none-any.whl`, uploaded `2026-10-18T15:19:29.059699Z`. `requires_python` is `>=3.10`. The `standard` extra includes `fastapi-cli[standard]>=0.0.32` and `uvicorn[standard]>=0.12.0`. That is the [project JSON](https://pypi.org/pypi/fastapi/json), not a guess about what `pip` will resolve tomorrow.

The GitHub API for tag `0.146.0` returned `prerelease` false, `draft` false, and `published_at` `2026-10-18T15:18:08Z`. The body says the `root_path` parameter in `FastAPI()` is deprecated, and to configure the server with `fastapi run --root-path /api/v1`. The breaking-change line is [PR #16520](https://github.com/fastapi/fastapi/pull/16520), merged `2026-10-18T15:07:44Z`.

The [live release notes](https://fastapi.tiangolo.com/release-notes/) say the same sentence under `0.146.0 (2026-10-18)`.

Four other stable releases published the same calendar day, before that tag. `0.145.0` published `2026-10-18T14:40:20Z`. `0.144.0` published `2026-10-18T12:42:34Z`. `0.143.5` published `2026-10-18T09:12:23Z`. `0.143.4` published `2026-10-18T14:37:55Z`. The live notes date `0.143.4` as `2026-10-17`. If the page date and the API `published_at` disagree, use the tag page. None of those earlier tags is the constructor deprecation. `0.145.0` is the one that can break a call before you ever see the new warning.

## Search the tree before you change the pin

```bash
rg -n --glob '*.py' 'openapi_prefix|root_path\s*='
```

I did not run that against an application. Run it on yours.

Two hits matter, and they are not the same change.

`openapi_prefix=` is gone in [0.145.0](https://github.com/fastapi/fastapi/releases/tag/0.145.0). That release says it removes deprecated `openapi_prefix` and unused `**extra` from `FastAPI`. [PR #16518](https://github.com/fastapi/fastapi/pull/16518) deletes the parameter and the line `self.root_path = root_path or openapi_prefix`. After the patch the assignment is `self.root_path = root_path`. The same patch deletes `**extra` and `self.extra = extra`. It also deletes `tests/test_deprecated_openapi_prefix.py`, which constructed `FastAPI(openapi_prefix="/api/v1")` and expected a `root_path` of `/api/v1`.

I installed `fastapi==0.146.0` in a throwaway virtualenv and passed the old keyword:

```text
TypeError: FastAPI.__init__() got an unexpected keyword argument 'openapi_prefix'
```

A made-up keyword, `not_a_parameter=1`, failed the same way: `TypeError: FastAPI.__init__() got an unexpected keyword argument 'not_a_parameter'`. Your calls will not use that name. A keyword that used to ride on `**extra` is no longer a parameter. Clear those calls before the jump. I did not upgrade a running service.

`FastAPI(root_path=...)` still exists in 0.146.0. It warns. It is not removed. The tutorial file at that tag still contains `app = FastAPI(root_path="/api/v1")`. That file is the old path, kept so a test can show the warning. The docs page no longer tells you to set it there.

If the search finds neither string, you do not have this migration. Read the flag section only if a proxy is about to strip a prefix. Do not add `root_path=` to the constructor to get ahead of the release. That is the argument 0.146.0 tells you to stop using.

## Put the prefix on the server

The case the current docs walk is a proxy that strips a prefix. You declare `/app` in code. The proxy serves that at `/api/v1/app`. The app keeps thinking it lives at `/app`. The docs UI in the browser does not. It asks for `/openapi.json` unless the server knows the outside prefix is `/api/v1`.

The page says to use the command line option `--root-path`:

```console
$ uv run fastapi run main.py --forwarded-allow-ips="*" --root-path /api/v1
```

That line is theirs, including `uv run` and the forwarded-ips flag. I did not run it, and I did not start Traefik.

The first tutorial app at tag 0.146.0 does not pass `root_path` into the constructor. It reads the scope:

```python
from fastapi import FastAPI, Request

app = FastAPI()


@app.get("/app")
def read_main(request: Request):
    return {"message": "Hello World", "root_path": request.scope.get("root_path")}
```

The page says that if you start the server with the command above, the response looks like this:

```json
{
    "message": "Hello World",
    "root_path": "/api/v1"
}
```

That JSON is the docs' example. I did not fetch it from a running server.

The page also says the docs UI at `http://127.0.0.1:8000/docs` will not work, because that URL skips the proxy, and the UI at `http://127.0.0.1:9999/api/v1/docs` will. Those are their check URLs for the Traefik example on port 9999. I did not open them.

If the proxy does not strip a prefix, do not add `--root-path` just because the release mentions it. The page says that layout forwards the full path, so the server sees `/api/v1/app` itself. That is a different setup. Sebastián Ramírez's note on the closed docs pull request says the current docs focus on a proxy that strips the prefix, and that he would rather keep that explanation small than document several approaches. The comment is [on PR #14238](https://github.com/fastapi/fastapi/pull/14238#issuecomment-6251718664).

## The flag is on `run` and on `dev`. The release names `run`.

I installed `fastapi-cli==0.0.32` in that same throwaway env. That is the lowest version the 0.146.0 `standard` extra names. `fastapi --version` printed `FastAPI CLI version: 0.0.32`.

`fastapi run --help` lists `--root-path`. The help text is: "The root path is used to tell your app that it is being served to the outside world with some path prefix set up in some termination proxy or similar." `fastapi dev --help` lists the same option and the same sentence.

Do not treat those two commands as the same process. The `run` help says it is equivalent to `fastapi dev` but with reload disabled and listening on `0.0.0.0`. The `dev` help says the reverse: reload enabled, listening on `127.0.0.1`. The release and the docs page name `fastapi run`. Use that one unless you have a reason to pick the other host. I did not start either server.

In the [0.0.32 CLI source](https://raw.githubusercontent.com/fastapi/fastapi-cli/0.0.32/src/fastapi_cli/cli.py), both commands pass `root_path` into `_run`, and `_run` calls `uvicorn.run(..., root_path=root_path, ...)`. That is the handoff I read. It is not a request I sent through Uvicorn.

The 0.146.0 docs patch also deletes the sentence "If you use Hypercorn, it also has the option `--root-path`." The live Behind a Proxy page has no Hypercorn mention. I did not open Hypercorn's CLI. Do not paste that deleted sentence back into a deploy script.

## What the constructor still does if you leave it

In `fastapi/applications.py` at tag 0.146.0, a non-empty `root_path` warns and is still stored:

```python
if root_path:
    warnings.warn(
        "The `root_path` parameter is deprecated. Configure the "
        "server's root path instead, for example with "
        "`fastapi run --root-path /api/v1`.",
        category=FastAPIDeprecationWarning,
        stacklevel=2,
    )
self.root_path = root_path
```

I constructed three apps in the 0.146.0 env, with warnings set to always record.

`FastAPI()` warned zero times. `app.root_path` was `''`.

`FastAPI(root_path="")` warned zero times. `app.root_path` was `''`.

`FastAPI(root_path="/api/v1")` warned once. The category was `FastAPIDeprecationWarning`. The message was: `The root_path parameter is deprecated. Configure the server's root path instead, for example with fastapi run --root-path /api/v1.` `app.root_path` was `'/api/v1'`.

`FastAPIDeprecationWarning` subclasses `UserWarning`, not `DeprecationWarning`. The class docstring says it exists because `DeprecationWarning` is ignored, and it links [Seth Larson's note on that](https://sethmlarson.dev/deprecations-via-warnings-dont-work-for-python-libraries). I opened the class. I did not open that article, and I did not check your process's warning filter. With the filter I set, the warning was recorded. A filter you did not set may not match that.

`__call__` still writes the scope when `self.root_path` is truthy:

```python
if self.root_path:
    scope["root_path"] = self.root_path
```

That is the source. To see the value on a request, I added a route and used `TestClient`. The first import failed:

```text
RuntimeError: The starlette.testclient module requires the httpx2 package to be installed.
You can install this with:
    $ pip install httpx2
```

I installed `httpx2` and imported again. That is what that error told me to do. I did not test whether the older `httpx` package would have satisfied it. [0.143.4](https://github.com/fastapi/fastapi/releases/tag/0.143.4) is the release that adds httpx2 to optional dependencies. It is not the prefix change. If your tests import `TestClient` after a jump and die on that line, the missing package is the next install, not a reason to put `root_path` back on the constructor.

After `httpx2` was installed, `GET /app` on the app built with `FastAPI(root_path="/api/v1")` returned status 200 and `{"message": "Hello World", "root_path": "/api/v1"}`. The same route on `FastAPI()` returned `{"root_path": ""}`. `TestClient` is in-process. It is not a proxy, and it is not `fastapi run --root-path`. The constructor path still fills the scope. The CLI path is the one the release tells you to use. I did not run that path.

The merged test in PR #16520 expects `pytest.warns(FastAPIDeprecationWarning, match="fastapi run --root-path")` while importing the old tutorial app, then still asserts that same JSON on `GET /app`. I did not run pytest. My client check matches the JSON field that test asserts. It does not close their suite, and it does not close a live proxy.

## Why the two settings were not the same knob

The 0.146.0 docs patch deletes the section "Setting the `root_path` in the FastAPI app" and the sentence that said passing `root_path` to `FastAPI` was the equivalent of `--root-path` on Uvicorn or Hypercorn. The warning on the live page says this: "In FastAPI 0.145.0 and earlier, `root_path` could also be configured in `FastAPI()`. This parameter is now deprecated because its behavior was not consistent with the server configuration. Use `fastapi run --root-path /api/v1` instead."

Read that sentence carefully. It names 0.145.0 and earlier as the versions where the constructor could be set. The GitHub release that deprecates it is 0.146.0. Do not read the docs line as "0.145.0 already warns." The 0.145.0 body is the `openapi_prefix` removal.

The older docs pull request is closed and not merged. `merged` was false. `closed_at` was `2026-10-18T15:31:51Z`. Ramírez's comment that minute says he addressed the inconsistency in #16520, released in 0.146.0, by deprecating the constructor parameter and directing people to `fastapi run --root-path`. He says the parameter was there to replace `openapi_prefix`, once the ASGI standard provided a `root_path`, and that at the time Uvicorn did not support it, or he did not know it did. He says he wants one supported way. He closed #14238 as superseded.

That is his account of the decision. I did not re-test the mounted sub-app cases that pull request listed.

A public report of the mismatch, from before this release, is [discussion #15132](https://github.com/fastapi/fastapi/discussions/15132). The author names FastAPI 0.135.1 and says the constructor and the CLI option do not behave the same for a mounted sub-app. I did not reproduce that table. The 0.146.0 release body does not link the discussion. Use it as a report of the old mismatch, not as a test of 0.146.0.

## Do the jump in this order

If the version print is older than 0.145.0, do these in order. I left the writing machine on 0.133.1. The checks below are the throwaway 0.146.0 env, plus the release text. They are not a transcript of a production upgrade.

1. Remove `openapi_prefix=` before 0.145.0. On 0.146.0 that call raised the `TypeError` above. The old fallback, `root_path or openapi_prefix`, is the line PR #16518 deletes.

2. Remove keywords that depended on `**extra` in the same release. A keyword that is not a real parameter now fails at `FastAPI()`. I only proved that with `not_a_parameter`. Search your calls. Do not wait for the warning. This failure is not a warning.

3. If a proxy strips a prefix, put that prefix on `fastapi run --root-path` and take it off `FastAPI()`. Leaving it on the constructor still sets `self.root_path`, still writes the scope, and warns when the string is non-empty. The supported command is the CLI flag.

4. Do not treat 0.143.4, 0.143.5, or 0.144.0 as this change. [0.143.4](https://github.com/fastapi/fastapi/releases/tag/0.143.4) adds httpx2 to optional dependencies, [PR #16512](https://github.com/fastapi/fastapi/pull/16512). [0.143.5](https://github.com/fastapi/fastapi/releases/tag/0.143.5) fixes an empty value for a `byte` file list parameter, [PR #9383](https://github.com/fastapi/fastapi/pull/9383). [0.144.0](https://github.com/fastapi/fastapi/releases/tag/0.144.0) adds WebSocket support to security dependencies, [PR #10147](https://github.com/fastapi/fastapi/pull/10147). Read them if you use those paths. They are not the prefix move.

The `standard` extra is what provides the `fastapi` command. On the writing machine the package is installed and the command is not, until that extra is. In the throwaway env I installed FastAPI and fastapi-cli separately, at the versions above. I did not run `pip install "fastapi[standard]"`. If you install, pin the version you just read. I am not telling you to upgrade a production service from this post.

## What you should see

After the move, the constructor call is `FastAPI()` with no `root_path`. The process command includes `--root-path` and the prefix the proxy strips. A route that returns `request.scope.get("root_path")` is the check the tutorial uses. The docs say that value is the prefix you passed, and that `/docs` on the server port is the wrong URL for the UI.

If you leave `root_path="/api/v1"` on the constructor, expect the warning I quoted, and expect the scope field to still be filled. That is a deprecation, not a removal. Empty string does not warn. `openapi_prefix` does not warn either. It errors.

I did not install 0.146.0 on the writing machine's default environment. I did not run `fastapi run`. I did not run the tutorial test. I did not start Traefik. A passing read of the release is not a passing request through your proxy.
