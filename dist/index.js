/**
 * Created by Administrator on 2017/3/10.
 */
'use strict';

var row = 10; // 行
var column = 10; //列
window.onload = function () {
    var tArray = initArray();
    initDom(tArray, false);
    /*遍历这个二维数组  并以字符串拼接的形式制作表格*/
    changDialogNum(tArray);
    changNum(tArray);
};
function initArray() {
    var tArray = new Array(); //先声明一维
    /*初始化一个二维数组并将 二维数组的值输出到控制台*/
    for (var k = 0; k < row; k++) {
        tArray[k] = new Array();
        var tempOld = '';
        for (var j = 0; j <= column; j++) {
            tArray[k][j] = k * 10 + j;
            tempOld += tArray[k][j] + " ";
        }
        //console.log(tempOld);
    }
    return tArray;
}
/*
* dom绑定 将二维数组中的数据绑定到table中
* */
function initDom(tArray, refreh) {
    var tableContainer= $('#tbody');
    /*添加表格的 th 表头单元格 */
    var innerText = '<tr>\n';
    for (var i = 0; i <= column; i++) {
        if (i == column) {
            innerText += '<th>\u603B\u8BA1</th>\n';
        } else {
            innerText += '<th>\u7B2C' + (i + 1) + '\u5217</th>\n';
        }
    }
    innerText += '</tr>\n';
    /*遍历二维数组的行和列  并且每一行增加新的一个td 放置行total*/
    for (var _i = 0; _i < row; _i++) {
        innerText += '<tr>\n';
        for (var j = 0; j <= column; j++) {
            if (j == column) {
                innerText += '<td>1</td>\n';
            } else {
                innerText += '<td data-postion="' + (_i * column + j) + '">' + tArray[_i][j] + '</td>\n';
            }
        }
        innerText += '</tr>\n';
    }
    tableContainer.html(innerText);

    /*遍历结束后 新增一行 tr 为了计算每一列的total*/
    var caculateLine = $('<tr></tr>');
    var tempTdItem = '';
    for (var _i2 = 0; _i2 <= column; _i2++) {
        tempTdItem += '<td> </td>\n';
    }
    caculateLine.html(tempTdItem);

    tableContainer.append(caculateLine);
    caculate(tArray, tableContainer, column, row);

    /*判断是否刷新 如果是刷新 不对底部dom进行刷新 优化性能*/
    if (!refreh) {
        var sColomn = document.getElementById('sColomn');
        var sRow = document.getElementById('sRow');
        var sColomnOptionStr = '';
        var sRowOptionStr = '';
        for (var _i3 = 0; _i3 < column; _i3++) {
            sColomnOptionStr += '<option>' + (_i3 + 1) + '</option>\n';
        }
        for (var _i4 = 0; _i4 < row; _i4++) {
            sRowOptionStr += '<option>' + (_i4 + 1) + '</option>\n';
        }
        $(sColomn).html(sColomnOptionStr);
        $(sRow).html(sRowOptionStr);
    } else {
        changDialogNum(tArray);
    }
}
function caculate(array) {
    var tempList = $('#tbody tr');
    var total = 0; //最右下角的总和
    /*计算每一列 的total*/
    var caculateTr = tempList[tempList.length - 1];
    for (var i = 0; i < column; i++) {
        var columItemTotal = 0;
        for (var j = 0; j < row; j++) {
            columItemTotal += array[j][i];
        }
        //console.log(columItemTotal);
        var tdItem = $(caculateTr).find('td');
        $(tdItem[i]).html(columItemTotal);
    }
    /*计算每一行的 total*/
    for (var _i5 = 0; _i5 < row; _i5++) {
        var rowItemTotal = 0;
        for (var _j = 0; _j < column; _j++) {
            rowItemTotal += array[_i5][_j];
        }
        total += rowItemTotal;
        var tdList = $(tempList[_i5 + 1]).find('td');
        var tdTarget = $(tdList[tdList.length - 1]);
        tdTarget.html(rowItemTotal) ;
    }
    var lastLineTd = caculateTr.getElementsByTagName('td');
    var lastTd = lastLineTd[lastLineTd.length - 1];
    $(lastTd).html(total);
}
/*点击当前的表格中的数据，出现dialog弹出框，然后进行值操作*/
function changDialogNum(tArray) {
    var trList = document.getElementsByTagName('tr');
    var dialog = document.getElementById('alertDialog');
    var dialogConfirm = dialog.getElementsByTagName('a')[0];
    var rowPostion = 0;
    var columnPostion = 0;
/*    for (var i = 0; i < trList.length; i++) {
        trList[i].onclick = function (e) {
            var event = e || event;
            dialog.style.display = 'block';
            rowPostion = Math.floor(event.target.dataset.postion / column);
            columnPostion = event.target.dataset.postion % column;
            //console.log(rowPostion + "," + columnPostion);
        };
    }*/
    $('tr').on('click','td',function (event) {
        dialog.style.display = 'block';
        rowPostion = Math.floor(event.target.dataset.postion / column);
        columnPostion = event.target.dataset.postion % column;
    });
    dialogConfirm.onclick = function () {
        dialog.style.display = 'none';
        var value = parseInt(document.getElementById('finalNum').value);
        tArray[rowPostion][columnPostion] = value;
        //console.log(tArray[rowPostion][columnPostion]);
        initDom(tArray, true);
    };
}
/*底部的selector 操作*/
function changNum(tArray) {
    var confirmBtn = document.getElementById('optionConfirm');
    confirmBtn.onclick = function () {
        var rowSelection = document.getElementById('sRow');
        var rowindex = rowSelection.selectedIndex;
        var rowValue = parseInt(rowSelection.options[rowindex].value);
        var columnSelection = document.getElementById('sColomn');
        var columnIndex = columnSelection.selectedIndex;
        var columnValue = parseInt(columnSelection.options[columnIndex].value);
        var value = parseInt(document.getElementById('changNums').value);
        //console.log(rowValue + "," + columnIndex + value);
        if (value && parseInt(value)) {
            tArray[rowValue - 1][columnValue - 1] = value;
            initDom(tArray, true);
            document.getElementById('warnLabel').style.color = '#000';
            document.getElementById('warnLabel').innerHTML = '输入更改后的内容';
        } else {
            document.getElementById('warnLabel').style.color = '#ff0000';
            document.getElementById('warnLabel').innerHTML = '请输入数字';
        }
    };
}