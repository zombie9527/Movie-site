$(function () {
    var bookIndex = 0,
        htmls = "",
        data,
        present = 1,
        total,
        indexdone = 0;

    $.get("/api/getCategory", function (categorys) {
        data = JSON.parse(categorys);
        showBook();

        // 添加分页
        htmls = '<nav><ul class="pagination"><li class="disabled" id="prebt"><a href="javascript:;">&laquo</a></li>';
        htmls += '<li class="active"><a class="changePage" href="javascript:;">1</a></li>';
        for (var i = 0; i < Number.parseInt((data.length - 1) / 10); i++) {
            htmls += '<li><a class="changePage" href="javascript:;">' + (i + 2) + '</a></li>'
        }
        total = i + 1;
        htmls += '<li id="nextbt"><a href="javascript:;">&raquo</a></li><ul></nav>';
        $("#contents").append(htmls);
        judge();   //添加禁止点击
        $(".pagination").on('click', '.changePage', changePage);
        $("#prebt a").on('click', pre);
        $("#nextbt a").on('click', next);
        //修改
        $("#contents").on('click', '.revise', reviseid);
        //删除
        $("#contents").on('click', '.delete', deleteId);
    });
    function toInt(num) {
        return Number.parseInt(num);
    }
    function getcate() {
        $.get("/api/getCategory", function (categorys) {
            data = JSON.parse(categorys);
            showBook();
        })
    }
    function reviseid() {
        $this = $(this);
        if (indexdone) {
            $this.html("修改");
            var panode = $this.parent().parent(),
                id = panode.attr("data-id"),
                name = panode.find("td").eq(1).find("input").val();
            description = JSON.stringify(panode.find("td").eq(2).find("input").val().trim().split(' '));
            // panode.attr("contenteditable","false").css("background-color","#F7F7F7");
            $.post("/api/category/updataCategory", { id: id, name: name, description: description }, function (dat) {
                dat = JSON.parse(dat);
                if (!dat.state)
                    alert("修改失败");
                getcate();
            })
            indexdone = 0;
        }
        else {
            $this.html("完成");
            var panode = $this.parent().parent();
            editable(panode);
            // panode.attr("contenteditable","true").css("background-color","#fff");
            indexdone = 1;
        }
    }
    function editable(node) {
        node = $(node);
        var text = node.find("td").eq(1).text();
        node.find("td").eq(1).html('<input type="text" value=' + text + '>');
        text = node.find("td").eq(2).text().replace(/\,/g, " ");
        console.log(text);
        // node.find("td").eq(2).html(`<input type="text" value= ${text}>`);
        node.find("td").eq(2).html($("<input type='text'/>").val(text));
    }
    function deleteId() {
        $this = $(this);
        var panode = $this.parent().parent(),
            id = panode.attr("data-id");
        $.post('/api/category/deletebooks', {id:id}, function (dat) {
            dat = JSON.parse(dat);
            if (!dat.state)
                alert("删除失败");
            getcate();
        })
    }
    function pre() {
        if (judge() === 1)
            return false;
        bookIndex--;
        showBook();
        judge();
    }
    function next() {
        if (judge() === 2)
            return false;
        bookIndex++;
        showBook();
        judge();
    }
    function changePage(e) {
        var n = Number.parseInt(e.target.innerText);
        bookIndex = n - 1;
        showBook();
        judge();
    }
    function showBook() {                //添加图书
        htmls = "";
        present = bookIndex + 1;
        for (var i = bookIndex * 10; i < 10 * (bookIndex + 1) && i < data.length; i++) {
            var item = data[i];
            htmls += "<tr data-id=" + item.index + ">";
            for (cate in item) {
                if (cate == "include")
                    if (!!item[cate]) item[cate] = JSON.parse(item[cate]);
                    else item[cate] = " ";
                htmls += "<td>" + item[cate] + "</td>";
            }
            htmls += "<td style='width:20%'><button class='btn-info btn-xs revise' style='margin-right:20px;' type='button' >修改</button><button class='btn-info btn-xs delete' >删除</button></td></tr>";
        }
        $("#contents").find('tbody').html('')
        $("#contents").find('table').append(htmls);
        $(".pagination li").removeClass('active');
        $(".pagination li").eq(bookIndex + 1).addClass("active");
    }
    function judge() {
        var returnnum = 3;
        if (present === 1) {
            $("#prebt").addClass("disabled")
            returnnum = 1;
        } else {
            $("#prebt").removeClass("disabled")
        }
        if (present === total) {
            $("#nextbt").addClass("disabled")
            returnnum = 2;
        } else {
            $("#nextbt").removeClass("disabled")
        }
        return returnnum;
    }
    $("#addCateForm").on('click', function () {
        let name = $("#categoryName").val().trim(),
            include = JSON.stringify($("#includeCategory").val().trim().replace(/\s+/g, " ").split(' '));
        if (!name) { $('#errAlert').modal('show'); return; }
        $("#categoryName").val(" ");
        $("#includeCategory").val(" ")
        $.post("/api/addCategory", { name: name, include: include }, function (data) {
            data = JSON.parse(data);
            if (data.state) {
                $('#addCategory').modal('hide');
                getcate();
            }
            else {
                $('#errAlert').modal('show');
            }
        })
    })

})