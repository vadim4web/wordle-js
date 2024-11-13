import { dictionary } from './dictionary.js';

const len = dictionary.length;
const reset_button = document.getElementById('reset');
reset_button.addEventListener('click', reset);
reset_button.classList.add('activated');
const check_button = document.getElementById('check');
check_button.classList.remove('activated');

if (!localStorage.getItem('row_index')) {
    let row_index = 1;
    localStorage.setItem('row_index', row_index);
}
if (!localStorage.getItem('random_word')) {
    let random_index = getRandomIntInclusive(0, len);
    // let random_word = 'хімік';
    let random_word = dictionary[random_index];
    localStorage.setItem('random_word', random_word);
    // console.log(`random_word = ${localStorage.getItem('random_word')}`);
    console.log(`Hello!\nWORDLE hint:\n(for those who know\nway to call dev-console)
First letter is: ${localStorage.getItem('random_word').charAt(0).toUpperCase()}\n;-)`);
} else {
    // console.log(`random_word = ${localStorage.getItem('random_word')}`);
    console.log(`Hello!\nWORDLE hint:\n(for those who know\nway to call dev-console)
First letter is: ${localStorage.getItem('random_word').charAt(0).toUpperCase()}\n;-)`);
}

let row_index = parseInt(localStorage.getItem('row_index'), 10);
let word = localStorage.getItem('random_word');

window.addEventListener('load', row_trigger);

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initial() {
    // console.log(`initial()`);
    if (!localStorage.getItem('win_true')) {
        localStorage.setItem('win_true', false);
    }
}

function draw_all() {
    // console.log('draw_all()');
    for (let i = 1; i < row_index; i++) {
        if (localStorage.getItem(`row${i}`)) {
            let row = document.getElementById(`row${i}`);
            let row_squares = row.querySelectorAll('input');
            let attempt = localStorage.getItem(`row${i}`);
            for (let square of row_squares) {
                let letter = attempt.slice(parseInt(square.id[3], 10) - 1, parseInt(square.id[3], 10)).toLowerCase();
                let target_letter = word.slice(parseInt(square.id[3], 10) - 1, parseInt(square.id[3], 10));
                square.value = letter;
                if (
                    // word.charAt(attempt.indexOf(letter)) === letter &&
                    letter === target_letter
                    // || attempt.charAt(word.indexOf(target_letter)) === target_letter && letter === target_letter
                ) {
                    square.style.setProperty('background-color', 'green');
                } else if (word.includes(letter)) {
                    square.style.setProperty('background-color', 'yellow');
                } else {
                    square.style.setProperty('background-color', 'grey');
                }
            }
        }
    }
}

function check() {
    // console.log('check()');
    let row = document.getElementById(`row${row_index}`);
    let row_squares = row.querySelectorAll('input');
    let resStr = '';
    for (let square of row_squares) {
        resStr += square.value.toLowerCase();
    }
    if (dictionary.includes(resStr)) {
        localStorage.setItem(`row${row_index}`, resStr);
        let attempt = localStorage.getItem(`row${row_index}`);
        if (row_index <= 6) {
            row_index++;
        }
        localStorage.removeItem('row_index');
        localStorage.setItem('row_index', row_index);
        if (attempt === word) {
            let win_true = true;
            localStorage.removeItem('win_true');
            localStorage.setItem('win_true', win_true);
            row_trigger();
            check_button.removeEventListener('click', check);
            check_button.classList.remove('activated');
            console.log('Congratulations! You won.');
            setTimeout(() => alert('Congratulations! You won.'), 500)
            return;
        } else if (row_index === 7 && attempt !== word) {
            check_button.removeEventListener('click', check);
            check_button.classList.remove('activated');
            console.log('Game over.');
            alert('Game over.');
            reset();
            return;
        } else {
            check_button.removeEventListener('click', check);
            check_button.classList.remove('activated');
            row_trigger();
        }
    } else {
        check_button.removeEventListener('click', check);
        check_button.classList.remove('activated');
        for (let square of row_squares) {
            square.value = '';
        }
        console.log('Not in word list.');
        alert('Not in word list.');
    }
}

function reset() {
    // console.log('reset()');
    localStorage.clear();
    check_button.removeEventListener('click', check);
    check_button.classList.remove('activated');
    location.reload();
    initial();
}

function row_trigger() {
    // console.log('row_trigger()');
    initial();
    let input_squares = document.querySelectorAll('input');
    for (let square of input_squares) {
        let row_id = parseInt(square.id[1], 10);
        let win_true = localStorage.getItem('win_true');
        if (row_id === row_index && win_true === 'false') {
            square.disabled = false;
            square.addEventListener('input', value_control);
            if (square.id === `r${row_index}l1`) {
                square.autofocus = true;
                square.focus();
                square.select();
            }
        } else {
            square.disabled = true;
            square.style.setProperty('color', 'black');
        }
        square.style.setProperty('text-transform', 'uppercase');
        square.autocomplete = 'off';
    }
    draw_all();
}

function value_control() {
    // console.log('value_control()');
    this.setAttribute('maxlength', '1');
    let row = document.getElementById(`row${row_index}`);
    let row_squares = row.querySelectorAll('input');
    let resStr = '';
    for (let square of row_squares) {
        resStr += square.value.toLowerCase();
    }
    if (resStr.length === word.length) {
        check_button.addEventListener('click', check);
        check_button.classList.add('activated');
    } else {
        check_button.removeEventListener('click', check);
        check_button.classList.remove('activated');
    }
}