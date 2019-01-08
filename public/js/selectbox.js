$(function () {

    var totalPrice = 0;
   
    $('#serviceOptions').change(function () {
        nowSelected = $(this).val();
         $(".notice").delay(7000).slideDown("slow");
        if (nowSelected === 'callout') {
            $("#callout-box").slideDown("slow");
            $("#inhouse-box").hide();
            $("#drivethrough-box").hide();
            $("#callout-data").show();
            $("#inhouse-data").hide();
            $("#service-data").show();
                // totalPrice = 30.00;
            // $("#total-price").html(`$${totalPrice}`)
        
        } else if (nowSelected === 'inhouse') {
            $("#callout-box").hide();
            $("#inhouse-box").slideDown("slow");
                $("#inhouse-data").show();
            $("#drivethrough-box").hide();
              $("#callout-data").hide();
               $("#service-data").show();
            //    totalPrice = 20.00;
// $("#total-price").html(`$${totalPrice}`)
        } else if (nowSelected === 'drivethrough') {
            $("#callout-box").hide();
            $("#inhouse-box").hide();
            $("#drivethrough-box").slideDown("slow");
             $("#drivethrough-data").show();
              $("#callout-data").hide();
              $("#inhouse-data").hide();
               $("#service-data").show();
            //    totalPrice = 10.00;
            //    $("#total-price").html(`$${totalPrice}`)
        }
        
       
    });
$('.collapse').collapse()
    function addWax(service) {
        if (serive) {
            totalPrice = totalPrice + 5
            $("#total-price").html(`$${totalPrice}`)
        } else {
            totalPrice = totalPrice - 5
            $("#total-price").html(`$${totalPrice}`)

        }
    }


    $(":checkbox").change(function() {
        // isWaxing = $("#service-waxing").is(':checked');
        // isUnderbelly = $("#service-underbelly").is(':checked');
        // isEngine = $("#service-engine").is(':checked');
        // isRoof = $("#service-roof").is(':checked');
        // isSpray = $("#service-spray").is(':checked');
        // isDashboard = $("#service-dashboard").is(':checked');

        // addWax(isWaxing);
      

    })

    

    	// $("input[type=radio][checked]").each(
    	    
    	//     function () {
    	        
    	    // }
    	    
    	// );

});