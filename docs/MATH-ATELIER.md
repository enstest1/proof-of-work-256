# PROOF//OF//WORK — Math Atelier

**Status:** interactive deterministic art editor, browser-side preview and social exporter. **Not the onchain Solidity renderer and not an executed diffusion-model output.** Related contract and IMD proof state remains unchanged.

## Goals

Produce visually distinct, high-quality geometry from collector-controlled inputs for project teasers and collectible studies, without pretending an AI-generated promotional image is the immutable SVG inside `ProofCanvas.tokenURI`.

Implemented as a small self-contained, dependency-free JS graphics engine rather than pulling an entire creative-coding runtime into the public site. The algorithms are compatible with the creative-coding workflows popularized by [canvas-sketch](https://github.com/mattdesl/canvas-sketch) and [p5.js](https://github.com/processing/p5.js), but **neither repo is imported or redistributed here**.

## Five art grammars

| Form | Deterministic construction |
|---|---|
| ORBIT | Nested, interfering parametric epicycloid/hypocycloid contours and orbital chords |
| VESSEL | Surface-of-revolution filaments with organic profile and cross-sectional interference |
| LATTICE | Warped orthogonal quasi-crystalline textile flow fields and moiré rings |
| FRACTURE | Directed crack growth, angular triangles, sparse particles and gold repair stipples |
| CIVILIZATION | Four independent architectural districts, 256 nodal identities and a preview-only web of bridges |

All artworks derive from a deterministic hash of **Genesis token ID, selected grammar, proposed future A/B, illustrated proof count, dissent and era**. Studio parameters are *not* read from the real deployed onchain contract.

## Outputs

- `COLLECTOR VECTOR SVG`: resolution-independent, deterministic SVG artwork, readable with plotter/print workflows.
- `SOCIAL PNG`: 1080x1350 source poster rasterized at 2x (2160x2700), optimized for tall social feeds.
- `CONTROLNET LINE GUIDE`: clean white-background, black-line SVG for optional ControlNet Scribble conditioning.
- `COPY SDXL PROMPT`: text briefing that asks a model to preserve the mathematically determined structure without added logos.

The user can optionally rasterize the ControlNet line guide and use it in **ComfyUI** with a licensed **SDXL** checkpoint and a compatible Scribble ControlNet, using the exported text as positive prompt. The model and weights are **not** bundled, hosted or invoked by this repository. Check all model licenses and usage rights before any monetized edition.

## Art authenticity

- Production `web/deployment.json` remains `deployed: false` and `mintingEnabled: false`.
- A collector preview generated at `#atelier` is **not** an authenticated oracle-certified NFT and is never published to chain by this feature.
- The generation engine is browser-only: no wallet calls, tokens, secret keys or provider APIs.
- For a future onchain metadata update, use a separate carefully reviewed and gas-budgeted Solidity renderer or an immutable content-addressed art commitment. Do not silently substitute an SDXL raster for the signed SVG `tokenURI`.
- Social promotion should say "mathematical artwork study", "preview", or "not minted" until authentic receipts exist.

## Tests

`node --test tests/art-studio.test.mjs` checks determinism, grammar difference, bounded inputs, honesty labels and UI hook presence. Browser QA should confirm `#atelier` loads, five preset cards display, changing grammar re-renders, and no layout overflow occurs on mobile.

## Useful upstream projects

- [p5.js](https://github.com/processing/p5.js): drawing/creative-coding language; see LGPL license.
- [canvas-sketch](https://github.com/mattdesl/canvas-sketch): JavaScript generative-art framework; MIT license.
- [Hydra](https://github.com/hydra-synth/hydra): optional live visuals for later video exports; AGPL license.
- [SDXL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0): optional image-polishing model, separate from authentic geometry.
- [ControlNet Scribble](https://huggingface.co/lllyasviel/control_v11p_sd15_scribble): **SD 1.5-compatible** Scribble checkpoint, not directly compatible with SDXL. Use an **SDXL-compatible ControlNet** if using an SDXL workflow; don't interchange model families.
