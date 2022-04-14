using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.FileSystem
{
    public class FolderCollection: BPMList<Folder>
    {
        protected override string GetKey(Folder value)
        {
            return Convert.ToString(value.FolderID);
        }

        public int[] IDs
        {
            get
            {
                List<int> ids = new List<int>();
                foreach (Folder folder in this)
                {
                    ids.Add(folder.FolderID);
                }

                return ids.ToArray();
            }
        }

        public FolderCollection BuildTree(int folderid)
        {
            FolderCollection rootFolders = new FolderCollection();
            foreach (Folder folder in this)
            {
                if (folder.FolderID == folderid)
                {
                    rootFolders.Add(folder);
                    continue;
                }

                Folder parent = this.TryGetItem(Convert.ToString(folder.ParentID));
                if (parent != null)
                    parent.ChildFolders.Add(folder);
            }

            return rootFolders;
        }

        public FolderCollection Expand()
        {
            FolderCollection rv = new FolderCollection();
            this.Expand(rv);
            return rv;
        }

        private void Expand(FolderCollection rv)
        {
            foreach (Folder folder in this)
            {
                rv.Add(folder);
                folder.ChildFolders.Expand(rv);
            }
        }
    }
}