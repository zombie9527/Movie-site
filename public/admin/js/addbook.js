$(function(){
    var bookIndex=0,
        htmls="",
        data,
        present=1,
        total,
        indexdone=0,
        cates,formatcate=[];
    
    $.get("/allbook",function(books){
        data = JSON.parse(books);
        $.get("/getcategory",function(categorys){
            cates = JSON.parse(categorys);
            for(var cate of cates){
                formatcate[cate.id] = cate.name;
            }
            showBook();
        });
        
        // 添加分页
        htmls='<nav><ul class="pagination"><li class="disabled" id="prebt"><a href="javascript:;">&laquo</a></li>';
        htmls+='<li class="active"><a class="changePage" href="javascript:;">1</a></li>';
        for(var i = 0;i<Number.parseInt((data.length-1)/10);i++){
            htmls+='<li><a class="changePage" href="javascript:;">'+(i+2)+'</a></li>'
        }
        total = i+1;
        htmls+='<li id="nextbt"><a href="javascript:;">&raquo</a></li><ul></nav>';
        $("#contents").append(htmls);
        judge();   //添加禁止点击
        $(".pagination").on('click','.changePage',changePage);
        $("#prebt a").on('click',pre);
        $("#nextbt a").on('click',next);
        //修改
        $("#contents").on('click','.revise',reviseid);
        //删除
        $("#contents").on('click','.delete',deleteId);
    });
    function getbooks(){
        $.get("/allbook",function(books){
            data = JSON.parse(books);
            showBook();
        });
    }
    function reviseid(){
    	$this = $(this);
    	if(indexdone){
    		$this.html("修改");
    		var panode = $this.parent().parent(),
	    		id = panode.attr("data-id"),
                name = panode.find("td").eq(0).find("input").val();
                price = panode.find("td").eq(1).find("input").val();
                category = panode.find("td").eq(3).find("option:selected").attr('data-id');
            //panode.attr("contenteditable","false").css("background-color","#F7F7F7");
	    	$.post("/books/updatabooks",{id:id,name:name,price:price},function(dat){
                dat = toInt(dat);
                    if(!dat)
                        alert("修改失败");
                    getbooks();
            })
            indexdone=0;
    	}
    	else{
    		$this.html("完成");
    		var panode = $this.parent().parent();
            editable(panode[0]);
            // panode.attr("contenteditable","true").css("background-color","#fff");
            indexdone=1;
    	}
    }
    function editable(node){
        node = $(node);
        // var text = node.childNodes[0].innerText;
        var text = node.find("td").eq(0).text();
        node.find("td").eq(0).html('<input type="text" value='+text+'>');
        text = node.find("td").eq(1).text();
        node.find("td").eq(1).html('<input type="text" value='+text+'>');
        text = node.find("td").eq(2).text();
        node.find("td").eq(2).html('<input type="file" multiple="multiple" value='+text+'>');
        text = node.find("td").eq(3).text();
        node.find("td").eq(3).html(addSelect(text));
    }
    function unedit(node){

    }
    function addSelect(num){
        var sel = $("<select></select>")
        var opt;
        for(var cate of cates){
            opt=$("<option data-id="+cate.id+">"+cate.name+"</option>")
            if(cate.id === num){
                opt.attr("selected","true");
            }
            sel.append(opt);
        }
        return sel;
    }
    function deleteId(){
    	$this = $(this);
    	var panode = $this.parent().parent(),
	    	id = panode.attr("data-id");
	    $.post('/books/deletebooks',{id:id},function(dat){
	    	dat = toInt(dat);
            if(dat)
                alert("删除失败");
            getbooks();
	    })
    }
    function toInt(num){
        return Number.parseInt(num);
    }
    //前一页
    function pre(){
        if(judge()===1)
            return false;
        bookIndex--;
        showBook();
        judge();
    }
    function next(){
        if(judge() === 2)
            return false;
        bookIndex++;
        showBook();
        judge();
    }
    function changePage(e){
        var n = Number.parseInt(e.target.innerText);
        bookIndex=n-1;
        showBook();
        judge();
    }
    function showBook(){                //添加图书
        htmls="";
        present = bookIndex+1;
        for(var i = bookIndex*10;i<10*(bookIndex+1)&&i<data.length;i++){
            var item = data[i];
            htmls+="<tr data-id="+item.id+"><td>"+item.name+"</td><td>"+item.price+"</td><td><span class='bind_hover_card' data-toggle='popover' style='cursor:Pointer; text-decoration:underline' data-placement='right' data-trigger='hover'>"+item.img_url+"</span></td><td>"+formatcate[item.category]+"</td><td style='width:20%' contenteditable='false'><button class='btn-defult btn-xs revise' style='margin-right:20px;' type='button' >修改</button><button class='btn-defult btn-xs delete' >删除</button></td></tr>"
        }
        $("#contents").find('tbody').html('')
        $("#contents").find('table').append(htmls);
        $(".pagination li").removeClass('active'); 
        $(".pagination li").eq(bookIndex+1).addClass("active");
        $("[data-toggle='popover']").popover({
            html : true, 
            delay:{show:10, hide:10},
            content: function() {
            return "<img src='/bookStore/images/"+this.innerText+"' alt="+this.innerText+" height=35 width=30/>";  
            } 
        });
    }
    function judge(){
        var returnnum = 3;
        if(present===1){
            $("#prebt").addClass("disabled")
            returnnum = 1;
        }else{
            $("#prebt").removeClass("disabled")
        }
        if(present===total){
            $("#nextbt").addClass("disabled")
            returnnum = 2;
        }else{
            $("#nextbt").removeClass("disabled")
        }
        return returnnum;
    }
    
})