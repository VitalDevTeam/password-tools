/**
 * Password Generator (Strong)
 * https://github.com/aleksandr-rakov/password-generator
 */
var passwordGeneratorStrong = (function($) {
    var ret = {};

    // Show output of length slider input
    function outputUpdate(vol) {
        document.getElementById('pw-length-output').innerHTML = vol;
    }

    function refreshpw() {
        var length = document.getElementById('pw-length-output').innerHTML;
        genpw('pw-generator-output', length,'arg1','arg2','arg3','arg4');
    }

    function genpw(id, plen, arg1, arg2, arg3, arg4) {
        var obj = document.getElementById(id);
        obj.value = GeneratePassword(plen,arg1,arg2,arg3,arg4);
    }

    function GeneratePassword(length, arg1, arg2, arg3, arg4) {
        var res = '';
        var str='';
        var str1='qwertyuioplkjhgfdsazxcvbnm';
        var str2='QWERTYUIOPLKJHGFDSAZXCVBNM';
        var str3='1234567890';
        var str4='!@#$%^&*.,';

        if (arg1) { str=str+str1; }
        if (arg2) { str=str+str2; }
        if (arg3) { str=str+str3; }
        if (arg4) { str=str+str4; }

        for (var i = 0; i < length; i++) {
            var j = getRandomNum(str.length);
            res = res + str.charAt(j);
        }
        return res;
    }

    function getRandomNum(cnt) {
        var rndNum = Math.random();
        rndNum = parseInt(rndNum * cnt);
        return rndNum;
    }

    function onDocumentReady() {

        // Generate password on page load
        refreshpw();

        var pwOutput = document.getElementById('pw-generator-output');
        pwOutput.addEventListener('click', function() {
            this.select();
        });

        // Generate password on button click
        $('#pw-generator-submit').on('click', function(event) {
            event.preventDefault();
            refreshpw();
        });

		// Generate password when Number of Characters input is changed
		$('#pw-length-input').on('change', function(event) {
			refreshpw();
		});

    }

    ret = {
        outputUpdate: function(arg) {
            return outputUpdate(arg);
        }
    };

    $(onDocumentReady);

    return ret;

})(jQuery);
