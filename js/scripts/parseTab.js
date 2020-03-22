function formatRawTabs(raw_tabs) {
	//Remove [ch][/ch] around chords
	raw_tabs = raw_tabs.replace(/(\[ch\]|\[\/ch\])/g, '');
	//Remove anything before an [Intro] tag
	raw_tabs = raw_tabs.replace(/[\s\S]*?(?=\n.*?\[intro\])/i, '');
	//Remove ellipses
	raw_tabs = raw_tabs.replace(/(\.\.\.|…)/g, ' ');
	//Remove [Intro], [Verse], etc
	raw_tabs = raw_tabs.replace(/(\[(intro|verse[s]?|chorus|bridge|outro|hook|instrumental|interlude|pre-?chorus)\ ?\d?\]\n?)/gi, '');
	// Remove periods, question marks, and commas
	raw_tabs = raw_tabs.replace(/(\?|,|\.|:)/g, '');
	// Remove this [tab] [/tab] thing that's coming up now
	raw_tabs = raw_tabs.replace(/\[\/?tab\]/g, '')
	return raw_tabs;
}

module.exports = {formatRawTabs};
