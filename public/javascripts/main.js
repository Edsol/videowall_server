function confirmDialog(title, message, callback) {
    bootbox.confirm({
        title: title,
        message: message,
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm'
            }
        },
        callback: callback
    });
}

function successNotification(message) {
    new AWN().success(message)
}

function alertNotification(message) {
    new AWN().alert(message)
}

function urlIsValid(url) {
    var regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    if (url.match(regex) === null) {
        return false;
    } else {
        return true;
    }
}