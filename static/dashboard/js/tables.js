  $('.link_card').click(function(){
    toggle = $(this).attr('href')
    $('.collapse').collapse('hide')
    $(toggle).collapse('show')
  })
  //-----------------------ADD DISCOUNT---------------------------------   
  discount_func={
    discount: function(){
      total= parseFloat($('.total_ticket input').val())
      discount_amount= parseFloat($('#discount').val())
      discount_amount_update= parseFloat($('.discount_amount span:eq(1)').text())
      type= $('[type="radio"]:checked').val()
      //console.log('Total: '+total)
      i=0
      if(discount_amount==0){
        //console.log('eliminado')
        $('.discount').remove()
        i=0
      }
      if(discount_amount>=0){
          discount_amount= discount_amount
          type = type
          //console.log('mayor a 0')
          i=1
        }
      if(discount_amount_update > 0 && isNaN(discount_amount)){
          discount_amount= discount_amount_update
          type = $('.type_discount').text()
          //console.log('descuento activo, input vacio')
          i=1
        }
      if(i!=0){
        $('.discount').remove()
        if(type=='%'){
          porcent=(total*discount_amount)/100
          row_discount(discount_amount, porcent,'%', total)
          //console.log('resultado %: '+porcent, 'total es: '+total)
        }else{
          result=total-discount_amount
          row_discount(discount_amount, discount_amount,'$', total)
        }
      }
    }
  }
  //-----------------------REMOVE DISCOUNT---------------------------------   
  remove_discount_func={   
    remove_discount:function(){
      total_ticket=parseFloat($('.total_ticket input').val())
      $('.discount').remove()
      $('#discount').val("")
      $('.total_ticket span').html(total_ticket)
      discount_func.discount()
      tips_func.tips()
      split_func.split()
    }
  }
  //-----------------------ADD DISCOUNT---------------------------------
  function row_discount(discount, result, type, total){
    $('.footer_order_table').before(`
        <tr class="discount">
          <td colspan="2" class="discount_amount">Discount: -<span class="type_discount">${type}</span><span>${discount}</span></td>
          <td colspan="1" class="total_discount">-$<span>${result.toFixed(2)}</span>
        </tr>
      `)
      $('.total_ticket span').html((total-result).toFixed(2))
      $('#discount').val()
      split_func.split()
  }
  //-----------------------ADD ITEM-------------------------------------   
  $('.btn-add-item-table').click(function(){
    item_indice=-1
    $('.empty_table').hide()
    $('#split').val("")
    $('#discount').val("")
    if(!$('.total_ticket input').val()){
      total_ticket=0
    }else{
      total_ticket=parseFloat($('.total_ticket input').val())
    }
    if(!$('input[name="total_orders"]').val()){
      total_orders=0
    }else{
      total_orders=parseFloat($('input[name="total_orders"]').val())
    }
    cant=$('#cant_item').val()
    price=0
    if(cant!=0){
      item=$('#item_add_order').val()
      item_split=item.split('_')
      if(item_split[0]=='promo'){
        item_id=item_split[1]
        class_item=item_split[0]
      }else{
        item_id=item_split[1]
        class_item=item_split[0]
      }
      $('.footer_order_table').remove()
      $.getJSON(`./datos?${class_item}=${item_id}`,function(json){
        if(item_split[0]=='promo'){
            insert_row_table(-1, item_id, json[0].name, cant, '<b>Promo: </b>'+ json[0].name, class_item, json[0].price*cant, item_indice)
            total_ticket= total_ticket + (json[0].price*cant)
            console.log('total ticket promo: '+total_ticket)
            footer_row(total_orders, total_ticket)
        }else{
            insert_row_table(-1, item_id, json[0].name, cant, json[0].name, class_item, json[0].price*cant, item_indice)
            total_ticket= total_ticket + (json[0].price*cant)
            console.log('total ticket item: '+total_ticket)
            footer_row(total_orders, total_ticket)
        }
      })
    }else{
        $('#cant_item').focus().css('border','1px solid red')
        console.log('cant no puede ser 0')
    }
  })
  //---------------------APPEND FOOTER----------------------------------   
  function footer_row(total_orders,total_ticket){
    $(".tbody-orders-tables").append(`
        <tr class="footer_order_table">
        <td colspan="1" class="head_order_table">Orders: ${total_orders}</td>
        <td colspan="2" class="total_ticket">Total: $<span>${total_ticket.toFixed(2)}</span>
        <input type="hidden" value="${total_ticket.toFixed(2)}" name="total_ticket">
        <input type="hidden" value="${total_orders}" name="total_orders">
        </td>
        </tr>
        `)
        discount_func.discount()
        tips_func.tips()
        split_func.split()
  }
  //---------------------CLOSE TICKET-----------------------------------
  function save_json(){
    //console.log('json')
    json={}
    data=[]
    items=[]
    ticket=[]
    order_numbers=[]
    row=$('[data-order]')
    jQuery.each(row, function(key, value){
      row=$(this).closest('tr')
      order_number=$(this).attr('orden')
      name_item= row.find(`.name_product`).text()
      id_item= row.attr(`data-order`)
      console.log('id: '+id_item)
      item= id_item.split('_')
      class_item= item[1]
      id_item= item[2]
      cant_item= row.find('.cant_order_item span').text()
      price_item= row.find('.price span').text()
      total_order= row.find('.subtotal span').text()
      order_span_name= row.find('.number_order span').text()
      if(order_span_name!=""){
          order_numbers.push(order_span_name)
        }
      if(name_item!=""){
        data.push({
          'id_item':id_item,
          'class_item': class_item,
          'name_item':name_item,
          'cant_item':cant_item,
          'price_item':price_item,
          'order':order_number
        }) 
      }
    })
    total_discount= $('.total_discount span').text()
    type_discount= $('.type_discount').text()
    split_cant= $('.split_cant span').text()
    total_split= $('.total_split span').text()
    tip_cant= $('.tips_ticket span').text()
    total_ticket_tips= $('.total_ticket_tips span').text()
    total_ticket= $('.total_ticket span').text()

    data.push({
      'total_discount':total_discount,
      'type_discount': type_discount,
      'split_cant':split_cant,
      'total_split':total_split,
      'tip_cant':tip_cant,
      'total_ticket_tips':total_ticket_tips,
      'total_ticket':total_ticket
    })
    //data.push(ticket)
    json=data
    console.log(JSON.stringify(json))
    //console.log(order_numbers)
    orders_paid = $("<input>")
              .attr("type", "hidden")
              .attr("name", "orders_paid").val(order_numbers)
    input = $("<input>")
              .attr("type", "hidden")
              .attr("name", "json").val(JSON.stringify(json))
    $('#form_close_table').append(input, orders_paid)
  }
  //---------------REMOVE ITEMS FROM TICKET------------------------------
  function remove_item_ticket(id_row, item, orden){
    $('.split').remove()
    $('#split').val("")
    price_order=$(`.orden_${orden}`)
    price_order_row= parseFloat($(`.order_${orden} .subtotal span`).text())
    precio_rest= parseFloat($(`tr#${id_row} input[name="price"]`).val())
    price_total= parseFloat($('input[name="total_ticket"]').val())
    update_price= price_total-precio_rest
    update_price_row= price_order_row-precio_rest
    $(`.order_${orden} .subtotal span`).html(update_price_row.toFixed(2))
    $('.total_ticket span').html(update_price.toFixed(2))
    $('input[name="total_ticket"]').val(update_price.toFixed(2))
    $(`tr#${id_row}`).remove()
    if($(`.orden_${orden}`).length==0){
      $(`tr.order_${orden}`).remove()
    }
    discount_func.discount()
    tips_func.tips()
    split_func.split()
  }
  //----------------------SPLIT TICKET-----------------------------------
  split_func={
    split: function(){
      if($('#split').val()!=""){
        if(!$('.split_cant span').text()){
          split_apply=0
        }else{
          split_apply= parseFloat($('.split_cant span').text())
        }
        total= parseFloat($('.total_ticket span').text())
        split_amount=parseFloat($('#split').val())
        $('.split').remove()
        $('.footer_order_table').before(`
          <tr class="split">
          <td colspan="2" class="split_cant">Total Split: <span>${split_amount}</span></td>
          <td colspan="1" class="total_split"><i class="fa fa-random" aria-hidden="true"></i> $<span>${(total/split_amount).toFixed(2)}</span>
          </tr>
          `)
      }
    }
  } 
  //------------------------ADD TIPS-------------------------------------
  tips_func={
    tips: function(){
      $('.tips').remove()
      $('#split').val("")
      //$('.discount').remove()
      $('#collapseTips').removeClass('show')
      total= parseFloat($('.total_ticket input').val())
      tips_val= $('#tips').val()
      if(tips_val=="0"){
        $('tr.tips').remove()
        //$('.total_ticket span').html(total)
        $('input[name="price_new"]').val()
      }else{
        tips_re= total*tips_val/100
        //tips_re=Math.round(tips_result)
        tips_float=parseFloat(tips_re)
        $('.total_ticket span').html((tips_float+total).toFixed(2))
        $('input[name="price_new"]').val(tips_float+total)
        $('.footer_order_table').before(`
          <tr class="tips">
            <td colspan="2">Subtotal Products</td>
            <td colspan="1" class="total_ticket_not_tips">$<span>${total.toFixed(2)}</span>
          </tr>
          <tr class="tips">
            <td colspan="2" class="tips_ticket">Tips: <span>${tips_val}</span>%</td>
            <td colspan="1" class="total_ticket_tips">$<span>${tips_re.toFixed(2)}</span>
          </tr>
        `)
      }
      discount_func.discount()
      split_func.split()
    }
  }
  //---------------------GENERATE TICKET---------------------------------
  function view_table(table_id, table_name, status){
    clicks=0
    total_ticket=0
    $('#ticketModal').addClass('orders_modal_ticket')
    $('.empty_table').hide()
    $('.loading-tables').show().fadeTo(0,500)
    $('#discount').val("")
    $('.discount').remove()
    $('.split').remove()
    $('.save').html('<i class="fa fa-money" aria-hidden="true"></i> Close')
    $('.close_table').html('<i class="fa fa-money" aria-hidden="true"></i> Close')
    $('input[name="item_id"]').val(table_id)
    $('input[name="total_ticket"]').val(0)
    $('.split').remove()
    $('.tips').remove()
    $('#split').val("")
    $('#tips').val(0)
    $('.tips').remove()
    $(`[data-order]`).remove()
    $('.head_order_table').remove()
    $('.footer_order_table').remove()
    $('.table_name').html('Table Nº '+ table_name)
    status == 'true' ? $('.save').prop('disabled', true) : $('.save').prop('disabled', false)
    $.getJSON(`./datos?tables=${table_id}&orders=all`,function(json){
      if(json.data!=""){
        $('.empty_table').hide()
        counter=[]
        $.each(json.data, function(key, value){
          orden= value.id
          total= value.total
          item_indice_new=-1
          i=0
          item_cant_array=0
          $.each(value.items.order,function(k, v){
            
            counter.includes(v.items_id) ? item_cant_array++ : ''
            console.log(item_cant_array)

            counter.push(v.items_id)
            item_split=v.items_id.split('_')
            item=item_split[2]
            class_item=item_split[1]
            item_name=v.name
            item_cant=v.cant_item
            item_promo=v.promo
            item_price=v.price_item
            item_indice=v.indice
            item_status=v.status_product
            price_float=parseFloat(item_price)

            

            if(class_item=='promo'){
              if(item_indice_new!=item_indice){
                insert_row_table(orden, item, '<b>Promo:</b> '+item_promo, item_cant, "", class_item, price_float*item_cant, item_indice)
                item_indice_new=item_indice
              }
            }else{
              insert_row_table(orden, item, item_name, item_cant, item_promo, class_item, price_float*item_cant, item_indice)
            }
  
            if(item_status==0){
              $(`[data-order="item_${class_item}_${item}"]`).last().addClass('disabled')
            }
            
            
          })
          $(".tbody-orders-tables").append(`
          <tr class="head_order_table order_${orden}">
          <td colspan="2" class="number_order">Order: Nº<span>${orden}</span></td>
          <td colspan="1" class="subtotal">$<span>${parseFloat(total).toFixed(2)}</span></td>
          </tr>
          `)
        })
      
        jQuery.each($('.head_order_table'), function(index, tr){
          subtotal=parseFloat($(tr.children[1]).find('span').text())
          total_ticket=total_ticket+subtotal
          i++
         })
        footer_row(i,total_ticket)
        $('.loading-tables').fadeTo(500, 0).hide()
      }else{
        $('.loading-tables').fadeTo(500, 0).hide()
        $('.empty_table').hide()
        $('.tbody-orders-tables').append(`
        <tr class="empty_table">
          <td colspan="4">Empty Table</td>  
        </tr>
        `)
      }
    })
  }
  id_row=0
  function insert_row_table(orden, item, name_item, cant, promo, class_item, price, indice){
    id_row++
    $(".tbody-orders-tables").append(`<tr id="${id_row}" data-order="item_${class_item}_${item}" indice="${indice}" orden="${orden}" class="orden_${orden} tr_order_add animate__animated animate__fadeIn">
          <td><div class="name_product">${name_item}</div></td>
          <td class="cant_order_item"><span>${cant}</span></td>
          <td class="price">$<span>${price.toFixed(2)}</span></td>
          <td class="delete">
          <div onclick="remove_item_ticket(${id_row},${item},${orden})" class="btn btn-outline-primary btn-sm">
            <i class="fa fa-minus-circle" aria-hidden="true"></i>
          </div>
          </td>
          <input type="hidden" name="price_new" class="price_new">
          <input type="hidden" name="price" class="price" value="${price}"></tr>`)
          id_row=id_row
  }
  //---------------------GENERATE TICKET---------------------------------   
    $(document).ready(function(){
      $(document).click(function (e) {
        if (!$(e.target).parents().hasClass('collapse')) {
          $('.collapse').collapse('hide');        
      }
      })
        for(i=1;i<61;i++){
          if($(`[open_table="${i}"]`).text()!=""){
            $('#add_table').append(`<option disabled="disabled" value="${i}">${i}</option>`)
          }else{
            $('#add_table').append(`<option value="${i}">${i}</option>`)
          }
        }
      })