/*
 * This pseudo-class implements new date format 'r' in Ext.Date singleton.
 *
 * The 'r' format represents date relative to today, i.e. 0 for today, -7 for a week ago
 * and +365 for a day one year in the future.
 *
 * Version 0.9, compatible with Ext JS 4.1
 *
 * Copyright (c) 2012 Alexander Tokarev.
 *  
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

// This is to fool Ext.Loader
Ext.define('Ext.ux.Date', {});

(function() {
    return function() {
        var origContainsDateInfo = Ext.Date.formatContainsDateInfo;
        
        Ext.Date.formatContainsDateInfo = function(format) {
            return format == 'r' ? true
                 :                 origContainsDateInfo.call(this, format)
                 ;
        };
        
        var origContainsHourInfo = Ext.Date.formatContainsHourInfo;
        
        /*
         * Semantics of this Ext.Date method are slightly too broad;
         * for example Ext.form.field.Date relies on it to decide if
         * it needs to clear time part from the resulting Date object.
         * Since we're dealing with it here by explicitly clearing time
         * it's better to declare this format as 'containing hour info'.
         */ 
        Ext.Date.formatContainsHourInfo = function(format) {
            return format == 'r' ? true
                 :                 origContainsHourInfo.call(this, format)
                 ;
        };
        
        Ext.Date.formatCodes['r'] = [
            "(",
                "Ext.Date.clearTime( this, true )",
                "-",
                "Ext.Date.clearTime( new Date() )",
            ")",
            "/",
            "86400000"
        ].join('');
        
        /*
         * This date format always needs to be strict as it's too easy
         * to break other things with it.
         */
        Ext.Date.parseFunctions['r'] = function(input) {
            var dt;
            
            if ( !Ext.isString(input) || !input.match(/^[-+]?\d+$/) ) {
                return null;
            };
            
            dt = Ext.Date.clearTime( new Date() );
            
            return Ext.Date.add(dt, Ext.Date.DAY, parseInt(input));
        };
    };
})()();
