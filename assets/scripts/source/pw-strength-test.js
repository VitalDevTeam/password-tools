/**
 * Password Strength Test
 * https://github.com/dropbox/zxcvbn
 */
var passwordStrengthTest = (function($) {
    var pwField;

    /**
     * Initialize the password strength meter
     */
    function initializeStrengthMeter() {
        $('#pw-test-score').PasswordStrengthManager({
            password: pwField.val(),
            advancedStrength: true
        });
    }

    /**
     * Get URL parameters
     * http://www.onlineaspect.com/2009/06/10/reading-get-variables-with-javascript/
     *
     * @param  {string} q Name of the parameter to get
     * @param  {string} s Static URL as string to get the parameters.
     *                    Leave empty to get current window location.
     * @return {string}   Value of variable
     */
    function getQueryVar(q, s) {
        s = s ? s : window.location.search;
        var re = new RegExp('&'+q+'(?:=([^&]*))?(?=&|$)','i');
        return (s=s.replace(/^\?/,'&').match(re)) ? (typeof s[1] === 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
    }

    function onDocumentReady() {
        pwField = $('#pw-test-input');

        // Initialize meter on key-up
        pwField.keyup(function() {
            initializeStrengthMeter();
        });

        // If "test" URL parameter exists
        if (getQueryVar('test')) {
            setTimeout(function() {
                $('.pw-test').addClass('pulse');
            }, 600);
            pwField.val(getQueryVar('test'));
            initializeStrengthMeter();
        }

    }

    $(onDocumentReady);

})(jQuery);