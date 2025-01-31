'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
// page
const page = {
	menu: document.querySelector('.menu__list'),
	header:{
		h1: document.querySelector('.header__name'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover__bar')
	}
};
// data
function loadData(){
	const habbitString = localStorage.getItem(HABBIT_KEY);
	const habbitArray = JSON.parse(habbitString);
	if (Array.isArray(habbitArray)){
		habbits = habbitArray;
	}
}

function saveData(){
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}
// render
function renderMenu(activeHabbit){
	if(!activeHabbit){
		return;
	}
	for(const habbit of habbits){
		const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
		if(!existed){
			const element = document.createElement('button');
			element.setAttribute('menu-habbit-id', habbit.id);
			element.classList.add('menu__item');
			element.addEventListener('click', ()=> rerender(habbit.id));
			element.innerHTML = `<img src="/images/${habbit.icon}.svg" alt="${habbit.name}" >`;
			if(activeHabbit.id === habbit.id){
				element.classList.add('menu__item_active');
			}
			page.menu.appendChild(element);
			continue;
		}
		if(activeHabbit.id === habbit.id){
			existed.classList.add('menu__item_active');
		}else{
			existed.classList.remove('menu__item_active');
		}
	}
}

function renderHead(activeHabbit){
	if(!activeHabbit){
		return;
	}
	page.header.h1.innerText = activeHabbit.name;
	const progress = activeHabbit.days.length/activeHabbit.target > 1
	? 100
	: activeHabbit.days.length/activeHabbit.target*100;
	page.header.progressPercent.innerHTML = `${progress.toFixed(0)}%`;
	page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
}

function rerender(activeHabbitId){
	const activeHabbit = habbits.find(habbit=>habbit.id === activeHabbitId);
	renderMenu(activeHabbit);
	renderHead(activeHabbit);
}
// init
(()=>{
	loadData();
	rerender(habbits[0].id);
})()