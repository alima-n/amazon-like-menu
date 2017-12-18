'use strict';

function Menu(data, obj) {

    const {menuBtnClass, menuClass, itemClass, activeItemClass, submenuClass, delay, target} = obj;

    function createMenu(){
        const menuBtn = document.querySelector('.' + menuBtnClass);
        const ul = document.createElement('ul');
        ul.classList.add(menuClass);

        Object.keys(data).forEach( (key) => {
            let li = document.createElement('li');
            li.classList.add(itemClass);
            li.textContent = key;
            ul.append(li);
            let subMenu = document.createElement('ul');
            subMenu.classList.add(submenuClass);

            data[key].forEach( (item) => {
                let submenuItem = document.createElement('li');
                submenuItem.textContent = item;
                subMenu.append(submenuItem);
            });

            li.append(subMenu);
        });
        document.querySelector('.' + target).append(ul);
        menuBtn.onclick = () => ul.classList.toggle('hidden');
    };

    createMenu();

    const menu = document.getElementsByClassName(menuClass)[0];
    const [...menuItems] = [].slice.apply(document.getElementsByClassName(itemClass));

    let activeMenuItem = false, timeoutId = false;

    let y = menu.getBoundingClientRect().top + document.documentElement.scrollTop,
        x = menu.getBoundingClientRect().left;

    let topRightMenuCorner = {x: x + menu.clientWidth, y: y},
        bottomRightMenuCorner = {x: topRightMenuCorner.x, y: y + menu.clientWidth},
        previousPos = 0, currentPos  = 0, storedCoords = 0;

    document.body.addEventListener('mousemove', trackMouseCoords);

    menuItems.forEach( (item) => {
        item.addEventListener('click', activateMenuInstantly);
        item.addEventListener('mouseenter', () => activateMenuWithDelay(item));
    } );

    menu.addEventListener('mouseleave', deactivateMenuInstantly);

    function trackMouseCoords(e) {
        previousPos = currentPos;
        currentPos  = {x: e.pageX, y: e.pageY};
    }

    function getSlope(pos1, pos2) {
        return (pos2.y - pos1.y) / (pos2.x - pos1.x);
    }

    function shouldActivateMenu() {
        if ( getSlope(currentPos, topRightMenuCorner) > getSlope(previousPos, topRightMenuCorner) 
            || getSlope(previousPos, bottomRightMenuCorner) > getSlope(currentPos, bottomRightMenuCorner) || 
            (storedCoords && currentPos.x === storedCoords.x && currentPos.y === storedCoords.y) 
        ) {
            return true;
        } else {
            storedCoords = currentPos;
            return false;
        }
    }

    function activateMenuWithDelay(item) {
        clearTimeout(timeoutId);
        if ( shouldActivateMenu() ) {
            if ( (item !== activeMenuItem && activeMenuItem) ){
                activeMenuItem.classList.remove(activeItemClass);
                activeMenuItem = false;
            }
            item.classList.add(activeItemClass);
            activeMenuItem = item;
        }
        timeoutId = setTimeout(() => activateMenuWithDelay(item), delay);
    }

    function activateMenuInstantly() {
        clearTimeout(timeoutId);
        if ( this !== activeMenuItem ){
            activeMenuItem.classList.remove(activeItemClass);
            activeMenuItem = false;
            this.classList.add(activeItemClass);
            activeMenuItem = this;
        } else { 
            return 
        }
    }

    function deactivateMenuInstantly() {
        if (activeMenuItem) {
            clearTimeout(timeoutId);
            activeMenuItem.classList.remove(activeItemClass);
            activeMenuItem = false;
        }
    }
}