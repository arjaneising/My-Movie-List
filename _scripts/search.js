var Search = {
  config: {
    defaultTerm: 'Name of an actor, actress, movie or director…',
    advancedBoxId: 'advanced-search'
  },
  
  
  init: function() {
    // This requires the movies.js file to be loaded.
    if (!Movies || !Movies.trElms) return;
    
    Search.createHtml();
    Search.checkUrlForSearch();
  },
  
  
  // Creates the link for advanced HTML, and a searchbox at the top.
  createHtml: function() {
    Search.inputElm = document.createElement('input');
      Search.inputElm.value = Search.config.defaultTerm;
      Search.inputElm.defaultValue = Search.config.defaultTerm;
      addEvent(Search.inputElm, 'change', Search.doSimpleSearch);
      addEvent(Search.inputElm, 'keyup', Search.doSimpleSearch);
      addEvent(Search.inputElm, 'focus', Search.niceFocus);
      addEvent(Search.inputElm, 'blur', Search.niceBlur);
      Movies.actionsBoxElm.insertBefore(Search.inputElm, Movies.actionsBoxElm.getElementsByTagName('a')[0]);
    
    var aElm = document.createElement('a');
      aElm.href = 'javascript:Search.initAdvanced()';
      aElm.appendChild(document.createTextNode('Advanced search'));
      Movies.actionsBoxElm.appendChild(aElm);
  },
  
  
  // Creates the advanced search panel.
  initAdvanced: function() {
    if (!Stats || !Movies) return;
    
    if (Search.isAdvanced)
      Movies.setActivePanel(Search.advancedSearchElm);
    else {
      if (!Stats.d)
        Stats.retrieveStats();
  
      Search.isAdvanced = true;
      Search.createAdvancedHtml();
      Search.advancedInputElm.value = Search.inputElm.value;
      Search.doSearch();
      Movies.setActivePanel(Search.advancedSearchElm);
    }
  },
  
  
  // Reset all values to the default ones.
  resetAdvanced: function() {
    Search.advancedInputElm.value = Search.advancedInputElm.getAttribute('value');
    Search.inputNonEnglishOnly.checked = false;
    Search.inputImdb250Only.checked = false;
    Search.inputYearMin.value = Stats.d.yearMin;
    Search.inputYearMax.value = Stats.d.yearMax;
    Search.inputRuntimeMin.value = Stats.d.runtimeMin;
    Search.inputRuntimeMax.value = Stats.d.runtimeMax;
    Search.inputRatingMin.value = Stats.d.ratingMin;
    Search.inputRatingMax.value = Stats.d.ratingMax;
    
    for (var i = 0; Search.inputGenres[i]; ++i)
      Search.inputGenres[i].checked = true;
      
    Slider.setValues('year-slider', Stats.d.yearMin, Stats.d.yearMax);
    Slider.setValues('runtime-slider', Stats.d.runtimeMin, Stats.d.runtimeMax);
    Slider.setValues('rating-slider', Stats.d.ratingMin, Stats.d.ratingMax);
    
    Search.inputOneGenre.checked = true;
    
    Search.doSearch();
  },
  
  
  // If the URL contains q=SEARCHTERM, it will automatically search for SEARCHTERM
  checkUrlForSearch: function() {
    var searched = location.search.match('(?:\\?|\&)q=([^\&]*)');
    if (searched) {
      var term = unescape(searched[1].replace(/\+/g, ' '));
      Search.inputElm.value = term;
      Search.doSearch();
    }
  },
  
  
  niceFocus: function() {
    if (this.value == this.defaultValue)
      this.value = '';
  },
  
  
  niceBlur: function() {
    if (this.value.length === 0)
      this.value = this.defaultValue;
  },
  
  
  // For the inputboxes: if the value is too low or high or inpossible; it will automatically fix it.
  niceChange: function(type, minmax) {
    var minElm = Search['input' + type + 'Min'];
    var maxElm = Search['input' + type + 'Max'];
    
    if (!minElm || !maxElm) return;
    
    minValueNow = parseInt('0' + minElm.value, 10);
    minValueOrigional = parseInt(minElm.defaultValue, 10);
    maxValueNow = parseInt('0' + maxElm.value, 10);
    maxValueOrigional = parseInt(maxElm.defaultValue, 10);
    
    if (minmax == 'min') {
      if (minValueNow < minValueOrigional || minValueNow > maxValueNow)
        minElm.value = minValueOrigional;
      else
        minElm.value = minValueNow;
    }
    else {
      if (maxValueNow > maxValueOrigional || maxValueNow < minValueNow)
        maxElm.value = maxValueOrigional;
      else
        maxElm.value = maxValueNow;
    }
    
    var id = type.toLowerCase() + '-slider';
    
    Slider.setValues(id, parseInt('0' + minElm.value, 10), parseInt('0' + maxElm.value, 10));
    
    Search.doSearch();
  },
  
  
  // Update the textboxes if the slider moves.
  sliderCallback: function(props) {
    var type = props.sliderId.charAt(0).toUpperCase() + props.sliderId.substring(1, props.sliderId.indexOf('-'));
    
    var minElm = Search['input' + type + 'Min'];
    var maxElm = Search['input' + type + 'Max'];
    
    minElm.value = props.handle1Value;
    maxElm.value = props.handle2Value;
    
    Search.doSearch();
  },
  
  
  // Check or uncheck the genreboxes.
  checkUncheckAllGenres: function() {
    for (var i = 0; Search.inputGenres[i]; ++i) {
      Search.inputGenres[i].checked = !Search.allGenresChecked ? '' : 'checked';
    }
    
    Search.allGenresChecked = Search.allGenresChecked ? false : true;
    
    Search.doSearch();
  },
  
  
  doSimpleSearch: function() {
    if (Search.isAdvanced)
      Search.advancedInputElm.value = Search.inputElm.value;
    Search.doSearch();
  },
  
  
  // Go searching
  doSearch: function() {
    var isSearch = Search.isAdvanced || (Search.inputElm.value.length > 1 && Search.inputElm.value != Search.config.defaultTerm);
    
    var term = (Search.isAdvanced ? Search.advancedInputElm : Search.inputElm).value.toLowerCase();
    var terms = term.split(" ");
    
    var trElms = Movies.trElms;
    var counter = 0;
    
    var genresToFind = [];
    var genresCounter = 0;
    
    if (Search.inputGenres) {
      for (var i = 0; Search.inputGenres[i]; ++i) {
        if (Search.inputGenres[i].checked) {
          genresToFind[genresCounter] = Movies.config.genres[i];
          ++genresCounter;
        }
      }
    }
    
    for (var i = 0; trElms[i]; ++i) {
      display = isSearch ? Search.isMatch(trElms[i], terms, genresToFind) : true;
      
      if (display) {
        removeClass(trElms[i], 'hide');
        ++counter;
      }
      else
        addClass(trElms[i], 'hide');
    }
    
    if (Search.isAdvanced) {
      Search.amountOfRowsElm.innerHTML = counter;
      Search.inputElm.value = Search.advancedInputElm.value;
    } 
    
    // Make sure our zebra stripes are OK.
    Movies.applyOddEven();
  },
  
  
  isMatch: function(trElm, terms, genres) {
    if (Search.isAdvanced) {
      
      if (Search.inputNonEnglishOnly.checked) {
        if (trElm.getElementsByTagName('span').length === 0)
          return false;
      }
      
      if (Search.inputImdb250Only.checked) {
        aElm = trElm.getElementsByTagName('a')[0];
        if (!aElm || Movies.config.imdbIds.indexOf('|' + aElm.href.substring(28, 35) + '|') == -1)
          return false;
      }
      
      tdElms = trElm.getElementsByTagName('td');
      
      if (parseInt(Search.inputYearMin.value, 10) > parseInt(tdElms[Movies.config.columnOffsetYear].innerHTML, 10))
        return false;
      
      if (parseInt(Search.inputYearMax.value, 10) < parseInt(tdElms[Movies.config.columnOffsetYear].innerHTML, 10))
        return false;
      
      if (parseInt(Search.inputRuntimeMin.value, 10) > parseInt(tdElms[Movies.config.columnOffsetRuntime].innerHTML, 10))
        return false;
      
      if (parseInt(Search.inputRuntimeMax.value, 10) < parseInt(tdElms[Movies.config.columnOffsetRuntime].innerHTML, 10))
        return false;
      
      if (parseInt(Search.inputRatingMin.value, 10) > parseInt(tdElms[Movies.config.columnOffsetRating].innerHTML, 10))
        return false;
      
      if (parseInt(Search.inputRatingMax.value, 10) < parseInt(tdElms[Movies.config.columnOffsetRating].innerHTML, 10))
        return false;
        
      var genreInner = tdElms[Movies.config.columnOffsetGenre].innerHTML + ',';

      if (genres.length !== 0) {
        if (Search.inputOneGenre.checked) {
          display = false;
        
          for (var k = 0; genres[k]; ++k) {
            if (genreInner.indexOf(genres[k] + ',') > -1) {
              display = true;
              break;
            }
          }
        
          if (!display)
            return false;
        }
        else {
          for (var k = 0; genres[k]; ++k) {
            if (genreInner.indexOf(genres[k] + ',') == -1) {
              return false;
            }
          }
        }
      }
      else
        return false;
      
      
      if (Search.advancedInputElm.value == Search.config.defaultTerm)
        return true;
    }
    
    innerHtml = (trElm.innerText ? trElm.innerText : trElm.textContent).toLowerCase();
    
    display = true;
    
    // Look up every term. Every term needs to be inside the row.
    for (var j = 0; terms[j] && display; ++j) {
      display = false;
      if (innerHtml.indexOf(terms[j]) > -1) display = true;
    }
    
    return display;
  },
  
  
  createAdvancedHtml: function() {
    Search.advancedSearchElm = document.createElement('div');
    Search.advancedSearchElm.id = Search.config.advancedBoxId;
    Search.advancedSearchElm.className = 'panel';
    Movies.tableElm.parentNode.insertBefore(Search.advancedSearchElm, Movies.tableElm);
  
    var headerElm = document.createElement('div');
      headerElm.className = 'header';
      Search.advancedSearchElm.appendChild(headerElm);

      var h2Elm = document.createElement('h2');
        headerElm.appendChild(h2Elm);
        h2Elm.appendChild(document.createTextNode('Advanced search'));
      
      var p1 = document.createElement('p');
        headerElm.appendChild(p1);
      
        Search.amountOfRowsElm = document.createElement('span');
          Search.amountOfRowsElm.appendChild(document.createTextNode('200'));
          p1.appendChild(Search.amountOfRowsElm);
      
        p1.appendChild(document.createTextNode(' movies selected. '));

        var a1 = document.createElement('a');
          a1.href = 'javascript:Search.resetAdvanced()';
          a1.appendChild(document.createTextNode('Reset…'));
          p1.appendChild(a1);

    var bodyElm = document.createElement('div');
      bodyElm.className = 'body';
      Search.advancedSearchElm.appendChild(bodyElm);

      var div1 = document.createElement('div');
        bodyElm.appendChild(div1);
      
        var fieldset1 = document.createElement('fieldset');
          div1.appendChild(fieldset1);
        
          var legend1 = document.createElement('legend');
            fieldset1.appendChild(legend1);
            legend1.appendChild(document.createTextNode('General'));
          
          var p2 = document.createElement('p');
            p2.className = 'query';
            fieldset1.appendChild(p2);
          
            var label1 = document.createElement('label');
              label1.appendChild(document.createTextNode('Query'));
              p2.appendChild(label1);
            
            Search.advancedInputElm = document.createElement('input');
              Search.advancedInputElm.type = 'text';
              Search.advancedInputElm.value = Search.config.defaultTerm;
              Search.advancedInputElm.defaultValue = Search.config.defaultTerm;
              addEvent(Search.advancedInputElm, 'keyup', Search.doSearch);
              addEvent(Search.advancedInputElm, 'change', Search.doSearch);
              addEvent(Search.advancedInputElm, 'blur', Search.niceBlur);
              addEvent(Search.advancedInputElm, 'focus', Search.niceFocus);
              p2.appendChild(Search.advancedInputElm);
            
          var p3 = document.createElement('p');
            fieldset1.appendChild(p3);
          
            var label2 = document.createElement('label');
              label2.htmlFor = 'non-english-only';
              p3.appendChild(label2);
            
              Search.inputNonEnglishOnly = document.createElement('input');
                Search.inputNonEnglishOnly.type = 'checkbox';
                Search.inputNonEnglishOnly.id ='non-english-only';
                addEvent(Search.inputNonEnglishOnly, 'click', Search.doSearch);
                addEvent(Search.inputNonEnglishOnly, 'change', Search.doSearch);
                addEvent(Search.inputNonEnglishOnly, 'blur', Search.doSearch);
                addEvent(Search.inputNonEnglishOnly, 'focus', Search.doSearch);
                label2.appendChild(Search.inputNonEnglishOnly);

              label2.appendChild(document.createTextNode(' Show only non-English movies'));

          var p4 = document.createElement('p');
            fieldset1.appendChild(p4);
          
            var label3 = document.createElement('label');
              label3.htmlFor = 'imdb-top-250-only';
              p4.appendChild(label3);
            
              Search.inputImdb250Only = document.createElement('input');
                Search.inputImdb250Only.type = 'checkbox';
                Search.inputImdb250Only.id = 'imdb-top-250-only';
                addEvent(Search.inputImdb250Only, 'click', Search.doSearch);
                addEvent(Search.inputImdb250Only, 'change', Search.doSearch);
                addEvent(Search.inputImdb250Only, 'blur', Search.doSearch);
                addEvent(Search.inputImdb250Only, 'focus', Search.doSearch);
                label3.appendChild(Search.inputImdb250Only);
            
              label3.appendChild(document.createTextNode(' Show only IMDb top 250 movies'));
          
        var fieldset2 = document.createElement('fieldset');
          div1.appendChild(fieldset2);
        
          var legend2 = document.createElement('legend');
            fieldset2.appendChild(legend2);
            legend2.appendChild(document.createTextNode('Genres'));
            
          var p5 = document.createElement('p');
            fieldset2.appendChild(p5);
            
            Search.inputGenres = [];
            
            for (var i = 0; Movies.config.genres[i]; ++i) {
              var labelElm = document.createElement('label');
              
              Search.inputGenres[i] = document.createElement('input');
                Search.inputGenres[i].type = 'checkbox';
                addEvent(Search.inputGenres[i], 'click', Search.doSearch);
                addEvent(Search.inputGenres[i], 'change', Search.doSearch);
                addEvent(Search.inputGenres[i], 'blur', Search.doSearch);
                addEvent(Search.inputGenres[i], 'focus', Search.doSearch);
                labelElm.appendChild(Search.inputGenres[i]);
              
              labelElm.appendChild(document.createTextNode(' ' + Movies.config.genres[i] + ' '));
              
              p5.appendChild(labelElm);
              
              Search.inputGenres[i].checked = true;
            }
          
          var p6 = document.createElement('p');
            fieldset2.appendChild(p6);
            
            var label4 = document.createElement('label');
              label4.htmlFor = 'genre-type-one';
              p6.appendChild(label4);
            
              Search.inputOneGenre = document.createElement('input');
              Search.inputOneGenre.name = 'genre-type';
              Search.inputOneGenre.id = 'genre-type-one';
              Search.inputOneGenre.type = 'radio';
              Search.inputOneGenre.value = 'one';
              Search.inputOneGenre.checked = true;
              addEvent(Search.inputOneGenre, 'click', Search.doSearch);
              addEvent(Search.inputOneGenre, 'change', Search.doSearch);
              addEvent(Search.inputOneGenre, 'blur', Search.doSearch);
              addEvent(Search.inputOneGenre, 'focus', Search.doSearch);
              label4.appendChild(Search.inputOneGenre);
              
              label4.appendChild(document.createTextNode(' one genre '));
            
            var label5 = document.createElement('label');
              label5.htmlFor = 'genre-type-all';
              p6.appendChild(label5);
            
              Search.inputAllGenre = document.createElement('input');
              Search.inputAllGenre.name = 'genre-type';
              Search.inputAllGenre.id = 'genre-type-all';
              Search.inputAllGenre.type = 'radio';
              Search.inputAllGenre.value = 'all';
              addEvent(Search.inputAllGenre, 'click', Search.doSearch);
              addEvent(Search.inputAllGenre, 'change', Search.doSearch);
              addEvent(Search.inputAllGenre, 'blur', Search.doSearch);
              addEvent(Search.inputAllGenre, 'focus', Search.doSearch);
              label5.appendChild(Search.inputAllGenre);
              
              label5.appendChild(document.createTextNode(' all genres '));
              
            var checkAllA = document.createElement('a');
              checkAllA.href = 'javascript:Search.checkUncheckAllGenres()';
              checkAllA.appendChild(document.createTextNode('Check/uncheck all'));
              p6.appendChild(checkAllA);

      var div2 = document.createElement('div');
        addClass(div2, 'sliders');
        bodyElm.appendChild(div2);
        
        var fieldset3 = document.createElement('fieldset');
        div2.appendChild(fieldset3);

          var legend3 = document.createElement('legend');
            legend3.appendChild(document.createTextNode('Year'));
            fieldset3.appendChild(legend3);

          var p7 = document.createElement('p');
            fieldset3.appendChild(p7);

            Search.inputYearMin = document.createElement('input');
              Search.inputYearMin.type = 'text';
              Search.inputYearMin.defaultValue = Stats.d.yearMin;
              Search.inputYearMin.value = Stats.d.yearMin;
              addEvent(Search.inputYearMin, 'change', function(){ Search.niceChange('Year', 'min') });
              addEvent(Search.inputYearMin, 'blur', Search.niceBlur);
              p7.appendChild(Search.inputYearMin);
              
              Search.sliderYear = document.createElement('div');
                Search.sliderYear.id = 'year-slider';
                addClass(Search.sliderYear, 'slider');
                p7.appendChild(Search.sliderYear);
                
                Search.sliderYearHandle1 = document.createElement('div');
                  Search.sliderYearHandle1.id = 'year-slider-handle-1';
                  addClass(Search.sliderYearHandle1, 'handle');
                  Search.sliderYear.appendChild(Search.sliderYearHandle1);
                
                Search.sliderYearFiller = document.createElement('div');
                  Search.sliderYearFiller.id = 'year-slider-filler';
                  addClass(Search.sliderYearFiller, 'filler');
                  Search.sliderYear.appendChild(Search.sliderYearFiller);
                
                Search.sliderYearHandle2 = document.createElement('div');
                  Search.sliderYearHandle2.id = 'year-slider-handle-2';
                  addClass(Search.sliderYearHandle2, 'handle');
                  Search.sliderYear.appendChild(Search.sliderYearHandle2);
              
              Slider.create({
                sliderId: 'year-slider',
                handle1Id: 'year-slider-handle-1',
                handle2Id: 'year-slider-handle-2',
                fillerId: 'year-slider-filler',
                callback: Search.sliderCallback,
                minValue: Stats.d.yearMin,
                maxValue: Stats.d.yearMax,
                handle1Value: Stats.d.yearMin,
                handle2Value: Stats.d.yearMax,
                borderPlusPadding: 2
              });
            
            Search.inputYearMax = document.createElement('input');
              Search.inputYearMax.type = 'text';
              Search.inputYearMax.defaultValue = Stats.d.yearMax;
              Search.inputYearMax.value = Stats.d.yearMax;
              addEvent(Search.inputYearMax, 'change', function(){ Search.niceChange('Year', 'max') });
              addEvent(Search.inputYearMax, 'blur', Search.niceBlur);
              p7.appendChild(Search.inputYearMax);
        
        var fieldset4 = document.createElement('fieldset');
        div2.appendChild(fieldset4);

          var legend4 = document.createElement('legend');
            legend4.appendChild(document.createTextNode('Runtime'))
            fieldset4.appendChild(legend4);

          var p8 = document.createElement('p');
            fieldset4.appendChild(p8);

            Search.inputRuntimeMin = document.createElement('input');
              Search.inputRuntimeMin.type = 'text';
              Search.inputRuntimeMin.id = 'year-min';
              Search.inputRuntimeMin.defaultValue = Stats.d.runtimeMin;
              Search.inputRuntimeMin.value = Stats.d.runtimeMin;
              addEvent(Search.inputRuntimeMin, 'change', function(){ Search.niceChange('Runtime', 'min') });
              addEvent(Search.inputRuntimeMin, 'blur', Search.niceBlur);
              p8.appendChild(Search.inputRuntimeMin);
              
              Search.sliderRuntime = document.createElement('div');
                Search.sliderRuntime.id = 'runtime-slider';
                addClass(Search.sliderRuntime, 'slider');
                p8.appendChild(Search.sliderRuntime);
                
                Search.sliderRuntimeHandle1 = document.createElement('div');
                  Search.sliderRuntimeHandle1.id = 'runtime-slider-handle-1';
                  addClass(Search.sliderRuntimeHandle1, 'handle');
                  Search.sliderRuntime.appendChild(Search.sliderRuntimeHandle1);
                
                Search.sliderRuntimeFiller = document.createElement('div');
                  Search.sliderRuntimeFiller.id = 'runtime-slider-filler';
                  addClass(Search.sliderRuntimeFiller, 'filler');
                  Search.sliderRuntime.appendChild(Search.sliderRuntimeFiller);
                
                Search.sliderRuntimeHandle2 = document.createElement('div');
                  Search.sliderRuntimeHandle2.id = 'runtime-slider-handle-2';
                  addClass(Search.sliderRuntimeHandle2, 'handle');
                  Search.sliderRuntime.appendChild(Search.sliderRuntimeHandle2);
              
              Slider.create({
                sliderId: 'runtime-slider',
                handle1Id: 'runtime-slider-handle-1',
                handle2Id: 'runtime-slider-handle-2',
                fillerId: 'runtime-slider-filler',
                callback: Search.sliderCallback,
                minValue: Stats.d.runtimeMin,
                maxValue: Stats.d.runtimeMax,
                handle1Value: Stats.d.runtimeMin,
                handle2Value: Stats.d.runtimeMax,
                borderPlusPadding: 2
              });
            
            Search.inputRuntimeMax = document.createElement('input');
              Search.inputRuntimeMax.type = 'text';
              Search.inputRuntimeMax.id = 'year-max';
              Search.inputRuntimeMax.defaultValue = Stats.d.runtimeMax;
              Search.inputRuntimeMax.value = Stats.d.runtimeMax;
              addEvent(Search.inputRuntimeMax, 'change', function(){ Search.niceChange('Runtime', 'max') });
              addEvent(Search.inputRuntimeMax, 'blur', Search.niceBlur);
              p8.appendChild(Search.inputRuntimeMax);
        
        var fieldset5 = document.createElement('fieldset');
        div2.appendChild(fieldset5);

          var legend5 = document.createElement('legend');
            legend5.appendChild(document.createTextNode('Rating'))
            fieldset5.appendChild(legend5);

          var p9 = document.createElement('p');
            fieldset5.appendChild(p9);

            Search.inputRatingMin = document.createElement('input');
              Search.inputRatingMin.type = 'text';
              Search.inputRatingMin.id = 'year-min';
              Search.inputRatingMin.defaultValue = Stats.d.ratingMin;
              Search.inputRatingMin.value = Stats.d.ratingMin;
              addEvent(Search.inputRatingMin, 'change', function(){ Search.niceChange('Rating', 'min') });
              addEvent(Search.inputRatingMin, 'blur', Search.niceBlur);
              p9.appendChild(Search.inputRatingMin);
              
              Search.sliderRating = document.createElement('div');
                Search.sliderRating.id = 'rating-slider';
                addClass(Search.sliderRating, 'slider');
                p9.appendChild(Search.sliderRating);
                
                Search.sliderRatingHandle1 = document.createElement('div');
                  Search.sliderRatingHandle1.id = 'rating-slider-handle-1';
                  addClass(Search.sliderRatingHandle1, 'handle');
                  Search.sliderRating.appendChild(Search.sliderRatingHandle1);
                
                Search.sliderRatingFiller = document.createElement('div');
                  Search.sliderRatingFiller.id = 'rating-slider-filler';
                  addClass(Search.sliderRatingFiller, 'filler');
                  Search.sliderRating.appendChild(Search.sliderRatingFiller);
                
                Search.sliderRatingHandle2 = document.createElement('div');
                  Search.sliderRatingHandle2.id = 'rating-slider-handle-2';
                  addClass(Search.sliderRatingHandle2, 'handle');
                  Search.sliderRating.appendChild(Search.sliderRatingHandle2);
              
              Slider.create({
                sliderId: 'rating-slider',
                handle1Id: 'rating-slider-handle-1',
                handle2Id: 'rating-slider-handle-2',
                fillerId: 'rating-slider-filler',
                callback: Search.sliderCallback,
                minValue: Stats.d.ratingMin,
                maxValue: Stats.d.ratingMax,
                handle1Value: Stats.d.ratingMin,
                handle2Value: Stats.d.ratingMax,
                borderPlusPadding: 2
              });
            
            Search.inputRatingMax = document.createElement('input');
              Search.inputRatingMax.type = 'text';
              Search.inputRatingMax.id = 'year-max';
              Search.inputRatingMax.defaultValue = Stats.d.ratingMax;
              Search.inputRatingMax.value = Stats.d.ratingMax;
              addEvent(Search.inputRatingMax, 'change', function(){ Search.niceChange('Rating', 'max') });
              addEvent(Search.inputRatingMax, 'blur', Search.niceBlur);
              p9.appendChild(Search.inputRatingMax);
  }
};

DOMReady(Search.init);