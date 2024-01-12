function Player(name) {
    this.name = name;
    this.score = 0;
}

function Turn(player) {
    this.player = player;
    this.score = 0;
    
    this.roll = function (dice = (6 - this.keptDice.length)) {
        // Rolls n six-sided dice, returns an array of dice values
        const result = [];
        for (let i = 0; i < dice; i++) {
            result.push(Math.floor((Math.random() * 6)) + 1);
        }
        this.tableDice = [...result];
        return result;
    }

    this.assess = function (roll) {
        // Accepts and array of dice values, creates an object with tallies
        // {'1': 2, '2': 2, '6':1} and uses these tallies to assess combinations
        // with point value (multiples or "spare" 1s and 5s)

        let hasMultiple = ''; // "multiple" meaning triple or better combo
        let spare1s = 0;
        let spare5s = 0;
        let tripleValue = 0;
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
        // Looking at the tally sorted in descending order, the first elements
        // will let us deduce which multiples if any are present
        const sorted = Object.values(tally).length > 1
                        ? Object.values(tally).sort((a,b) => b-a)
                        : Object.values(tally);
        console.log(sorted); 
        if (sorted[0] === 3) {
            hasMultiple = sorted[1] === 3 ? 'double-triple' : 'triple';
        }
        if (sorted[0] === 4) {
            hasMultiple = sorted[1] === 2 ? 'four&pair' : 'four';
        }
        if (sorted[0] === 5) {
            hasMultiple = 'five';
        }
        if (sorted[0] === 6) {
            hasMultiple = 'six';
        }
        if (sorted[0] === 2 && sorted[1] === 2 && sorted[2] === 2) {
            hasMultiple = 'three-pair';
        }
        if (sorted[0] === 1 && Object.values(tally).length === 6) {
            hasMultiple = 'straight';
        }
        // Remove 1s and 5s from tally in the event of multiples, to 
        // prevent "double dipping"
        switch (hasMultiple) { 
            case 'six':
            case 'double-triple':
            case 'four&pair':
            case 'three-pair':
            case 'straight':          // these multiples use six dice, there can be no spares
                delete tally['1'];
                delete tally['5'];
                break;
            case 'five':
                if (tally['1'] === 5) delete tally['1'];
                if (tally['5'] === 5) delete tally['5'];
                break;
            case 'four':         // remove triples and quadruples from tally if 1 or 5
                if (tally['1'] === 4) delete tally['1'];
                if (tally['5'] === 4) delete tally['5'];
                break;
            case 'triple':
                for (let prop in tally){ // triple values will be multiplied in score()
                    if (tally[prop] === 3) tripleValue = Number(prop);
                }
                if (tally['1'] === 3) delete tally['1'];
                if (tally['5'] === 3) delete tally['5'];
                break;
        }
        if (tally['1'] < 3) spare1s = tally['1'];
        if (tally['5'] < 3) spare5s = tally['5'];
        
        return [hasMultiple, tripleValue, spare1s, spare5s];
        
    }

    this.keep = function (dice) {
        // accepts an array of dice values to move from tableDice to keptDice
        if (dice.length === 0
        || dice.length > 6) {
            return 'Which dice to keep? Array of length 1-6.'
        }
        const assessed = this.assess(dice);
        this.calcScore(...assessed);
        for (let value of dice) {
            const idx = this.tableDice.indexOf(value);
            this.keptDice.push(...this.tableDice.splice(idx, 1));
        }
    }

    this.tableDice = [];
    this.keptDice = [];

    this.calcScore = function (hasMultiple, tripleValue, spare1s = 0, spare5s = 0) {
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
        console.log(`hasMultiple: ${hasMultiple}, tripleValue: ${tripleValue},
        spare1s: ${spare1s}, spare5s: ${spare5s}`);
        switch(hasMultiple) {
            case 'six':
                this.score += 3000; // six of a kind
                break;
            case 'straight':
                this.score += 1500; // straight
                break;
            case 'five':                          // five of a kind
                this.score += 2000; 
                break;
            case 'four':                            // four of a kind
                this.score += 1000;
                break;  
            case 'four&pair':                            // four & a pair
                this.score += 1500;
                break;  
            case 'three-pair':                            // three pair
                this.score += 1500;
                break;  
            case 'double-triple':
                this.score += 2500;
                break;
            case 'triple':
                tripleValue === 1
                ? this.score = 300
                : this.score += tripleValue * 100;
                break;
        }
            this.score += spare1s * 100;
            this.score += spare5s * 50;

         return this.score;
    }
    this.end = function () {
        return player.score += this.score;
        
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