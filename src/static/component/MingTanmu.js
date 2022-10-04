
class MingTanmu extends MingRouter.WebComponent {

    constructor(props) {
        super(props);
        this.tanmuColor=[
            '#FAC5DE',
            '#FBE929',
            '#6EC388',
            '#FB6979',
            '#3DB8B1',
            '#e98df5',
            '#e54304',
            '#FF1744',
            '#FF80AB',
            '#1976D2',
            '#00796B'
        ];
      this.state = {
            canSpeak:true,
            newLiSet:new Set(),
            newTimeSet:new Set(),
            speedList:[

            ],

        }

    }




    getRandomColor=()=>{
        let cIndex= Number.parseInt(1000*Math.random() )% this.tanmuColor.length
        return this.tanmuColor[cIndex];
    }

    getTanmuHeight(position){
        let num= Number.parseInt(Math.random()*10%3);
        if(position=="up"){
            num=0;
        }
        if(position=="mid"){
            num=1;
        }
        if(position=="down"){
            num=2;
        }
        if(num==0){
            return "3vw";
        }
        if(num==1){
            return "15vw";
        }
        if(num==2){
            return "28vw";
        }
    }

    insert(){
        const tanmu=this.shadowRoot.querySelector("#tanmu");
        if(this.state.canSpeak==false || this.state.speedList.length==0){
            return;
        }
        let newli=document.createElement('div');
        let speackObj=  this.state.speedList.pop();
        newli.innerHTML= speackObj.text;
        newli.className='newli';
        newli.style.backgroundColor=speackObj.color || this.getRandomColor();
        newli.style.top=this.getTanmuHeight(speackObj.position)
        newli.h=0;
        newli.speed=8;
        if(newli.innerHTML.includes("抽到")){
            newli.speed=0.3;
            newli.enableSpeck=true;
            window.canSpeak=false;
        }
        this.state.newLiSet.add(newli)
        tanmu.appendChild(newli);
        this.renderLi(newli);
        this.moveLi(newli);
        if(this.state.speedList.length>0){
           // console.log(this.state.speedList[0],"AAA")
           this.insert()
        }
    }


    renderLi(obj){
        obj.style.left=obj.h+"vw";
    }

    moveLi(obj){
        let that=this;
        const tanmu=this.shadowRoot.querySelector("#tanmu");
        let timer1=setInterval(function(){
            obj.h= obj.h+obj.speed;
            if (obj.h>=90) {
                if(obj.parentNode){
                    tanmu.removeChild(obj);
                }
                that.state.newLiSet.delete(obj)
                clearInterval(timer1);
                that.state.newTimeSet.delete(timer1);
                if(obj.enableSpeck){
                    that.state.canSpeak=true;
                }
            }
            that.renderLi(obj)
        },200)
        this.state.newTimeSet.add(timer1);
    }

    componentDidMount() {
       // this.insert();
    }


    pushMsg(speackObj){
        this.state.speedList.push(speackObj);
        this.insert();
    }


    render() {
        return `<style>
    #tanmu{
        width: 100vw;
        height: 40vw;
        top: 10vw;
        left: 0vw;
        position: absolute;
        z-index: 0;
    }

    .newli{
        padding: 2vw;
        padding-right: 5vw;
        color: white;
        border-radius: 6vw;
        font-size: large;
        position: absolute;
        height: 6vw;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        opacity:0.88;
        z-index: 5;
    }

</style>



<div id="tanmu">


</div>

`;
    }


}

export default MingTanmu;