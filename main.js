
// for mistral:
const INSTRUCTION_PREFIX = "[INST] "
const RESPONSE_PREFIX = " [\INST]\n"

/**
// for others:
const INSTRUCTION_PREFIX = "### Instruction:\n"
const RESPONSE_PREFIX = "### Response:\n"
*/


/**
 * @returns {Promise<String>}
 */
async function requestText(details) {
    if (details.cache_prompt == undefined) details.cache_prompt = true;

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
/**
 * @typedef {Object} PlayerWeapon
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
        if (lines[i].trim().length == 0) break;
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

/**
 * @returns {Promise<Enemy>}
 */
async function generateEnemy() {
    let prompt = "";

    prompt += INSTRUCTION_PREFIX;
    prompt += "The following are several examples of enemies in a dungeon crawler:\n";
    prompt += enemyExamples.map(enemyToString).join('\n');
    prompt += "\nPlease generate another enemy similar to the above";
    prompt += RESPONSE_PREFIX;

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

/** @type {[PlayerWeapon]} */
let playerWeaponExamples = [
    {
        "name": "Dagger",
        "description": "Short blade that gets the job done.",
        "abilities": [
            {
                "name": "Jab",
                "effect": "does a small amount of damage",
            },
            {
                "name": "Backstab",
                "effect": "does a large amount of damage, misses if enemy is aware",
            },
        ]
    },
    {
        "name": "Flintlock",
        "description": "Somewhat clumsy but powerful gunpowder weapon.",
        "abilities": [
            {
                "name": "Shoot",
                "effect": "does a lot of damage, must be loaded",
            },
            {
                "name": "Reload",
                "effect": "load the flintlock",
            },
        ]
    },
    {
        "name": "Alder's Razor",
        "description": "Win debates with this one-of-a-kind weapon. Sharper and much more deadly than the traditional Occam's Razor",
        "abilities": [
            {
                "name": "Argue",
                "effect": "does a lot of damage to enemies of medium intelligence, almost none to low or high. deals fire damage",
            },
            {
                "name": "Shave",
                "effect": "weakens enemy to elemental damage",
            },
            {
                "name": "Cut",
                "effect": "does a little bit of damage",
            },
        ]
    }
];

/**
 * @returns {Promise<PlayerWeapon>}
 */
async function generatePlayerWeapon() {
    // player weapons happen to basically follow the same format as enemies
    // so I'm going to call a lot of that code instead of copying&renaming

    let prompt = "";

    prompt += INSTRUCTION_PREFIX;
    prompt += "The following are several examples of player weapons in a dungeon crawler:\n";
    prompt += playerWeaponExamples.map(enemyToString).join('\n');
    prompt += "\nPlease generate another weapon similar to the above";
    prompt += RESPONSE_PREFIX;

    let playerWeaponStr = "";

    playerWeaponStr += await requestText({
        prompt: prompt+playerWeaponStr,
        n_predict: 20,
        grammar: "root ::= [0-9a-zA-Z ']+\"\\n\"",
        temperature: 1.4,
    });
    console.log("Generating " + playerWeaponStr);
    playerWeaponStr += await requestText({
        prompt: prompt+playerWeaponStr,
        n_predict: 100,
        grammar: "root ::= [0-9a-zA-Z ,.']+\"\\n\"",
        temperature: 0.6,
    });
    playerWeaponStr += await requestText({
        prompt: prompt+playerWeaponStr,
        n_predict: 100,
        grammar: "root ::= (\"* \"[0-9a-zA-Z ]+\": \"[0-9a-zA-Z ]+\"\\n\")+\"\\n\"",
    });

    return enemyFromString(playerWeaponStr) || playerWeaponExamples[0];
}

