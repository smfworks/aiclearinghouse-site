---
slug: turn-on-jev-images
title: "Turn on Jev images before you send a box"
excerpt: "Images and box questions are off until the request carries TypeSafe-Danger-Zone-Images. The box type is only on jev-1.14.0. The curl below is the docs' multipart example, not a call this directory made."
category: Guides
tags:
  - jev
  - vision
  - structured-output
order: 99
last_verified: "2026-10-21"
---

# Turn on Jev images before you send a box

## How do you turn on Jev images?

Images and box questions stay off until the request includes TypeSafe-Danger-Zone-Images set to true. The models page still lists Jev 1.14 input as text, and both sentences are on official pages. The October 14 blog enables the box type only for jev-1.14.0. A 1.13 client that copies a box question is not on that path.

Jev 1.14 can take an image. It will not, until the request says so.

The images docs say images and box questions are off by default. Each request that contains an image or a box question needs the header `TypeSafe-Danger-Zone-Images: true`. The models page still lists Jev 1.14 input as text. Both sentences are on official pages. The header is how you leave the text default.

The October 14 blog says the `box` type, one bounding box, is enabled only for `jev-1.14.0`. A 1.13 client that copies a box question is not on the path the blog turned on.

This guide did not upload a photo. The curl is the docs' example.

## How do you send the image?

Send the image as its own multipart file part. Name the first part request with content type application/json. Each image is a separate file part, and the part field inside assets must match that file part's name. Part names are unique and not empty. The name request is reserved for the JSON body. Any other image content type returns 400.

The recommended upload is multipart. The first part is named `request`, content type `application/json`. Each image is its own file part. The image's `part` field inside `assets` must match that file part's name.

Rules from the same page:

- Part names are unique and not empty. `request` is reserved for the JSON body.
- An image part may be `image/png`, `image/jpeg`, `image/jpg`, `application/octet-stream`, or have no content type.
- Any other content type returns 400.

The blog says you can put images in `state`, `instructions`, or `criteria`. The curl below puts one image in `state`. That is the example I fetched, not a claim that the other two slots were exercised.

## What curl should you run?

Put a TypeSafe API key in TYPESAFE_API_KEY and a JPEG named door-camera.jpg beside the command, then run curl. Pin jev-1.14.0 when you need the box type the October 14 blog names. The docs sample jev-latest, and this guide did not check whether that alias has moved. The sample asks if a person is present. That is not a box question.

You need a TypeSafe API key in `TYPESAFE_API_KEY`, a JPEG named `door-camera.jpg` in the working directory, and `curl`. The model in the example is `jev-latest`, not a pinned `jev-1.14.0`. If you need the 1.14 box behavior, pin `jev-1.14.0`. The blog said `jev-latest` would move to 1.14.0 a week after October 14. This guide did not check whether that alias move has happened.

```bash
curl https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "TypeSafe-Danger-Zone-Images: true" \
  -F 'request={
    "model": "jev-1.14.0",
    "state": {"door": "a3f1c2e8-door"},
    "assets": {"a3f1c2e8-door": {"type": "image", "part": "door-photo"}},
    "questions": {
      "person_present": {"type": "noul", "instructions": "Is there a person in `door`?"}
    }
  };type=application/json' \
  -F 'door-photo=@door-camera.jpg;type=image/jpeg'
```

The docs' sample model string is `jev-latest`. The curl above pins `jev-1.14.0` because that is the id the blog names for the box type, and because an unpinned alias is a moving target on the day the blog said the alias would move. Everything else in the body and headers is the docs' example: the asset id, the `noul` question, the part name `door-photo`, and the JPEG content type.

The question in that example is not a box question. It asks whether a person is present. A box question is a different type. The box docs page I opened did not return a request body, only a heading. Don't invent the box schema from the word "bounding box." Use the images header, pin 1.14.0, and read https://docs.typesafe.ai/go/box before you add `"type": "box"`.

## Is the images header the same as long context?

No. Long context uses TypeSafe-Danger-Zone-Long-Context set to true. The models page says that header raises both limits to 262k tokens on 1.14 and on 1.13. Without it, the limits are 64k per request and 32k per question. An image request does not need that header unless the state plus the question no longer fits.

Long context is a different header: `TypeSafe-Danger-Zone-Long-Context: true`. The models page says it raises both the per-request and per-question limits to 262k tokens, on 1.14 and on 1.13. Default without it is 64k per request and 32k per question. It costs the same per token and the page says it is slower and less accurate.

An image request does not need the long-context header unless the state plus the question no longer fits. Sending both headers because they share a prefix is how you pay for a slower request you didn't need.

Input price on the models table is $0.042 per million tokens. Output tokens are free. An image still counts as input. The page I read did not print a separate image-token rate, so this guide doesn't invent one.

## Sources

- Images, including the multipart curl: https://docs.typesafe.ai/go/images
- Release notes for the box type and the danger-zone framing: https://typesafe.ai/blog/jev-1-14
- Context limits and the text-input row: https://docs.typesafe.ai/models
