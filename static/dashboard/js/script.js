$('body').on('click', '.save', function(e){
  console.log('send form')
  form = $(this).parents('form').serialize()  
  //$('#wait').show()
  loading()
  
  $('.form-control').attr('style', 'border: 1px solid #ced4da')
  $('.error').remove()
  $.ajax({
    url: '#',
    type: 'post',
    data: form,
    error: function(data) {
      error_form('Error intente nuevamente')
      $.each(JSON.parse(data.responseText), function(key, value){
        $(`[name="${key}"]`).focus().attr('style','border:1px solid red')
        $(`[name="${key}"]`).after(`<div class="error">${value}</div>`)
        $('.alert').hide()
      })
    },
    success: function (data){
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
    }
  })
})  
  
function edit_item(id_edit,item){
    console.log('edito')
    $('.loading').show()
    $('label.error').hide()
    $('.btn-danger').show()
    $('#title_modal').html("Edit")   
    $('#reference_code').val('')
    $.ajax({
      url : "./datos",
      type : "GET",
      data : item +"="+ id_edit,
      success : function(json){
        $('#image-input').val("")
        $('#itemID').val(json[0].id)
        $('#stock').val(json[0].stock)
        $('#reference_code').val(json[0].reference_code)
        $('.del').attr('onclick', `delete_item(this, ${json[0].id}, null)`)       
        $('#name').val(json[0].name)
        $('#category option[value='+json[0].category+']').prop('selected', true)
        json[0].price ? $('#price').val(json[0].price.toFixed(2)) : 0       
        $('#description').val(json[0].description)
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
    $('#reference_code').val('')
    $('label.error').hide()
    $('#title_modal').html("Add")
    $('.pass').show()
    $('.del').attr('disabled',true)
    $('#name').val("")
    $('#category').val("")
    $('#price').val("")
    $('#stock').val("")
    $('#description').val("")
    $('#itemID').val(0)
    $('.selectpicker').selectpicker('refresh')
  })
  //funcion save form
  
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
      type: 'delete',
      data: {item_id:item, csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()},
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
