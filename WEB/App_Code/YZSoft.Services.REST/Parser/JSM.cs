using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace YZSoft.Services.REST.Parser
{
    public class JSMHandler : YZServiceHandler
    {
        public virtual object GetASTTree(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string jsCode = request.GetPostData();

            Jint.Parser.JavaScriptParser parser = new Jint.Parser.JavaScriptParser(true);
            Jint.Parser.ParserOptions opts = new Jint.Parser.ParserOptions();
            opts.Comment = false;
            opts.Tolerant = true;
            opts.Tokens = false;
            try
            {
                var parserResult = parser.Parse(jsCode, opts);

                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                serializer.Converters.Add(new StringEnumConverter());

                return JObject.FromObject(parserResult, serializer);
            }
            catch (Jint.Parser.ParserException exp)
            {
                return new
                {
                    success = false,
                    Description = exp.Description,
                    LineNumber = exp.LineNumber,
                    errorMessage = exp.Message
                };
            }
        }
    }
}