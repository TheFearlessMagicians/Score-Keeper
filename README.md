# Score-Keeper
Score Keeper for 'n' people!
A nice score tracking analytics tool

## Todo:
* MAKE HTML nicer Especially the buttons and elements under the "RS" ID.
* ADD D3.JS Visualisation
* MAKE the initalForm submit when pressing Enter as well. Some Jquery/DOM stuff i haven't sorted out. If you guys do please implement it :)

## Updates:
* UPDATE (Wilson @ 20 Jan 2018): Made newScript.js which makes script.js more readable by using jquery. socket script should work to allow for real time scoring updates (regardless of DB).
* UPDATE (Wilson & Varun @ 17 Jan 2018): Made express app, using mongoose (mongodb) for database.
* UPDATE (wilson @ 15 Jan 2018): Added Jquery and CSS animations, and added incrementer buttons
* UPDATE: Realized the form can't be submitted, becuase on submit it is redirected to a different page, since we don't have another page set up, it will reload current page. This will put user back to the initial form.
