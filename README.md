# DESQChess 
## V0.1.0 (beta 1) - 2018
## Simple chess app jQuery Plugin - HTML5/CSS3/jQuery/jQueryUI

DesqChess is a chess app that functions as a physical chess board at its core. It allows just about any move (as a real chess board does) so counts on players being physically present and well-behaved. An example would be pulling it up on a tablet in place of an actual chess board - it is touch-screen compatible thanks to the jQuery UI add-on touch-punch.

A working demo page is included as [demo.html](https://peterjtracey.github.io/desqchess/demo.html "Minimal Demo of JQuery DESQChess")

All though the foundation has this simple goal, with the design being a very simple jQuery plugin it can be modified relatively easily to add multiplayer across network functionality, AI computer players, display and animation of the game UI with WebGL and so on. 

One critical piece missing for a 1.0 release is taking back of moves that involve captures. Also pawn promotion is a must. These will be added before the end of the year.

Other ideas for the short-term are a move list with undo/redo capabilities, events and methods to make tying into more sophisticated systems simpler, and an animation UI middle layer. Any other desired additions are welcome either as contributions or suggestions in the issue tracker.

## Change log:
Version 0.0.4: Close to drawing a chess board.
Version 0.0.6: Draws boards, background, buttons to start, pieces
Version 0.0.8: Moving pieces works in a rudimentary way (moving a piece again fails)
Version 0.0.9: Moving works. Ready to add move rules, move AI.

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
Credits for the background images are included in a notes.txt file in that directory.

--------------------
Project Page:

https://github.com/peterjtracey/desqchess

(Originally open-sourced on sourceforge 2014
https://sourceforge.net/projects/desqchess3/)