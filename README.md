# DESQChess 
## V0.1.0 (beta 1) - 2018
## Simple chess app jQuery Plugin - HTML5/CSS3/jQuery/jQueryUI

### Update 1/21/2019 - beta 2 is here and beta 3 is coming this week. Beta 2 has more functionality in the core plugin, but 3 will include a new advanced version these were needed for that has far more functionality and will be the basis for the 1.0 release. It includes undo/redo, zoom by buttons (zoom on mobile becomes difficult when there are many pieces: finding an open area to two-finger zoom becomes a problem), multiplayer mode for games across the Internet, and many more features. Watch the project to be alerted on these releases. The official 1.0 should be next week or early February - depends on the amount of revision needed in beta 2.

DesqChess is a chess app that functions as a physical chess board at its core. It allows just about any move (as a real chess board does) so counts on players being physically present and well-behaved. An example would be pulling it up on a tablet in place of an actual chess board - it is touch-screen compatible thanks to the jQuery UI add-on touch-punch.

A working demo page is included as [demo.html](https://peterjtracey.github.io/desqchess/demo.html "Minimal Demo of JQuery DESQChess")

All though the foundation has this simple goal, with the design being a very simple jQuery plugin it can be modified relatively easily to add multiplayer across network functionality, AI computer players, display and animation of the game UI with WebGL and so on. 

With the release of beta 1 (0.1.0) testing of features that make the plugin functionally complete is starting and a 1.0 will be released after any issues are resolved. Sorely lacking and needed for a 1.0 release, also, are sounds when moves happen and a move history list (may just be required to implement events via the API as with game saving/restoring).

Other ideas for the short-term are a move list with undo/redo capabilities, events and methods to make tying into more sophisticated systems simpler, and an animation UI middle layer. Any other desired additions are welcome either as contributions or suggestions in the issue tracker.

## Change log:
Version 0.0.4: Close to drawing a chess board.
Version 0.0.6: Draws boards, background, buttons to start, pieces
Version 0.0.8: Moving pieces works in a rudimentary way (moving a piece again fails)
Version 0.0.9: Moving works. Ready to add move rules, move AI.
Version 0.1.0: Beta 1! Now supports taking back moves of captured pieces, pawn promotion (drag any piece to a pawn on last row) and saving/restoring game data (needs to be used from APIish calls) -- see [https://askus.chat/chess](https://askus.chat/chess "Multiplayer Chess") for example of multiplayer chess from a web page utilizing these calls -- documentation rather than just examples to come

--------------------
LGPL - 2014
--------------------
Dependancies:
- jQuery
- jQuery UI
- jQuery UI Touch Punch (touchscreen moving of pieces)

--------------------
This software is free software, a copy of the lgpl v3 license can be found in LICENSE
--------------------
Credits:
Original Author: Peter Tracey
Contributors:
(contributors welcome!)
Credits for the background images and piece icons are included in a notes.txt files in those paths.

--------------------
Project Page:

https://github.com/peterjtracey/desqchess

# Find a game! 
## Play against opponents across the Internet with an app based on this project:
[https://desqchess.club](https://desqchess.club "Multiplayer Chess")

(Originally open-sourced on sourceforge 2014
https://sourceforge.net/projects/desqchess3/)