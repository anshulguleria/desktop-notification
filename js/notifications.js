// iife to control global variables
(function () {
    function getPermissions(callback) {
        // request permission if not already granted
        Notification.requestPermission(function (status) {
            // `permission` property in `Notification` is `readonly`
            // but since chrome < 32 and safari dosen't support
            // it yet thus we need to add some manual handling
            if(Notification.permission !== status) {
                Notification.permission = status;
            }
            typeof(callback) === 'function' && callback();
        });
    }
    // ask permission initially
    getPermissions();

    function showNotification(title, options) {
        if(!("Notification" in window)) {
            console.log('Desktop notification not supported in your browser.');
            alert(title);
        } else {
            // initialize notification
            initializeNotification(title, options);
        }

        function initializeNotification (title, options) {
            var notify = null;
            if(Notification.permission === 'granted') {
                notify = new Notification(title, options);
            }

            // if user hasn't told if he wants to be notified
            // or not.
            // Since chrome dosen't support this `permission` property
            // thus we can't directly check for permission as `default`
            // we need to check for !denied
            else if(Notification.permission !== "denied") {
                getPermissions(function () {
                    if(Notification.permission === 'granted') {
                        notify = new Notification(title, options);
                    } else {
                        // either user rejected or he hasn't decided yet
                        // either way don't bug him more
                    }
                });
            } else {
                // user denied our notification request
            }
        }
    }

    window.showNotification = showNotification;
})();
