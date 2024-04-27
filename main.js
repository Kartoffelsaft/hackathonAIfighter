/**
 * @returns {String}
 */
async function requestText(details) {
    let response = await fetch("http://127.0.0.1:8080/completion", {
        method: 'POST',
        body: JSON.stringify(details)
    })
    return (await response.json()).content
}

/**
 * @typedef {Object} Ability
 * @property {String} name
 * @property {String} effect
 */
/**
 * @typedef {Object} Enemy
 * @property {String} name
 * @property {String} description
 * @property {[Ability]} abilities
 */

/** @type {[Enemy]} */
let enemyExamples = [
    {
        "name": "Goblin",
        "description": "This short creature smiles at you with evil in its eyes.",
        "abilities": [
            {
                "name": "swipe",
                "effect": "small amount of damage"
            },
        ]
    },
    {
        "name": "Another Adventurer",
        "description": "This guy appears to have some cool weapons. He refuses to hand them over.",
        "abilities": [
            {
                "name": "swing",
                "effect": "moderate amount of damage"
            },
        ]
    },
    {
        "name": "Superwizard of the Seven Seas",
        "description": "A man with a large, flowing, grey beard. He sports a shirt with a large 'W' printed on it, and eyepatches on both eyes.",
        "abilities": [
            {
                "name": "hook",
                "effect": "reduces player attack"
            },
            {
                "name": "summon storm",
                "effect": "makes everything wet"
            },
            {
                "name": "lazer",
                "effect": "moderate amount of damage"
            },
        ]
    },
];

/**
 * @param {Enemy} str
 * @returns {String}
 */
function enemyToString(enemy) {
    let out = "";

    out += enemy.name + '\n';
    out += enemy.description + '\n';
    for (ability of enemy.abilities) {
        out += "* " + ability.name + ": " + ability.effect + '\n';
    }

    return out;
}

/**
 * @param {string} str
 * @returns {?Enemy}
 */
function enemyFromString(str) {
    /** @type {Enemy} */
    let out = {}
    let lines = str.split('\n');

    if (lines.length < 3) return null;

    out.name = lines[0].trim();
    out.description = lines[1].trim();

    out.abilities = [];
    for (let i = 2; i < lines.length; i++) {
        if (!lines[i].startsWith("* ")) {
            console.warn("llm likely not following format: \n"+str);
            continue;
        }

        let abilityLine = lines[i].substring(2).split(":");
        if (abilityLine.length != 2) {
            console.warn("llm likely not following format: \n"+str);
            continue;
        }

        out.abilities.push({
            "name": abilityLine[0].trim(),
            "effect": abilityLine[1].trim()
        });
    }
    if (out.abilities.length == 0) return null;

    return out;
}

async function generateEnemy() {
    let prompt = "";

    prompt += "<s>[INST] The following are several examples of enemies in a dungeon crawler:\n";

    prompt += enemyExamples.map(enemyToString).join('\n');

    prompt += "\nPlease generate another similar to the above [/INST]\n";

    let enemyStr = "";

    enemyStr += await requestText({
        prompt: prompt+enemyStr,
        n_predict: 20,
        grammar: "root ::= [0-9a-zA-Z ]+\"\\n\"",
        temperature: 1.1,
    });
    console.log("Generating " + enemyStr);
    enemyStr += await requestText({
        prompt: prompt+enemyStr,
        n_predict: 100,
        grammar: "root ::= [0-9a-zA-Z ,.]+\"\\n\"",
        temperature: 0.6,
    });
    enemyStr += await requestText({
        prompt: prompt+enemyStr,
        n_predict: 100,
        grammar: "root ::= (\"* \"[0-9a-zA-Z ]+\": \"[0-9a-zA-Z ]+\"\\n\")+\"\\n\"",
    });

    return enemyFromString(enemyStr) || enemyExamples[0];
}

