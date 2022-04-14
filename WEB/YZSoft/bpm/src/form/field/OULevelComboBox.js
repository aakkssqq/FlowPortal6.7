Ext.define('YZSoft.bpm.src.form.field.OULevelComboBox', {
    extend: 'YZSoft.bpm.src.form.field.AssistComboBox',
    url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
    method: 'GetOULevels'
});