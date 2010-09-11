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
    theme: "github",
    
    // User Badge Options
    userBadgeTitle: "My Projects",
    
    // Project Badge Options 
    repo_name: null,
    repo_branch: "master",
    issue_count: "10",
    commit_count: "10"
  }

  var buildUser = function(where, options) {
      
    $(where).html('<div class="ghb_badge '+ options.theme +'"><h1>'+ options.userBadgeTitle +' (<a target="_blank" href="http://www.github.com/'+ options.login +'">'+ options.login +'</a>)</h1><ul id="ghb_repolist_' + options.login + '"></ul></div>');
          
    var requestURLRepos = "http://github.com/api/v2/json/repos/show/" + options.login + "?callback=?";
    $.getJSON(requestURLRepos, function(data){
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
    $(where).html('<div class="ghb_badge '+ options.theme +'"><div id="ghb_repoinfo_' + options.repo_name +'"></div><h2>Open Issues</h2><ul id="ghb_issue_list_' + options.repo_name + '"></ul><h2>Commits</h2><ul id="ghb_commit_list_' + options.repo_name + '"></ul></div>');
    
    var requestURLRepo = "http://github.com/api/v2/json/repos/show/" + options.login + "/" + options.repo_name + "?callback=?";
    $.getJSON(requestURLRepo, function(data){
      // console.log(data);
      $("#ghb_repoinfo_" + options.repo_name).html('<h1><a target="_blank" href="'+ data.repository.url +'">' + data.repository.name +'</a></h1><p>' + data.repository.description + '</p>');
    });
    
    var requestURLIssues = "http://github.com/api/v2/json/issues/list/" + options.login + "/" + options.repo_name + "/open?callback=?";
    console.log(requestURLIssues);
    $.getJSON(requestURLIssues, function(data){
        // console.log(data);
        if(data.issues.length === 0) {
            $('#ghb_issue_list_' + options.repo_name).html('<li class="no_records">There are no open issues for this project</li>');
        } else {
            $.each(data.issues, function (i, obj) {
                record ='<li><a target="_blank" href="http://github.com/'+ options.login + '/' + options.repo_name + '/issues#issue/' + obj.number + '">'+ obj.title +'</a> <span>'+ obj.body +'</span></li>';
                if (options.sorting == "ascending" ) {
                    $('#ghb_issue_list_' + options.repo_name).append(record);
                } else {
                    $('#ghb_issue_list_' + options.repo_name).prepend(record);
                }
                if ( i == options.issue_count ) return false;
                        
            });
        }
    });
    
    var requestURLCommits = "http://github.com/api/v2/json/commits/list/" + options.login + "/" + options.repo_name + "/" + options.repo_branch + "?callback=?";
    console.log(requestURLCommits);
    $.getJSON(requestURLCommits, function(data){
        // console.log(data);
        
        if(data.err === 0) {
            $('#ghb_commit_list_' + options.repo_name).html('<li class="no_records">There are no commits in the ' + options.repo_branch + '</li>');
        } else { 
            $.each(data.commits, function (i, obj) {
                record ='<li><a target="_blank" href="'+ obj.url + '">' + obj.message + '</a> <span>'+ obj.author.name +'</span></li>';
                if (options.sorting == "ascending" ) {
                    $('#ghb_commit_list_' + options.repo_name).append(record);
                } else {
                    $('#ghb_commit_list_' + options.repo_name).prepend(record);
                }
                if ( i == options.commit_count ) return false;
            });        
        }
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