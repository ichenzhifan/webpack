import $ from 'jquery';
import Mustache from 'mustache';

/*
baggage-loader: encounter an HTML file of the same name, import it as template, 
and also import any Sass file of the same name
*/
// import './Button.scss';
// import template from './Button.html';

export default class Button{
	constructor(link) {
        this.link = link;
    }

    onClick(event){
    	event.preventDefault();
    	alert(this.link);
    }

    render(node){
    	const text = $(node).text();

    	// render our button
    	$(node).html(Mustache.render(template, {
    		text: text,
    		link: this.link
    	}));

    	// attach our listeners
    	$('.button').click(this.onClick.bind(this));
    }
}