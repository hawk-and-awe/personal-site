---
code: M-02
title: Spec → Build
group: methods
oneLiner: Getting production tools built by writing specs an AI engineer can execute.
diagram:
  - Need
  - Spec
  - Build plan
  - Work orders 1…N
  - Review
  - Ship
related: [P-04]
pending:
  - "[CONFIRM] Keep the Methods group?"
order: 21
---

For internal tools, I write the spec (what and why) and a separate build document (how, and in what order), then run it as numbered, self-contained work orders for Claude Code, which starts every session with no memory. Each order has a scope, constraints and acceptance criteria.

This page was built the same way.
