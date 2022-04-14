
Ext.define('YZSoft.src.ux.File', {
    singleton: true,
    FileTypeIcon: {
        'ai.png': 'ai',
        'avi.png': 'avi,rmvb,mpg,mpeg,wmv,mp4v,m4v,3gp,3gpp,3g2,3gp2',
        'mov.png': 'mov',
        'mp4.png': 'mp4',
        'bmp.png': 'bmp,rle,dib,wbm,wbmp',
        'cdr.png': 'cdr',
        'chm.png': 'chm',
        'dll.png': 'dll,sys,dat,bak,drv',
        'doc.png': 'doc,docx',
        'dwg.png': 'dwg',
        'eml.png': 'eml',
        'fla.png': 'fla',
        'gif.png': 'gif',
        'htm.png': 'htm,html,asp,aspx,php',
        'ini.png': 'ini,inf',
        'jpg.png': 'jpg,jpeg,jpe,jpf,jpx,jp2,j2c',
        'mdb.png': 'mdb,mdbx',
        'mp3.png': 'mp3,mid,rmi,midi,m4a,m4r,wma,wav,snd,aac,ra',
        'pdf.png': 'pdf',
        'png.png': 'png',
        'ppt.png': 'ppt,pptx',
        'psd.png': 'psd',
        'rar.png': 'rar',
        'zip.png': 'zip',
        'rm.png': 'rm,asf,wm',
        'rtf.png': 'rtf',
        'swf.png': 'swf',
        'tif.png': 'tif,tiff,wml,raw,eps,pcx',
        'ttf.png': 'ttf,fon,otf,ttc',
        'txt.png': 'txt,log',
        'xls.png': 'xls,xlsx',
        'xml.png': 'xml'
    },

    download: function (url, params) {
        var me = this;

        if (!url)
            return;

        var form = Ext.fly('frmDummy');
        if (!form) {
            form = document.createElement('form');
            form.id = 'frmDummy';
            form.className = 'x-hidden';
            document.body.appendChild(form);
            form = Ext.fly('frmDummy');
        }
        var domform = Ext.getDom(form)

        if (Ext.os.is.iOS) {
            var hiddens = [];
            var encoding = 'multipart/form-data';
            var buf = {
                target: domform.target,
                method: domform.method,
                encoding: form.encoding,
                enctype: form.enctype,
                action: domform.action
            };

            form.set({
                target: '_blank',
                method: 'POST',
                enctype: encoding,
                encoding: encoding,
                action: url
            });

            Ext.Object.each(params, function (k, v) {
                var hd = document.createElement('input');
                Ext.fly(hd).set({
                    type: 'hidden',
                    value: v,
                    name: k
                });
                domform.appendChild(hd);
                hiddens.push(hd);
            });

            domform.submit();

            form.set(buf);
            Ext.each(hiddens, function (h) {
                Ext.removeNode(h);
            });
        }
        else if (Ext.os.is.Android) {
            YZSoft.Ajax.request({
                async: false,
                method: 'GET',
                url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
                params: {
                    method: 'GetAttachmentInfo',
                    fileid: params.fileid
                },
                success: function (action) {
                    if (Ext.String.startsWith(action.result.MimeType, 'image/')) {
                        Ext.require('YZSoft.src.ux.ImageViewer', function () {
                            YZSoft.src.ux.ImageViewer.preview({ fileid: params.fileid });
                        });
                    }
                    else
                        window.location.href = Ext.String.urlAppend(url, Ext.Object.toQueryString(params));
                },
                failure: function (action) {
                    alert(action.result.errorMessage);
                }
            });
        }
        else {
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                form: form,
                isUpload: true,
                params: params,
                success: function (response, opts) {
                    if (response.responseText) {
                        var rv = Ext.decode(response.responseText);
                        alert(Ext.util.Format.htmlDecode(rv.errorMessage));
                    }
                }
            });
        }
    },

    getIconByExt: function (ext, size) {
        var me = this;

        ext = ext || '';

        if (!me.FileTypeIconFlat) {
            me.FileTypeIconFlat = {};

            for (var propName in me.FileTypeIcon) {
                var exts = me.FileTypeIcon[propName].split(',')
                for (var o = 0; o < exts.length; o++)
                    me.FileTypeIconFlat[exts[o]] = propName;
            }
        }

        var ext = ext.replace('.', '').toLowerCase();
        var filetypeimg = me.FileTypeIconFlat[ext] || 'unknow.png';
        return YZSoft.$url(Ext.String.format('YZSoft/attachment/ext{0}/{1}', size || '', filetypeimg));
    }
});
