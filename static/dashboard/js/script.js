  array_tags = []
  array_tags_products = []
  items_promo = []
  //------- MENU --------
  objetos_items=""
  menu = []
  objeto = {}
  id_edit = ""
  $('.modal').on('hidden.bs.modal', function (e) {
    $('.del').html('<i class="fa fa-trash-o" aria-hidden="true"></i> Delete')
  })
  function csrfSafeMethod(method){
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  //btn edit
  function edit_item(id_edit,item){
    //--------vacia menu------  
    menu.length=0
    //--------vacia menu------ 
    console.log('edito')
    $('.loading').show()
    $('#tags_ingredients').html("")
    $('#tags_additional').html("")
    $('#json_menu').val("")
    $(".tr_menu_add").remove()
    $('.collapse').collapse('hide')
    $('#tags').html("")
    $('.tag_selected_orders').prop('checked', false)
    $('.tag_select').prop('checked', false)
    $('#stadistic_customer').show()
    $('label.error').hide()
    $('.btn-danger').show()
    $('.price_ingredient').val(0)
    $('#title_modal').html("Edit")
    $('.clock_btn').attr('data-original-title','')
    $('#time').val('')
    $('#reference_code').val('')
    $.ajax({
      url : "./datos",
      type : "GET",
      data : item +"="+ id_edit,
      success : function(json){
        $('#image-input').val("")
        $('#itemID').val(json[0].id)
        $('#reference_code').val(json[0].reference_code)
        $('#mail_user').val(json[0].email)
        $('#video').val(json[0].video)
        $('.del').attr('onclick', `delete_item(this, ${json[0].id}, null)`)
        //coupons
        json[0].expiration_date ? expiration_date = json[0].expiration_date.split(' ') : expiration_date = ''
        $('#type_discount').val(json[0].discount_type)
        $('#expiration_date').val(expiration_date[0])
        $('#limit_use').val(json[0].limit)
        json[0].counter ? $('#limit_coupon').html(json[0].counter) : $('#limit_coupon').html(0)
        //not delete user login
        if(user_log == json[0].id){
          $('.del').attr('style','pointer-events:none')
          $('[name="is_active"]').parent().parent().hide()
          $('toggle.btn.btn-primary').addClass('disabled')
        }
        if(user_log!=json[0].id){
          $('.del').attr('style','pointer-events:auto')
          $('[name="is_active"]').parent().parent().show()
          $('.toggle.btn.btn-primary').removeClass('disabled')
        }
        //not delete user login
        $('#name').val(json[0].name)
        $('#category option[value='+json[0].category+']').prop('selected', true)
        json[0].price ? $('#price').val(json[0].price.toFixed(2)) : 0
        if(json[0].status==true){
            $('#status').prop('checked', true)
            $('.toggle').attr('class','toggle btn btn-primary')
          }
          else{
            $('#status').removeAttr('checked')
            $('.toggle').attr('class','toggle btn btn-light off')
          }
        $('#description').val(json[0].description)
        if(json[0].image_thumb==""){
          $(".logo-product div").attr('style', "background-image:url(/static/dashboard/img/no-image-icon.png)")
        }else{
          $(".logo-product div").attr('style', 'background-image:url('+json[0].image_thumb+')')
        }
        //banners
        if(item == 'banner'){
          obj = json[0]
          $.each(obj, function(key, value) {  
            if(key == 'image_1_thumb' || key == 'image_2_thumb' || key == 'image_3_thumb'){
              $('.'+key).attr('style', `background-image:url(${value})`)
            }else{
              $('.'+key).attr('style', "background-image:url(/static/dashboard/img/no-image-icon.png)")
            }                    
          })
          for (i=1; i > 3; i++){
            $(`#description${i}`).val(json[0].description_image_[i])
            $(`#btn_image${i}`).val(json[0].btn_image_[i])
            $(`#cta_image${i}`).val(json[0].cta_image_[i])
          }
        }
        //banners
        //users
        $('.pass').hide()
        $('.pass input').attr('required' , false)
        $('.pass input').val('')
        $('#role option[value='+json[0].rol+']').prop('selected', true)
        //users
        //customer
        $("#email").val(json[0].email)
        $("#address").val(json[0].address)
        $("#tel").val(json[0].phone)
        $('#gender option[value='+json[0].gender+']').prop('selected', true)
        //tags contacts
        $('#cant_contacts').html(json[0].contacts)
        array_tags = []
        if (json[0].tags!=""){
          obj = json[0].tags
          $.each(obj, function(key, value) {           
            $('.tag_select[value="'+key+'"]').prop('checked', true)
            $('#tags').append('<div class="tag_selected" id="tag_id_'+key+'">'+value+'</div>')
            array_tags.push(key)
          })          
        }
        $('#array_tags').val(array_tags)
        //tags
        //Igrendientes
        $('#cant_ingredients').html(json[0].products)
        $('#price_ingredient').val(json[0].price)
        array_tags_products = []
        if (json[0].ingredients!=""){
          obj = json[0].ingredients
          $.each(obj, function(key, value) {           
            $(`.content_tags_ingredients [value="${value.id}"]`).prop('checked', true)
            $('#tags_ingredients').append(`<div onclick="remove_tag(${value.id},'tags_ingredients')" ${value.status ? '' : 'title="No Disponible"'} class="${value.status ? '' : 'disabled'} tag_selected_orders" value="${value.id}">${value.name}</div> `)
          })          
        }
        //Additionals
        array_tags_additionals = []
        if (json[0].additionals!=""){
          obj = json[0].additionals
          $.each(obj, function(key, value) {           
            $('.content_tags_additional [value="'+value.id+'"]').prop('checked', true)
            $('#tags_additional').append(`<div onclick="remove_tag(${value.id},'tags_additional')" ${value.status ? '' : 'title="No Disponible"'} class="${value.status ? '' : 'disabled'} tag_selected_orders" value="${value.id}">${value.name}</div> `)
          })          
        }
        //-------------- MENUS ------------
        if(json[0].items){
          $('#product_add option').prop('disabled', false)
          $('.selectpicker').selectpicker('refresh')
          json[0].time ? ($('#time').val(JSON.stringify(json[0].time)), 
          time= json[0].time,
          $('.clock_btn').attr('data-original-title',`De ${time[0].menu_open} a ${time[0].menu_close}`))
          : ''
          $.each(json[0].items, function(key, value){
            create_row(value.item_id, value.item_price, value.item_description, value.item_name)
            $('#product_add option[value='+value.item_id+']').prop('disabled', true);
            $('.selectpicker').selectpicker('refresh')
            menu.push({ 
              "item_id": value.item_id,
              "item_name": value.item_name,
              "item_price": value.item_price,
              "type": value.type,
              "item_description": value.item_description
            });
          })
          
          objeto = menu;
          $('#json_menu').val(JSON.stringify(objeto))
        }
        $('.loading').fadeOut(500,0)
      },
      error : function(error){
        console.log('Error en carga de respuesta');
      }
    });
  }
  //new item
  $('.btn-add').click(function(){
    $('.loading').hide()
    menu.length=0
    items_promo.length=0
    $('.ingredients').remove()
    $('input[type="checkbox"]').prop('checked', false)
    $('#video').val('')
    $('#total').val(0)
    $('.btn-danger').hide()
    //coupons
    $('#expiration_date').val('')
    $('#limit_use').val('')
    $('#limit_coupon').html(0)
    $('#reference_code').val('')
    //ADD CONTACTS
    $('#tags').html("")
    $('#email').val("")
    $('#tel').val("")
    $('#address').val("")
    $('#gender').val("")
    //
    $('.collapse').removeClass('show')
    $('.number_order_view').hide()
    $('#item_add_order option[value="0"]').prop('selected', true)
    $('#table_order option:first').prop('selected', 'selected')
    $('#cant_item').val("")
    $('#tags_ingredients').html("")
    $('#tags_additional').html("")
    $(".tr_order_add").remove();
    $('#price_promo').val("")
    $('#product_add option, #product_add_promo option').prop('disabled', false);
    $('#json_menu').val("")
    $(".tr_menu_add").remove();
    $('#stadistic_customer').hide()
    $('label.error').hide()
    $('#title_modal').html("Add")
    $('.pass').show()
    $('.del').attr('disabled',true)
    $('#mail_user').val("")  
    $('#name').val("")
    $('#category').val("")
    $('#price').val("")
    $('#status').prop('checked', true)
    $('.toggle').attr('class','toggle btn btn-primary')
    $('#description').val("")
    $('.logo-product div').attr('style', "background-image:url(/static/dashboard/img/no-image-icon.png)")
    $('#itemID').val(0)
    $('.pass input').attr('required' , true)
    $('.pass input').val("")
    $('#role option[value=0]').prop('selected', true)
    $('#cant_contacts').html()
    $('.selectpicker').selectpicker('refresh')
    $('.clock_btn').attr('data-original-title','')
    $('#time').val('')
  })
  //message
  window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).hide(); 
    });
  }, 4500);
  //funcion save form
  function upload(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    data = new FormData($(this).get(0));
    id_order= data.get('item_id')
    close_order=data.get('close_order')
    //$('#wait').show()
    loading()
    if($('[name="name_branch"]').length > 0){
      loadBranches()
    }
    $('.form-control').attr('style', 'border: 1px solid #ced4da')
    $('.error').remove()
    $.ajax({
      url: '#',
      type: 'post',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      error: function(data) {
        error_form('Error intente nuevamente')
        $.each(JSON.parse(data.responseText), function(key, value){
          $(`[name="${key}"]`).focus().attr('style','border:1px solid red')
          $(`[name="${key}"]`).after(`<div class="error">${value}</div>`)
          $('.alert').hide()
        })
        $('.alert-success').hide()
      },
      success: function(data) {
        if($('.table-body').length > 0){
            $('.table-body').html(`<div class="loading_table">
            <i class="fa-li fa fa-spinner fa-spin"></i>
            </div>`)
            //table_view.row(1).draw()
            table_view.ajax.reload()
            $(`.modal`).modal('toggle')
            $('.alert').hide()
          }
        $('.modal').modal('hide')
        
        },
        complete: function(data){
          if(close_order != null){
            //console.log(data.get('close_order'))
            $(`#order_${id_order}`).fadeOut(1000, 0)
          }else{
            if($('#orders_body').length > 0){
              loading_orders(id_order)
            }
          }
          if($('.tables_content').length > 0 ){
            load_tables($('#filter_table').val(), $('#date_select').val())
          }
          $('.alert').hide()
        } 
    });
    return false;
  }
  //funcion send form
  $('body').on('click', '.save', function(e){
      console.log('send form')
      form = $(this).parents('form')
    if($(form).attr('name')=='product'){
      $('[name="ingredients[]"]').remove()
      $('[name="additionals[]"]').remove()
      console.log('llego el form de productos')
      ingredient_array=[]
      additional_array=[]
      ingre = $('.content_tags_ingredients li input:checked')
      additional = $('.content_tags_additional li input:checked')
      $.each(ingre, function(){
        ingredient_array.push(parseInt($(this).parent().find('input').val()))
      })
      $.each(additional, function(){
        additional_array.push(parseInt($(this).parent().find('input').val()))
      })
      form.append(`
        <input type="hidden" name="ingredients[]">
        <input type="hidden" name="additionals[]">
      `)
      $('[name="ingredients[]"]').val(ingredient_array)
      $('[name="additionals[]"]').val(additional_array)
      form.submit(upload)
    }
    if($(form).attr('name')=='promotion'){
      console.log('llego el form de promo')
      $.each($(`.tbody-orders tr`), function(){
        item_id = $(this).attr('id')
        item_name = $(this).find('.name_item').html().split(' -')
        item_name = item_name[0]
        item_price = $(this).find('[name="price_item"]').val()
        item_cant = $(this).find('.cant_order_item span').html()
        item_description = $(this).find('.description').val()
        menu.push({'item_id':item_id, 'item_name':item_name, 'item_cant':item_cant, 'item_price':item_price,'item_description':item_description})
      })
      objeto.menu = menu
      $('#json_menu').val(JSON.stringify(objeto))
      //console.log($('#json_menu').val())
      form.submit(upload)
    }
    if($(form).attr('name')=='close_order'){
      console.log('llego el form de close Order')
      if($('.btn-danger').html()=='Confirm?'){
        save_close_order()
        form.submit(upload)
        $(`.modal`).modal('hide')
      }else{
        $('.btn-danger').html('Confirm?')
        return false
      }
    }
    if($(form).attr('name')=='orders'){
      console.log('llego el form de orders')
      super_reload('#order_'+$('#itemID').val())
      if($('#total').val()==0){
        error_form('The order cannot be empty')
        return false
      }else{
        createJSON('#form')
        form.submit(upload)
        $(`.modal`).modal('hide')
        
      }
    }
    if($(form).attr('name')=='tables'){
      if($('#add_table').val() == '0'){
        error_form('Debe seleccionar una mesa')
        return false
      }else{
        $(`.modal`).modal('hide')
      }
    }
    if($(form).attr('name')=='form_close_table'){
      console.log('cierre mesa')
      if($('.save').html()=="Confirm?"){
        save_json()
        $(`#table_${$(form).find('#table_ID').val()}`).fadeOut(500,0).remove()
        //return false
        load_tables(1)
        form.submit(upload)
        $(`.modal`).modal('hide')
      }else{
        $('.save').html("Confirm?").attr('type', 'submit')
        return false
      }
    }
    else{
      form.submit(upload)
    }
  })
  function super_reload(id){
    $(`${id ? id+'.tr_view_order .loading_table_text' : '.tr_view_order .loading_table_text'}`).show()
    $(`${id ? id+'.tr_view_order div' : '.tr_view_order div'}`).attr('style','color:transparent')
    $(`${id ? id+'.tr_view_order span' : '.tr_view_order span'}`).attr('style','color:transparent')
    $(`${id ? id+'.tr_view_order input' : '.tr_view_order input'}`).attr('style','display:none')
    $(`${id ? id+'.tr_view_order select' : '.tr_view_order select'}`).empty()
  }
  //funcion message error
  function error_form(message) {
    $('body').prepend(`<div class="alert-message alert mx-auto col-10 alert-danger animate__animated animate__bounceInLeft" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
            </button>
              ${message}
            </div>`)
  }
  //funcion message ok
  function loading(){
    $('.container-fluid').append(`<div class="alert alert-success animate__animated animate__bounceInLeft" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
            </button>
              SAVE
              <div class="spinner-border spinner-border-sm text-success" role="status">
              <span class="visually-hidden"></span>
              </div>
            </div>`)
  }      
  //funcion delete   
  function delete_item(button, item, confirm){
    if(confirm==null){
      $(button).parent().find('.btn-danger').html('Confirm?').attr({'type':'submit','onclick': `delete_item(this, ${item}, "bye")`})
      return false
    }
    if(confirm=="bye"){
      console.log('delete')
      $('#delete').val(-1)
      loading()
      $.ajax({
      url: $(this).attr('action'),
      type: 'post',
      data: {name: $('#name').val(), item_id:item, delete:-1, csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()},
      success: function(data) {
        if($('.table-body').length > 0){
          $('.table-body').html(`<div class="loading_table">
          <i class="fa-li fa fa-spinner fa-spin"></i>
          </div>`)
          table_view.ajax.reload()
        }
        $(`.modal`).modal('toggle')
        $('.alert').hide()
        table_view.ajax.reload()
        }
      })
    }
  }
  //Image preview
  $('.logo-product label').click(function(){
    $('.delete_image ~ input[type="text"]').prop('type', 'file', 'value','')
    console.log('click')
  })
  function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $("label[for='" + $(input).attr('id') + "'] div").attr('style', 'background-image:url('+e.target.result+')');
    }        
    reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  } 
  $(".file").change(function() {
    readURL(this);
  });
  function delete_image(image) {
    $(image).parent().find('.img-thumbnail').css('background-image', "url(/static/dashboard/img/no-image-icon.png)")
    $(image).parent().find('[type="file"]').attr('type', 'text')
    $(image).parent().find('[type="text"]').attr('value', 'delete')
  }
  //CUSTOMER TAGS
  $('.tag_select').click(function () {
    if($(this).prop("checked")==true){
      $('#tags').append('<div class="tag_selected" id="tag_id_'+$(this).val()+'">'+$(this).attr('text')+'</div>')
      array_tags.push($(this).val())
      $('#array_tags').val(array_tags)
    }else{
      $($('#tag_id_'+$(this).val()).remove())
      var arr = array_tags
      for( var i = 0; i < arr.length; i++){ 
        if ( arr[i] === $(this).val()) {
           arr.splice(i, 1); 
          }
        }
      $('#array_tags').val(array_tags)
      //console.log('removiendo = '+$(this).val());
    }
    $('.tag_selected').click(function () {
      id_tag_split = $(this).attr('id').split('tag_id_')
      $(this).remove()
      $('.tag_select[value="'+id_tag_split[1]+'"]').prop('checked', false)
      var arr = array_tags
      for( var i = 0; i < arr.length; i++){ 
        if ( arr[i] === id_tag_split[1]) {
           arr.splice(i, 1); 
          }
        }
      $('#array_tags').val(array_tags)
      //console.log('removiendo = '+id_tag_split[1]);
    })
  })
  //--------------------------------------------------------------------
  //PRODUCTS TAGS
  function add_tag(tag, type) {
    text= $(`.content_${type} input[value='${tag}']`).attr('text')
    if($(`.content_${type} input[value='${tag}']`).prop("checked")){
        $(`#${type}`).append(`<div class="tag_selected_orders" onclick="remove_tag(${tag}, '${type}')" value="${tag}" checked>${text}</div> `)
    }else{
      $(`#${type} .tag_selected_orders[value="${tag}"]`).remove()
    }  
  }
  function remove_tag(tag, type) {
    $(`.content_${type} input[value='${tag}']`).prop("checked", false)
    $(`#${type} [value='${tag}']`).remove()
  }
  //-------------------------BUSQUEDA TAGS----------------------------------
  $('.search_tag').keyup(function search() {
    filter = $(this).val().toUpperCase();
    ul = $(this).parent().parent().find('.card-body')
    li = $(this).parent().parent().find('.card-body li')
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("label")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  })
  //-------------------------BUSQUEDA ORDERS----------------------------------
  $('.search_input').keyup(function search() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    //console.log('tamo buscando')
    input = '#'+$(this).attr('id');
    filter = $(input).val().toUpperCase();
    ul = document.getElementById("orders_body");
    li = $('.tr_view_order');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      if(filter==''){
        li[i].style.display = "";
      }
      if(li.is(':visible')){
        a = li[i].querySelectorAll("."+$(this).attr('search'))[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    }
  })
  //-----------------------UPDATE NOTIFI-----------------------------------
  function refreshNoti(){
    $(".animate__flash").fadeOut(500,0).hide()
    //console.log('renovando')
    $(".animate__flash").show().fadeIn(0,500)
    setTimeout("refreshNoti()", 5000);
  }
  //-----------------------DOCUMENT READY------------------------------------
  $(document).ready(function () {  
    $('[data-toggle="tooltip"]').tooltip()
      $('#menuModal').on('hide.bs.modal', function () { 
        //CUANDO SE CIERRA EL MODAL
      });
    $('.dataTables_length').addClass('bs-select')
    refreshNoti()
  });
  //CLOCK
  setInterval(function(){
    //console.log('mando a actualizar')
    calc_time();
  },100);

  function calc_time(){
    now = new Date()
    $('[name="time_origin"]').each(function(n){
      dia_created=new Date($(this).val())
      //console.log('actualizando y devolviendo')
      tiempo_transcurrido = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(dia_created, "DD/MM/YYYY HH:mm:ss"));
      tiempo_restante = moment.duration(tiempo_transcurrido);
      
      if(Math.floor(tiempo_restante.asHours()) >= 2){
        $(this).parent().find('.clock span').html('Lost...')
      }else{
        $(this).parent().find('.clock span').html(
          moment.utc(
            moment(now, "DD/MM/YYYY HH:mm:ss")
              .diff(
                moment(dia_created, "DD/MM/YYYY HH:mm:ss")
              )
            ).format("HH:mm:ss"))
      }
    })
  }
  //----------------------------------------------------------------  
  function cancel_hours(){
    $('.hours').hide(300)
  }
  function cant_min() { 
    $('#cant_item').val(1)
  }
  //-------------------------------------------------------------------
  function del() {
    if($('.del').html()==='Confirm?'){  
      id_order=$('#itemID').val()
      data = {item_id:id_order, csrfmiddlewaretoken: '{{ csrf_token }}', delete:'-1'}
      $.ajax({
        url:'#',
        type:'post',
        data:data,
        success: function (data) {
          console.log('Orden eliminada: ',data)
          $('#orderModal').modal('hide')
          $(`#orders_body [id="order_${id_order}"]`).slideUp().remove()
        },
        error: function (data) {
          console.log('Error al eliminar la orden: ',data)
        }
      })
    }
    $('.del').html('Confirm?')
  }