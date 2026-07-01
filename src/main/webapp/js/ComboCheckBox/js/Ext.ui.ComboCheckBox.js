Ext.ns('Ext.ux.util');
Ext.ux.util.MD5 = function(s) {
    var hexcase = 0;
    var chrsz = 8; 
    function safe_add(x, y){
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function bit_rol(num, cnt){
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function md5_cmn(q, a, b, x, s, t){
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
    }
    function md5_ff(a, b, c, d, x, s, t){
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t){
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t){
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t){
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function core_md5(x, len){
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;
        for(var i = 0; i < x.length; i += 16){
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }
    function str2binl(str){
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
        }
        return bin;
    }
    function binl2hex(binarray){
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    }
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
};  
 
Ext.ux.util.clone = function(o) {
	if(!o || 'object' !== typeof o) {
		return o;
	}
	if('function' === typeof o.clone) {
		return o.clone();
	}
	var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
	var p, v;
	for(p in o) {
		if(o.hasOwnProperty(p)) {
			v = o[p];
			if(v && 'object' === typeof v) {
				c[p] = Ext.ux.util.clone(v);
			}
			else {
				c[p] = v;
			}
		}
	}
	return c;
}; // eo function clone
 
Ext.ux.util.applyMatching = function(t, s) {
	var s = s || this;
	for(var p in t) {
		if(t.hasOwnProperty(p) && undefined !== s[p]) {
			t[p] = s[p];
		}
	}
	return t;
}; // eo function applyMatching
 
Ext.overrideIf = 'function' === typeof Ext.overrideIf ? Ext.overrideIf : function(origclass, overrides) {
	if(overrides) {
		var p = origclass.prototype;
		for(var method in overrides) {
			if(!p[method]) {
				p[method] = overrides[method];
			}
		}
	}
};
 
if('function' !== typeof RegExp.escape) {
	RegExp.escape = function(s) {
		if('string' !== typeof s) {
			return s;
		}
		
		return s.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
	};
}
Ext.overrideIf(RegExp, {
 
	 clone:function() {
		return new RegExp(this);
	} // eo function clone
});
 
Ext.overrideIf(Array, {
 
	 copy:function() {
		var a = [];
		for(var i = 0, l = this.length; i < l; i++) {
			a.push(this[i]);
		}
		return a;
	} // eo function copy
 
	,indexOf:function(v, b) {
		for(var i = +b || 0, l = this.length; i < l; i++) {
			if(this[i] === v) { 
				return i; 
			}
		}
		return -1;
	} // eo function indexOf
 
	,intersect:function() {
		if(!arguments.length) {
			return [];
		}
		var a1 = this, a2, a;
		for(var k = 0, ac = arguments.length; k < ac; k++) {
			a = [];
			a2 = arguments[k] || [];
			for(var i = 0, l = a1.length; i < l; i++) {
				if(-1 < a2.indexOf(a1[i])) {
					a.push(a1[i]);
				}
			}
			a1 = a;
		}
		return a.unique();
	} // eo function intesect
 
	,lastIndexOf:function(v, b) {
		b = +b || 0;
		var i = this.length; 
		while(i-- > b) {
			if(this[i] === v) { 
				return i; 
			}
		}
		return -1;
	} // eof function lastIndexOf
 
	,union:function() {
		var a = this.copy(), a1;
		for(var k = 0, ac = arguments.length; k < ac; k++) {
			a1 = arguments[k] || [];
			for(var i = 0, l = a1.length; i < l; i++) {
				a.push(a1[i]);
			}
		}
		return a.unique();
	} // eo function union
 
	,unique:function() {
		var a = [], i, l = this.length;
		for(i = 0; i < l; i++) {
			if(a.indexOf(this[i]) < 0) { 
				a.push(this[i]); 
			}
		}
		return a;
	} 
});




Ext.ns('Ext.ux.form');
Ext.ux.form.LovCombo = Ext.extend(Ext.form.ComboBox, {
 
	 checkField:'checked'
    ,separator:';'
    ,tip: false // check การสร้าง tooltip 
    ,showName: [] // เก็บค่า ชื่อรายการ
  
	,constructor:function(config) {
		config = config || {};
		config.listeners = config.listeners || {};
		Ext.applyIf(config.listeners, {
			 scope:this
			, beforequery:this.onBeforeQuery
			, blur:this.onRealBlur
			 
		});
		Ext.ux.form.LovCombo.superclass.constructor.call(this, config);
	}, // eo function constructor
 
    initComponent:function() {
 
		if(!this.tpl) {
			this.tpl =  ''
				+'<tpl for=".">'
				+'<tpl if="values.'+this.valueFields+' == 0">' 
					+'<div class="x-combo-list-item">'
					+'<img src="' + Ext.BLANK_IMAGE_URL + '" '
					+'class="ux-lovcombo-icon ux-lovcombo-icon-'
					+'{[values.' + this.checkField + '?"checked":"unchecked"' + ']}">'
					+'<div class="ux-lovcombo-item-text"> '+this.displayField+' </div>'
					+'</div>' 
					
				+'</tpl>'
				+'<tpl if="values.'+this.valueFields+' != 0">'
				
					+'<div class="x-combo-list-item">'
					+'<img src="' + Ext.BLANK_IMAGE_URL + '" '
					+'class="ux-lovcombo-icon ux-lovcombo-icon-'
					+'{[values.' + this.checkField + '?"checked":"unchecked"' + ']}">'
					+'<div class="ux-lovcombo-item-text">{' + (this.displayField || 'text' )+ ':htmlEncode}</div>'
					+'</div>'
				+'</tpl>'
				+'</tpl>'
			;
		}
 
        // call parent
        Ext.ux.form.LovCombo.superclass.initComponent.apply(this, arguments); 
		// remove selection from input field
		this.onLoad = this.onLoad.createSequence(function() {
			
			if(this.el) {
				var v = this.el.dom.value;
				this.el.dom.value = '';
				this.el.dom.value = v;
				
			}
		});
 
    } // eo function initComponent
    // }}}
	// {{{
	/**
	 * Disables default tab key bahavior
	 * @private
	 */
	,initEvents:function() {
		Ext.ux.form.LovCombo.superclass.initEvents.apply(this, arguments);
		// disable default tab handling - does no good
		this.keyNav.tab = false;

	} // eo function initEvents
	// }}}
	// {{{
	/**
	 * Clears value
	 */
	,clearValue:function() {
		
		
		this.value = '';
		this.setRawValue(this.value);
		this.store.clearFilter();
		
		this.store.each(function(r) {
			r.set(this.checkField, false);
		}, this);
		if(this.hiddenField) {
			this.hiddenField.value = '';
		}
		this.applyEmptyText();
	} // eo function clearValue
	// }}}
	// {{{
	/**
	 * @return {String} separator (plus space) separated list of selected displayFields
	 * @private
	 */
	,getCheckedDisplay:function() {
		
		var re = new RegExp(this.separator, "g");
		return this.getCheckedValue(this.displayField).replace(re, this.separator + ' ');
	} // eo function getCheckedDisplay
	// }}}
	// {{{
	/**
	 * @return {String} separator separated list of selected valueFields
	 * @private
	 */
	, getCheckedValue:function(field) {
		field = field || this.valueField;
		var c	= [];
		this.showName	= []; // NUT

		// store may be filtered so get all records
		var snapshot = this.store.snapshot || this.store.data;

		snapshot.each(function(r) {
			if(r.get(this.checkField)) {
				c.push(r.get(field));
				this.showName.push({ id : r.data.id, c_name : r.data.c_name}); // NUT
			}
		}, this);

		return c.join(this.separator);
	} // eo function getCheckedValue
	// }}}
	// {{{
	/**
	 * beforequery event handler - handles multiple selections
	 * @param {Object} qe query event
	 * @private
	 */
	,onBeforeQuery:function(q) {
		if (q.query) {
			var length = q.query.length;
			q.query = new RegExp(Ext.escapeRe(q.query));
			q.query.length = length;
		}
//		qe.query = qe.query.replace(new RegExp(RegExp.escape(this.getCheckedDisplay()) + '[ ' + this.separator + ']*'), '');
 
	} // eo function onBeforeQuery
	// }}}
	// {{{
	/**
	 * blur event handler - runs only when real blur event is fired
	 * @private
	 */
 
	,onRealBlur:function() {
		
		var str	= "";
		var i	= 0;
		
		$.each(this.showName, function( index, obj ) {
			str	+= "- "+obj.c_name+"<br>";
			i++;
		});
		if(i > 0) {
			Ext.example.msg('รายการ', str, 2);
			this.emptyText	= "รายการที่เลือก ("+i+")";
		} else {
			this.emptyText	= "กรุณาเลือก...";
		}
		
//		this.list.hide();
//		var rv = this.getRawValue();
//		var rva = rv.split(new RegExp(RegExp.escape(this.separator) + ' *'));
//		var va = [];
//		var snapshot = this.store.snapshot || this.store.data;
// 
//		Ext.each(rva, function(v) { 
//			snapshot.each(function(r) {
//				if(v === r.get(this.displayField)) { 
//					va.push(r.get(this.valueField)); 
//				}
//			}, this);
//		}, this);
//		this.setValue(va.join(this.separator));
//		this.store.clearFilter();
	} // eo function onRealBlur
	// }}}
	// {{{
	/**
	 * Combo's onSelect override
	 * @private
	 * @param {Ext.data.Record} record record that has been selected in the list
	 * @param {Number} index index of selected (clicked) record
	 */
	,onSelect:function(record, index) {
        if(this.fireEvent('beforeselect', this, record, index) !== false){ 
			// toggle checked field
			record.set(this.checkField, !record.get(this.checkField)); 

			// NUT ทำการเช็ค ALL เพื่อเลือกทั้งหมด
			if(this.selectedIndex == 0 && record.data[this.valueField] == 0){
            	if(this.getCheckedValue()==0){
					this.selectAll();
				} else {
					this.deselectAll();
				}
			}else  if (this.store.data.items[0].id == 0)
            {
            	var chk	= true;
            	//console.log(this.store.data['id'].length);
            	this.store.each(function(record){
                    // toggle checked field
            		if(record.data[this.valueField]>0 && record.data.checked == false || record.data.checked == undefined){
            			chk	= false;
                	}
                }, this);
            	this.store.data.items[0].set('checked', chk);
            }
			//=============================

			// display full list
			if(this.store.isFiltered()) {
				//this.doQuery(this.allQuery);
			}
			 
			// set (update) value and fire event
			this.setValue(this.getCheckedValue()); 
            this.fireEvent('select', this, record, index); 
        //=============================          
        } 
	} // eo function onSelect
	,setValue:function(v) {
		if(v){
			v = '' + v;
			
			if(this.valueField) {
// NUT Filter ไม่ต้องเคลียใหม่				this.store.clearFilter();
				this.store.each(function(r) {
					var checked = !(!v.match(
						 '(^|' + this.separator + ')' + RegExp.escape(r.get(this.valueField))
						+'(' + this.separator + '|$)'))
					;

					r.set(this.checkField, checked);
				}, this);
				this.value = this.getCheckedValue();
//				this.setRawValue(this.getCheckedDisplay());
				if(this.hiddenField) {
					this.hiddenField.value = this.value;
				}
			}
			else {
				this.value = v;
//				this.setRawValue(v);
				if(this.hiddenField) {
					this.hiddenField.value = v;
				}
			}
			if(this.el) {
				this.el.removeClass(this.emptyClass);
			}
		}
		else {
			this.clearValue();
		}
	} // eo function setValue
	,selectAll:function() {
 
        this.store.each(function(record){
        		record.set(this.checkField, true); 
        }, this);

        //display full list
        this.doQuery(this.allQuery);
        this.setValue(this.getCheckedValue());
    } // eo full selectAll
     , deselectAll: function () {
		this.clearValue();
    } // eo full deselectAll 
	// }}}

}); // eo extend
 
// register xtype
Ext.reg('lovcombo', Ext.ux.form.LovCombo);  
Ext.BLANK_IMAGE_URL = '../js/ext-3.4.0/resources/images/default/s.gif'; 

Ext.override(Ext.ux.form.LovCombo, {
	beforeBlur: Ext.emptyFn
});

