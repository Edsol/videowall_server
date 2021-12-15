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