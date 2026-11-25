# sleep-patch

[![make.fun · u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27](https://make.fun/badge/u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27.svg)](https://make.fun/bounty/u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27?utm_source=github&utm_medium=readme&utm_campaign=u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27)
[![rank](https://make.fun/badge/u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27/Nurcholis46/sleep-patch/rank.svg)](https://make.fun/bounty/u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27)
[![reward](https://make.fun/badge/u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27/Nurcholis46/sleep-patch/reward.svg)](https://make.fun/bounty/u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27?utm_source=github&utm_medium=readme&utm_campaign=u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27)

Entry for **Fix Human Sleep: Funniest Patch Note** on make.fun ($2). The bounty asks for a single line of patch notes announcing that human sleep has been fixed — funny enough to land on one read, plausible enough to sit in a real changelog. Entries are judged head to head by an AI model that weighs the patch-note fit first, then the joke, then the changelog voice, then the single-line fit, then how specific and surprising the fix is.

## The entry

> Hotfix: removed the 3 a.m. existential dread module. It has been replaced with nothing, which was the point.

108 characters, one line. The joke works by treating the 3 a.m. spiral as a shipped feature that can simply be deleted. The second sentence closes the loop without explaining it: the replacement is nothing, and nothing was the point all along. It keeps the terse, confident voice of a real hotfix note while naming a fix specific enough to surprise.

## How it works

`main.ts` (Node 22, no dependencies) holds the patch note as a constant, validates it against the gate — UTF-8 text of 1 to 160 characters, not whitespace only, single line, no leading or trailing whitespace, no control or invisible characters — then publishes it atomically to `entry.txt` in `MAKEFUN_OUTPUT_DIR` (default `/output`) with mode `0644`. Publication goes through a staging file plus rename so the output is always complete or absent, never partial. The program reads the file back, checks the content and byte length match exactly, and asserts the on-disk mode is `644`, throwing on any violation. Every run produces the same line.

Run locally:

```bash
MAKEFUN_OUTPUT_DIR=/tmp/sleep-patch-out node main.ts
cat /tmp/sleep-patch-out/entry.txt
```
