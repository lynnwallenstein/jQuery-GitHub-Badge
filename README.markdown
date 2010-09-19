jQuery Github Badge is a jQuery plugin allowing you to display Github activity
for a user or a repo (project).

Demo: [http://www.maverickconceptions.com/demos/github_badge/index.html][1] 

This documentation is highly in flux as I am in the middle of alpha testing this right
now. I will be flushing out all the explanations of all the options once I finish making
them work ;) 

##SETUP

+ jQuery 1.4.2 (This is what I developed on, I haven't tested it with older versions. If you 
  do and it works, drop me a line at lwallenstein@gmail.com)


##INSTALLATION

You can see a full installation in the demo.html file included in this repo, however here are 
the itemized steps.

###Step 1: Include the plugin script after jQuery

    <!-- Script for GitHub Badge Widget -->
    <script src="jquery.github_badge.js"></script>


###Step 2: Include the CSS in the head of the document

    <!-- CSS for GitHub Badge Widget: implied media="all" -->
    <link rel="stylesheet" href="css/jquery.github_badge.css?v=1" />

###Step 3: In the body of your documents, create a container where you want the badge to display

    <div id="sample_user_badge"></div>

###Step 4: Call the script (with minimal default options.. see configuration section for more)

    <script>
    $("#sample_user_badge").GithubBadge({
        login: "jquery"
    });
    </script>


##CONFIGURATION

##== User Badge ==

###Minmal Configuration for User Badge:

    $("#sample_user_badge").GithubBadge({
        login: "GITHUB_LOGIN"
    });

###Options for User Badge

    $("#sample_user_badge").GithubBadge({
        login               : "GITHUB_LOGIN"
        sorting             : "ascending", // ascending or descending for repos (user badge) and issues (project badge)
        theme               : "github",    // adds value as class for entire badge
        include_github_logo : true,        // show a lil love
        image_path          : "images/",   // path to your images directory
        animate_style       : "slide",     //slideDown or show
        repo_count          : "10"         // maximum number of repos to be displayed
    });

##== Project/Repo Badge ==

###Minmal Configuration for Project Badge:

    $("#sample_project_badge").GithubBadge({
        login     : "GITHUB_LOGIN",
        kind      : "project",         // user or project
        repo_name : "GITHUB_REPO_NAME"
    });

###Options for User Badge

    $("#sample_user_badge").GithubBadge({
        login               : "GITHUB_LOGIN",
        kind                : "project",          // user or project
        repo_name           : "GITHUB_REPO_NAME",
        sorting             : "ascending",        // ascending or descending for repos (user badge) and issues (project badge)
        theme               : "github",           // adds value as class for entire badge
        include_github_logo : true,               // show a lil love
        image_path          : "images/",          // path to your images directory
        animate_style       : "slide",            // slide or show, how you want the panels to animate while switching tabs
        repo_count          : "10",               // maximum number of repos to be displayed
        repo_branch         : "master",           // branch of repo to show commits from
        issue_count         : "10",               // maximum number of issues to be displayed
        commit_count        : "10"                // maximum number of commits to be displayed
    });

  [1]: http://www.maverickconceptions.com/demos/github_badge/index.html