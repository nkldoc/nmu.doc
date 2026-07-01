Ext.form.IdCardField = Ext.extend(Ext.form.TextField,  {
    fieldClass: "x-form-field x-form-num-field",
    allowDecimals : true,
    decimalSeparator : ".",
    decimalPrecision : 2,
    allowNegative : true,
    minValue : Number.NEGATIVE_INFINITY,
    maxValue : Number.MAX_VALUE,
    minText : "The minimum value for this field is {0}",
    maxText : "The maximum value for this field is {0}",
    nanText : "{0} is not a valid number",
    baseChars : "0123456789",
    autoStripChars: false,
    initEvents : function() {
        var allowed = this.baseChars + '';
        if (this.allowDecimals) {
            allowed += this.decimalSeparator;
        }
        allowed = Ext.escapeRe(allowed);
        this.maskRe = new RegExp('[' + allowed + ']');
        if (this.autoStripChars) {
            this.stripCharsRe = new RegExp('[^' + allowed + ']', 'gi');
        }
        Ext.form.IdCardField.superclass.initEvents.call(this);
    },
    getErrors: function(value) {
        var errors = Ext.form.IdCardField.superclass.getErrors.apply(this, arguments);
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
        if (value.length < 1) { 
             return errors;
        }
        value = String(value).replace(this.decimalSeparator, ".");
        if(isNaN(value)){
            errors.push(String.format(this.nanText, value));
        }
        var num = this.parseValue(value);
        if (num < this.minValue) {
            errors.push(String.format(this.minText, this.minValue));
        }
        if (num > this.maxValue) {
            errors.push(String.format(this.maxText, this.maxValue));
        }
        return errors;
    },
    getValue : function() {
    	return Ext.form.IdCardField.superclass.getValue.call(this);
    },
    setValue : function(v) {
    	return Ext.form.IdCardField.superclass.setValue.call(this, v);
    },
    setMinValue : function(value) {
        this.minValue = Ext.num(value, Number.NEGATIVE_INFINITY);
    },
    setMaxValue : function(value) {
        this.maxValue = Ext.num(value, Number.MAX_VALUE);    
    },
    parseValue : function(value) {
        value = parseFloat(String(value).replace(this.decimalSeparator, "."));
        return isNaN(value) ? '' : value;
    },
    fixPrecision : function(value) {
        var nan = isNaN(value);
        if (!this.allowDecimals || this.decimalPrecision == -1 || nan || !value) {
            return nan ? '' : value;
        }
        console.log(value);
        return parseFloat(parseFloat(value).toFixed(this.decimalPrecision));
    },
    beforeBlur : function() {
        var v = this.getRawValue();
        if (!Ext.isEmpty(v)) {
            this.setValue(v);
        }
    }
});
Ext.reg('idcardfield', Ext.form.IdCardField);