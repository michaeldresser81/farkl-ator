function roll(dice) {
    const result = [];
    for (let i = 0; i < dice; i++) {
        result.push(Math.floor((Math.random() * 6)) + 1);
    }
    return result;
}

function multiRoll(dice, rolls) {
    const result = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
    for (let i = 0; i < rolls; i++) {
        const thisRoll = roll(dice);
        thisRoll.forEach(die => {
            result[die] += 1
        });
    }
    return result;
}