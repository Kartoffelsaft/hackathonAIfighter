let messages = document.getElementById("chatbox")
scrollToBottom = () => {
  messages.scrollTo(0, messages.scrollHeight);
}

function printChat(str1) {
  let finalStr = '<div class="chatbox">' + str1  + '</div>';
  messages.insertAdjacentHTML("afterbegin", finalStr);
}

for(let index = 0; index < 10; index++) {
  printChat(index);
}
