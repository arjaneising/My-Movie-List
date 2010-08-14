var Compare = {
  config: {
    compareBoxId: 'compare',
    tasteometerId: 'tasteometer'
  },
  
  
  init: function() {
    // This requires the movies.js file to be loaded.
    if (!Movies || !Movies.trElms) return;
    
    var aElm = document.createElement('a');
      aElm.href = 'javascript:Compare.open();';
      aElm.appendChild(document.createTextNode('Compare'));
    
    Movies.actionsBoxElm.appendChild(aElm);
    
    Compare.moviesBothLike = [];
    Compare.moviesBothLikeCounter = 0;
  },
  
  
  // When the user clicks the link, this function will be called
  open: function() {
    if (!Compare.openedBefore) {
      Compare.createHtml();
      Compare.getIds();
      
      Compare.openedBefore = true;
    }
    else if (Compare.jsFileLoaded) {
      addClass(Movies.tableElm, 'hide');
      
      if (Compare.typeInputSimilarity.checked)
        removeClass(Compare.sameTable, 'hide');
      else
        removeClass(Compare.otherTable, 'hide');
    }
    Movies.setActivePanel(Compare.compareElm);
  },
  
  
  error: function() {
    alert('There are no movies on the other list.');
  },
  
  
  /* When the JS file is loaded, it will call this function.
    All movies of the other list will be looped.
    Then they will be added to the specific lists. */
  compare: function(OtherMovies) {
    Compare.compatibilityCounter = 0;
    Compare.compatibilityTotal = 0;
    
    for (var i = 0; i < OtherMovies.length; ++i) {
      if (OtherMovies[i] === undefined)
        continue;
      
      // If this list contains the id
      if (Compare.thisIds[i]) {
        var difference = OtherMovies[i][1] - Compare.thisIds[i];
        
        var trElm = document.createElement('tr');
          Compare.sameTBody.appendChild(trElm);
          
          var titleTdElm = document.createElement('td');
            trElm.appendChild(titleTdElm);
          
            var titleAElm = document.createElement('a');
              titleAElm.href = 'http://www.imdb.com/title/tt' + Compare.padId(i) + '/';
              titleAElm.appendChild(document.createTextNode(OtherMovies[i][0]));
              titleTdElm.appendChild(titleAElm);
            
          var myRatingTdElm = document.createElement('td');
            myRatingTdElm.appendChild(document.createTextNode(Compare.thisIds[i]));
            addClass(myRatingTdElm, 'small');
            trElm.appendChild(myRatingTdElm);
            
          var otherRatingTdElm = document.createElement('td');
            otherRatingTdElm.appendChild(document.createTextNode(OtherMovies[i][1]));
            addClass(otherRatingTdElm, 'small');
            trElm.appendChild(otherRatingTdElm);
            
          var diffTdElm = document.createElement('td');
            var plus = difference > 0 ? '+' : '';
            diffTdElm.appendChild(document.createTextNode(plus + difference));
            addClass(diffTdElm, 'diff-' + Math.abs(difference));
            addClass(diffTdElm, 'small');
            trElm.appendChild(diffTdElm);
        
        Compare.compatibilityCounter += 9 - Math.abs(difference);
        Compare.compatibilityTotal += 9;
        
        if (OtherMovies[i][1] > 7 && Compare.thisIds[i] > 7) {
          Compare.moviesBothLike[Compare.moviesBothLikeCounter++] = OtherMovies[i][0];
        }
      }
      // If this lsit doesn't contain the ID
      else {
        var trElm = document.createElement('tr');
          Compare.otherTBody.appendChild(trElm);
          
          var titleTdElm = document.createElement('td');
            trElm.appendChild(titleTdElm);
          
            var titleAElm = document.createElement('a');
              titleAElm.href = 'http://www.imdb.com/title/tt' + Compare.padId(i) + '/';
              titleAElm.appendChild(document.createTextNode(OtherMovies[i][0]));
              titleTdElm.appendChild(titleAElm);
            
          var otherRatingTdElm = document.createElement('td');
            otherRatingTdElm.appendChild(document.createTextNode(OtherMovies[i][1]));
            addClass(otherRatingTdElm, 'small');
            trElm.appendChild(otherRatingTdElm);
      }
    }
    
    
    if (Compare.compatibilityTotal !== 0) {
      var percentage = Math.round((Compare.compatibilityCounter * 100) / Compare.compatibilityTotal);
      
      Compare.tasteometerInner.style.width = percentage + '%';
      var compatibility;
      
      if (percentage < 17) {
        addClass(Compare.tasteometerInner, 'verylow');
        compatibility = 'very low';
      }
      else if (percentage < 33) {
        addClass(Compare.tasteometerInner, 'low');
        compatibility = 'low';
      }
      else if (percentage < 50) {
        addClass(Compare.tasteometerInner, 'medium');
        compatibility = 'medium';
      }
      else if (percentage < 67) {
        addClass(Compare.tasteometerInner, 'high');
        compatibility = 'high';
      }
      else if (percentage < 85) {
        addClass(Compare.tasteometerInner, 'veryhigh');
        compatibility = 'very high';
      }
      else {
        addClass(Compare.tasteometerInner, 'super');
        compatibility = 'super';
      }
      
      Compare.tasteometerStrongElm.appendChild(document.createTextNode(compatibility));
      
      removeClass(Compare.tasteometerElm, 'hide');
    }
    
    
    if (Compare.moviesBothLikeCounter !== 0) {
      // randomize the array with movies we both like
      Compare.moviesBothLike.sort(function() { return 0.5 - Math.random(); } );
      
      var string = 'Movies we both like include: ';
      
      for (var i = 0; Compare.moviesBothLike[i] && i < 5; ++i) {
        string += Compare.moviesBothLike[i] + ', ';
      }
      
      string = string.substring(0, string.length - 2);
      
      // replace the last comma for ' and '
      string = string.replace(/,(?!.*,)/, ' and ');
      
      Compare.bothlikeElm.appendChild(document.createTextNode(string + '.'));
      
      removeClass(Compare.bothlikeElm, 'hide');
    }
    
    
    
    addClass(Compare.inputUrlElm, 'hide');
    
    removeClass(Compare.chooseCompareTypeElm, 'hide');
    
    Sort.createHtml(Compare.sameTable, 5);
    Sort.createHtml(Compare.otherTable, 3);
    Sort.sortColumn(Compare.sameTable, 0, 'a');
    Sort.sortColumn(Compare.otherTable, 0, 'a');
    
    addClass(Movies.tableElm, 'hide');
    removeClass(Compare.sameTable, 'hide');
        
    Compare.jsFileLoaded = true;
  },
  
  
  // When the user clicks the close link, this function will be called
  closeIt: function() {
    addClass(Compare.compareElm, 'hide');
    addClass(Compare.sameTable, 'hide');
    addClass(Compare.otherTable, 'hide');
    removeClass(Movies.tableElm, 'hide');
  },
  
  
  // Create all the necessary HTML.
  createHtml: function() {
    Compare.compareElm = document.createElement('div');
    Compare.compareElm.id = Compare.config.compareBoxId;
    Compare.compareElm.className = 'panel';
    Movies.tableElm.parentNode.insertBefore(Compare.compareElm, Movies.tableElm);
  
    var headerElm = document.createElement('div');
      headerElm.className = 'header';
      Compare.compareElm.appendChild(headerElm);

      var h2Elm = document.createElement('h2');
        h2Elm.appendChild(document.createTextNode('Compare'));
        headerElm.appendChild(h2Elm);
        
      var p1Elm = document.createElement('p');
        headerElm.appendChild(p1Elm);
      
        var closeLink = document.createElement('a');
          closeLink.appendChild(document.createTextNode('Close'));
          closeLink.href = 'javascript:Compare.closeIt()';
          p1Elm.appendChild(closeLink);

    var bodyElm = document.createElement('div');
      bodyElm.className = 'body';
      Compare.compareElm.appendChild(bodyElm);
      
      var div1Elm = document.createElement('div');
        bodyElm.appendChild(div1Elm);
      
        Compare.inputUrlElm = document.createElement('fieldset');
          div1Elm.appendChild(Compare.inputUrlElm);
          
          var legend1Elm = document.createElement('legend');
            legend1Elm.appendChild(document.createTextNode('Input URL'));
            Compare.inputUrlElm.appendChild(legend1Elm);
      
          var p2Elm = document.createElement('p');
            Compare.inputUrlElm.appendChild(p2Elm);
      
            p2Elm.appendChild(document.createTextNode('URL of the other movie list: '));
      
            Compare.urlInputElm = document.createElement('input');
              addClass(Compare.urlInputElm, 'text');
              p2Elm.appendChild(Compare.urlInputElm);
      
          var p3Elm = document.createElement('p');
            Compare.inputUrlElm.appendChild(p3Elm);
        
            var submitElm = document.createElement('input');
              submitElm.type = 'submit';
              addClass(submitElm, 'submit');
              addEvent(submitElm, 'click', Compare.loadJsFile);
              p3Elm.appendChild(submitElm);
              submitElm.value = 'Compare...';
    
        Compare.chooseCompareTypeElm = document.createElement('fieldset');
          addClass(Compare.chooseCompareTypeElm, 'hide');
          div1Elm.appendChild(Compare.chooseCompareTypeElm);
        
          var legend2Elm = document.createElement('legend');
            legend2Elm.appendChild(document.createTextNode('View'));
            Compare.chooseCompareTypeElm.appendChild(legend2Elm);
        
          var ulElm = document.createElement('ul');
            Compare.chooseCompareTypeElm.appendChild(ulElm);
          
            var li1Elm = document.createElement('li');
              ulElm.appendChild(li1Elm);
            
              var label1Elm = document.createElement('label');
                label1Elm.htmlFor = 'compare-type-similiarity';
                li1Elm.appendChild(label1Elm);
              
                Compare.typeInputSimilarity = document.createElement('input');
                  Compare.typeInputSimilarity.type = 'radio';
                  Compare.typeInputSimilarity.name = 'compare-type';
                  Compare.typeInputSimilarity.id = 'compare-type-similiarity';
                  Compare.typeInputSimilarity.checked = true;
                  addEvent(Compare.typeInputSimilarity, 'click', Compare.changeViewType);
                  addEvent(Compare.typeInputSimilarity, 'change', Compare.changeViewType);
                  label1Elm.appendChild(Compare.typeInputSimilarity);
                
                label1Elm.appendChild(document.createTextNode(' similarity'));
          
            var li2Elm = document.createElement('li');
              ulElm.appendChild(li2Elm);
            
              var label2Elm = document.createElement('label');
                label2Elm.htmlFor = 'compare-type-additions';
                li2Elm.appendChild(label2Elm);
              
                Compare.typeInputAdditions = document.createElement('input');
                  Compare.typeInputAdditions.type = 'radio';
                  Compare.typeInputAdditions.name = 'compare-type';
                  Compare.typeInputAdditions.id = 'compare-type-additions';
                  addEvent(Compare.typeInputAdditions, 'click', Compare.changeViewType);
                  addEvent(Compare.typeInputAdditions, 'change', Compare.changeViewType);
                  label2Elm.appendChild(Compare.typeInputAdditions);
                
                label2Elm.appendChild(document.createTextNode(' additions'));
      
      var div2Elm = document.createElement('div');
        bodyElm.appendChild(div2Elm);

        Compare.tasteometerElm = document.createElement('fieldset');
          addClass(Compare.tasteometerElm, 'hide');
          div2Elm.appendChild(Compare.tasteometerElm);
          
          var legend3Elm = document.createElement('legend');
            legend3Elm.appendChild(document.createTextNode('Taste-o-meter'));
            Compare.tasteometerElm.appendChild(legend3Elm);
          
          var p4Elm = document.createElement('p');
            p4Elm.appendChild(document.createTextNode('My movie compatibility with the other list is '));
            Compare.tasteometerElm.appendChild(p4Elm);
            
            Compare.tasteometerStrongElm = document.createElement('strong');
              p4Elm.appendChild(Compare.tasteometerStrongElm);
              
            p4Elm.appendChild(document.createTextNode('.'));
              
          var tasteometerElm = document.createElement('div');
            tasteometerElm.id = Compare.config.tasteometerId;
            Compare.tasteometerElm.appendChild(tasteometerElm);
          
            Compare.tasteometerInner = document.createElement('div');
              tasteometerElm.appendChild(Compare.tasteometerInner);
          
          Compare.bothlikeElm = document.createElement('p');
            addClass(Compare.bothlikeElm, 'hide');
            Compare.tasteometerElm.appendChild(Compare.bothlikeElm);
    
    var footerElm = elm(Movies.config.footerId);
    
    Compare.sameTable = document.createElement('table');
      Compare.sameTable.cellSpacing = 0;
      addClass(Compare.sameTable, 'hide');
      footerElm.parentNode.insertBefore(Compare.sameTable, footerElm);
      
      var thead1Elm = document.createElement('thead');
        Compare.sameTable.appendChild(thead1Elm);
          
        var tr1Elm = document.createElement('tr');
        thead1Elm.appendChild(tr1Elm);
        
          var titleTh1Elm = document.createElement('th');
            titleTh1Elm.appendChild(document.createTextNode('Title'));
            addClass(titleTh1Elm, 'sort-alpha');
            tr1Elm.appendChild(titleTh1Elm);
          
          var myRatingTh1Elm = document.createElement('th');
            myRatingTh1Elm.appendChild(document.createTextNode('My rating'));
            addClass(myRatingTh1Elm, 'sort-num');
            tr1Elm.appendChild(myRatingTh1Elm);
          
          var otherRatingTh1Elm = document.createElement('th');
            otherRatingTh1Elm.appendChild(document.createTextNode('Other rating'));
            addClass(otherRatingTh1Elm, 'sort-num');
            tr1Elm.appendChild(otherRatingTh1Elm);
          
          var diffRatingTh1Elm = document.createElement('th');
            diffRatingTh1Elm.appendChild(document.createTextNode('Difference'));
            addClass(diffRatingTh1Elm, 'sort-num');
            tr1Elm.appendChild(diffRatingTh1Elm);
      
      Compare.sameTBody = document.createElement('tbody');
        Compare.sameTable.appendChild(Compare.sameTBody);
    
    Compare.otherTable = document.createElement('table');
      Compare.otherTable.cellSpacing = 0;
      addClass(Compare.otherTable, 'hide');
      footerElm.parentNode.insertBefore(Compare.otherTable, footerElm);
      
      var thead2Elm = document.createElement('thead');
        Compare.otherTable.appendChild(thead2Elm);
          
        var tr2Elm = document.createElement('tr');
        thead2Elm.appendChild(tr2Elm);
        
          var titleTh2Elm = document.createElement('th');
            titleTh2Elm.appendChild(document.createTextNode('Title'));
            addClass(titleTh2Elm, 'sort-alpha');
            tr2Elm.appendChild(titleTh2Elm);
          
          var otherRatingTh2Elm = document.createElement('th');
            otherRatingTh2Elm.appendChild(document.createTextNode('Other rating'));
            addClass(otherRatingTh2Elm, 'sort-num');
            tr2Elm.appendChild(otherRatingTh2Elm);
      
      Compare.otherTBody = document.createElement('tbody');
        Compare.otherTable.appendChild(Compare.otherTBody);
  },
  
  
  changeViewType: function() {
    if (Compare.typeInputSimilarity.checked) {
      addClass(Compare.otherTable, 'hide');
      removeClass(Compare.sameTable, 'hide');
    }
    else {
      addClass(Compare.sameTable, 'hide');
      removeClass(Compare.otherTable, 'hide');
    }
  },
  
  
  // Called at initialisation, gets all the IDs from the main table.
  getIds: function() {
    Compare.thisIds = [];
    
    for (var i = 0; Movies.trElms[i]; ++i) {
      var id = parseInt(Movies.trElms[i].getElementsByTagName('a')[0].href.substring(28, 35), 10);
      Compare.thisIds[id] = parseInt(Movies.trElms[i].getElementsByTagName('td')[Movies.config.columnOffsetRating].innerHTML, 10);
    }
  },
  
  
  // Adds a script tag at the end of the page, to load the other movie list.
  loadJsFile: function() {
    if (Compare.urlInputElm.value.length !== 0) {
      if (!Compare.jsFileLoaded) {
        var url = Compare.urlInputElm.value;
        if (url.indexOf('/add-movie.php') > -1 || url.indexOf('?message=') > -1)
          url = url.substring(0, url.lastIndexOf('/') + 1);
        
        var scriptElm = document.createElement('script');
          scriptElm.type = 'text/javascript';
          scriptElm.src = url + 'compare.js.php';
          document.body.appendChild(scriptElm);
      }
      else
        alert('You can load only one other movie list. Refresh to compare with another list.');
    }
    else
      alert('Enter a URL.');
  },
  
  
  padId: function(id) {
    while (('' + id).length < 7) {
      id = '0' + id;
    }
    return id;
  }
};

DOMReady(Compare.init);