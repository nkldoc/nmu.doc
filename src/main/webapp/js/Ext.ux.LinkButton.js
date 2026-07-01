Ext.ns('Ext.ux.Button');	
Ext.ux.LinkButton = Ext.extend(Ext.Button, {
    config: {  
    	   href:'',  
    	   target:'', 
    	   params:'',
    	  },  
    	  initComponent: function () {
    		  
    	    this.on('click', function(){  	
	    	    var result 		= [];
	    	    var resultUrl 	= 'mode=export';
	    	    var json_data 	= this.params; 
	    	    
	    	    for(var i in json_data){ 
//	    	        result.push([i, json_data[i]]);
	    	        resultUrl+='&'+i+'='+json_data[i];
	    	    }
//	    	    console.log(result);
	    	    
	    	    window.open(this.href+(Ext.isEmpty(this.params) || ''?'':'?'+resultUrl),this.target); 
	    	    window.focus();   
    	   });  
    	  }  
	});  
Ext.reg( "ux-linkbutton", Ext.ux.LinkButton);