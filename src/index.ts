class Repl {
  activated = false;
  stack: Array<string> = [];
  contents: string;
  showMenu: boolean;

  prompt: HTMLElement | undefined;
  menu: HTMLElement | undefined;
  el: HTMLElement;

  /**
   *
   * Creates Repl instances for elements in a list
   * @static
   * @param {NodeList} list
   * @memberof Repl
   */
  static create(list: NodeListOf<HTMLElement>) {
    list.forEach(e => new Repl(e));
  }

  /**
   * Creates an instance of Repl.
   * @param {HTMLElement} el Element to convert into a REPL
   * @param {boolean} showMenu If true (default) a menu button will show in top left corner when activated
   * @memberof Repl
   */
  constructor(el: HTMLElement, showMenu = true) {
    this.el = el;
    this.contents = el.innerHTML;
    this.showMenu = true;
    let dragging = false;
    this.el.onpointerdown = () => {
      dragging = false;
    }
    this.el.onpointermove = () => {
      dragging = true;
    }
    this.el.onpointerup = () => {
      if (!dragging) {
        this.activate();
      }
      dragging = false;
    }
  }

  reset() {
    this.deactivate();
    this.el.innerHTML = this.contents;
    this.stack = [];
    this.el.classList.remove('repl-changed');

  }

  /**
   * REPL input
   *
   * @param {string} text
   * @memberof Repl
   */
  input(text: string) {
    let js = '"use strict";';
    js += this.stack.join(' ');
    let replay = false;

    if (!text.endsWith(';')) text += ';';

    if (text.startsWith('let ') || text.startsWith('var ') || text.startsWith('const ')) {
      replay = true;
    } else {
      text = 'return ' + text;
    }
    js = js + text;

    //console.log('Processing ', text);
    try {
      let f = new Function(js);
      const r = f();
      if (replay) this.stack.push(text);
      this.result(r, false);
    } catch (e) {
      this.result(e.toString(), true);
    }
    this.el.classList.add('repl-changed');

  }

  result(r: string, isError = false) {
    const s = document.createElement('samp');
    s.innerText = r;
    if (isError) s.classList.add('repl-error');
    this.el.appendChild(s);

    this.createPrompt();
  }

  activate() {
    if (this.activated) {
      if (this.prompt) this.focusPrompt();
      return;
    }
    this.activated = true;
    this.el.classList.add('repl-activated');
    this.createPrompt();

    // Add menu (well, just a reset button for now)
    if (this.showMenu) {
      let m = document.createElement('button');
      m.innerText = '🔄';
      m.title = 'Reset';
      m.onpointerdown = () => this.reset();
      this.el.prepend(m);
      this.menu = m;
    }
  }

  focusPrompt() {
    // TODO: Put cursor at end of line
    const p = this.prompt;
    if (p === undefined) return;
    p.focus();
  }

  createPrompt() {
    if (this.prompt) return;

    const p = document.createElement('kbd');
    p.contentEditable = 'true';
    p.className = 'repl-prompt repl-activated';
    p.onkeyup = e => {
      if (e.code == "NumpadEnter" || e.code == "Enter") {
        e.cancelBubble = true;
        p.innerText = p.innerText.trim();
        setTimeout(() => this.input(p.innerText.trim()), 100);
        this.destroyPrompt(true);
      } else if (e.code == 'Escape') {
        p.innerText = '';
      }
    };
    p.onblur = () => {
      if (p.innerText.trim().length == 0) {
        // Nothing written, so deactivate, removing prompt
        this.deactivate();
      }
    }
    this.el.appendChild(p);
    this.prompt = p;
    this.focusPrompt();
  }

  destroyPrompt(leaveContents = false) {
    const p = this.prompt;
    if (p === undefined) return;
    p.onkeyup = null;
    p.onblur = null;
    if (leaveContents) {
      p.contentEditable = 'false';
      p.classList.remove('repl-activated');
    } else {
      p.remove();
    }
    this.prompt = undefined;
  }

  deactivate() {
    if (!this.activated) return;
    this.activated = false;
    this.el.classList.remove('repl-activated');
    this.destroyPrompt();
    let m = this.menu;
    if (m) {
      m.onpointerdown = null;
      m.remove();
    }
    this.menu = undefined;
  }
}
export { Repl };