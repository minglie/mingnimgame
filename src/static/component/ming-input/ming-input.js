const {WebComponent} =MingRouter;

class MingInput extends WebComponent {



    constructor(props) {
        super(props);
        window.t=this;
        this.state = {
            selectData:"普通",
            value:"",
            selectColor:"green"
        }

    }


    send(){
         let value= this.shadowRoot.querySelector('#tanmuInputId').value;
         this.state.value=value;
         let selectData= this.state.selectData;
         let selecColor= this.state.selectColor;
         eval(`${this.props.onsend}(selectData,selecColor,value)`);
         
         this.shadowRoot.querySelector('#tanmuInputId').value="";
         this.hide();
    }

    btnClick(v){
        this.state.selectColor=MingInput.colorMap[v];
        this.setState({
            "selectData":v,
            value:this.shadowRoot.querySelector('#tanmuInputId').value},
            ()=>{
                this.shadowRoot.querySelectorAll("button").forEach(u=>{
                    if(u.innerText=="发送"){
                        return;
                    }
                    else {
                        if(u.innerText==v){
                         
                            t.shadowRoot.querySelector("."+u.className).className=u.className+" sel"
                        }
                    }
            })
        })

    }



    componentDidMount() {

           this.hide()
    }

    show(){
        $("ming-input").show();
        this.setState({
            value:""
        });
        this.shadowRoot.querySelector("#tanmuInputId").focus();
    }

    hide(){

        $("ming-input").hide();
        return;
        //console.log(this.htmlElement)
        let rootWrap= this.shadowRoot.querySelector("#minginputId");
        window.t1=rootWrap;
        let count=30;
        MingInput.timer= setInterval(()=>{
           // console.log(count)
            count=count+30;
            rootWrap.style.top= count+"vh";
            if(count>100){
                rootWrap.style.top= count+"vh";
                clearInterval(MingInput.timer);
                rootWrap.style.top= 30+"vh";
                $("ming-input").hide();
            }
        },50);

    }

}





MingInput.template=`${M.config.oncegame_host}/common/component/ming-input/ming-input.html`;

MingInput.colorMap={
    "蓝":"blue",
    "粉":"pink",
    "橙":"orange",
    "红":"red",
    "紫":"purple",
    "绿":"green"
}

MingRouter.registWebComponent(MingInput);