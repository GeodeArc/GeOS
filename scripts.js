// disable right click
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

// window drag/z index logic
// most of the heavy lifting below
// https://www.w3schools.com/howto/howto_js_draggable.asp
const windowStack = [];
document.querySelectorAll(".window").forEach(dragElement);

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const titlebar = elmnt.querySelector(".window-titlebar");

  if (titlebar) {
    titlebar.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    let newTop = elmnt.offsetTop - pos2;
    let newLeft = elmnt.offsetLeft - pos1;

    elmnt.style.top = newTop + "px";
    elmnt.style.left = newLeft + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// if the screen is resized
window.addEventListener('resize', () => {
    document.querySelectorAll(".window").forEach(win => {
        const maxLeft = window.innerWidth - win.offsetWidth;
        const maxTop = window.innerHeight - win.offsetHeight;

        let currentTop = win.offsetTop;
        let currentLeft = win.offsetLeft;

        if (currentTop > maxTop) win.style.top = Math.max(0, maxTop) + "px";
        if (currentLeft > maxLeft) win.style.left = Math.max(0, maxLeft) + "px";
    });
});

// set window z index
function focusWindow(win) {
    const index = windowStack.indexOf(win);
    if (index !== -1) {
        windowStack.splice(index, 1);
    }
    windowStack.push(win);

    windowStack.forEach((w, i) => {
        w.style.zIndex = 10 + i;
    });
}
document.querySelectorAll(".window").forEach(win => {
    windowStack.push(win);
    win.addEventListener("mousedown", () => {
        focusWindow(win);
    });

});

// close btn func
document.querySelectorAll(".titlebar-close").forEach(btn => {
    btn.addEventListener("click", () => {
        const win = btn.closest(".window");
        win.style.display = "none";
    });
});

// open matching app id from taskbar
// probably many better ways to do this idc
document.querySelectorAll("[id^='launch']").forEach(launcher => {
    launcher.addEventListener("click", () => {
        const num = launcher.id.replace("launch", "");
        const win = document.getElementById("win" + num);

        win.style.display = "block";
        focusWindow(win);
    });
});