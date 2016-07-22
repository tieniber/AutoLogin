/*global logger*/
/*
    AutoLogin
    ========================

    @file      : AutoLogin.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Thu, 16 Jun 2016 03:19:58 GMT
    @copyright :
    @license   : MIT

    Documentation
    ========================
    A Mendix widget that works alongside the AutoLogin module to convert a user from anonymous to registered.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/_base/lang"
], function(declare, _WidgetBase, dojoLang) {
    "use strict";

    // Declare widget's prototype.
    return declare("AutoLogin.widget.AutoLogin", [_WidgetBase], {

        // Parameters configured in the Modeler.
        fallbackMicroflow: "",
        loginUUIDAttribute: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _context: null,

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            this._context = obj;

            if (this._context && this.loginUUIDAttribute) {
                var parameters = {
                    loginToken: this._context.get(this.loginUUIDAttribute)
                };

                var xhrArgs = {
                    url: mx.remoteUrl + "login/",
                    handleAs: "text",
                    content: parameters,
                    load: function(data) {
                        location.reload();
                    },
                    error: dojoLang.hitch(this, function(error) {
                        mx.data.action({
                            params: {
                                applyto: "none",
                                actionname: this.fallbackMicroflow
                            },
                            store: {
                                caller: this.mxform
                            },
                            callback: function(obj) {
                                //TODO what to do when all is ok!
                            },
                            error: dojoLang.hitch(this, function(error) {
                                console.log(this.id + ": An error occurred while executing microflow: " + error.description);
                            })
                        }, this);
                    }),
                    withCredentials: true
                };

                var deferred = dojo.xhrPost(xhrArgs);
                //mx.redirect(mx.remoteUrl + "login/" + window.localStorage.loginToken);
            }
            callback();
        }
    });
});

require(["AutoLogin/widget/AutoLogin"]);
