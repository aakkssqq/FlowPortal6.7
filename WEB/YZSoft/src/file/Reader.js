
Ext.define('YZSoft.src.file.Reader', {
    extend: 'Ext.Evented',
    text:null,

    readLines: function () {
        var lines = this.text.replace(/(\r\n|\n\r|\n|\r)/g, '\n').split('\n');
        return lines;
    },

    getLineContent: function (lineIndex, length, startColumnIndex) {
        var me = this,
            lines = me.readLines();

        if (lineIndex <= lines.length - 1) {
            return lines[lineIndex].substr(startColumnIndex || 0, length);
        }
    },

    replaceRange: function (loc, newtext) {
        var me = this,
            lines = me.readLines(),
            newLine;

        newLine = [
            lines[loc.Start.Line - 1].substr(0, loc.Start.Column),
            newtext,
            lines[loc.End.Line - 1].substr(loc.End.Column)].join('');

        lines.splice(loc.Start.Line - 1, loc.End.Line - loc.Start.Line + 1, newLine);

        return lines.join('\r\n');
    }
});