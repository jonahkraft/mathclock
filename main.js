function getRandomDivider(n) {
    // n is expected as a number
    // returns a random nontrivial divisor as a number
    // a simple approach to find a random divisor of a given number
    // if none exists, returns -1

    let dividers = [];

    for (let i = 2; i < n; i++) {
        if (n % i === 0) {
            dividers.push(i);
        }
    }

    if (dividers.length > 0) {
        const index = Math.floor(Math.random() * dividers.length);
        return dividers[index];
    }
    return -1;
}

function isPrime(number) {
    // number is expected as a number
    // performs a naive prime test and returns a boolean

    if (number <= 1) {
        return false;
    }

    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

function timeToSimpleMath(time, includeDivision) {
    // time is expected as a number and includeDivision as a boolean
    // converts time into a math problem of two numbers and one operator (+, -, ·, :) and returns it as a string

    let operators;

    if (isPrime(time) || time <= 1) {
        // avoid multiplication by 1
        operators = ["+", "-"]
    }
    else {
        operators = ["+", "-", "·"]
    }

    if (includeDivision) {
        // optionally include division
        operators.push(":")
    }

    let op = operators[Math.floor(Math.random() * operators.length)];

    let left;
    let right;

    if (op === "+") {
        left = Math.floor(Math.random() * 30) + 1; // a number between 1 and 30 on the left
        right = time - left;  // compute remainder

        // if right negative, change operator to minus and right to absolute value
        if (right < 0) {
            right = Math.abs(right);
            op = "-";
        }
    }
    else if (op === "-") {
        // completely analogous to "+"

        left = Math.floor(Math.random() * 30) + 1; // a number between 1 and 30 on the left
        right = left - time;  // compute remainder

        // if right negative, change operator to plus and right to absolute value
        if (right < 0) {
            right = Math.abs(right);
            op = "+";
        }
    }
    else if (op === "·") {
        left = getRandomDivider(time);  // always exists, as multiplication is impossible for primes or 0 or 1
        right = time / left
    }
    else {
        right = Math.floor(Math.random() * 4) + 2;  // divide by at least 2 and at most 5
        left = time * right;
    }

    return left.toString() + op + right.toString();
}

function timeToComplexMath(time, includeDivision) {
    // time is expected as a number and includeDivision as a boolean
    // converts time into a math problem of three numbers and two operators (+, -, ·, :) and returns it as a string

    let op;
    let left;
    let right;

    if (time <= 1) {
        // in this case time cannot be sensibly decomposed

        // we choose a random number up to 10 as left and its inverse as right
        left = Math.floor(Math.random() * 10) + 1;
        right = left;
        op = "-";
        return timeToSimpleMath(left, includeDivision) + op + right.toString()
    }
    else {
        if (Math.floor(Math.random() * 2) === 0) {
            op = "+";
            left = Math.floor(Math.random() * (time-1)) + 1;
            right = time - left;

            // right might be negative, then change operator to minus and right to abs(right)
            if (right < 0) {
                right = Math.abs(right);
                op = "-";
            }
        }
        else {
            op = "-";
            left = Math.floor(Math.random() * (time-1)) + 1;
            right = left - time;

            // right might be negative, then change operator to plus and right to abs(right)
            if (right < 0) {
                right = Math.abs(right);
                op = "+";
            }
        }
    }

    let leftCalc = timeToSimpleMath(left, includeDivision);

    if (Math.floor(Math.random() * 2) === 0) {
        return leftCalc + op + right.toString();
    }
    return right.toString() + op + leftCalc;
}

function setCurrentTime() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();

    // avoid division by larger numbers
    document.getElementById("hour").textContent = timeToComplexMath(hour, true)
    document.getElementById("min").textContent = timeToComplexMath(min, false)
}

function calcSecUntilNextMinute() {
    // calculates how many seconds until the next full minute remain
    const now = new Date();
    return 60 - now.getSeconds();
}

setCurrentTime(); // initial call so the field is not empty at the start
const waitTime = calcSecUntilNextMinute() * 1000;  // store milliseconds until the next minute

setTimeout(() => {
    setCurrentTime();
    setInterval(setCurrentTime, 60000);
}, waitTime);
