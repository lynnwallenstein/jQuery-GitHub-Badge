/*
jquery.github_badge.js v1.0
Last updated: 10 September 2010

Created by Lynn Wallenstein
http://www.maverickconceptions.com/2010/09/11/github-badge/

Licensed under a Creative Commons Attribution-Non-Commercial 3.0 Unported License
http://creativecommons.org/licenses/by-nc/3.0/
*/

// avoid javascript errors on browsers that aren't using FireBug.
(function($){

  if (!window.console || !console.firebug) {
    var names = [
      'log', 'debug', 'info', 'warn', 'error', 'assert',
      'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd',
      'count', 'trace', 'profile', 'profileEnd'
    ];
    window.console = {};
    for ( var i = 0; i < names.length; ++i )
      window.console[names[i]] = function() {}
  }

  var defaults = {
    login: null,
    kind: "user", // user or project
    sorting: "ascending", // ascending or descending for repos (user badge) and issues (project badge)
    
    // User Badge Options
    userBadgeTitle: "My Projects",
    
    // Project Badge Options 
    repo_name: null
  }

  var buildUser = function(where, options) {
      
    $(where).html('<div class="ghb_badge"><h1>'+ options.userBadgeTitle +' (<a target="_blank" href="http://www.github.com/'+ options.login +'">'+ options.login +'</a>)</h1><ul id="ghb_repolist_' + options.login + '"></ul></div>');
          
    var requestURL = "http://github.com/api/v2/json/repos/show/" + options.login + "?callback=?";
    $.getJSON(requestURL, function(data){
      //console.log(data);
      $.each(data.repositories, function (i, obj) {
        if(data.length === 0) {
          $('#ghb_repolist_' + options.login).html('<li>This User Has No Projects</li>');
        } else {
          record ='<li><a target="_blank" href="'+ obj.url +'">'+ obj.name +'</a> <span>'+ obj.description +'</span></li>';
          
          if (options.sorting == "ascending" ) {
            $('#ghb_repolist_' + options.login).append(record);
          } else {
            $('#ghb_repolist_' + options.login).prepend(record);
          }
          
        }
      });
    });

  }

  var buildProject = function(where, options) {
    $(where).html('<div class="ghb_badge"><div id="ghb_repoinfo_' + options.repo_name +'"></div><ul id="ghb_issue_list_' + options.repo_name + '"></ul></div>');
    
    var requestURLRepo = "http://github.com/api/v2/json/repos/show/" + options.login + "/" + options.repo_name + "?callback=?";
    $.getJSON(requestURLRepo, function(data){
      //console.log(data);
      $("#ghb_repoinfo_" + options.repo_name).html('<h1><a target="_blank" href="'+ data.repository.url +'">' + data.repository.name +'</a></h1><p>' + data.repository.description + '</p>');
    });
    
    var requestURLIssues = "http://github.com/api/v2/json/issues/list/" + options.login + "/" + options.repo_name + "/open?callback=?";
    $.getJSON(requestURLIssues, function(data2){
      console.log(data2);
      $.each(data2.issues, function (i, obj) {
        if(data2.length === 0) {
          $('#ghb_issuelist_' + options.repo_name).html('<li>There are no open issues for this project</li>');
        } else {
            record ='<li><a target="_blank" href="http://github.com/'+ options.login + '/' + options.repo_name + '/issues#issue/' + obj.number + '">'+ obj.title +'</a> <span>'+ obj.body +'</span></li>';
            if (options.sorting == "ascending" ) {
                $('#ghb_issue_list_' + options.repo_name).append(record);
            } else {
                $('#ghb_issue_list_' + options.repo_name).prepend(record);
            }          
        }
      });
    });

  }

  $.fn.GithubBadge = function(options) {

    // option parsing
    var options = jQuery.extend({}, defaults, options);
    console.group( 'GithubBadge' );
    console.log( "Options parsed as: %o", options );
    
    // sanity checks.
    if (!options.login) {
      console.log( "%s", options.login + " is undefined, not doing anything." );
      return;
    }
    
    // dispatch
    switch (options.kind) {
    case "user":
      buildUser(this, options);
      break;
    case "project":
      buildProject(this, options);
      break
    }
    console.groupEnd();
  }

})(jQuery);