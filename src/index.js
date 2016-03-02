/*
	1. usage of componment.
*/
// import Button from './components/Button';

// const button = new Button('http://www.google.com');
// button.render('a');

import './styles.scss';

/**
	2. split code
*/
// Only want our Button componment when we have a link on the page.
if (document.querySelectorAll('a').length) {
	// ensure:
	//  first param: dependencies
	//  second param: function
	//  third param: chunk name.
    require.ensure([], () => {
        const components = require('./components/Button/Button');
        const button = new components.default('http://www.google.com');

        button.render('a');
    }, 'button');
}

// If we have a title, render the header componment on it.
if(document.querySelectorAll('h1').length){
	require.ensure([], ()=>{
		const components = require('./components/Header/Header');
		const header = new components.default();

		header.render('h1');

	}, 'header');
}
