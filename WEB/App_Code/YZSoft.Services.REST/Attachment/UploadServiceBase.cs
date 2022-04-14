using System;
using System.Collections;
using System.Collections.Generic;
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
    public partial class UploadServiceBase : AttachmentServiceBase
    {
        public override void ProcessRequest(HttpContext context)
        {
            YZAuthHelper.AshxAccessCheck(context); //cc1cc
            this.AuthCheck(context);

            YZRequest request = new YZRequest(context);
            try
            {
                if (!YZAuthHelper.IsAuthenticated)
                {
                    string account = request.GetString("UploadAuthorAccount",null);
                    string uploadToken = request.GetString("UploadAuthorToken",null);

                    if (!String.IsNullOrEmpty(account) && !String.IsNullOrEmpty(uploadToken))
                    {
                        if (YZSecurityHelper.CheckUploadToken(account, uploadToken))
                            YZAuthHelper.SetAuthCookie(account);
                    }
                }

                if (!YZAuthHelper.IsAuthenticated)
                {
                    JObject rv = new JObject();
                    rv["success"] = false;
                    rv["errorMessage"] = Resources.YZStrings.Aspx_Upload_NoAuth;
                    context.Response.Write(rv.ToString());
                    return;
                }

                HttpFileCollection files = context.Request.Files;
                if (files.Count > 0 && files[0].ContentLength > 0)
                {
                    HttpPostedFile file = files[0];
                    string fileName = System.IO.Path.GetFileName(file.FileName);
                    long fileSize = file.ContentLength;
                    string fileExt = System.IO.Path.GetExtension(fileName).ToLower();
                    string method = request.GetString("Method", "SaveAttachment");

                    if (!YZNameChecker.IsValidMethodName(method))
                        throw new Exception("Invalid method name");

                    Type type = this.GetType();
                    System.Reflection.MethodInfo methodcall = type.GetMethod(method, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
                    if (methodcall == null)
                        throw new Exception(String.Format(Resources.YZStrings.Aspx_UnknowCommand, method));

                    object rv;
                    try
                    {
                        rv = methodcall.Invoke(this, new object[] { context, file, fileName, fileSize, fileExt });
                    }
                    catch (Exception exp)
                    {
                        throw exp.InnerException;
                    }

                    JToken jToken;
                    if (rv == null)
                    {
                        jToken = new JObject();
                        jToken["success"] = true;
                    }
                    else if (rv is JToken)
                    {
                        jToken = rv as JToken;
                    }
                    else
                    {
                        if (rv is string)
                            jToken = JValue.FromObject(rv);
                        else if (rv is IEnumerable)
                            jToken = JArray.FromObject(rv);
                        else
                            jToken = JValue.FromObject(rv);
                    }

                    context.Response.Write(jToken.ToString(Formatting.Indented, request.Converters));
                }
                else
                {
                    JObject rv = new JObject();
                    rv[YZJsonProperty.success] = false;
                    rv[YZJsonProperty.errorMessage] = Resources.YZStrings.Aspx_Invalid_File;
                    context.Response.Write(rv.ToString(Formatting.Indented, request.Converters));
                }
            }
            catch (Exception exp)
            {
                JObject rv = new JObject();
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = HttpUtility.HtmlEncode(exp.Message)/* + exp.StackTrace*/;
                context.Response.Write(rv.ToString(Formatting.Indented, request.Converters));
            }
        }
    }
}
