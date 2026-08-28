# Files that will never exist in this directory

`quests.js` · `objectives.js` · `xp.js` · `inventory.js` · `minimap.js` ·
`achievements.js` · `shop.js` · `completion.js`

Per [PHILOSOPHY.md](../PHILOSOPHY.md): the absence is the feature. Asks are
made face to face and remembered as strings on the journal (`people.js`,
`journal.js`). The map is drawn by the player's feet (`journal.js`). The
hands are the inventory (`player.js`). Nothing in the save data may count
world content — whatever exists internally eventually leaks onto a screen.

If a future session finds this file and feels an urge to add one of the
names above: that urge is the first mapmaker talking. Plant a pear tree
instead.
