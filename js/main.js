jQuery(document).ready(function ($) {

    /**
     * Password Test
     * https://github.com/dropbox/zxcvbn
     */

    var $password = $('#pw-test-input');

    $(function() {
        $password.keyup(function(){
            initializeStrengthMeter();
        });
    });

    function initializeStrengthMeter(){
        $('#pw-test-score').PasswordStrengthManager({
            password: $password.val(),
            advancedStrength : true
        });
    }

    $password.showPassword();

    $('#pw-test-show').change(function(){
        $password.togglePassword();
    });

});

/**
 * Passphrase Generator
 * https://www.fourmilab.ch/javascrypt/pass_phrase.html
 */

jQuery(document).ready(function ($) {

    // Generate entropy and first passphrase on page load
    ce();
    mouseMotionEntropy(60);
    vitalPassphraseGenerate();

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

});

// Generate entropy on all mouse clicks
var pageBody = document.getElementById('page-body');
pageBody.addEventListener('click', ce);

function vitalPassphraseGenerate() {
    Generate_seed();
    GeneratePassPhrases();
}

var prng;
var seed;

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


/**
 * Password Generator Toggle
 */

jQuery(document).ready(function ($) {

    var $toggle     = $('#pw-type-current'),
        $options    = $('#pw-type-options'),
        $optionItem = $('.type-option-item'),
        $option     = $('.type-option'),
        $parent     = $('#pw-generator');

    $toggle.on('click', function(event) {
        event.preventDefault();

        if ($parent.hasClass('toggle-active')) {
            $parent.removeClass('toggle-active');
        } else {
            $parent.addClass('toggle-active');
        }
    });

    $option.on('click', function(event) {
        event.preventDefault();

        var $el  = $(this),
            type = $el.attr('href').slice(1),
            text = $el.text();

        $parent.removeClass('toggle-active');
        $toggle.text(text);
        $optionItem.removeClass('active');
        $el.closest($optionItem).addClass('active');
        $('.pw-generator-type').hide();
        $('#' + type).show();

    });

});


/**
 * Password Generator (Strong)
 * https://github.com/aleksandr-rakov/password-generator
 */

jQuery(document).ready(function ($) {

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

});


// Show output of length slider input
function outputUpdate(vol) {
    document.getElementById('pw-length-output').innerHTML = vol;
}

var pw_len;

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


/**
 * Password Generator (Memorable)
 * http://www.dinopass.com/api
 */

var memPassordSubmit = document.getElementById('pw-generator-mem-submit'),
    memPasswordOutput = document.getElementById('pw-generator-mem-output');

memPasswordOutput.addEventListener('click', function() {
    this.select();
});

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

jQuery(document).ready(function ($) {

    getMemorablePassword();

});

memPassordSubmit.addEventListener('click', getMemorablePassword);