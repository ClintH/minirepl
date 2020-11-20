# minirepl

![Demo](demo.gif)

A mini Javascript REPL. Converts one-liner snippets into runnable code. 

The purpose is to enliven tutorials/manual pages and allow small experimentation. The HTML content remains semantically pure, and degrades gracefully.

Mini REPL is meant to be extremely simple and lightweight, so it only supports simple variable declaration (via `var/let/const`), math and function invocations. Anything more complex than that would probably fail.

See the [demo source](demo/index.html)

# Usage

## In HTML

In your HTML, pre-define the sample (and results even) as so:

```
  <!-- Use class 'repl' to pick up default styling -->
  <code class="repl">
    <!--
      Repl can have some preset code and results:
    -->
    <kbd>1 + 1</kbd>
    <samp>2</samp>
  </code>
```

* Use the `repl` class for the `<CODE>` block to pick up the styling provided by `repl.css`. Or style yourself.
* Use `<KBD>` to show what the user would have typed
* Use `<SAMP>` to show what the system response would be

## In Javascript

The following snippets show how to initialise a mini REPL. Each instance is associated with a element.

```
<script type="module">
  import { Repl } from "../build/index.js"
  // Create a repl for a single element:
  //const r = new Repl(document.querySelector('code'));

  // Create a repl for all matching elements:
  Repl.create(document.querySelectorAll('code.repl'));
</script>
```

A REPL instance has a few basic commands if needed:

```
r.reset();       // Reset contents, remove prompt and deactivating
r.activate();    // Activate REPL, creating a prompt
r.input(string); // Sends some input to the REPL, as if the user typed it and hit enter
```

# Interaction

User clicks on the box to create a prompt. They can type and hit ENTER, and whatever they have typed is evaluated. Reponses or errors are appended. Hitting ESC will clear the currently typed line. Clicking away from the REPL will remove the prompt if it's empty.

A little button will appear in the top-left of the REPL to reset it back to its original contents. This can be withheld by setting `showMenu` to FALSE in the constructor:

```
const r = new Repl(document.querySelector('code'), false);
```

# REPL execution

Code is executed as a new function, with 'use strict' enabled. This means that variables defined or accessed are within the scope of just that function. 

Don't use mini REPL if there is a sensitive execution context. That said, it's no more dangerous than the user popping open the console and typing there.

In order to demonstrate defining and manipulating variables, mini REPL will special-case lines that begin with `let`, `const` or `var`. These lines are pushed to a stack and replayed before subsequent REPL code. 

It's all very simple, so don't expect compound lines of code to run.  It prefixes whatever is typed in with `return `, so something like `for (var i=0;i<10;i++) { console.log(i) }` won't work, because it becomes `return for (var i=0;i<10;i++) { console.log(i) }`. It also doesn't capture the console output.
