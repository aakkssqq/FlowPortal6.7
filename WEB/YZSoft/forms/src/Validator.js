
Ext.define('YZSoft.forms.src.Validator', {
    singleton: true,

    init: function (agent) {
        var me = this;

        me.agent = agent;
        XValidatorOnLoad = me.validatorOnLoad.bind(me);
    },

    validatorGetValue: function (dom) {
        var me = this,
            dom = typeof (dom) == 'string' ? document.getElementById(dom) : dom,
            xel = me.agent.tryGetChechedEle(dom, true),
            value = xel.getValue();

        return (value == null || value == undefined) ? '' : value;
    },

    customValidatorEvaluateIsValid: function (val) {
        var value = ValidatorGetValue(val.controltovalidate);

        if ((ValidatorTrim(value).length == 0) &&
            ((typeof (val.validateemptytext) != "string") || (val.validateemptytext != "true"))) {
            return true;
        }

        var args = {
            Value: value, IsValid: true
        };

        if (typeof (val.clientvalidationfunction) == "string") {
            eval(val.clientvalidationfunction + "(val, args) ;");
        }

        return args.IsValid;
    },

    submitValidate: function (validationGroup) {
        var me = this;

        var doms = document.body.getElementsByTagName('*');
        if (typeof (Page_Validators) != 'undefined' && Page_Validators != null) {
            for (var i = 0; i < Page_Validators.length; i++) {
                if (me.itemValidate(doms, Page_Validators[i], validationGroup) === false)
                    return false;
            }
        }

        return true;
    },

    itemValidate: function (doms, val, validationGroup) {
        var me = this;

        if (val.enabled === false || val.disabled === true)
            return true;

        if (!me.isValidationGroupMatch(val, validationGroup))
            return true;

        if (typeof (val.evaluationfunction) != "function")
            return true;

        //保存验证对象的ID
        if (!val.controltovalidateSaved)
            val.controltovalidateSaved = val.controltovalidate;

        //获得验证对象的ID
        var controltovalidate = val.controltovalidateSaved;

        //复合控件中的子区域验证
        var validatePart = val.getAttribute('ValidationPart');
        if (validatePart)
            controltovalidate = controltovalidate + '_' + validatePart;

        var compexp;
        for (var i = 0, len = doms.length; i < len; i++) {
            var dom = doms[i];

            if (dom.id != controltovalidate &&
                dom.getAttribute('orgid') != controltovalidate)
                continue;

            val.controltovalidate = dom;

            compexp = val.getAttribute('DisableExpress');
            if (typeof (compexp) == 'string' && compexp.length != 0) {
                if (me.agent.calcExpress(dom, compexp))
                    continue;
            }

            compexp = val.getAttribute('ValueToCompareExpress');
            if (typeof (compexp) == 'string' && compexp.length != 0)
                val.valuetocompare = me.agent.calcExpress(dom, compexp).toString();

            compexp = val.getAttribute('MaxValueExpress');
            if (typeof (compexp) == 'string' && compexp.length != 0)
                val.maximumvalue = me.agent.calcExpress(dom, compexp).toString();

            compexp = val.getAttribute('MinValueExpress');
            if (typeof (compexp) == 'string' && compexp.length != 0)
                val.minimumvalue = me.agent.calcExpress(dom, compexp).toString();

            var isvalid = val.evaluationfunction(val);

            if (!isvalid) {
                me.reportError(dom, val.errormessage)
                return false;
            }
        }

        return true;
    },

    isValidationGroupMatch: function (control, validationGroup) {
        var controlGroup = control.validationGroup || '',
            validationGroups = (validationGroup || '').split(';');

        for (var i = 0; i < validationGroups.length; i++) {
            if (controlGroup == validationGroups[i])
                return true;
        }

        return false;
    },

    reportError: function (dom, errormessage) {
        if (!dom)
            return;

        var me = this,
            xel = me.agent.tryGetChechedEle(dom, true);

        if (dom.scrollIntoView)
            dom.scrollIntoView();

        xel.showErrorTip();

        var alt = function () {
            YZSoft.alert(errormessage, function () {
                xel.hideErrorTip();

                if (xel.selectInput)
                    xel.selectInput();
            });
        }

        Ext.defer(alt, 50);
    },

    //override .net ValidatorOnLoad
    validatorOnLoad: function () {
        var me = this;

        if (typeof (Page_Validators) == "undefined")
            return;

        //重载asp.net验证体系的ValidatorGetValue函数
        ValidatorGetValue = me.validatorGetValue.bind(me);
        CustomValidatorEvaluateIsValid = me.customValidatorEvaluateIsValid.bind(me);

        var i, val;
        for (i = 0; i < Page_Validators.length; i++) {
            val = Page_Validators[i];

            if (typeof (val.evaluationfunction) == "string")
                eval("val.evaluationfunction = " + val.evaluationfunction + ";");

            if (typeof (val.isvalid) == "string") {
                if (val.isvalid == "False") {
                    val.isvalid = false;
                    Page_IsValid = false;
                }
                else {
                    val.isvalid = true;
                }
            }
            else {
                val.isvalid = true;
            }

            if (typeof (val.enabled) == "string")
                val.enabled = (val.enabled != "False");
        }
        Page_ValidationActive = false;
    }
});