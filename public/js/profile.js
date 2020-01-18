

let privacyChangeObj = {};

function privacyChange(){

  let checkBox = document.getElementById("check");
  let privacyPara = document.getElementById("privacyText");
  // the checkbox exist then do the following
  if (checkBox != null){

    privacyChangeObj["privacyChangeValue"] = checkBox.checked;

    // based on the value of the check box we determine what the para html text is going to look like
    if (checkBox.checked){
      privacyPara.innerHTML = `The current status of privacy is ${checkBox.checked}. This means others CANNOT see you infromation unless we mess up some how :)`;
    } else {
      privacyPara.innerHTML = `The current status of privacy is ${checkBox.checked}. This means others can see you infromation!`;
    }
  }

} // end of privacyChange()

function save(){

  let id = document.getElementById("id").innerHTML;

  let save = new XMLHttpRequest();
	save.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 200){
		}
	}

	save.open("PUT", `/users/${id}` , true);
	save.setRequestHeader("Content-Type", "application/json");
	save.send(JSON.stringify(privacyChangeObj));

} // end of save()

function logOut(){

  console.log("logOut()");
  let logout = new XMLHttpRequest();
  logout.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 200){
      // when they have logged out send them back to the home page
      window.location.href = "http://localhost:3000/";
		}
	}

	logout.open("GET", `/logout` , true);
	logout.setRequestHeader("Content-Type", "application/json");
	logout.send();

} // end of logOut()

// end of program
