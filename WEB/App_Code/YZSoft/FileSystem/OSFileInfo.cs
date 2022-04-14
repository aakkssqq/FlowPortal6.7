using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace YZSoft.FileSystem
{
    [DataContract]
    public class OSFileInfo : YZObject, IComparable
    {
        public FileInfo FileInfo { get; set; }
        [DataMember]
        public int OrderIndex { get; set; }

        public OSFileInfo()
        {
            this.OrderIndex = Int32.MaxValue;
        }

        public OSFileInfo(FileInfo fileInfo):this()
        {
            this.FileInfo = fileInfo;

            OSFileInfo extInfo = this.TryLoadExtensionInfo(this.ExtensionFilePath);
            if (extInfo != null)
                this.Copy(extInfo);
        }

        public OSFileInfo(string path)
            : this(new FileInfo(path))
        {
        }

        public void Copy(OSFileInfo extInfo)
        {
            this.OrderIndex = extInfo.OrderIndex;
        }

        public string Name
        {
            get
            {
                return this.FileInfo.Name;
            }
        }

        public string ExtensionFilePath
        {
            get
            {
                return OSFileInfo.GetExtensionFilePath(this.FileInfo.FullName);
            }
        }

        public static string GetExtensionFilePath(string path)
        {
            return path + ".extension";
        }

        public OSFileInfo TryLoadExtensionInfo(string path)
        {
            if (System.IO.File.Exists(path))
            {
                using (StreamReader rd = new StreamReader(path))
                {
                    try
                    {
                        return JObject.Parse(rd.ReadToEnd()).ToObject<OSFileInfo>();
                    }
                    catch (Exception)
                    {
                    }
                }
            }

            return null;
        }

        public void SaveExtensionInfo()
        {
            string json = JObject.FromObject(this).ToString(Newtonsoft.Json.Formatting.Indented);
            using (FileStream fs = new FileStream(this.ExtensionFilePath, FileMode.Create, FileAccess.Write))
            {
                Encoding encoding = Encoding.UTF8;
                byte[] bytes;

                bytes = encoding.GetPreamble();
                fs.Write(bytes, 0, bytes.Length);

                bytes = encoding.GetBytes(json);
                fs.Write(bytes, 0, bytes.Length);
            }
        }

        int IComparable.CompareTo(object obj)
        {
            OSFileInfo other = obj as OSFileInfo;
            if (other == null)
                return -1;

            if (this.OrderIndex != other.OrderIndex)
                return this.OrderIndex - other.OrderIndex;
            else
                return String.Compare(this.Name, other.Name);
        }
    }
}