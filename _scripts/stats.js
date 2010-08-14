var Stats = {
  config: {
    statsWrapperId: 'stats',
    yearInfoId: 'year-info',
    yearBarMaxPaintedWidth: 16,
    yearBarMaxWidth: 20,
    yearBarHighlichtModulo: 5,
    yearGraphHeight: 270,
    tooltipId: 'tooltip',
    tagcloudId: 'tagcloud',
    listClass: 'list',
    listSmallClass: 'small',
    favoriteNamesMax: 25,
    retrieveAmount: 25,
    retrieveInterfal: 50
  },
  
  
  init: function() {
    // This requires the movies.js file to be loaded.
    if (!Movies || !Movies.trElms) return;
    
    var aElm = document.createElement('a');
      aElm.href = 'javascript:Stats.open()';
      aElm.appendChild(document.createTextNode('Stats'));
      Movies.actionsBoxElm.appendChild(aElm);
  },
  
  
  // When the user clicks the link
  open: function() {
    if (Stats.initialized)
      Movies.setActivePanel(Stats.statsWrapper);
    else {
      Stats.retrieveStats();
      Stats.createHtml();
      Stats.createOverview();
      Stats.createGenreInfo();
      Stats.createFavoriteNames();
      Stats.createYearInfo();
      Stats.retrieveMoreInfo(0);
      Stats.show('Overview');
      Movies.setActivePanel(Stats.statsWrapper);
      Stats.initialized = true;
    }
  },
  
  
  // Create the panel
  createHtml: function() {
    Stats.statsWrapper = document.createElement('div');
      Stats.statsWrapper.id = Stats.config.statsWrapperId;
      addClass(Stats.statsWrapper, 'panel');
      
    var statsMenu = document.createElement('ul');
      statsMenu.id = 'menu';
      addClass(statsMenu, 'header');
      Stats.statsWrapper.appendChild(statsMenu);
      
    Stats.menuOverviewElm = document.createElement('li');
      var statsMenuOverviewLink = document.createElement('a');
      statsMenuOverviewLink.appendChild(document.createTextNode('Overview'));
      statsMenuOverviewLink.href = "javascript:Stats.show('Overview')";
      Stats.menuOverviewElm.appendChild(statsMenuOverviewLink);
      statsMenu.appendChild(Stats.menuOverviewElm);
      
    Stats.menuGenreInfoElm = document.createElement('li');
      var statsMenuGenreInfoLink = document.createElement('a');
      statsMenuGenreInfoLink.appendChild(document.createTextNode('Genre Info'));
      statsMenuGenreInfoLink.href = "javascript:Stats.show('GenreInfo')";
      Stats.menuGenreInfoElm.appendChild(statsMenuGenreInfoLink);
      statsMenu.appendChild(Stats.menuGenreInfoElm);
      
    Stats.menuFavoriteNamesElm = document.createElement('li');
      var statsMenuFavoriteNamesLink = document.createElement('a');
      statsMenuFavoriteNamesLink.appendChild(document.createTextNode('Favorite Names'));
      statsMenuFavoriteNamesLink.href = "javascript:Stats.show('FavoriteNames')";
      Stats.menuFavoriteNamesElm.appendChild(statsMenuFavoriteNamesLink);
      statsMenu.appendChild(Stats.menuFavoriteNamesElm);
      
    Stats.menuYearInfoElm = document.createElement('li');
      var statsMenuYearInfoLink = document.createElement('a');
      statsMenuYearInfoLink.appendChild(document.createTextNode('Year Info'));
      statsMenuYearInfoLink.href = "javascript:Stats.show('YearInfo')";
      Stats.menuYearInfoElm.appendChild(statsMenuYearInfoLink);
      statsMenu.appendChild(Stats.menuYearInfoElm);
      
    Stats.statsArea = document.createElement('div');
      addClass(Stats.statsArea, 'body');
      Stats.statsWrapper.appendChild(Stats.statsArea);
    
    Movies.tableElm.parentNode.insertBefore(Stats.statsWrapper, Movies.tableElm);
  },
  
  
  retrieveStats: function() {
    if (Stats.d) return;
    
    Stats.d = {
      yearInfo: [],
      yearMin: 3000,
      yearMax: 0,
      runtimeMin: 1000,
      runtimeMax: 0,
      ratingMin: 10,
      ratingMax: 0,
      ratingAvg: 0,
      ratingAmounts: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ratingAmountMax: 0,
      runtimeTotal: 0,
      ratingTotal: 0,
      imdb250Seen: 0,
      amountPerYearMax: 0,
      amountOfMovies: Movies.trElms.length,
      genreInfo: [],
      genreAmountMax: 0,
      genreRatingMax: 0,
      genreRatingMin: 10,
      namesInfo: [],
      namesAmountMax: 0,
      namesRatingMax: 0,
      namesRatingMin: 10
    };
    
    
    for (var i = 0; Movies.config.genres[i]; ++i) {
      Stats.d.genreInfo[Movies.config.genres[i]] = [0, 0, 0];
    }
    
    
    for (var i = 0; Movies.trElms[i]; ++i) {
      var tdElms = Movies.trElms[i].getElementsByTagName('td');
      
      var year = parseInt(tdElms[Movies.config.columnOffsetYear].innerHTML, 10);
      var runtime = parseInt(tdElms[Movies.config.columnOffsetRuntime].innerHTML, 10);
      var rating = parseInt(tdElms[Movies.config.columnOffsetRating].innerHTML, 10);
      
      
      // Handle amount of rating
      Stats.d.ratingAmounts[rating]++;
      
      
      // IMDb top 250
      var aElm = tdElms[Movies.config.columnOffsetTitle].getElementsByTagName('a')[0];
      if (aElm && Movies.config.imdbIds.indexOf('|' + aElm.href.substring(28, 35) + '|') != -1)
        Stats.d.imdb250Seen++;
      
      
      // Handle minima and maxima.
      if (year < Stats.d.yearMin) Stats.d.yearMin = year;
      if (year > Stats.d.yearMax) Stats.d.yearMax = year;
      if (runtime < Stats.d.runtimeMin) Stats.d.runtimeMin = runtime;
      if (runtime > Stats.d.runtimeMax) Stats.d.runtimeMax = runtime;
      if (rating < Stats.d.ratingMin) Stats.d.ratingMin = rating;
      if (rating > Stats.d.ratingMax) Stats.d.ratingMax = rating;
      if (Stats.d.ratingAmounts[rating] > Stats.d.ratingAmountMax) Stats.d.ratingAmountMax = Stats.d.ratingAmounts[rating];
      
      
      // Handle averages
      Stats.d.runtimeTotal += runtime;
      Stats.d.ratingTotal += rating;
      
      
      // Year specific information.
      if (Stats.d.yearInfo[year]) {
        Stats.d.yearInfo[year][0]++;
        Stats.d.yearInfo[year][1] += rating;
        Stats.d.yearInfo[year][2] += runtime;
      }
      else
        Stats.d.yearInfo[year] = [1, rating, runtime, 0, 0];
        
      // Remember the maximum amount of movies per year.
      if (Stats.d.yearInfo[year][0] > Stats.d.amountPerYearMax)
        Stats.d.amountPerYearMax = Stats.d.yearInfo[year][0];
    }
    
    Stats.d.runtimeAvg = Math.round(Stats.d.runtimeTotal / Stats.d.amountOfMovies);
    Stats.d.ratingAvg = Math.round(Stats.d.ratingTotal * 10 / Stats.d.amountOfMovies) / 10;
    
    
    // Set the averages of runtime and rating per year in the array.
    for (var i = Stats.d.yearMin; i <= Stats.d.yearMax; i++) {
      if (!Stats.d.yearInfo[i])
        continue;
      
      Stats.d.yearInfo[i][3] = Math.round(Stats.d.yearInfo[i][2] / Stats.d.yearInfo[i][0]);
      Stats.d.yearInfo[i][4] = Math.round(Stats.d.yearInfo[i][1] * 10 / Stats.d.yearInfo[i][0]) / 10;
    }
  },
  
  
  retrieveMoreInfo: function(offset) {
    for (var i = offset; Movies.trElms[i] && i < (offset + Stats.config.retrieveAmount); ++i) {
      var tdElms = Movies.trElms[i].getElementsByTagName('td');
      
      var genres = tdElms[Movies.config.columnOffsetGenre].innerHTML;
      genres = genres.split(', ');
      
      for (var j = 0; genres[j]; ++j) {
        Stats.d.genreInfo[genres[j]][0]++;
        Stats.d.genreInfo[genres[j]][1] += parseInt(tdElms[Movies.config.columnOffsetRating].innerHTML, 10);
      }
      
      var names = tdElms[Movies.config.columnOffsetCrew].innerHTML + ', ' + tdElms[Movies.config.columnOffsetCast].innerHTML;
      names = names.split(', ');
      
      for (var j = 0; names[j]; ++j) {
        if (Stats.d.namesInfo[names[j]] !== undefined) {
          Stats.d.namesInfo[names[j]][0]++;
          Stats.d.namesInfo[names[j]][1] += parseInt(tdElms[Movies.config.columnOffsetRating].innerHTML, 10);
        }
        else {
          Stats.d.namesInfo[names[j]] = [1, parseInt(tdElms[Movies.config.columnOffsetRating].innerHTML, 10), 0];
        }
      }
    }
    
    if ((offset + Stats.config.retrieveAmount) < Movies.trElms.length)
      window.setTimeout('Stats.retrieveMoreInfo(' + (offset + Stats.config.retrieveAmount) + ')', Stats.config.retrieveInterfal);
    else {
      Stats.d.genreInfoSorted = [];
      Stats.d.namesInfoSorted = [];
      var counter = 0;
      
      for (var genre in Stats.d.genreInfo) if (Stats.d.genreInfo.hasOwnProperty(genre)) {
        genreInfo = Stats.d.genreInfo[genre];
        
        if (genreInfo[0] > 0)
          Stats.d.genreInfo[genre][2] = Math.round((genreInfo[1] * 10) / genreInfo[0]) / 10;
        
        if (genreInfo[0] > Stats.d.genreAmountMax)
          Stats.d.genreAmountMax = genreInfo[0];
        
        if (Stats.d.genreInfo[genre][2] > Stats.d.genreRatingMax)
          Stats.d.genreRatingMax = Stats.d.genreInfo[genre][2];
        
        if (genreInfo[0] !== 0 && Stats.d.genreInfo[genre][2] < Stats.d.genreRatingMin)
          Stats.d.genreRatingMin = Stats.d.genreInfo[genre][2];
        
        Stats.d.genreInfoSorted[counter] = [genre, genreInfo[0], genreInfo[1], genreInfo[2]];
        ++counter;
      }
      
      counter = 0;
      
      for (var name in Stats.d.namesInfo) if (Stats.d.namesInfo.hasOwnProperty(name)) {
        namesInfo = Stats.d.namesInfo[name];
        
        if (namesInfo[0] < 3)
          continue;
        
        Stats.d.namesInfo[name][2] = Math.round((namesInfo[1] * 10) / namesInfo[0]) / 10;
        
        if (namesInfo[0] > Stats.d.namesAmountMax)
          Stats.d.namesAmountMax = namesInfo[0];
        
        if (Stats.d.namesInfo[name][2] > Stats.d.namesRatingMax)
          Stats.d.namesRatingMax = Stats.d.namesInfo[name][2];
        
        if (namesInfo[0] !== 0 && Stats.d.namesInfo[name][2] < Stats.d.namesRatingMin)
          Stats.d.namesRatingMin = Stats.d.namesInfo[name][2];
        
        Stats.d.namesInfoSorted[counter] = [name, namesInfo[0], namesInfo[1], namesInfo[2]];
        ++counter;
      }
      
      Stats.continueCreatingGenreInfo();
      Stats.continueCreatingFavoriteNames();
    }
  },
  
  
  show: function(newActive) {
    var menuElm, panelElm;
    
    switch (newActive) {
      default:
        return;
        break;
      case 'Overview':
        menuElm = Stats.menuOverviewElm;
        panelElm = Stats.panelOverviewElm;
        break;
        
      case 'GenreInfo':
        menuElm = Stats.menuGenreInfoElm;
        panelElm = Stats.panelGenreInfoElm;
        break;
        
      case 'FavoriteNames':
        menuElm = Stats.menuFavoriteNamesElm;
        panelElm = Stats.panelFavoriteNamesElm;
        break;
        
      case 'YearInfo':
        menuElm = Stats.menuYearInfoElm;
        panelElm = Stats.panelYearInfoElm;
        break;
    }
    
    // Change the menu item
    if (Stats.activeMenuElm)
      removeClass(Stats.activeMenuElm, 'active');
      
    if (Stats.activePanelElm)
      removeClass(Stats.activePanelElm, 'active');
    
    Stats.activeMenuElm = menuElm;
    addClass(menuElm, 'active');
    Stats.activePanelElm = panelElm;
    addClass(panelElm, 'active');
  },
  
  
  createOverview: function() {
    Stats.panelOverviewElm = document.createElement('div');
    Stats.panelOverviewElm.id = 'panel-overview';
    Stats.statsArea.appendChild(Stats.panelOverviewElm);
    
    var div1 = document.createElement('div');
      Stats.panelOverviewElm.appendChild(div1);
      
      var fieldset1a = document.createElement('fieldset');
        div1.appendChild(fieldset1a);
        
        var legend1a = document.createElement('legend');
          legend1a.appendChild(document.createTextNode('General'));
          fieldset1a.appendChild(legend1a);
        
        var p1a = document.createElement('p');
          fieldset1a.appendChild(p1a);
          
          p1a.appendChild(document.createTextNode('There are '));
          
          var strong1a = document.createElement('strong');
            strong1a.appendChild(document.createTextNode(Stats.d.amountOfMovies));
            p1a.appendChild(strong1a);
          
          p1a.appendChild(document.createTextNode(' movies on this list. The average movie has a rating of '));
          
          var strong1b = document.createElement('strong');
            strong1b.appendChild(document.createTextNode(Stats.d.ratingAvg));
            p1a.appendChild(strong1b);
          
          p1a.appendChild(document.createTextNode(' and runs for '));
          
          var strong1c = document.createElement('strong');
            strong1c.appendChild(document.createTextNode(Stats.d.runtimeAvg));
            p1a.appendChild(strong1c);
          
          p1a.appendChild(document.createTextNode(' minutes. There are '));
          
          var metaElms = document.getElementsByTagName('meta');
          var amountOfNames = 0;
          
          for (var i = 0; metaElms[i]; ++i) {
            if (metaElms[i].name == 'amount-of-names') {
              amountOfNames = parseInt(metaElms[i].getAttribute('content'), 10);
              break;
            }
          }
          
          var strong1d = document.createElement('strong');
            strong1d.appendChild(document.createTextNode(amountOfNames));
            p1a.appendChild(strong1d);
          
          p1a.appendChild(document.createTextNode(' different names on this list.'));
      
      var fieldset1b = document.createElement('fieldset');
        div1.appendChild(fieldset1b);
        
        var legend1b = document.createElement('legend');
          legend1b.appendChild(document.createTextNode('IMDb Top 250'));
          fieldset1b.appendChild(legend1b);
        
        var p1b = document.createElement('p');
          fieldset1b.appendChild(p1b);
          
          p1b.appendChild(document.createTextNode('I\'ve seen '));
          
          var strong1e = document.createElement('strong');
            strong1e.appendChild(document.createTextNode(Stats.d.imdb250Seen));
            p1b.appendChild(strong1e);
          
          p1b.appendChild(document.createTextNode(' of the 250 movies. '));
          
        var a1 = document.createElement('a');
          a1.href = './update-imdb-top-250.php';
          addClass(a1, 'refresh');
          a1.title = 'Fetch top 250 from IMDb';
          a1.appendChild(document.createTextNode('refresh'));
          
        p1b.appendChild(a1);
        
        var progressbar = document.createElement('div');
          addClass(progressbar, 'progressbar');
          fieldset1b.appendChild(progressbar);
          
          var progressbarInner = document.createElement('div');
          progressbarInner.style.width = Math.round(Stats.d.imdb250Seen / 2.5) + '%';
          progressbar.appendChild(progressbarInner);
          
    
    var div2 = document.createElement('div');
      Stats.panelOverviewElm.appendChild(div2);
      addClass(div2, Stats.config.listClass);
      
      var fieldset2a = document.createElement('fieldset');
        div2.appendChild(fieldset2a);
        
        var legend2a = document.createElement('legend');
          legend2a.appendChild(document.createTextNode('Ratings distribution'));
          fieldset2a.appendChild(legend2a);
      
        var ul2a = document.createElement('ul');
          fieldset2a.appendChild(ul2a);
        
          for (var i = 1; i < 11; ++i) {
            var listItemElm = document.createElement('li');
      
              var listDiv1Elm = document.createElement('div');
              addClass(listDiv1Elm, Stats.config.listSmallClass);
              listDiv1Elm.appendChild(document.createTextNode(i));
              listItemElm.appendChild(listDiv1Elm);
      
              var listDiv2Elm = document.createElement('div');
              listDiv2Elm.appendChild(document.createTextNode(Stats.d.ratingAmounts[i]));
              addClass(listDiv2Elm, 'bar');
              listDiv2Elm.style.width = Math.round((90 * Stats.d.ratingAmounts[i]) / Stats.d.ratingAmountMax) + '%';
              listItemElm.appendChild(listDiv2Elm);
      
            ul2a.appendChild(listItemElm);
          }
  },
  
  
  createGenreInfo: function() {
    Stats.panelGenreInfoElm = document.createElement('div');
    Stats.panelGenreInfoElm.id = 'panel-genre-info';
    Stats.statsArea.appendChild(Stats.panelGenreInfoElm);
    
    Stats.oneMoment1Elm = document.createElement('p');
      Stats.oneMoment1Elm.appendChild(document.createTextNode('One moment…'));
      addClass(Stats.oneMoment1Elm, 'wait');
      Stats.panelGenreInfoElm.appendChild(Stats.oneMoment1Elm);
  },
  
  
  continueCreatingGenreInfo: function() {
    Stats.panelGenreInfoElm.removeChild(Stats.oneMoment1Elm);
    
    var pElm = document.createElement('p');
      addClass(pElm, 'amountorrating');
      
      var label1Elm = document.createElement('label');
      
        Stats.inputGenreAmountElm = document.createElement('input');
          Stats.inputGenreAmountElm.type = 'radio';
          Stats.inputGenreAmountElm.name = 'amountorrating';
          Stats.inputGenreAmountElm.checked = true;
          addEvent(Stats.inputGenreAmountElm, 'change', Stats.changeGenreInfo);
          addEvent(Stats.inputGenreAmountElm, 'click', Stats.changeGenreInfo);
          label1Elm.appendChild(Stats.inputGenreAmountElm);
          
        label1Elm.appendChild(document.createTextNode(' by amount '));
      pElm.appendChild(label1Elm);
      
      var label2Elm = document.createElement('label');
      
        Stats.inputGenreRatingElm = document.createElement('input');
          Stats.inputGenreRatingElm.type = 'radio';
          Stats.inputGenreRatingElm.name = 'amountorrating';
          addEvent(Stats.inputGenreRatingElm, 'change', Stats.changeGenreInfo);
          addEvent(Stats.inputGenreRatingElm, 'click', Stats.changeGenreInfo);
          label2Elm.appendChild(Stats.inputGenreRatingElm);
          
        label2Elm.appendChild(document.createTextNode(' by rating'));
      pElm.appendChild(label2Elm);
    
    Stats.panelGenreInfoElm.appendChild(pElm);
    
    Stats.cloudElm = document.createElement('div');
      Stats.cloudElm.id = Stats.config.tagcloudId;
      Stats.panelGenreInfoElm.appendChild(Stats.cloudElm);
    
    Stats.listWrapperElm = document.createElement('div');
      addClass(Stats.listWrapperElm, Stats.config.listClass);
      Stats.panelGenreInfoElm.appendChild(Stats.listWrapperElm);
      
      Stats.listOlElm = document.createElement('ol');
      Stats.listWrapperElm.appendChild(Stats.listOlElm);
    
    Stats.changeGenreInfo();
  },
  
  
  changeGenreInfo: function() {
    var sortColumn = Stats.inputGenreAmountElm.checked ? 1 : 3;
    var max = Stats.inputGenreAmountElm.checked ? Stats.d.genreAmountMax : Stats.d.genreRatingMax;
    var min = Stats.inputGenreAmountElm.checked ? 0 : Stats.d.genreRatingMin;

    Stats.d.genreInfoSorted.sort(function(a, b) {
      if (a[sortColumn] == b[sortColumn]) return 0;
      if (a[sortColumn] < b[sortColumn]) return -1;
      return 1;
    });
    
    Stats.cloudElm.innerHTML = '';
    Stats.listOlElm.innerHTML = '';
    
    // Create the tag cloud
    for (var genre in Stats.d.genreInfo) if (Stats.d.genreInfo.hasOwnProperty(genre)) {
      var genreInfo = Stats.d.genreInfo[genre];
      
      if (genreInfo[0] !== 0) {
        var weight = Math.round((7 * (genreInfo[sortColumn - 1] - min)) / (max - min)) + 1;
        
        var spanElm = document.createElement('span');
          spanElm.appendChild(document.createTextNode(genre));
          addClass(spanElm, 'tag-' + weight);
        
        Stats.cloudElm.appendChild(spanElm);
        Stats.cloudElm.appendChild(document.createTextNode(' '));
      }
    }
    
    // Create the list
    for (var i = Stats.d.genreInfoSorted.length - 1; Stats.d.genreInfoSorted[i]; --i) {
      var genreInfo = Stats.d.genreInfoSorted[i];
      
      if (genreInfo[1] !== 0) {
        var listItemElm = document.createElement('li');
      
          var listDiv1Elm = document.createElement('div');
          listDiv1Elm.appendChild(document.createTextNode(genreInfo[0]));
          listItemElm.appendChild(listDiv1Elm);
      
          var listDiv2Elm = document.createElement('div');
          listDiv2Elm.appendChild(document.createTextNode(genreInfo[sortColumn]));
          addClass(listDiv2Elm, 'bar');
          listDiv2Elm.style.width = Math.round((75 * genreInfo[sortColumn]) / max) + '%';
          listItemElm.appendChild(listDiv2Elm);
      
        Stats.listOlElm.appendChild(listItemElm);
      }
    }
  },
  
  
  createFavoriteNames: function() {
    Stats.panelFavoriteNamesElm = document.createElement('div');
    Stats.panelFavoriteNamesElm.id = 'panel-favorite-names';
    Stats.statsArea.appendChild(Stats.panelFavoriteNamesElm);
    
    Stats.oneMoment2Elm = document.createElement('p');
      Stats.oneMoment2Elm.appendChild(document.createTextNode('One moment…'));
      addClass(Stats.oneMoment2Elm, 'wait');
      Stats.panelFavoriteNamesElm.appendChild(Stats.oneMoment2Elm);
  },
  
  
  continueCreatingFavoriteNames: function() {
    Stats.oneMoment2Elm.parentNode.removeChild(Stats.oneMoment2Elm);
    
    if (Stats.d.namesInfoSorted.length > 0) {
      var div1Elm = document.createElement('div');
        addClass(div1Elm, Stats.config.listClass);
        Stats.panelFavoriteNamesElm.appendChild(div1Elm);
      
        var h31Elm = document.createElement('h3');
          h31Elm.appendChild(document.createTextNode('By amount'));
          div1Elm.appendChild(h31Elm);
        
        var ol1Elm = document.createElement('ol');
          div1Elm.appendChild(ol1Elm);
        
          Stats.d.namesInfoSorted.sort(function(a, b) {
            if (a[1] == b[1]) return 0;
            if (a[1] < b[1]) return 1;
            return -1;
          });
        
          var max = Stats.d.namesAmountMax;
        
          for (var i = 0; Stats.d.namesInfoSorted[i] && i < Stats.config.favoriteNamesMax; ++i) {
            namesInfo = Stats.d.namesInfoSorted[i];
          
            var listItemElm = document.createElement('li');
      
              var listDiv1Elm = document.createElement('div');
              listDiv1Elm.appendChild(document.createTextNode(namesInfo[0]));
              listItemElm.appendChild(listDiv1Elm);
      
              var listDiv2Elm = document.createElement('div');
              listDiv2Elm.appendChild(document.createTextNode(namesInfo[1]));
              addClass(listDiv2Elm, 'bar');
              listDiv2Elm.style.width = Math.round((75 * namesInfo[1]) / max) + '%';
              listItemElm.appendChild(listDiv2Elm);
      
            ol1Elm.appendChild(listItemElm);
          }
    
      var div2Elm = document.createElement('div');
        addClass(div2Elm, Stats.config.listClass);
        Stats.panelFavoriteNamesElm.appendChild(div2Elm);
      
        var h32Elm = document.createElement('h3');
          h32Elm.appendChild(document.createTextNode('By rating'));
          div2Elm.appendChild(h32Elm);
        
        var ol2Elm = document.createElement('ol');
          div2Elm.appendChild(ol2Elm);
        
          Stats.d.namesInfoSorted.sort(function(a, b) {
            if (a[3] == b[3]) return 0;
            if (a[3] < b[3]) return 1;
            return -1;
          });
        
          var max = Stats.d.namesRatingMax;
        
          for (var i = 0; Stats.d.namesInfoSorted[i] && i < Stats.config.favoriteNamesMax; ++i) {
            namesInfo = Stats.d.namesInfoSorted[i];
          
            var listItemElm = document.createElement('li');
      
              var listDiv1Elm = document.createElement('div');
              listDiv1Elm.appendChild(document.createTextNode(namesInfo[0]));
              listItemElm.appendChild(listDiv1Elm);
      
              var listDiv2Elm = document.createElement('div');
              listDiv2Elm.appendChild(document.createTextNode(namesInfo[3]));
              addClass(listDiv2Elm, 'bar');
              listDiv2Elm.style.width = Math.round((75 * namesInfo[3]) / max) + '%';
              listItemElm.appendChild(listDiv2Elm);
      
            ol2Elm.appendChild(listItemElm);
          }
    }
    else {
      var pElm = document.createElement('p');
        addClass(pElm, 'message');
        pElm.appendChild(document.createTextNode('No favorite names to show. Only names that appear three or more times are listed.'));
        Stats.panelFavoriteNamesElm.appendChild(pElm);
    }
  },
  
  
  createYearInfo: function() {
    Stats.canvasElm = document.createElement('div');
    Stats.canvasElm.id = Stats.config.yearInfoId;
    
    var yearDiff = Stats.d.yearMax - Stats.d.yearMin + 1;
    
    var canvasWidth;
    
    if ((Stats.config.yearBarMaxWidth * yearDiff) < Stats.statsArea.offsetWidth)
      canvasWidth = (Stats.config.yearBarMaxWidth * yearDiff);
    else {
      canvasWidth = Math.floor(Stats.statsArea.offsetWidth / yearDiff) * yearDiff;
      Stats.config.yearBarMaxPaintedWidth =  Math.round(Stats.config.yearBarMaxPaintedWidth * ((canvasWidth / yearDiff) / Stats.config.yearBarMaxWidth));
      Stats.config.yearBarMaxWidth = canvasWidth / yearDiff;
    }
    
    Stats.config.yearBarMargin = Math.ceil((Stats.config.yearBarMaxWidth - Stats.config.yearBarMaxPaintedWidth) / 2);
    
    Stats.canvasElm.style.width = canvasWidth + 'px';
    Stats.canvasElm.style.height = Stats.config.yearGraphHeight + 'px';
    
    var offset = -Stats.config.yearBarMaxWidth;
    var runtimeCoors = [];
    var ratingCoors = [];
    var count = 0;
    
    for (var i = Stats.d.yearMin; i <= Stats.d.yearMax; i++) {
      var barElm = document.createElement('div');
      
      offset += Stats.config.yearBarMaxWidth;
      
      if (!Stats.d.yearInfo[i])
        continue;
      
      width = Stats.config.yearBarMaxPaintedWidth;
      height = Math.round((Stats.d.yearInfo[i][0] / Stats.d.amountPerYearMax) * Stats.config.yearGraphHeight);
      x1 = offset + Stats.config.yearBarMargin;
            
      addClass(barElm, (i % Stats.config.yearBarHighlichtModulo === 0) ? 'bar-highlight' : 'bar');
      barElm.style.width = width + 'px';
      barElm.style.height = height + 'px';
      barElm.style.left = x1 + 'px';
      
      Stats.canvasElm.appendChild(barElm);
      
      count++;
    }
    
    Stats.canvasElm.onmouseover = Stats.fixTooltipPosition;
    Stats.canvasElm.onmousemove = Stats.viewTooltip;
    
    Stats.panelYearInfoElm = document.createElement('div');
      Stats.panelYearInfoElm.id = 'panel-year-info';
      Stats.panelYearInfoElm.appendChild(Stats.canvasElm);
    
    Stats.tooltipElm = document.createElement('div');
      Stats.tooltipElm.id = Stats.config.tooltipId;
      Stats.tooltipElm.innerHTML = 'Hover to see more info.';
      Stats.panelYearInfoElm.appendChild(Stats.tooltipElm);
    
    Stats.statsArea.appendChild(Stats.panelYearInfoElm);
  },
  
  
  viewTooltip: function(e) {
    var posx = 0;
    if (!e) var e = window.event;
    if (e.pageX)
      posx = e.pageX;
    else if (e.clientX)
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    
    var year = Math.floor((posx - Stats.canvasLeftOffset) / Stats.config.yearBarMaxWidth) + Stats.d.yearMin;
    var text = "<strong>" + year + "</strong><br>" + ((Stats.d.yearInfo[year]) ? "Movies: " + Stats.d.yearInfo[year][0] + "<br>Average rating: " + Stats.d.yearInfo[year][4] : "No movies");
    Stats.tooltipElm.innerHTML = text;
    
    if (posx > 200)
      posx -= 150;
      
    Stats.tooltipElm.style.left = posx + "px";
  },
  
  
  fixTooltipPosition: function() {
    var left = 0;
    var top = 0;
    var obj = Stats.canvasElm;
  
    if (obj.offsetParent) {
      do {
        left += obj.offsetLeft;
        top += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    
    Stats.canvasLeftOffset = left;
    
    Stats.tooltipElm.style.top = (top + 100) + "px";
  }
};

DOMReady(Stats.init);