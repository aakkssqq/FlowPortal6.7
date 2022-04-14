using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using NPOI;
using NPOI.XWPF.UserModel;
using NPOI.OpenXmlFormats.Wordprocessing;
using YZNPOI.HSSF.UserModel;
using BPM;
using YZSoft.Web.DAL;
using YZSoft.Web.BPA;

namespace YZSoft.Services.REST.BPA
{
    partial class ProcessReportsHandler
    {
        public virtual object RelationshipAppGetRelatited(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            BPMObjectNameCollection spriteids = JArray.Parse(request.GetString("spriteids")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection tagfiletype = JArray.Parse(request.GetString("tagfiletype")).ToObject<BPMObjectNameCollection>();
            JArray rv = new JArray();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    this.AddReference(provider, cn, file, null, file.Property.Owner, tagfiletype, rv);
                    foreach (Sprite sprite in file.Sprites.SortByOrder())
                    {
                        if (spriteids.Count != 0 && !spriteids.Contains(sprite.Id))
                            continue;

                        this.AddReference(provider, cn, file, sprite, sprite.AllReferences, tagfiletype, rv);
                    }
                    
                    return rv;
                }
            }
        }

        public virtual object RelationshipAppGetUsedBy(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            BPMObjectNameCollection spriteids = JArray.Parse(request.GetString("spriteids")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection tagfiletype = JArray.Parse(request.GetString("tagfiletype")).ToObject<BPMObjectNameCollection>();
            JArray rv = new JArray();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);
                    SpriteLinkCollection links = BPAManager.GetFileUsedByLinks(provider, cn, fileid, null);

                    foreach (SpriteLink link in links)
                    {
                        if (!String.IsNullOrEmpty(link.LinkedSpriteID) && spriteids.Count != 0 && !spriteids.Contains(link.LinkedSpriteID))
                            continue;

                        File usedbyFile = File.TryLoad(provider, cn, link.FileID);
                        if (usedbyFile == null)
                            continue;

                        AttachmentInfo usedByAttachment = AttachmentManager.GetAttachmentInfo(provider, cn, usedbyFile.FileID);
                        if (tagfiletype.Count != 0 && !tagfiletype.Contains(usedByAttachment.Ext))
                            continue;

                        Sprite usedbySprite = usedbyFile.Sprites.TryGetItem(link.SpriteID);
                        Sprite sprite = file.Sprites.TryGetItem(link.LinkedSpriteID);

                        JObject item = new JObject();
                        rv.Add(item);
                        item["FileID"] = file.FileID;
                        item["FileName"] = file.FileName;
                        item["SpriteName"] = SpriteIdentity.ConvertSpriteName(sprite == null ? "" : sprite.Name);
                        item["RelatiedFileID"] = usedbyFile.FileID;
                        item["RelatiedFileName"] = usedbyFile.FileName;
                        item["RelatiedSpriteName"] = SpriteIdentity.ConvertSpriteName(usedbySprite == null ? "" : usedbySprite.Name);
                    }

                    return rv;
                }
            }
        }

        protected virtual void AddReference(IYZDbProvider provider, IDbConnection cn, File file, Sprite sprite, ReferenceCollection refs, BPMObjectNameCollection tagfiletype, JArray rv)
        {
            foreach (Reference @ref in refs)
            {
                AttachmentInfo tagAttachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, @ref.FileID);
                if (tagAttachment == null)
                    continue;

                if (tagfiletype.Count != 0 && !tagfiletype.Contains(tagAttachment.Ext))
                    continue;

                File tagFile = File.TryLoad(provider, cn, @ref.FileID);
                if (tagFile == null)
                    continue;

                Sprite tagSprite = tagFile.Sprites.TryGetItem(@ref.SpriteID);

                JObject item = new JObject();
                rv.Add(item);
                item["FileID"] = file.FileID;
                item["FileName"] = file.FileName;
                item["SpriteName"] = SpriteIdentity.ConvertSpriteName(sprite == null ? "" : sprite.Name);
                item["RelatiedFileID"] = tagFile.FileID;
                item["RelatiedFileName"] = tagFile.FileName;
                item["RelatiedSpriteName"] = SpriteIdentity.ConvertSpriteName(tagSprite == null ? "" : tagSprite.Name);
            }
        }
    }
}