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
    include_github_logo: true, // show a lil love
    image_path: "", // by default it is assumed that the images are in the same directory as the js. you probably will want to change this 
    
    // User Badge Options
    userBadgeTitle: "Repositories",
    repo_count: "10",
    
    // Project Badge Options 
    repo_name: null,
    repo_branch: "master",
    issue_count: "100",
    commit_count: "10"
  }

  var buildUser = function(where, options) {
      
    $(where).html('<div class="ghb_badge '+ options.theme +'"><div id="ghb_user_header_'+ options.login +'" class="ghb_badge_header"></div><div class="ghb_user_nav"><a class="ghb_user_info_nav">User Info</a><a class="ghb_user_repo_nav">Repos</a></div><div class="ghb_badge_user_info"><h2>User Info</h2><div id="ghb_user_info_'+ options.login +'"></div></div><div class="ghb_badge_user_repos"><h2>Public '+ options.userBadgeTitle +'</h2><ul id="ghb_repo_list_' + options.login + '" class="ghb_repo_list"></ul><div id="ghb_repo_goto_'+ options.login +'" class="ghb_repo_goto"></div></div></div>');  
    
    var requestURLUserInfo = "http://github.com/api/v2/json/user/show/" + options.login + "?callback=?";
    $.getJSON(requestURLUserInfo, function(data){
        // console.log(data);
        $("#ghb_user_header_" + options.login).html('<h1><a target="_blank" href="http://www.github.com/'+ options.login +'">'+ options.login +'\'s GitHub</a> ('+ data.user.public_repo_count +')</h1>');
        if (options.include_github_logo) {
            $("#ghb_user_header_" + options.login).prepend('<a target="_blank" href="http://www.github.com"><img src="'+ options.image_path +'ghb_logo.png" alt="GitHub" width="75" height="30"></a>');
        }
        $("#ghb_user_info_" + options.login).html('<img src="http://www.gravatar.com/avatar/'+ data.user.gravatar_id +'">' + data.user.name +'<dl><dt>Public Repos:</dt><dd><a target="_blank" href="http://github.com/' + options.login + '/repositories">' + data.user.public_repo_count +'</a></dd><dt>Followers:</dt><dd><a target="_blank" href="http://github.com/' + options.login + '/followers">' + data.user.followers_count +'</a></dd><dt>Following:</dt><dd><a target="_blank" href="http://github.com/' + options.login + '/following">' + data.user.following_count +'</a></dd><dt>Public Gists:</dt><dd><a target="_blank" href="http://gist.github.com/' + options.login + '">' + data.user.public_gist_count +'</a></dd></dl>');
        
        if (data.user.public_repo_count > (options.repo_count-1) ) {
            remaining = (data.user.public_repo_count - options.repo_count);
            $("#ghb_repo_goto_" + options.login).html('<a href="http://github.com/' + options.login + '/repositories">View All '+ options.userBadgeTitle +' (' + remaining + ' More) ... </a>');
        } else {
            $("#ghb_repo_goto_" + options.login).html('<a href="http://github.com/' + options.login + '">' + options.login + ' at GitHub</a>');
        }
    });      
    
    var requestURLRepos = "http://github.com/api/v2/json/repos/show/" + options.login + "?callback=?";
    $.getJSON(requestURLRepos, function(data){
        //console.log(data);
        if(data.length === 0) {
            $('#ghb_repo_list_' + options.login).html('<li class="no_records">' + options.login +' Does Not Have Any Repos</li>');
        } else {      
            $.each(data.repositories, function (i, obj) {
                record ='<li><a target="_blank" href="'+ obj.url +'">'+ obj.name +'</a> <span>'+ obj.description +'</span></li>';
                if (options.sorting == "ascending" ) {
                    $('#ghb_repo_list_' + options.login).append(record);
                } else {
                    $('#ghb_repo_list_' + options.login).prepend(record);
                }
                if ( i == (options.repo_count-1) ) return false;
                
            });
            
            // give first list item a special class
            $('ul#ghb_repo_list_' + options.login +' li:first').addClass("firstrepo");
            // give last list item a special class
            $('ul#ghb_repo_list_' + options.login +' li:last').addClass("lastrepo");
             
        }
    });   
  }

  var buildProject = function(where, options) {
      
    $(where).html('<div class="ghb_badge '+ options.theme +'"><div id="ghb_user_header_'+ options.repo_name +'" class="ghb_badge_header"></div><div class="ghb_repo_nav"><a class="ghb_repo_info_nav">Repo Info</a><a class="ghb_repo_issues_nav">Issues</a><a class="ghb_repo_commits_nav">Commits</a></div><div id="ghb_repo_info_' + options.repo_name +'" class="ghb_repo_info"></div><div class="ghb_repo_issues"><h2>Open Issues</h2><ul id="ghb_issue_list_' + options.repo_name + '" class="ghb_issue_list"></ul><div id="ghb_repo_goto_issues_'+ options.repo_name +'" class="ghb_repo_goto_issues"></div></div><div class="ghb_repo_commits"><h2>Commits</h2><ul id="ghb_commit_list_' + options.repo_name + '" class="ghb_commit_list"><li class="no_records">There are no commits in the ' + options.repo_branch + ' branch</li></ul><div id="ghb_repo_goto_commits_'+ options.repo_name +'" class="ghb_repo_goto_commits"></div></div></div>');    
       
    var requestURLRepo = "http://github.com/api/v2/json/repos/show/" + options.login + "/" + options.repo_name + "?callback=?";
    
    $.getJSON(requestURLRepo, function(data){
        // console.log(data);
        $("#ghb_user_header_" + options.repo_name).html('<h1><a target="_blank" href="'+ data.repository.url +'">' + data.repository.name +'</a></h1>');
        if (options.include_github_logo) {
            $("#ghb_user_header_" + options.repo_name).prepend('<a target="_blank" href="http://www.github.com"><img src="'+ options.image_path +'ghb_logo.png" alt="GitHub"></a>');
        }      
        
        $("#ghb_repo_info_" + options.repo_name).html('<p>' + data.repository.description + '</p><p><a target="_blank" href="' + data.repository.url + '">' + data.repository.url +'</a></p><dl class="repo_info_list"></dd><dt>Watchers:</dt><dd>' + data.repository.watchers + '</dd><dt>Created:</dt><dd>' + data.repository.created_at + '</dd><dt>Last Updated:</dt><dd>' + data.repository.pushed_at + '</dd></dl>');
        $("#ghb_repo_goto_issues_" + options.repo_name).html('<a href="' + data.repository.url + '/issues">View All Issues');
        $("#ghb_repo_goto_commits_" + options.repo_name).html('<a href="' + data.repository.url + '/commits/' + options.repo_branch +'">View All Commits');
        $("#ghb_repo_goto_issues_" + options.repo_name).hide();
        $("#ghb_repo_goto_commits_" + options.repo_name).hide();
    });
    
    var requestURLIssues = "http://github.com/api/v2/json/issues/list/" + options.login + "/" + options.repo_name + "/open?callback=?";
    console.log(requestURLIssues);
    $.getJSON(requestURLIssues, function(data){
        //console.log(data);
        if(data.issues.length === 0) {
            $('#ghb_issue_list_' + options.repo_name).html('<li class="no_records">There are no open issues for this repo.</li>');
        } else {
            $("#ghb_repo_goto_issues_" + options.repo_name).show();
            $.each(data.issues, function (i, obj) {
                record ='<li><a target="_blank" href="http://github.com/'+ options.login + '/' + options.repo_name + '/issues#issue/' + obj.number + '">'+ obj.title +'</a> <span>'+ obj.body +'</span></li>';
                if (options.sorting == "ascending" ) {
                    $('#ghb_issue_list_' + options.repo_name).append(record);
                } else {
                    $('#ghb_issue_list_' + options.repo_name).prepend(record);
                }
                if ( i == (options.issue_count-1) ) return false;
                        
            });
            // give first list item a special class
            $('ul#ghb_issue_list_' + options.login +' li:first').addClass("firstrepo");
            // give last list item a special class
            $('ul#ghb_issue_list_' + options.login +' li:last').addClass("lastrepo");
        }
    });
    
    var requestURLCommits = "http://github.com/api/v2/json/commits/list/" + options.login + "/" + options.repo_name + "/" + options.repo_branch + "?callback=?";
    $.getJSON(requestURLCommits, function(data){
        console.log(data);
        $.each(data.commits, function (i, obj) {
            $('#ghb_commit_list_' + options.repo_name + ' .no_records').hide();
            record ='<li><a target="_blank" href="'+ obj.url + '">' + obj.message + '</a> <span>'+ obj.author.name +'</span></li>';
            if (options.sorting == "ascending" ) {
                $('#ghb_commit_list_' + options.repo_name).append(record);
            } else {
                $('#ghb_commit_list_' + options.repo_name).prepend(record);
            }
            if ( i == (options.commit_count-1) ) return false;
        });
        // give first list item a special class
        $('ul#ghb_commit_list_' + options.login +' li:first').addClass("firstrepo");
        // give last list item a special class
        $('ul#ghb_commit_list_' + options.login +' li:last').addClass("lastrepo");   		    
        $("#ghb_repo_goto_commits_" + options.repo_name).show();       
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
        if (!options.repo_name) {
          console.log( "%s", options.repo_name + " is undefined, not doing anything." );
          return;
        }
        buildProject(this, options);
        break
    }
    console.groupEnd();
  }

})(jQuery);



