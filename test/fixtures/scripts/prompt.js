function doPrompt()
{
	var e = document.createElement('div');
	e.innerHTML = prompt('Enter your name');
	document.body.appendChild(e);				
}
