function printChat(str1) {
  let messages = document.getElementById("chatbox")
  scrollToBottom = () => {
    messages.scrollTo(0, messages.scrollHeight);
  }

  let finalStr = '<p class="chatbox">' + str1 + '</p>';
  messages.insertAdjacentHTML("afterbegin", finalStr);
  scrollToBottom();
}

function addAbility(name, effect) {
  let button = document.createElement('button');
  button.innerText = name;
  button.style.cssText = 'flex: 1 1;max-width: 100px;'

  //test
  let details = document.createElement('span');
  details.innerText = effect;
  details.classList.add("tooltiptext");
  button.classList.add("tooltip");

  button.addEventListener('click', () => {
    printChat(effect);

    /* Add damage here */
  })
  document.getElementById("abilities").appendChild(button);
  button.appendChild(details);
}

function addEnemy(name, description) {
  let enemyName = document.createElement('div');
  enemyName.innerText = name;
  let details = document.createElement('div');
  details.innerText = description;

  document.getElementById("enemy-name").appendChild(enemyName);
  document.getElementById("enemy-description").appendChild(details);
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