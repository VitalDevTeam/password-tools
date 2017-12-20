/**
 * Password Generator (Memorable)
 * http://www.dinopass.com/api
 */
var passwordGeneratorMemorable = (function($) {
    var memPasswordSubmit, memPasswordOutput;

	/**
	 * Generates a random memorable password using the WornNik API
	 */
    function getMemorablePassword() {
        var request = new XMLHttpRequest();

        request.open('GET', 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=4&limit=2&api_key=e6243ae1ce542700b82e51599530d5e76669c3e585635f6b7', true);

        request.onload = function() {
            var pw = '',
				specialChars = ['!', '@', '#', '$', '%', '&', '?'];
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                for (var i in data) { // jshint ignore:line
                    pw += data[i].word + '-';
                }
                pw += Math.floor(Math.random() * 90 + 10);
                memPasswordOutput.value = pw;
				memPasswordSubmit.removeAttribute('disabled');
            } else {
                memPasswordOutput.value = "Damn thing is busted.";
				memPasswordSubmit.removeAttribute('disabled');
            }
        };

        request.onerror = function() {
            memPasswordOutput.value = "Damn thing is busted.";
        };

        request.send();
    }

    function onDocumentReady() {
        memPasswordSubmit = document.getElementById('pw-generator-mem-submit');
        memPasswordOutput = document.getElementById('pw-generator-mem-output');

        getMemorablePassword();

        memPasswordOutput.addEventListener('click', function() {
            this.select();
        });

        memPasswordSubmit.addEventListener('click', function() {
			memPasswordSubmit.setAttribute('disabled', 'true');
			getMemorablePassword();
		});
    }

    $(onDocumentReady);

})(jQuery);
