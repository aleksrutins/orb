
    <div id='banner'>
      <img src="Logo.svg" width='200' height='200' />
      <ul id='nav'>
        <li><a>Home</a></li>
        <li><a href='./embedding-guide'>Embedding Guide</a></li>
        <li><a href='./language-ref'>Language Reference</a></li>
      </ul>
      <div style='background-color: rgba(255, 0, 0, 0.4)'>
        Warning: Orb <u>does not</u> work on any Microsoft browsers or Safari.
      </div>
    </div>
    <orb-edit name="myEdit">f(x) = x+1
print f(5)</orb-edit>
    <button id='runBtn'>Run Code</button>
    <div id='log'>
<h2>Welcome to Orb!</h2>
<img src="Logo.svg" alt="Orb" height="100" width="100" style='color: white' />
See the <a href='language-ref'>Language Reference</a> for more information.
Type code in the code area above and click 'Run Code' to get started!
------------------------------------------------------------------------------------------------------------------------------------
<div id='innerLog'></div>
    </div>
    <button id='clearBtn'>Clear Log</button>
    <script>
      var runBtn = document.getElementById('runBtn')
        , clearBtn = document.getElementById('clearBtn')
        , logger = {
          log: function(message) {
            document.getElementById('innerLog').innerHTML += (message + '\n');
          }
        }
        , editor = new orb.editor.Editor('myEdit', logger);
      runBtn.addEventListener('click', () => {
        editor.run();
      });
      clearBtn.addEventListener('click', () => {
        document.getElementById('innerLog').innerHTML = '';
      });
    </script>
