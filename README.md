Story Map SDK 2
=========================

## Overview

The Story Map APP shows all of the high level themes (Features) your users need to do, broken down 
into the smaller stories (User Stories) a user would do as part of each theme.  
See [this](http://www.agileproductdesign.com/blog/the_new_backlog.html) blog post on 
Story Maps by Jeff Patton for more information.

## Screen Shot

![Story Map](https://raw.github.com/RallyRonnie/StoryMap2/master/screenshot.png)

## How to Use

You can use the APP at your team level, program level or setup a separate Project for each Story Map. 
You can then create your Feature set in the Portfolio->Portfolio Items page and also create your appropriate 
Releases or Iterations in the Plan->Time Boxes page. New stories can then be created on the board and placed into
the appropriate row and column mapping the story. Selecting a story ID will pop the quick details page  (QDP)to the right
to further complete the story details.

NOTE: If a row is not displayed, that indicates that there is not a User Story assigned to that Iteration or Release.
You can select a User Story, and on the QDP, select the desired Iteration or Release and it will now display on the 
board.

There are new APP options under the APP gear->Edit App Settings. Here is a screenshot. You can easily filter
the Features (or lowest level PI) using the State picker. You can also change the base Portfolio Item name if your
default configuration does not use "Feature" as the lowest level PI. You can also choose the row type (either Iteration
or Release). The query field applies to filtering user story cards if needed.

![Story Map](https://raw.github.com/RallyRonnie/StoryMap2/master/settings.png)

### Running the App

If you want to start using the app immediately, create an Custom HTML app on your Rally dashboard. 
Then copy App.html from the deploy folder into the HTML text area. That's it, it should be ready 
to use. See [this](http://www.rallydev.com/help/use_apps#create) help link if you don't know how 
to create a dashboard page for Custom HTML apps.

Or you can just click [here](https://raw.github.com/RallyRonnie/StoryMap2/master/deploy/App.html) to find 
the file and copy it into the custom HTML app.

## License

AppTemplate is released under the MIT license.  See the file [LICENSE](./LICENSE) for the full text.

##Documentation for SDK

You can find the documentation on our help [site.](https://help.rallydev.com/apps/2.0/doc/)
