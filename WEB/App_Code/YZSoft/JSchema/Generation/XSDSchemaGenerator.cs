using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema.Generation;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Schema;

namespace YZSoft.Web.JSchema.Generation
{
    public class XSDSchemaGenerator
    {
        JSchemaGenerator _jsonSchemaGenerator = new JSchemaGenerator();

        public XSDSchemaGenerator()
        {
            this._jsonSchemaGenerator = new JSchemaGenerator();
            this._jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;
        }

        public JObject Generate(string xsd)
        {
            XmlSchema schema = this.LoadSchema(xsd);

            JObject properties = new JObject();
            foreach (XmlSchemaElement element in schema.Elements.Values)
            {
                properties[element.Name] = this.ProcessElement(element);
            }

            return JObject.FromObject(new {
                type = "object",
                properties = properties
            });
        }

        protected XmlSchema LoadSchema(string xsd)
        {
            var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore };
            var reader = XmlReader.Create(new StringReader(xsd), settings);

            XmlSchemaSet schemaSet = new XmlSchemaSet();
            schemaSet.ValidationEventHandler += new ValidationEventHandler(this.ValidationCallback);
            schemaSet.Add(null, reader);
            schemaSet.CompilationSettings.EnableUpaCheck = false;
            schemaSet.Compile();

            XmlSchema customerSchema = null;
            foreach (XmlSchema schema in schemaSet.Schemas())
            {
                customerSchema = schema;
            }

            return customerSchema;
        }

        protected void ValidationCallback(object sender, ValidationEventArgs args)
        {
            if (args.Severity == XmlSeverityType.Warning)
                throw new Exception(args.Message);
            else if (args.Severity == XmlSeverityType.Error)
                throw new Exception(args.Message);
        }

        protected JObject ProcessElement(XmlSchemaElement element)
        {
            JObject type = this.ProcessType(element.ElementSchemaType);
            JObject rv;

            if (element.MaxOccurs > 1.0m)
            {
                rv = JObject.FromObject(new
                {
                    type = "array",
                    items = type
                });
            }
            else
            {
                rv = type;
            }

            return rv;
        }

        protected JObject ProcessType(XmlSchemaType type)
        {
            if (type is XmlSchemaComplexType)
            {
                XmlSchemaComplexType complexType = type as XmlSchemaComplexType;
                return this.ProcessComplexType(complexType);
            }
            else if (type is XmlSchemaSimpleType)
            {
                XmlSchemaSimpleType simpleType = type as XmlSchemaSimpleType;
                return this.ProcessSimpleType(simpleType);
            }

            return null;
        }

        protected JObject ProcessComplexType(XmlSchemaComplexType complexType)
        {
            XmlSchemaParticle particle = complexType.ContentTypeParticle;
            JObject properties = new JObject();

            IDictionaryEnumerator ienum = complexType.AttributeUses.GetEnumerator();
            while (ienum.MoveNext())
            {
                if (ienum.Value is XmlSchemaAttribute)
                {
                    XmlSchemaAttribute attr = ienum.Value as XmlSchemaAttribute;
                    if (attr.Use == XmlSchemaUse.Prohibited || attr.AttributeSchemaType == null)
                        continue;

                    properties["@" + attr.QualifiedName.Name] = this.ProcessSimpleType(attr.AttributeSchemaType);
                }
            }

            XmlSchemaObjectCollection items = null;
            if (particle is XmlSchemaSequence)
                items = (particle as XmlSchemaSequence).Items;
            else if (particle is XmlSchemaChoice)
                items = (particle as XmlSchemaChoice).Items;
            else if (particle is XmlSchemaAll)
                items = (particle as XmlSchemaAll).Items;

            if (items != null)
            {
                foreach (XmlSchemaObject item in items)
                {
                    if (item is XmlSchemaElement) {
                        XmlSchemaElement childElement = item as XmlSchemaElement;
                        properties[childElement.Name] = ProcessElement(childElement);
                    }
                }
            }

            return JObject.FromObject(new
            {
                type = "object",
                properties = properties
            });
        }

        protected JObject ProcessSimpleType(XmlSchemaSimpleType simpleType)
        {
            JObject type = this.GetJSchemaType(simpleType.Datatype);
            return type;
        }

        protected JObject GetJSchemaType(XmlSchemaDatatype type)
        {
            object resultType;

            if (type.Variety == XmlSchemaDatatypeVariety.List)
            {
                resultType = new
                {
                    type = "string"
                };
            }
            else
            {
                switch (type.TypeCode)
                {
                    case XmlTypeCode.AnyAtomicType:
                        resultType = new
                        {
                            type = "string"
                        };
                        break;
                    case XmlTypeCode.AnyUri:
                    case XmlTypeCode.Duration:
                    case XmlTypeCode.GDay:
                    case XmlTypeCode.GMonth:
                    case XmlTypeCode.GMonthDay:
                    case XmlTypeCode.GYear:
                    case XmlTypeCode.GYearMonth:
                        resultType = new
                        {
                            type = "string"
                        };
                        break;
                    case XmlTypeCode.Time:
                        resultType = new
                        {
                            type = "string",
                            format = "date-time"
                        };
                        break;
                    case XmlTypeCode.Idref:
                        resultType = new
                        {
                            type = "string"
                        };
                        break;
                    case XmlTypeCode.Integer:
                    case XmlTypeCode.NegativeInteger:
                    case XmlTypeCode.NonNegativeInteger:
                    case XmlTypeCode.NonPositiveInteger:
                    case XmlTypeCode.PositiveInteger:
                        resultType = new
                        {
                            type = "integer"
                        };
                        break;
                    case XmlTypeCode.DateTime:
                        resultType = new
                        {
                            type = "string",
                            format = "date-time"
                        };
                        break;
                    case XmlTypeCode.Date:
                        resultType = new
                        {
                            type = "string",
                            format = "date"
                        };
                        break;
                    default:
                        resultType = null;
                        break;
                }
            }

            if (resultType != null)
            {
                resultType = JObject.FromObject(resultType);
            }
            else
            {
                Type eleType = type.ValueType;
                Newtonsoft.Json.Schema.JSchema schema = this._jsonSchemaGenerator.Generate(eleType);
                resultType = JObject.Parse(schema.ToString());

            }

            return resultType as JObject;
        }
    }
}
