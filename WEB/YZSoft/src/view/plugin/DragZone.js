
Ext.define('YZSoft.src.view.plugin.DragZone', {
    extend: 'Ext.view.DragZone',

    getDragData: function (e) {
        var view = this.view,
            item = e.getTarget(view.getItemSelector());

        e.preventDefault();

        if (item) {
            return {
                copy: view.copy || (view.allowCopy && e.ctrlKey),
                event: e,
                view: view,
                ddel: this.ddel,
                item: item,
                records: view.getSelectionModel().getSelection(),
                fromPosition: Ext.fly(item).getXY()
            };
        }
    }
});