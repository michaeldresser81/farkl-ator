function Turn(player, totalScore = 0) {
    this.player = player;
    this.turnScore = 0;
    this.totalScore = totalScore;
    
    this.roll = function roll(dice) {
        // Rolls n six-sided dice, returns array of face values.
        const result = [];
        for (let i = 0; i < dice; i++) {
            result.push(Math.floor((Math.random() * 6)) + 1);
        }
        this.tableDice = [result];
    }
    
    this.tableDice = [];
    this.keptDice = [];
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

function displayObject(obj) {
    let result = '';
    for (let item in obj) {
        result += `${item}: ${obj[item]}, `;
    }
    return result;
}

function score(roll) {
    /*
    Single 1 = 100      Four of any number = 1000
    Single 5 = 50       Five of any number = 2000
    Three 1s = 300      Six of any number = 3000
    Three 2s = 200      1-6 straight = 1500
    Three 3s = 300      Three pairs = 1500
    Three 4s = 400      Four of any number + a pair = 1500
    Three 5s = 500      Two triplets = 2500
    Three 6s = 600
    */
    const result = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
    roll.forEach(number => {
        result[number] += 1
    });
    console.log(result);
    let rollScore = 0;
    // sort tallies in descending order
    const highestMultiple = Object.values(result).sort((a, b) => b - a);
    switch(highestMultiple[0]) {
        case 6:
            rollScore += 3000; // six of a kind
            break;
        case 1:
            if (highestMultiple.length === 6) rollScore += 1500; // straight
            break;
        case 5:
            rollScore += 2000;
        case 4:                            // four & pair or four of a kind
            rollScore += highestMultiple[1] === 2 ? 1500 : 1000;
        case 3:
            if (highestMultiple[1] === 3) {  // two triplets
                rollScore += 2500;
                break;
            } else {
                for (let prop in result) {   /// other triples
                    if (result[prop] === 3) {
                        if (prop === '1') {
                            rollScore += 300;
                        } else {
                            rollScore += Number(prop) * 100;
                        }
                         result[prop] = 0; // remove to prevent 1 or 5 "double dipping"
                    }
                }
            }
        case 2:
            if (highestMultiple[1] === 2 && highestMultiple[2] === 2) {
                rollScore += 1500; // three pairs
                break;
            }
        default:
            rollScore += result['1'] * 100;
            rollScore += result['5'] * 50;
    }

     return rollScore;   
    

}

let button = document.querySelector('#rollButton');
let numberDice = document.querySelector('#dice');
let numberRolls = document.querySelector('#rolls');
const resultDiv = document.querySelector('#results');

button.addEventListener('click', () => {
    let rollResult = multiRoll(numberDice.value, numberRolls.value);
    let result = document.createElement('p');
    result.textContent = displayObject(rollResult);
    resultDiv.appendChild(result);
})