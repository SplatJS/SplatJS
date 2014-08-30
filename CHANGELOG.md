# 2.3.0

Add Animation.rotateClockwise()/.rotateCounterclockwise() and buffer.rotateClockwise()/.rotateCounterclickwise().

# 2.2.0

Change Entity.solveCollisions() to return an array of entities that were involved in collisions.

# 2.1.0

Way better collision solving.

# 2.0.0

Implement volume control and change how mute works.

# 1.3.0

Add openUrl(). And Mouse.onmouseup.

# 1.2.0

Add optional bounding rectangle to Mouse.isPressed(). This makes the API more similar to consumePressed().

# 1.1.2

Fix iPhone/iPad detection.

# 1.1.1

Include ad sizes.

# 1.1.0

Add advertising support. Currently only uses iAd in Ejecta.

# 1.0.1

Fix mouse coordinates in Ejecta when canvas is scaled.

# 1.0.0

Convert save data to async API so it works with Chrome Apps. This is a breaking change, so respecting semver makes me bump the version to 1.0.0. :-/

# 0.1.6

Fix scaling on Ejecta. You must now specify canvas.width/height in JS instead of HTML.

# 0.1.5

Fix font loading in Firefox. It doesn't like single quotes.
