using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.Org;
using YZSoft.Services.REST.Attachment;

namespace YZSoft.Services.REST.BPM
{
    public class EmployeeHandler : AttachmentServiceBase
    {
        public virtual object GetEmployeeInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account");
            bool includeDisabledUser = request.GetBool("includeDisabledUser",false);
            bool defaultPosition = request.GetBool("defaultPosition", false);

            User user;
            List<object> rvPositions = new List<object>();
            List<object> supervisors = new List<object>();
            List<object> directXSs = new List<object>();
            List<object> roles = new List<object>();
            object[] groups;
            
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                
                user = User.FromAccount(cn, account);

                MemberCollection positions = OrgSvr.GetUserPositions(cn,account);
                foreach (Member member in positions)
                {
                    rvPositions.Add(
                        new
                        {
                            ou = member.GetParentOU(cn).GetFriendlyFullName(cn),
                            LeaderTitle = member.LeaderTitle,
                            Level = member.Level,
                            MemberFullName = member.FullName,
                            IsDefaultPosition = defaultPosition ? User.IsDefaultPosition(cn, user.Account, member.FullName) : false
                        }
                    );

                    supervisors.AddRange(OrgManager.GetSupervisors(cn, member.FullName, includeDisabledUser));
                    directXSs.AddRange(OrgManager.GetDirectXSs(cn, member.FullName, includeDisabledUser));
                    roles.AddRange(OrgManager.GetRoles(cn, member.FullName));
                }

                groups = OrgManager.GetGroups(cn, account);
            }

            return new {
                user = user,
                positions = rvPositions,
                supervisors = supervisors,
                directxss = directXSs,
                roles = roles,
                groups = groups
            };
        }

        public virtual object GetTipInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account");

            User user;
            object defaultPosition = null;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                user = User.FromAccount(cn, account);

                Member member = OrgSvr.TryGetMemberFromAccount(cn, account);
                if (member != null)
                {
                    defaultPosition = new
                    {
                        parentouName = member.GetParentOU(cn).Name,
                        oufullName = member.GetParentOU(cn).GetFriendlyFullName(cn),
                        LeaderTitle = member.LeaderTitle,
                        Level = member.Level
                    };
                }
            }

            return new
            {
                user = user,
                position = defaultPosition
            };
        }

        public virtual object GetContactInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account");

            User user;
            object defaultPosition = null;
            List<object> supervisors = new List<object>();
            List<object> directXSs = new List<object>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                user = User.FromAccount(cn, account);

                Member member = OrgSvr.TryGetMemberFromAccount(cn, account);
                if (member != null)
                {
                    defaultPosition = new
                    {
                        parentouName = member.GetParentOU(cn).Name,
                        oufullName = member.GetParentOU(cn).GetFriendlyFullName(cn),
                        LeaderTitle = member.LeaderTitle,
                        Level = member.Level
                    };
                }

                MemberCollection positions = OrgSvr.GetUserPositions(cn, account);
                foreach (Member member1 in positions)
                {
                    supervisors.AddRange(OrgManager.GetSupervisors(cn, member1.FullName, false));
                    directXSs.AddRange(OrgManager.GetDirectXSs(cn, member1.FullName, false));
                }
            }

            return new
            {
                user = user,
                position = defaultPosition,
                supervisors = supervisors,
                directxss = directXSs
            };
        }

        public virtual void CheckUser(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool addtoRecently = request.GetBool("addtoRecently", true);
            int count = request.GetInt32("Count", 0);
            List<string> uids = new List<string>();
            List<string> members = new List<string>();
            for (int i = 0; i < count; i++)
            {
                string uid = request.GetString("uid" + i.ToString());
                uids.Add(uid);

                string memberfullname = request.GetString("member" + i.ToString(), null);
                members.Add(memberfullname);
            }

            List<string> errUsers = new List<string>();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string uid in uids)
                {
                    User user = User.TryGetUser(cn, uid);
                    if (user == null)
                        continue;

                    if (user.Disabled)
                        errUsers.Add(user.FriendlyName);
                }
            }

            if (errUsers.Count != 0)
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Contains_DisabledUser, String.Join(";", errUsers.ToArray())));

            IYZDbProvider provider = YZDbProviderManager.DefaultProvider;
            using (IDbConnection cn = provider.OpenConnection())
            {
                string uid = YZAuthHelper.LoginUserAccount;
                for (int i = 0; i < members.Count; i++)
                {
                    string account = uids[i];
                    string memberFullName = members[i];

                    if (String.IsNullOrEmpty(memberFullName))
                        continue;

                    OrgManager.AddRecentlyUser(cn, uid, account, memberFullName);
                }
            }
        }

        public virtual bool HasHeadshot(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            string userPath = this.GetUserPath(context, uid);
            string imagePath = Path.Combine(userPath, "Headshot", "Headshot.png");

            return File.Exists(imagePath);
        }

        public virtual bool HasSign(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            string userPath = this.GetUserPath(context, uid);
            string imagePath = Path.Combine(userPath, "Sign", "Sign.png");

            return File.Exists(imagePath);
        }

        public virtual void SaveHeadshot(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int x = Convert.ToInt32(Math.Floor(request.GetDecimal("x")));
            int y = Convert.ToInt32(Math.Floor(request.GetDecimal("y")));
            int width = Convert.ToInt32(Math.Floor(request.GetDecimal("width")));
            int height = Convert.ToInt32(Math.Floor(request.GetDecimal("height")));
            int rotate = Convert.ToInt32(Math.Floor(request.GetDecimal("rotate")));
            string uid = request.GetString("uid", YZAuthHelper.LoginUserAccount);
            string fileid = request.GetString("fileid","");

            if (!String.IsNullOrEmpty(fileid))
            {
                AttachmentInfo attachment;
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        attachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, fileid);
                    }
                }

                string userPath = this.GetUserPath(context, uid);
                string saveFile = Path.Combine(userPath, "Headshot", "Headshot.png");
                string savePath = Path.GetDirectoryName(saveFile);

                this.EmptyFolder(savePath);
                Directory.CreateDirectory(savePath);

                using (Image srcImage = Image.FromFile(attachment.FileInfo.FullName))
                {
                    srcImage.Save(saveFile, ImageFormat.Png);

                    switch (rotate)
                    {
                        case 90:
                        case -270:
                            srcImage.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;
                        case 180:
                        case -180:
                            srcImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        case 270:
                        case -90:
                            srcImage.RotateFlip(RotateFlipType.Rotate270FlipNone);
                            break;
                    }

                    using (Image clipImage = YZImageHelper.ClipImage(new Bitmap(srcImage), new Rectangle(x, y, width, height)))
                    {
                        this.MakeThumbnail(clipImage, saveFile, new Mode("S", ScaleMode.Fit, 48, 48, System.Drawing.Imaging.ImageFormat.Png));
                        this.MakeThumbnail(clipImage, saveFile, new Mode("M", ScaleMode.Fit, 98, 98, System.Drawing.Imaging.ImageFormat.Png));
                        this.MakeThumbnail(clipImage, saveFile, new Mode("L", ScaleMode.Fit, 182, 182, System.Drawing.Imaging.ImageFormat.Png));
                    }
                }
            }
            else
            {
                string userPath = this.GetUserPath(context, uid);
                string saveFile = Path.Combine(userPath, "Headshot", "Headshot.png");

                using (Image srcImage = Image.FromFile(saveFile))
                {
                    switch (rotate)
                    {
                        case 90:
                        case -270:
                            srcImage.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;
                        case 180:
                        case -180:
                            srcImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        case 270:
                        case -90:
                            srcImage.RotateFlip(RotateFlipType.Rotate270FlipNone);
                            break;
                    }

                    using (Image clipImage = YZImageHelper.ClipImage(new Bitmap(srcImage), new Rectangle(x, y, width, height)))
                    {
                        this.MakeThumbnail(clipImage, saveFile, new Mode("S", ScaleMode.Fit, 48, 48, System.Drawing.Imaging.ImageFormat.Png));
                        this.MakeThumbnail(clipImage, saveFile, new Mode("M", ScaleMode.Fit, 98, 98, System.Drawing.Imaging.ImageFormat.Png));
                        this.MakeThumbnail(clipImage, saveFile, new Mode("L", ScaleMode.Fit, 182, 182, System.Drawing.Imaging.ImageFormat.Png));
                    }
                }
            }
        }

        public virtual void SaveSign(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int x = Convert.ToInt32(Math.Floor(request.GetDecimal("x")));
            int y = Convert.ToInt32(Math.Floor(request.GetDecimal("y")));
            int width = Convert.ToInt32(Math.Floor(request.GetDecimal("width")));
            int height = Convert.ToInt32(Math.Floor(request.GetDecimal("height")));
            int rotate = Convert.ToInt32(Math.Floor(request.GetDecimal("rotate")));
            string uid = request.GetString("uid", YZAuthHelper.LoginUserAccount);
            string fileid = request.GetString("fileid", "");

            if (!String.IsNullOrEmpty(fileid))
            {
                AttachmentInfo attachment;
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        attachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, fileid);
                    }
                }

                string userPath = this.GetUserPath(context, uid);
                string saveFile = Path.Combine(userPath, "Sign", "Sign.png");
                string savePath = Path.GetDirectoryName(saveFile);

                this.EmptyFolder(savePath);
                Directory.CreateDirectory(savePath);

                using (Image srcImage = Image.FromFile(attachment.FileInfo.FullName))
                {
                    srcImage.Save(saveFile, ImageFormat.Png);

                    switch (rotate)
                    {
                        case 90:
                        case -270:
                            srcImage.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;
                        case 180:
                        case -180:
                            srcImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        case 270:
                        case -90:
                            srcImage.RotateFlip(RotateFlipType.Rotate270FlipNone);
                            break;
                    }

                    using (Image clipImage = YZImageHelper.ClipImage(new Bitmap(srcImage), new Rectangle(x, y, width, height)))
                    {
                        this.MakeThumbnail(clipImage, saveFile, new Mode("S", ScaleMode.Fit, 120, 53, System.Drawing.Imaging.ImageFormat.Png));
                        this.MakeThumbnail(clipImage, saveFile, new Mode("M", ScaleMode.Fit, 180, 80, System.Drawing.Imaging.ImageFormat.Png));
                    }
                }
            }
            else
            {
                string userPath = this.GetUserPath(context, uid);
                string saveFile = Path.Combine(userPath, "Sign", "Sign.png");

                using (Image srcImage = Image.FromFile(saveFile))
                {
                    switch (rotate)
                    {
                        case 90:
                        case -270:
                            srcImage.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;
                        case 180:
                        case -180:
                            srcImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        case 270:
                        case -90:
                            srcImage.RotateFlip(RotateFlipType.Rotate270FlipNone);
                            break;
                    }

                    using (Image clipImage = YZImageHelper.ClipImage(new Bitmap(srcImage), new Rectangle(x, y, width, height)))
                    {
                        this.MakeThumbnail(clipImage, saveFile, new Mode("S", ScaleMode.Fit, 180, 80, System.Drawing.Imaging.ImageFormat.Png));
                        this.MakeThumbnail(clipImage, saveFile, new Mode("M", ScaleMode.Fit, 120, 53, System.Drawing.Imaging.ImageFormat.Png));
                    }
                }
            }
        }
    }
}