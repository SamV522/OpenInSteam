const supportedHostnames = [
    "https://store.steampowered.com/*",
    "http://store.steampowered.com/*",
    "https://steamcommunity.com/*",
    "http://steamcommunity.com/*"
  ];

const supportedSuffixes = [
    "store.steampowered.com",
    "steamcommunity.com"
];

function openSteamUrl(url)
{
    chrome.tabs.create({url:`steam://openurl/${url}`})
}

const linkId = 'open-in-steam-link';
const closeTabAfterActionId = 'open-in-steam-action-closeAfterAction;'
const closeTabAfterLinkId = 'open-in-steam-action-closeAfterLink;'

let settings = {
    closeTabAfterLink: false,
    closeTabAfterAction: false
};

function saveOptions()
{
    chrome.storage.sync.set(settings);
}

function restoreOptions()
{
    chrome.storage.sync.get(settings,
    (items) =>
    {
        settings = items;
    });
}

function restoreOptions(callback)
{
    chrome.storage.sync.get(settings,
    (items) =>
    {
        settings = items;
        callback(items);
    });
}

const linkContextMenuProps = {
    id: linkId,
    title: 'Open in Steam',
    contexts: ['link'],
    targetUrlPatterns: supportedHostnames,
    visible: true
}

chrome.contextMenus.create(
    linkContextMenuProps,
    () => {
        console.log(`Added link context menu item '${linkContextMenuProps.title}'`);
    }
  )

restoreOptions(
    (restoredSettings) =>
    {

        const actionMenuItems = [
            {
                id: closeTabAfterActionId,
                title: 'Close Tab after Opening from Action Button',
                checked: settings.closeTabAfterAction,
                type: "checkbox",
                contexts: ['action'],
                visible: true
            },
            {
                id: closeTabAfterLinkId,
                title: 'Close Tab after Opening from Link',
                checked: settings.closeTabAfterLink,
                type: "checkbox",
                contexts: ['action'],
                visible: true
            }
        ];

        actionMenuItems.forEach(item =>
            {
                chrome.contextMenus.create(
                    item,
                    () => {
                        console.log(`Added action context menu item '${item.title}'`)
                    }
                )
            });
    }
);

chrome.contextMenus.onClicked.addListener(
    (info, tab) =>
    {
        switch(info.menuItemId)
        {
            case linkId:
                openSteamUrl(info.linkUrl);
                if (settings.closeTabAfterLink)
                {
                    chrome.tabs.remove(tab.id);
                }
                break;
            case closeTabAfterActionId:
                settings.closeTabAfterAction = info.checked;
                break;
            case closeTabAfterLinkId:
                settings.closeTabAfterLink = info.checked;
                break;
            default:
                // nothin
        }
        saveOptions();
    }
)

chrome.action.onClicked.addListener(
    tab => 
    {
        openSteamUrl(tab.url);
        if (settings.closeTabAfterAction)
        {
            chrome.tabs.remove(tab.id);
        }
    }
)

chrome.runtime.onInstalled.addListener(() => {
    // Page actions are disabled by default and enabled on select tabs
    chrome.action.disable();
  
    // Clear all rules to ensure only our expected rules are set
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      // Declare a rule to enable the action on example.com pages

      let rules = []

      supportedSuffixes.forEach(element => 
        {
            let rule = {
              conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: {hostSuffix: element},
                })
              ],
              actions: [new chrome.declarativeContent.ShowAction()],
            };
            
            rules.push(rule)
        });
  
      // Finally, apply our new array of rules
      chrome.declarativeContent.onPageChanged.addRules(rules);
    });
  });