/**
 * Created by ShirleyYang on 16/8/28.
 * 创建一个mediator,处理传递过来的commandObejct
 */
 var mediator={
     craftArray:[],
     BUS:"0000",
     craftPower:{
         powerSlow:[30,5],
         powerMedium:[50,7],
         powerFast:[80,9]
     },
     craftEnergy:{
         energySlow:2,
         energyMedium:3,
         energyFast:4
     },
     getCommand:function (commandObject,craftType) {
         //获取命令后将命令传递给BUS介质,进行编码处理
         this.Adapter(commandObject);
         // 通过BUS将命令传递给各个飞船
         this.BUSSend(craftType);
     },

     BUSSend:function (craftType) {
         var BUS=this.BUS;
         //设定时间间隔,300mm尝试一次发射BUS命令,直到成功为止
         var timer=setInterval(function(){

             var randomNumber=Math.random();
             if(randomNumber>0.1){
                 //如果命令是新建一个飞船,那么首先创建一个飞船对象,并将其添加到飞船组中
                 if(BUS.slice(2)==="00"){
                     var id=parseInt(BUS.slice(0,2),2);
                     var power=mediator.craftPower[craftType[0]];
                     var energy=mediator.craftEnergy[craftType[1]];
                     var craft=new Craft(id,power,energy);
                     mediator.craftArray.push(craft);
                 }
                 //若命令发射成功,飞船组中的所有飞船都会接收到该命令
                 mediator.craftArray.forEach(function (craft) {
                     craft.getCommand(BUS);
                 });
                 //控制台输出中会输出相应的结果
                 consoleOut.getCommand(BUS,true);
                 //将间隔300ms尝试发射一次的命令取消
                 clearInterval(timer);
             }else{
                 consoleOut.getCommand(BUS,false);
             }
         },300);
     },
     Adapter:function (commandObject) {
         //将命令翻译成BUS编码,前两位代表飞船创建的轨道,后面两位代表具体的指令
         this.BUS="";
         var id=(commandObject.id).toString(2);
         if(id==="0"){
             id="00";
         }
         var command=commandObject.command;
         switch (command){
             case "create":
                 this.BUS=id+"00";
                 break;
             case "explode":
                 this.BUS=id+"01";
                 break;
             case "launch":
                 this.BUS=id+"10";
                 break;
             case "stop":
                 this.BUS=id+"11";
                 break;
         }
     }
};