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
	},
	popup:{
		index: document.querySelector('.cover'),
		iconField: document.querySelector('.popup__form input[name="icon"]'),
		habbitName: document.querySelector('.popup__form input[name="name"]'),
		habbitTarget: document.querySelector('.popup__form input[name="target"]')
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

function resetForm(form, fields){
	for (const field of fields){
		form[field].value = '';
	}
}

function validateAndGetForm(form, fields){
	const formData = new FormData(form);
	const res = {};
	for (const field of fields){
		const fieldValue = formData.get(field);
		form[field].classList.remove('error');
		if (!fieldValue){
			form[field].classList.add('error');
		}
		res[field] = fieldValue;
	}
	let isValid = true;
	for (const field of fields){
		if (!res[field]){
			isValid = false;
		}
	}
	if (!isValid){
		return;
	}
	return res;
}
// render
function renderMenu(activeHabbit){
	page.menu.innerHTML = "";
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
	if (activeHabbit.days.length === +activeHabbit.target){
		page.content.mainDaysAdd.querySelector('.habbit__day').classList.add('hidden');
		page.content.mainDaysAdd.querySelector('.habbit__form.add').classList.add('hidden');
		page.content.mainDaysAdd.querySelector('.habbit__form.delete').classList.remove('hidden');
	}else{
		page.content.mainDaysAdd.querySelector('.habbit__day').classList.remove('hidden');
		page.content.mainDaysAdd.querySelector('.habbit__form.add').classList.remove('hidden');
		page.content.mainDaysAdd.querySelector('.habbit__form.delete').classList.add('hidden');
	}
}

function rerender(activeHabbitId){
	globalActiveHabbitId = activeHabbitId;
	const activeHabbit = habbits.find(habbit=>habbit.id === activeHabbitId);
	if(!activeHabbit){
		return;
	}
	document.location.replace(document.location.pathname + '#' + activeHabbit.name);
	renderMenu(activeHabbit);
	renderHead(activeHabbit);
	renderContent(activeHabbit);
}

// work with days
function deleteDay(dayIndex){
	habbits = habbits.map(habbit => {
		if(habbit.id === globalActiveHabbitId){
			habbit.days.splice(dayIndex,1);
		}
		return habbit;
	})
	saveData();
	rerender(globalActiveHabbitId);
}

function deleteHabbit(event){
	event.preventDefault();
	const previousHabbit = habbits.indexOf(habbits.find(habbit => habbit.id === globalActiveHabbitId)) === 0 ? globalActiveHabbitId+1 : globalActiveHabbitId-1;
	habbits.splice(habbits.indexOf(habbits.find(habbit => habbit.id === globalActiveHabbitId)),1);
	saveData();
	rerender(previousHabbit);
}

function addDays(event){
	event.preventDefault();
	const data = validateAndGetForm(event.target, ['comment']);
	if (!data){
		return;
	}
	habbits = habbits.map(habbit => {
		if(habbit.id === globalActiveHabbitId){
			habbit.days.push({comment: data.comment});
		}
		return habbit;
	})
	saveData();
	rerender(globalActiveHabbitId);
	resetForm(event.target, ['comment']);
}




function togglePopup(state){ 
	if(state){
		page.popup.index.classList.remove('cover_hidden');
	}else{
		page.popup.index.classList.add('cover_hidden');
	}
}

function setIcon(context, icon){
	page.popup.iconField.value = icon;
	const activeicon = document.querySelector('.icon.icon_active');
	activeicon.classList.remove('icon_active');
	context.classList.add('icon_active');
}

function addHabbit(event){
	event.preventDefault();
	const data = validateAndGetForm(event.target, ['name','icon','target']);
	if (!data){
		return;
	}
	const maxId = habbits.reduce((acc,habbit) => acc>habbit.id ? acc:habbit.id, 0);
	habbits.push(
		{
			id: maxId+1,
			icon: data.icon,
			name: data.name,
			target: data.target,
			days: []
		}
	);
	resetForm(event.target, ['name','target'])
	togglePopup();
	saveData();
	rerender(maxId+1);
}

// init
(()=>{
	loadData();
	const hashId = +document.location.hash.replace('#', '');
	const urlHabbit = habbits.find(habbit => habbit.id == hashId);
	if(urlHabbit){
		rerender(urlHabbit.id);
	}else{
		rerender(habbits[0].id);
	}
})()