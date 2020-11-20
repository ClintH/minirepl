declare class Repl {
    activated: boolean;
    stack: Array<string>;
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
    static create(list: NodeListOf<HTMLElement>): void;
    /**
     * Creates an instance of Repl.
     * @param {HTMLElement} el Element to convert into a REPL
     * @param {boolean} showMenu If true (default) a menu button will show in top left corner when activated
     * @memberof Repl
     */
    constructor(el: HTMLElement, showMenu?: boolean);
    reset(): void;
    /**
     * REPL input
     *
     * @param {string} text
     * @memberof Repl
     */
    input(text: string): void;
    result(r: string, isError?: boolean): void;
    activate(): void;
    focusPrompt(): void;
    createPrompt(): void;
    destroyPrompt(leaveContents?: boolean): void;
    deactivate(): void;
}
export { Repl };
