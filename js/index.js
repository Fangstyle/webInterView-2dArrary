/**
 * Created by Administrator on 2017/3/10.
 */
'use strict'
const row = 10;   // 行
const column = 10; //列
window.onload= function () {
    let tArray = initArray();
    initDom(tArray,false);
    /*遍历这个二维数组  并以字符串拼接的形式制作表格*/
    changDialogNum(tArray);
    changNum(tArray);
}
function initArray() {
    var tArray = new Array();  //先声明一维
    /*初始化一个二维数组并将 二维数组的值输出到控制台*/
    for(let k=0;k<row;k++){
        tArray[k] = new Array();
        let tempOld = '';
        for(let j=0;j<=column;j++){
                tArray[k][j]=k*10+j;
                tempOld+=tArray[k][j]+" ";
        }
        console.log(tempOld);
    }
    return tArray;
}
/*
* dom绑定 将二维数组中的数据绑定到table中
* */
function initDom(tArray,refreh) {
    var tableContainer = document.getElementsByTagName('tbody')[0];
    /*添加表格的 th 表头单元格 */
    var innerText = '<tr>\n';
    for(let i=0;i<=column;i++){
        if(i==column){
            innerText += `<th>总计</th>\n`;
        }else{
            innerText += `<th>第${i+1}列</th>\n`;
        }
    }
    innerText+='</tr>\n';
   /*遍历二维数组的行和列  并且每一行增加新的一个td 放置行total*/
    for(let i=0;i<row;i++){
        innerText+='<tr>\n'
        for(let j=0;j<=column;j++){
            if(j==column){
             innerText+=`<td>1</td>\n`;
            }else{
                innerText+=`<td data-postion="${i*column+j}">${tArray[i][j]}</td>\n`;
            }
        }
        innerText+='</tr>\n'
    }
    tableContainer.innerHTML= innerText;

  /*遍历结束后 新增一行 tr 为了计算每一列的total*/
    var caculateLine =  document.createElement('tr');
    var tempTdItem = '';
    for(let i = 0 ; i<=column ;i++){
        tempTdItem +=`<td> </td>\n`;
    }
    caculateLine.innerHTML=tempTdItem;
    tableContainer.appendChild(caculateLine);
    caculate(tArray,tableContainer,column,row);
   /*判断是否刷新 如果是刷新 不对底部dom进行刷新 优化性能*/
    if(!refreh){
        let sColomn = document.getElementById('sColomn');
        let sRow = document.getElementById('sRow');
        let sColomnOptionStr = '';
        let sRowOptionStr ='';
        for(let i=0;i<column;i++){
            sColomnOptionStr +=`<option>${i+1}</option>\n`;
        }
        for(let i=0;i<row;i++){
            sRowOptionStr +=`<option>${i+1}</option>\n`;
        }
        sColomn.innerHTML=sColomnOptionStr;
        sRow.innerHTML=sRowOptionStr;
    }else{
        changDialogNum(tArray);
    }
}
function caculate(array) {
    var tbody = document.getElementsByTagName('tbody')[0];
    let tempList = tbody.getElementsByTagName('tr');
    let total = 0; //最右下角的总和
    /*计算每一列 的total*/
    let caculateTr = tempList[tempList.length-1];
    for(let i =0;i<column;i++){
        let columItemTotal = 0;
        for(let j =0;j<row;j++){
            columItemTotal+=array[j][i];
        }
        console.log(columItemTotal);
        let tdItem = caculateTr.getElementsByTagName('td');
        tdItem[i].innerHTML=columItemTotal;
    }
    /*计算每一行的 total*/
    for(let i =0;i<row;i++){
        let rowItemTotal = 0;
        for(let j =0;j<column;j++){
            rowItemTotal+=array[i][j];
        }
        total+=rowItemTotal;
        let tdList = tempList[i+1].getElementsByTagName('td');
        let tdTarget = tdList[tdList.length-1];
        tdTarget.innerHTML = rowItemTotal;
    }
    let lastLineTd = caculateTr.getElementsByTagName('td');
    let lastTd = lastLineTd[lastLineTd.length-1];
    lastTd.innerHTML = total;
}
/*点击当前的表格中的数据，出现dialog弹出框，然后进行值操作*/
function changDialogNum(tArray) {
   let trList =  document.getElementsByTagName('tr');
   let dialog = document.getElementById('alertDialog');
   let dialogConfirm = dialog.getElementsByTagName('a')[0];
   let rowPostion = 0;
   let columnPostion = 0;
   for(let i=0;i<trList.length;i++){
       trList[i].onclick = function (e) {
            let event = e||event;
           dialog.style.display='block';
           rowPostion=Math.floor(event.target.dataset.postion/column);
           columnPostion = event.target.dataset.postion%column;
            console.log(rowPostion +","+columnPostion);
       }
   }
    dialogConfirm.onclick = function () {
        dialog.style.display='none';
        let value =  parseInt(document.getElementById('finalNum').value);
        tArray[rowPostion][columnPostion] = value;
        console.log(tArray[rowPostion][columnPostion]);
        initDom(tArray,true);
    }
}
/*底部的selector 操作*/
function changNum(tArray) {
    let confirmBtn = document.getElementById('optionConfirm');
    confirmBtn.onclick = function () {
        let rowSelection = document.getElementById('sRow');
        let rowindex = rowSelection.selectedIndex;
        let rowValue = parseInt(rowSelection.options[rowindex].value);
        let columnSelection = document.getElementById('sColomn');
        let columnIndex = columnSelection.selectedIndex;
        let columnValue = parseInt(columnSelection.options[columnIndex].value);
        let value =  parseInt(document.getElementById('changNums').value);
        console.log(rowValue+","+columnIndex +value)
        if(value&&parseInt(value)){
            tArray[rowValue-1][columnValue-1] = value;
            initDom(tArray,true);
            document.getElementById('warnLabel').style.color='#000';
            document.getElementById('warnLabel').innerHTML='输入更改后的内容';
        }else{
            document.getElementById('warnLabel').style.color='#ff0000';
            document.getElementById('warnLabel').innerHTML='请输入数字';
        }

    }
}