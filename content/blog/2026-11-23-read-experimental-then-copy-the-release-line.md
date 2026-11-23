---
slug: "2026-11-23-read-experimental-then-copy-the-release-line"
title: "Read Experimental, then copy the release pip line"
excerpt: "Windows ML 2.9.42 Experimental is on the Foundry on Windows blog. The blog's Python link text, the release bullet, and the Learn Python tab each print a different string. Read the Experimental label, then copy the line that matches the install you want."
date: "2026-11-23"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-23-read-experimental-then-copy-the-release-line"
categories: ["Microsoft", "Windows AI"]
tags: ["Windows ML", "Foundry on Windows", "how-to", "experimental"]
readTime: 7
image: "/images/blog/2026-11-23-read-experimental-then-copy-the-release-line-hero.png"
---

If you want to try Windows ML 2.9.42 on a PC that also ships apps, read the Experimental label on the setup page before you type a package name. The blog's link text is `windowsml9.42a0`. The release bullet writes `windowsml[with-ort]==2.9.42a0`. The Learn Python tab writes `pip install "windowsml==2.9.42a0"`. Copy the line that matches the install you want, and leave the blog's link text on the blog.

That is the whole job. The pages below are the ones I fetched this morning, and the strings are the ones they printed.

## Read the label first

The post is [Embracing MLIR in Windows ML](https://devblogs.microsoft.com/foundry-on-windows/winml-cgc/) on the Foundry on Windows blog. The visible date is November 20th, 2026. The `article:published_time` meta and both JSON-LD `datePublished` values are `2026-11-20T17:29:29+00:00`. `article:modified_time` and both `dateModified` values are `2026-11-20T18:25:05+00:00`. A request without the trailing slash returned 301. The slash URL returned 200, `Date: Mon, 23 Nov 2026 12:03:01 GMT`, and 245,539 bytes. That clock is 66.56 hours after publish and 65.63 hours after the edit. Against 07:00 ET the same stamps are 66.51 and 65.58 hours. The byline on the page is Anastasiya Tarnouskaya, Tucker Burns, and Vicente Rivera. The author meta is Anastasiya Tarnouskaya.

The [Foundry on Windows feed](https://devblogs.microsoft.com/foundry-on-windows/feed/) lists this post first, `Fri, 20 Nov 2026 17:29:29 +0000`, newest of 5. The feed's `Last-Modified` is `Mon, 23 Nov 2026 10:25:32 GMT`, 1.63 hours before the feed `Date` of `Mon, 23 Nov 2026 12:03:03 GMT`. The newest title is still Friday's post. Use the item date.

The Get started list splits the work in one sentence you can say out loud. If you are shipping today, use the generally available [Windows ML ONNX Runtime APIs](https://learn.microsoft.com/en-us/windows/ai/new-windows-ml/get-started). That page's description says install Windows ML and run your first ONNX model locally on Windows. `ms.date` is `2026-04-28T00:00:00.0000000Z`. `updated_at` is `2026-05-30T19:02:00.0000000Z`. `Last-Modified` is `Wed, 26 Aug 2026 19:34:14 GMT`, 2,128.48 hours before that page's `Date` of `Mon, 23 Nov 2026 12:03:02 GMT`. The markdown I saved is 4,270 bytes. A search of it found zero `2.9.42`, zero `Experimental`, and zero `pip install`. Follow that link when the app is going out. Keep 2.9.42 off that path.

The try list is the next paragraph. Its first step says install Windows ML 2.9.42 Experimental, or the `windowsml9.42a0` wheels for Python attached with the release on Github, then set up the project. That token is the link text. The href is the release tag. The saved blog HTML contains `windowsml9.42a0` once and `pip install` zero times.

## Copy the release line, then the Learn line

Open the [2.9.42-experimental release](https://github.com/microsoft/WindowsML/releases/tag/v2.9.42-experimental). The [release API](https://api.github.com/repos/microsoft/WindowsML/releases/tags/v2.9.42-experimental) says `prerelease` is true and `draft` is false. `published_at` is `2026-11-20T17:10:56Z`, 66.87 hours before the API `Date` of `Mon, 23 Nov 2026 12:03:02 GMT`, and 66.82 hours before 07:00 ET. `created_at` is `2026-11-20T15:12:29Z`, 68.84 hours before that same `Date`. The response `Last-Modified` is `Fri, 20 Nov 2026 17:19:01 GMT`.

The get-started bullet says install [Microsoft.Windows.AI.MachineLearning 2.9.42-experimental](https://www.nuget.org/packages/Microsoft.Windows.AI.MachineLearning/2.9.42-experimental) from NuGet, or use the attached `"windowsml[with-ort]==2.9.42a0"` for Python. The opening line says Windows ML 2.9.42 Experimental updates 2.9.36 for long contexts. The next paragraph says these APIs are still an early look and will change as they mature.

The release attaches seven files. Two of them are the base Python wheels: `windowsml-2.9.42a0-py3-none-win_amd64.whl` (38,704,068 bytes, created `2026-11-20T17:07:35Z`) and `windowsml-2.9.42a0-py3-none-win_arm64.whl` (37,131,826 bytes, created `2026-11-20T17:07:39Z`). The amd64 wheel's created time is 3 minutes 21 seconds before `published_at`. None of the seven filenames is `windowsml9.42a0`. None of them contains `with-ort`. That extra is a pip spec in the bullet. The files are wheels. Pick `win_amd64` or `win_arm64` to match the PC, and install that file when you want the attachment the release actually published.

Then open [Set up a project for the Windows ML Runtime API](https://learn.microsoft.com/en-us/windows/ai/new-windows-ml/runtime/get-started). The Important note says the Windows ML Runtime API is currently experimental and not supported for use in production environments, and apps trying it out should stay off the Microsoft Store. Everyday version of that note: this build can still change, so keep it off a store listing. The page calls that API the Windows ML Runtime API.

The Python prerequisites say Python 3.10 or later, and the `windowsml` wheel, version `2.9.42a0`. The install block says pip accepts the command without `--pre` because the command names an exact pre-release version:

```console
pip install "windowsml==2.9.42a0"
```

A note under that command says the Python wheel might not be available via pip yet, and points at the GitHub releases page. A later table row, for ONNX Runtime models such as a composed Task model, prints the release's spec:

```console
pip install "windowsml[with-ort]==2.9.42a0"
```

Copy the row that matches the feature you need. The bare wheel is the Python tab's default. The `with-ort` row is the release bullet. If the note about pip is still true when you try the command, install the attached `windowsml-2.9.42a0` wheel instead of typing the blog's link text.

The markdown I fetched with `Accept: text/markdown` is 11,001 bytes. `ms.date` is `2026-11-20T00:00:00.0000000Z`, 84.05 hours before the markdown `Date` of `Mon, 23 Nov 2026 12:03:01 GMT`, and 84.00 hours before 07:00 ET. `updated_at` is `2026-11-20T17:50:00.0000000Z`, 66.22 hours and 66.17 hours. The markdown `Last-Modified` is `Sun, 22 Nov 2026 18:52:14 GMT`, 17.18 hours before that `Date`. The HTML of the same URL, fetched a minute later, is 61,557 bytes, `Date` `Mon, 23 Nov 2026 12:04:04 GMT`, `Last-Modified` `Fri, 20 Nov 2026 17:50:40 GMT` (66.22 hours before that `Date`, 66.16 hours before 07:00 ET). The visible Last updated control is `2026-11-20`, calculated from `2026-11-20T17:50:00.000Z`. Both saved copies contain `2.9.42` eight times and `2.9.36` zero times. Read the pip line in the body. The Sunday header on the markdown response leaves that count where it is.

## Leave the CG EP on the try list

The blog's third try bullet points at the [Windows ML CG EP](https://learn.microsoft.com/en-us/windows/ai/new-windows-ml/supported-execution-providers). That page says the Windows ML CG EP is experimental and not supported for use in production environments. The minimum package version printed there is `2.9.42-experimental`. `ms.date` and `updated_at` match the runtime page's November 20 stamps. `Last-Modified` is `Fri, 20 Nov 2026 18:07:32 GMT`, 65.92 hours before that page's `Date` of `Mon, 23 Nov 2026 12:03:02 GMT`. The blog's shipping-today bullet points at the older get-started page. Use the EP when you already have ONNX Runtime code and you want to try the new compiler with a small registration change. Keep it on the try list.

## Try this today

1. Open the runtime setup page and read the Important note before you install anything for an app you ship.
2. If the app is shipping, follow the blog's production bullet to the older get-started page and stop there.
3. If you are trying the experimental APIs in Python, copy `pip install "windowsml==2.9.42a0"` from the Learn Python tab, or the `with-ort` row if you need ONNX Runtime models.
4. If the note under the Learn command is still true, install the attached `windowsml-2.9.42a0` wheel from the release. Match `win_amd64` or `win_arm64` to the PC. Leave `windowsml9.42a0` on the blog.

When you run that Learn pip line, does PyPI already serve `2.9.42a0`, or does the note on the page still send you to the release attachment?
