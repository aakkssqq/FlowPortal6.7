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
        public virtual object RelationshipAppGetNonRelatited(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            BPMObjectNameCollection spriteids = JArray.Parse(request.GetString("spriteids")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection tagfiletype = JArray.Parse(request.GetString("tagfiletype")).ToObject<BPMObjectNameCollection>();
            SpriteIdentityCollection rv = new SpriteIdentityCollection();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    foreach (Sprite sprite in file.Sprites.SortByOrder())
                    {
                        if (spriteids.Count != 0 && !spriteids.Contains(sprite.Id))
                            continue;

                        if (tagfiletype.Count == 0)
                        {
                            if (sprite.AllReferences.Count != 0)
                                continue;
                        }
                        else
                        {
                            bool find = false;
                            foreach (Reference @ref in sprite.AllReferences)
                            {
                                AttachmentInfo tagAttachment = AttachmentManager.TryGetAttachmentInfo(provider,cn,@ref.FileID);
                                if (tagAttachment != null && tagfiletype.Contains(tagAttachment.Ext))
                                {
                                    find = true;
                                    break;
                                }
                            }

                            if (find)
                                continue;
                        }

                        rv.Add(new SpriteIdentity(sprite));
                    }
                    
                    return rv;
                }
            }
        }

        public virtual object RelationshipAppGetNonUsedBy(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            BPMObjectNameCollection spriteids = JArray.Parse(request.GetString("spriteids")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection tagfiletype = JArray.Parse(request.GetString("tagfiletype")).ToObject<BPMObjectNameCollection>();
            SpriteIdentityCollection rv = new SpriteIdentityCollection();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);
                    SpriteLinkCollection links = BPAManager.GetFileUsedByLinks(provider, cn, fileid, null);

                    foreach (Sprite sprite in file.Sprites.SortByOrder())
                    {
                        if (spriteids.Count != 0 && !spriteids.Contains(sprite.Id))
                            continue;

                        if (tagfiletype.Count == 0)
                        {
                            bool find = false;
                            foreach (SpriteLink link in links)
                            {
                                if(NameCompare.EquName(link.LinkedSpriteID,sprite.Id))
                                {
                                    find = true;
                                    break;
                                }
                            }

                            if (find)
                                continue;
                        }
                        else
                        {
                            bool find = false;
                            foreach (SpriteLink link in links)
                            {
                                bool attachmentInfoSetted = link["attachmentInfoSetted"] == null ? false:Convert.ToBoolean(link["attachmentInfoSetted"]);

                                AttachmentInfo srcAttachment;
                                if (attachmentInfoSetted)
                                {
                                    srcAttachment = link["attachmentInfo"] as AttachmentInfo;
                                }
                                else
                                {
                                    srcAttachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, link.FileID);
                                    link["attachmentInfo"] = srcAttachment;
                                    link["attachmentInfoSetted"] = true;
                                }

                                if (tagfiletype != null && tagfiletype.Contains(srcAttachment.Ext))
                                {
                                    find = true;
                                    break;
                                }
                            }

                            if (find)
                                continue;
                        }

                        rv.Add(new SpriteIdentity(sprite));
                    }

                    return rv;
                }
            }
        }
    }
}