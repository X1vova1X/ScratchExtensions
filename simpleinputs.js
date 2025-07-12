class SimpleInputs {
    constructor(runtime) {
        this.runtime = runtime;
        this.areas = {};
        this.multipleLines = {};
        this.defaultWidth = 200;
        this.defaultHeight = 30;
        this.unfocusOnSubmit = {};

        // For hat block triggers
        this._pendingTriggers = {};
        this._setupGlobal();
        this._focusTriggers = {};
        this._unfocusTriggers = {};

        window.addEventListener('resize', () => this.layoutAll());
        document.addEventListener('fullscreenchange', () => this.layoutAll());
        setInterval(() => this.layoutAll(), 300);
    }

    _setupGlobal() {
        setInterval(() => {
            for (const id in this._pendingTriggers) {
                this._pendingTriggers[id] = false;
            }
        }, 50);
    }

    getStageNode() {
        let stage = document.querySelector('.stage_stage_1fD7k');
        if (stage) return stage;
        stage = document.querySelector('[data-testid="stage-container"]');
        if (stage) return stage;
        let canvas = document.querySelector('canvas');
        if (canvas && canvas.parentElement) return canvas.parentElement;
        return null;
    }

    getStageRect() {
        const stage = this.getStageNode();
        if (!stage) return {left:0,top:0,width:480,height:360};
        return stage.getBoundingClientRect();
    }

    getInfo() {
        return {
            id: 'simpleinputs',
            name: 'SimpleInputs',
            color1: '#51bbee',
            color2: '#3b94c9',
            color3: '#2e6fa3',
            blocks: [
                {
                    opcode: 'hatOnSubmit',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when [ID] has been submitted',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'hatOnFocus',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when [ID] focused',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'hatOnUnfocus',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when [ID] unfocused',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'trueBlock',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'true'
                },
                {
                    opcode: 'falseBlock',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'false'
                },
                {
                    opcode: 'createArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'deleteArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'scaleArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'scale typing area [ID] to [W] x [H] pixels',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
                        H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 }
                    }
                },
                {
                    opcode: 'moveArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'move typing area [ID] to stage X: [X] Y: [Y]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                    }
                },
                {
                    opcode: 'setParam',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set [PARAM] of typing area [ID] to [VALUE]',
                    arguments: {
                        PARAM: { type: Scratch.ArgumentType.STRING, menu: 'paramMenu' },
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'true' }
                    }
                },
                {
                    opcode: 'showArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'show typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'hideArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'hide typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'setValue',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set value of typing area [ID] to [VALUE]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                    }
                },
                {
                    opcode: 'getValue',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'value of typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'lengthOfArea',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'length of typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'setPlaceholder',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set placeholder of typing area [ID] to [VALUE]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Type here...' }
                    }
                },
                {
                    opcode: 'focusArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'focus typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'unfocusArea',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'unfocus typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'selectAllText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'select all text in typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'unselectAll',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'unselect all text in typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'isFocused',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'typing area [ID] is focused?',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'areaExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'typing area [ID] exists?',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
                {
                    opcode: 'selectWords',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'select [WHICH] word(s) in [ID] that [COMPARE] [VALUE]',
                    arguments: {
                        WHICH: { type: Scratch.ArgumentType.STRING, menu: 'whichWordMenu' },
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        COMPARE: { type: Scratch.ArgumentType.STRING, menu: 'compareMenu' },
                        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                    }
                },
                {
                    opcode: 'unselectWords',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'unselect [WHICH] word(s) in [ID] that [COMPARE] [VALUE]',
                    arguments: {
                        WHICH: { type: Scratch.ArgumentType.STRING, menu: 'whichWordMenu' },
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                        COMPARE: { type: Scratch.ArgumentType.STRING, menu: 'compareMenu' },
                        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                    }
                },
                {
                    opcode: 'selectWordAtCursor',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'select word at cursor position in typing area [ID]',
                    arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' } }
                },
            ],
            menus: {
                paramMenu: {
                    acceptReporters: true,
                    items: [
                        { text: 'multiple lines', value: 'multiple' },
                        { text: 'css styles', value: 'css' },
                        { text: 'max characters', value: 'maxlength' },
                        { text: 'read only', value: 'readonly' },
                        { text: 'disabled', value: 'disabled' },
                        { text: 'font size', value: 'fontsize' },
                        { text: 'text color', value: 'textcolor' },
                        { text: 'background color', value: 'bgcolor' },
                        { text: 'border radius', value: 'borderradius' },
                        { text: 'border color', value: 'bordercolor' },
                        { text: 'align', value: 'align' },
                        { text: 'unfocus on submit', value: 'unfocus' }
                    ]
                },
                whichWordMenu: {
                    acceptReporters: true,
                    items: [
                        { text: 'first word', value: 'first' },
                        { text: 'last word', value: 'last' }
                    ]
                },
                compareMenu: {
                    acceptReporters: true,
                    items: [
                        { text: 'contains', value: 'contains' },
                        { text: 'equals to', value: 'equals' }
                    ]
                },
            }
        };
    }

    hatOnSubmit(args) {
        const id = args.ID;
        return !!this._pendingTriggers[id];
    }

    createArea(args) {
        const id = args.ID;
        if (this.areas[id]) this.deleteArea({ID: id});
        const multi = this.multipleLines[id] || false;
        let el;
        if (multi) {
            el = document.createElement('textarea');
            el.style.resize = 'none';
        } else {
            el = document.createElement('input');
            el.type = 'text';
        }
        el.id = 'simpleinput-' + id;
        el.dataset.simpleinput = id;
        el.style.position = 'absolute';
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.width = this.defaultWidth + 'px';
        el.style.height = this.defaultHeight + 'px';
        el.style.zIndex = 20;
        el.style.fontSize = '16px';
        el.style.fontFamily = 'Arial, sans-serif';
        el.style.background = 'white';
        el.style.border = '1px solid #888';
        el.style.outline = 'none';
        el.style.padding = '4px';
        el.spellcheck = false;
        el.autocomplete = "off";
        el.tabIndex = 0;
        el.addEventListener('focus', () => {
            this._focusTriggers[id] = true;
        });
        el.addEventListener('blur', () => {
            this._unfocusTriggers[id] = true;
        });

        // Add onkeydown for submission
        el.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                // For single line: always trigger.
                // For multi-line: only trigger if not Shift or Ctrl.
                if (!multi || (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey)) {
                    this._pendingTriggers[id] = true;
                    // Prevent newline in textarea
                    if (multi) event.preventDefault();
                    // Unfocus on submit if set
                    if (this.unfocusOnSubmit[id]) {
                        setTimeout(() => el.blur(), 10);
                    }
                }
            }
        });
        const stage = this.getStageNode();
        if (!stage) return;
        stage.appendChild(el);
        this.areas[id] = el;
        this.layoutArea(id);
    }

    scaleArea(args) {
        const id = args.ID;
        const w = args.W;
        const h = args.H;
        const el = this.areas[id];
        if (!el) return;
        el.style.width = w + 'px';
        el.style.height = h + 'px';
    }

    moveArea(args) {
        const id = args.ID;
        const x = args.X;
        const y = args.Y;
        if (!this.areas[id]) return;
        this.areas[id].dataset.stageX = x;
        this.areas[id].dataset.stageY = y;
        this.layoutArea(id);
    }

    setParam(args) {
        const id = args.ID;
        const param = args.PARAM;
        const value = args.VALUE;
        const el = this.areas[id];
        if (param === 'multiple') {
            this.multipleLines[id] = (value === 'true' || value === true || value === 1 || value === '1');
            if (el) {
                const oldVal = el.value;
                const pos = {
                    x: el.dataset.stageX || 0,
                    y: el.dataset.stageY || 0,
                    width: el.style.width,
                    height: el.style.height,
                    display: el.style.display,
                    placeholder: el.placeholder
                };
                this.deleteArea({ID: id});
                this.createArea({ID: id});
                this.areas[id].dataset.stageX = pos.x;
                this.areas[id].dataset.stageY = pos.y;
                this.areas[id].style.width = pos.width;
                this.areas[id].style.height = pos.height;
                this.areas[id].style.display = pos.display;
                this.areas[id].placeholder = pos.placeholder;
                this.areas[id].value = oldVal;
                this.layoutArea(id);
            }
        } else if (param === 'css') {
            if (!el) return;
            if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
                fetch(value)
                .then(response => response.text())
                .then(css => {
                    el.style.cssText += css;
                });
            } else {
                el.style.cssText += value;
            }
        } else if (param === 'maxlength') {
            if (!el) return;
            el.maxLength = parseInt(value) || '';
        } else if (param === 'readonly') {
            if (!el) return;
            el.readOnly = (value === 'true' || value === true || value === 1 || value === '1');
        } else if (param === 'disabled') {
            if (!el) return;
            el.disabled = (value === 'true' || value === true || value === 1 || value === '1');
        } else if (param === 'fontsize') {
            if (!el) return;
            el.style.fontSize = value;
        } else if (param === 'textcolor') {
            if (!el) return;
            el.style.color = value;
        } else if (param === 'bgcolor') {
            if (!el) return;
            el.style.background = value;
        } else if (param === 'borderradius') {
            if (!el) return;
            el.style.borderRadius = value;
        } else if (param === 'bordercolor') {
            if (!el) return;
            el.style.borderColor = value;
        } else if (param === 'align') {
            if (!el) return;
            el.style.textAlign = value;
        } else if (param === 'unfocus') {
            this.unfocusOnSubmit[id] = (value === 'true' || value === true || value === 1 || value === '1');
        }
    }

    deleteArea(args) {
        const id = args.ID;
        if (this.areas[id]) {
            this.areas[id].remove();
            delete this.areas[id];
        }
    }

    setValue(args) {
        const id = args.ID;
        const value = args.VALUE;
        if (this.areas[id]) {
            this.areas[id].value = value;
        }
    }

    getValue(args) {
        const id = args.ID;
        if (this.areas[id]) {
            return this.areas[id].value;
        }
        return '';
    }

    showArea(args) {
        const id = args.ID;
        if (this.areas[id]) {
            this.areas[id].style.display = '';
        }
    }

    hideArea(args) {
        const id = args.ID;
        if (this.areas[id]) {
            this.areas[id].style.display = 'none';
        }
    }

    setPlaceholder(args) {
        const id = args.ID;
        const value = args.VALUE;
        if (this.areas[id]) {
            this.areas[id].placeholder = value;
        }
    }

    focusArea(args) {
        const id = args.ID;
        if (this.areas[id]) {
            this.areas[id].focus();
        }
    }

    selectAllText(args) {
        const id = args.ID;
        if (this.areas[id]) {
            this.areas[id].select();
        }
    }

    isFocused(args) {
        const id = args.ID;
        if (this.areas[id]) {
            return document.activeElement === this.areas[id];
        }
        return false;
    }

    lengthOfArea(args) {
        const id = args.ID;
        if (this.areas[id]) {
            return this.areas[id].value.length;
        }
        return 0;
    }

    areaExists(args) {
        const id = args.ID;
        return !!this.areas[id];
    }

    trueBlock() { return true; }
    falseBlock() { return false; }

    layoutAll() {
        for (let id in this.areas) {
            this.layoutArea(id);
        }
    }

    layoutArea(id) {
        const el = this.areas[id];
        if (!el) return;
        const stage = this.getStageNode();
        if (!stage) return;
        const stageRect = stage.getBoundingClientRect();
        const sx = Number(el.dataset.stageX) || 0;
        const sy = Number(el.dataset.stageY) || 0;
        const px = Math.round(stageRect.width * (sx + 240) / 480);
        const py = Math.round(stageRect.height * (180 - sy) / 360);
        el.style.left = px + 'px';
        el.style.top = py + 'px';
        el.style.transformOrigin = 'top left';
        el.style.transform = `scale(${stageRect.width/480},${stageRect.height/360})`;
        const isFullScreen = document.fullscreenElement && stage.contains(document.fullscreenElement);
        const isStageVisible = stage.offsetParent !== null;
        if (!isStageVisible || isFullScreen) {
            el.style.visibility = 'hidden';
        } else {
            el.style.visibility = '';
        }
    }

    unfocusArea(args) {
        const id = args.ID;
        if (this.areas[id]) {
            this.areas[id].blur();
        }
    }

    unselectAll(args) {
        const id = args.ID;
        const el = this.areas[id];
        if (el) {
            // Collapse selection to cursor
            if (typeof el.selectionStart === 'number') {
                el.selectionEnd = el.selectionStart;
            }
        }
    }

    // Helper to select words
    _selectWordsHelper(el, which, compare, value, doSelect=true) {
        if (!el) return;
        // Split words, keep positions
        const text = el.value;
        const re = /\b\w+\b/g; // crude word match: you may refine
        let match, words = [];
        while ((match = re.exec(text)) !== null) {
            words.push({
                word: match[0],
                start: match.index,
                end: re.lastIndex
            });
        }
        // Filter by compare
        let indices = [];
        for (let i=0; i<words.length; ++i) {
            if (compare === 'contains' && words[i].word.includes(value)) indices.push(i);
            if (compare === 'equals' && words[i].word === value) indices.push(i);
        }
        // Which words
        let targets = [];
        if (which === 'all') targets = indices;
        if (which === 'first' && indices.length) targets = [indices[0]];
        if (which === 'last' && indices.length) targets = [indices[indices.length-1]];
        // Select or unselect
        if (targets.length === 0) return;
        if (doSelect) {
            // For simplicity, select from start of first to end of last target
            const selStart = words[targets[0]].start;
            const selEnd = words[targets[targets.length-1]].end;
            el.focus();
            el.setSelectionRange(selStart, selEnd);
        } else {
            // Unselect: collapse selection to start
            el.setSelectionRange(words[targets[0]].start, words[targets[0]].start);
        }
    }

    selectWords(args) {
        const id = args.ID, which = args.WHICH, compare = args.COMPARE, value = args.VALUE;
        const el = this.areas[id];
        this._selectWordsHelper(el, which, compare, value, true);
    }

    unselectWords(args) {
        const id = args.ID, which = args.WHICH, compare = args.COMPARE, value = args.VALUE;
        const el = this.areas[id];
        this._selectWordsHelper(el, which, compare, value, false);
    }

    // Select word at cursor
    selectWordAtCursor(args) {
        const id = args.ID;
        const el = this.areas[id];
        if (!el) return;
        const pos = el.selectionStart;
        const text = el.value;
        // Find word boundaries
        const left = text.slice(0, pos).search(/\b\w+$/);
        const right = text.slice(pos).search(/\W/);
        const start = left >= 0 ? left : 0;
        const end = right >= 0 ? pos + right : text.length;
        el.setSelectionRange(start, end);
    }
    // Hat: when focused
    hatOnFocus(args) {
        const id = args.ID;
        if (this._focusTriggers[id]) {
            this._focusTriggers[id] = false;
            return true;
        }
        return false;
    }

    // Hat: when unfocused
    hatOnUnfocus(args) {
        const id = args.ID;
        if (this._unfocusTriggers[id]) {
            this._unfocusTriggers[id] = false;
            return true;
        }
        return false;
    }
}

Scratch.extensions.register(new SimpleInputs());
