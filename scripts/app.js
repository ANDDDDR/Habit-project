'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;
// page
const page = {
	menu: document.querySelector('.menu__list'),
	header:{
		h1: document.querySelector('.header__name'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover__bar')
	},
	content:{
		mainDays: document.querySelector('.days'),
		mainDaysAdd: document.querySelector('.habbit__day_add')
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
	page.header.h1.innerText = activeHabbit.name;
	const progress = activeHabbit.days.length/activeHabbit.target > 1
	? 100
	: activeHabbit.days.length/activeHabbit.target*100;
	page.header.progressPercent.innerHTML = `${progress.toFixed(0)}%`;
	page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
}

function renderContent(activeHabbit){
	page.content.mainDays.innerHTML = "";
	for( const dayIndex in activeHabbit.days){
		const element = document.createElement('div');
		element.classList.add('habbit');
		element.innerHTML = `<div class="habbit__day">День ${+dayIndex+1}</div>
						<div class="habbit__comment">${activeHabbit.days[dayIndex].comment}</div>
						<button class="habbit__delete" onclick="deleteDay(${dayIndex})">
							<img src="./images/delete.svg" alt="Удалить день">
						</button>`;
		page.content.mainDays.appendChild(element);
	}
	page.content.mainDaysAdd.querySelector('.habbit__day').innerHTML = `День ${activeHabbit.days.length+1}`;
}

function rerender(activeHabbitId){
	globalActiveHabbitId = activeHabbitId;
	const activeHabbit = habbits.find(habbit=>habbit.id === activeHabbitId);
	if(!activeHabbit){
		return;
	}
	renderMenu(activeHabbit);
	renderHead(activeHabbit);
	renderContent(activeHabbit);
}

// work with days
function deleteDay(dayIndex){
	habbits = habbits.map(habbit => {
		if(habbit.id === globalActiveHabbitId){
			habbit.days.splice(dayIndex,1);
			// return{
			// 	...habbit,
			// 	days: habbit.days
			// }
		}
		return habbit;
	})
	saveData();
	rerender(globalActiveHabbitId);
}

function addDays(event){
	event.preventDefault();
	const form = event.target;
	const data = new FormData(form);
	const comment = data.get('comment');
	if(!comment){
		form['comment'].classList.add('error');
	}
	else{
		form['comment'].classList.remove('error');
	}
	habbits = habbits.map(habbit => {
		if(habbit.id === globalActiveHabbitId){
			habbit.days.push({comment});
			// return{
			// 	...habbit,
			// 	days: habbit.days.concat([{comment}])
			// }
		}
		return habbit;
	})
	saveData();
	rerender(globalActiveHabbitId);
	form['comment'].value = "";
}

// init
(()=>{
	loadData();
	rerender(habbits[0].id);
})()