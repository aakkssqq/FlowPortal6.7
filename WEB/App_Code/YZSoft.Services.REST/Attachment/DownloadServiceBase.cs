using System;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;
using Microsoft.Win32;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;

namespace YZSoft.Services.REST.Attachment
{
    public partial class DownloadServiceBase : AttachmentServiceBase
    {
        public override void ProcessRequest(HttpContext context)
        {
            YZAuthHelper.AshxAccessCheck(context); //cc1cc
            this.AuthCheck(context);

            YZRequest request = new YZRequest(context);
            try
            {
                string method = request.GetString("Method", "Download");

                if (!YZNameChecker.IsValidMethodName(method))
                    throw new Exception("Invalid method name");

                Type type = this.GetType();
                System.Reflection.MethodInfo methodcall = type.GetMethod(method, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
                if (methodcall == null)
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_UnknowCommand, method));

                try
                {
                    methodcall.Invoke(this, new object[] { context });
                }
                catch (Exception exp)
                {
                    throw exp.InnerException;
                }
            }
            catch (Exception e)
            {
                JObject rv = new JObject();
                rv["success"] = false;
                rv["errorMessage"] = HttpUtility.HtmlEncode(YZSetting.Debug ? String.Format("{0}.{1}\n{2}", this.GetType().FullName, context.Request.Params["method"], e.Message) : e.Message);
                context.Response.Write(rv.ToString(Formatting.Indented, request.Converters));
            }
        }
    }
}
