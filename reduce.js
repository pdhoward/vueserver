
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