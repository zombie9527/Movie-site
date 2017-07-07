$(function(){
    var thetype = 0,theurl='',thestart=0,thecount=10;
    $('.radio-inline').on("click",function(event){
        event.stopPropagation();
        thetype = $(this).find("input").val();
        if(thetype == 3){
            $("#urlbox").css('display','');
        }else{
            $("#urladdress").val('')
            $("#urlbox").css('display','none');
        }
    });
    $("#addMovieBtn").on('click',function(){
        thestart = $("#startPosition").val() || 0;
        thecount = $("#getCount").val() || 0;
        theurl = $("#urladdress").val() || '';
        $.post('/api/movie/add',{thestart,thecount,thetype,theurl},(data)=>{
            $("#resultBox").val(data);
        })
    });
});