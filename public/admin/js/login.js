$(function(){
    $(document).on("submit",function(event){
        event.stopPropagation();
        event.preventDefault();
        var name = $("input:eq(0)").val();
        var password  = $("input:eq(1)").val();
        if(judge( $("input"))){
            $.post('/admin/login',{name:name,password:password},function(data){
                data = JSON.parse(data);
                if(data.state){
                    $("#tip").css("color","red").html(data.content);
                }
                else{
                    window.open( data.content,'_self');
                }
            })
        }
    });
    function judge(objes){
        for(var i = 0;i<objes.length;i++){
            var obj = objes[i];
            if(!obj.value){
                $(obj.parentNode).addClass('has-error');
                return false;
            }
            else{
                $(obj.parentNode).removeClass('has-error');
                return true;
            }
        }
    }
});