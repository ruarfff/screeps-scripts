# Screeps Scripts

Not really for others to use but this is how to set it up. This really only works if you're using the screeps desktop app.

Locally, go to the location where the screeps scripts are kept. If using screeps for steam there's be an open local folder button. On Mac it's `~/Library/Application Support/Screeps/scripts`

Checkout this repo to that location. The build script output to sreeps.com/default so you'd have to remove whatever is in there.

`yarn build` to convert typescript to js so the game can use it.

You could also just put this repo anywhere and have the build target the scrip directory from there too.
