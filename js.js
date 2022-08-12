/* Javascript */

// brave://extensions/

//Chrome Extension Review URL Later
const inputEl = document.querySelector("#input-el");
const inputBtn = document.querySelector("#input-btn");
const tabBtn = document.querySelector("#tab-btn");
const deleteBtn = document.querySelector("#delete-btn");
const messageEl = document.querySelector("#message-el");
const savedUlEl = document.querySelector("#savedul-el");
const yesBtn = document.querySelector("#yes-btn");
const noBtn = document.querySelector("#no-btn");
let savedUrl = [];

//Get information from localStorage
if (localStorage.getItem("savedItems") === null){
	savedUrl = [];
} else {
	savedUrl = JSON.parse(window.localStorage.getItem("savedItems"))
	renderList(savedUrl);
}
//
inputBtn.addEventListener("click", function() {
	//check value in box, push to array
	if (inputEl.value === ""){
		messageEl.textContent = "Please enter information into the box";
	} else {
		messageEl.textContent = "Your list of saved items:";
		savedUrl.push(inputEl.value);
	};
	yesBtn.style.display = "none";
	noBtn.style.display = "none";
	inputEl.value = "";
	renderList(savedUrl);
})
//render information to extension 
function renderList(saved){
	//empty list
	let listItems = ""; 
	//rebuild list
	for (let i = 0; i < saved.length; i++){
		listItems += `<li><a href="${saved[i]}" target="_blank">${saved[i]}</a>   <button id="${i}" class="remove-btn">DELETE</button></li>`;
	}
	//send list to page
	savedUlEl.innerHTML = listItems;
	localStorage.setItem("savedItems", JSON.stringify(saved));
}
//event listener for deleting individual entries 
document.addEventListener("click",
(e) => {
	let element = e.target;
	if (element.tagName == "BUTTON" && element.textContent === "DELETE") {
		spliceSavedUrl(element.id);
	}
}, false
)
// splice individual entry from savedUrl array
function spliceSavedUrl(inputid){
	let deleted = savedUrl.splice(inputid,1)
	renderList(savedUrl);
}
//Clear list button and submenu
deleteBtn.addEventListener("click", function(){
	messageEl.textContent = "Are you sure you want to clear the list?";
	yesBtn.style.display = "inline";
	noBtn.style.display = "inline";
})
// clear list yes to clearing
yesBtn.addEventListener("click",  function clearList(){
	messageEl.innerHTML = "Please enter information into the box";
	for (let i = savedUrl.length; i > -1; i--){
		savedUrl.pop();
	}
	savedUlEl.innerHTML = "";
	localStorage.removeItem("savedItems");
	yesBtn.style.display = "none";
	noBtn.style.display = "none";
})
// clear list no to clearing
noBtn.addEventListener("click",  function backToList(){
	messageEl.textContent = "Your list of saved items:";
	yesBtn.style.display = "none";
	noBtn.style.display = "none";
})
// store current tab to list
tabBtn.addEventListener("click", function(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		savedUrl.push(tabs[0].url);
		inputEl.value = "";
		renderList(savedUrl);
	});
	yesBtn.style.display = "none";
	noBtn.style.display = "none";
})
