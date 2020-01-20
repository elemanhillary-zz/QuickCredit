'use strict'
const errors = document.querySelector('.errors')
const toggleButtons = () => {
	/*signin btn, login btn, signin form(signin_html), login form(signup_html) elements*/
	let signin_btn = document.querySelector('.login');
	let signup_btn = document.querySelector('.signup');
	let signin_html = document.querySelector('.sign_in');
	let signup_html = document.querySelector('.sign_up');

	/*check whether signin_html has attribute active and display it as active*/
	if (signin_html.hasAttribute('active')) {
		signup_html.style.display = 'none';
		signin_btn.style.background = '#ffffff';
		signin_btn.firstElementChild.style.color = '#0084d7';
	}

	/* add onclick event listeners on signin_btn and signup_btn */
	signin_btn.onclick = (e) => {
		signin_html.setAttribute('active', true);
		signin_html.style.display = 'block';
		signup_html.style.display = 'none';
		signin_btn.style.background = '#ffffff';
		signin_btn.firstElementChild.style.color = '#0084d7';
		signup_btn.style.background = 'transparent';
		signup_btn.firstElementChild.style.color = '#ffffff';
	}
	signup_btn.onclick = (e) => {
		signin_html.style.display = 'none';
		signup_html.style.display = 'block';
		signup_btn.style.background = '#ffffff';
		signup_btn.style.background = '#ffffff';
		signup_btn.firstElementChild.style.color = '#0084d7';
		signin_btn.style.background = 'transparent';
		signin_btn.firstElementChild.style.color = '#ffffff';
	}
}

// let submit = document.querySelector('.submit');

// submit.onclick = (e) => {
// 	postFormData('https://qwikcredit.herokuapp.com/api/v1/auth/signup')
// 	.then(data => {
// 		if (data.Created) {
// 			window.location.href = "https://elemanhillary.github.io/QuickCredit/auth_pages/"
// 		} else if (data.status === 422){
// 			errors.textContent = data.message;
// 			errors.style.display = 'block'
// 			setTimeout(function() {
// 				errors.style.display = 'none'
// 			}, 1500)			
// 		} else {
// 			errors.textContent = 'User already exists';
// 			errors.style.display = 'block'
// 			setTimeout(function() {
// 				errors.style.display = 'none'
// 			}, 1500)
// 		}
		
// 	})
// 	.catch(error => console.error(error))

// 	async function postFormData(url, data) {
// 		const formData = new FormData(document.querySelector('.sign_up form'))
// 		const response = await fetch(url, {
// 			method: 'POST',
// 			body: new URLSearchParams(formData),
// 			headers: new Headers({ 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' })
// 		});
// 		return await response.json();
// 	}
// }


setTimeout(()=>{let submitLogin = document.getElementById("u_0_y submit_login");
console.log(submitLogin)
submitLogin.onclick = (e) => {
	postFormData('https://qwikcredit.herokuapp.com/api/v1/auth/signin')
	.then(data => {
		if (data.Success) {
			if ('token' in localStorage) {
				localStorage.removeItem('token')
				localStorage.setItem('token', data.token)
			} else {
				localStorage.setItem('token', data.token)
			}
			if(data.data.isAdmin) {
				window.location.href = 'https://elemanhillary.github.io/QuickCredit/admin/'
			} else {
				window.location.href = 'https://elemanhillary.github.io/QuickCredit/client/';
			}
		} else if (data.status === 422){
			errors.textContent = data.message;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)			
		} else if(data.status === 401){
			errors.textContent = data.message;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		} else {
			errors.textContent = data.error;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		}
	})
	.catch(error => console.error(error))

	async function postFormData(url, data) {
		console.log(document.querySelector('#email').value,document.querySelector('#email').value)
		const formData = new FormData(document.querySelector('#login_form'))
		console.log(formData)
		const response = await fetch(url, {
			method: 'POST',
			body: new URLSearchParams(formData),
			headers: new Headers({
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
			})
		});
		return await response.json();
	}
}
}, 300)
(function () {
	toggleButtons();
})();

