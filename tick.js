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
}
// ACTIONS
id('activeTab').addEventListener('click',toggleMode);
id('inactiveTab').addEventListener('click',toggleMode);
id('buttonData').addEventListener('click',function() {
	show('dataDialog');
})
id('buttonNew').addEventListener('click',function() {
	console.log('new item');
	newItem();
});
id('buttonAdd').addEventListener('click',function() {
	var text=id('textField').value;
	for(var i in items) {
		if(items[i].text==text) {
			id('message').innerText='EXISTS';
			return;
		}
	}
	console.log('add new item '+text+' at itemIndex '+itemIndex);
	if(itemIndex) items.splice((itemIndex+1),0,new Item(text));
	else items.push(new Item(text));
	// id('itemDialog').style.display='none';
	hide('itemDialog');
	list();
	save();
});
id('buttonPromote').addEventListener('click',function() {
	console.log('promote item '+itemIndex+' - '+item.text);
	if(itemIndex>0) swop(itemIndex,itemIndex-1);
	// id('itemDialog').style.display='none';
	hide('itemDialog');
	list();
	save();
});
id('buttonDemote').addEventListener('click',function() {
	console.log('demote item '+itemIndex+' - '+item.text);
	if((items.length-itemIndex)>1) swop(itemIndex,itemIndex+1);
	// id('itemDialog').style.display='none';
	hide('itemDialog');
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
	// id('itemDialog').style.display='none';
	hide('itemDialog');
	list();
	save();
});
id('buttonDelete').addEventListener('click',function() {
	console.log('delete item '+itemIndex+' - '+item.text);
	items.splice(item.index,1);
	// id('itemDialog').style.display='none';
	hide('itemDialog');
	list();
	save();
});
id('buttonRestore').addEventListener('click',restore);
id('buttonBackup').addEventListener('click',backup);
id('main').addEventListener('touchstart', function(event) { // swipe left or up to close dialog
    console.log(event.changedTouches.length+" touches");
    dragStart.x=event.changedTouches[0].clientX;
    dragStart.y=event.changedTouches[0].clientY;
})
id('main').addEventListener('touchend', function(event) {
    var drag={};
    drag.x=dragStart.x-event.changedTouches[0].clientX;
    drag.y=dragStart.y-event.changedTouches[0].clientY;
    if((drag.x>50)||(drag.y>50)) hide(); // id('itemDialog').style.display='none';
})
// START
mode='list';
load();
// LIST ITEMS
function list() {
	console.log('list '+items.length+' items - mode: '+mode);
	id('list').innerHTML=''; // clear list
	id('activeTab').innerText=(mode=='list')?'make list':'shopping';
	id('inactiveTab').innerText=(mode=='list')?'shopping':'make list';
	id('buttonNew').style.display=(mode=='list')?'block':'none';
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
		if(mode=='list') itemText.addEventListener('click',function(){itemIndex=Number(this.index); console.log('select '+itemIndex)}); // open(this.index);});
		listItem.appendChild(itemText);
		if(mode=='list') {
			var itemEdit=document.createElement('button');
			itemEdit.setAttribute('class','iconButton');
			itemEdit.setAttribute('style','left: 85%; background: url(edit24px.svg) center center no-repeat;');
			itemEdit.index=i;
			itemEdit.addEventListener('click',function() {itemIndex=this.index; open(this.index);});
			listItem.appendChild(itemEdit);
		}
		id('list').appendChild(listItem);
		itemIndex=null;
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
	// id('itemDialog').style.display='block';
	show('itemDialog');
}
// ADD NEW ITEM TO LIST
function newItem() {
	console.log('add new item');
	// id('curtain').style.height='100%';
	id('textField').value='';
	id('buttonDelete').style.display='none';
	id('buttonPromote').style.display='none';
	id('buttonDemote').style.display='none';
	id('buttonAdd').style.display='block';
	id('buttonSave').style.display='none';
	// id('itemDialog').style.display='block';
	show('itemDialog');
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
// RESTORE FROM FILE
function restore() {
	console.log('restore');
	hide('dataDialog');
	var event = new MouseEvent('click',{
		bubbles: true,
		cancelable: true,
		view: window
	});
	fileChooser.dispatchEvent(event);
	fileChooser.onchange=(event)=>{
		var file=id('fileChooser').files[0];
    	console.log("file name: "+file.name);
    	var fileReader=new FileReader();
    	fileReader.addEventListener('load', function(evt) {
			console.log("file read: "+evt.target.result);
    		var data=evt.target.result;
    		var json=JSON.parse(data);
    		items=json.items;
			console.log(logs.length+" items loaded");
			logData=JSON.stringify(items);
    		save();
    		console.log('data imported and saved');
    		load();
    	});
    	fileReader.readAsText(file);
	}
	// id('dataMessage').innerText='';
	// id('backupButton').disabled=false;
	// toggleDialog('dataDialog',false);
}
// BACKUP TO FILE
function backup() {
	console.log('backup');
	hide('dataDialog');
  	var fileName="TickData.json"
	console.log('save '+items.length+' items');
	var data={'items': items};
	var json=JSON.stringify(data);
	var blob=new Blob([json],{type:"data:application/json"});
  	var a=document.createElement('a');
	a.style.display='none';
    var url=window.URL.createObjectURL(blob);
	console.log("data ready to save: "+blob.size+" bytes");
   	a.href=url;
   	a.download=fileName;
    document.body.appendChild(a);
    a.click();
    // id('dataMessage').innerText='';
    // id('restoreButton').disbaled=false;
    // toggleDialog('dataDialog',false);
}
// UTILITIES
function id(el) {
	return document.getElementById(el);
}
function toggleMode() {
	if(mode=='list') mode='shop';
	else mode='list';
	list();
}
function swop(a,b) {
	console.log('swop items '+a+' & '+b+' - '+items[a].text+' & '+items[b].text);
	var temp=items[a];
	items[a]=items[b];
	items[b]=temp;
}
function show(el) {
	id('curtain').style.height='100%';
	id(el).style.display='block'
}
function hide(el) {
	id('curtain').style.height=0;
	if(el) id(el).style.display='none'
	else id('itemDialog').style.display=id('dataDialog').style.display='none';
}