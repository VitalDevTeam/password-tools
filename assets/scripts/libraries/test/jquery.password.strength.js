;(function ($, window, document, undefined) {

    var pluginName = 'PasswordStrengthManager',

    defaults = {
        password: '',
        blackList: [],
        advancedStrength : false
    };

    function Plugin (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();

        this.info = '';
    }

    Plugin.prototype = {
        init: function () {

            var strength =  '';
            strength = zxcvbn(this.settings.password, this.settings.blackList);

            // console.log(strength);

            switch(strength.score) {
                case 0:
                    this.info = '<p>This password is <strong>incredibly weak</strong> and would be cracked <strong>instantly</strong>.</p>';
                    break;
                case 1:
                    this.info = '<p>This password is <strong>very weak</strong> and could be cracked in <strong>' + strength.crack_time_display + '</strong>.</p>';
                    break;
                case 2:
                    this.info = '<p>This password is <strong>weak</strong> and could be cracked in <strong>' + strength.crack_time_display + '</strong>.</p>';
                    break;
                case 3:
                    this.info = '<p>This password is <strong>okay</strong> but would take <strong>' + strength.crack_time_display + '</strong> to crack.</p>';
                    break;
                case 4:
                    if (this.settings.advancedStrength) {
                        var crackTime = String(strength.crack_time_display);
                        if (crackTime.indexOf('years') !=-1) {
                            this.info = '<p>This password is <strong>very strong</strong> and would take <strong>' + strength.crack_time_display + '</strong> to crack.</p>';
                        } else if (crackTime.indexOf('centuries') !=-1) {
                            this.info = '<p>This password is <strong>super strong</strong> and would take <strong>' + strength.crack_time_display + '</strong> to crack!</p>';
                        }
                    } else {
                        this.info = '<p>This password is <strong>strong</strong> and would take <strong>' + strength.crack_time_display + '</strong> to crack.</p>';
                    }
                    break;
            }

            $(this.element).html(this.info);
            $(this.element).attr('data-score', strength.score);
            $(this.element).closest('#pw-test-field').attr('data-score', strength.score);

            if (this.settings.password.length < 1) {
                $(this.element).empty();
                $(this.element).removeAttr('data-score');
                $(this.element).closest('#pw-test-field').removeAttr('data-score');
            }

        }

    };

    $.fn[pluginName] = function (options) {
        this.each(function() {
            //if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            //}
        });
        return this;
    };

})( jQuery, window, document );