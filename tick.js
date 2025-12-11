var items=[];
var item={};
var itemIndex=0;
var mode='list'; // start up showing 'make list' tab
var dragStart={};
class Item {
	constructor(text) {
		// this.index=index;
		this.text=text;
		this.tick=false;
	}
	/* DON'T NEED THESE...
    rename(name) {
    	this.text=name;
        // return `id{this.greeting}, id{this.name}!`;
    }
    tick() {
    	this.tick=true;
    }
    untick() {
    	this.tick=false;
    }
    promote() {
    	if(this.index>0) {
    		items[this.index-1].demote();
    		this.index--;
    	}
    }
    demote() {
    	if ((items.length-this.index)>1) {
    		this.index++;
    		items[this.index+1].promote();
    	}
    }
    */
}
// ACTIONS
id('inactiveTab').addEventListener('click',function() {
	if(mode=='list') mode='shop';
	else mode='list';
	list();
});
id('buttonAdd').addEventListener('click',function() {
	var text=id('textField').value;
	for(var i in items) {
		if(items[i].text==text) {
			id('message').innerText='EXISTS';
			return;
		}
	}
	items.push(new Item(text));
	id('itemDialog').style.display='none';
	list();
	save();
});
id('buttonPromote').addEventListener('click',function() {
	console.log('promote item '+itemIndex+' - '+item.text);
	if(itemIndex>0) swop(itemIndex,itemIndex-1);
	/*
	{
		items[itemIndex-1].index++;
	}
	item.index--;
	items.sort(function(a,b) {return a.index-b.index});
	*/
	id('itemDialog').style.display='none';
	list();
	save();
});
id('buttonDemote').addEventListener('click',function() {
	console.log('demote item '+itemIndex+' - '+item.text);
	if((items.length-itemIndex)>1) swop(itemIndex,itemIndex+1);
	id('itemDialog').style.display='none';
	list();
	save();
});
id('buttonSave').addEventListener('click',function() {
	console.log()
	var text=id('textField').value;
	for(var i in items) {
		if(items[i].text==text) {
			id('message').innerText='EXISTS';
			return;
		}
	}
	item.text=text;
	items[item.index]=item;
	id('itemDialog').style.display='none';
	list();
	save();
});
id('buttonDelete').addEventListener('click',function() {
	console.log('delete item '+itemIndex+' - '+item.text);
	items.splice(item.index,1);
	id('itemDialog').style.display='none';
	list();
	save();
});
id('itemDialog').addEventListener('touchstart', function(event) { // swipe left or up to close dialog
    console.log(event.changedTouches.length+" touches");
    dragStart.x=event.changedTouches[0].clientX;
    dragStart.y=event.changedTouches[0].clientY;
})
id('itemDialog').addEventListener('touchend', function(event) {
    var drag={};
    drag.x=dragStart.x-event.changedTouches[0].clientX;
    drag.y=dragStart.y-event.changedTouches[0].clientY;
    if((drag.x>50)||(drag.y>50)) id('itemDialog').style.display='none';
})
// START
mode='list';
load();
// LIST ITEMS
function list() {
	console.log('list '+items.length+' items - mode: '+mode);
	id('list').innerHTML=''; // clear list
	// if(mode=='list') { // list all items to compile shopping list
	id('activeTab').innerText=(mode=='list')?'make list':'shopping';
	id('inactiveTab').innerText=(mode=='list')?'shopping':'make list';
	for(var i in items) {
		// in list mode list all items showing tick if item.tick is true
		// in shop mode list ticked items (item.tick true) but show unticked 
		if(mode=='shop' && items[i].tick===false) continue;
		var listItem=document.createElement('li');
		listItem.index=i;
		item=items[i];
		console.log('add item '+i+' to list - '+item.text);
		var itemCheck=document.createElement('input');
		itemCheck.setAttribute('type','checkbox');
		itemCheck.setAttribute('class','check');
		itemCheck.index=i;
		itemCheck.checked=(mode=='list')?item.tick:false;
		itemCheck.addEventListener('change',function() { // toggle.checked property
			item=items[this.index];
			console.log('check '+item.text);
			item.tick=!item.tick;
			console.log("tick is "+item.tick);
			items[this.index]=item;
			list();
			save();
		});
		listItem.appendChild(itemCheck);
		var itemText=document.createElement('span');
		itemText.style='margin-left:50px;';
		itemText.index=i;
		itemText.innerHTML=item.text;
		if(mode=='list') itemText.addEventListener('click', function(){itemIndex=this.index; open(this.index);});
		listItem.appendChild(itemText);
		id('list').appendChild(listItem);
	}
	if(mode=='list') { // add '+ new item' to list
		listItem=document.createElement('li');
		listItem.innerHTML="+ new item";
		listItem.addEventListener('click',newItem);
		listItem.setAttribute('style','padding:10px');
		id('list').appendChild(listItem);
	}
}
// OPEN ITEM FOR EDITING
function open(n) {
	console.log('open item '+n);
	itemIndex=Number(n);
	item=items[n];
	id('textField').value=item.text;
	id('buttonDelete').style.display='block';
	id('buttonPromote').style.display='block';
	id('buttonDemote').style.display='block';
	id('buttonAdd').style.display='none';
	id('buttonSave').style.display='block';
	id('itemDialog').style.display='block';
}
// ADD NEW ITEM TO LIST
function newItem() {
	id('textField').value='';
	id('buttonDelete').style.display='none';
	id('buttonPromote').style.display='none';
	id('buttonDemote').style.display='none';
	id('buttonAdd').style.display='block';
	id('buttonSave').style.display='none';
	id('itemDialog').style.display='block';
}
// LOAD ITEMS FROM STORAGE
function load() {
	console.log('load items');
	var data=window.localStorage.getItem('tickItems');
	if(data) {
		items=JSON.parse(data);
		console.log(items.length+' items loaded - first item: '+items[0].text);
		// for(var i in items) items[i].index=i;
	}
	list();
}
// SAVE ITEMS TO STORAGE
function save() {
	console.log('save items');
	var data=JSON.stringify(items);
	window.localStorage.setItem('tickItems',data);
	console.log(items.length+' items saved');
}
// UTILITIES
function id(el) {
	return document.getElementById(el);
}
function swop(a,b) {
	console.log('swop items '+a+' & '+b+' - '+items[a].text+' & '+items[b].text);
	var temp=items[a];
	items[a]=items[b];
	items[b]=temp;
}