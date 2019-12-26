import { csv, hierarchy, json } from 'd3';

export const loadStackedArtistData = (url) => {
  return json(url).then(trackData => {
    var startDate = new Date('2019', '00', '01');
    var endDate = new Date('2020', '00', '01');


    var sortedGenreList = [];
    var sortedArtistList = [];
    var sortedTrackList = [];
    var totalPlaysByArtist = {};
    var totalPlaysByGenre = {};
    var totalPlaysByTrack = {};
    var deepestGenresByArtist = {};
    
    var topGenres = [];
    var topArtists = [];
    var topTracks = [];
    var topTracksUniqueArtists = [];
    var byWeekPlaysGenre = [];
    var byWeekPlaysArtist = [];
    var byWeekPlaysTrack = [];
    var weekDict = {};
    
    trackData.forEach(d => {
      d.listen_date = new Date(d.listen_date);
      if (d.listen_date < startDate || d.listen_date > endDate)
        return;

      // Convert time since Jan 1 from msec to # of weeks
      // 1000 msec/sec, 60 sec/min, 60 min/hr, 24 hr/day, 7 days/week, +1 so it starts on week 1
      d.weekNum = (parseInt((d.listen_date - startDate)/1000/60/60/24/7 + 1));
      // console.log(d.artists)
      if (totalPlaysByArtist[d.artists[0]] === undefined)
        totalPlaysByArtist[d.artists[0]] = 1;
      else
        totalPlaysByArtist[d.artists[0]] += 1;

      if (totalPlaysByTrack[d.name] === undefined)
        totalPlaysByTrack[d.name] = {artist: d.artists[0], track: d.name, plays: 1};
      else
        totalPlaysByTrack[d.name].plays += 1;
      
      if (weekDict[d.weekNum] === undefined)
        weekDict[d.weekNum] = {artists: {}, genres: {}, tracks: {}};
      
      if (weekDict[d.weekNum].artists[d.artists[0]] === undefined)
        weekDict[d.weekNum].artists[d.artists[0]] = 1;
      else
        weekDict[d.weekNum].artists[d.artists[0]] += 1;
       
      if (weekDict[d.weekNum].tracks[d.name] === undefined)
        weekDict[d.weekNum].tracks[d.name] = 1;
      else
        weekDict[d.weekNum].tracks[d.name] += 1;
    });
    
    // Sort the list of genres according to total play count
    sortedArtistList = Object.keys(totalPlaysByArtist).sort((a, b) => totalPlaysByArtist[b] - totalPlaysByArtist[a]); 
    sortedTrackList = Object.keys(totalPlaysByTrack).sort((a, b) => totalPlaysByTrack[b].plays - totalPlaysByTrack[a].plays);
    Object.keys(weekDict).forEach(w => {
      const i = +w - 1;
      var obj = {week: i + 1};
      
      topArtists = sortedArtistList//.slice(0, numArtists);
      topTracks = sortedTrackList
      
      var artistObj = {week: i + 1};
      var trackObj = {week: i + 1};
      
      topArtists.forEach(a => {
        artistObj[a] = weekDict[w].artists[a] ? weekDict[w].artists[a] : 0;
      });
            
      byWeekPlaysArtist.push(artistObj);

      topTracks.forEach(g => {
        trackObj[g] = weekDict[w].tracks[g] ? weekDict[w].tracks[g] : 0;
      });
      byWeekPlaysTrack.push(trackObj); 
    });

    var toReturn = {}; 
    toReturn.byWeekPlaysArtist = byWeekPlaysArtist;
    toReturn.byWeekPlaysTrack = byWeekPlaysTrack;

    toReturn.totalPlaysByArtist = totalPlaysByArtist;
    toReturn.totalPlaysByTrack = totalPlaysByTrack;

    toReturn.deepestGenresByArtist = deepestGenresByArtist;
    toReturn.topGenres = topGenres;
    toReturn.topArtists = topArtists;
    toReturn.topTracks = topTracks;

    toReturn.trackData = trackData;

    console.log(toReturn);  
    return toReturn;  
  }); 
};