Ext.define('YZSoft.src.form.field.PasswordMeter', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.yzpasswordmeter',
    inputType: 'password',
    score: 0,
    minScope: 50,

    reset: function () {
        this.callParent(arguments);
        this.updateMeter('',true);
    },

    constructor: function (config) {
        var me = this,
            minScope = config.minScope || me.minScope;

        me.callParent(arguments);

        me.afterSubTpl = [
            '<div class="yz-passwordmeter-wrap" style="max-width:200px;">',
                '<div class="yz-passwordmeter-scorebar"></div>',
                '<div class="yz-passwordmeter-pass" style="left:' + minScope + '%"></div>',
            '</div>', {
                compiled: true,
                disableFormats: true
            }
        ];
    },

    onChange: function (newValue, oldValue) {
        this.updateMeter(newValue);
    },

    updateMeter: function (val,silence) {
        var me = this,
            maxWidth,
            score,
            scoreWidth,
            objMeter = me.el.down('.yz-passwordmeter-wrap'),
            scoreBar = me.el.down('.yz-passwordmeter-scorebar');

        maxWidth = objMeter.getWidth();
        score = me.score = me.calcStrength(val);
        scoreWidth = (maxWidth / 100) * score;
        scoreBar.setWidth(scoreWidth, true);

        if (!silence)
            me.validate();

        me.fireEvent('scoreChanged');
    },

    calcStrength: function (p) {
        var re_d = /\d/;
        var re_l = /[a-z]/;
        var re_u = /[A-Z]/;
        var re_y = /[\W_\-]/;
        var s = 0, cs = 0, cw = 1;
        var r = p.length - p.replace(new RegExp(/(\S+?)(\1+)/g), '$1').length;  //Length of repeated character sequences
        if (re_d.test(p)) { cs += 10; } //Increment the character set size if digits found
        if (re_l.test(p)) { cs += 26; } //Increment the character set size if lowercase letters found
        if (re_u.test(p)) { cs += 26; } //Increment the character set size if uppercase letters found
        if (re_y.test(p)) { cs += 32; } //Increment the character set size if special characters found
        cw = (cs / 94); //Proportion of the printable ASCII character set used
        if ((p.length - r) >= 4) { cw += ((1 - (cs / 94)) * (1 - (4 / (p.length - r)))); } //Weighting based on relationship between character set size and password length
        if (cw > 1) { cw = 1; } //Constrain the weighting value to the range 0-1
        s = (p.length - (r / 2)) * (cw * 6); //Score calculation
        if (s < 0) { s = 0; }; if (s > 100) { s = 100; } //Constrain the score to the range 0-100

        var r = Math.round(s * 2);

        if (r > 100)
            r = 100;

        return r;
    }
});