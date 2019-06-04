
// run apis in sequence vs parrallel - solves for rate limits
// note we pass a Promise as initial value - it resolves immediately


function fetchMessages(username) {
    return fetch(`https://example.com/api/messages/${username}`)
        .then(response => response.json());
}

function getUsername(person) {
    return person.username;
}

async function chainedFetchMessages(p, username) {
    // In this function, p is a promise. We wait for it to finish,
    // then run fetchMessages().
    const obj  = await p;
    const data = await fetchMessages(username);
    return { ...obj, [username]: data};
}

const msgObj = peopleArr
    .map(getUsername)
    .reduce(chainedFetchMessages, Promise.resolve({}))
    .then(console.log);
// ⦘ {glestrade: [ … ], mholmes: [ … ], iadler: [ … ]}


// traverse arrays 
const readings = [0.3, 1.2, 3.4, 0.2, 3.2, 5.5, 0.4];
const maxReading = readings.reduce((x, y) => Math.max(x, y), Number.MIN_VALUE);
const minReading = readings.reduce((x, y) => Math.min(x, y), Number.MAX_VALUE);
console.log({minReading, maxReading});
// ⦘ {minReading: 0.2, maxReading: 5.5}

// flatmap
const fileLines = [
    'Inspector Algar,Inspector Bardle,Mr. Barker,Inspector Barton',
    'Inspector Baynes,Inspector Bradstreet,Inspector Sam Brown',
    'Monsieur Dubugue,Birdy Edwards,Inspector Forbes,Inspector Forrester',
    'Inspector Gregory,Inspector Tobias Gregson,Inspector Hill',
    'Inspector Stanley Hopkins,Inspector Athelney Jones'
];

function flatMap(f, arr) {
    const reducer = (acc, item) => acc.concat(f(item));
    return arr.reduce(reducer, []);
}

const investigators = flatMap(x => x.split(','), fileLines);
console.log(investigators);

[
    //   "Inspector Algar",
    //   "Inspector Bardle",
    //   "Mr. Barker",
    //   "Inspector Barton",
    //   "Inspector Baynes",
    //   "Inspector Bradstreet",
    //   "Inspector Sam Brown",
    //   "Monsieur Dubugue",
    //   "Birdy Edwards",
    //   "Inspector Forbes",
    //   "Inspector Forrester",
    //   "Inspector Gregory",
    //   "Inspector Tobias Gregson",
    //   "Inspector Hill",
    //   "Inspector Stanley Hopkins",
    //   "Inspector Athelney Jones"
    // ]