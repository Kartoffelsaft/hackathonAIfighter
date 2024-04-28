function printChat(str1) {
  let messages = document.getElementById("chatbox")
  scrollToBottom = () => {
    messages.scrollTo(0, messages.scrollHeight);
  }

  let finalStr = '<p class="chatbox">' + str1 + '</p>';
  messages.insertAdjacentHTML("afterbegin", finalStr);
  scrollToBottom();
}

let loading = false;

function addAbility(name, effect) {
  let button = document.createElement('button');
  button.innerText = name;
  button.style.cssText = 'flex: 1 1;max-width: 100px;'

  //test
  let details = document.createElement('span');
  details.innerText = effect;
  details.classList.add("tooltiptext");
  button.classList.add("tooltip");

  button.addEventListener('click', async () => {
    if (loading) return;
    loading = true;
    document.getElementById("loadingindicator").style.visibility = "visible";

    let attack = await generatePlayerAttack(name);
    printChat(attack.who + " used " + attack.what);
    printChat(attack.outcome);
    for (damage of attack.damages) {
        printChat(damage.who + " took " + damage.amount + " damage");
        gamestate[damage.who.toLowerCase()].health -= damage.amount;
    }
    gamestate.combatHistory.push(attack);

    setHealth(gamestate.enemy.health, gamestate.player.health);
    if (gamestate.enemy.health <= 0) {
        gamestate.enemy.what = await generateEnemy();
        gamestate.enemy.health = 5;
        addEnemy(gamestate.enemy.what.name, gamestate.enemy.what.description);
        setHealth(gamestate.enemy.health, gamestate.player.health);
    }

    let enemyattack = await generateEnemyAttack();
    printChat(enemyattack.who + " used " + enemyattack.what);
    printChat(enemyattack.outcome);
    for (damage of enemyattack.damages) {
        printChat(damage.who + " took " + damage.amount + " damage");
        gamestate[damage.who.toLowerCase()].health -= damage.amount;
    }
    gamestate.combatHistory.push(enemyattack);

    setHealth(gamestate.enemy.health, gamestate.player.health);
    if (gamestate.enemy.health <= 0) {
        gamestate.enemy.what = await generateEnemy();
        gamestate.enemy.health = 5;
        addEnemy(gamestate.enemy.what.name, gamestate.enemy.what.description);
        setHealth(gamestate.enemy.health, gamestate.player.health);
    }

    loading = false;
    document.getElementById("loadingindicator").style.visibility = "hidden";
  })
  document.getElementById("abilities").appendChild(button);
  button.appendChild(details);
}

function addEnemy(name, description) {
  //let enemyName = document.createElement('div');
  //enemyName.innerText = name;
  //let details = document.createElement('div');
  //details.innerText = description;

  document.getElementById("enemy-name").innerHTML = name;
  document.getElementById("enemy-description").innerHTML = description;
}

/* HEALTH */
function updateEnemyHealth(newHP) {
  document.getElementById("enemy-hp").innerHTML = "health: " + newHP + "hp";
  gamestate.enemy.health = newHP;
}

function updatePlayerHealth(newHP) {
  document.getElementById("player-hp").innerHTML = "health: " + newHP + "hp";
  gamestate.player.health = newHP;
}

// Function to update the health bar
function updateHealthBar(value, elementId) {
  const healthBar = document.getElementById(elementId);
  healthBar.innerHTML = "";

  for (let i = 0; i < value; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    healthBar.appendChild(heart);
  }
}

function setHealth(enemyHP, playerHP) {
  //update health
  updateEnemyHealth(enemyHP);
  updatePlayerHealth(playerHP);
  let playerHealth = gamestate.player.health;
  let enemyHealth = gamestate.enemy.health;
  updateHealthBar(playerHealth, "healthBar");
  updateHealthBar(enemyHealth, "healthBar2");
  if (playerHP <= 0) {
      printChat("Game Over!");
  }
}

/* main */
printChat("player is using " + gamestate.player.weapon.name + "!\n");
//add ability
for(let i = 0; i < gamestate.player.weapon.abilities.length; i++) {
  addAbility(gamestate.player.weapon.abilities[i].name, gamestate.player.weapon.abilities[i].effect);
}
//add enemy
addEnemy(gamestate.enemy.what.name, gamestate.enemy.what.description);
//set health
setHealth(5, 10);
setHealth(3, 10);

document.getElementById("loadingindicator").style.visibility = "hidden";
