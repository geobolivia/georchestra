Ext.define('Analytics.view.GeonetworkFiles', {
    extend: 'Analytics.view.FilteredGeonetworkFiles',
    alias: 'widget.geonetworkfileslist',
    store: 'GeonetworkFiles',

    initComponent: function() {
        // in order to have the tooltip over each row:
        this.columns = {
            defaults: {
                renderer: function(value, md){ 
                    md.tdAttr = 'data-qtip="double-cliquez pour afficher le détail"';
                    return value;
                }
            }
        };
        this.callParent();
    },

    onItemDoubleClick: function(view, rec) {
        var st = Ext.getStore('FilteredGeonetworkUsers');
        st.filters.clear();       
        st.filter([{
            property: 'filename',
            value: rec.get('filename')
        }, {
            property: 'metadata_id',
            value: rec.get('metadata_id')
        }]);

        new Ext.Window({
            title: [
                'Utilisateurs ayant téléchargé le fichier',
                rec.get('filename'),
                'de la métadonnée',
                rec.get('metadata_id')
            ].join(' '),
            width: 800,
            height: 400,
            layout: 'fit',
            items: [Ext.create('Analytics.view.FilteredGeonetworkUsers', {
                border: false
            })]
        }).show();
    }
});
