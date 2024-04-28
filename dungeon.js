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

/* hover */
// Function to add hover tooltip for an element
function addHoverTooltip(string, elementId) {
  // Get the element to hover over
  const hoverElement = document.getElementById(elementId);

  // Create a tooltip element
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.textContent = string;
  document.body.appendChild(tooltip);

  // Event listener for mouse hover
  hoverElement.addEventListener('mouseover', function(event) {
    // Show tooltip
    tooltip.style.display = 'block';
    // Set tooltip position
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
  });

  // Event listener for mouse move (to keep the tooltip following the mouse)
  hoverElement.addEventListener('mousemove', function(event) {
    // Set tooltip position
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
  });

  // Event listener for mouse out
  hoverElement.addEventListener('mouseout', function() {
    // Hide tooltip
    tooltip.style.display = 'none';
  });
}

// Call the function to pair string with hover effect for element 1
addHoverTooltip(gamestate.player.weapon.abilities[0].effect, 'hoverElement1');

// Call the function to pair string with hover effect for element 2
addHoverTooltip(gamestate.player.weapon.abilities[1].effect, 'hoverElement2');

/* main */
printChat("player is using " + gamestate.player.weapon.name + "!\n");
for(let i = 0; i < gamestate.player.weapon.abilities.length; i++) {
  addAbility(gamestate.player.weapon.abilities[i].name, gamestate.player.weapon.abilities[i].effect);
}
