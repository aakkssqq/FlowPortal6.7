<%@ WebHandler Language="C#" Class="BPMApp.BPAKMModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using YZSoft.Web.DAL;
using System.Data;
using YZSoft.Library;
using System.Collections.Generic;

namespace BPMApp
{
    public class BPAKMModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            string uid = YZAuthHelper.LoginUserAccount;
            
            LibraryCollection libs;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    libs = LibraryManager.GetLibraries(provider, cn, uid, LibraryType.BPAFile.ToString(), null, null);
                }
            }

            List<object> libItems = new List<object>();
            foreach (Library lib in libs)
            {
                libItems.Add(new
                {
                    id = "Lib_" + lib.LibID,
                    text = lib.Name,
                    glyph = 0xeb23,
                    xclass = "YZSoft.bpm.km.lib.LibraryPanel",
                    config = new {
                        libid = lib.LibID
                    }
                });
            }

            object[] modules = new object[] {
                new {
                    text = Resources.YZStrings.Module_Cat_BPAKM,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Responsibilities",
                            text = Resources.YZStrings.Module_BPAResponsibilities,
                            glyph = 0xeb22,
                            xclass = "YZSoft.bpm.km.personal.Panel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_BPALib,
                    expanded = true,
                    children = libItems
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
