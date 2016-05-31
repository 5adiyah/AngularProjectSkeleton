**This js folder will hold any JavaScript in our app that is not part of Angular.**

- Although, keep in mind that it is very rare to have to use this folder. Usually there is a way to do whatever we need from within the app folder, within the context of Angular components, and we should use that system as much as possible.

- But if we do find that we need to include some regular JavaScript, separate from our Angular components, it can be kept in this folder and we can just add a script tag for it in index.html file as we develop. Later, if we use this folder, we can write the usual gulp JavaScript tasks to browserify if necessary, concatenate and minify our resources/js files for production, then copy the finished code into one file to be generated in our build/js folder. But this is really not needed most of the time, so we won't clutter up our foundation gulpfile with these tasks. The typescript compiler handles optimizing all our other JavaScript for our Angular app for us.
