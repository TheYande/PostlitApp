const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame:false,
    icon:path.join(__dirname, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL('https://postlit.dev');

  win.webContents.on('did-finish-load', () => {
    const customBarHTML = `
      <style>
         .titlebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 25px;
          border-top: 1px solid var(--brand);
          background:rgb(14, 22, 40);
          display: flex;
          align-items: center;
          padding: 0 10px;
          z-index: 1000;
          -webkit-app-region: drag; /* Allows dragging of the window */
        }
        .titlebar .actions {
          margin-left: auto;
          display: flex;
        }
        .titlebar .actions {
          width: 30px;
          height: 30px;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
        .titlebar .actions button:hover {
          background: #555;
        }
        nav {
        margin-top: 22px;
        }

        nav > .right {
        margin-top: 25px;
        }

        body {
            border-radius: 100px;
        }

        .titlebar #logo {
            height: 15px;   
        }
       
        /* Hide scrollbar track */
/* Default scrollbar width */
::-webkit-scrollbar {
    width: 5px; /* Adjust width as needed */
}

::-webkit-scrollbar-track {
    background: transparent; /* Hide the scrollbar track */
}   

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5); /* Adjust color for the scrollbar handle */
    border-radius: 4px; /* Round the corners if desired */
    transition: width 0.2s ease; /* Smooth transition for width change */
}

/* Increase scrollbar handle width on hover */
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.9); /* Change color on hover */
    width: 8px; /* Increase width to 2x the default */
}



#maximize {
height: 17px;
width: 20px;
}
#minimize {
height: 20px;
width: 20px;
}
#close {
height: 21px;
width: 21px;
}
#maximize > * {
height: 17px;
width: 17px;
}
#minimize > * {
height: 20px;
width: 20px;
}
#close > * {
height: 21px;
width: 21px;
}

.actions {
padding-right: 40px;
display:flex;
align-items:center;
-webkit-app-region: no-drag; 
}
       
      </style>
      <div class="titlebar">
        <img id="logo" src="https://postlit.dev/assets/logo.svg"></img>
        <div class="actions">
          <div id="minimize">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-440q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h480q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H240Z"/></svg>
          </div>
          <div id="maximize">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"/></svg>
          </div>
          <div id="close">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
          </div>
        </div>
      </div>
    `;

    win.webContents.executeJavaScript(`
      document.body.insertAdjacentHTML('afterbegin', \`${customBarHTML}\`);
      document.getElementById('minimize').addEventListener('click', () => window.api.minimize());
      document.getElementById('maximize').addEventListener('click', () => window.api.toggleMaximize());
      document.getElementById('close').addEventListener('click', () => window.api.close());
    `);
  });

  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('toggle-maximize-window', () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    win.close();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
