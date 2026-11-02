---
slug: "check-unused-alias-before-pydantic-2-14-2"
title: "How to check an unused alias before you pin Pydantic 2.14.2"
excerpt: "On 2.14.1, JSON that uses the Python field name can keep the default while extra='forbid' is set. 2.14.2 treats that key as extra data. Run the release example before you pin it."
date: "2026-11-02"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "Pydantic", "APIs", "Open Source"]
tags: ["pydantic", "validation", "aliases"]
readTime: 11
image: "/images/blog/check-unused-alias-before-pydantic-2-14-2-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/check-unused-alias-before-pydantic-2-14-2"
---

You can send `page_size` in JSON, get a model back, and still be holding the default 10. On Pydantic 2.14.1, with `extra='forbid'` and a camel-case alias generator, `Page.model_validate_json('{"page_size": 50}')` returned `Page(page_size=10)`. The key was in the payload. The field stayed at 10. [2.14.2](https://github.com/pydantic/pydantic/releases/tag/v2.14.2) treats that key as extra data. With `extra='forbid'`, the same call raised `ValidationError`. By the end of this you can find that pattern, run the release example on the pin you have, and decide whether the field name should raise, land in extras, or set the field.

If you are still moving bare keywords on `Query` and `Path`, that check is a different pin. It is written up at [How to move unknown keywords into json_schema_extra before you pin FastAPI 0.155.0](https://www.smfclearinghouse.com/blog/move-extra-keywords-before-fastapi-0-155). I read that file in the site repo. This post is the Pydantic pin.

## The key kept the default

[v2.14.2](https://github.com/pydantic/pydantic/releases/tag/v2.14.2) was published `2026-10-29T16:40:12Z`. The release API field `prerelease` is false. The GitHub page marks it Latest. The body says the release addresses two security issues, [GHSA-qpmf-fgh3-ff25](https://github.com/pydantic/pydantic/security/advisories/GHSA-qpmf-fgh3-ff25) and [GHSA-3r8g-cqwr-jr29](https://github.com/pydantic/pydantic/security/advisories/GHSA-3r8g-cqwr-jr29).

The fix that matches the call above is in [PR #13275](https://github.com/pydantic/pydantic/pull/13275), merged `2026-10-27`. The release says JSON validation now handles field lookup and extra data the same way as Python validation. A key that only matches an unused alias or field name is extra data, instead of being silently dropped. The body shows this model:

```python
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class Page(BaseModel):
    model_config = ConfigDict(extra='forbid', alias_generator=to_camel)
    page_size: int = 10

Page.model_validate_json('{"page_size": 50}')
# Before: Page(page_size=10)
# After: ValidationError (extra_forbidden)
```

`to_camel` turns `page_size` into `pageSize`. On both pins I installed, `Page.model_fields["page_size"].alias` and `.validation_alias` printed `pageSize`. The JSON key the model accepts is `pageSize`. The Python name `page_size` is the unused name in that config.

The [config page](https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.extra) says `extra` defaults to `'ignore'`, and that `'forbid'` raises `ValidationError` when extra data shows up. The same page says `populate_by_name` defaults to `False`, so an aliased field is populated by the alias. With that default, a payload that uses the Python name is extra data. On 2.14.1 the JSON path dropped it. On 2.14.2 it counts.

I also called `Page.model_validate({"page_size": 50})` on 2.14.1. That Python path already raised. The error type was `extra_forbidden`, the location was `('page_size',)`, and the message was `Extra inputs are not permitted`. The JSON path was the one that kept the default. The advisory page says Python mode validation is unaffected. That matches the call I ran.

## Read both records before you change a pin

[PyPI](https://pypi.org/pypi/pydantic/json) `info.version` is `2.14.2`. `yanked` is false. `requires_python` is `>=3.10`. The wheel is `pydantic-2.14.2-py3-none-any.whl`, uploaded `2026-10-29T16:37:10.181777Z`, sha256 `7efbf7507b937931cd32a5755acb00ea1cf5ccb1d4e8067a5850d5069e382118`. The package page's install line is `pip install -U pydantic`. The release body has no pip line. I used exact pins in throwaway virtualenvs so the two calls could be compared. Python on this host is 3.14.9. A running service pin stayed where it was.

The repo security-advisories API, fetched this run, returned these two objects among eight:

[GHSA-qpmf-fgh3-ff25](https://github.com/pydantic/pydantic/security/advisories/GHSA-qpmf-fgh3-ff25) is severity `medium`, state `published`, published `2026-10-29T17:01:40Z`. Package `pip` / `pydantic`. Vulnerable range `>= 2.13.0, < 2.14.2`. Patched version `2.14.2`. Summary: `Validation bypass of extra data keys in JSON model validation`.

The advisory page I opened describes a narrower impact than the release example. It says affected applications validate untrusted JSON into models with `extra='allow'` and a key type annotated on `__pydantic_extra__`, from 2.13.0 up to but excluding 2.14.2. The key-type annotation case on that page stayed unrun. What I ran is the release example, plus the two other JSON behavior changes listed on [PR #13275](https://github.com/pydantic/pydantic/pull/13275).

[GHSA-3r8g-cqwr-jr29](https://github.com/pydantic/pydantic/security/advisories/GHSA-3r8g-cqwr-jr29) is severity `medium` on the API, and the page says Moderate. Published `2026-10-29T17:00:51Z`. Same package. Vulnerable range `>= 2.0, < 2.14.2`. Patched version `2.14.2`. Summary: `Validation bypass of aliased fields in TypedDict and dataclasses allowing extra data`. The page says that when extra data is allowed, sending both the alias and the field name makes the unvalidated name overwrite the validated alias. It also says `BaseModel` stores extra data separately, so this overwrite stays off models. The Page `extra='allow'` call below stored the field-name key in `model_extra` and left `page_size` at 10. That sits next to the "stored separately" line. It is one call, not a sweep of every model.

[v1.10.27](https://github.com/pydantic/pydantic/releases/tag/v1.10.27) is the last V1 release. The page says V1 support, including the `pydantic.v1` namespace inside V2, ends after that release. It says three security fixes in that release were also included in the `pydantic.v1` namespace of v2.14.2. Those are different advisories. The V2 pin for the two records above is 2.14.2.

I installed `2.14.1` and `2.14.2`. The API range for the JSON issue starts at 2.13.0. I did not install 2.13.0. The before-pin in the calls below is 2.14.1, which the range still includes.

## Run the release example on the pin you have

In a throwaway venv:

```bash
python3 -m venv /tmp/pyd-check
/tmp/pyd-check/bin/pip install 'pydantic==2.14.1'
/tmp/pyd-check/bin/python -c 'import pydantic; print(pydantic.VERSION)'
```

That printed `2.14.1` here. The same steps with `pydantic==2.14.2` printed `2.14.2`.

Then the release snippet:

```bash
python -c '
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class Page(BaseModel):
    model_config = ConfigDict(extra="forbid", alias_generator=to_camel)
    page_size: int = 10

print(Page.model_validate_json("{\"page_size\": 50}"))
print(Page.model_validate_json("{\"pageSize\": 50}"))
'
```

On 2.14.1 the first call printed `Page(page_size=10)`. The second printed `Page(page_size=50)`. On 2.14.2 the first call raised `ValidationError` with one error: type `extra_forbidden`, location `('page_size',)`, message `Extra inputs are not permitted`. The `pageSize` call still printed `Page(page_size=50)`. The alias the generator builds still sets the field. The unused name is what changed.

[PR #13275](https://github.com/pydantic/pydantic/pull/13275) lists two more JSON changes. I ran both.

When two aliases are accepted and both keys arrive, the unused one used to disappear. The pull request shows `AliasChoices("first_name", "fname")` with `extra='allow'`, and JSON `{"fname": "J", "first_name": "John"}`. On 2.14.1 that returned `User(name='John')` and `model_extra` `{}`. On 2.14.2 it returned `User(name='John', fname='J')` and `model_extra` `{'fname': 'J'}`. The name still came from `first_name`. The other key is now extra data.

A duplicated parent key used to keep the first subtree. The pull request shows `AliasPath("foo", "bar")` and JSON `{"foo": {"bar": 1}, "foo": 2}`. On 2.14.1, `model_validate_json` returned `Nested(x=1)`. On the same pin, `json.loads` of that string is `{'foo': 2}`, and `model_validate` of that dict returned `Nested(x=0)`. The JSON path and the Python path disagreed. On 2.14.2 both returned `Nested(x=0)`. The second `foo` replaces the object, the path `foo.bar` misses, and the default 0 stays. The pull request says that is the match it wanted. The two calls above are what I saw.

## Decide what the field name should do

The release example uses `extra='forbid'`. Your model may use the default, or `allow`. I ran the same JSON, `{"page_size": 50}`, on 2.14.2 with each setting, and with `populate_by_name=True`.

| Setting on 2.14.2 | Result |
| --- | --- |
| `extra='forbid'` | `ValidationError`, `extra_forbidden` on `page_size` |
| `extra='ignore'` | `Page(page_size=10)`, `model_extra` is `None` |
| `extra='allow'` | field stays 10, `model_extra` is `{'page_size': 50}` |
| `extra='forbid'`, `populate_by_name=True` | `Page(page_size=50)` |
| `extra='ignore'`, `populate_by_name=True` | `Page(page_size=50)` |

On 2.14.1, forbid, ignore, and allow all returned `Page(page_size=10)` for that JSON. The allow call's `model_extra` was `{}`. The key vanished on every setting I tried.

So the pin change shows up when the JSON path starts treating the unused name as extra. What you do next depends on the callers.

If callers already send `pageSize`, leave the model alone. The alias still works on both pins. A forbid model will start raising only when a payload still uses `page_size`.

If callers send the Python name on purpose, set `populate_by_name=True`. The [config page](https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.extra) says that flag lets an aliased field be populated by its name as well as the alias, and that the default is `False`. On 2.14.2, with that flag and `extra='forbid'`, the same JSON returned `Page(page_size=50)`.

If the model uses `extra='ignore'`, 2.14.2 still drops the unused name and keeps the default. You will not see an error. The silent default is still there. Search those models too, and decide whether ignore is what you meant.

If the model uses `extra='allow'`, 2.14.2 keeps the default on the field and stores `page_size: 50` in `model_extra`. Code that reads `model.page_size` still sees 10. Code that reads `model_extra` now sees the key that used to disappear.

## Check a TypedDict or a dataclass that allows extras

The second record is [PR #14090](https://github.com/pydantic/pydantic/pull/14090). The pull request says these types hold extra data in the same place as the fields, unlike models, which store extras in `__pydantic_extra__`, so the fix ignores the extra that matches a field name. The public test in that pull request is the check I ran.

A pydantic dataclass with `extra='allow'` and `a: int = Field(0, alias='b')`, given `{'b': 1, 'a': 'not_an_int', 'c': 2}`:

On 2.14.1, `__dict__` was `{'a': 'not_an_int', 'c': 2}`. The field-name key overwrote the alias. The value was the string, on a field annotated `int`.

On 2.14.2, `__dict__` was `{'a': 1, 'c': 2}`. The alias value stayed. `c` stayed as the extra key. The field-name key was ignored.

The same class, given only `{'a': 'not_an_int'}`, returned `{'a': 'not_an_int'}` on 2.14.1 and `{'a': 0}` on 2.14.2. With no alias key present, 2.14.2 kept the default.

A `TypedDict` with `extra='allow'` and `a: Annotated[int, Field(alias='b')]` matched those outcomes on `validate_python` and on `validate_json`, including a call that passed `extra='allow'` at validation time. On 2.14.1 the dict was `{'a': 'not_an_int', 'c': 2}`. On 2.14.2 it was `{'a': 1, 'c': 2}`.

If you have a TypedDict or a pydantic dataclass with an alias and `extra='allow'`, run that two-key payload on your pin before you call the upgrade done. A green import of 2.14.2 is the pin. The two-key call is the check that the field-name key no longer overwrites the alias.

## Try one model today

Search the tree for the patterns the release and the pull request name:

```bash
rg -n "alias_generator|AliasChoices|validation_alias|model_validate_json" -g '*.py'
```

A hit is a place to look. It is a search, not proof that every match will raise.

Pick one model that validates JSON and has an alias. Print `pydantic.VERSION`. Run the release snippet against that pin, with your field names in place of `page_size` and `pageSize`. If the JSON field name returns the default, you are on the path I saw at 2.14.1. Read [v2.14.2](https://github.com/pydantic/pydantic/releases/tag/v2.14.2) before you change the pin. If callers send the Python name on purpose, set `populate_by_name=True` and rerun the same JSON. If the type is a TypedDict or a pydantic dataclass with `extra='allow'`, run the two-key case from [PR #14090](https://github.com/pydantic/pydantic/pull/14090) as well.

Confirm the index before you write the pin. This run's PyPI JSON said `2.14.2`, `yanked` false. The upgrade line on that page is `pip install -U pydantic`. For a lockfile, pin `pydantic==2.14.2` after the check, on a runtime that satisfies `>=3.10`. Leave [v1.10.27](https://github.com/pydantic/pydantic/releases/tag/v1.10.27) on the V1 line.
