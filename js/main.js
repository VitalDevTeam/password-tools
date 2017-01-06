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

        // Toggle show password option by default
        pwField.showPassword();

        // Toggle show password on checkbox change
        $('#pw-test-show').change(function() {
            pwField.togglePassword();
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


/**
 * Passphrase Generator
 * https://www.fourmilab.ch/javascrypt/pass_phrase.html
 */
var passPhraseGenerator = (function($) {
    var pageBody, prng, seed;

    function vitalPassphraseGenerate() {
        Generate_seed();
        GeneratePassPhrases();
    }

    function setSeed() {
        var s = document.results.text.getAttribute('data-seed');
        var hexDigits = "0123456789abcdefABCDEF";
        var hs = "", i, bogus = false;

        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (hexDigits.indexOf(c) >= 0) {
                hs += c;
            } else {
                bogus = true;
            }
        }
        if (bogus) {
            alert("Error: Improper character(s) in hexadecimal key.");
        }
        if (hs.length > (keySizeInBits / 4)) {
            alert("Warning: hexadecimal key exceeds " + (keySizeInBits / 4) + " digit maximum; truncated.");
            // document.seed.text.value = hs = hs.slice(0, 64);
        } else {
            while (hs.length < (keySizeInBits / 4)) {
                hs += "0";
            }
        }
        seed =  hexToByteArray(hs);
    }

    function retrieveWord(length, index) {
        if ((length >= minw) && (length <= maxw) &&
            (index >= 0) && (index < nwords[length])) {
            return cwords[length].substring(length * index, length * (index + 1));
        }
        return "";
    }

    function indexWord(index) {
        if ((index >= 0) && (index < twords)) {
            var j;

            for (j = minw; j <= maxw; j++) {
            if (index < nwords[j]) {
                break;
            }
            index -= nwords[j];
            }
            return retrieveWord(j, index);
        }
        return "";
    }

    function GeneratePassPhrases() {
        var i, j, w;

        setSeed();

        prng = new AESprng(seed);

        document.results.text.value = "";

        for (i = 0; i < 1; i++) {

            var k = "", nw = 0;

            while (nw < document.results.text.getAttribute('data-howlong')) {

                if (k.length > 0) {
                    k += " ";
                }
                k += indexWord(prng.nextInt(twords));
                nw++;
            }

            document.results.text.value += k + "\n";

        }

        delete prng;

    }

    function Generate_seed() {
        var i, j, k = "";

        addEntropyTime();
        var seed = keyFromEntropy();

        var prng = new AESprng(seed);
        var hexDigits = "0123456789ABCDEF";

        for (i = 0; i < 64; i++) {
            k += hexDigits.charAt(prng.nextInt(15));
        }

        document.results.text.setAttribute('data-seed', k);

        delete prng;
    }

    function onDocumentReady() {
        pageBody = document.getElementById('page-body');

        // Generate entropy and first passphrase on page load
        ce();
        mouseMotionEntropy(60);
        vitalPassphraseGenerate();

        // Generate entropy on all mouse clicks
        pageBody.addEventListener('click', ce);

        // Disable default form action
        $('#pp-generator-form').on('submit', function(event) {
            event.preventDefault();
        });

        var ppOutput = document.getElementById('pp-generator-output');
        ppOutput.addEventListener('click', function() {
            this.select();
        });

        // Generate passphrase on button click
        $('#pp-generator-submit').on('click', function() {
            vitalPassphraseGenerate();
        });
    }

    $(onDocumentReady);

})(jQuery);


/**
 * Password Generator (Strong)
 * https://github.com/aleksandr-rakov/password-generator
 */
var passwordGeneratorStrong = (function($) {
    var ret = {}, pw_len;

    // Show output of length slider input
    function outputUpdate(vol) {
        document.getElementById('pw-length-output').innerHTML = vol;
    }

    function refreshpw() {
        var length = document.getElementById('pw-length-output').innerHTML;
        genpw('pw-generator-output', length,'arg1','arg2','arg3','arg4');
    }

    function genpw(id, plen, arg1, arg2, arg3, arg4) {
        obj = document.getElementById(id);
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

        for (i=0; i < length; i++) {
            j = getRandomNum(str.length);
            res = res + str.charAt(j);
        }
        return res;
    }

    function getRandomNum(cnt) {
        var rndNum = Math.random()
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

    }

    ret = {
        outputUpdate: function(arg) {
            return outputUpdate(arg);
        }
    };

    $(onDocumentReady);

    return ret;

})(jQuery);

/**
 * Password Generator (Memorable)
 * http://www.dinopass.com/api
 */
var passwordGeneratorMemorable = (function($) {
    var memPassordSubmit, memPasswordOutput;

    function getMemorablePassword() {
        var request = new XMLHttpRequest();

        request.open('GET', 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=4&limit=2&api_key=e6243ae1ce542700b82e51599530d5e76669c3e585635f6b7', true);

        request.onload = function() {
            var pw = '';
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                for (var i in data) {
                    pw += data[i].word;
                }
                pw += Math.floor(Math.random() * 90 + 10);
                memPasswordOutput.value = pw;
            } else {
                memPasswordOutput.value = "Damn thing is busted.";
            }
        };

        request.onerror = function() {
            memPasswordOutput.value = "Damn thing is busted.";
        };

        request.send();
    }

    function onDocumentReady() {
        memPassordSubmit = document.getElementById('pw-generator-mem-submit');
        memPasswordOutput = document.getElementById('pw-generator-mem-output');

        getMemorablePassword();

        memPasswordOutput.addEventListener('click', function() {
            this.select();
        });

        memPassordSubmit.addEventListener('click', getMemorablePassword);
    }

    $(onDocumentReady);

})(jQuery);
