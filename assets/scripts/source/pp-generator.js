/**
 * Passphrase Generator
 * https://www.fourmilab.ch/javascrypt/pass_phrase.html
 */
var passPhraseGenerator = (function($) {
    /* jshint ignore:start */

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

    /* jshint ignore:end */

})(jQuery);
