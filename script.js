function Turn(player, totalScore = 0) {
    this.player = player;
    this.turnScore = 0;
    this.totalScore = totalScore;
    
    this.roll = function (dice = (6 - this.keptDice.length)) {
        // Rolls n six-sided dice, returns array of dice values
        const result = [];
        for (let i = 0; i < dice; i++) {
            result.push(Math.floor((Math.random() * 6)) + 1);
        }
        this.tableDice = [...result];
        return result;
    }

    this.assess = function (roll) {
        let hasMultiple = false;
        let spare1s = 0;
        let spare5s = 0;
        const tally = {};
        for (value of roll) {
            if (tally[value]) {
                tally[value] += 1;
            }
            else {
                tally[value] = 1;
            }
        }
        console.log(tally);
        const sorted = Object.values(tally).length > 1
                        ? Object.values(tally).sort((a,b) => b-a)
                        : Object.values(tally);
        console.log(sorted);
        if (sorted[0] >= 3) hasMultiple = true;
        console.log(`hasMultiple: ${hasMultiple}`);
        
    }

    this.keep = function (dice) {
        // accepts an array of dice values to move from tableDice to keptDice
        if (this.tableDice.length === 0) return 'No dice rolled! Please roll(n) first';
        if (dice.length === 0
        || dice.length > 6) {
            return 'Which dice to keep? Array of length 1-6.'
        }
        this.turnScore += this.score(dice);
        for (const value of dice) {
            const idx = this.tableDice.indexOf(value);
            this.keptDice.push(...this.tableDice.splice(idx, 1));
        }
    }

    this.tableDice = [];
    this.keptDice = [];

    this.score = function (dice) {
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
        const tally = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
        dice.forEach(number => {
            tally[number] += 1
        });
        console.log(tally);
        let rollScore = 0;
        // sort tallies in descending order; for 1 die the highest count is 1
        const highestMultiple = dice.length === 1
            ? 1
            : Object.values(tally).sort((a, b) => b - a);
        switch(highestMultiple[0]) {
            case 6:
                rollScore += 3000; // six of a kind
                break;
            case 1:
                if (dice.length === 6) rollScore += 1500; // straight
                break;
            case 5:                          // five of a kind
                rollScore += 2000; 
                for (let prop in tally) {   
                    if (tally[prop] === 5) {
                         tally[prop] -= 5; // remove to prevent 1 or 5 "double dipping"
                    }
                }
            case 4:                            // four & pair or four of a kind
            for (let prop in tally) {   
                if (tally[prop] === 4) {
                        rollScore += highestMultiple[1] === 2 ? 1500 : 1000;
                         tally[prop] -= 4; // remove to prevent 1 or 5 "double dipping"
                    }
                }    
            case 3:
                if (highestMultiple[1] === 3) {  // two triplets
                    rollScore += 2500;
                    break;
                } else {
                    for (let prop in tally) {   /// other triples
                        if (tally[prop] === 3) {
                            if (prop === '1') {
                                rollScore += 300;
                            } else {
                                rollScore += Number(prop) * 100;
                            }
                             tally[prop] -= 3; // remove to prevent 1 or 5 "double dipping"
                        }
                    }
                }
            case 2:
                if (highestMultiple[1] === 2 && highestMultiple[2] === 2) {
                    rollScore += 1500; // three pairs
                    break;
                }
            default:
                rollScore += tally['1'] * 100;
                rollScore += tally['5'] * 50;
        }
        console.log(rollScore);
         return rollScore;
        
    
    }
}


// function multiRoll(dice, rolls) {
//     // Rolls n dice, x times. Returns an object with the total
//     // occurrences of each face value (1-6).
//     const result = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
//     for (let i = 0; i < rolls; i++) {
//         const thisRoll = roll(dice);
//         thisRoll.forEach(number => {
//             result[number] += 1
//         });
//     }
//     return result;
// }

function displayObject(obj) {
    let result = '';
    for (let item in obj) {
        result += `${item}: ${obj[item]}, `;
    }
    return result;
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