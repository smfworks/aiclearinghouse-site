---
slug: "check-empty-forms-before-fastapi-0-151"
title: "How to check empty form fields and unselected files before you pin FastAPI 0.151.0"
excerpt: "Five FastAPI releases since 0.146.0 change what an empty form field, an unchecked box, an unselected file, and a JSON null mean. Run the checks before you pin 0.151.0."
date: "2026-10-20"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "FastAPI", "APIs", "Open Source"]
tags: ["fastapi", "forms", "files", "validation"]
readTime: 13
image: "/images/blog/check-empty-forms-before-fastapi-0-151-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/check-empty-forms-before-fastapi-0-151"
---

You can tell whether a blank text box, an unchecked checkbox, an unselected file input, or a JSON `null` will change before you pin FastAPI 0.151.0. Five releases since 0.146.0 change what "missing" means. [PyPI](https://pypi.org/pypi/fastapi/json) lists `0.151.0` as current. The wheel is `fastapi-0.151.0-py3-none-any.whl`, uploaded `2026-10-20T08:11:48.152151Z`. `requires_python` is `>=3.10`. The [live release notes](https://fastapi.tiangolo.com/release-notes/) I opened still start the latest section at 0.143.0, so that page is not the checklist. The checks below are a small `TestClient` script in two throwaway environments. They are not the project's test suite, and they are not a browser.

## Read the GitHub tags, not the docs page

Print the version you have before you change a pin:

```bash
python3 -c 'import fastapi; print(fastapi.__version__)'
```

On the machine I am writing from, that printed `0.133.1`. I did not upgrade that environment. The comparisons below are throwaway virtualenvs.

The GitHub release API, fetched this run, marks these five tags `prerelease` false and `draft` false:

| Tag | `published_at` | What the body says changed |
| --- | --- | --- |
| [0.147.0](https://github.com/fastapi/fastapi/releases/tag/0.147.0) | `2026-10-19T09:48:41Z` | Omitted bool form fields, including optional bool, become False |
| [0.148.0](https://github.com/fastapi/fastapi/releases/tag/0.148.0) | `2026-10-19T12:25:19Z` | Omitted Query, Header, Cookie, and Form defaults are not user input |
| [0.149.0](https://github.com/fastapi/fastapi/releases/tag/0.149.0) | `2026-10-19T17:21:45Z` | Empty scalar form values are missing in form models |
| [0.150.0](https://github.com/fastapi/fastapi/releases/tag/0.150.0) | `2026-10-19T22:39:30Z` | An unselected file part is missing |
| [0.151.0](https://github.com/fastapi/fastapi/releases/tag/0.151.0) | `2026-10-20T08:11:33Z` | JSON `null` is not the same as an omitted value |

Do not stop at 0.150.0. The project JSON I opened lists 0.151.0.

The in-repo notes at tag 0.151.0 date the file section `## 0.150.0 (2026-10-20)`. The GitHub release `published_at` for that tag is `2026-10-19T22:39:30Z`. Those are not the same clock. Use the release page for the publish time, and the tag file if you want the wording that shipped with 0.151.0. I read both.

The live [release notes](https://fastapi.tiangolo.com/release-notes/) page has a Latest Changes heading, then jumps to `0.143.0 (2026-10-08)`. A search of that fetch found no `0.150.0` and no `0.151.0`. If you use that page as the pin checklist, you will miss every change in this post.

If you are still below 0.146.0, the releases list also shows [0.146.0](https://github.com/fastapi/fastapi/releases/tag/0.146.0) at `2026-10-18T15:18:08Z`. I did not re-read that body this run. The constructor `root_path` move is a different check. It is already written up at [How to put a stripped proxy prefix on fastapi run --root-path](https://www.smfclearinghouse.com/blog/move-root-path-onto-fastapi-run). I read that file in the site repo. I did not re-fetch the live page.

## Install the pin you would actually ship

I created two virtualenvs with Python 3.14.7 and installed `fastapi==0.151.0` in one and `fastapi==0.146.0` in the other, plus `httpx` and `python-multipart`. The [form docs](https://fastapi.tiangolo.com/tutorial/request-forms/) say you need `python-multipart` before forms work. I did not test the checks without it.

Both envs resolved the same neighbors. `import` printed starlette `1.9.0`, pydantic `2.14.1`, and httpx `0.28.1`. I did not pin those myself. The behavior difference below is between the two FastAPI pins under those resolved versions. It is not a proof that a different pydantic pin would match.

`TestClient` printed this on both:

```text
StarletteDeprecationWarning: Using `httpx` with `starlette.testclient` is deprecated; install `httpx2` instead.
```

I did not install `httpx2`. The statuses below still came back. This is an in-process client. It is not a browser submitting a real form, and it is not `pytest` on the FastAPI tree.

Search your own tree before you run the client. I did not search an application repo.

```bash
rg -n --glob '*.py' 'Form\(|File\(|UploadFile|Body\(|Query\(|Header\(|Cookie\('
```

If that prints nothing, you do not have this migration. Do not add form fields so you can exercise the release.

## Empty text is missing. A space is not.

[0.149.0](https://github.com/fastapi/fastapi/releases/tag/0.149.0) says browsers submit empty text inputs as `""`, and FastAPI now treats empty scalar form values as missing in form models. Required fields return a validation error. Fields with defaults use them and stay unset in `model_dump(exclude_unset=True)`. Empty strings inside lists are preserved. [PR #16529](https://github.com/fastapi/fastapi/pull/16529) is merged, `2026-10-19T17:10:13Z`.

The shape I ran:

```python
class Note(BaseModel):
    value: str | None = "kept"

@app.post("/form-default")
def form_default(params: Annotated[Note, Form()]):
    return {"value": params.value, "fields_set": sorted(params.model_fields_set)}
```

`POST` with `data={"value": ""}`:

- 0.151.0 returned `200` and `{"value":"kept","fields_set":[]}`.
- 0.146.0 returned `200` and `{"value":"","fields_set":["value"]}`.

A single space is not the empty string. Both pins returned `200` and `{"value":" ","fields_set":["value"]}` for `data={"value": " "}`. The test at tag 0.151.0, `test_whitespace_string_is_not_missing` in `tests/test_request_params/test_form/test_nullable_and_defaults.py`, asserts the same split. I did not run that pytest. My client check matches the split.

A required string is the other branch:

```python
class RequiredNote(BaseModel):
    value: str
```

`data={"value": ""}` on 0.151.0 returned `422` and `{"type":"missing","loc":["body","value"],"msg":"Field required","input":{}}`. On 0.146.0 the same call returned `200` and `{"value":""}`.

A list keeps the blank item. `list[str]` with `data={"value": ["", "hello"]}` returned `200` and `{"value":["","hello"]}` on both pins. That matches the 0.149.0 sentence about lists. Do not "fix" a list of tags by dropping empty strings in your handler unless you wanted that before. The release says those empty strings stay.

If a blank text box should mean "use the default," give the field a default and expect `fields_set` to be empty on 0.151.0. If a blank box should be an error, leave the field required and expect `422`. If a blank box should be stored as `""`, the new pin will not do that for a scalar form field. You have to send a non-empty value, or stop using a form model for that field. I did not test a hand-rolled `Form("")` default as a way to keep the old blank. Do not invent that path from this check.

## An unchecked box is False, even when the default is True

[0.147.0](https://github.com/fastapi/fastapi/releases/tag/0.147.0) says omitted `bool` and `bool | None` form fields are interpreted as `False`, including required fields and fields whose default is `True` or `None`. The inferred value is explicitly set, including in `model_dump(exclude_unset=True)`. JSON requests and direct Pydantic validation are unchanged. [PR #16523](https://github.com/fastapi/fastapi/pull/16523) is merged, `2026-10-19T09:36:47Z`.

The live [Boolean Form Fields](https://fastapi.tiangolo.com/tutorial/request-forms/#boolean-form-fields) section says the same rule and does not name 0.147. The sentence I read is: browsers omit unchecked checkboxes, and FastAPI treats omitted `bool` and `bool | None` form fields as `False`, even when their default is `True` or `None`.

The form-models page on the live site does not say that. The fetch of [Form Models](https://fastapi.tiangolo.com/tutorial/request-form-models/) has no boolean sentence. The raw file at tag 0.151.0 does: "Boolean fields follow the same omission rules as individual form parameters." If you only read the live form-models page, you will miss the rule that is already in the tag.

The shape I ran:

```python
class Flag(BaseModel):
    value: bool = True

@app.post("/form-bool")
def form_bool(params: Annotated[Flag, Form()]):
    return params.model_dump(exclude_unset=True)
```

A `POST` with no form body:

- 0.151.0 returned `200` and `{"value":false}`.
- 0.146.0 returned `200` and `{"value":true}`.

`data={"value": "on"}` returned `{"value":true}` on both. The 0.148.0 body still says omitted boolean form fields become `False` and count as explicitly set. My 0.151.0 result matches that: `exclude_unset=True` still included `value`. The omission is not "leave the default unset." It is "the client unchecked the box."

If an endpoint treats a missing checkbox as "keep the previous True," that endpoint changes on 0.147.0 and later. Send the field when it is checked, and handle `False` when it is not. Do not rely on `bool = True` to mean "unchecked keeps True." I did not run the alias or `AliasChoices` cases in that PR. The merged diff in `fastapi/dependencies/utils.py` sets `infer_false_if_missing` for `bool` and `bool | None` when the validation alias is a string or a list of strings. I read that condition in the PR files page. I did not execute an aliased checkbox.

## An unselected file is missing. A named empty file is not.

[0.150.0](https://github.com/fastapi/fastapi/releases/tag/0.150.0) says that when no file is selected, browsers submit a file part with an empty filename and empty content. FastAPI treats that as missing. Required file fields return a validation error. Defaults and default factories are used. Unselected inputs are ignored in lists. Named zero-byte files are still accepted. [PR #16534](https://github.com/fastapi/fastapi/pull/16534) is merged, `2026-10-19T22:27:28Z`.

The [Request Files](https://fastapi.tiangolo.com/tutorial/request-files/) page I fetched does not mention this. A search of that page found no `unselected`, no `empty filename`, and no `0.150`. Do not wait for that tutorial to name the change.

At tag 0.151.0, `fastapi/dependencies/utils.py` has this helper:

```python
def _is_empty_file_input(value: Any) -> bool:
    # Browsers send an empty filename and content when no file is selected.
    return isinstance(value, UploadFile) and value.filename == "" and value.size == 0
```

Both conditions have to be true. I sent a part with `filename=""` and body `hello`. Both pins returned `200` and `{"filename":"","size":5}`. An empty name with content is still a file. Do not treat every empty filename as missing.

The browser-shaped part is the one that changes. The test file at that tag says HTTPX drops empty filenames, so the suite sends the multipart bytes directly. I measured the `files=` shortcut on 0.151.0 and it is the wrong probe. `files=[("file", ("", b"")), ("files", ("", b""))]` returned `422`, with `missing` on `file` and `value_error` on `files`: `Expected UploadFile, received: <class 'str'>`. That is httpx turning the empty name into a string. It is not the browser part the release describes.

Send the bytes:

```python
EMPTY_FILE = (
    b"--boundary\r\n"
    b'Content-Disposition: form-data; name="file"; filename=""\r\n'
    b"Content-Type: application/octet-stream\r\n\r\n"
    b"\r\n--boundary--\r\n"
)

@app.post("/file-required")
def file_required(file: Annotated[UploadFile, File()]):
    return {"filename": file.filename, "size": file.size}
```

Post that body with `content-type: multipart/form-data; boundary=boundary`.

- 0.151.0 returned `422` and `{"type":"missing","loc":["body","file"],"msg":"Field required","input":null}`.
- 0.146.0 returned `200` and `{"filename":"","size":0}`.

A named zero-byte file is the control. `files={"file": ("empty.txt", b"")}` returned `200` and `{"filename":"empty.txt","size":0}` on both pins. If your handler rejects size 0, that rejection is yours. The release still accepts the named empty file.

A list drops only the unselected part. I posted one named empty file on `file`, then three `files` parts: `first.txt` with empty content, an empty filename with empty content, and `last.txt` with `hello`.

- 0.151.0 returned `200` and `{"file":0,"files":[0,5],"names":["first.txt","last.txt"]}`.
- 0.146.0 returned `200` and `{"file":0,"files":[0,0,5],"names":["first.txt","","last.txt"]}`.

If a multi-file input counts every part, including the one the browser sends for "nothing selected," the count drops by one on 0.150.0 and later. The named empty file stays.

## JSON null is not "please use the default"

[0.151.0](https://github.com/fastapi/fastapi/releases/tag/0.151.0) is the current pin, and it is not a form change. The body says JSON request bodies now distinguish an explicit `null` from an omitted value. For individual `Body` parameters, `null` is validated as `None`. Nullable types accept it. Non-nullable types reject it even when a default is defined. Defaults apply only when the value is omitted. When a JSON object is expected because of `Body(embed=True)` or multiple body parameters, sending `null` as the entire body returns a validation error. Clients that used `null` to request a default should omit the value instead. [PR #16536](https://github.com/fastapi/fastapi/pull/16536) is merged, `2026-10-20T07:58:32Z`.

My first JSON check used the wrong shape. `value: Annotated[int, Body()] = 10` with `json={}` and with `{"value": null}` returned `422` `int_type` on `loc` `["body"]` on both pins. A bare `Body()` that expects an int is the whole body, not a field inside an object. That check does not show the 0.151.0 split. If both pins fail the same way, you posted the wrong shape. Use `embed=True`, or two body parameters.

The shape that matches the release:

```python
@app.post("/embed-default")
def embed_default(value: Annotated[int, Body(embed=True)] = 10):
    return {"value": value}
```

`json={}` and a POST with no body both returned `200` and `{"value":10}` on both pins. `json={"value": None}`:

- 0.151.0 returned `422` and `{"type":"int_type","loc":["body","value"],"msg":"Input should be a valid integer","input":null}`.
- 0.146.0 returned `200` and `{"value":10}`.

A nullable field accepts the null and does not fall back to the default. `value: Annotated[int | None, Body(embed=True)] = 10` with `json={"value": None}`:

- 0.151.0 returned `200` and `{"value":null}`.
- 0.146.0 returned `200` and `{"value":10}`.

Two body parameters, and a body that is the JSON value `null`:

```python
def two(
    value: Annotated[int | None, Body()] = 10,
    other: Annotated[int | None, Body()] = 20,
):
    return {"value": value, "other": other}
```

- 0.151.0 returned `422`, `missing` on `["body","value"]` and `["body","other"]`, `input` null.
- 0.146.0 returned `200` and `{"value":10,"other":20}`.

`json={}` still returned the defaults on both. `json={"value": None, "other": None}` returned nulls on 0.151.0 and the defaults on 0.146.0.

If a client sends `null` to mean "use the default," stop doing that before you pin 0.151.0. Omit the key, or omit the body. If the client sends `null` to mean "clear this nullable field," 0.151.0 does that and 0.146.0 did not, at least not on the embed shape I ran. I did not run the bare-body scalar cases in `tests/test_request_params/test_body/test_nullable_and_defaults.py` beyond the wrong-shape check above. The release says the same null-versus-omitted rule applies to a parameter that is the entire body. I am not going to paste a result I did not get.

## A default that used to be validated

[0.148.0](https://github.com/fastapi/fastapi/releases/tag/0.148.0) says defaults for omitted `Query`, `Header`, `Cookie`, and `Form` parameters and model fields are no longer treated as user input. They are not validated unless `validate_default=True`. `Body(validate_default=True)` is honored too. Applying a default no longer marks the field explicitly set. [PR #16527](https://github.com/fastapi/fastapi/pull/16527) is merged, `2026-10-19T12:14:41Z`.

I ran the Query case only. Header and Cookie are named in the release. I did not call them.

The validator is the one in the tag's `tests/test_request_params/test_default_validation.py`: `BeforeValidator` that returns `0` for `None` and otherwise doubles the int. Default `10`, omitted query:

```python
@app.get("/query-plain")
def query_plain(value: Annotated[ValidatedInt, Query()] = 10):
    return {"value": value}

@app.get("/query-validate")
def query_validate(value: Annotated[ValidatedInt, Query(validate_default=True)] = 10):
    return {"value": value}
```

- 0.151.0, plain Query, returned `200` and `{"value":10}`.
- 0.151.0, `validate_default=True`, returned `200` and `{"value":20}`.
- 0.146.0 returned `{"value":20}` both ways.

If you depended on a validator rewriting an omitted query default, add `validate_default=True` on the parameter you still want checked. Do not add it everywhere because the release mentions the flag. The 0.151.0 plain Query left `10` alone. That is the new default. I did not measure `Field(validate_default=True)` on a model field, and I did not measure `Body(validate_default=True)`. The release names both. The Query result is the one I have.

## What to change before the pin

Run the five checks against the pin you have and against 0.151.0. Change code only where the statuses differ.

1. A required form string that must accept a blank box will 422 on 0.151.0. Decide whether blank is an error. If it is not, do not leave the field required.
2. A form field with a default that used to store `""` will now store the default and report the field unset. If you branch on `model_fields_set`, that branch moves.
3. `bool = True` on a form field no longer means "unchecked keeps True." Expect `False`, and expect it to count as set.
4. A required file field will 422 when the browser sends an empty filename and empty content. A named zero-byte file still passes. Count file lists after the empty-name part is dropped, not before.
5. A client that sends JSON `null` to request a default has to omit the key instead. A nullable field that receives `null` stays null. It does not fall back.
6. A Query default that used to run a `BeforeValidator` will not, unless you set `validate_default=True`. I only measured Query.

I did not audit any service pin. The writing machine is still on 0.133.1. These checks are the throwaway envs, plus the release text.

## What this check does not close

A green `TestClient` run is not a browser, and it is not the FastAPI suite. I did not run `pytest` on their tree. I did not install `httpx2`. The warning is still there.

The live tutorial pages are behind the tag in two places and ahead in one. Boolean Form Fields is on the live forms page and does not name a version. Form Models on the live site does not have the sentence that is in the 0.151.0 docs file. Request Files does not mention the unselected-file rule. Read the GitHub release for the pin you install. Then run the client check that matches that release. A docs page that has not caught up is not a reason to skip the pin, and it is not a reason to trust a sentence that is not on the page yet.
