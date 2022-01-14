const supportedHostnames = [
    "https://store.steampowered.com/*",
    "http://store.steampowered.com/*",
    "https://steamcommunity.com/*",
    "http://steamcommunity.com/*",
  ];

function openSteamUrl(url)
{
    chrome.tabs.create({url:`steam://openurl/${url}`})
}

const openInSteamContextMenuProperties = {
    id: 'open-in-steam',
    title: 'Open in Steam',
    contexts: ['link'],
    targetUrlPatterns: supportedHostnames,
    visible: true
}

chrome.contextMenus.create(
    openInSteamContextMenuProperties,
    () => {
        console.log('Added OpenInSteam to context menu');
    }
  )

chrome.contextMenus.onClicked.addListener(
    (info, tab) =>
    {
        openSteamUrl(info.linkUrl);
    }
)
