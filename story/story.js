document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    const sidebar = document.getElementById('sidebar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const eventPageContent = document.getElementById('eventPageContent');

    let lastScrollY = window.scrollY;
    let isHeaderHidden = false;
    const scrollThreshold = 50;

    const homeButton = document.getElementById('homeButton');
    const renamePlayerButton = document.getElementById('renamePlayerButton');

    let playerName = localStorage.getItem('playerName') || 'Player';

    // header bullshit
    window.addEventListener('scroll', () => {
        if (sidebar.classList.contains('open')) {
            return;
        }

        if (window.scrollY > lastScrollY && window.scrollY > scrollThreshold) {
            if (!isHeaderHidden) {
                mainHeader.classList.add('header-hidden');
                isHeaderHidden = true;
            }
        } else if (window.scrollY < lastScrollY) {
            if (isHeaderHidden) {
                mainHeader.classList.remove('header-hidden');
                isHeaderHidden = false;
            }
        }
        lastScrollY = window.scrollY;
    });

    // sidebar
    hamburgerMenu.addEventListener('click', () => {
        toggleSidebar();
    });

    sidebarOverlay.addEventListener('click', () => {
        toggleSidebar();
    });

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        hamburgerMenu.classList.toggle('open');
        sidebarOverlay.classList.toggle('open');

        if (sidebar.classList.contains('open')) {
            if (window.innerWidth > 768) {
                 eventPageContent.classList.add('shifted');
            }
        } else {
            eventPageContent.classList.remove('shifted');
        }
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            eventPageContent.classList.remove('shifted');
        } else if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
            eventPageContent.classList.add('shifted');
        }
    });

    // reduce the length of the stuff I have to copy
    function populateCharacterDialogueBoxes() {
        document.querySelectorAll('.character-dialogue-box').forEach(dialogueBox => {
            if (dialogueBox.querySelector('.character-avatar') || !dialogueBox.dataset.characterName) {
                return;
            }

            const characterName = dialogueBox.dataset.characterName;
            const characterAvatar = dialogueBox.dataset.characterAvatar;
            const dialogueTextP = dialogueBox.querySelector('.dialogue-text');

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('character-avatar');
            const avatarImg = document.createElement('img');
            avatarImg.src = characterAvatar;
            avatarImg.alt = characterName;
            avatarDiv.appendChild(avatarImg);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('dialogue-content');
            const nameP = document.createElement('p');
            nameP.classList.add('character-name');
            nameP.textContent = characterName;

            contentDiv.appendChild(nameP);
            if (dialogueTextP) {
                contentDiv.appendChild(dialogueTextP);
            }

            dialogueBox.prepend(contentDiv);
            dialogueBox.prepend(avatarDiv);

            dialogueBox.style.display = 'flex';
        });
    }

    // sleepy mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // story loading
    async function loadStory(jsonPath) {
      try {
          const response = await fetch(jsonPath);
          const storyData = await response.json();

          eventPageContent.innerHTML = '';

          function renderDialogueItem(item, parentElement, isNested = false) {
              let dialogueBox;
              let displayText = item.text;

              if (displayText && typeof displayText === 'string') {
                  displayText = displayText.replace(/\[Player\]/g, playerName);
              }

              if (item.type === 'narrator') {
                  dialogueBox = document.createElement('div');
                  dialogueBox.classList.add('dialogue-box', 'narrator-box');
                  dialogueBox.innerHTML = `<p>${displayText}</p>`;
              } else if (item.type === 'character') {
                  dialogueBox = document.createElement('div');
                  dialogueBox.classList.add('dialogue-box', 'character-dialogue-box');
                  dialogueBox.setAttribute('data-character-name', item.name);
                  dialogueBox.setAttribute('data-character-avatar', item.avatar);
                  dialogueBox.innerHTML = `<p class="dialogue-text">${displayText}</p>`;
              } else if (item.type === 'note') {
                  dialogueBox = document.createElement('div');
                  dialogueBox.classList.add('dialogue-box', 'choice-display-box');
                  dialogueBox.innerHTML = `<p style="font-size: 0.8em; opacity: 0.5; font-style: italic; text-align: center;">${displayText}</p>`;
              } else if (item.type === 'title') {
                dialogueBox = document.createElement('div');
                  dialogueBox.classList.add('dialogue-box');
                  dialogueBox.innerHTML = `<p style="font-size: 1.5em; text-align: center;">${displayText}</p>`;
              }

              if (dialogueBox) {
                  if (isNested) {
                      dialogueBox.classList.add('nested-dialogue');
                  }
                  parentElement.appendChild(dialogueBox);
              }
          }

          storyData.forEach(item => {
              if (item.type === 'choice') {
                  const choiceBox = document.createElement('div');
                  choiceBox.classList.add('dialogue-box', 'choice-display-box');

                  if (item.prompt) {
                      let displayPrompt = item.prompt.replace(/\[Player\]/g, playerName);
                      choiceBox.innerHTML += `<p class="choice-prompt">${displayPrompt}</p>`;
                  }
                  if (item.note) {
                      let displayNote = item.note.replace(/\[Player\]/g, playerName);
                      choiceBox.innerHTML += `<p style="font-size: 0.8em; opacity: 0.5; font-style: italic; text-align: center;">${displayNote}</p>`;
                  }

                  const choiceOutcomesDiv = document.createElement('div');
                  choiceOutcomesDiv.classList.add('choice-outcomes');

                  item.options.forEach(option => {
                      const choiceBranchDiv = document.createElement('div');
                      choiceBranchDiv.classList.add('choice-branch');
                      
                      let displayOptionText = option.text.replace(/\[Player\]/g, playerName);
                      choiceBranchDiv.innerHTML = `<div class="choice-option-display">${displayOptionText}</div>`;

                      if (option.dialogue_after_selection && option.dialogue_after_selection.length > 0) {
                          option.dialogue_after_selection.forEach(nestedItem => {
                              renderDialogueItem(nestedItem, choiceBranchDiv, true);
                          });
                      }
                      choiceOutcomesDiv.appendChild(choiceBranchDiv);
                  });
                  choiceBox.appendChild(choiceOutcomesDiv);
                  eventPageContent.appendChild(choiceBox);
              } else {
                  renderDialogueItem(item, eventPageContent);
              }
          });

          populateCharacterDialogueBoxes();

      } catch (error) {
          console.error('Error loading story:', error);
          eventPageContent.innerHTML = '<p>Failed to load story content.</p>';
      }
    }

    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const htmlFileNameWithExtension = parts[parts.length - 1];
    const fileNameWithoutExtension = htmlFileNameWithExtension.split('.')[0];
    const jsonPath = `./${fileNameWithoutExtension}.json`;

    loadStory(jsonPath);

    // sending you to the shadow realm
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        window.location.href = '../../index.html';
      });
    }

    // rename
    if (renamePlayerButton) {
        renamePlayerButton.addEventListener('click', () => {
          const newName = prompt('Replace [Player] with a name of your choice:');
          if (newName !== null && newName.trim() !== '') {
            playerName = newName.trim();
            localStorage.setItem('playerName', playerName);
            alert(`Name has been updated to "${playerName}"!`);
            
            loadStory(jsonPath); 
          } else if (newName !== null) {
            alert('Nope. That cannot be empty.');
          }
        });
    }
});