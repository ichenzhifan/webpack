import $ from 'jquery';
import Mustache from 'mustache';
/*
baggage-loader: encounter an HTML file of the same name, import it as template, 
and also import any Sass file of the same name
*/
// import template from './Header.html';
// import './Header.scss';

export default class Header {
    render(node) {
        const text = $(node).text();

        $(node).html(
            Mustache.render(template, { text: text })
        );
    }
}
