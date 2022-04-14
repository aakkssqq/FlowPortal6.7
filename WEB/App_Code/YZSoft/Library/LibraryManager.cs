using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Library
{
    public class LibraryManager
    {
        private static LibraryManager _instance = null;

        static LibraryManager()
        {
            LibraryManager._instance = new LibraryManager();
        }

        #region 公共属性

        internal static LibraryManager Instance
        {
            get
            {
                return LibraryManager._instance;
            }
        }

        #endregion

        public static void Update(IYZDbProvider provider, IDbConnection cn, Library lib)
        {
            try
            {
                provider.Update(cn, lib);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppLibrary", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Library lib)
        {
            try
            {
                provider.Insert(cn, lib);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppLibrary", e.Message);
            }
        }

        public static void UpdateOrderIndex(IYZDbProvider provider, IDbConnection cn, Library lib)
        {
            try
            {
                provider.UpdateOrderIndex(cn, lib);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppLibrary", e.Message);
            }
        }

        #region 服务

        public static LibraryCollection GetLibraries(IYZDbProvider provider, IDbConnection cn, string libType, string filter, string sort)
        {
            try
            {
                LibraryCollection alllibs = new LibraryCollection();
                using (YZReader reader = new YZReader(provider.GetLibraries(cn, libType, filter, sort)))
                {
                    while (reader.Read())
                    {
                        Library lib = new Library(reader);

                        if (!String.IsNullOrEmpty(lib.Name))
                            alllibs.Add(lib);
                    }
                }

                return alllibs;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppLibrary", e.Message);
            }
        }

        public static LibraryCollection GetLibraries(IYZDbProvider provider, IDbConnection cn, string uid, string libType, string filter, string sort)
        {
            LibraryCollection alllibs = GetLibraries(provider, cn, libType, filter, sort);

            LibraryCollection libs = new LibraryCollection();
            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();
                foreach (Library lib in alllibs)
                {
                    string rsid = String.Format("Library://{0}",lib.LibID);
                    if (BPM.Client.Security.SecurityManager.CheckPermision(bpmcn, rsid, BPMPermision.Read))
                        libs.Add(lib);
                }
            }
            return libs;
        }

        public static Library GetLibrary(IYZDbProvider provider, IDbConnection cn, int libid)
        {
            Library lib = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetLibrary(cn, libid)))
                {
                    if (reader.Read())
                        lib = new Library(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppLibrary", e.Message);
            }

            if (lib == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_Library_Ext_LibraryNotExist, libid));

            return lib;
        }

        public static void DeleteLibrary(IYZDbProvider provider, IDbConnection cn, int libid)
        {
            try
            {
                Library lib = GetLibrary(provider, cn, libid);
                lib.Deleted = true;
                lib.DeleteAt = DateTime.Now;
                lib.DeleteBy = YZAuthHelper.LoginUserAccount;
                Update(provider, cn, lib);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppLibrary", e.Message);
            }
        }

        public static void RenameLibrary(IYZDbProvider provider, IDbConnection cn, int libid, string newName)
        {
            try
            {
                Library lib = GetLibrary(provider, cn, libid);
                lib.Name = newName;
                Update(provider, cn, lib);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppLibrary", e.Message);
            }
        }


        public static void MoveLibraries(IYZDbProvider provider, IDbConnection cn,string libType, int[] libids, int targetlibid, MovePosition position)
        {
            LibraryCollection libs = GetLibraries(provider, cn, libType, null, null);

            libs.Move<int>("LibID", libids, targetlibid, position);

            for (int i = 0; i < libs.Count; i++)
            {
                Library lib = libs[i];
                lib.OrderIndex = i;
                UpdateOrderIndex(provider, cn, lib);
            }
        }

        public static int GetLibraryNextOrderIndex(IYZDbProvider provider, IDbConnection cn, string libType)
        {
            try
            {
                return provider.GetNextOrderIndex(cn, "YZAppLibrary", "LibType", libType);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppLibrary", e.Message);
            }
        }

        #endregion
    }
}