"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * File : index.js
 * By : Minglie
 * QQ: 934031452
 * Date :2021.09.30
 * version :1.9.0
 */
(function (window) {
    class WebComponent {
        //缓存组件模板
        constructor(props) {
            //生成组件唯一name
            this.selfName = `MingRouter.componentMap.${props.className}.${props["key"]}`;
            this.props = props;
        }

        setState(state) {
            this.state = Object.assign(this.state, state);
        }

        render() {
            return `<div>...</div>`;
        }

        async getTemplate(props) {
            if (MingRouter.componentMap[props.className].template) {
                let templateContent = "";

                if (MingRouter.componentMap[props.className].templateContent) {
                    templateContent = MingRouter.componentMap[props.className].templateContent;
                } else {
                    templateContent = await MingRouter.getTemplateByHtmlUrl(MingRouter.componentMap[props.className].template);
                    MingRouter.componentMap[props.className].templateContent = templateContent;
                }

                const CurWebComponent = MingRouter.componentMap[props.className];
                templateContent = eval("`" + templateContent + "`");
                return templateContent;
            } else {
                return this.render(props);
            }
        } //获取函数组件模板


        static async staticGetTemplate(props) {
            if (MingRouter.componentMap[props.className].template) {
                let templateContent = "";

                if (MingRouter.componentMap[props.className].templateContent) {
                    templateContent = MingRouter.componentMap[props.className].templateContent;
                } else {
                    templateContent = await MingRouter.getTemplateByHtmlUrl(MingRouter.componentMap[props.className].template);
                    MingRouter.componentMap[props.className].templateContent = templateContent;
                }

                templateContent = eval("`" + templateContent + "`");
                return templateContent;
            }
        }

        static get observedAttributes() {
            return [];
        }

        componentWillUnmount(props) {}

        componentWillReceiveProps(props) {}

        componentDidMount() {}

        attributeChangedCallback(name, oldValue, newValue) {}

    }

    _defineProperty(WebComponent, "_webComponenrCache", {});

    _defineProperty(WebComponent, "_isClass", true);

    class MingRouter {
        //全局html缓存
        //page级别css缓存
        constructor(el, reactive = false) {
            //路由dom节点
            this.el = el; //路由处理器

            this._routes = {}; //当前路由

            this._currentUrl = ''; //模板中是否含有变量

            this.reactive = reactive;
            this.init();
        }



        route(path, template, callback, componentDidMount, pageObj) {
            if (this._routes[path]) {
                return;
            }

            let regExp = new RegExp(path);
            this._routes[path] = {
                path,
                regExp,
                callback: callback || function () {},
                componentDidMount: componentDidMount || function () {},
                templateContent: null,
                template: template,
                pageObj: pageObj
            };
        }

        async refresh() {
            let router = this.getRouter();

            if (router == null) {
                console.warn("no router", this._currentUrl);
                return;
            }

            await router.callback();
            router.componentDidMount();
        }

        async render(path, pageObj) {
            let router = this.getRouter(path);

            if (pageObj) {
                window.pageObj = pageObj;
            }

            if (router.templateContent) {
                let html = router.templateContent;
                this.renderHtml(html);
                return;
            }

            let templateContent = await MingRouter.getTemplateByHtmlUrl(router.template);
            router.templateContent = templateContent;
            this.renderHtml(templateContent);
        }

        static replaceHash(hash) {
            document.location.replace(this.getFilterUrl(hash));
        }

        init() {
            window.addEventListener('load', this.refresh.bind(this), false);
            window.addEventListener('hashchange', this.refresh.bind(this), false);
        }

        mapping(path, template, componentDidMount, pageObj) {
            let that = this;
            this.route(path, template, async function () {
                await that.render(path, pageObj);
            }, componentDidMount, pageObj);
        }

        getRouter(path) {
            if (path != undefined && path != null && !path.startsWith("/")) {
                path = "/" + path;
            }

            this._currentUrl = path || location.hash.slice(1) || '/';

            if (!this._currentUrl.startsWith("/")) {
                this._currentUrl = "/" + this._currentUrl;
            }

            let router = null;

            for (let key in this._routes) {
                if (this._routes[key].regExp.test(this._currentUrl)) {
                    router = this._routes[key];

                    if (key == "/") {
                        continue;
                    } else {
                        break;
                    }
                }
            }

            return router;
        }



        renderHtml(html) {
            if (this.reactive) {
                html = eval("`" + html + "`");
                document.querySelector(this.el).innerHTML = html;
            } else {
                document.querySelector(this.el).innerHTML = html;
            }
        }







    }

    MingRouter.getTemplateByHtmlUrl=(htmlUrl) =>{
        if (htmlUrl.startsWith("#")) {
            let temp = document.querySelector(htmlUrl).innerHTML;
            return temp;
        }

        if (htmlUrl.endsWith(".html")) {
            return new Promise((resolve, reject) => {
                fetch(htmlUrl).then(d => d.text()).then(d => {
                    resolve(d);
                });
            });
        }

        return htmlUrl;
    }


    MingRouter.getFilterUrl=(hash) =>{
        return document.location.protocol + '//' + document.location.host + document.location.pathname + document.location.search + '#' + hash;
    } ///////////////////// //////////////////////////////////////////

    MingRouter.registWebComponent=(WrapWebComponent)=> {
        if (!WrapWebComponent._isClass) {
            let {
                className,
                tagName
            } = MingRouter.parseFunctionName(WrapWebComponent);
            WrapWebComponent.className = className;
            WrapWebComponent.tagName = tagName; //函数组件的模板

            if (MingRouter.componentMap[WrapWebComponent.className]) {
                console.error(`${WrapWebComponent.className} function is registed`);
                return;
            }

            MingRouter.componentMap[WrapWebComponent.className] = WrapWebComponent;
            customElements.define(WrapWebComponent.tagName, class App extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({
                        mode: "open"
                    });
                }

                setAttribute(qualifiedName, value) {
                    super.setAttribute(qualifiedName, value);
                    this.props[qualifiedName] = value;

                    this._render(this.props);
                }

                async connectedCallback() {
                    let objs = {};
                    let propNames = this.getAttributeNames();

                    for (let i = 0; i < propNames.length; i++) {
                        objs[propNames[i]] = this.getAttribute(propNames[i]);
                    }

                    if (!objs.key) {
                        objs["key"] = "key";
                    }

                    objs.className = WrapWebComponent.className;
                    this.props = objs;

                    this.wrapWebComponent = this;
                    await this._render(this.props);
                }

                async _render(props) {
                    WrapWebComponent.template = WrapWebComponent(props);
                    let content = await WebComponent.staticGetTemplate(props);
                    this.shadowRoot.innerHTML = content;
                }

            });
            return;
        }

        let {
            className,
            tagName
        } = MingRouter.parseClassName(WrapWebComponent);
        WrapWebComponent.className = className;
        WrapWebComponent.tagName = tagName;

        if (MingRouter.componentMap[WrapWebComponent.className]) {
            console.error(`${WrapWebComponent.className} is registed`);
            return;
        }

        MingRouter.componentMap[WrapWebComponent.className] = WrapWebComponent;
        customElements.define(WrapWebComponent.tagName, class App extends HTMLElement {
            constructor() {
                super();
                let shadowroot = this.attachShadow({
                    mode: "open"
                });
                this.shadowroot = shadowroot;
            }


            /**
             * 移除
             */


            disconnectedCallback() {
                this.wrapWebComponent.componentWillUnmount(this.props);
            }
            /**
             * 移动
             */


            adoptedCallback() {
                this.wrapWebComponent.adoptedCallback(this.props);
            }

            setAttribute(qualifiedName, value) {
                super.setAttribute(qualifiedName, value);
                this.props[qualifiedName] = value;
                this.wrapWebComponent.componentWillReceiveProps(this.props);
            }
            /**
             * 属性改变
             * @param name
             * @param oldValue
             * @param newValue
             */


            attributeChangedCallback(name, oldValue, newValue) {
                this.wrapWebComponent.attributeChangedCallback(name, oldValue, newValue);
            }
            /**
             * 添加到dom
             * @returns {Promise<void>}
             */


            async connectedCallback() {
                let objs = {};
                let propNames = this.getAttributeNames();

                for (let i = 0; i < propNames.length; i++) {
                    objs[propNames[i]] = this.getAttribute(propNames[i]);
                }

                if (!objs.key) {
                    objs["key"] = "key";
                }

                objs.className = WrapWebComponent.className;
                this.props = objs;
                this.wrapWebComponent = new WrapWebComponent(this.props);
                this.wrapWebComponent.shadowRoot = this.shadowroot;
                this.wrapWebComponent.htmlElement = this;
                WrapWebComponent[this.props["key"]] = this.wrapWebComponent;

                this.wrapWebComponent.setState = (state, callback) => {
                    let newState = Object.assign(this.wrapWebComponent.state, state);
                    this.wrapWebComponent.state = newState;

                    this._render(this.props).then(() => {
                        if (callback) {
                            callback(newState);
                        }
                    });
                };

                await this._render(this.props);
                this.wrapWebComponent.componentDidMount(this.props);
            }

            async _render() {
                let self = this.wrapWebComponent;
                let renderContentPure = await this.wrapWebComponent.getTemplate(this.props);
                let renderContent = `
           
                  ${this.wrapWebComponent.renderCss ? "<style>" + this.wrapWebComponent.renderCss(this.props) + "</style>" : ""}
                  ${renderContentPure}`;
                this.shadowRoot.innerHTML = renderContent;
            }

        });
    }



    MingRouter.parseFunctionName=(fun)=> {
        let className = MingRouter.CON_FUN_NAME_RE.exec(fun.toString())[1];
        let tagName = className.replace(/([A-Z])/g, "-$1").toLowerCase().substr(1);
        return {
            className: className,
            tagName: tagName
        };
    }

    MingRouter.parseClassName=(clazz) =>{
        let className = MingRouter.CON_CLASS_NAME_RE.exec(clazz.toString())[1];
        let tagName = className.replace(/([A-Z])/g, "-$1").toLowerCase().substr(1);
        return {
            className,
            tagName
        };
    }


    MingRouter.loadHtml= async  (htmlUrl) =>{
        if (MingRouter.loadHtmlCache[htmlUrl]) {
            return MingRouter.loadHtmlCache[htmlUrl];
        }

        return new Promise((resolve, reject) => {
            fetch(htmlUrl).then(d => d.text()).then(d => {
                MingRouter.loadHtmlCache[htmlUrl] = d;
                resolve(d);
            });
        });
    }



    MingRouter.loadCss= async (cssUrl)=> {
        let cssContent = "";

        if (MingRouter.loadCssCache[cssUrl]) {
            cssContent = MingRouter.loadCssCache[cssUrl];
        } else {
            cssContent = await new Promise((resolve, reject) => {
                fetch(cssUrl).then(d => d.text()).then(d => {
                    MingRouter.loadCssCache[cssUrl] = d;
                    resolve(d);
                });
            });
        }

        document.querySelector("#pageCss").innerHTML = cssContent;
    }

    MingRouter.html=(htmlUrl)=> {
        let r = MingRouter.loadHtmlCache[htmlUrl] || "<h1>wait...</h1>";
        return r;
    }




    _defineProperty(MingRouter, "loadHtmlCache", {});

    _defineProperty(MingRouter, "loadCssCache", {});

    _defineProperty(MingRouter, "pageRootPath", "/pages/");

    _defineProperty(MingRouter, "componentMap", {});

    _defineProperty(MingRouter, "CON_FUN_NAME_RE", /function\s*(\w*)/i);

    _defineProperty(MingRouter, "CON_CLASS_NAME_RE", /class\s*(\w*)/i);

    MingRouter.WebComponent = WebComponent;
    window.MingRouter = MingRouter;
})(window);