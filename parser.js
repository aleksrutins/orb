window.orb = {
  parser: {
    Parser: class {
      constructor(editor, output = console) {
        this._editor = editor;
        this.out = output;
        this.regex = {
          asn: /(\D)\s?=\s?(.*)/,
          fdf: /(\D)\(((\D(,\s?)?)+)\)\s?=\s?([.\s\+\-\/\*\S]*)/,
          pro: /print (.*)/,
          ign: /ignore (.*)/
        };
        //this.vars = [];
        //this.funcs = {};
      }
      parse(...toch) {
        const lines = this._editor._base.innerHTML.split('\n');
        var match;
        for(let line of lines) {
          if((match = line.match(this.regex.fdf)) !== null && toch.indexOf('func') >= 0) {
            let fname = match[1],
                fp = match[2],
                fv = match[5];
            //this.out.log(`(${fp}) ${fv}`);
            window[fname] = new Function(...fp.split(/,\s?/), `return ${fv};`);
            continue;
          } else if((match = line.match(this.regex.asn)) !== null && toch.indexOf('var') >= 0) {
            let vname = match[1],
                vval  = match[2];
            window[vname] = eval(vval);
            //this.out.log(`${vname}: ${vval}`);
          } else if((match = line.match(this.regex.pro)) !== null && toch.indexOf('print') >= 0) {
            this.out.log(eval(match[1]));
          } else if((match = line.match(this.regex.ign)) !== null && toch.indexOf('ignore') >= 0) {
            eval(match[1]);
          }
        }
      }
    }
  },
  editor: {
    _registered: {},
    html: {
      OrbEditArea: class extends HTMLElement {
        connectedCallback() {
          orb.editor._registered[this.getAttribute('name')] = this;
          this.style.display = 'block';
          this.style.fontFamily = 'monospace';
          this.style.whiteSpace = 'pre';
          this.style.borderRadius = '5px';
          this.style.padding = '10px';
          this.style.border = '1px solid black';
          this.setAttribute('contenteditable', '');
          //this.addEventListener('keyup', e => {
            // TODO: add syntax highlighting
            //this.editor._base.innerHTML = this.innerHTML;
            //this.editor._update();
          //});
        }
      },
      resolve() {
        window.customElements.define('orb-edit', orb.editor.html.OrbEditArea);
      }
    },
    Editor: class {
      constructor(areaName, out = console) {
        this._parser = new orb.parser.Parser(this, out);
        this._base = orb.editor._registered[areaName];
        this._base.editor = this;
      }
      run() {
        this._base.editor = this;
        this._base.innerHTML = this._base.innerHTML.replace('<div>', '\n').replace('</div>', '');
        this._parser.parse('func', 'var', 'print');
      }
    }
  }
};
if(document.querySelector('meta[name=\'orb.autoregister\']') && document.querySelector('meta[name=\'orb.autoregister\']').getAttribute('value') === 'true') {
  orb.editor.html.resolve();
}
if(document.querySelector('meta[name=\'orb.autoedit\']') && document.querySelector('meta[name=\'orb.autoedit\']').getAttribute('value') === 'true') {
  window.onload = () => {
    for(let editname in orb.editor._registered) {
      window[editname] = new Editor(editname);
    }
  };
}