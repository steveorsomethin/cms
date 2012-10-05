/*
  knockback.js 0.16.7 (full version)
  (c) 2011, 2012 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/(function(){return function(e){return typeof define=="function"&&define.amd?define("knockback",["underscore","backbone","knockout"],e):e.call(this)}(function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L=function(e,t){return function(){return e.apply(t,arguments)}};m=function(){function t(){}return t.VERSION="0.16.7",t.TYPE_UNKNOWN=0,t.TYPE_SIMPLE=1,t.TYPE_ARRAY=2,t.TYPE_MODEL=3,t.TYPE_COLLECTION=4,t.release=function(n,r){var i,s,u,a,f,l,c,h;if(!n||n!==Object(n)||typeof n=="function"&&!g.isObservable(n)||n.__kb_destroyed||n instanceof e.Model||n instanceof e.Collection)return this;if(b.isArray(n)){i=n.splice(0,n.length);for(f=0,c=i.length;f<c;f++)s=i[f],t.release(s);return this}n.__kb_destroyed=!0,!r||r();if(g.isObservable(n)||typeof n.dispose=="function"||typeof n.destroy=="function"||typeof n.release=="function")if(g.isObservable(n)&&b.isArray(i=n())){if(n.__kb_is_co||n.__kb_is_o&&n.valueType()===o)n.destroy?n.destroy():n.dispose&&n.dispose();else if(i.length){a=i.slice(0),i.splice(0,i.length);for(l=0,h=a.length;l<h;l++)u=a[l],t.release(u)}}else n.release?n.release():n.destroy?n.destroy():n.dispose&&n.dispose();else this.releaseKeys(n);return this},t.releaseKeys=function(e){var n,r;for(n in e)r=e[n],n==="__kb"||t.release(r,function(){return e[n]=null});return this},t.releaseOnNodeRemove=function(e,n){return e||T(this,"missing view model"),n||T(this,"missing node"),g.utils.domNodeDisposal.addDisposeCallback(n,function(){return t.release(e)})},t.renderTemplate=function(e,n,r){var i,s;return r==null&&(r={}),i=document.createElement("div"),s=g.renderTemplate(e,n,r,i,"replaceChildren"),i.children.length===1&&(i=i.children[0]),t.releaseOnNodeRemove(n,i),s.dispose(),i},t.renderAutoReleasedTemplate=function(e,t,n){return n==null&&(n={}),S("kb.renderAutoReleasedTemplate","0.16.3","Please use kb.renderTemplate instead"),this.renderTemplate(e,t,n={})},t.applyBindings=function(e,n){return g.applyBindings(e,n),t.releaseOnNodeRemove(e,n)},t}(),this.Knockback=this.kb=m,typeof exports!="undefined"&&(module.exports=m);if(!this._&&typeof require!="undefined")try{b=require("lodash")}catch(A){b=require("underscore")}else b=this._;return m._=b=b.hasOwnProperty("_")?b._:b,m.Backbone=e=!this.Backbone&&typeof require!="undefined"?require("backbone"):this.Backbone,m.ko=g=!this.ko&&typeof require!="undefined"?require("knockout"):this.ko,x=function(e,t){throw""+(b.isString(e)?e:e.constructor.name)+": "+t+" is missing"},T=function(e,t){throw""+(b.isString(e)?e:e.constructor.name)+": "+t+" is unexpected"},S=function(e,t,n){var r;return this._legacy_warnings||(this._legacy_warnings={}),(r=this._legacy_warnings)[e]||(r[e]=0),this._legacy_warnings[e]++,console.warn("warning: '"+e+"' has been deprecated (will be removed in Knockback after "+t+"). "+n+".")},E=Array.prototype.splice,C=g.utils.unwrapObservable,v=function(e){var t;t=b.clone(e);while(e.options)b.defaults(t,e.options),e=e.options;return delete t.options,t},f=m.TYPE_UNKNOWN,a=m.TYPE_SIMPLE,s=m.TYPE_ARRAY,u=m.TYPE_MODEL,o=m.TYPE_COLLECTION,k=function(e,t,n){return arguments.length===2?e&&e.__kb&&e.__kb.hasOwnProperty(t)?e.__kb[t]:void 0:(e||T(this,"no obj for wrapping "+t),e.__kb||(e.__kb={}),e.__kb[t]=n,n)},w=function(e,t){return E.call(e,1,0,t),e},N=function(e){var t,n,r;if(!e)return e;if(e.__kb)return"object"in e.__kb?e.__kb.object:e;if(b.isArray(e))return b.map(e,function(e){return N(e)});if(b.isObject(e)&&e.constructor==={}.constructor){n={};for(t in e)r=e[t],n[t]=N(r);return n}return e},m.utils=function(){function t(){}return t.wrappedObservable=function(e,t){return k.apply(this,w(arguments,"observable"))},t.wrappedObject=function(e,t){return k.apply(this,w(arguments,"object"))},t.wrappedModel=function(e,t){return arguments.length===1?(t=k(e,"object"),b.isUndefined(t)?e:t):k(e,"object",t)},t.wrappedStore=function(e,t){return k.apply(this,w(arguments,"store"))},t.wrappedStoreIsOwned=function(e,t){return k.apply(this,w(arguments,"store_is_owned"))},t.wrappedFactory=function(e,t){return k.apply(this,w(arguments,"factory"))},t.wrappedEventWatcher=function(e,t){return k.apply(this,w(arguments,"event_watcher"))},t.wrappedEventWatcherIsOwned=function(e,t){return k.apply(this,w(arguments,"event_watcher_is_owned"))},t.wrappedDestroy=function(e){var t;if(!e.__kb)return;return e.__kb.event_watcher&&e.__kb.event_watcher.releaseCallbacks(e),t=e.__kb,e.__kb=null,t.observable&&(t.observable.destroy=t.observable.release=null,this.wrappedDestroy(t.observable),t.observable=null),t.factory=null,t.event_watcher_is_owned&&t.event_watcher.destroy(),t.event_watcher=null,t.store_is_owned&&t.store.destroy(),t.store=null},t.valueType=function(t){return t?t.__kb_is_o?t.valueType():t.__kb_is_co||t instanceof e.Collection?o:t instanceof m.ViewModel||t instanceof e.Model?u:b.isArray(t)?s:a:f},t.pathJoin=function(e,t){return(e?e[e.length-1]!=="."?""+e+".":e:"")+t},t.optionsPathJoin=function(e,t){return b.defaults({path:this.pathJoin(e.path,t)},e)},t.inferCreator=function(t,n,r,i,s){var o,u;n&&(o=n.creatorForPath(t,r));if(o)return o;if(i&&e.RelationalModel&&i instanceof e.RelationalModel){s=C(s),u=b.find(i.getRelations(),function(e){return e.key===s});if(u)return u.collectionType||b.isArray(u.keyContents)?m.CollectionObservable:m.ViewModel}return t?t instanceof e.Model?m.ViewModel:t instanceof e.Collection?m.CollectionObservable:null:null},t.createFromDefaultCreator=function(t,n){return t instanceof e.Model?m.viewModel(t,n):t instanceof e.Collection?m.collectionObservable(t,n):b.isArray(t)?g.observableArray(t):g.observable(t)},t.hasModelSignature=function(e){return e&&e.attributes&&!e.models&&typeof e.get=="function"&&typeof e.trigger=="function"},t.hasCollectionSignature=function(e){return e&&e.models&&typeof e.get=="function"&&typeof e.trigger=="function"},t.release=function(e){return S("kb.utils.release","0.16.0","Please use kb.release instead"),m.release(e)},t}(),m.Factory=function(){function e(e){this.parent_factory=e,this.paths={}}return e.useOptionsOrCreate=function(e,t,n){var r;return e.factory&&(!e.factories||e.factories&&e.factory.hasPathMappings(e.factories,n))?m.utils.wrappedFactory(t,e.factory):(r=m.utils.wrappedFactory(t,new m.Factory(e.factory)),e.factories&&r.addPathMappings(e.factories,n),r)},e.prototype.hasPath=function(e){return this.paths.hasOwnProperty(e)||this.parent_factory&&this.parent_factory.hasPath(e)},e.prototype.addPathMapping=function(e,t){return this.paths[e]=t},e.prototype.addPathMappings=function(e,t){var n,r;for(r in e)n=e[r],this.paths[m.utils.pathJoin(t,r)]=n},e.prototype.hasPathMappings=function(e,t){var n,r,i,s;n=!0;for(s in e)r=e[s],n&=(i=this.creatorForPath(null,m.utils.pathJoin(t,s)))&&r===i;return n},e.prototype.creatorForPath=function(e,t){var n;if(n=this.paths[t])return n.view_model?n.view_model:n;if(this.parent_factory)if(n=this.parent_factory.creatorForPath(e,t))return n;return null},e}(),m.Store=function(){function t(){this.observable_records=[],this.replaced_observables=[]}return t.useOptionsOrCreate=function(e,t,n){return e.store?(e.store.register(t,n,e),m.utils.wrappedStore(n,e.store)):(m.utils.wrappedStoreIsOwned(n,!0),m.utils.wrappedStore(n,new m.Store))},t.prototype.destroy=function(){return this.clear()},t.prototype.clear=function(){var e,t,n,r;r=this.observable_records.splice(0,this.observable_records.length);for(t=0,n=r.length;t<n;t++)e=r[t],m.release(e.observable);m.release(this.replaced_observables)},t.prototype.register=function(e,t,n){var r;if(!t)return;if(g.isObservable(t)||t.__kb_is_co)return;return m.utils.wrappedObject(t,e),e||(t.__kb_null=!0),r=n.creator?n.creator:n.path&&n.factory?n.factory.creatorForPath(e,n.path):null,r||(r=t.constructor),this.observable_records.push({obj:e,observable:t,creator:r}),t},t.prototype.findIndex=function(t,n){var r,i,s;if(!t||t instanceof e.Model){s=this.observable_records;for(r in s){i=s[r];if(!i.observable)continue;if(i.observable.__kb_destroyed){i.obj=null,i.observable=null;continue}if(!t&&!i.observable.__kb_null||t&&(i.observable.__kb_null||i.obj!==t))continue;if(i.creator===n||i.creator.create&&i.creator.create===n.create)return r}}return-1},t.prototype.find=function(e,t){var n;return(n=this.findIndex(e,t))<0?null:this.observable_records[n].observable},t.prototype.isRegistered=function(e){var t,n,r,i;i=this.observable_records;for(n=0,r=i.length;n<r;n++){t=i[n];if(t.observable===e)return!0}return!1},t.prototype.findOrCreate=function(t,n){var r,i;return n.store=this,n.creator||(n.creator=m.utils.inferCreator(t,n.factory,n.path)),!n.creator&&t instanceof e.Model&&(n.creator=kv.ViewModel),r=n.creator,r?r.models_only?t:(r&&(i=this.find(t,r)),i?i:(r.create?i=r.create(t,n):i=new r(t,n),i||(i=g.observable(null)),g.isObservable(i)||this.isRegistered(i)||this.register(t,i,n),i)):m.utils.createFromDefaultCreator(t,n)},t.prototype.findOrReplace=function(e,t,n){var r,i;return e||raiseUnexpected("obj missing"),(r=this.findIndex(e,t))<0?this.register(e,n,{creator:t}):(i=this.observable_records[r],m.utils.wrappedObject(i.observable)===e||T(this,"different object"),i.observable!==n&&(i.observable.constructor===n.constructor||T(this,"replacing different type"),this.replaced_observables.push(i.observable),i.observable=n),n)},t}(),h=function(e,t,n){return!m.statistics||m.statistics.addModelEvent({name:t,emitter:e,key:n.key,path:n.path})},m.EventWatcher=function(){function t(e,t,n){this._onModelUnloaded=L(this._onModelUnloaded,this),this._onModelLoaded=L(this._onModelLoaded,this),this.__kb||(this.__kb={}),this.__kb.callbacks={},this.__kb._onModelLoaded=b.bind(this._onModelLoaded,this),this.__kb._onModelUnloaded=b.bind(this._onModelUnloaded,this),n&&this.registerCallbacks(t,n),e?this.emitter(e):this.ee=null}return t.useOptionsOrCreate=function(e,t,n,r){return e.event_watcher?(e.event_watcher.emitter()!==t&&e.event_watcher.model_ref!==t&&T(this,"emitter not matching"),m.utils.wrappedEventWatcher(n,e.event_watcher).registerCallbacks(n,r)):(m.utils.wrappedEventWatcherIsOwned(n,!0),m.utils.wrappedEventWatcher(n,new m.EventWatcher(t)).registerCallbacks(n,r))},t.prototype.destroy=function(){return this.emitter(null),this.__kb.callbacks=null,m.utils.wrappedDestroy(this)},t.prototype.emitter=function(t){var n,r,i,s,o,u,a,f;if(arguments.length===0||this.ee===t)return this.ee;this.model_ref&&(this.model_ref.unbind("loaded",this.__kb._onModelLoaded),this.model_ref.unbind("unloaded",this.__kb._onModelUnloaded),this.model_ref.release(),this.model_ref=null),e.ModelRef&&t instanceof e.ModelRef?(this.model_ref=t,this.model_ref.retain(),this.model_ref.bind("loaded",this.__kb._onModelLoaded),this.model_ref.bind("unloaded",this.__kb._onModelUnloaded),t=this.model_ref.model()):delete this.model_ref,o=this.ee,this.ee=t,f=this.__kb.callbacks;for(r in f){n=f[r],o&&o.unbind(r,n.fn),t&&this.ee.bind(r,n.fn),s=n.list;for(u=0,a=s.length;u<a;u++)i=s[u],i.emitter&&i.emitter(this.ee)}return t},t.prototype.registerCallbacks=function(t,n){var r,i,s,o,u,a,f,l,c=this;t||x(this,"obj"),n||x(this,"info"),o=n.event_selector?n.event_selector:"change",s=o.split(" ");for(f=0,l=s.length;f<l;f++){i=s[f];if(!i)continue;r=this.__kb.callbacks[i],r||(a=[],r={list:a,fn:function(e){var t,n,r;for(n=0,r=a.length;n<r;n++){t=a[n];if(t.update&&!t.rel_fn){if(e&&t.key&&e.hasChanged&&!e.hasChanged(C(t.key)))continue;!m.statistics||h(e,i,t),t.update()}}return null}},this.__kb.callbacks[i]=r,this.ee&&this.ee.bind(i,r.fn)),u=b.defaults({obj:t},n),r.list.push(u)}this.ee&&(e.RelationalModel&&this.ee instanceof e.RelationalModel&&b.contains(s,"change")&&this._modelBindRelatationalInfo("change",u),u.emitter(this.ee)&&u.emitter)},t.prototype.releaseCallbacks=function(e){var t,n,r,i,s,o;if(!this.__kb.callbacks)return;s=this.__kb.callbacks;for(n in s){t=s[n],o=t.list;for(r in o){i=o[r];if(i.obj!==e)continue;t.list.splice(r,1),i.rel_fn&&this._modelUnbindRelatationalInfo(n,i),i.emitter&&i.emitter(null);return}}},t.prototype._onModelLoaded=function(t){var n,r,i,s,o,u,a,f;s=e.RelationalModel&&t instanceof e.RelationalModel,this.ee=t,f=this.__kb.callbacks;for(r in f){n=f[r],this.ee.bind(r,n.fn),o=n.list;for(u=0,a=o.length;u<a;u++)i=o[u],s&&this._modelBindRelatationalInfo(r,i),i.emitter&&i.emitter(this.ee)}},t.prototype._onModelUnloaded=function(e){var t,n,r,i,s,o,u;this.ee=null,u=this.__kb.callbacks;for(n in u){t=u[n],e.unbind(n,t.fn),i=t.list;for(s=0,o=i.length;s<o;s++)r=i[s],r.rel_fn&&this._modelUnbindRelatationalInfo(n,r),r.emitter&&r.emitter(null)}},t.prototype._modelBindRelatationalInfo=function(e,t){var n,r;if(e==="change"&&t.key&&t.update){n=C(t.key),r=b.find(this.ee.getRelations(),function(e){return e.key===n});if(!r)return;t.rel_fn=function(n){return!m.statistics||h(n,""+e+" (relational)",t),t.update()},r.collectionType||b.isArray(r.keyContents)?(t.is_collection=!0,this.ee.bind("add:"+t.key,t.rel_fn),this.ee.bind("remove:"+t.key,t.rel_fn)):this.ee.bind("update:"+t.key,t.rel_fn)}},t.prototype._modelUnbindRelatationalInfo=function(e,t){if(!t.rel_fn)return;t.is_collection?(this.ee.unbind("add:"+t.key,t.rel_fn),this.ee.unbind("remove:"+t.key,t.rel_fn)):this.ee.unbind("update:"+t.key,t.rel_fn),t.rel_fn=null},t}(),m.emitterObservable=function(e,t){return new m.EventWatcher(e,t)},m.Observable=function(){function e(e,t,n){var r,i,s,o=this;return this.vm=n,t||x(this,"options"),this.vm||(this.vm={}),b.isString(t)||g.isObservable(t)?r=this.create_options={key:t}:r=this.create_options=v(t),this.key=r.key,delete r.key,this.key||x(this,"key"),!r.args||(this.args=r.args,delete r.args),!r.read||(this.read=r.read,delete r.read),!r.write||(this.write=r.write,delete r.write),i=r.event_watcher,delete r.event_watcher,this.vo=g.observable(null),this._model=g.observable(),s=m.utils.wrappedObservable(this,g.dependentObservable({read:function(){var e,t,n,r,i,s;t=[C(o.key)];if(o.args)if(b.isArray(o.args)){s=o.args;for(r=0,i=s.length;r<i;r++)e=s[r],t.push(C(e))}else t.push(C(o.args));return o._mdl===o._model()&&o._mdl&&(n=o.read?o.read.apply(o.vm,t):o._mdl.get.apply(o._mdl,t),o.update(n)),C(o.vo())},write:function(e){var t,n,r,i,s,u,a;i=N(e),r={},r[C(o.key)]=i,n=o.write?[i]:[r];if(o.args)if(b.isArray(o.args)){a=o.args;for(s=0,u=a.length;s<u;s++)t=a[s],n.push(C(t))}else n.push(C(o.args));return o._mdl&&(o.write?o.write.apply(o.vm,n):o._mdl.set.apply(o._mdl,n)),o.update(e)},owner:this.vm})),s.__kb_is_o=!0,r.store=m.utils.wrappedStore(s,r.store),r.path=m.utils.pathJoin(r.path,this.key),r.factories&&(typeof r.factories=="function"||r.factories.create)?(r.factory=m.utils.wrappedFactory(s,new m.Factory(r.factory)),r.factory.addPathMapping(r.path,r.factories)):r.factory=m.Factory.useOptionsOrCreate(r,s,r.path),delete r.factories,s.value=b.bind(this.value,this),s.valueType=b.bind(this.valueType,this),s.destroy=b.bind(this.destroy,this),s.model=this.model=g.dependentObservable({read:function(){return o._model(),o._mdl},write:function(e){if(o.__kb_destroyed||o._mdl===e)return;return o._mdl=e,o.update(null),o._model(e)}}),m.EventWatcher.useOptionsOrCreate({event_watcher:i},e,this,{emitter:this.model,update:b.bind(this.update,this),key:this.key,path:r.path}),this.__kb_value||this.update(),m.LocalizedObservable&&r.localizer&&(s=new r.localizer(s),delete r.localizer),m.DefaultObservable&&r.hasOwnProperty("default")&&(s=m.defaultObservable(s,r["default"]),delete r["default"]),s}return e.prototype.destroy=function(){var e;return e=m.utils.wrappedObservable(this),this.__kb_destroyed=!0,m.release(this.__kb_value),this.__kb_value=null,this.model.dispose(),this._mdl=this.model=e.model=null,m.utils.wrappedDestroy(this)},e.prototype.value=function(){return this.__kb_value},e.prototype.valueType=function(){var e;return e=this._mdl?this._mdl.get(this.key):null,this.value_type||this._updateValueObservable(e),this.value_type},e.prototype.update=function(e){var t,n;if(this.__kb_destroyed)return;this._mdl&&!arguments.length&&(e=this._mdl.get(C(this.key))),e!==void 0||(e=null),t=m.utils.valueType(e);if(!this.__kb_value||this.__kb_value.__kb_destroyed||this.__kb_value.__kb_null&&e)this.__kb_value=void 0,this.value_type=void 0;n=this.__kb_value;if(b.isUndefined(this.value_type)||this.value_type!==t&&t!==f)return this.value_type===o&&t===s?n(e):this._updateValueObservable(e);if(this.value_type===u){if(typeof n.model=="function"){if(n.model()!==e)return n.model(e)}else if(m.utils.wrappedObject(n)!==e)return this._updateValueObservable(e)}else if(this.value_type===o){if(n.collection()!==e)return n.collection(e)}else if(n()!==e)return n(e)},e.prototype._updateValueObservable=function(e){var t,n,r,i;return t=this.create_options,t.creator=m.utils.inferCreator(e,t.factory,t.path,this._mdl,this.key),this.value_type=f,n=t.creator,r=this.__kb_value,this.__kb_value=void 0,r&&m.release(r),n?t.store?i=t.store.findOrCreate(e,t):n.models_only?(i=e,this.value_type=a):n.create?i=n.create(e,t):i=new n(e,t):b.isArray(e)?(this.value_type=s,i=g.observableArray(e)):(this.value_type=a,i=g.observable(e)),this.value_type===f&&(g.isObservable(i)?i.__kb_is_co?this.value_type=o:this.value_type=a:(this.value_type=u,typeof i.model!="function"&&m.utils.wrappedObject(i,e))),this.__kb_value=i,this.vo(i)},e}(),m.observable=function(e,t,n){return new m.Observable(e,t,n)},m.ViewModel=function(){function t(t,n,r){var i,s,o,u,a,f,l,c,h,p=this;!t||t instanceof e.Model||typeof t.get=="function"&&typeof t.bind=="function"||T(this,"not a model"),n||(n={}),r||(r={}),b.isArray(n)?n={keys:n}:n=v(n),this.__kb||(this.__kb={}),this.__kb.vm_keys={},this.__kb.model_keys={},this.__kb.view_model=b.isUndefined(r)?this:r,!n.internals||(this.__kb.internals=n.internals),!n.excludes||(this.__kb.excludes=n.excludes),m.Store.useOptionsOrCreate(n,t,this),this.__kb.path=n.path,m.Factory.useOptionsOrCreate(n,this,n.path),c=k(this,"_mdl",g.observable()),this.model=g.dependentObservable({read:function(){return c(),m.utils.wrappedObject(p)},write:function(e){var t,n;if(m.utils.wrappedObject(p)===e)return;if(p.__kb_null){!e||T(p,"model set on shared null");return}m.utils.wrappedObject(p,e),t=m.utils.wrappedEventWatcher(p);if(!t){c(e);return}t.emitter(e),p.__kb.keys||!e||!e.attributes||(n=b.difference(b.keys(e.attributes),b.keys(p.__kb.model_keys)),n&&p._createObservables(e,n)),c(e)}}),o=m.utils.wrappedEventWatcher(this,new m.EventWatcher(t,this,{emitter:this.model})),n.requires&&b.isArray(n.requires)&&(u=b.clone(n.requires)),this.__kb.internals&&(u=u?b.union(u,this.__kb.internals):b.clone(this.__kb.internals));if(n.keys)if(b.isArray(n.keys))this.__kb.keys=n.keys,u=u?b.union(u,n.keys):b.clone(n.keys);else{a={},h=n.keys;for(l in h)f=h[l],a[b.isString(f)?f:f.key?f.key:l]=!0;this.__kb.keys=b.keys(a)}else s=o.emitter(),s&&s.attributes&&(i=b.keys(s.attributes),u=u?b.union(u,i):i);u&&this.__kb.excludes&&(u=b.difference(u,this.__kb.excludes)),b.isObject(n.keys)&&!b.isArray(n.keys)&&this._mapObservables(t,n.keys),b.isObject(n.requires)&&!b.isArray(n.requires)&&this._mapObservables(t,n.requires),!n.mappings||this._mapObservables(t,n.mappings),!u||this._createObservables(t,u),!m.statistics||m.statistics.register("ViewModel",this)}return t.extend=e.Model.extend,t.prototype.destroy=function(){var e;if(this.__kb.view_model!==this)for(e in this.__kb.vm_keys)this.__kb.view_model[e]=null;return this.__kb.view_model=null,m.releaseKeys(this),m.utils.wrappedDestroy(this),!m.statistics||m.statistics.unregister("ViewModel",this)},t.prototype.shareOptions=function(){return{store:m.utils.wrappedStore(this),factory:m.utils.wrappedFactory(this)}},t.prototype._createObservables=function(e,t){var n,r,i,s,o;n={store:m.utils.wrappedStore(this),factory:m.utils.wrappedFactory(this),path:this.__kb.path,event_watcher:m.utils.wrappedEventWatcher(this)};for(s=0,o=t.length;s<o;s++){r=t[s],i=this.__kb.internals&&b.contains(this.__kb.internals,r)?"_"+r:r;if(this[i])continue;this.__kb.vm_keys[i]=!0,this.__kb.model_keys[r]=!0,n.key=r,this[i]=this.__kb.view_model[i]=m.observable(e,n,this)}},t.prototype._mapObservables=function(e,t){var n,r,i;n={store:m.utils.wrappedStore(this),factory:m.utils.wrappedFactory(this),path:this.__kb.path,event_watcher:m.utils.wrappedEventWatcher(this)};for(i in t){r=t[i];if(this[i])continue;r=b.isString(r)?{key:r}:b.clone(r),r.key||(r.key=i),this.__kb.vm_keys[i]=!0,this.__kb.model_keys[r.key]=!0,this[i]=this.__kb.view_model[i]=m.observable(e,b.defaults(r,n),this)}},t}(),m.viewModel=function(e,t,n){return new m.ViewModel(e,t,n)},m.observables=function(e,t,n){return S("kb.observables","0.16.0","Please use kb.viewModel instead"),new m.ViewModel(e,t,n)},r=0,t=-1,n=1,m.compare=function(e,i){return b.isString(e)?e.localeCompare(i):b.isString(i)?i.localeCompare(e):typeof e!="object"?e===i?r:e<i?t:n:e===i?r:e<i?t:n},m.CollectionObservable=function(){function t(t,n){var r,i,s=this;return!t||t instanceof e.Collection||T(this,"not a collection"),n||(n={}),i=m.utils.wrappedObservable(this,g.observableArray([])),i.__kb_is_co=!0,this.in_edit=0,this.__kb||(this.__kb={}),this.__kb._onCollectionChange=b.bind(this._onCollectionChange,this),n=v(n),n.sort_attribute?this._comparator=g.observable(this._attributeComparator(n.sort_attribute)):(n.sorted_index&&S("sortedIndex no longer supported","0.16.7","please use comparator instead"),this._comparator=g.observable(n.comparator)),n.filters?this._filters=g.observableArray(b.isArray(n.filters)?n.filters:n.filters?[n.filters]:void 0):this._filters=g.observableArray([]),r=this.create_options={store:m.Store.useOptionsOrCreate(n,t,i)},this.path=n.path,r.factory=m.utils.wrappedFactory(i,this._shareOrCreateFactory(n)),r.path=m.utils.pathJoin(n.path,"models"),r.creator=r.factory.creatorForPath(null,r.path),r.creator&&(this.models_only=r.creator.models_only),i.destroy=b.bind(this.destroy,this),i.shareOptions=b.bind(this.shareOptions,this),i.filters=b.bind(this.filters,this),i.comparator=b.bind(this.comparator,this),i.sortAttribute=b.bind(this.sortAttribute,this),i.viewModelByModel=b.bind(this.viewModelByModel,this),i.hasViewModels=b.bind(this.hasViewModels,this),this._collection=g.observable(t),i.collection=this.collection=g.dependentObservable({read:function(){return s._collection()},write:function(e){var t;if((t=s._collection())===e)return;return t&&t.unbind("all",s.__kb._onCollectionChange),e&&e.bind("all",s.__kb._onCollectionChange),s._collection(e)}}),t&&t.bind("all",this.__kb._onCollectionChange),this._mapper=g.dependentObservable(function(){var e,t,n,r,o;e=s._comparator(),n=s._filters(),t=s._collection();if(s.in_edit)return;return i=m.utils.wrappedObservable(s),t&&(r=t.models),!r||t.models.length===0?o=[]:(n.length&&(r=b.filter(r,function(e){return!s._modelIsFiltered(e)})),e?o=b.map(r,function(e){return s._createViewModel(e)}).sort(e):s.models_only?o=n.length?r:r.slice():o=b.map(r,function(e){return s._createViewModel(e)})),s.in_edit++,i(o),s.in_edit--}),i.subscribe(b.bind(this._onObservableArrayChange,this)),!m.statistics||m.statistics.register("CollectionObservable",this),i}return t.extend=e.Model.extend,t.prototype.destroy=function(){var e,t,n;return n=m.utils.wrappedObservable(this),t=this._collection(),t&&(t.unbind("all",this.__kb._onCollectionChange),e=n(),e.splice(0,e.length)),this._mapper.dispose(),this._mapper=null,m.release(this._filters),this._comparator(null),this.collection.dispose(),n.collection=this.collection=null,n.collection=null,m.utils.wrappedDestroy(this),!m.statistics||m.statistics.unregister("CollectionObservable",this)},t.prototype.shareOptions=function(){var e;return e=m.utils.wrappedObservable(this),{store:m.utils.wrappedStore(e),factory:m.utils.wrappedFactory(e)}},t.prototype.filters=function(e){return e?this._filters(b.isArray(e)?e:[e]):this._filters([])},t.prototype.comparator=function(e){return this._comparator(e)},t.prototype.sortedIndex=function(){return S("sortedIndex no longer supported","0.16.7","please use comparator instead")},t.prototype.sortAttribute=function(e){return this._comparator(e?this._attributeComparator(e):null)},t.prototype.viewModelByModel=function(e){var t;return this.models_only?null:(t=e.hasOwnProperty(e.idAttribute)?e.idAttribute:"cid",b.find(m.utils.wrappedObservable(this)(),function(n){return n.__kb.object[t]===e[t]}))},t.prototype.hasViewModels=function(){return!this.models_only},t.prototype._shareOrCreateFactory=function(e){var t,n,r,i;t=m.utils.pathJoin(e.path,"models"),r=e.factories;if(i=e.factory)if((n=i.creatorForPath(null,t))&&(!r||r.models===n)){if(!r)return i;if(i.hasPathMappings(r,e.path))return i}return i=new m.Factory(e.factory),r&&i.addPathMappings(r,e.path),i.creatorForPath(null,t)||(e.hasOwnProperty("models_only")?e.models_only?i.addPathMapping(t,{models_only:!0}):i.addPathMapping(t,m.ViewModel):e.view_model?i.addPathMapping(t,e.view_model):e.create?i.addPathMapping(t,{create:e.create}):i.addPathMapping(t,m.ViewModel)),i},t.prototype._onCollectionChange=function(e,t){var n,r,i,s;if(this.in_edit)return;switch(e){case"reset":case"resort":this._collection.notifySubscribers(this._collection());break;case"new":case"add":if(this._modelIsFiltered(t))return;i=m.utils.wrappedObservable(this),n=this._collection();if(s=this.viewModelByModel(t))return;s=this._createViewModel(t),this.in_edit++,(r=this._comparator())?(i().push(s),i.sort(r)):i.splice(n.indexOf(t),0,s),this.in_edit--;break;case"remove":case"destroy":this._onModelRemove(t);break;case"change":if(this._modelIsFiltered(t))this._onModelRemove(t);else{s=this.viewModelByModel(t);if(s){if(r=this._comparator())i=m.utils.wrappedObservable(this),this.in_edit++,i.sort(r),this.in_edit--}else this._onCollectionChange("add",t)}}},t.prototype._onModelRemove=function(e){var t,n;n=this.models_only?e:this.viewModelByModel(e);if(!n)return;return t=m.utils.wrappedObservable(this),this.in_edit++,t.remove(n),this.in_edit--},t.prototype._onObservableArrayChange=function(e){var t,n,r,i,s,o,u,a,f,l=this;if(this.in_edit)return;this.models_only&&(!e.length||m.utils.hasModelSignature(e[0]))||!this.models_only&&(!e.length||b.isObject(e[0])&&!m.utils.hasModelSignature(e[0]))||T(this,"incorrect type passed"),s=m.utils.wrappedObservable(this),t=this._collection(),n=this._filters().length;if(!t)return;u=e;if(this.models_only)n&&(i=b.filter(e,function(e){return!l._modelIsFiltered(e)}));else{!n||(u=[]),i=[];for(a=0,f=e.length;a<f;a++){o=e[a],r=m.utils.wrappedObject(o);if(n){if(this._modelIsFiltered(r))continue;u.push(o)}this.create_options.store.findOrReplace(r,this.create_options.creator,o),i.push(r)}}this.in_edit++,e.length===u.length||s(u),b.isEqual(t.models,i)||t.reset(i),this.in_edit--},t.prototype._attributeComparator=function(e){var t;return t=function(t,n){var r;return r=C(e),m.compare(t.get(r),n.get(r))},this.models_only?t:function(e,n){return t(m.utils.wrappedModel(e),m.utils.wrappedModel(n))}},t.prototype._createViewModel=function(e){return this.models_only?e:this.create_options.store.findOrCreate(e,this.create_options)},t.prototype._modelIsFiltered=function(e){var t,n,r,i;n=this._filters();for(r=0,i=n.length;r<i;r++){t=n[r],t=C(t);if(typeof t=="function"&&t(e)||e&&e.id===t)return!0}return!1},t}(),m.collectionObservable=function(e,t){return new m.CollectionObservable(e,t)},g.bindingHandlers.inject={init:function(e,t,n,r){return m.Inject.inject(C(t()),r,e,t,n)}},m.Inject=function(){function e(){}return e.inject=function(e,t,n,r,i,s){var o,u,a;return o=function(e){var o,u,a;if(b.isFunction(e))t=new e(t,n,r,i),m.releaseOnNodeRemove(t,n);else{e.view_model&&(t=new e.view_model(t,n,r,i),m.releaseOnNodeRemove(t,n));for(o in e){a=e[o];if(o==="view_model")continue;o==="create"?a(t,n,r,i):b.isObject(a)&&!b.isFunction(a)?(u=s||a&&a.create?{}:t,t[o]=m.Inject.inject(a,u,n,r,i,!0)):t[o]=a}}return t},s?o(e):(u=(a=g.dependentObservable(function(){return o(e)}))(),a.dispose(),u)},e.injectViewModels=function(e){var t,n,r,i,s,o,u,a,f,l;a=[],o=function(e){var t,n,r,i,s;e.__kb_injected||e.attributes&&(t=b.find(e.attributes,function(e){return e.name==="kb-inject"}))&&(e.__kb_injected=!0,a.push({el:e,view_model:{},binding:t.value})),s=e.childNodes;for(r=0,i=s.length;r<i;r++)n=s[r],o(n)},o(e||document);for(f=0,l=a.length;f<l;f++){n=a[f];if(s=n.binding)s.search(/[:]/)<0||(s="{"+s+"}"),i=(new Function("","return ( "+s+" )"))(),i||(i={}),!i.options||(u=i.options,delete i.options),u||(u={}),n.view_model=m.Inject.inject(i,n.view_model,n.el,null,null,!0),t=n.view_model.afterBinding||u.afterBinding,r=n.view_model.beforeBinding||u.beforeBinding;r&&r(n.view_model,n.el,u),m.applyBindings(n.view_model,n.el,u),t&&t(n.view_model,n.el,u)}return a},e}(),m.injectViewModels=m.Inject.injectViewModels,this.$?this.$(function(){return m.injectViewModels()}):(y=function(){return document.readyState!=="complete"?setTimeout(y,0):m.injectViewModels()})(),m.DefaultObservable=function(){function e(e,t){var n,r=this;return this.dv=t,n=m.utils.wrappedObservable(this,g.dependentObservable({read:function(){var t;return(t=C(e()))?t:C(r.dv)},write:function(t){return e(t)}})),n.destroy=b.bind(this.destroy,this),n.setToDefault=b.bind(this.setToDefault,this),n}return e.prototype.destroy=function(){return m.utils.wrappedDestroy(this)},e.prototype.setToDefault=function(){return m.utils.wrappedObservable(this)(this.dv)},e}(),m.defaultObservable=function(e,t){return new m.DefaultObservable(e,t)},m.defaultWrapper=function(e,t){return S("ko.defaultWrapper","0.16.3","Please use kb.defaultObservable instead"),new m.DefaultObservable(e,t)},m.Observable.prototype.setToDefault=function(){var e;(e=this.__kb_value)!=null&&typeof e.setToDefault=="function"&&e.setToDefault()},m.ViewModel.prototype.setToDefault=function(){var e,t;for(e in this.__kb.vm_keys)(t=this[e])!=null&&typeof t.setToDefault=="function"&&t.setToDefault()},m.utils.setToDefault=function(e){var t,n;if(!e)return;if(g.isObservable(e))typeof e.setToDefault=="function"&&e.setToDefault();else if(b.isObject(e))for(t in e)n=e[t],n&&(g.isObservable(n)||typeof n!="function")&&(t[0]!=="_"||t.search("__kb"))&&this.setToDefault(n);return e},p=Array.prototype.slice,m.toFormattedString=function(e){var t,n,r,i,s,o;s=e.slice(),n=p.call(arguments,1);for(r in n){t=n[r],o=C(t),o||(o=""),i=e.indexOf("{"+r+"}");while(i>=0)s=s.replace("{"+r+"}",o),i=e.indexOf("{"+r+"}",i+1)}return s},m.parseFormattedString=function(e,t){var n,r,i,s,o,u,a,f,l,c,h,p,d;c=t.slice(),i=0,u=0,f={};while(c.search("\\{"+i+"\\}")>=0){a=t.indexOf("{"+i+"}");while(a>=0)c=c.replace("{"+i+"}","(.*)"),f[a]=i,u++,a=t.indexOf("{"+i+"}",a+1);i++}n=i,l=new RegExp(c),o=l.exec(e),o&&o.shift();if(!o||o.length!==u){h=[];while(n-->0)h.push("");return h}d=b.sortBy(b.keys(f),function(e,t){return parseInt(e,10)}),r={};for(s in d){a=d[s],i=f[a];if(r.hasOwnProperty(i))continue;r[i]=s}p=[],i=0;while(i<n)p.push(o[r[i]]),i++;return p},m.FormattedObservable=function(){function e(e,t){var n,r;return b.isArray(t)?(e=e,r=t):r=p.call(arguments,1),n=m.utils.wrappedObservable(this,g.dependentObservable({read:function(){var n,i,s;t=[C(e)];for(i=0,s=r.length;i<s;i++)n=r[i],t.push(C(n));return m.toFormattedString.apply(null,t)},write:function(t){var n,i,s;i=m.parseFormattedString(t,C(e)),s=Math.min(r.length,i.length),n=0;while(n<s)r[n](i[n]),n++}})),n}return e.prototype.destroy=function(){return m.utils.wrappedDestroy(this)},e}(),m.formattedObservable=function(e,t){return new m.FormattedObservable(e,p.call(arguments,1))},m.LocalizedObservable=function(){function t(e,t,n){var r,i=this;return this.value=e,this.vm=n,t||(t={}),this.vm||(this.vm={}),this.read||x(this,"read"),m.locale_manager||x(this,"kb.locale_manager"),this.__kb||(this.__kb={}),this.__kb._onLocaleChange=b.bind(this._onLocaleChange,this),this.__kb._onChange=t.onChange,this.value&&(e=C(this.value)),this.vo=g.observable(e?this.read(e,null):null),r=m.utils.wrappedObservable(this,g.dependentObservable({read:function(){return i.value&&C(i.value),i.vo(),i.read(C(i.value))},write:function(e){i.write||T(i,"writing to read-only"),i.write(e,C(i.value)),i.vo(e);if(i.__kb._onChange)return i.__kb._onChange(e)},owner:this.vm})),r.destroy=b.bind(this.destroy,this),r.observedValue=b.bind(this.observedValue,this),r.resetToCurrent=b.bind(this.resetToCurrent,this),m.locale_manager.bind("change",this.__kb._onLocaleChange),t.hasOwnProperty("default")&&(r=m.DefaultObservable&&g.defaultObservable(r,t["default"])),r}return t.extend=e.Model.extend,t.prototype.destroy=function(){return m.locale_manager.unbind("change",this.__kb._onLocaleChange),this.vm=null,m.utils.wrappedDestroy(this)},t.prototype.resetToCurrent=function(){var e,t;t=m.utils.wrappedObservable(this),e=this.value?this.read(C(this.value)):null;if(t()===e)return;return t(e)},t.prototype.observedValue=function(e){if(arguments.length===0)return this.value;this
.value=e,this._onLocaleChange()},t.prototype._onLocaleChange=function(){var e;e=this.read(C(this.value)),this.vo(e);if(this.__kb._onChange)return this.__kb._onChange(e)},t}(),m.localizedObservable=function(e,t,n){return new m.LocalizedObservable(e,t,n)},m.locale_manager=void 0,m.TriggeredObservable=function(){function e(e,t){var n,r=this;return this.event_selector=t,e||x(this,"emitter"),this.event_selector||x(this,"event_selector"),this.vo=g.observable(),n=m.utils.wrappedObservable(this,g.dependentObservable(function(){return r.vo()})),n.destroy=b.bind(this.destroy,this),m.utils.wrappedEventWatcher(this,new m.EventWatcher(e,this,{emitter:b.bind(this.emitter,this),update:b.bind(this.update,this),event_selector:this.event_selector})),n}return e.prototype.destroy=function(){return m.utils.wrappedDestroy(this)},e.prototype.emitter=function(e){if(arguments.length===0||this.ee===e)return this.ee;if(this.ee=e)return this.update()},e.prototype.update=function(){if(!this.ee)return;return this.vo()!==this.ee?this.vo(this.ee):this.vo.valueHasMutated()},e}(),m.triggeredObservable=function(e,t){return new m.TriggeredObservable(e,t)},d=function(e){return e=C(e),typeof e=="function"?e.apply(null,Array.prototype.slice.call(arguments,1)):e},m.Validation=function(){function e(){}return e}(),m.valueValidator=function(e,t,n){return n==null&&(n={}),n&&typeof n!="function"||(n={}),g.dependentObservable(function(){var r,i,s,o,u,a,f,l;f={$error_count:0},i=C(e),!("disable"in n)||(s=d(n.disable)),!("enable"in n)||(s=!d(n.enable)),a=n.priorities||[],b.isArray(a)||(a=[a]),r=a.length+1;for(o in t)l=t[o],f[o]=!s&&d(l,i),f[o]&&(f.$error_count++,(u=b.indexOf(a,o)>=0)||(u=a.length),f.$active_error&&u<r?(f.$active_error=o,r=u):f.$active_error||(f.$active_error=o,r=u));return f.$enabled=!s,f.$disable=!!s,f.$valid=f.$error_count===0,f})},m.inputValidator=function(e,t,n){var r,i,s,o,u,a,f,l,c;return n==null&&(n={}),n&&typeof n!="function"||(n={}),c=m.valid,r=$(t),(o=r.attr("name"))&&!b.isString(o)&&(o=null),(i=r.attr("data-bind"))?(u=(new Function("sc","with(sc[0]) { return { "+i+" } }"))([e]),!u||!u.value?null:(!u.validation_options||(b.defaults(u.validation_options,n),n=u.validation_options),i={},!c[f=r.attr("type")]||(i[f]=c[f]),!r.attr("required")||(i.required=c.required),!u.validations||function(){var e,t;e=u.validations,t=[];for(s in e)l=e[s],t.push(i[s]=l);return t}(),a=m.valueValidator(u.value,i,n),!o&&!n.no_attach||(e["$"+o]=a),a)):null},m.formValidator=function(e,t){var n,r,i,s,o,u,a,f,l,c,h,p,d;a={},c=[],n=$(t),(i=n.attr("name"))&&!b.isString(i)&&(i=null);if(r=n.attr("data-bind"))u=(new Function("sc","with(sc[0]) { return { "+r+" } }"))([e]),f=u.validation_options;f||(f={}),f.no_attach=!!i,d=n.find("input");for(h=0,p=d.length;h<p;h++){s=d[h];if(!(o=$(s).attr("name")))continue;l=m.inputValidator(e,s,f),!l||c.push(a[o]=l)}return a.$error_count=g.dependentObservable(function(){var e,t,n;e=0;for(t=0,n=c.length;t<n;t++)l=c[t],e+=l().$error_count;return e}),a.$valid=g.dependentObservable(function(){return a.$error_count()===0}),a.$enabled=g.dependentObservable(function(){var e,t,n;e=!0;for(t=0,n=c.length;t<n;t++)l=c[t],e&=l().$enabled;return e}),a.$disabled=g.dependentObservable(function(){return!a.$enabled()}),i&&(e["$"+i]=a),a},c=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,i=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,l=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,m.valid={required:function(e){return!e},url:function(e){return!c.test(e)},email:function(e){return!i.test(e)},number:function(e){return!l.test(e)}},m.hasChangedFn=function(e){var t,n;return n=null,t=null,function(){var r;return n!==(r=C(e))?(n=r,t=n?n.toJSON():null,!1):!n||!t?!1:!b.isEqual(n.toJSON(),t)}},m.minLengthFn=function(e){return function(t){return!t||t.length<e}},m.uniqueValueFn=function(e,t,n){return function(r){var i,s,o,u=this;return o=C(e),s=C(t),i=C(n),o&&s&&i?!!b.find(i.models,function(e){return e!==o&&e.get(s)===r}):!1}},m.untilTrueFn=function(e,t,n){var r;return r=!1,n&&g.isObservable(n)&&n.subscribe(function(){return r=!1}),function(n){var i,s;return(i=C(t))?(r|=!!(s=i(C(n))),r?s:C(e)):C(e)}},m.untilFalseFn=function(e,t,n){var r;return r=!1,n&&g.isObservable(n)&&n.subscribe(function(){return r=!1}),function(n){var i,s;return(i=C(t))?(r|=!(s=i(C(n))),r?s:C(e)):C(e)}},m})}).call(this);