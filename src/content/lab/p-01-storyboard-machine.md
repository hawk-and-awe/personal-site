---
code: P-01
title: The Storyboard Machine
group: production
oneLiner: A node-based pipeline that produces on-style storyboard frames with the same characters in every shot.
status: in-use
years: "2026"
role: Pipeline designer
tools: [Artlist Flow, Claude]
highlights:
  - Style lock plus character pools make the boards repeatable
  - A written shot grammar turns generative output into usable boards
  - Several concept directions boarded in the time one used to take
diagram:
  - Script
  - Shot list, written to the grammar
  - [Style reference, Character pools, Shot prompt]
  - Frame
  - Board strip
related: [P-02, M-01]
pending:
  - "[ASSET] Node-graph screenshot and a board strip from a dummy concept — or clear it to publish as text + diagram."
order: 1
---

Built in-house at a national benefits company, where we needed to board several competing concepts for a broadcast spot quickly. The flow combines a style reference (a sample of the pencil-sketch treatment) with pools of reference characters — two leads plus supporting cast — so any shot prompt comes out in the same drawing style with the same faces.

The output only reads as real boards because of the shot-writing rules:

- One frame is one camera view and one moment. Dynamic beats get split across frames.
- Prompts describe hard scene facts and explicit facial expressions only — no lighting, color or mood language.
- Every shot prompt stands on its own. Never "same room as before."
