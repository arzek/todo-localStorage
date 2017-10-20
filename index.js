
window.actions = {
  add: function (e) {
      e.preventDefault();
      var text = window.dom.getNewElement();

      var item = {
          id: db.getId(),
          text: text,
          status: false
      };
      window.db.setItem(item);

      window.app.build();
  },
  delete: function (id) {
      var data = db.getItems();

      var new_data = data.filter(function (item) {
          return item.id!= id;
      });
      db.setItems(new_data);

      app.build();
  },
  updateStatus: function (id) {

      var element = document.getElementById('item_checkbox_'+id);
      window.db.updateStatusItem(id);
      window.app.build();
  },
  updateText: function () {

  }
};

window.db = {
  getItems: function () {
      var json = localStorage.getItem('item');
      if(json){
          var data = JSON.parse(json);
          return data;
      }else {
          return [];
      }
  },
  getId: function () {
      return this.getMaxId() + 1;
  },
  getMaxId: function () {
      var data = this.getItems();
      var id = 0;
      if(data && data.length)
      {
          for(var i = 0; i < data.length; i++){

              if(id<data[i].id){
                  id = data[i].id;
              }
          }
          return id;
      }else {
          return 0;
      }
  },
  setItems: function (data) {
      var json = JSON.stringify(data);
      localStorage.setItem('item',json);
  },
  setItem: function (item) {
      var data = window.db.getItems();
      data.push(item);
      window.db.setItems(data);
  },
  updateItem: function (id,item) {
      var data = this.getItems();

      for(var i = 0;i < data.length; i++) {
          if(data[i].id == id){
              data[i] = item;
          }
      }
      this.setItems(data);
  },
  updateStatusItem: function (id) {
      var data = this.getItems();

      for(var i = 0;i < data.length; i++) {
          if(data[i].id == id){
              if(data[i].status){
                  data[i].status = false;
              }else {
                  data[i].status = true;
              }
          }
      }
      this.setItems(data);
  }
};

window.dom = {
    getNewElement: function () {
        var element = document.getElementById('new_item');
        var text = element.value;
        element.value = '';
        return text;
    }
};
window.html = {
    renderHtml: function (data) {
        var html = '';
        for(var i = 0; i < data.length; i++)
        {

            var span_style = '';
            var input_checked = ''
            if(data[i].status){
                span_style = ' style="text-decoration: line-through"';
                input_checked = 'checked';
            }


            html+='<li>' +
                '<input type="checkbox" onchange="actions.updateStatus(' + data[i].id + ')"  id="item_checkbox_' + data[i].id + '"  ' + input_checked + ' >' +
                '<span id="item_text_' + data[i].id + '" ' + span_style + ' >' + data[i].text + '</span>-' +
                '' +
                '<b onclick="actions.delete(' + data[i].id + ')"> delete</b>' +
                '' +
                '</li>';
        }
        return html;
    },
    renderDom: function (html) {
        document.getElementById('list').innerHTML = html;
    }
};
window.app = {
    build: function () {
        var items = window.db.getItems();
        var html = window.html.renderHtml(items);
        window.html.renderDom(html);
    }
};

app.build();