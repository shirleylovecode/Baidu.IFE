/**
 * Created by ShirleyYang on 16/8/8.
 */

//获取id元素
function $(id) {
    if(id){
        return document.getElementById(id);
    }
    else {
        console.log(id+"is not exit");
    }
}
//对元素注册事件
function AddEvent(element,event,listener) {
    if(element.addEventListener){
        element.addEventListener(event, listener);
    }else if(element.attachEvent){
        element.attachEvent('on'+event,listener);
    }else{

    }
}
//获取单选选中的选项
function checkedItem(className) {
    var filedSet=document.getElementsByClassName(className)[0];
    var inputArr=filedSet.getElementsByTagName("input");
    for(var i=0;i<inputArr.length;i++){
        if(inputArr[i].checked){
            return inputArr[i].value;
        }
    }
}
//获取下拉框选中的选项
function selectedItem(id) {
    var selected=$(id);
    for(var i=0;i<selected.options.length;i++){
        if(selected.options[i].selected){
            return selected.options[i].value;
        }
    }
}
//定义全局变量
var formType=document.getElementsByClassName("type")[0];
var rule=document.getElementsByClassName("rule")[0];
var formLength=document.getElementsByClassName("length")[0];
var formOption=document.getElementsByClassName("option")[0];
var optionDisplay=document.getElementsByClassName("optiondisplay")[0];
var optionArray=[];
var addbtn=document.getElementsByClassName("addbtn")[0];
var formData=[];
var formDisplay=document.getElementsByClassName("formdisplay")[0];
var formID=0;

init();
AddEvent(addbtn,"click",function () {
    if(!$("name").value){
        alert("请输入名称");
    }
    getFormData();
    if(createFormElement()){
        formElementCSS();
    }
    formValidation();
    optionArray=[];
    optionDisplay.innerHTML='';
    formID++;

});
AddEvent($("css"),"change",formElementCSS);



// 表单生成区域的控制
function init() {
    var typeInput=formType.getElementsByTagName("input");
    var name=$("name");
    var ruleInput=rule.getElementsByTagName('input');

    //控制显示的fieldset
    Array.prototype.forEach.call(typeInput,function (ele) {
        AddEvent(ele,'change',function () {

            //将配置中的名称设置为与选择的类型相同的数值
            name.value=ele.nextElementSibling.textContent;
            if(ele.value=="inputtext"){
                formOption.style.display="none";
                rule.style.display="block";
                formLength.style.display="block";
                //注意这个地方当选择了邮箱,再切换到文本域再次切换回来的时候要保证formLength不显示
                Array.prototype.forEach.call(ruleInput,function (ele) {
                    if(ele.checked&&(ele.value=="email"||ele.value=="phonenumber")){
                        formLength.style.display="none";
                    }
                })
            }else if(ele.value=="textarea"){
                rule.style.display="none";
                formOption.style.display="none";
                formLength.style.display="block";
            }else{
                formLength.style.display="none";
                rule.style.display="none";
                formOption.style.display="block";
            }
        });

    });

    //控制配置中的名称随着规则中选择的内容而改变
    Array.prototype.forEach.call(ruleInput,function (ele) {
        AddEvent(ele,'change',function () {
            formLength.style.display="block";
            name.value=ele.nextElementSibling.textContent;
            if(ele.value=="email"||ele.value=="phonenumber"){
                formLength.style.display="none";
            }
        })
    });

    //控制选项结果的输出,并将结果保存到一个全局作用域中
    AddEvent($("option"),"keyup",function (e) {
        if(e.keyCode==13||(/ /.test(e.target.value))){
            addOption(e.target.value);
            e.target.value="";
        }
    });
    //添加选项的函数
    function addOption(text) {
        var optionText = text.trim();
        // 将其添加到数组optionArray中
        if(optionText){
            if (optionArray[0]) {
                var judge = optionArray.some(function (txt) {
                    return txt == optionText;
                });
                if (judge == false) {
                    optionArray.push(optionText);
                    render();
                }
            } else {
                optionArray.push(optionText);
                render();
            }
        }

    }
    //对新添加的选项进行渲染
    function render() {
        var optionText=optionArray[optionArray.length-1];
        var optionNode=document.createElement("div");
        var deleteIcon=document.createElement("span");
        optionNode.textContent=optionText;
        deleteIcon.textContent="删除";
        optionNode.className="optiondiv";
        deleteIcon.className="deleteicon";
        optionNode.appendChild(deleteIcon);
        optionDisplay.appendChild(optionNode);
        //对新添加的选项设置鼠标事件
        AddEvent(optionNode,"mouseover",function () {
            deleteIcon.style.display="inline-block";
        });
        AddEvent(optionNode,"mouseout",function () {
            deleteIcon.style.display="none";
        });
        AddEvent(deleteIcon,"click",function () {
            optionDisplay.removeChild(optionNode);
            optionArray.splice(optionArray.indexOf(optionText),1);
        })

    }

}
//定义获取表单数据的函数
function getFormData() {
    formData[formID]={};
    formData[formID].type=checkedItem('type');
    formData[formID].name=$("name").value;
    formData[formID].necessary=checkedItem('config');
    formData[formID].cssStyle=selectedItem('css');
    formData[formID].rule=checkedItem('rule');
    formData[formID].minLength=$('minlength').value;
    formData[formID].maxLength=$('maxlength').value;
    formData[formID].option=optionArray;
    formData[formID].id=formID;
    alertMessage = [];

}
//生成表格元素
function createFormElement() {
    var formDIV=document.createElement("div");
    var formName=document.createElement("span");
    var necessary=formData[formID].necessary;
    var form,formMessage,br;
    var submitBtn=document.getElementById("submitbtn");
    if(submitBtn==null){
        submitBtn=document.createElement("button");
        submitBtn.id="submitbtn";
        submitBtn.textContent="SUBMIT";
        submitBtn.className+="addbtn";
        formDisplay.appendChild(submitBtn);
    }
    formName.textContent=formData[formID].name;
    formDIV.appendChild(formName);
    switch (formData[formID].type){
        case 'inputtext':
            form=document.createElement("input");
            formMessage=document.createElement("p");
            formDIV.appendChild(form);
            formDIV.appendChild(formMessage);
            form.id=formID;
            switch(formData[formID].rule){
                case "text":
                    form.type="text";
                    if(!formData[formID].minLength){
                        alert("请输入字符数目下限");
                        return false;
                    }
                    if(!formData[formID].maxLength){
                        alert("请输入字符数目上限");
                        return false;
                    }
                    if(necessary=="must"){
                        formMessage.textContent="必填,请输入"+formData[formID].minLength+"-"+formData[formID].maxLength+"位字符";
                    }else{
                        formMessage.textContent="选填,请输入"+formData[formID].minLength+"-"+formData[formID].maxLength+"位字符";
                    }
                    break;
                case "email":
                    form.type="email";
                    if(necessary=="must"){
                        formMessage.textContent="必填,请输入email地址";
                    }else {
                        formMessage.textContent="选填,请输入email地址";
                    }
                    break;
                case "phonenumber":
                    form.type="text";
                    if(necessary=="must"){
                        formMessage.textContent="必填,请输入11位手机号码";
                    }else{
                        formMessage.textContent="选填,请输入11位手机号码";
                    }
                    break;
                case "password":
                    form.type="password";
                    if(!formData[formID].minLength){
                        alert("请输入字符数目下限");
                        return false;
                    }
                    if(!formData[formID].maxLength){
                        alert("请输入字符数目上限");
                        return false;
                    }
                    if(necessary=="must"){
                        formMessage.textContent="必填,请输入"+formData[formID].minLength+"-"+formData[formID].maxLength+"位字符(英文或数字)";
                    }else{
                        formMessage.textContent="选填,请输入"+formData[formID].minLength+"-"+formData[formID].maxLength+"位字符(英文或数字)";
                    }

                    break;
            }
        break;
        case 'textarea':
            form=document.createElement("textarea");
            formMessage=document.createElement("p");
            formDIV.appendChild(form);
            formDIV.appendChild(formMessage);
            form.id=formID;
            if(!formData[formID].minLength){
                alert("请输入字符数目下限");
                return false;
            }
            if(!formData[formID].maxLength){
                alert("请输入字符数目上限");
                return false;
            }
            if(necessary=="must"){
                formMessage.textContent="必填,请输入"+formData[formID].minLength+"-"+formData[formID].maxLength+"位字符";
            }else{
                formMessage.textContent="选填,请输入"+formData[formID].minLength+"-"+formData[formID].maxLength+"位字符";
            }
        break;
        case 'radio':
            if(!optionArray[0]){
                alert("请先输入选项");
                return false;
            }
            br=formDIV.innerHTML;
            br+="<br/>";
            formDIV.innerHTML=br;


            optionArray.forEach(function (option,index) {
                form=document.createElement("input");
                form.type="radio";
                form.id=formID*10+index;
                form.name="form"+formID;
                var label=document.createElement("label");
                label.textContent=option;
                label.htmlFor=formID*10+index;
                formDIV.appendChild(form);
                formDIV.appendChild(label);

            });
            formMessage=document.createElement("p");
            if(necessary=="must"){
                formMessage.textContent="必填,请选择一个选项";
            }else{
                formMessage.textContent="选填,请选择一个选项";
            }
            formDIV.appendChild(formMessage);
            break;
        case 'checkbox':
            if(!optionArray[0]){
                alert("请先输入选项");
                return false;
            }
            br=formDIV.innerHTML;
            br+="<br/>";
            formDIV.innerHTML=br;

            optionArray.forEach(function (option,index) {
                form=document.createElement("input");
                form.type="checkbox";
                form.id=formID*10+index;
                form.name="form"+formID;
                var label=document.createElement("label");
                label.textContent=option;
                label.htmlFor=formID*10+index;
                formDIV.appendChild(form);
                formDIV.appendChild(label);

            });
            formMessage=document.createElement("p");
            if(necessary=="must"){
                formMessage.textContent="必填,请选择一个或多个选项";
            }else{
                formMessage.textContent="选填,请选择一个或多个选项";
            }
            formDIV.appendChild(formMessage);
            break;
        case 'select':
            if(!optionArray[0]){
                alert("请先输入选项");
                return false;
            }
            form=document.createElement("select");
            form.id=formID;
            optionArray.forEach(function (option) {
                var label=document.createElement("option");
                label.textContent=option;
                form.appendChild(label);
            });
            formDIV.appendChild(form);
            break;
    }
    formDisplay.insertBefore(formDIV,submitBtn);
    return formDIV;

}
//确定生成表格的样式
function formElementCSS() {
    var cssStyle=selectedItem('css');
    var formDivs=formDisplay.getElementsByTagName("div");
    var message=formDisplay.getElementsByTagName("p");
    Array.prototype.forEach.call(formDivs,function (ele) {
        var text=ele.className;
        if(!text){
            text=cssStyle;
        }
        if(cssStyle=="two"){
            text.replace("one","two");
        }else{
            text.replace("two","one");
        }
        ele.className=text;
    });
    Array.prototype.forEach.call(message,function (ele) {
        var text=ele.className;
        if(!text){
            text=cssStyle;
        }
        if(cssStyle=="two"){
            text.replace("one","two");
        }else{
            text.replace("two","one");
        }
        ele.className=text;
    });
}
function formValidation() {

    var formObject=formData[formID];
    var index=formData[formID].id;
    var rule = formObject.rule;

    switch (rule){ case "text":
        var max = formObject.maxLength;
        var min = formObject.minLength;
        var input = document.getElementById(index);
        var message = input.nextElementSibling;
        var messageText=message.textContent;
        var className=message.className;
        var pattern = new RegExp("^.{" + min + "," + max + "}$");
        AddEvent(input, "blur", function (e) {
            if (!e.target.value) {
                message.textContent =messageText+",输入不能为空";
                var result=className.replace("right","wrong");
                if(result=="one" || result=="two"){
                    className += " wrong";
                }else{
                    className=result
                }
                message.className=className;
                input.className =className;
                if (formObject.necessary == "must") {
                    alertMessage[index] = formObject[name] + "不能为空";
                }
            } else {
                if (pattern.test(input.value)) {
                    message.textContent = "输入正确!";

                    var result1=className.replace("wrong","right");
                    if(result1=="one" || result1=="two"){
                        className += " right";
                    }else{
                        className=result1
                    }
                    message.className=className;
                    input.className =className;
                    alertMessage[index] = "";
                } else {
                    message.textContent = messageText+",输入错误";
                    var result2=className.replace("right","wrong");
                    if(result2=="one" || result2=="two"){
                        className += " wrong";
                    }else{
                        className=result2
                    }
                    message.className=className;
                    input.className =className;
                    if (formObject.necessary == "must") {
                        alertMessage[index] = formObject[name] + "输入不正确";
                    }
                }

            }

        });
        break;

    }
    // AddEvent($("submitBtn"),"click",function () {
    //     for(var i=0; i<alertMessage.length; i++){
    //         if(alertMessage[i]){
    //             alert(alertMessage[i]);
    //             return;
    //         }
    //     }
    // });


}