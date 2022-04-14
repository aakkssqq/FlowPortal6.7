using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using BPM;
using YZSoft.Web.DAL;

public partial class YZSoft_Attachment_PreviewImage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        YZRequest request = new YZRequest(this.Context);
        string imageurl = request.GetString("imageurl", null);
        string fileid = request.GetString("fileid",null);

        if (String.IsNullOrEmpty(imageurl))
        {
            AttachmentInfo attachmentInfo = new AttachmentInfo();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachmentInfo = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);
                }
            }

            this.Title = attachmentInfo.Name;
            imageurl = String.Format("~/YZSoft.Services.REST/Attachment/Download.ashx?method=ImageStreamFromFileID&fileid={0}", fileid);
        }

        this._img.ImageUrl = imageurl;
    }
}