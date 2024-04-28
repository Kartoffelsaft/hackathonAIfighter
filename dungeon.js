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
  button.addEventListener('click', () => {
    printChat(effect);

    /* Add damage here */
  })
  document.getElementById("abilities").appendChild(button);
}

/* main */
printChat("player is using " + gamestate.player.weapon.name + "!\n");
for(let i = 0; i < gamestate.player.weapon.abilities.length; i++) {
  addAbility(gamestate.player.weapon.abilities[i].name, gamestate.player.weapon.abilities[i].effect);
}