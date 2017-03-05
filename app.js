(function($){
    var Item = Backbone.Model.extend({
        defaults: {
            name:''
        }
    });

    var List = Backbone.Collection.extend({
        model: Item
    });


    var ItemView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click button.edit-mode': 'changeMode',
            'click button.edit-form-button': 'update',
            'click button.delete': 'remove'
        },

        initialize: function(){
            _.bindAll(this, 'render', 'unrender', 'remove', 'changeMode', 'update');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function(){
            $(this.el).html(
                '<span class="static" style="color:black;">' +
                this.model.get('name') +
                '</span>' +
                '<span class="edit-form">' +
                    '<input type="text" class="edit-form-input" style="color:black;" value="' +
                    this.model.get('name') +
                    '">' +
                    '<button class="edit-form-button">Edit</button>' +
                '</span>' +
                '&nbsp;' +
                '<button class="edit-mode" style="cursor:pointer; color:green; font-family:arial;">edit</button>' +
                '<button class="delete" style="cursor:pointer; color:red; font-family:arial;">delete</button>'
            );
            $(this.el).find('.edit-form').hide();
            return this;
        },

        unrender: function(){
            $(this.el).remove();
        },

        remove: function(){
            this.model.destroy();
        },

        changeMode: function(){
            $(this.el).find('.static').hide();
            $(this.el).find('.edit-mode').hide();
            $(this.el).find('.edit-form').show();
        },

        update: function(){
            var value = $(this.el).find('.edit-form-input').val();
            this.model.save({name: value});

            console.log(value);

            $(this.el).find('.static').show();
            $(this.el).find('.edit-mode').show();
            $(this.el).find('.edit-form').hide();
        }
    });

    var ListView = Backbone.View.extend({
        el: $('body'),
        events:{
            'click button#add': 'addItem'
        },
        initialize:function(){
            // _.bindAll(this, 'render', 'addItem', 'appendItem');

            this.collection = new List();
            this.collection.bind('add', this.appendItem);

            this.render();
        },

        render: function(){
            $(this.el).append("<ul></ul>");

            _(this.collection.model).each(function(item){
                appendItem(item);
            }, this);
        },

        addItem: function(){
            var item = new Item();
            item.set({
                name: $('#name').val()
            });
            this.collection.add(item);
            $('#name').val('');
        },

        appendItem: function(item){
            var itemView = new ItemView({
                model: item
            });

            $('ul', this.el).append(itemView.render().el);
        }
    });

    var listView = new ListView();
})(jQuery);