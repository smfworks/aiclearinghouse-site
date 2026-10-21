---
slug: "move-extra-keywords-before-fastapi-0-155"
title: "How to move unknown keywords into json_schema_extra before you pin FastAPI 0.155.0"
excerpt: "Bare keywords on Query, Path, Header, Cookie, Body, Form, and File raise TypeError at 0.155.0. Move schema extras into json_schema_extra before you pin it, or the current 0.156.8."
date: "2026-10-21"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "FastAPI", "APIs", "Open Source"]
tags: ["fastapi", "json-schema", "parameters"]
readTime: 13
image: "/images/blog/move-extra-keywords-before-fastapi-0-155-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/move-extra-keywords-before-fastapi-0-155"
---

You can find a bare keyword on FastAPI's `Path`, `Query`, `Header`, `Cookie`, `Body`, `Form`, or `File`, and move it into `json_schema_extra`, before that call raises `TypeError`. The break is [0.155.0](https://github.com/fastapi/fastapi/releases/tag/0.155.0). [PyPI](https://pypi.org/pypi/fastapi/json) already lists `0.156.8` as current. The wheel is `fastapi-0.156.8-py3-none-any.whl`, uploaded `2026-10-21T08:45:17.278952Z`. `requires_python` is `>=3.10`. I installed `0.154.0`, `0.155.0`, and `0.156.8` in throwaway virtualenvs on Python 3.14.7 and ran the same calls. I did not upgrade a running app, and I did not run FastAPI's test suite.

If you are still deciding whether a blank form field or a JSON `null` changes, that is a different check. It is written up at [How to check empty form fields and unselected files before you pin FastAPI 0.151.0](https://www.smfclearinghouse.com/blog/check-empty-forms-before-fastapi-0-151). I read that file in the site repo. I did not re-fetch the live page this run.

## Read the release, not the live notes page

[0.155.0](https://github.com/fastapi/fastapi/releases/tag/0.155.0) was published `2026-10-20T16:46:55Z`. It is not a prerelease. The body says the deprecated `**extra` keyword arguments have been removed from `Path`, `Query`, `Header`, `Cookie`, `Body`, `Form`, and `File`. Unknown keyword arguments now raise `TypeError`. For additional JSON Schema properties, it says to replace, for example, `Query(custom="value")` with `Query(json_schema_extra={"custom": "value"})`.

The breaking-change line points at [PR #16545](https://github.com/fastapi/fastapi/pull/16545). That pull request is merged. `merged_at` is `2026-10-20T16:34:47Z`. The title matches the release line. The same sentence is in the release notes file at that tag, under `## 0.155.0 (2026-10-20)`: [docs/en/docs/release-notes.md](https://raw.githubusercontent.com/fastapi/fastapi/0.155.0/docs/en/docs/release-notes.md).

Do not use the live [release notes](https://fastapi.tiangolo.com/release-notes/) as the checklist. I opened that page this run. The Latest Changes heading is followed by `0.143.0 (2026-10-08)`. A search of the fetched page found no `0.155` and no `0.156`. If that page is your pin list, you will miss this break.

The tutorial page did move. The live [Body - Fields](https://fastapi.tiangolo.com/tutorial/body-fields/) page says you can declare extra information with `json_schema_extra` in `Field`, `Query`, `Body`, etc., and that it will be included in the generated JSON Schema. The same page at tag [0.154.0](https://raw.githubusercontent.com/fastapi/fastapi/0.154.0/docs/en/docs/tutorial/body-fields.md) still says you can use the extra keyword arguments. The page at tag [0.155.0](https://raw.githubusercontent.com/fastapi/fastapi/0.155.0/docs/en/docs/tutorial/body-fields.md) matches the live wording. The release names seven functions. That tutorial sentence names `Field`, `Query`, and `Body`. Those are not the same list. Use the release for the functions that raise, and the tutorial for the rewrite it documents.

## See which pin still accepts the bare keyword

The last pin I installed that still accepts a bare keyword is `0.154.0`. I did not install `0.153.0`. The release says the removal is `0.155.0`.

In the `0.154.0` venv:

```bash
python -c 'import inspect; from fastapi import Query; print(inspect.signature(Query).parameters.get("extra"))'
```

That printed a `**extra` parameter. Its metadata includes the doc line `Include extra fields used by the JSON Schema.` and this deprecated message: The `extra` kwargs is deprecated. Use `json_schema_extra` instead. The category on that object is `DeprecationWarning`.

The same command on `0.155.0` printed `None`. On `0.156.8` it also printed `None`.

Then call the example from the release:

```bash
python -c 'from fastapi import Query; print(Query(custom="value").json_schema_extra)'
```

On `0.154.0` that printed `{'custom': 'value'}`. No warning text came out.

On `0.155.0` the same call exited 1:

```text
TypeError: Query() got an unexpected keyword argument 'custom'
```

`0.156.8` raised the same `TypeError` and also exited 1.

I repeated the unknown-keyword call for all seven names on each pin. On `0.154.0`, `Path`, `Query`, `Header`, `Cookie`, `Body`, `Form`, and `File` each accepted `custom="value"` and stored `{'custom': 'value'}` on `json_schema_extra`. `warnings.simplefilter("always")` still recorded no warning. On `0.155.0` and `0.156.8`, each of the seven raised `TypeError` with that function's name in the message. `Path() got an unexpected keyword argument 'custom'`, and the same shape for the other six.

So do not wait for a log line. The deprecation text sits on the `0.154.0` signature. Calling the function did not emit it. If your app runs clean on `0.154.0`, that does not mean you have no bare keywords.

A named parameter still works. `Query(alias="q").alias` was `q` on all three pins. `Query(example="x")` also still works on `0.155.0` and `0.156.8`. The warning is `FastAPIDeprecationWarning`, and the message is that `example` has been deprecated, please use `examples` instead. Leave `example=` where it is. Moving it into `json_schema_extra` is a different change. I did not compare the OpenAPI output of `example=` and `examples=`.

## Move the key, then check the schema

On `0.154.0`, a bare keyword is copied into `json_schema_extra` only when you did not also pass `json_schema_extra`. The `0.154.0` source does `current_json_schema_extra = json_schema_extra or extra` in `fastapi/params.py`. I read that line at the tag. I also called it.

```bash
python -c 'from fastapi import Query; print(Query(json_schema_extra={"kept": "yes"}, dropped="no").json_schema_extra)'
```

On `0.154.0` that printed `{'kept': 'yes'}`. The bare `dropped` key was already ignored. On `0.155.0` the same call raises `TypeError: Query() got an unexpected keyword argument 'dropped'`. Removing the bare key does not drop a schema field that this pin was applying. I only measured the case where `json_schema_extra` was a non-empty dict. I did not measure an empty dict.

The rewrite from the release is the call that works on both sides of the break:

```python
Query(json_schema_extra={"custom": "value"})
```

That returned `json_schema_extra={'custom': 'value'}` for all seven functions, on all three pins.

To see it in the generated schema, I had to install `httpx2`. Importing `TestClient` failed first with `RuntimeError: The starlette.testclient module requires the httpx2 package to be installed.` After that install, this route:

```python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items")
def read_good(q: Annotated[str, Query(json_schema_extra={"custom": "value"})]):
    return {"q": q}
```

produced the same parameter schema on `0.154.0`, `0.155.0`, and `0.156.8`:

```json
{"custom": "value", "title": "Q", "type": "string"}
```

`GET /items?q=set` returned `200` and `{"q": "set"}` on each of those pins. I checked the OpenAPI document for `Query` only. I did not repeat the schema fetch for `Path`, `Header`, `Cookie`, `Body`, `Form`, or `File`.

On `0.154.0`, the old forms produced that same schema object. Both of these did, before any request:

```python
def read_default(q: str = Query(custom="value")):
    return {"q": q}

def read_ann(q: Annotated[str, Query(custom="value")]):
    return {"q": q}
```

The tutorial file at tag [0.155.0](https://raw.githubusercontent.com/fastapi/fastapi/0.155.0/docs/en/docs/tutorial/body-fields.md) says extra keys passed in `json_schema_extra` will also be present in the OpenAPI schema, and that some OpenAPI tools, for example the OpenAPI validator, may not work with your generated schema. The live page starts that same warning. I measured the key in FastAPI's schema. I did not run the validator.

## The error fires when the route is defined

On `0.155.0` and `0.156.8`, a file without `from __future__ import annotations` raises at the `def`. Both the default-argument form and the `Annotated` form raised `TypeError: Query() got an unexpected keyword argument 'custom'` before the function body ran. That is earlier than a request. Defining the function is enough. If that `def` sits at module level, importing the file runs it. I measured the `def` in a script, not a separate import.

With `from __future__ import annotations`, the `def` itself succeeds. On `0.154.0` the annotation was stored as the string `Annotated[str, Query(custom='value')]`. After `@app.get("/items")` ran, the OpenAPI schema still contained `"custom": "value"`. FastAPI evaluated the string at route registration, and `0.154.0` still accepted the bare keyword.

On `0.155.0`, the same future-import file raised during `@app.get`, not during the `def`:

```text
TypeError: Query() got an unexpected keyword argument 'custom'
```

The traceback went through `inspect.signature(..., eval_str=True)` while the decorator built the route. I did not test a function that is never decorated. If the annotation stays a string and nothing evaluates it, this run does not say whether import succeeds. The scanner below does not depend on that.

## Do not rewrite the wrong call

`convert_underscores` is a real parameter of `Header`. It is not a parameter of `Query`. On `0.154.0`:

```bash
python -c 'from fastapi import Query; print(Query(convert_underscores=False).json_schema_extra)'
```

printed `{'convert_underscores': False}`. That was a schema extra, not header behavior. On `0.155.0` and `0.156.8` the same call raised `TypeError: Query() got an unexpected keyword argument 'convert_underscores'`. If you meant the header flag, the call was already on the wrong function. If you meant a schema key with that name, put it in `json_schema_extra`.

Pydantic's `Field` is also the wrong rewrite target for this release. On all three pins, `Field(custom="value")` still returned a `FieldInfo` with `json_schema_extra` `{'custom': 'value'}`. It warned, and it did not raise. The warning text was:

```text
PydanticDeprecatedSince20: Using extra keyword arguments on `Field` is deprecated and will be removed. Use `json_schema_extra` instead. (Extra keys: 'custom'). Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.14/migration/
```

That Pydantic was `2.14.1`, the version those FastAPI installs pulled. I did not pin Pydantic myself, and I did not open the migration page beyond the URL printed in the warning. The live tutorial tells you to use `json_schema_extra` for `Field` too. That is documentation. It is not the `TypeError` this release adds. [0.155.0](https://github.com/fastapi/fastapi/releases/tag/0.155.0) does not name `Field`.

`FastAPI()` itself is a different removal. [0.145.0](https://github.com/fastapi/fastapi/releases/tag/0.145.0) says it removes deprecated `openapi_prefix` and unused `**extra` from `FastAPI`. I called `FastAPI(not_a_parameter=1)` on `0.154.0`, `0.155.0`, and `0.156.8`. Each one raised `TypeError: FastAPI.__init__() got an unexpected keyword argument 'not_a_parameter'`. The constructor check, and the `root_path` move, are already written up at [How to put a stripped proxy prefix on fastapi run --root-path](https://www.smfclearinghouse.com/blog/move-root-path-onto-fastapi-run). I read that file in the site repo. I did not re-fetch the live page, and I did not open PR #16518.

[PR #16545](https://github.com/fastapi/fastapi/pull/16545) also edits `tests/test_union_form_normalization.py`. The hunk renames a union-form test and adds a second form field. It does not pass a bare keyword to `Query` or `Form`. I did not run pytest. Do not treat that test as proof the keyword removal works.

## Scan the tree before you pin

A search for the word `Query` will bury you. The check that matched the runtime is: a keyword is unsafe when it is not in that function's `0.155.0` signature.

I took the parameter names from `inspect.signature` on the installed `0.155.0`. `Path`, `Query`, and `Cookie` share one set. `Header` adds `convert_underscores`. `Body` adds `embed` and `media_type`. `Form` and `File` add `media_type`. The shared set is `default`, `default_factory`, `alias`, `alias_priority`, `validation_alias`, `serialization_alias`, `title`, `description`, `gt`, `ge`, `lt`, `le`, `min_length`, `max_length`, `pattern`, `regex`, `discriminator`, `strict`, `validate_default`, `union_mode`, `fail_fast`, `multiple_of`, `allow_inf_nan`, `max_digits`, `decimal_places`, `examples`, `example`, `openapi_examples`, `deprecated`, `include_in_schema`, and `json_schema_extra`.

[0.154.0](https://github.com/fastapi/fastapi/releases/tag/0.154.0) says it adds Pydantic validation options to request parameters. The release body does not name them. I am not listing those names here. The allowlist above is what `0.155.0` still accepts, not a changelog of `0.154.0`.

This script flags a call whose name, or attribute name, is one of the seven, when a keyword is missing from that allowlist. It does not resolve imports. A function you wrote and also named `Query` will match. `from fastapi import Query as Q` will not. A comment and a string will not, because it parses the file.

```python
import ast
import sys
from pathlib import Path

ALLOWED = {
    "Path": {
        "default", "default_factory", "alias", "alias_priority", "validation_alias",
        "serialization_alias", "title", "description", "gt", "ge", "lt", "le",
        "min_length", "max_length", "pattern", "regex", "discriminator", "strict",
        "validate_default", "union_mode", "fail_fast", "multiple_of", "allow_inf_nan",
        "max_digits", "decimal_places", "examples", "example", "openapi_examples",
        "deprecated", "include_in_schema", "json_schema_extra",
    }
}
ALLOWED["Query"] = set(ALLOWED["Path"])
ALLOWED["Cookie"] = set(ALLOWED["Path"])
ALLOWED["Header"] = set(ALLOWED["Path"]) | {"convert_underscores"}
ALLOWED["Body"] = set(ALLOWED["Path"]) | {"embed", "media_type"}
ALLOWED["Form"] = set(ALLOWED["Path"]) | {"media_type"}
ALLOWED["File"] = set(ALLOWED["Path"]) | {"media_type"}
NAMES = set(ALLOWED)

def call_name(node):
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return node.attr
    return None

def scan(path):
    tree = ast.parse(Path(path).read_text(), filename=str(path))
    hits = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        name = call_name(node.func)
        if name not in NAMES:
            continue
        for kw in node.keywords:
            if kw.arg is None:
                hits.append(f"{path}:{kw.lineno}: {name}(**...) cannot be checked statically")
            elif kw.arg not in ALLOWED[name]:
                hits.append(f"{path}:{kw.lineno}: {name}({kw.arg}=...) is not a 0.155 parameter")
    return hits

if __name__ == "__main__":
    found = []
    for item in sys.argv[1:]:
        found.extend(scan(item))
    print("\n".join(found) if found else "no unknown keywords")
```

I ran that against a fixture with `Query(alias="q")`, `Query(custom="value")`, `Header(convert_underscores=False)`, `Query(convert_underscores=False)`, `Body(embed=True, not_real=1)`, a comment, and a string that contained `Query(custom=...)`. The output was:

```text
fixture_calls.py:6: Query(custom=...) is not a 0.155 parameter
fixture_calls.py:12: Query(convert_underscores=...) is not a 0.155 parameter
fixture_calls.py:15: Body(not_real=...) is not a 0.155 parameter
```

`alias=`, `Header(convert_underscores=False)`, the comment, and the string were not reported. I did not run this scan over a service repo. Point it at your tree. Then open each hit. If the keyword was a schema extra, move it into `json_schema_extra`. If it was a typo for a real parameter, fix the name. If the call is your own function that happens to be named `Query`, ignore the hit.

## Do not skip 0.155 because 0.156.8 says fixes

[0.156.8](https://github.com/fastapi/fastapi/releases/tag/0.156.8) was published `2026-10-21T08:45:01Z`. Its body is one fix: preserve uploaded file positions when converting to `bytes`, [PR #16566](https://github.com/fastapi/fastapi/pull/16566). It does not mention `**extra`. The installed signature still has no `extra` parameter, and `Query(custom="value")` still raises.

The three releases just before it are also fixes, and their bodies do not mention `**extra` either. I read the GitHub release API for each:

- [0.156.5](https://github.com/fastapi/fastapi/releases/tag/0.156.5), published `2026-10-21T07:24:23Z`, fixes `AliasChoices` for path parameters. [PR #16560](https://github.com/fastapi/fastapi/pull/16560).
- [0.156.6](https://github.com/fastapi/fastapi/releases/tag/0.156.6), published `2026-10-21T07:57:45Z`, respects model alias settings for query, header, and cookie parameters. [PR #16562](https://github.com/fastapi/fastapi/pull/16562).
- [0.156.7](https://github.com/fastapi/fastapi/releases/tag/0.156.7), published `2026-10-21T08:16:13Z`, fixes validation error locations for form and file `AliasChoices`. [PR #16564](https://github.com/fastapi/fastapi/pull/16564).

I did not re-read the source of `0.156.5` through `0.156.7`. I did install `0.156.8` and confirm the keyword is still gone. Pinning current to pick up those alias fixes also picks up the `0.155.0` removal.

## What to do with the pin

If a hit is `Query(custom="value")` and you want that key in the schema, replace it with `Query(json_schema_extra={"custom": "value"})` before you leave `0.154.0`. I measured those two forms producing the same OpenAPI schema object on `0.154.0`, and the rewritten form still producing it on `0.155.0` and `0.156.8`.

If a hit passes both `json_schema_extra` and a bare keyword, delete the bare keyword. On `0.154.0` it was already ignored when `json_schema_extra` was a non-empty dict. On `0.155.0` it raises.

If you need the bare keyword to keep working, stay on `0.154.0` or earlier. I did not test anything older than `0.154.0` for this call. Do not treat a clean run on `0.154.0` as a clean scan. That pin accepts the keyword and does not warn.

I did not change a service pin. These checks were throwaway virtualenvs on Python 3.14.7. PyPI says `>=3.10`. I did not repeat the calls on 3.10, 3.11, 3.12, or 3.13.
