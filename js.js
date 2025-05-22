/* Javascript */

// brave://extensions/

//Chrome Extension Review URL Later
const inputEl = document.querySelector("#input-el");
const btnInput = document.querySelector("#btn-input");
const btnTab = document.querySelector("#btn-tab");
const btnDelete = document.querySelector("#btn-delete");
const btnClipboard = document.querySelector("#btn-clipboard");
const messageEl = document.querySelector("#message-el");
const savedUlEl = document.querySelector("#savedul-el");
const btnYes = document.querySelector("#btn-yes");
const btnNo = document.querySelector("#btn-no");
const btnOptions = document.querySelector("#btn-options")
const containerOptions = document.querySelector("#container-options")
const btnRearrangeItems = document.querySelector("#btn-rearrange-items")
let savedUrl = [];
let clearlistCount = 0;
let rearrangeItemsBool = false;

//Get information from localStorage
if (localStorage.getItem("savedItems") === null){
	savedUrl = [];
} else {
	savedUrl = JSON.parse(window.localStorage.getItem("savedItems"))
	renderList(savedUrl);
}
//
btnInput.addEventListener("click", function() {
	//check value in box, push to array
	if (inputEl.value === ""){
		messageEl.textContent = "Please enter information into the box";
	} else {
		messageEl.textContent = "Your list of saved items:";
		// check for duplicates
		if (checkForDuplicateInput(inputEl.value)) { 
			messageEl.textContent = "Duplicate item not added to list.";
		} else {
			messageEl.textContent = "Your list of saved items:";
			savedUrl.push(inputEl.value)
		};
	};
	btnYes.style.display = "none";
	btnNo.style.display = "none";
	inputEl.value = "";
	containerOptions.classList.add("hidden")
	renderList(savedUrl);
})
//render information to extension 
function renderList(saved){
	//empty list
	let listItems = ""; 
	//rebuild list
	for (let i = 0; i < saved.length; i++){
		listItems += `
		<li>
		<a href="${saved[i]}" target="_blank">${saved[i]}</a>
		<div class="container-li-btn">
			<div class="container-btn-up-down">
				<button class="btn-color btn-up-down hidden" id="btn-up-${i}">&#9206</button>
				<button class="btn-color btn-up-down hidden" id="btn-down-${i}">&#9207</button>
			</div>
			<button class="btn-color-white remove-btn" id="delete-${i}">DELETE</button>
		</div>
		</li>
		`;
	}
	//send list to page
	savedUlEl.innerHTML = listItems;
	localStorage.setItem("savedItems", JSON.stringify(saved));
}
//event listener for deleting individual entries 
document.addEventListener("click",
	(e) => {
		let element = e.target;
		let tempId = e.target.id.split("-");
		let elementContent = element.textContent;
		
		// convert
		if (element.textContent === "⏶"){ elementContent = "&#9206"};
		if (element.textContent === "⏷"){ elementContent = "&#9207"};
		
		// delete list item
		if (element.tagName === "BUTTON" && element.textContent === "DELETE") {
			deleteSavedUrlListItem(tempId[1]);
		}
		// move list item
		if (element.tagName === "BUTTON" && (elementContent === "&#9206" || elementContent === "&#9207" )){
			reorderSavedUrlList(tempId[1], tempId[2]);
		}
		
	}, false
)
// splice individual entry from savedUrl array
function deleteSavedUrlListItem(inputId){
	let deleted = savedUrl.splice(inputId,1);
	renderList(savedUrl);
	displayRearrangeButtons();
}
// move items up or down in priority in the list
function reorderSavedUrlList(direction, fromIndex){
	let toIndex = parseInt(fromIndex);
	
	if(direction === "up"){
		toIndex -= 1;
	}
	if(direction === "down"){
		toIndex += 1;
	}

	if(toIndex < 0 || toIndex > savedUrl.length ){
		return
	} else {
		let itemRemoved = savedUrl.splice(fromIndex, 1)
		savedUrl.splice( toIndex, 0, itemRemoved)
	}
	
	renderList(savedUrl);
	displayRearrangeButtons();
}

// check for duplicate inputs and urls
function checkForDuplicateInput(_input) {
	let result;
	_input.toString()
	savedUrl.find((e) => {
		if ( e === _input) {
			result = true;
			return true;
		}
		result = false
		return false;
	})
	return result
}

//Clear list button and submenu
btnDelete.addEventListener("click", function(event){
	if(clearlistCount == 0){
		messageEl.textContent = "Are you sure you want to clear the list?";
		btnYes.style.display = "inline";
		btnNo.style.display = "inline";
		clearlistCount = 1;
	} else {
		
		messageEl.textContent = "Your list of saved items:";
		btnYes.style.display = "none";
		btnNo.style.display = "none";
		clearlistCount = 0;
	}
})
// clear list yes to clearing
btnYes.addEventListener("click",  function clearList(){
	messageEl.innerHTML = "Please enter information into the box";
	for (let i = savedUrl.length; i > -1; i--){
		savedUrl.pop();
	}
	savedUlEl.innerHTML = "";
	localStorage.removeItem("savedItems");
	btnYes.style.display = "none";
	btnNo.style.display = "none";
	clearlistCount = 0;
	rearrangeItemsBool = false;
	containerOptions.classList.add("hidden")
})
// clear list no to clearing
btnNo.addEventListener("click",  function backToList(){
	messageEl.textContent = "Your list of saved items:";
	btnYes.style.display = "none";
	btnNo.style.display = "none";
	clearlistCount = 0;
})
// store current tab to list
btnTab.addEventListener("click", function(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		// check for duplicates
		if (checkForDuplicateInput(tabs[0].url)) { 
			messageEl.textContent = "Duplicate item not added to list.";
		} else {
			messageEl.textContent = "Your list of saved items:";
			savedUrl.push(tabs[0].url)
		};
		inputEl.value = "";
		renderList(savedUrl);
	});
	btnYes.style.display = "none";
	btnNo.style.display = "none";
	clearlistCount = 0;
	containerOptions.classList.add("hidden")
})


// toggles the additional options row
btnOptions.addEventListener("click", () => {

	if(containerOptions.classList.contains("hidden")){
		containerOptions.classList.remove("hidden")
		
	} else {
		containerOptions.classList.add("hidden")
	}
	rearrangeItemsBool = false;
	displayRearrangeButtons();
})

// toggles the arrange items buttons on / off
btnRearrangeItems.addEventListener("click", () => {
	if(rearrangeItemsBool === false){
		rearrangeItemsBool = true;
		
	} else {
		rearrangeItemsBool = false;
	}
	displayRearrangeButtons();
})
function displayRearrangeButtons(){
	let liElement = document.querySelectorAll('li a');
	console.log(liElement)
	if (rearrangeItemsBool){
		messageEl.textContent = "Rearrange the items in the list:";
		liElement.forEach((e) => e.style.maxWidth = "265px");
	} else {
		messageEl.textContent = "Your list of saved items:";
		liElement.forEach((e) => e.style.maxWidth = "295px");
	}
	
	
	let itemList = document.querySelectorAll(`[class~="btn-up-down"]`)
	itemList.forEach((e) => {
		if(rearrangeItemsBool){
			e.classList.remove("hidden")
		}
		if(!rearrangeItemsBool){
			e.classList.add("hidden")
		}
	})
}

// copies entire list to windows clipboard
btnClipboard.addEventListener("click", function copytoclipboard(){
	let urlToCopy = savedUrl.join("\n");
	navigator.clipboard.writeText(urlToCopy);
	containerOptions.classList.add("hidden");
})
