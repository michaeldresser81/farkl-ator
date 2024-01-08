function roll(dice) {
    // Rolls n six-sided dice, returns array of face values.
    const result = [];
    for (let i = 0; i < dice; i++) {
        result.push(Math.floor((Math.random() * 6)) + 1);
    }
    return result;
}

function multiRoll(dice, rolls) {
    // Rolls n dice, x times. Returns an object with the total
    // occurrences of each face value (1-6).
    const result = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
    for (let i = 0; i < rolls; i++) {
        const thisRoll = roll(dice);
        thisRoll.forEach(number => {
            result[number] += 1
        });
    }
    return result;
}

let button = document.querySelector('#rollButton');
let numberDice = document.querySelector('#dice');
const resultDiv = document.querySelector('#results');

button.addEventListener('click', () => {
    let rollResult = roll(numberDice.value);
    let result = document.createElement('p');
    result.textContent = rollResult;
    resultDiv.appendChild(result);
})