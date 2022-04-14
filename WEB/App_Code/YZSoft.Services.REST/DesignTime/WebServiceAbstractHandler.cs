using BPM.Client;
using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Services.Description;
using System.Web.Services.Protocols;
using System.Xml.Serialization;
using Newtonsoft.Json.Schema.Generation;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Text;
using System.Xml.Schema;
using System.Xml;
using System.IO.Compression;
using System.Web.Services;
using System.Dynamic;

namespace YZSoft.Services.REST.DesignTime
{
    public class WebServiceAbstractHandler : YZServiceHandler
    {
        protected List<object> GetServiceDescption(Stream wsdlStream, bool operations)
        {
            wsdlStream.Seek(0, SeekOrigin.Begin);
            List<object> rv = new List<object>();
            ServiceDescription wsdlDescription = ServiceDescription.Read(wsdlStream);
            foreach (Service service in wsdlDescription.Services)
            {
                rv.Add(new
                {
                    name = service.Name,
                    ports = this.SeriesPorts(service.Ports, wsdlStream, operations)
                });
            }

            return rv;
        }

        protected List<object> GetServices(Stream wsdlStream)
        {
            List<object> rv = new List<object>();
            ServiceDescription wsdlDescription = ServiceDescription.Read(wsdlStream);
            foreach (Service service in wsdlDescription.Services)
            {
                rv.Add(new
                {
                    name = service.Name
                });
            }

            return rv;
        }

        protected List<object> GetPorts(Stream wsdlStream, string serviceName)
        {
            List<object> rv = new List<object>();
            ServiceDescription wsdlDescription = ServiceDescription.Read(wsdlStream);

            foreach (Service service in wsdlDescription.Services)
            {
                if (service.Name == serviceName)
                {
                    foreach (Port port in service.Ports)
                    {
                        SoapAddressBinding address = this.FindExtendions<SoapAddressBinding>(port);

                        if (address != null)
                        {
                            rv.Add(new
                            {
                                name = port.Name,
                                soapVersion = (address is Soap12AddressBinding ? SoapProtocolVersion.Soap12 : SoapProtocolVersion.Default).ToString(),
                                location = address.Location
                            });
                        }
                    }
                }
            }

            return rv;
        }

        protected List<object> GetOperations(Stream wsdlStream, SoapProtocolVersion soapVersion)
        {
            wsdlStream.Seek(0, SeekOrigin.Begin);

            List<object> rv = new List<object>();
            Assembly assembly = this.GenerateClientAssembly(wsdlStream, soapVersion);
            Type serviceType = this.GetService(assembly);
            MethodInfo[] ops = this.GetOperations(serviceType);

            foreach (MethodInfo op in ops)
            {
                if (!this.IsWebMethod(op))
                    continue;

                string messageName = this.TryGetMessageName(op);

                if (messageName == op.Name)
                    messageName = null;

                rv.Add(new
                {
                    name = op.Name,
                    messageName = messageName,
                    id = String.IsNullOrEmpty(messageName) ? op.Name:(op.Name + ":" + messageName)
                });
            }

            return rv;
        }

        protected object GetInputSchema(Stream wsdlStream, SoapProtocolVersion soapVersion, string operationName, string messageName)
        {
            if (messageName == operationName || String.IsNullOrEmpty(messageName))
                messageName = null;

            Assembly assembly = this.GenerateClientAssembly(wsdlStream, soapVersion);
            Type serviceType = this.GetService(assembly);
            MethodInfo op = this.GetOperation(serviceType, operationName, messageName);
            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            JObject headers = new JObject();
            JObject body = new JObject();

            foreach (ParameterInfo param in this.GetInputParams(op))
            {
                jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;
                JSchema schema = jsonSchemaGenerator.Generate(this.GetBaseType(param.ParameterType));
                body[param.Name] = JToken.Parse(schema.ToString());
            }

            object[] headerAttrs = op.GetCustomAttributes(typeof(SoapHeaderAttribute), false);
            foreach (SoapHeaderAttribute headerAttr in headerAttrs)
            {
                if (String.IsNullOrEmpty(headerAttr.MemberName) ||
                    headerAttr.Direction != SoapHeaderDirection.In && headerAttr.Direction != SoapHeaderDirection.InOut)
                    continue;

                PropertyInfo headerPropertyInfo = serviceType.GetProperty(headerAttr.MemberName);
                JSchema schema = jsonSchemaGenerator.Generate(headerPropertyInfo.PropertyType);
                JObject jSchema = JToken.Parse(schema.ToString()) as JObject;
                JObject jProperty = jSchema["properties"] as JObject;
                jProperty.Remove("AnyAttr");
                jProperty.Remove("EncodedMustUnderstand");
                jProperty.Remove("EncodedMustUnderstand12");
                jProperty.Remove("MustUnderstand");
                jProperty.Remove("Actor");
                jProperty.Remove("Role");
                jProperty.Remove("DidUnderstand");
                jProperty.Remove("EncodedRelay");
                jProperty.Remove("Relay");
                jSchema.Remove("required");
                headers[headerPropertyInfo.PropertyType.Name] = jSchema;
            }

            return new
            {
                Headers = new
                {
                    type = "object",
                    properties = headers
                },
                Body = new
                {
                    type = "object",
                    properties = body
                }
            };
        }

        protected object GetOutputSchema(Stream wsdlStream, SoapProtocolVersion soapVersion, string operationName, string messageName)
        {
            if (messageName == operationName || String.IsNullOrEmpty(messageName))
                messageName = null;

            Assembly assembly = this.GenerateClientAssembly(wsdlStream, soapVersion);
            Type serviceType = this.GetService(assembly);
            MethodInfo op = this.GetOperation(serviceType, operationName, messageName);
            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;
            JObject headers = null;
            JObject response = new JObject();

            if (op.ReturnType != typeof(void))
            {
                JSchema schema = this.Generate(jsonSchemaGenerator,op.ReturnType);
                response["returnValue"] = JToken.Parse(schema.ToString());
            }

            foreach (ParameterInfo param in this.GetOutputParams(op))
            {
                JSchema schema = jsonSchemaGenerator.Generate(this.GetBaseType(param.ParameterType));
                response[param.Name] = JToken.Parse(schema.ToString());
            }

            object[] headerAttrs = op.GetCustomAttributes(typeof(SoapHeaderAttribute), false);
            foreach (SoapHeaderAttribute headerAttr in headerAttrs)
            {
                if (headers == null)
                    headers = new JObject();

                if (String.IsNullOrEmpty(headerAttr.MemberName) ||
                    headerAttr.Direction != SoapHeaderDirection.Out && headerAttr.Direction != SoapHeaderDirection.InOut)
                    continue;

                PropertyInfo headerPropertyInfo = serviceType.GetProperty(headerAttr.MemberName);
                JSchema schema = jsonSchemaGenerator.Generate(headerPropertyInfo.PropertyType);
                JObject jSchema = JToken.Parse(schema.ToString()) as JObject;
                JObject jProperty = jSchema["properties"] as JObject;
                jProperty.Remove("AnyAttr");
                jProperty.Remove("EncodedMustUnderstand");
                jProperty.Remove("EncodedMustUnderstand12");
                jProperty.Remove("MustUnderstand");
                jProperty.Remove("Actor");
                jProperty.Remove("Role");
                jProperty.Remove("DidUnderstand");
                jProperty.Remove("EncodedRelay");
                jProperty.Remove("Relay");
                jSchema.Remove("required");
                headers[headerPropertyInfo.PropertyType.Name] = jSchema;
            }

            dynamic rv = new ExpandoObject();

            if (headers != null)
            {
                rv.Headers = new
                {
                    type = "object",
                    properties = headers
                };
            }

            rv.Response = new
            {
                type = "object",
                properties = response
            };

            return rv;
        }

        protected JSchema Generate(JSchemaGenerator jsonSchemaGenerator, Type type)
        {
            JSchema schema;
            if (type == typeof(System.Data.DataSet))
            {
                schema = JSchema.Parse(JObject.FromObject(new
                {
                    type = "object",
                    yzext = new
                    {
                        isDataSet = true
                    },
                }).ToString());
            }
            else
            {
                schema = jsonSchemaGenerator.Generate(type);
            }

            return schema;
        }

        protected Stream GetWSDL(string wsdl)
        {
            YZUrlBuilder url = new YZUrlBuilder(wsdl);
            url.QueryString["wsdl"] = null;

            using (System.Net.WebClient wc = new System.Net.WebClient())
            {
                MemoryStream stream = new MemoryStream();
                wc.OpenRead(url.ToString()).CopyTo(stream);
                stream.Seek(0, SeekOrigin.Begin);
                return stream;
            }
        }

        protected List<object> SeriesPorts(PortCollection ports, Stream wsdlStream, bool operations)
        {
            List<object> rv = new List<object>();
            foreach (Port port in ports)
            {
                SoapAddressBinding address = this.FindExtendions<SoapAddressBinding>(port);

                if (address != null) {
                    SoapProtocolVersion soapVersion = address is Soap12AddressBinding ? SoapProtocolVersion.Soap12 : SoapProtocolVersion.Default;

                    rv.Add(new
                    {
                        name = port.Name,
                        soapVersion = soapVersion,
                        location = address.Location,
                        operations = operations ? this.GetOperations(wsdlStream, soapVersion): null
                    });
                }
            }

            return rv;
        }

        protected T FindExtendions<T>(Port port) where T:class
        {
            foreach(object ext in port.Extensions)
            {
                if (ext is T)
                    return ext as T;
            }

            return null;
        }

        protected XmlSchemaComplexType CloneType(XmlSchemaComplexType srcType, XmlSchemaComplexContentRestriction srcRestriction, XmlSchemaAttribute srcAttr, XmlAttribute srcUAttr)
        {
            string type = srcUAttr.Value;
            int index = type.LastIndexOf('[');
            string newType = type.Substring(0, index);

            XmlAttribute uattr = Activator.CreateInstance(typeof(XmlAttribute), BindingFlags.CreateInstance | BindingFlags.NonPublic | BindingFlags.Instance, null, new object[] { srcUAttr.Prefix, srcUAttr.LocalName, srcUAttr.NamespaceURI, srcUAttr.OwnerDocument }, null, null) as XmlAttribute;
            uattr.Value = newType;

            XmlSchemaAttribute attr = new XmlSchemaAttribute();
            attr.UnhandledAttributes = new XmlAttribute[1] { uattr };
            attr.UnhandledAttributes[0].Prefix = srcUAttr.Prefix;
            attr.Parent = srcAttr.Parent;
            attr.GetType().GetField("qualifiedName", BindingFlags.NonPublic | BindingFlags.Instance).SetValue(attr, new XmlQualifiedName(srcAttr.QualifiedName.Name, srcAttr.QualifiedName.Namespace));
            attr.RefName = srcAttr.RefName;

            XmlSchemaComplexContentRestriction restriction = new XmlSchemaComplexContentRestriction();
            restriction.Attributes.Add(attr);
            restriction.BaseTypeName = srcRestriction.BaseTypeName;
            restriction.Attributes.Add(attr);

            XmlSchemaComplexType complexType = new XmlSchemaComplexType();
            complexType.ContentModel = new XmlSchemaComplexContent();
            complexType.ContentModel.Content = restriction;
            complexType.Name = "YZExt_" + srcType.Name;
            complexType.Namespaces = srcType.Namespaces;
            typeof(XmlSchemaType).GetField("qname", BindingFlags.NonPublic | BindingFlags.Instance).SetValue(complexType, new XmlQualifiedName(complexType.Name, srcType.QualifiedName.Namespace));

            return complexType;
        }

        protected void ParseWSDL(ServiceDescription wsdlDescription)
        {
            foreach (object obj in wsdlDescription.Types.Schemas)
            {
                XmlSchema schema = obj as XmlSchema;
                if (schema != null)
                {
                    List<XmlSchemaComplexType> newTypes = new List<XmlSchemaComplexType>();

                    foreach (XmlSchemaObject type in schema.Items)
                    {
                        XmlSchemaComplexType complexType = type as XmlSchemaComplexType;
                        if (complexType != null)
                        {
                            XmlSchemaComplexContent contentModel = complexType.ContentModel as XmlSchemaComplexContent;
                            if (contentModel != null)
                            {
                                XmlSchemaComplexContentRestriction restriction = contentModel.Content as XmlSchemaComplexContentRestriction;
                                if (restriction != null)
                                {
                                    for (int i = 0; i < restriction.Attributes.Count; i++)
                                    {
                                        XmlSchemaAttribute parent = restriction.Attributes[i] as XmlSchemaAttribute;
                                        if (((parent != null) && (parent.RefName.Name == "arrayType")) && (parent.RefName.Namespace == "http://schemas.xmlsoap.org/soap/encoding/"))
                                        {
                                            if (parent.UnhandledAttributes != null)
                                            {
                                                foreach (XmlAttribute uattribute in parent.UnhandledAttributes)
                                                {
                                                    if ((uattribute.LocalName == "arrayType") && (uattribute.NamespaceURI == "http://schemas.xmlsoap.org/wsdl/"))
                                                    {
                                                        string str = uattribute.Value;
                                                        if (str != null && str.EndsWith("[][]"))
                                                        {
                                                            XmlSchemaComplexType newType = CloneType(complexType, restriction, parent, uattribute);
                                                            uattribute.Value = String.Format("{0}:{1}[]", schema.TargetNamespace, newType.Name);
                                                            newTypes.Add(newType);
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }

                    foreach (XmlSchemaComplexType newType in newTypes)
                        schema.Items.Add(newType);
                }
            }
        }

        protected string GetHashCode(Stream stream)
        {
            stream.Seek(0, SeekOrigin.Begin);

            YZCrc32 crc32 = new YZCrc32();
            byte[] bytes = crc32.ComputeHash(stream);

            String hash = String.Empty;
            foreach (byte b in bytes)
                hash += b.ToString("x2").ToLower();

            return stream.Length.ToString() + "." + hash;
            //using (MemoryStream ms = new MemoryStream())
            //{
            //    using (GZipStream zs = new GZipStream(ms, CompressionMode.Compress, true))
            //    {
            //        stream.CopyTo(zs);
            //    }

            //    ms.Seek(0, SeekOrigin.Begin);
            //    using (StreamReader reader = new StreamReader(ms))
            //    {
            //        return stream.Length.ToString() + "." + Math.Abs(reader.ReadToEnd().GetHashCode()).ToString();
            //    }
            //}
        }

        protected Assembly GenerateClientAssembly(Stream wsdlStream, SoapProtocolVersion soapVersion)
        {
            ServiceDescription wsdlDescription = ServiceDescription.Read(wsdlStream);
            this.ParseWSDL(wsdlDescription);

            ServiceDescriptionImporter wsdlImporter = new ServiceDescriptionImporter();

            wsdlImporter.ProtocolName = soapVersion == SoapProtocolVersion.Soap12 ? "Soap12" : "Soap";
            wsdlImporter.AddServiceDescription(wsdlDescription, null, null);
            wsdlImporter.Style = ServiceDescriptionImportStyle.Client;

            wsdlImporter.CodeGenerationOptions = CodeGenerationOptions.GenerateProperties;

            CodeNamespace codeNamespace = new CodeNamespace();
            CodeCompileUnit codeUnit = new CodeCompileUnit();
            codeUnit.Namespaces.Add(codeNamespace);

            ServiceDescriptionImportWarnings importWarning = wsdlImporter.Import(codeNamespace, codeUnit);

            if (importWarning == 0)
            {

                Microsoft.CSharp.CSharpCodeProvider codeProvider = new Microsoft.CSharp.CSharpCodeProvider();

                //设定编译参数  
                CompilerParameters cplist = new CompilerParameters();
                cplist.GenerateExecutable = false;
                cplist.GenerateInMemory = true;
                cplist.ReferencedAssemblies.Add("System.dll");
                cplist.ReferencedAssemblies.Add("System.XML.dll");
                cplist.ReferencedAssemblies.Add("System.Web.Services.dll");
                cplist.ReferencedAssemblies.Add("System.Data.dll");

                //编译代理类  
                CompilerResults compilerResults = codeProvider.CompileAssemblyFromDom(cplist, codeUnit);
                if (true == compilerResults.Errors.HasErrors)
                {
                    System.Text.StringBuilder sb = new System.Text.StringBuilder();
                    foreach (System.CodeDom.Compiler.CompilerError ce in compilerResults.Errors)
                    {
                        sb.Append(ce.ToString());
                        sb.Append(System.Environment.NewLine);
                    }
                    throw new Exception(sb.ToString());
                }

                //生成代理实例，并调用方法  
                return compilerResults.CompiledAssembly;
            }
            else
            {
                throw new Exception(importWarning.ToString());
            }
        }

        protected Type GetService(Assembly assembly/*, string serviceName*/)
        {
            foreach(Type type in assembly.GetTypes())
            {
                if (type.BaseType == typeof(SoapHttpClientProtocol) /*&& type.Name == serviceName*/)
                {
                    return type;
                }
            }

            throw new Exception(String.Format(Resources.YZStrings.Aspx_WebService_MissService));
        }

        protected SoapDocumentMethodAttribute TryGetSoapDocumentMethodAttribute(MethodInfo methodInfo)
        {
            object[] rv = methodInfo.GetCustomAttributes(typeof(System.Web.Services.Protocols.SoapDocumentMethodAttribute), false);

            if (rv.Length == 0)
                return null;

            return rv[0] as SoapDocumentMethodAttribute;
        }

        protected WebMethodAttribute TryGetWebMethodAttribute(MethodInfo methodInfo)
        {
            object[] rv = methodInfo.GetCustomAttributes(typeof(System.Web.Services.WebMethodAttribute), false);

            if (rv.Length == 0)
                return null;

            return rv[0] as WebMethodAttribute;
        }

        protected SoapRpcMethodAttribute TryGetSoapRpcMethodAttribute(MethodInfo methodInfo)
        {
            object[] rv = methodInfo.GetCustomAttributes(typeof(System.Web.Services.Protocols.SoapRpcMethodAttribute), false);

            if (rv.Length == 0)
                return null;

            return rv[0] as SoapRpcMethodAttribute;
        }

        protected string TryGetMessageName(MethodInfo op)
        {
            WebMethodAttribute attr = this.TryGetWebMethodAttribute(op);
            if (attr != null)
            {
                return attr.MessageName;
            }

            return null;
        }

        protected bool IsWebMethod(MethodInfo op)
        {
            SoapDocumentMethodAttribute soapDocumentAttr = this.TryGetSoapDocumentMethodAttribute(op);
            if (soapDocumentAttr != null)
            {
                return true;
            }
            else
            {
                SoapRpcMethodAttribute soapRpcAttr = this.TryGetSoapRpcMethodAttribute(op);
                if (soapRpcAttr != null)
                    return true;
            }

            return false;
        }

        protected XmlElementAttribute TryGetReturnXmlElementAttribute(MethodInfo methodInfo)
        {
            object[] rv = methodInfo.ReturnTypeCustomAttributes.GetCustomAttributes(typeof(XmlElementAttribute), false);

            if (rv.Length == 0)
                return null;

            return rv[0] as XmlElementAttribute;
        }

        protected MethodInfo[] GetOperations(Type serviceType)
        {
            return serviceType.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public);
        }

        protected MethodInfo[] GetOperations(Type serviceType, string operationName)
        {
            MethodInfo[] methodInfos = this.GetOperations(serviceType);

            List<MethodInfo> rv = new List<MethodInfo>();
            foreach (MethodInfo methodInfo in methodInfos)
            {
                if (String.Compare(methodInfo.Name, operationName, true) == 0)
                    rv.Add(methodInfo);
            }

            return rv.ToArray();
        }

        protected MethodInfo GetOperation(Type serviceType, string operationName, string messageName)
        {
            MethodInfo[] methodInfos = this.GetOperations(serviceType, operationName);

            if (methodInfos.Length == 1)
                return methodInfos[0];

            if (String.IsNullOrEmpty(messageName))
                messageName = null;

            foreach (MethodInfo methodInfo in methodInfos)
            {
                string itemMessageName = this.TryGetMessageName(methodInfo);

                if (String.IsNullOrEmpty(itemMessageName))
                    itemMessageName = null;

                if (messageName == itemMessageName)
                    return methodInfo;
            }

            throw new Exception(String.Format("Operation {0} dos not exist!", operationName));
        }

        protected ParameterInfo[] GetInputParams(MethodInfo method)
        {
            List<ParameterInfo> rv = new List<ParameterInfo>();

            foreach (ParameterInfo param in method.GetParameters())
            {
                if (param.IsOut)
                    continue;

                rv.Add(param);
            }

            return rv.ToArray();
        }

        protected ParameterInfo[] GetOutputParams(MethodInfo method)
        {
            List<ParameterInfo> rv = new List<ParameterInfo>();

            foreach (ParameterInfo param in method.GetParameters())
            {
                if (!param.ParameterType.IsByRef && !param.IsOut)
                    continue;

                rv.Add(param);
            }

            return rv.ToArray();
        }

        protected string UrlCombine(string url1, string url2)
        {
            if (url1 != null)
                url1 = url1.Trim();

            if (url2 != null)
                url2 = url2.Trim();

            if (String.IsNullOrEmpty(url1))
                return url2;

            if (String.IsNullOrEmpty(url2))
                return url1;

            url1 = url1.TrimEnd('/', '\\');
            url2 = url2.TrimStart('/', '\\');

            return string.Format("{0}/{1}", url1, url2);
        }

        protected Type GetBaseType(Type parameterType)
        {
            if (parameterType.IsByRef)
                return Type.GetType(parameterType.FullName.TrimEnd('&'));

            return parameterType;
        }
    }
}