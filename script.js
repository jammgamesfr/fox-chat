document.addEventListener('DOMContentLoaded', function() {
    const createServerBtn = document.getElementById('createServerBtn');
    const serverList = document.getElementById('serverList');
    const channelList = document.getElementById('channelList');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    let currentServer = null;
    let currentChannel = null;

    // Create server functionality
    createServerBtn.addEventListener('click', function() {
        const serverName = prompt('Enter server name:');
        if (serverName) {
            const server = createServer(serverName);
            addServerToSidebar(server);
        }
    });

    // Create a server object
    function createServer(name) {
        return {
            name: name,
            channels: []
        };
    }

    // Add server to the sidebar
    function addServerToSidebar(server) {
        const serverItem = document.createElement('div');
        serverItem.classList.add('server');
        serverItem.innerHTML = `<button class="serverBtn">${server.name}</button>`;
        serverItem.querySelector('.serverBtn').addEventListener('click', function() {
            currentServer = server;
            displayChannels();
        });
        serverList.appendChild(serverItem);
    }

    // Display the channels for a selected server
    function displayChannels() {
        channelList.innerHTML = '';
        if (currentServer && currentServer.channels.length > 0) {
            currentServer.channels.forEach(function(channel) {
                const channelBtn = document.createElement('button');
                channelBtn.textContent = `# ${channel.name}`;
                channelBtn.addEventListener('click', function() {
                    currentChannel = channel;
                    displayMessages();
                });
                channelList.appendChild(channelBtn);
            });
        } else {
            const createChannelBtn = document.createElement('button');
            createChannelBtn.textContent = 'Create Channel';
            createChannelBtn.addEventListener('click', function() {
                const channelName = prompt('Enter channel name:');
                if (channelName) {
                    const channel = { name: channelName, messages: [] };
                    currentServer.channels.push(channel);
                    displayChannels();
                }
            });
            channelList.appendChild(createChannelBtn);
        }
    }

    // Display messages for the selected channel
    function displayMessages() {
        messagesContainer.innerHTML = '';
        if (currentChannel && currentChannel.messages.length > 0) {
            currentChannel.messages.forEach(function(msg) {
                const msgElement = document.createElement('div');
                msgElement.textContent = msg;
                messagesContainer.appendChild(msgElement);
            });
        }
    }

    // Send message functionality
    sendMessageBtn.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message && currentChannel) {
            currentChannel.messages.push(message);
            displayMessages();
            messageInput.value = '';
        }
    });
});
