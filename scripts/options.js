const settings = {
    closeTabAfterLink: false,
    closeTabAfterAction: false
};

const options = {
    closeTabAfterAction: 'CloseTabAfterAction',
    closeTabAfterLink: 'CloseTabAfterLink'
}

function saveOptions()
{
    Object.entries(settings).forEach(element => {
        settings[element[0]] = document.getElementById(options[element[0]]).checked
    });
    chrome.storage.sync.set(settings, () =>
    {
        showStatusMessage('Options Saved');
    })
}

function restoreOptions()
{
    chrome.storage.sync.get(settings,
    (items) =>
    {
        Object.entries(settings).forEach(element => {
            document.getElementById(options[element[0]]).checked = items[element[0]]
        });
        showStatusMessage('Options Restored');
    });
}

function showStatusMessage(message)
{
    console.log(`Status Message: ${message}`)
    var status = document.getElementById('Status');
    status.textContent = message;
    setTimeout(() => { 
        status.textContent = '';
    }, 750)
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('Save').addEventListener('click', saveOptions);
document.getElementById('Cancel').addEventListener('click', restoreOptions);
